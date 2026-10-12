# auto_pipeline.exe / auto_pipeline.py 실행 옵션

`python` 폴더의 실행 파일이 bat 과 같은 옵션을 받는지 확인한 결과. (2026-10-08 기준)
bat 옵션 자체의 설명은 상위 폴더의 [OPTIONS.md](../OPTIONS.md) 참고.

| 파일 | 수정 시각 | 비고 |
|---|---|---|
| `python\auto_pipeline.py` | 10/08 11:21 | 소스 (TestPro [6] 포함) |
| `python\build\auto_pipeline.exe` | 10/08 13:46 | Nuitka 빌드 결과 (TestPro + pull 생략 + `-Block`) |
| `..\auto_pipeline.exe` | 10/08 13:46 | 위 exe 복사본 |
| `python\build\auto_pipeline_20261008_1330.exe` | 10/08 | 백업: `-Block` 추가 전 (pull 생략까지) |
| `python\build\auto_pipeline_20261008_1217.exe` | 10/08 12:17 | 백업: TestPro 포함, pull 생략 전 |
| `python\build\auto_pipeline_20261001.exe` | 10/01 14:49 | 백업: 최초 빌드 (TestPro 없음) |

---

## 1. 결론

- **옵션은 bat 과 같다.** 같은 이름, 같은 값, 같은 종료 코드를 쓴다.
- exe/py 에만 있는 옵션은 **`-Home <설정 폴더>`** 하나다.
- py 와 exe 는 옵션 처리 결과가 **15개 경우 모두 같았다** (3장).
- 10/1 빌드 exe 에는 [6] TestPro 가 없었다 (10/1 이후 py 에 +170줄 추가). **10/8 12:17 에 재빌드해서 지금 exe 는 TestPro 를 포함한다** (4장).
  옵션 처리 코드는 10/1 이후 바뀌지 않아 재빌드 전후 옵션은 같다.

---

## 2. 옵션 비교

```bat
auto_pipeline.exe [v21|v24|all] [-Branch <name>] [-SourceType git|package] [-Build <folder>]
                  [-UpdateJar] [-SkipGit] [-OnlyIfChanged] [-OpenBrowser|-NoBrowser] [-DevTools]
                  [-Home <config folder>] [-Help]
```

py 로 실행할 때는 `python.exe auto_pipeline.py ...` 로 같은 옵션을 준다.

| 옵션 | `auto_pipeline.bat` | `auto_pipeline_standalone.bat` | exe / py |
|---|---|---|---|
| `v21` / `v24` / `all` | ✅ (첫 번째 인자만) | ✅ (아무 위치) | ✅ (아무 위치) |
| `-Target <v>` | ✅ | ✅ | ✅ |
| `-Block <번호>` (10/8 추가) | ✅ | ✅ | ✅ |
| `-Branch <이름>` | ✅ | ✅ | ✅ |
| `-SourceType git\|package` | ✅ | ✅ | ✅ |
| `-Build <폴더>` | ✅ | ✅ | ✅ |
| `-UpdateJar` | ✅ | ✅ | ✅ |
| `-SkipGit` | ✅ | ✅ | ✅ |
| `-OnlyIfChanged` | ✅ | ✅ | ✅ |
| `-OpenBrowser` / `-NoBrowser` | ✅ | ✅ | ✅ |
| `-DevTools` | ✅ | ✅ | ✅ |
| `-Help` | ❌ | `-Help`, `-h`, `/?` | `-Help`, `-h`, `/?`, `--help` |
| `-Home <폴더>` | ❌ | ❌ (bat 맨 위 `PIPELINE_HOME` 로 지정) | ✅ **exe/py 만** |

옵션 이름은 모두 대소문자를 구분하지 않는다.

### 2-1. `-Home <설정 폴더>` (exe/py 만)

`pipeline_v21.txt` / `pipeline_v24.txt` 가 있는 폴더를 지정한다. `logs\`, `work\` 도 이 폴더에 생긴다.

설정 폴더는 아래 순서로 찾아서 **txt 가 있는 첫 번째 폴더**를 쓴다.

| 순서 | 후보 |
|---|---|
| 1 | `-Home` 값 |
| 2 | 환경 변수 `PIPELINE_HOME` |
| 3 | exe(py) 폴더의 상위 폴더 (`python\` 에서 실행해도 `AutoPipeline\` 을 찾기 위함) |
| 4 | exe(py) 가 있는 폴더 |
| 5 | `D:\git\cursor_project\Tools\AutoPipeline` (소스에 고정된 기본값) |

> ⚠ **`-Home` 에 없는 폴더를 줘도 오류가 나지 않는다.** 다음 후보로 넘어가서 그 폴더 설정으로 **실제 배포가 실행된다.** 모든 후보에 txt 가 없을 때만 `pipeline_v21.txt / pipeline_v24.txt not found.` 오류(종료 코드 2)가 난다.
> 실행 로그 첫 줄 `[INFO] Config folder: ...` 로 실제로 사용한 폴더를 확인할 것.

### 2-2. bat 과 다르게 동작하는 부분

| 항목 | standalone bat | exe / py |
|---|---|---|
| 값 없이 옵션만 사용 | `-Branch needs a branch name`, `-Build needs a build folder name`, `-SourceType` 은 `must be git or package (got '')` | 모두 `-<옵션> needs a value` |
| 값이 `-` 로 시작 (`-Branch -SkipGit`) | `-Branch`, `-Build` 만 오류 | 값을 받는 모든 옵션(`-Target`, `-Branch`, `-SourceType`, `-Build`, `-Home`)에서 오류 |
| 공백이 들어간 값 (`"a b"`) | 공백에서 잘려 오류 | 따옴표로 묶으면 그대로 받음 |
| 종료 코드 | 0 / 1 / 2 | 같음 |

평소 쓰는 방식(브랜치명·빌드 폴더명에 공백 없음)에서는 차이가 없다.

---

## 3. 확인 결과 (py vs exe)

파이프라인이 실제로 돌지 않고 옵션 처리 단계에서 끝나는 경우만 실행했다 (각 20초 제한).

| 인자 | py | exe | 출력 |
|---|---|---|---|
| `-Help` | 0 | 0 | 사용법 |
| `-h` | 0 | 0 | 사용법 |
| `/?` | 0 | 0 | 사용법 |
| `--help` | 0 | 0 | 사용법 |
| `v21 -Foo` | 2 | 2 | `Unknown argument: -Foo  (use -Help)` |
| `all -Branch x` | 2 | 2 | `-Branch needs a single target (v21 or v24)` |
| `all -Build x` | 2 | 2 | `-Build needs a single target (v21 or v24)` |
| `v24 -SourceType svn` | 2 | 2 | `-SourceType must be git or package (got 'svn')` |
| `v21 -Branch` | 2 | 2 | `-Branch needs a value` |
| `v21 -Branch -SkipGit` | 2 | 2 | `-Branch needs a value` |
| `v21 -Build` | 2 | 2 | `-Build needs a value` |
| `-Target v99` | 2 | 2 | `Invalid target: v99` |
| `-Target` | 2 | 2 | `-Target needs a value` |
| `V21 -Branch` | 2 | 2 | `-Branch needs a value` (대문자 대상 인식) |
| `v21 -Home` | 2 | 2 | `-Home needs a value` |

- `-Home <없는 폴더>` 는 2-1 의 이유로 실제 배포가 시작되므로 실행 시험에서 뺐다 (코드로 확인).
- 정상 옵션(`-SkipGit`, `-UpdateJar` 등)의 실제 동작은 10/1 에 exe 로 확인했다 (History `20261001_1513.md`). 단 package 방식 전체 배포는 exe 로는 아직 안 해봤다.

---

## 4. 재빌드 확인 (10/8)

`python\build_exe.bat` 로 재빌드 (Nuitka, gcc 15.2.0) → 종료 코드 0. 기존 exe 는 `python\build\auto_pipeline_20261001.exe` 로 백업.

| 확인 | 결과 |
|---|---|
| 두 위치 exe 동일 여부 | SHA256 `85fb6af5…2739` 동일 (6,407,680 bytes) |
| 옵션 처리 (3장 중 7개 재실행) | 재빌드 전과 같음 |
| 실제 실행 `v21 -SkipGit -NoBrowser -Home <임시 설정>` | [0]~[5] 성공 (Deploy 성공 335 / 실패 0, 46.3초), **[6] TestPro 단계 진입** 확인 |

- 실제 실행은 임시 설정 폴더(작업 폴더 분리, `WebContext=auto_tptest`, `TestProEnabled=Y`, `TestScenarioFile` 비움)로 했다. 의도대로 `TestScenarioFile is required when TestMode=scenario` 로 [6] 에서 멈췄다 (종료 코드 1). 테스트 후 임시 폴더와 `webapps\auto_tptest` 는 삭제했다.
- JEBI_Main.exe 로 시나리오를 끝까지 돌리는 시험은 아직 안 했다 (시나리오 파일 미정).

---

## 5. 사용 예

| 상황 | 명령 |
|---|---|
| 평소 실행 | `auto_pipeline.exe` |
| v21 만, 소스 그대로 재배포 | `auto_pipeline.exe v21 -SkipGit` |
| 설정 폴더를 직접 지정 | `auto_pipeline.exe v21 -Home D:\AutoPipeline` |
| 작업 스케줄러 | `auto_pipeline.exe all -UpdateJar -OnlyIfChanged -NoBrowser` |
| py 로 실행 (Python PATH 미등록) | `%LOCALAPPDATA%\Programs\Python\Python312\python.exe python\auto_pipeline.py v21 -SkipGit` |
| 도움말 | `auto_pipeline.exe -Help` |
