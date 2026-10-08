# [6] TestPro 단계 설계

> 작성일: 2026-10-08  
> 참조 매뉴얼: `manual-TESTProStudio-kor.asar` (실제 파일 위치: `C:\Users\sjrnfl13\Documents\Amaranth10\`)

---

## 1. ASAR 분석 결과 — TestProStudio + JEBI 엔진 구조

| 구성 요소 | 역할 |
|-----------|------|
| **TESTProStudio** | VS Code 확장 — TC 작성, 시나리오 구성, 스케줄 메타 관리 |
| **JEBI_Main.exe** | 실제 브라우저 자동화 엔진 — CLI로 직접 실행 가능 |
| `Tests/testcases/` | TC JSON 파일들 |
| `Tests/scenarios/` | 시나리오 JSON (TC 목록 매니페스트) |
| `Tests/env/` | 환경변수 JSON (baseUrl, 계정 등) |
| `Tests/schedule/` | 스케줄 메타 JSON (언제/무엇을/어떻게) |
| `Tests/result/` | 실행 결과 JSON (로컬 전용, git 미추적) |

---

## 2. JEBI_Main.exe CLI 핵심 옵션

```cmd
JEBI_Main.exe -s <dummy.json> --run-scenario <SCM-XXXX.json>
              --output <결과폴더> --vars <env.json>
              --headless [--scenario-id <ID>]
              [--skip-duplicate-preconditions]
              [--fail-on-page-error]
```

### 실행 모드 3가지

| 모드 | 옵션 | 설명 |
|------|------|------|
| `scenario` | `--run-scenario <SCM.json>` | 시나리오 JSON이 TC 목록 관리 |
| `file` | `--run-file TC1.json TC2.json ...` | CLI에서 TC 직접 나열 |
| `parallel` | `--run-parallel <manifest.json>` | 여러 job 동시 실행 |

> **중요**: `-s/--source`는 `--run-file`/`--run-scenario` 모드에서도 **반드시 필요**  
> (내용 불사용, 형식상 필수 — 없으면 종료코드 1로 즉시 실패)  
> 아무 JSON 파일이나(예: `{}` 내용의 dummy.json) 넘기면 됨

### 전체 옵션 목록

| 옵션 | 값 | 설명 |
|------|----|------|
| `-s, --source` | 파일 경로/URL | 항상 필수 (단독 서버 모드에서는 TC 파일, --run-* 모드에서는 형식상 dummy) |
| `--output` | 폴더 경로 | 결과 JSON 저장 폴더 — `--run-file`/`--run-scenario` 사용 시 필수 |
| `--vars` | JSON 파일 | 환경변수 파일 — TC의 `{{변수명}}`을 치환 |
| `--scenario-id` | 문자열 | 결과 파일명용 시나리오 ID |
| `--headless` | (플래그) | 브라우저 창 없이 실행 |
| `--fail-on-page-error` | (플래그) | 페이지 오류 발생 시 강제 Fail 처리 |
| `--skip-duplicate-preconditions` | (플래그) | 중복 사전 TC 재실행 방지 |
| `--grid-debug` | (플래그) | 그리드 가상 스크롤 진단 로그 (디버그용) |
| `--install-browser` | (플래그) | Playwright용 Chromium 설치 후 종료 (-s 불필요) |
| `-p, --port` | 정수(기본 8765) | 서버 모드 포트 (--run-* 없이 서버로 띄울 때) |

---

## 3. 종료 코드 체계

| 코드 | 의미 |
|------|------|
| 0 | 성공 |
| 1 | `-s/--source` 누락 |
| 2 | `-s/--source` 로드 실패 |
| 3 | `--vars` 로드 실패 |
| 4 | `--run-file`과 `--run-scenario` 동시 사용 |
| 5 | `--run-parallel`을 다른 실행 옵션과 동시 사용 |
| 10 | `--run-file`: `--output` 누락 |
| 11 | `--run-file`: TC 로드 실패 |
| 12 | `--run-file`: 첫 TC에 url 없음 |
| 13 | `--run-file`: url의 `{{변수}}` 치환 실패 |
| 14 | `--run-file`: 시작 URL 접속 실패 |
| **15** | **`--run-file`: 정상 실행됐으나 결과 Fail** |
| 16 | `--run-file`: 브라우저 실행 자체 실패 |
| 17 | `--run-file`: 사전 테스트케이스 Fail로 체인 중단 |
| 20 | `--run-scenario`: `--output` 누락 |
| 21 | `--run-scenario`: 매니페스트 로드 실패 |
| 22 | `--run-scenario`: 매니페스트 비어있음 |
| 23 | `--run-scenario`: TC 로드 실패 |
| 24 | `--run-scenario`: 첫 TC에 url 없음 |
| 25 | `--run-scenario`: url의 `{{변수}}` 치환 실패 |
| 26 | `--run-scenario`: 시작 URL 접속 실패 |
| **27** | **`--run-scenario`: 정상 실행됐으나 결과 Fail** |
| 28 | `--run-scenario`: 브라우저 실행 자체 실패 |
| 29 | `--run-scenario`: 사전 테스트케이스 Fail로 체인 중단 |
| 30 | `--run-parallel`: 매니페스트 로드 실패 |
| 31 | `--run-parallel`: job 목록 비어있음 |
| 32 | `--run-parallel`: job 설정 오류 (output 누락 또는 runFile/runScenario 지정 오류) |
| **33** | **`--run-parallel`: job 중 하나 이상 실패** |

> 종료 코드 대역: `0~9` 공통 / `10~19` run-file / `20~29` run-scenario / `30~39` run-parallel

---

## 4. --run-parallel 매니페스트 형식

```json
{
  "maxParallel": 2,
  "summaryOutput": ".\\result",
  "jobs": [
    { "source": ".\\dummy.json", "runFile": ["TC-0001.json"], "output": ".\\result\\job1" },
    { "source": ".\\dummy.json", "runScenario": "SCM-0001.json", "output": ".\\result\\job2" }
  ]
}
```

> - `--run-parallel` 자신(-s 불필요), 각 job은 독립 서브프로세스이므로 job마다 `"source"` 필수
> - 모든 job은 자동 headless (OS 마우스 충돌 방지)

---

## 5. 설정 파일 추가 항목 설계

`pipeline_v21.txt` / `pipeline_v24.txt`에 아래 항목 추가:

```ini
# ─── [6] TestPro ──────────────────────────────────────────
# 이 단계 활성화 여부 (Y = 실행, N = 건너뜀, 기본 N)
TestProEnabled=N

# JEBI_Main.exe 경로
JebiExePath=C:\Users\sjrnfl13\Documents\Amaranth10\JEBI_Main.exe

# -s/--source 형식상 필수값 — 내용 불사용, 없으면 work\<대상>\dummy.json 자동 생성 ({})
TestSourceFile=

# 실행 모드: scenario | file | parallel
TestMode=scenario

# scenario 모드: 시나리오 JSON 파일 경로
TestScenarioFile=

# file 모드: TC JSON 경로 목록 (파이프 | 구분)
TestTCFiles=

# parallel 모드: parallel-manifest.json 경로
TestParallelManifest=

# 실행 결과 저장 폴더 (비우면 work\<대상>\test-result 자동)
TestOutputDir=

# 환경변수 JSON (--vars). 비우면 치환 안 함
TestVarsFile=

# 시나리오 ID (결과 파일명용). 비우면 엔진 기본값
TestScenarioId=

# 브라우저: Y이면 --headless 추가 (기본 Y — CI/CD 환경)
TestHeadless=Y

# 중복 사전 TC 건너뛰기 (기본 N)
TestSkipDuplicatePreconditions=N

# 페이지 오류 시 Fail 처리 강제 (기본 N)
TestFailOnPageError=N

# 최대 실행 대기 시간(초). 0 = 무제한 (기본 600)
TestTimeoutSec=600
```

---

## 6. 단계 흐름

현행 `[5] Chrome` 이후에 `[6] TestPro` 단계 삽입.

```
[5] Chrome 실행 (선택)
     ↓
[6] TestPro — JEBI_Main.exe CLI 실행
  ├─ [6-0] Preflight
  │    ├─ TestProEnabled=N  →  ⏭ SKIPPED (성공으로 처리)
  │    ├─ JebiExePath 존재 확인  →  없으면 FAIL
  │    ├─ TestMode 유효성 확인 (scenario | file | parallel)
  │    ├─ 모드별 필수 값 확인
  │    │    scenario  →  TestScenarioFile 존재
  │    │    file      →  TestTCFiles 1개 이상
  │    │    parallel  →  TestParallelManifest 존재
  │    ├─ TestSourceFile 비어있으면 work\<대상>\dummy.json 자동 생성 ({})
  │    └─ TestOutputDir 비어있으면 work\<대상>\test-result 자동 설정
  │         → 기존 폴더 삭제 후 재생성
  │
  ├─ [6-1] 실행
  │    scenario 모드:
  │      JEBI_Main.exe -s <src> --run-scenario <SCM>
  │                    --output <dir> [--vars <env>] [--headless]
  │                    [--scenario-id <id>]
  │                    [--skip-duplicate-preconditions] [--fail-on-page-error]
  │
  │    file 모드:
  │      JEBI_Main.exe -s <src> --run-file <TC1> <TC2> ...
  │                    --output <dir> [--vars <env>] [--headless]
  │                    [--scenario-id <id>]
  │                    [--skip-duplicate-preconditions] [--fail-on-page-error]
  │
  │    parallel 모드:
  │      JEBI_Main.exe --run-parallel <manifest>
  │                    (각 job은 자동 headless)
  │
  ├─ [6-2] 결과 분석
  │    종료코드 0         →  TEST_PASS
  │    종료코드 15/27/33  →  TEST_FAIL  (실행은 됐으나 결과 Fail)
  │    종료코드 1~5       →  ENGINE_ERROR  (설정/인수 오류)
  │    종료코드 그 외     →  ENGINE_ERROR  (로드/실행 실패)
  │    TimeoutSec 초과    →  TIMEOUT → 프로세스 강제 종료 → FAIL
  │
  └─ [6-3] 결과 파일 집계
       TestOutputDir 안의 result JSON 파싱
       → Pass / Fail / Skip 수 집계
       → 로그 및 요약에 포함
```

---

## 7. 요약 출력 형식 (변경 후)

```
[ v21 ] ✅ SUCCESS | 21.0.0.9999 | 3b64f73
         Deploy 47.7s / Publish 2.2s / TestPro ✅ Pass 52, Fail 0 (18.4s)
         http://172.10.12.46:8080/auto_v21/index.html

[ v24 ] ⚠️  TEST_FAIL | 24.0.0.9999 | 1a69f17
         Deploy 84.6s / Publish 5.6s / TestPro ❌ Pass 48, Fail 4 (종료코드 27, 32.1s)
         http://172.10.12.46:8080/auto_v24/index.html
         결과 폴더: work\v24\test-result\
```

---

## 8. 종료 코드 정책

| 상황 | 파이프라인 종료코드 |
|------|-------------------|
| TestProEnabled=N (건너뜀) | 기존 로직 그대로 (Deploy/Publish 기준) |
| TEST_PASS (종료코드 0) | 0 (성공) |
| TEST_FAIL (종료코드 15/27/33) | **1** — 배포 성공이어도 테스트 실패면 전체 실패 |
| ENGINE_ERROR / TIMEOUT | 1 |

---

## 9. 구현 대상 파일

| 파일 | 작업 내용 |
|------|-----------|
| `auto_pipeline.ps1` | [6] TestPro 단계 함수 추가 |
| `auto_pipeline_standalone.bat` | 동일 로직 동기화 |
| `python/auto_pipeline.py` | Python 이식 |
| `pipeline_v21.txt` | TestPro 설정 항목 추가 |
| `pipeline_v24.txt` | TestPro 설정 항목 추가 |
| `README.md` | [6] 단계 설명 추가 |
