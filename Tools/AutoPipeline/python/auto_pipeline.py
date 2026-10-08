# -*- coding: utf-8 -*-
"""
AutoPipeline - Python port of auto_pipeline_standalone.bat (same configs, same options, same steps)

  [jar] Deploy JAVA engine -> [1] Source (git) | [1] Package (prebuilt zip) -> [2] Framework copy
  -> [3] Nexacro deploy (Java CLI) -> [4] Tomcat publish -> [5] Chrome -> [6] TestPro

Usage:
  auto_pipeline.exe [v21|v24|all] [-Branch <name>] [-SourceType git|package] [-Build <folder>]
                    [-UpdateJar] [-SkipGit] [-OnlyIfChanged] [-OpenBrowser|-NoBrowser] [-DevTools]
                    [-Home <config folder>] [-Help]

Config folder (holds pipeline_v21.txt / pipeline_v24.txt; logs\\ and work\\ are created there):
  -Home > environment variable PIPELINE_HOME > folder of the exe > DEFAULT_HOME
  (the first one that contains pipeline_v21.txt or pipeline_v24.txt)

Standard library only, so it compiles with Nuitka without extra packages.
"""
import datetime
import json
import os
import re
import shutil
import socket
import stat
import subprocess
import sys
import tempfile
import time
import urllib.parse
import urllib.request
import zipfile

DEFAULT_HOME = r'D:\git\cursor_project\Tools\AutoPipeline'

# Deploy JAVA package server (same source as Tools\update_jar.ps1)
JAR_SERVER = 'http://59.10.169.82:9900'
JAR_BASE = JAR_SERVER + '/NexacroN/serverN/Deploy_JAVA/%EB%B6%84%EB%A6%AC_Jar/'

TARGETS = ('v21', 'v24')
PROTECTED_APPS = ('root', 'manager', 'host-manager', 'docs', 'examples')
REQUIRED_KEYS = ('ExpectedVersion', 'SourceDir', 'Branch', 'ProjectPath', 'WorkDir',
                 'JarDir', 'TomcatHome', 'TomcatPort', 'WebContext')
# Relative values of these keys are resolved against the folder that holds the config file
PATH_KEYS = ('SourceDir', 'ProjectPath', 'WorkDir', 'JarDir', 'TomcatHome', 'JavaHome',
             'ChromePath', 'PackageRoot', 'PackagePath',
             'JebiExePath', 'TestScenarioFile', 'TestParallelManifest',
             'TestOutputDir', 'TestVarsFile', 'TestSourceFile')
DEFAULT_CHROME = r'C:\Program Files\Google\Chrome\Application\chrome.exe'
CREATE_NO_WINDOW = 0x08000000


class PipelineError(Exception):
    pass


class Unchanged(Exception):
    """Raised inside a step when nothing changed since the last success (-OnlyIfChanged)."""


# ============================================================
# Output: console + log file (replaces Start-Transcript)
# ============================================================

_log_fp = None


def log(msg=''):
    line = str(msg)
    print(line, flush=True)
    if _log_fp:
        _log_fp.write(line + '\n')
        _log_fp.flush()


def decode(raw):
    """git prints UTF-8, the Nexacro deploy CLI prints the console code page (CP949)."""
    for enc in ('utf-8', 'cp949'):
        try:
            return raw.decode(enc)
        except UnicodeDecodeError:
            pass
    return raw.decode('utf-8', 'replace')


# ============================================================
# Helpers
# ============================================================

class Config(dict):
    """Case-insensitive keys, like the PowerShell hashtable it replaces."""

    def __setitem__(self, key, value):
        super().__setitem__(key.lower(), value)

    def __getitem__(self, key):
        return super().__getitem__(key.lower())

    def get(self, key, default=None):
        return super().get(key.lower(), default)


def read_config(path):
    if not os.path.isfile(path):
        raise PipelineError(f'Config not found: {path}')
    cfg = Config()
    cfg['Flags'] = []
    with open(path, encoding='utf-8-sig', errors='replace') as f:
        for line in f:
            t = line.strip()
            if not t or t.startswith('#'):
                continue
            if t.startswith('-'):
                cfg['Flags'].append(t.upper())
                continue
            i = t.find('=')
            if i < 1:
                continue
            cfg[t[:i].strip()] = t[i + 1:].strip().rstrip('\\')
    base = os.path.dirname(os.path.abspath(path))
    for key in PATH_KEYS:
        v = cfg.get(key)
        if v and not os.path.isabs(v):
            cfg[key] = os.path.abspath(os.path.join(base, v))
    missing = [k for k in REQUIRED_KEYS if not cfg.get(k)]
    if missing:
        raise PipelineError(f'Missing keys in {path}: {", ".join(missing)}')
    return cfg


def is_enabled(cfg):
    """Enabled=N|NO|FALSE|0 turns a target off. Missing / empty / anything else = on."""
    return (cfg.get('Enabled') or '').strip().upper() not in ('N', 'NO', 'FALSE', '0')


def is_yes(value):
    return (value or '').strip().upper() in ('Y', 'YES', 'TRUE', '1')


def lp(path):
    """Long path (>260 chars) safe form for file APIs (deep git sources / deploy output)."""
    p = os.path.abspath(path)
    if os.name != 'nt' or p.startswith('\\\\?\\'):
        return p
    return '\\\\?\\UNC\\' + p[2:] if p.startswith('\\\\') else '\\\\?\\' + p


def assert_under(path, root):
    """Refuse to modify anything outside an allowed root."""
    p = os.path.normcase(os.path.abspath(path)).rstrip('\\')
    r = os.path.normcase(os.path.abspath(root)).rstrip('\\')
    if not p.startswith(r + '\\'):
        raise PipelineError(f"Refusing to modify '{os.path.abspath(path)}' (outside '{os.path.abspath(root)}')")


def _force_remove(func, path):
    os.chmod(path, stat.S_IWRITE)
    func(path)


def remove_tree(path):
    if not os.path.lexists(lp(path)):
        return
    if sys.version_info >= (3, 12):
        shutil.rmtree(lp(path), onexc=lambda f, p, e: _force_remove(f, p))
    else:
        shutil.rmtree(lp(path), onerror=lambda f, p, e: _force_remove(f, p))
    if os.path.lexists(lp(path)):
        raise PipelineError(f'Could not delete: {path}')


def reset_dir(path, root):
    assert_under(path, root)
    remove_tree(path)
    os.makedirs(lp(path), exist_ok=True)


def copy_tree(src, dst):
    """Merge copy (robocopy /E equivalent)."""
    if not os.path.exists(lp(src)):
        raise PipelineError(f'Copy source not found: {src}')
    shutil.copytree(lp(src), lp(dst), dirs_exist_ok=True)


def count_files(path):
    return sum(len(files) for _, _, files in os.walk(lp(path)))


def run(cmd, cwd=None):
    """Run a native exe, stream its output to console + log, return the exit code."""
    log('  [CMD] ' + ' '.join(cmd))
    try:
        p = subprocess.Popen(cmd, cwd=cwd, stdout=subprocess.PIPE, stderr=subprocess.STDOUT,
                             stdin=subprocess.DEVNULL)
    except FileNotFoundError:
        raise PipelineError(f'Executable not found: {cmd[0]}')
    for raw in p.stdout:
        log('    ' + decode(raw).rstrip('\r\n'))
    return p.wait()


def capture(cmd, cwd=None):
    """Run a native exe and return (exit code, output lines) without echoing."""
    try:
        r = subprocess.run(cmd, cwd=cwd, stdout=subprocess.PIPE, stderr=subprocess.STDOUT,
                           stdin=subprocess.DEVNULL)
    except FileNotFoundError:
        raise PipelineError(f'Executable not found: {cmd[0]}')
    return r.returncode, [decode(line).rstrip('\r') for line in r.stdout.splitlines()]


def git_out(src, *args):
    code, lines = capture(['git', '-C', src, *args])
    if code != 0:
        raise PipelineError(f'git {" ".join(args)} failed: {" ".join(lines)}')
    return '\n'.join(lines).strip()


def get_nexacro_version(json_file):
    if not os.path.isfile(json_file):
        return ''
    with open(json_file, encoding='utf-8-sig', errors='replace') as f:
        m = re.search(r'"version"\s*:\s*"([^"]+)"', f.read())
    return m.group(1) if m else ''


def convert_js_to_utf8_bom(folder):
    count = 0
    for d, _, files in os.walk(lp(folder)):
        for name in files:
            if not name.lower().endswith('.js'):
                continue
            path = os.path.join(d, name)
            with open(path, 'rb') as f:
                data = f.read()
            if data.startswith(b'\xef\xbb\xbf'):
                continue
            text = data.decode('utf-8', 'replace')
            with open(path, 'wb') as f:
                f.write(b'\xef\xbb\xbf' + text.encode('utf-8'))
            count += 1
    return count


def find_start_bat(jar_dir):
    if not os.path.isdir(jar_dir):
        return None
    for d, _, files in os.walk(jar_dir):
        for name in files:
            if name.lower() == 'start.bat':
                return os.path.join(d, name)
    return None


def http_get(url, timeout=30):
    with urllib.request.urlopen(url, timeout=timeout) as r:
        return r.read().decode('utf-8', 'replace')


def get_latest_jar_package():
    """Newest year folder, then the name-descending first zip/jar."""
    page = http_get(JAR_BASE)
    years = re.findall(r'href="[^"]+/(\d{4})/"', page, re.IGNORECASE)
    if not years:
        raise PipelineError(f'No year folders found at {JAR_BASE}')
    year = sorted(years, reverse=True)[0]
    year_page = http_get(f'{JAR_BASE}{year}/')
    hrefs = [m.group(1) for m in re.finditer(r'href="([^"]+\.(zip|jar))"', year_page, re.IGNORECASE)]
    if not hrefs:
        raise PipelineError(f'No zip/jar files found at {JAR_BASE}{year}/')
    href = sorted(hrefs, reverse=True)[0]
    return urllib.parse.unquote(href.split('/')[-1]), JAR_SERVER + href


def update_deploy_jar(jar_dir, work_root):
    """Download into a staging folder, verify, then swap into JarDir. The old engine survives any failure."""
    marker = os.path.join(jar_dir, 'installed_package.txt')
    installed = ''
    if os.path.isfile(marker):
        with open(marker, encoding='utf-8-sig') as f:
            installed = f.read().strip()

    name, url = get_latest_jar_package()
    log(f'  Server latest : {name}')
    log(f'  Installed     : {installed or "(none)"}')
    if find_start_bat(jar_dir) and installed == name:
        log('  [SKIP] Already up to date')
        return f'{name} (up to date)'

    staging = os.path.join(os.path.dirname(jar_dir), 'jar_staging')
    reset_dir(staging, work_root)
    zip_path = os.path.join(staging, 'download.zip')
    level1 = os.path.join(staging, 'level1')
    pkg_dir = os.path.join(staging, 'pkg')

    log(f'  Downloading   : {url}')
    urllib.request.urlretrieve(url, zip_path)
    with zipfile.ZipFile(zip_path) as z:
        z.extractall(lp(level1))
    os.remove(zip_path)

    # Packages are often double-zipped: extract nested zips, keep the other files (.json etc.)
    os.makedirs(pkg_dir, exist_ok=True)
    for entry in os.listdir(level1):
        src = os.path.join(level1, entry)
        if entry.lower().endswith('.zip') and os.path.isfile(src):
            log(f'  Extracting    : {entry}')
            with zipfile.ZipFile(src) as z:
                z.extractall(lp(pkg_dir))
        else:
            shutil.move(src, os.path.join(pkg_dir, entry))

    if not find_start_bat(pkg_dir):
        raise PipelineError(f'Downloaded package has no start.bat: {name}')

    reset_dir(jar_dir, work_root)
    for entry in os.listdir(pkg_dir):
        shutil.move(os.path.join(pkg_dir, entry), os.path.join(jar_dir, entry))
    with open(marker, 'w', encoding='utf-8') as f:
        f.write(name + '\n')
    remove_tree(staging)
    log(f'  Installed -> {jar_dir}')
    return f'{name} (updated)'


def get_latest_build(folder):
    """Newest build folder. Names look like 2026.9.21.1(24.0.0.1130): compare date + sequence as numbers
    (a string sort would put 2026.9.3 after 2026.9.21). Other names fall back to the modified time."""
    dirs = [e for e in os.scandir(folder) if e.is_dir()]
    if not dirs:
        raise PipelineError(f'No build folders in {folder}')

    def key(e):
        m = re.match(r'^(\d{4})\.(\d+)\.(\d+)\.(\d+)', e.name)
        num = int(f'{int(m.group(1)):04d}{int(m.group(2)):02d}{int(m.group(3)):02d}{int(m.group(4)):04d}') if m else 0
        return num, e.stat().st_mtime

    return max(dirs, key=key).name


def get_local_ipv4():
    """IPv4 of the interface on the default route (skips loopback / 169.254.x). No packet is sent."""
    try:
        with socket.socket(socket.AF_INET, socket.SOCK_DGRAM) as s:
            s.connect(('8.8.8.8', 80))
            ip = s.getsockname()[0]
        if ip and not ip.startswith(('127.', '169.254.')):
            return ip
    except OSError:
        pass
    try:
        for ip in socket.gethostbyname_ex(socket.gethostname())[2]:
            if not ip.startswith(('127.', '169.254.')):
                return ip
    except OSError:
        pass
    return 'localhost'


def test_port(port):
    try:
        with socket.create_connection(('127.0.0.1', port), timeout=1):
            return True
    except OSError:
        return False


_no_proxy = urllib.request.build_opener(urllib.request.ProxyHandler({}))


def wait_url(url, timeout_sec):
    deadline = time.time() + timeout_sec
    while time.time() < deadline:
        try:
            with _no_proxy.open(url, timeout=5) as r:
                if r.status == 200:
                    return True
        except OSError:
            pass
        time.sleep(2)
    return False


def step(ctx, name, body, when=True):
    """when=False skips the step entirely (no header, no timing)."""
    if not when:
        return
    log('')
    log(f"---- [{ctx['Target']}] {name} ----")
    t0 = time.time()
    try:
        body()
    except Unchanged:
        ctx['Steps'].append(f'{name} {round(time.time() - t0, 1)}s')
        raise
    sec = round(time.time() - t0, 1)
    ctx['Steps'].append(f'{name} {sec}s')
    log(f'  [DONE] {name} ({sec}s)')


# ============================================================
# Pipeline for one target
# ============================================================

def invoke_target(ctx, opt, root):
    cfg_path = os.path.join(root, f"pipeline_{ctx['Target']}.txt")
    cfg = read_config(cfg_path)

    if not is_enabled(cfg):
        log('')
        log(f"---- [{ctx['Target']}] [SKIP] Enabled=N in {cfg_path} ----")
        ctx['Status'] = 'DISABLED'
        return

    # Branch: -Branch (this run only) wins over Branch= in config.
    # SourceDir may contain {Branch}; '/' in a branch becomes a sub folder (RELEASE/x -> RELEASE\x).
    if opt['Branch']:
        cfg['Branch'] = opt['Branch']
    ctx['Branch'] = cfg['Branch']
    cfg['SourceDir'] = cfg['SourceDir'].replace('{Branch}', cfg['Branch'].replace('/', '\\'))

    # Source type: -SourceType (this run only) wins over SourceType= in config. Default git.
    src_type = (opt['SourceType'] or cfg.get('SourceType') or 'git').lower()
    if src_type not in ('git', 'package'):
        raise PipelineError(f"SourceType must be git or package (got '{src_type}')")
    ctx['SourceType'] = src_type

    # Project name = .xprj file name (e.g. TC_NexaV21). Usable as {Project} in WebContext / PublishSubDir.
    project = os.path.splitext(os.path.basename(cfg['ProjectPath']))[0]

    # Chrome: command line switch wins, otherwise OpenBrowser=Y|N in config (default N)
    open_browser = False if opt['NoBrowser'] else True if opt['OpenBrowser'] else is_yes(cfg.get('OpenBrowser'))

    work = cfg['WorkDir']
    lib_root = os.path.join(work, 'nexacrolib')
    lib_dir = os.path.join(lib_root, 'nexacrolib')
    gen_dir = os.path.join(lib_root, 'generate')
    out_dir = os.path.join(work, 'output', project)
    deploy_dir = os.path.join(work, 'deploy')

    # Last success marker per source type + branch (-OnlyIfChanged): git = commit hash, package = zip path|size|time
    hash_key = re.sub(r'[\\/:*?"<>|]', '_', cfg['Branch'])
    hash_file = os.path.join(work, f'last_success_package_{hash_key}.txt' if src_type == 'package'
                             else f'last_success_hash_{hash_key}.txt')

    # Publish target: webapps\<WebContext>[\<PublishSubDir>]
    webapps = os.path.join(cfg['TomcatHome'], 'webapps')
    web_context = cfg['WebContext'].replace('{Project}', project).strip('\\/')
    sub_dir = (cfg.get('PublishSubDir') or '').replace('{Project}', project).strip('\\/')
    pub_dir = os.path.join(webapps, web_context, sub_dir) if sub_dir else os.path.join(webapps, web_context)
    url_path = '/'.join(p for p in ((web_context if web_context.upper() != 'ROOT' else ''), sub_dir) if p).replace('\\', '/')
    os.makedirs(work, exist_ok=True)

    env = {}  # values found in [0] and used by later steps

    def read_last():
        if os.path.isfile(hash_file):
            with open(hash_file, encoding='utf-8-sig') as f:
                return f.read().strip()
        return ''

    # ---- [0] Preflight ----
    def preflight():
        # SourceDir is checked in [1]: it may not exist yet (cloned from RepoUrl)
        for p in (cfg['ProjectPath'], cfg['TomcatHome']):
            if not os.path.exists(p):
                raise PipelineError(f'Path not found: {p}')
        # The publish folder is deleted before copying, so it must be inside webapps
        # and must not be a whole Tomcat built-in app (a sub folder inside one is fine).
        assert_under(pub_dir, webapps)
        if not sub_dir and web_context.lower() in PROTECTED_APPS:
            raise PipelineError(f"Refusing to replace Tomcat built-in app '{web_context}'. Set PublishSubDir or another WebContext.")

        java_home = cfg.get('JavaHome') or os.environ.get('JAVA_HOME', '')
        env['java_home'] = java_home
        env['java'] = os.path.join(java_home, 'bin', 'java.exe')
        if not os.path.isfile(env['java']):
            raise PipelineError(f"java.exe not found: {env['java']}")

        start_bat = find_start_bat(cfg['JarDir'])
        if not start_bat:
            raise PipelineError(f"start.bat not found under {cfg['JarDir']}. Run with -UpdateJar.")
        env['jar_root'] = os.path.dirname(os.path.dirname(start_bat))

        env['chrome'] = cfg.get('ChromePath') or DEFAULT_CHROME
        if open_browser and not os.path.isfile(env['chrome']):
            raise PipelineError(f"Chrome not found: {env['chrome']}")

        # URL host: ServerHost in config, or auto-detected local IPv4 when empty / 'auto'
        host = cfg.get('ServerHost') or ''
        env['host'] = host if host and host.lower() != 'auto' else get_local_ipv4()

        log(f"  Type    : {src_type}{' (-SourceType)' if opt['SourceType'] else ''}")
        if src_type == 'git':
            log(f"  Source  : {cfg['SourceDir']} ({cfg['Branch']}{', -Branch' if opt['Branch'] else ''})")
            log(f"  Repo    : {cfg.get('RepoUrl') or '(RepoUrl not set: existing SourceDir only)'}")
        elif cfg.get('PackagePath'):
            log(f"  Package : {cfg['PackagePath']} (PackagePath)")
        else:
            build = f"{opt['Build']} (-Build)" if opt['Build'] else (cfg.get('PackageBuild') or 'latest')
            log(f"  Package : {cfg.get('PackageRoot')}\\{cfg['Branch'].split('/')[-1]}\\{build}")
        log(f"  Project : {cfg['ProjectPath']} ({project})")
        log(f'  Output  : {out_dir}')
        log(f"  JAVA    : {env['java']}")
        log(f"  Jar     : {env['jar_root']}")
        log(f'  Publish : {pub_dir}')
        log(f"  Host    : {env['host']}")
        log(f"  Browser : {'open Chrome' if open_browser else 'off'}")

    # ---- [1] Package (SourceType=package): prebuilt nexacrolib.zip = nexacrolib\ + generate\ ----
    #      Replaces [1] Source and [2] Framework copy. No UTF-8 BOM conversion (already built).
    def package():
        zip_name = cfg.get('PackageZip') or 'nexacrolib.zip'

        # 1-a Locate the zip: PackagePath (zip or build folder) > PackageRoot\<branch folder>\<build>\<zip>
        if cfg.get('PackagePath'):
            if opt['Build']:
                log('  [WARN] -Build ignored: PackagePath is set')
            pp = cfg['PackagePath']
            zip_src = pp if pp.lower().endswith('.zip') else os.path.join(pp, zip_name)
        else:
            if not cfg.get('PackageRoot'):
                raise PipelineError('SourceType=package needs PackageRoot or PackagePath in the config')
            # Package folders use the last part of the branch (RELEASE/REL_x -> REL_x)
            br_dir = os.path.join(cfg['PackageRoot'], cfg['Branch'].split('/')[-1])
            if not os.path.isdir(br_dir):
                raise PipelineError(f'Package branch folder not found: {br_dir}')
            pb = cfg.get('PackageBuild')
            build_name = opt['Build'] or (pb if pb and pb.lower() != 'latest' else get_latest_build(br_dir))
            zip_src = os.path.join(br_dir, build_name, zip_name)
        if not os.path.isfile(zip_src):
            raise PipelineError(f'Package zip not found: {zip_src}')
        st = os.stat(zip_src)
        pkg_id = f'{zip_src}|{st.st_size}|{int(st.st_mtime)}'
        log(f'  Zip     : {zip_src}')
        log(f'  Size    : {st.st_size / 1048576:.1f} MB, {datetime.datetime.fromtimestamp(st.st_mtime):%Y-%m-%d %H:%M:%S}')

        # 1-b -OnlyIfChanged: same zip (path + size + time) as the last success
        if opt['OnlyIfChanged'] and read_last() == pkg_id:
            log('  [SKIP] Same package as last success')
            raise Unchanged()

        # 1-c Copy to a local cache first (do not extract over the share); skip when already cached
        cache_dir = os.path.join(work, 'package')
        cache_zip = os.path.join(cache_dir, os.path.basename(zip_src))
        if (os.path.isfile(cache_zip) and os.path.getsize(cache_zip) == st.st_size
                and int(os.path.getmtime(cache_zip)) == int(st.st_mtime)):
            log(f'  [SKIP] Already cached: {cache_zip}')
        else:
            os.makedirs(cache_dir, exist_ok=True)
            shutil.copy2(zip_src, cache_zip)
            log(f'  Copied  -> {cache_zip}')

        # 1-d Extract into work\<target>\nexacrolib (the zip root holds nexacrolib\ and generate\)
        reset_dir(lib_root, work)
        with zipfile.ZipFile(cache_zip) as z:
            z.extractall(lp(lib_root))

        # 1-e Layout + version check
        for need in (os.path.join('nexacrolib', 'nexacrolib.json'), 'generate'):
            if not os.path.exists(os.path.join(lib_root, need)):
                raise PipelineError(f"Unexpected package layout, missing '{need}' in {zip_src}")
        ver = get_nexacro_version(os.path.join(lib_dir, 'nexacrolib.json'))
        if not ver:
            raise PipelineError('Could not read version from nexacrolib.json in the package')
        if ver[:2] != cfg['ExpectedVersion']:
            raise PipelineError(f"Version mismatch: package={ver}, ExpectedVersion={cfg['ExpectedVersion']}. Wrong PackageRoot/branch?")
        ctx['Version'] = ver
        ctx['Package'] = zip_src
        ctx['PackageId'] = pkg_id
        log(f'  Version : {ver}')
        log(f'  Extracted -> {lib_root} (nexacrolib + generate)')

    # ---- [1] Source: clone when SourceDir is missing, otherwise update ----
    def source():
        src = cfg['SourceDir']
        br = cfg['Branch']
        is_repo = os.path.isdir(os.path.join(src, '.git'))

        if opt['SkipGit']:
            log('  [SKIP] -SkipGit')
            if not is_repo:
                raise PipelineError(f'-SkipGit needs an existing git repository: {src}')
        else:
            # 1-a A branch like RELEASE/REL_26.05.19.00_21.0.0.2100 must match ExpectedVersion (fail before a long clone).
            #     Only NN.0.0.N counts as a version (dates such as 26.05.19.00 / 22.11.01.01 do not).
            vm = re.findall(r'_(\d{2})\.0\.0\.\d+(?=_|$)', br)
            if vm and vm[-1] != cfg['ExpectedVersion']:
                raise PipelineError(f"Branch '{br}' is v{vm[-1]} but ExpectedVersion={cfg['ExpectedVersion']}")

            # 1-b Remote branch check (~1s); also gives the remote hash for -OnlyIfChanged
            url = cfg.get('RepoUrl')
            if not url:
                if not is_repo:
                    raise PipelineError(f'SourceDir not found and RepoUrl is not set: {src}')
                url = git_out(src, 'remote', 'get-url', 'origin')
            code, lines = capture(['git', 'ls-remote', '--heads', url, f'refs/heads/{br}'])
            if code != 0:
                raise PipelineError(f'git ls-remote failed: {" ".join(lines)}')
            line = next((l for l in lines if l.endswith(f'\trefs/heads/{br}')), None)
            if not line:
                raise PipelineError(f'Branch not found on remote: {br} ({url})')
            remote_hash = line.split('\t')[0].strip()
            log(f'  Remote : {br} @ {remote_hash}')

            if opt['OnlyIfChanged'] and read_last() == remote_hash:
                log(f'  [SKIP] No new commits since last success ({remote_hash})')
                raise Unchanged()

            # 1-c SourceDir state
            exists = os.path.exists(src)
            is_empty = exists and os.path.isdir(src) and not os.listdir(src)

            if not exists or is_empty:
                # Full single-branch clone (same as git_sourcecode.md) + Windows long path support
                drive = os.path.splitdrive(os.path.abspath(src))[0] + '\\'
                free_gb = shutil.disk_usage(drive).free // (1024 ** 3)
                need_gb = int(cfg.get('CloneMinFreeGB') or 40)
                if free_gb < need_gb:
                    raise PipelineError(f'Not enough disk space to clone: {free_gb}GB free on {drive} (need {need_gb}GB)')

                log(f'  SourceDir not found -> full clone ({free_gb} GB free on {drive}). The first clone can take tens of minutes.')
                os.makedirs(os.path.dirname(os.path.abspath(src)), exist_ok=True)
                code = run(['git', 'clone', '-c', 'core.longpaths=true', '-b', br, '--single-branch', url, src])
                if code != 0:
                    # Remove only what this run created (keep a folder that existed empty)
                    remove_tree(src)
                    if is_empty:
                        os.makedirs(src, exist_ok=True)
                    raise PipelineError(f'git clone failed (exit {code}): {br} -> {src}')
            elif not is_repo:
                raise PipelineError(f'SourceDir exists but is not a git repository (not touched): {src}')
            else:
                # Existing clone: must be the same repo and branch, then fast-forward only
                if cfg.get('RepoUrl'):
                    origin = git_out(src, 'remote', 'get-url', 'origin')
                    a = re.sub(r'\.git$', '', origin.rstrip('/')).lower()
                    b = re.sub(r'\.git$', '', cfg['RepoUrl'].rstrip('/')).lower()
                    if a != b:
                        raise PipelineError(f"SourceDir origin '{origin}' differs from RepoUrl '{cfg['RepoUrl']}'")
                lock = os.path.join(src, '.git', 'index.lock')
                if os.path.exists(lock):
                    raise PipelineError(f'index.lock exists (another or aborted git process): {lock}')
                cur = git_out(src, 'rev-parse', '--abbrev-ref', 'HEAD')
                if cur != br:
                    raise PipelineError(f"SourceDir is on branch '{cur}', expected '{br}'. "
                                        'Use SourceDir=...\\{Branch} so each branch has its own folder.')
                if git_out(src, 'status', '--porcelain'):
                    raise PipelineError(f'Source repo has local changes, aborting: {src}')

                if run(['git', '-C', src, 'fetch', 'origin', br]) != 0:
                    raise PipelineError('git fetch failed')
                if run(['git', '-C', src, 'pull', '--ff-only', 'origin', br]) != 0:
                    raise PipelineError('git pull failed')

        # 1-d Folders the pipeline reads
        for need in (r'Lib\FrameworkJS\nexacrolib.json', r'Tools\Lib\TiMetainfoLib\res'):
            if not os.path.exists(os.path.join(src, need)):
                raise PipelineError(f'Required path missing in source: {os.path.join(src, need)}')
        ctx['Hash'] = git_out(src, 'rev-parse', 'HEAD')
        ctx['Msg'] = git_out(src, 'log', '-1', '--format=%s')
        log(f"  Hash : {ctx['Hash']}")
        log(f"  Msg  : {ctx['Msg']}")

    # ---- [2] Build nexacrolib + generate rule ----
    def framework_copy():
        fw_src = os.path.join(cfg['SourceDir'], 'Lib', 'FrameworkJS')
        reset_dir(lib_root, work)
        os.makedirs(lib_dir, exist_ok=True)

        for sub in ('component', 'framework', 'resources'):
            s = os.path.join(fw_src, sub)
            if os.path.exists(s):
                copy_tree(s, os.path.join(lib_dir, sub))
            else:
                log(f'  [WARN] Not found, skipped: {s}')
        shutil.copy2(os.path.join(fw_src, 'nexacrolib.json'), lib_dir)

        ver = get_nexacro_version(os.path.join(lib_dir, 'nexacrolib.json'))
        if not ver:
            raise PipelineError('Could not read version from nexacrolib.json')
        if ver[:2] != cfg['ExpectedVersion']:
            raise PipelineError(f"Version mismatch: nexacrolib.json={ver}, ExpectedVersion={cfg['ExpectedVersion']}. Wrong branch/SourceDir?")
        ctx['Version'] = ver
        log(f'  Version : {ver}')

        n = convert_js_to_utf8_bom(lib_dir)
        log(f'  UTF-8 BOM converted: {n} file(s)')

        os.makedirs(gen_dir, exist_ok=True)
        copy_tree(os.path.join(cfg['SourceDir'], r'Tools\Lib\TiMetainfoLib\res'), gen_dir)
        if cfg['ExpectedVersion'] == '24':
            copy_tree(os.path.join(cfg['SourceDir'], r'Tools\Lib\TiGenerateLib\Template\24'), gen_dir)
        log(f'  Generate rule ready: {gen_dir}')

    # ---- [3] Nexacro deploy (Java CLI) ----
    def deploy():
        reset_dir(out_dir, work)
        reset_dir(deploy_dir, work)
        rule = '-CSSRULE' if cfg['ExpectedVersion'] == '21' else '-GENERATERULE'
        jar_root = env['jar_root']
        java_args = [
            env['java'],
            '-Dlog4j.configurationFile=' + os.path.join(jar_root, 'log4j2.xml'),
            '-classpath', os.path.join(jar_root, 'libs', '*'),
            'com.nexacro.build.cli.Main',
            '-P', cfg['ProjectPath'],
            '-B', lib_dir,
            '-O', out_dir,
            rule, gen_dir,
            '-D', deploy_dir,
        ] + cfg['Flags']
        code = run(java_args, cwd=jar_root)
        if code != 0:
            raise PipelineError(f'Deploy failed (exit {code})')
        files = count_files(deploy_dir)
        if files == 0:
            raise PipelineError(f'Deploy produced no files in {deploy_dir}')
        log(f'  Deployed files: {files}')

    # ---- [4] Publish to Tomcat ----
    def publish():
        port = int(cfg['TomcatPort'])
        if not test_port(port):
            log(f'  Tomcat not listening on {port}. Starting...')
            tenv = dict(os.environ, CATALINA_HOME=cfg['TomcatHome'], JAVA_HOME=env['java_home'])
            bin_dir = os.path.join(cfg['TomcatHome'], 'bin')
            subprocess.Popen(['cmd', '/c', os.path.join(bin_dir, 'catalina.bat'), 'start'], cwd=bin_dir, env=tenv,
                             stdin=subprocess.DEVNULL, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL,
                             creationflags=CREATE_NO_WINDOW)
            deadline = time.time() + 60
            while not test_port(port) and time.time() < deadline:
                time.sleep(2)
            if not test_port(port):
                raise PipelineError(f'Tomcat did not start on port {port}')
        log(f'  Tomcat listening on {port}')

        # Same-name folder already on the server: delete it, then copy fresh
        if os.path.exists(pub_dir):
            log(f'  Existing folder found, deleting ({count_files(pub_dir)} file(s)): {pub_dir}')
            remove_tree(pub_dir)
        copy_tree(deploy_dir, pub_dir)
        log(f'  Copied -> {pub_dir}')

        page = cfg.get('StartPage') or ''
        if not page:
            if os.path.isfile(os.path.join(deploy_dir, 'index.html')):
                page = 'index.html'
            else:
                html = sorted(n for n in os.listdir(deploy_dir) if n.lower().endswith('.html'))
                page = html[0] if html else ''
        if not page:
            log('  [WARN] No start html found in deploy root. Opening context root.')

        ctx['Url'] = f"http://{env['host']}:{port}/" + '/'.join(p for p in (url_path, page) if p)
        if not page and url_path:
            ctx['Url'] += '/'
        if not wait_url(ctx['Url'], 60):
            raise PipelineError(f"URL not ready within 60s: {ctx['Url']}")
        log(f"  Ready: {ctx['Url']}")

    # ---- [5] Open Chrome ----
    def chrome():
        if not open_browser:
            log('  [SKIP] Browser off (OpenBrowser=N or -NoBrowser)')
            return
        args = [env['chrome'], '--user-data-dir=' + os.path.join(work, 'chrome_profile'),
                '--no-first-run', '--no-default-browser-check', '--disk-cache-size=1', '--new-window']
        if opt['DevTools']:
            args.append('--auto-open-devtools-for-tabs')
        args.append(ctx['Url'])
        subprocess.Popen(args, stdin=subprocess.DEVNULL, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        log(f"  Opened: {ctx['Url']}")

    # ---- [6] TestPro: JEBI_Main.exe CLI ----
    def testpro():
        # [6-0] Preflight
        jebi = cfg.get('JebiExePath') or ''
        if not jebi:
            raise PipelineError('JebiExePath is not set in pipeline config')
        if not os.path.isfile(jebi):
            raise PipelineError(f'JEBI_Main.exe not found: {jebi}')
        mode = (cfg.get('TestMode') or 'scenario').lower()
        if mode not in ('scenario', 'file', 'parallel'):
            raise PipelineError(f"TestMode must be scenario|file|parallel (got '{mode}')")
        tc_files = []
        if mode == 'scenario':
            scm = cfg.get('TestScenarioFile') or ''
            if not scm:
                raise PipelineError('TestScenarioFile is required when TestMode=scenario')
            if not os.path.isfile(scm):
                raise PipelineError(f'TestScenarioFile not found: {scm}')
        elif mode == 'file':
            cfg_base = os.path.dirname(os.path.abspath(cfg_path))
            for raw in (cfg.get('TestTCFiles') or '').split('|'):
                tc = raw.strip()
                if not tc:
                    continue
                if not os.path.isabs(tc):
                    tc = os.path.abspath(os.path.join(cfg_base, tc))
                tc_files.append(tc)
            if not tc_files:
                raise PipelineError('TestTCFiles must list at least one TC file when TestMode=file')
            for tc in tc_files:
                if not os.path.isfile(tc):
                    raise PipelineError(f'TC file not found: {tc}')
        else:
            pm = cfg.get('TestParallelManifest') or ''
            if not pm:
                raise PipelineError('TestParallelManifest is required when TestMode=parallel')
            if not os.path.isfile(pm):
                raise PipelineError(f'TestParallelManifest not found: {pm}')
        # dummy.json: -s/--source is required by JEBI CLI in scenario/file modes
        src_file = cfg.get('TestSourceFile') or ''
        if not (src_file and os.path.isfile(src_file)):
            dummy = os.path.join(work, 'dummy.json')
            with open(dummy, 'w', encoding='utf-8') as fp:
                fp.write('{}')
            log(f'  Source  : dummy.json auto-created at {dummy}')
            src_file = dummy
        test_out = cfg.get('TestOutputDir') or ''
        if not test_out:
            test_out = os.path.join(work, 'test-result')
        if os.path.exists(test_out):
            remove_tree(test_out)
        os.makedirs(test_out, exist_ok=True)
        timeout_sec = int(cfg.get('TestTimeoutSec') or 600)
        log(f'  Exe     : {jebi}')
        log(f'  Mode    : {mode}')
        log(f'  Output  : {test_out}')
        log(f"  Timeout : {str(timeout_sec) + 's' if timeout_sec > 0 else 'unlimited'}")
        # [6-1] Build CLI args
        jebi_args = []
        if mode == 'parallel':
            jebi_args += ['--run-parallel', cfg['TestParallelManifest']]
        else:
            jebi_args += ['-s', src_file]
            if mode == 'scenario':
                jebi_args += ['--run-scenario', cfg.get('TestScenarioFile')]
            else:
                jebi_args.append('--run-file')
                jebi_args.extend(tc_files)
            jebi_args += ['--output', test_out]
            if cfg.get('TestVarsFile'):
                jebi_args += ['--vars', cfg['TestVarsFile']]
            if cfg.get('TestScenarioId'):
                jebi_args += ['--scenario-id', cfg['TestScenarioId']]
            if is_yes(cfg.get('TestHeadless')):
                jebi_args.append('--headless')
            if is_yes(cfg.get('TestSkipDuplicatePreconditions')):
                jebi_args.append('--skip-duplicate-preconditions')
            if is_yes(cfg.get('TestFailOnPageError')):
                jebi_args.append('--fail-on-page-error')
        log('  [CMD] ' + jebi + ' ' + ' '.join(
            f'"{a}"' if ' ' in str(a) else str(a) for a in jebi_args))
        # [6-1] Execute
        stdout_log = os.path.join(test_out, '_jebi_stdout.log')
        stderr_log = os.path.join(test_out, '_jebi_stderr.log')
        t0_6 = time.time()
        timed_out = False
        try:
            with open(stdout_log, 'w', encoding='utf-8') as fout, \
                 open(stderr_log, 'w', encoding='utf-8') as ferr:
                proc = subprocess.Popen(
                    [jebi] + jebi_args,
                    stdout=fout, stderr=ferr,
                    stdin=subprocess.DEVNULL
                )
                try:
                    proc.wait(timeout=timeout_sec if timeout_sec > 0 else None)
                except subprocess.TimeoutExpired:
                    proc.kill()
                    proc.wait()
                    timed_out = True
        finally:
            ctx['TestSec'] = round(time.time() - t0_6, 1)
        if os.path.isfile(stdout_log):
            with open(stdout_log, encoding='utf-8', errors='replace') as f:
                for line in f:
                    log('    ' + line.rstrip('\r\n'))
        if os.path.isfile(stderr_log):
            with open(stderr_log, encoding='utf-8', errors='replace') as f:
                err_text = f.read().strip()
            if err_text:
                log(f'    [STDERR] {err_text}')
        if timed_out:
            ctx['TestStatus'] = 'TIMEOUT'
            ctx['TestCode'] = -1
            raise PipelineError(f'TestPro timed out after {timeout_sec}s')
        ctx['TestCode'] = proc.returncode
        # [6-2] Classify exit code
        if ctx['TestCode'] == 0:
            ctx['TestStatus'] = 'PASS'
        elif ctx['TestCode'] in (15, 27, 33):
            ctx['TestStatus'] = 'FAIL'
        else:
            ctx['TestStatus'] = 'ENGINE_ERROR'
        # [6-3] Parse result JSONs for pass/fail counts
        total_pass = 0
        total_fail = 0
        for dirpath, _, filenames in os.walk(test_out):
            for fname in filenames:
                if not fname.endswith('.json') or fname.startswith('_'):
                    continue
                fpath = os.path.join(dirpath, fname)
                try:
                    with open(fpath, encoding='utf-8', errors='replace') as fp:
                        rj = json.load(fp)
                    p = rj.get('pass') if rj.get('pass') is not None else rj.get('passed', 0)
                    fi = rj.get('fail') if rj.get('fail') is not None else rj.get('failed', 0)
                    total_pass += int(p or 0)
                    total_fail += int(fi or 0)
                except Exception:
                    pass
        ctx['TestPass'] = total_pass
        ctx['TestFail'] = total_fail
        log(f"  Result  : {ctx['TestStatus']} Pass {total_pass}, Fail {total_fail} ({ctx['TestSec']}s)")
        if ctx['TestStatus'] != 'PASS':
            raise PipelineError(
                f"TestPro {ctx['TestStatus']} (exit {ctx['TestCode']}) Pass {total_pass}, Fail {total_fail}")

    step(ctx, '0 Preflight', preflight)
    try:
        step(ctx, '1 Package', package, when=src_type == 'package')
        step(ctx, '1 Source', source, when=src_type == 'git')
    except Unchanged:
        ctx['Status'] = 'UNCHANGED'
        return
    step(ctx, '2 Framework copy', framework_copy, when=src_type == 'git')
    step(ctx, '3 Deploy', deploy)
    step(ctx, '4 Publish', publish)
    step(ctx, '5 Chrome', chrome)
    step(ctx, '6 TestPro', testpro, when=is_yes(cfg.get('TestProEnabled')))

    with open(hash_file, 'w', encoding='utf-8') as f:
        f.write((ctx['PackageId'] if src_type == 'package' else ctx['Hash']) + '\n')
    ctx['Status'] = 'SUCCESS'


# ============================================================
# Main
# ============================================================

USAGE = """Usage: auto_pipeline.exe [v21|v24|all] [-Branch <name>] [-SourceType git|package] [-Build <folder>]
                         [-UpdateJar] [-SkipGit] [-OnlyIfChanged] [-OpenBrowser|-NoBrowser] [-DevTools]
                         [-Home <config folder>] [-Help]
  -Branch     : this run only, overrides Branch= in pipeline_<target>.txt (v21 or v24 only)
  -SourceType : this run only, overrides SourceType= (default git; package = prebuilt nexacrolib.zip)
  -Build      : this run only, package build folder (default PackageBuild=latest)
  -Home       : folder with pipeline_v21.txt / pipeline_v24.txt
                (default: env PIPELINE_HOME > exe folder > """ + DEFAULT_HOME + ')'


def parse_args(argv):
    opt = {'Target': 'all', 'Branch': '', 'SourceType': '', 'Build': '', 'Home': '',
           'UpdateJar': False, 'SkipGit': False, 'OnlyIfChanged': False,
           'OpenBrowser': False, 'NoBrowser': False, 'DevTools': False}
    switches = {'-updatejar': 'UpdateJar', '-skipgit': 'SkipGit', '-onlyifchanged': 'OnlyIfChanged',
                '-openbrowser': 'OpenBrowser', '-nobrowser': 'NoBrowser', '-devtools': 'DevTools'}
    values = {'-target': 'Target', '-branch': 'Branch', '-sourcetype': 'SourceType', '-build': 'Build', '-home': 'Home'}
    k = 0
    while k < len(argv):
        a = argv[k]
        low = a.lower()
        if low in ('v21', 'v24', 'all'):
            opt['Target'] = low
        elif low in switches:
            opt[switches[low]] = True
        elif low in values:
            k += 1
            v = argv[k] if k < len(argv) else ''
            if not v or v.startswith('-'):
                print(f'[ERROR] {a} needs a value')
                sys.exit(2)
            opt[values[low]] = v
        elif low in ('-help', '-h', '/?', '--help'):
            print(USAGE)
            sys.exit(0)
        else:
            print(f'[ERROR] Unknown argument: {a}  (use -Help)')
            sys.exit(2)
        k += 1

    opt['Target'] = opt['Target'].lower()
    opt['SourceType'] = opt['SourceType'].lower()
    if opt['Target'] not in ('v21', 'v24', 'all'):
        print(f"[ERROR] Invalid target: {opt['Target']}")
        sys.exit(2)
    if opt['SourceType'] and opt['SourceType'] not in ('git', 'package'):
        print(f"[ERROR] -SourceType must be git or package (got '{opt['SourceType']}')")
        sys.exit(2)
    if opt['Branch'] and opt['Target'] == 'all':
        print('[ERROR] -Branch needs a single target (v21 or v24)')
        sys.exit(2)
    if opt['Build'] and opt['Target'] == 'all':
        print('[ERROR] -Build needs a single target (v21 or v24)')
        sys.exit(2)
    return opt


def exe_path():
    # Compiled (Nuitka onefile) or frozen: argv[0] is the exe the user started
    if '__compiled__' in globals() or getattr(sys, 'frozen', False):
        return os.path.abspath(sys.argv[0])
    return os.path.abspath(__file__)


def find_home(opt):
    exe_dir = os.path.dirname(exe_path())
    # Check parent first so that running auto_pipeline.py from the python\ sub-folder
    # finds the config files in the parent (Tools\AutoPipeline\), same as the compiled exe.
    cands = [opt['Home'], os.environ.get('PIPELINE_HOME', ''),
             os.path.dirname(exe_dir), exe_dir, DEFAULT_HOME]
    for c in cands:
        if not c:
            continue
        c = c.strip().rstrip('\\')
        if any(os.path.isfile(os.path.join(c, f'pipeline_{t}.txt')) for t in TARGETS):
            return os.path.abspath(c)
    print('[ERROR] pipeline_v21.txt / pipeline_v24.txt not found.')
    print('        Checked: ' + ', '.join(f"'{c}'" for c in cands if c))
    print('        Use -Home <folder> or set the PIPELINE_HOME environment variable.')
    sys.exit(2)


def main(argv):
    global _log_fp
    try:
        sys.stdout.reconfigure(errors='replace')
    except AttributeError:
        pass

    opt = parse_args(argv)
    root = find_home(opt)
    os.environ['GIT_TERMINAL_PROMPT'] = '0'   # never block on a credential prompt

    work_root = os.path.join(root, 'work')
    log_dir = os.path.join(root, 'logs')
    os.makedirs(log_dir, exist_ok=True)
    log_file = os.path.join(log_dir, f"{datetime.datetime.now():%Y%m%d_%H%M%S}_{opt['Target']}.log")
    _log_fp = open(log_file, 'w', encoding='utf-8')
    log(f'[INFO] Config folder: {root}')
    log(f'[INFO] Runner      : {exe_path()}')

    targets = list(TARGETS) if opt['Target'] == 'all' else [opt['Target']]

    # ---- [jar] Deploy JAVA engine: once per run, before any target ----
    # Runs with -UpdateJar, or automatically when the configured JarDir has no engine yet.
    jar_results = []
    jar_failed = False
    jar_dirs = []
    for t in targets:
        try:
            c = read_config(os.path.join(root, f'pipeline_{t}.txt'))
            if is_enabled(c) and c['JarDir'] not in jar_dirs:
                jar_dirs.append(c['JarDir'])
        except PipelineError:
            pass
    for jd in jar_dirs:
        if not opt['UpdateJar'] and find_start_bat(jd):
            continue
        log('')
        log(f'---- [jar] Deploy JAVA engine: {jd} ----')
        t0 = time.time()
        try:
            try:
                assert_under(jd, work_root)
            except PipelineError:
                raise PipelineError(f"JarDir must be under {work_root} to be updated (got '{jd}')")
            jar_results.append(update_deploy_jar(jd, work_root))
        except Exception as e:
            jar_failed = True
            jar_results.append(f'FAIL - {e}')
            log(f'[ERROR] [jar] {e}')
            if find_start_bat(jd):
                log('  [WARN] Keeping the currently installed engine.')
        log(f'  [DONE] jar ({round(time.time() - t0, 1)}s)')

    results = []
    for t in targets:
        ctx = {'Target': t, 'Status': 'FAIL', 'Branch': '', 'SourceType': '', 'Version': '', 'Hash': '',
               'Msg': '', 'Url': '', 'Package': '', 'PackageId': '', 'Error': '',
               'TestStatus': '', 'TestPass': 0, 'TestFail': 0, 'TestSec': 0.0, 'TestCode': 0,
               'Steps': []}
        try:
            invoke_target(ctx, opt, root)
        except Exception as e:
            ctx['Error'] = str(e)
            log(f'[ERROR] [{t}] {e}')
        results.append(ctx)

    log('')
    log('==============================================')
    log(' AutoPipeline summary')
    log('==============================================')
    for j in jar_results:
        log(f' [jar] {j}')
    for r in results:
        log(f" [{r['Target']}] {r['Status']}")
        if r['Branch']:
            log(f"   Branch  : {r['Branch']}{' (' + r['SourceType'] + ')' if r['SourceType'] else ''}")
        if r['Package']:
            log(f"   Package : {r['Package']}")
        if r['Version']:
            log(f"   Version : {r['Version']}")
        if r['Hash']:
            log(f"   Commit  : {r['Hash']} {r['Msg']}")
        if r['Url']:
            log(f"   URL     : {r['Url']}")
        if r['Steps']:
            log(f"   Steps   : {' | '.join(r['Steps'])}")
        if r['TestStatus']:
            t_line = f"   TestPro : {r['TestStatus']}"
            if r['TestPass'] > 0 or r['TestFail'] > 0:
                t_line += f" Pass {r['TestPass']}, Fail {r['TestFail']}"
            if r['TestCode'] != 0:
                t_line += f" (exit {r['TestCode']})"
            if r['TestSec'] > 0:
                t_line += f" {r['TestSec']}s"
            log(t_line)
        if r['Error']:
            log(f"   Error   : {r['Error']}")
    log(f' Log: {log_file}')
    log('==============================================')
    _log_fp.close()
    _log_fp = None

    return 1 if jar_failed or any(r['Status'] == 'FAIL' for r in results) else 0


if __name__ == '__main__':
    sys.exit(main(sys.argv[1:]))
