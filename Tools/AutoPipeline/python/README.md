# AutoPipeline EXE 빌드 가이드

> Nexacro N v21/v24 무인 배포·검증 파이프라인의 실행 파일 빌드 안내.  
> `auto_pipeline.py`(Python), `auto_pipeline.ps1`(PowerShell), `auto_pipeline_standalone.bat`(내장 PS) — 세 가지 구현체를 모두 exe로 빌드할 수 있다.

---

## 1. 파일 구성

```
python/
├── auto_pipeline.py              — Python 소스 (표준 라이브러리만 사용)
├── build_exe.bat                 — Nuitka 빌드  → ..\auto_pipeline_py.exe
├── build_ps1_exe.bat             — ps2exe 빌드  → ..\auto_pipeline.exe
├── build_standalone_exe.bat      — ps2exe 빌드  → ..\auto_pipeline_standalone.exe
├── build_all_exe.bat             — 위 세 스크립트 일괄 실행
├── build/
│   └── auto_pipeline_py.exe      — Nuitka 컴파일 중간 결과물
└── README.md                     — 이 문서
```

빌드 결과물은 **부모 폴더(`Tools\AutoPipeline\`)** 에 복사된다.  
파이프라인 설정 파일(`pipeline_v21.txt`, `pipeline_v24.txt`)과 나란히 위치해야 한다.

### 구현체별 exe 대응

| exe 파일 | 빌드 원본 | 빌드 스크립트 | 빌드 도구 |
|---------|----------|-------------|---------|
| `auto_pipeline_py.exe` | `auto_pipeline.py` | `build_exe.bat` | Nuitka |
| `auto_pipeline.exe` | `auto_pipeline.ps1` | `build_ps1_exe.bat` | ps2exe |
| `auto_pipeline_standalone.exe` | `auto_pipeline_standalone.bat` | `build_standalone_exe.bat` | ps2exe |

---

## 2. 전체 작업 순서도

```mermaid
flowchart TD
    START([auto_pipeline 실행]) --> PARSE[인수 파싱]
    PARSE --> HOME[Config 폴더 결정\n-Home / PIPELINE_HOME / exe위치 / DEFAULT_HOME]
    HOME --> JARCHECK[jar 단계\nJAR 서버 최신 버전 자동 확인]
    JARCHECK -- 업데이트됨 --> JARDOWN[최신 zip 다운로드\n→ JarDir 에 설치]
    JARCHECK -- 이미 최신 --> TGTLOOP
    JARDOWN --> TGTLOOP

    TGTLOOP[타겟 목록 순회\nv21 / v24 / all] --> ENABLED{Enabled=Y?}
    ENABLED -- N --> DISABLED([DISABLED — 건너뜀])
    ENABLED -- Y --> S0

    S0[0 Preflight\n경로·Java·Jar 확인\nURL 호스트 자동 설정] --> SRCTYPE{SourceType?}
    SRCTYPE -- git --> S1G[1 Source\n원격 해시 취득\ngit clone 또는 pull]
    SRCTYPE -- package --> S1P[1 Package\nzip 위치 결정\n로컬 캐시 복사 → 압축 해제]

    S1G --> DOFROM
    S1P --> DOFROM

    DOFROM["do_from 계산
    ─────────────────
    SrcChanged(git)  → 2
    SrcChanged(pkg)  → 3
    JarUpdated       → min(3)
    -Block 지정      → min(단계번호)
    아무것도 없으면  → 99"]
    DOFROM --> SKIP{do_from == 99?}
    SKIP -- Y --> UNCHANGED([UNCHANGED — 2~5 단계 건너뜀])
    SKIP -- N --> S2CHK

    S2CHK{do_from ≤ 2\nand git?}
    S2CHK -- Y --> S2[2 Framework copy\nnexacrolib + generate rule\n빌드 + UTF-8 BOM 변환]
    S2CHK -- N --> S3CHK
    S2 --> S3CHK

    S3CHK{do_from ≤ 3?}
    S3CHK -- Y --> S3[3 Deploy\nJava CLI 실행\nnexacrodeploy.jar → output → deploy]
    S3CHK -- N --> S4CHK
    S3 --> S4CHK

    S4CHK{do_from ≤ 4?}
    S4CHK -- Y --> S4[4 Publish\nTomcat 기동 확인 및 자동 시작\ndeploy → webapps 복사\nURL 응답 대기]
    S4CHK -- N --> TESTPRO_CHK
    S4 --> TESTPRO_CHK

    TESTPRO_CHK{TestProEnabled=Y?}
    TESTPRO_CHK -- N --> SAVE
    TESTPRO_CHK -- Y --> S5[5 TestPro\nJEBI_Main.exe CLI 실행]
    S5 --> S5R{종료 코드?}
    S5R -- 0 --> PASS([PASS])
    S5R -- "15/27/33" --> FAIL_TEST([FAIL — 테스트 실패])
    S5R -- 타임아웃 --> FAIL_TIMEOUT([FAIL — TIMEOUT])
    S5R -- 기타 --> FAIL_ENG([FAIL — ENGINE_ERROR])
    PASS --> SAVE

    SAVE[last_success 마커 갱신] --> SUCCESS([SUCCESS])

    SUCCESS --> SUMMARY[요약 출력]
    DISABLED --> SUMMARY
    UNCHANGED --> SUMMARY
    FAIL_TEST --> SUMMARY
    FAIL_TIMEOUT --> SUMMARY
    FAIL_ENG --> SUMMARY
```

---

## 3. 단계별 상세

### [jar] Deploy JAVA 엔진 갱신 (항상 자동 실행)

- 옵션 지정 없이 **항상 자동으로** JAR 서버 최신 버전을 확인한다
- `JarDir`이 `work_root` 바깥이면 보안상 거부(`assert_under`)
- JAR 서버(`http://59.10.169.82:9900`)에서 최신 연도 폴더 → 최신 zip 탐색
- 더블 압축 구조를 자동 처리 (zip 안의 zip 추출)
- 이미 최신이면 `[SKIP]`
- **jar 업데이트 발생 시** → `do_from = min(do_from, 3)` (Deploy 단계부터 실행)

### [0] Preflight — 사전 점검

| 점검 항목 | 실패 조건 |
|---------|---------|
| `ProjectPath` | 파일 없음 |
| `TomcatHome` | 폴더 없음 |
| `java.exe` | `JavaHome\bin\java.exe` 없음 |
| `start.bat` | `JarDir` 하위에 없음 |
| `WebContext` | Tomcat 보호 앱(`root`, `manager` 등) + `PublishSubDir` 없음 |

- `ServerHost=auto` 이면 로컬 IPv4 자동 감지 (루프백·APIPA 제외)
- `{Branch}` 치환, `SourceType` 결정

### [1] Source — git 모드

1. 브랜치 버전 검증: `_NN.0.0.N` 패턴이 `ExpectedVersion`과 불일치하면 즉시 실패
2. `git ls-remote`로 원격 해시 취득 → last_success 해시와 비교하여 **변경 자동 감지**
   - 변경 있음 → `SrcChanged = true`, `do_from = 2` (Framework copy부터)
   - 변경 없음 → `SrcChanged = false` (do_from 계산 후 UNCHANGED 가능)
3. `SourceDir` 없음 → 디스크 여유 확인 후 `git clone --single-branch`
4. 이미 존재 → origin URL 비교 → lock 파일 확인 → `git pull --ff-only`

### [1] Package — 패키지 모드

1. zip 위치 결정 순서: `PackagePath` > `PackageRoot\{branch}\{build}\{zip}`
2. `PackageBuild=latest` 이면 날짜+시퀀스 기준으로 최신 빌드 폴더 자동 선택
3. 로컬 캐시(`work\package\`) 사용 (크기·수정 시각 일치 시 재복사 생략)
4. `nexacrolib.json` 버전 확인 → `ExpectedVersion` 불일치 시 실패
5. 패키지 변경 감지:
   - 변경 있음 → `SrcChanged = true`, `do_from = 3` (Deploy부터; Framework copy 제외)
   - 변경 없음 → `SrcChanged = false`

### do_from 실행 단계 결정 로직

```
do_from = 99  (아무것도 실행하지 않음)

SrcChanged = true:
  git 방식   → do_from = 2  (Framework copy 부터)
  package 방식 → do_from = 3  (Deploy 부터)

JarUpdated = true:
  → do_from = min(do_from, 3)

-Block <단계목록> 지정:
  각 단계 번호와 비교 → do_from = min(do_from, 단계번호)

do_from == 99 → UNCHANGED (2~5 단계 전체 건너뜀)
```

**-Block 유효 단계값**:

| 값 | 별칭 | 강제 실행 시작 단계 |
|----|------|-----------------|
| `framework` | `fw` | [2] Framework copy |
| `deploy` | — | [3] Deploy |
| `publish` | — | [4] Publish |
| `testpro` | `test` | [5] TestPro |

### [2] Framework copy — 엔진 빌드

- 실행 조건: `do_from ≤ 2` **이고** `SourceType = git`
- `SourceDir\Lib\FrameworkJS` → `work\{target}\nexacrolib\nexacrolib\`
- JS 파일 UTF-8 BOM 변환 (UTF-8 without BOM → with BOM)
- `Tools\Lib\TiMetainfoLib\res` → generate rule
- v24: `Tools\Lib\TiGenerateLib\Template\24` 추가 복사

### [3] Deploy — Nexacro 배포 CLI

- 실행 조건: `do_from ≤ 3`

```
java -classpath libs/* com.nexacro.build.cli.Main
     -P <project.xprj>
     -B <nexacrolib>
     -O <output>
     -GENERATERULE|-CSSRULE <generate>
     -D <deploy>
     [Flags from pipeline_*.txt: -MERGE, -COMPRESS, ...]
```

- v21: `-CSSRULE`, v24: `-GENERATERULE`
- 종료 코드 0이 아니거나 deploy 폴더가 비어있으면 실패

### [4] Publish — Tomcat 배포

- 실행 조건: `do_from ≤ 4`

1. Tomcat 포트 응답 확인 → 없으면 `catalina.bat start` 자동 실행 (최대 60s 대기)
2. 기존 webapps 폴더 삭제 → deploy 폴더 복사
3. `StartPage` 자동 결정: `index.html` → 알파벳 첫 HTML → 없으면 컨텍스트 루트
4. URL 응답 확인 (최대 60s)

### [5] TestPro — JEBI_Main.exe CLI

**실행 조건**: `TestProEnabled=Y`

#### [5-0] Preflight

| 점검 항목 | 실패 조건 |
|---------|---------|
| `JebiExePath` | 미설정 또는 파일 없음 |
| `TestMode` | `scenario`, `file`, `parallel` 외 값 |
| `TestScenarioFile` | `scenario` 모드에서 미설정/없음 |
| `TestTCFiles` | `file` 모드에서 1개 이상 필요; 각 파일 존재 확인 |
| `TestParallelManifest` | `parallel` 모드에서 미설정/없음 |

- `TestSourceFile` 미설정 → `work\{target}\dummy.json` (내용: `{}`) 자동 생성
- `TestOutputDir` 미설정 → `work\{target}\test-result` 자동 지정 (기존 폴더 삭제 후 재생성)

#### [5-1] 실행

| 모드 | CLI 형태 |
|------|---------|
| `scenario` | `JEBI_Main.exe -s <dummy> --run-scenario <SCM.json> --output <dir> [옵션...]` |
| `file` | `JEBI_Main.exe -s <dummy> --run-file <TC1> <TC2> ... --output <dir> [옵션...]` |
| `parallel` | `JEBI_Main.exe --run-parallel <manifest.json>` |

공통 선택 옵션:

| 설정 키 | CLI 플래그 |
|--------|----------|
| `TestHeadless=Y` | `--headless` |
| `TestSkipDuplicatePreconditions=Y` | `--skip-duplicate-preconditions` |
| `TestFailOnPageError=Y` | `--fail-on-page-error` |
| `TestVarsFile=<path>` | `--vars <path>` |
| `TestScenarioId=<id>` | `--scenario-id <id>` |

- stdout / stderr를 `_jebi_stdout.log` / `_jebi_stderr.log`에 캡처 → 파이프라인 로그에도 출력
- `TestTimeoutSec` 초과 시 프로세스 강제 종료 → `TIMEOUT`

#### [5-2] 종료 코드 분류

| 종료 코드 | TestStatus |
|---------|-----------|
| `0` | `PASS` |
| `15`, `27`, `33` | `FAIL` (실행은 됐으나 결과 실패) |
| 그 외 | `ENGINE_ERROR` (설정/실행 오류) |
| 타임아웃 | `TIMEOUT` |

#### [5-3] 결과 집계

- `TestOutputDir` 내 `*.json` 파일 순회 (`_`로 시작하는 로그 파일 제외)
- 각 JSON에서 `pass`/`passed`, `fail`/`failed` 필드 합산
- `TestStatus != PASS` 이면 파이프라인 FAIL

---

## 4. 주요 내부 함수

| 함수 | 역할 |
|------|------|
| `read_config(path)` | `pipeline_*.txt` 파싱, PATH_KEYS 상대→절대 변환, 필수 키 검증 |
| `is_yes(value)` | `Y/YES/TRUE/1` 여부 확인 |
| `lp(path)` | Windows 260자 제한 우회 (`\\?\` 접두어) |
| `assert_under(path, root)` | 허용 루트 밖 조작 거부 |
| `remove_tree(path)` | 읽기 전용 파일 포함 강제 삭제 |
| `run(cmd)` | 외부 프로세스 실행, stdout 실시간 출력 |
| `capture(cmd)` | 외부 프로세스 실행, 출력을 리스트로 반환 (에코 없음) |
| `step(ctx, name, body, when)` | 단계 실행 래퍼 — 타이밍 측정, Steps 기록, `when=False`이면 건너뜀 |
| `invoke_target(ctx, jar_updated)` | 단일 타겟(v21/v24)의 전체 파이프라인 실행 |
| `get_local_ipv4()` | 루프백·APIPA 제외한 실제 로컬 IP 반환 |
| `wait_url(url, timeout)` | HTTP 200 응답을 n초 안에 대기 |
| `decode(raw)` | UTF-8 → CP949 순으로 바이트 디코딩 |
| `get_latest_build(folder)` | `YYYY.M.D.N` 형식 빌드 폴더 중 최신 선택 |

---

## 5. 설정 파일 (`pipeline_*.txt`) 주요 키

> 전체 항목은 `Tools\AutoPipeline\README.md` 5장 참조.

```ini
Enabled=Y               # N이면 이 타겟 전체 건너뜀
ExpectedVersion=21      # 21 또는 24 (버전 불일치 시 즉시 실패)
SourceType=git          # git | package
Branch=master_21
SourceDir=D:\git\{Branch}
ProjectPath=D:\nexacro UI\...\project.xprj
WorkDir=D:\git\...\work\v21
JarDir=D:\git\...\work\jar
TomcatHome=C:\apache-tomcat-11.0.25
TomcatPort=8080
WebContext=auto_v21

# [5] TestPro
TestProEnabled=N
JebiExePath=
TestMode=scenario       # scenario | file | parallel
TestScenarioFile=
TestOutputDir=          # 비우면 work\v21\test-result 자동
TestHeadless=Y
TestTimeoutSec=600
```

### PATH_KEYS — 상대 경로 자동 변환 대상

`read_config()` 내에서 설정 파일 위치 기준으로 절대 경로로 변환된다.

```
SourceDir, ProjectPath, WorkDir, JarDir, TomcatHome, JavaHome,
PackageRoot, PackagePath,
JebiExePath, TestScenarioFile, TestParallelManifest,
TestOutputDir, TestVarsFile, TestSourceFile
```

`TestTCFiles`는 `|` 구분 목록이므로 제외 — `[5]` 단계 내부에서 개별 변환.

---

## 6. CLI 사용법

```cmd
auto_pipeline[_py].exe [v21|v24|all] [옵션...]
```

| 옵션 | 설명 |
|------|------|
| `v21` / `v24` / `all` | 실행 타겟 (기본 `all`) |
| `-Branch <name>` | 이번 실행만 브랜치 오버라이드 |
| `-SourceType git\|package` | 이번 실행만 소스 타입 오버라이드 |
| `-Build <folder>` | 이번 실행만 패키지 빌드 폴더 지정 |
| `-Block <steps>` | 변경 없어도 지정 단계부터 강제 실행 (쉼표 구분) |
| `-SkipGit` | git 작업 생략 (SourceDir가 이미 존재해야 함) |
| `-Home <path>` | 설정 폴더 지정 |
| `-Help` | 도움말 출력 |

**-Block 사용 예시**:

```cmd
# 변경 없어도 Deploy부터 강제 실행
auto_pipeline.exe v24 -Block deploy

# Framework copy와 Deploy 모두 강제 실행
auto_pipeline.exe all -Block framework,deploy

# TestPro만 재실행
auto_pipeline.exe v21 -Block testpro
```

**Config 폴더 결정 순서**: `-Home` > 환경 변수 `PIPELINE_HOME` > exe 위치 > `DEFAULT_HOME`

---

## 7. 요약 출력 예시

```
==============================================
 AutoPipeline summary
==============================================
 [v21] SUCCESS
   Branch  : master_21 (git)
   Version : 21.0.0.2100
   Commit  : 3b64f73 Fix grid scroll issue
   URL     : http://172.10.12.46:8080/auto_v21/index.html
   Steps   : 0 Preflight 1.2s | 1 Source 8.4s | 2 Framework copy 14.3s | 3 Deploy 47.7s | 4 Publish 2.2s | 5 TestPro 18.4s
   TestPro : PASS Pass 52, Fail 0 18.4s
 [v24] UNCHANGED
   Branch  : master (git)
   (변경 없음 — [2]~[5] 건너뜀)
 [v21] SUCCESS (jar 업데이트로 Deploy부터 재실행)
   Steps   : 0 Preflight 0.8s | 1 Source 0.3s | 3 Deploy 48.1s | 4 Publish 2.1s
 Log: D:\...\logs\20261012_093012_all.log
==============================================
```

---

## 8. exe 빌드

### 8-1. 일괄 빌드

```cmd
cd Tools\AutoPipeline\python
build_all_exe.bat              rem 전체 빌드
build_all_exe.bat ps1          rem PS1 exe만
build_all_exe.bat ps1 standalone  rem PS1 + Standalone exe
```

### 8-2. Python exe (`auto_pipeline_py.exe`) — Nuitka

```cmd
python\build_exe.bat
```

**사전 요건**: Python 3.12+ + Nuitka + Zig

```cmd
python -m pip install nuitka ordered-set zstandard
rem Zig: https://ziglang.org/download/ (PATH에 추가)
```

| 컴파일 옵션 | 효과 |
|-----------|------|
| `--onefile` | 단일 exe |
| `--zig` | Zig 컴파일러 사용 (Python 3.13+ MinGW64 미지원 대응) |
| `--python-flag=no_docstrings,no_asserts` | docstring·assert 제거 |
| `--windows-console-mode=force` | 콘솔 창 강제 표시 |
| `--remove-output` | 중간 C 파일 자동 삭제 |

빌드 완료 후 `build\auto_pipeline_py.exe` → `..\auto_pipeline_py.exe` 자동 복사.

### 8-3. PS1 exe (`auto_pipeline.exe`) — ps2exe

```cmd
python\build_ps1_exe.bat
```

- `auto_pipeline.ps1` → `auto_pipeline.exe`
- ps2exe 모듈 없으면 **자동 설치** (`Install-Module ps2exe -Scope CurrentUser`)

### 8-4. Standalone exe (`auto_pipeline_standalone.exe`) — ps2exe

```cmd
python\build_standalone_exe.bat
```

- `auto_pipeline_standalone.bat`의 `:__PS_BEGIN__` 이후 PowerShell 섹션을 추출
- exe 환경에 맞게 세 곳 **자동 패치**:

| 원본 (bat 전용) | 패치 후 (exe 전용) | 설명 |
|---------------|-----------------|------|
| `$env:AP_ARGS` 파싱 | `$args` | exe는 인수를 `$args`로 수신 |
| `$env:AP_BATDIR` | `$_dir` | exe 위치 폴더 |
| `$env:AP_SELF` | `$_self` | exe 전체 경로 |

- 임시 ps1 → ps2exe 컴파일 → 임시 파일 자동 삭제

---

## 9. 구현체 비교

| 항목 | `auto_pipeline_py.exe` | `auto_pipeline.exe` | `auto_pipeline_standalone.exe` |
|------|----------------------|--------------------|-----------------------------|
| 원본 | `auto_pipeline.py` | `auto_pipeline.ps1` | `auto_pipeline_standalone.bat` |
| 빌드 도구 | Nuitka | ps2exe | ps2exe |
| 런타임 | Python 3.x (내장) | PS 엔진 (내장) | PS 엔진 (내장) |
| 텍스트 인코딩 | UTF-8 완전 지원 | ASCII 제약 일부 | ASCII 제약 일부 |
| 로그 방식 | 파일 직접 기록 | `Start-Transcript` | `Start-Transcript` |
| 경로 260자 우회 | `lp()` 전체 적용 | 일부 | 일부 |
| 설정 파일 | 동일 (`pipeline_*.txt`) | 동일 | 동일 |
| CLI 옵션 | 동일 | 동일 | 동일 |
| 단계 순서 | 동일 | 동일 | 동일 |

---

## 10. 변경 이력

| 날짜 | 내용 |
|------|------|
| 2026-10-01 | 초기 버전 — `[jar]` ~ `[5] Chrome` 구현 |
| 2026-10-08 | `[6] TestPro` 단계 추가, `PATH_KEYS` 확장 |
| 2026-10-12 | **변경 감지 자동화** — `-UpdateJar` / `-OnlyIfChanged` 제거, 항상 자동 감지로 전환 |
| | **`-Block <steps>` 옵션 추가** — 변경 없어도 지정 단계부터 강제 실행 |
| | **`do_from` 실행 단계 결정 로직** 적용 (SrcChanged + JarUpdated + -Block 최솟값) |
| | **Chrome 단계 완전 제거** (`[5] Chrome` 삭제) |
| | **`[6] TestPro` → `[5] TestPro`** 번호 조정 |
| | **exe 출력 파일명 변경**: `auto_pipeline.exe` → `auto_pipeline_py.exe` |
| | **신규 빌드 스크립트**: `build_ps1_exe.bat`, `build_standalone_exe.bat`, `build_all_exe.bat` |
| | 세 구현체(`py`, `ps1`, `standalone.bat`) 동기화 완료 |
