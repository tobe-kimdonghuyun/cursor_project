# 새 PC에서 Claude Code(Cursor) 환경 이어받기

cursor_project 작업 환경(스킬, MCP 서버, 개인 설정, 작업 기록)을 다른 PC(회사/집/노트북)에서
그대로 이어서 쓰기 위한 절차. 위에서 아래로 순서대로 진행한다.

## 전제 조건

- Cursor 설치 + Claude Code 확장 설치 + Anthropic 계정 로그인 완료
  (`.credentials.json`은 로그인하면 자동 생성됨 — 다른 PC에서 수동으로 옮기지 말 것)
- Git, Python(pip), Node.js(npx) 설치되어 있을 것

## 관련 저장소 (모두 private)

| 저장소 | 용도 |
|--------|------|
| `https://github.com/tobe-kimdonghuyun/cursor_project` | 프로젝트 본체 |
| `https://github.com/tobe-kimdonghuyun/claude-dotfiles` | 개인 설정 부트스트랩 소스 |
| `https://github.com/tobe-kimdonghuyun/gstack-artifacts-tobe-kimdonghuyun` | 작업 체크포인트/기록 동기화 |

---

## 1단계 — cursor_project clone

가능하면 **원래 PC와 같은 드라이브 경로**로 clone한다. 경로가 다르면(`E:\...` 등)
`/context-save`·`/context-restore`가 이 프로젝트를 다른 프로젝트로 인식해 작업 기록을
못 이어받는다.

```bash
git clone https://github.com/tobe-kimdonghuyun/cursor_project D:\git_prj\cursor_project
```

`CLAUDE.md`, `nexacroN_rules.md`, `.claude/commands`, `.claude/skills`,
`.claude/settings.local.json`은 이미 저장소에 커밋되어 있으므로 clone만 하면 자동 적용된다.

---

## 2단계 — 개인 dotfiles 적용 (claude-dotfiles)

`~/.claude` 전체가 아니라, 재설치 불가능한 개인 취향 값만 옮기고 나머지는 재설치 명령으로 해결한다.

```bash
# 아무 위치에나 clone (설치 소스일 뿐, 위치는 중요하지 않음)
git clone https://github.com/tobe-kimdonghuyun/claude-dotfiles ~/claude-dotfiles
```

### 2-1. gstack 스킬 재설치

```bash
git clone --single-branch --depth 1 https://github.com/garrytan/gstack.git ~/.claude/skills/gstack
cd ~/.claude/skills/gstack && ./setup
```

Cursor 자체 채팅(Composer)에서도 gstack 규칙을 쓰려면 추가로:

```bash
./setup --host cursor
```

### 2-2. skill-creator 플러그인 재설치

```bash
claude plugin marketplace add anthropics/claude-plugins-official
claude plugin install skill-creator@claude-plugins-official
```

### 2-3. 개인 취향 값 병합

`~/claude-dotfiles/personal-prefs.json`의 값들(model, language, theme,
autoUpdatesChannel, skipDangerousModePermissionPrompt, tui)을
새 PC의 `~/.claude/settings.json`에 수동으로 병합한다.
(2-1의 `./setup`이 이미 채워둔 `hooks.SessionStart` 등 PC 고유 경로값은 절대 덮어쓰지 말 것)

---

## 3단계 — MCP 서버 재등록 + 재로그인

### 3-1. notebooklm-mcp

Google이 NotebookLM을 Gemini Notebook으로 리브랜딩(2026-07-16, 도메인이
`notebook.google.com`으로 변경)한 이후 버전만 지원한다.

```bash
pip install notebooklm-mcp-cli
claude mcp add --scope local notebooklm -- notebooklm-mcp
```

등록 후 Claude Code를 **재시작**해야 새 MCP 툴이 세션에 로드된다. 재시작 후:

```
notebooklm 인증 진행해줘
```

라고 요청하면 브라우저가 뜨고, 그 안에서 **본인이 직접** 구글 로그인을 완료한다.
로그인 세션(쿠키)은 PC마다 새로 만드는 게 정상 — 옮기지 않는다.

### 3-2. Notion MCP

Notion 통합(Integration)에서 발급받은 API 키가 필요하다
(발급: https://www.notion.so/my-integrations → 연결할 페이지에서 `Connect to`로 통합 추가).

```bash
claude mcp add notion -e "OPENAPI_MCP_HEADERS={\"Authorization\": \"Bearer <API_KEY>\", \"Notion-Version\": \"2022-06-28\"}" -- npx -y @notionhq/notion-mcp-server
```

API 키는 PC마다 옮기지 말고 새로 발급하거나, 비밀 관리 도구를 통해 안전하게 전달한다.

---

## 4단계 — 작업 기록 동기화 연결 (gstack-artifacts)

`/context-save`로 저장한 체크포인트를 다른 PC에서 `/context-restore`로 이어받기 위한 설정.
**한 번만** 하면 되고, 이후로는 gstack 스킬 실행 시 자동으로 pull/push된다.

### 4-1. 이 PC 전용 SSH 키 생성 + GitHub 등록

```bash
mkdir -p ~/.ssh
ssh-keygen -t ed25519 -C "<이메일>-gstack-artifacts" -f ~/.ssh/id_ed25519 -N ""
ssh-keyscan -t ed25519 github.com >> ~/.ssh/known_hosts
cat ~/.ssh/id_ed25519.pub
```

출력된 공개키를 https://github.com/settings/keys 에 **New SSH key**로 등록
(제목 예: `<PC이름>-gstack-artifacts`). 키는 PC마다 새로 만든다 — 옮기지 않는다.
(다른 프로젝트(REQM 등)에서 이미 같은 키를 등록해뒀다면 이 단계는 생략 가능)

연결 확인:

```bash
ssh -T git@github.com
```

### 4-2. gstack-artifacts 연결

```bash
~/.claude/skills/gstack/bin/gstack-artifacts-init \
  --remote https://github.com/tobe-kimdonghuyun/gstack-artifacts-tobe-kimdonghuyun
```

### 4-3. 설정 확인 (이미 만들어둔 저장소를 재사용하는 경우 아래 값이 맞는지만 확인)

```bash
~/.claude/skills/gstack/bin/gstack-config get artifacts_sync_mode
# "full" 이 아니면:
~/.claude/skills/gstack/bin/gstack-config set artifacts_sync_mode full
```

> **주의(cp949 인코딩 버그)**: `~/.gstack/.brain-allowlist`, `.brain-privacy-map.json`
> 파일에 한글이나 em dash(—) 같은 non-ASCII 문자를 절대 넣지 않는다. 이 파일들을 읽는
> `gstack-brain-sync`가 Windows에서 cp949로 읽어서 UnicodeDecodeError로 크래시한다.
> 주석은 항상 순수 ASCII 영문으로만 작성할 것.

---

## 5단계 — 이전 작업 이어받기

```
/context-restore
```

가장 최근 체크포인트(`~/.gstack/projects/tobe-kimdonghuyun-cursor_project/checkpoints/*.md`)를
불러와 어디까지 작업했는지, 남은 일이 뭔지 요약해준다.

작업을 마칠 때(또는 PC를 바꾸기 전) 저장:

```
/context-save <제목>
```

---

## 그 외 자주 쓰는 명령어

| 상황 | 명령어 |
|------|--------|
| gstack 최신 버전 확인/업그레이드 | `/gstack-upgrade` |
| MCP 서버 연결 상태 확인 | `claude mcp list` |
| 저장된 체크포인트 목록 보기 | `/context-save list` (`--all`로 전체 브랜치) |
| 개인 설정(personal-prefs) 변경 시 dotfiles에도 반영 | `~/claude-dotfiles`에서 수정 후 `git add . && git commit && git push` |

---

## 체크리스트

- [ ] Cursor + Claude Code 확장 설치, 로그인
- [ ] cursor_project를 원래 PC와 같은 경로로 clone
- [ ] claude-dotfiles clone
- [ ] gstack 재설치 (`./setup`, 필요시 `--host cursor`)
- [ ] skill-creator 플러그인 재설치
- [ ] personal-prefs.json 값 병합
- [ ] notebooklm-mcp 재등록 + 재시작 + 재로그인
- [ ] Notion MCP 재등록 (API 키 재발급)
- [ ] SSH 키 생성 + GitHub 등록
- [ ] `gstack-artifacts-init` 실행 + `artifacts_sync_mode full` 확인
- [ ] `/context-restore`로 작업 이어받기 확인
