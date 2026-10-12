# AutoPipeline 실행 옵션

`auto_pipeline.bat` / `auto_pipeline_standalone.bat` 실행 시 줄 수 있는 옵션 정리. (2026-10-08 기준 코드)

- 옵션은 **이번 실행에만** 적용된다. `pipeline_v21.txt` / `pipeline_v24.txt` 는 바뀌지 않는다.
- 옵션을 주지 않으면 txt 설정대로 동작한다.
- 옵션 이름은 대소문자를 구분하지 않는다 (`-skipgit` = `-SkipGit`).

---

## 1. 전체 요약

```bat
auto_pipeline.bat            [v21|v24|all] [-Block 1|2|3|2,3] [-Branch <name>] [-SourceType git|package] [-Build <folder>]
                             [-UpdateJar] [-SkipGit] [-OnlyIfChanged] [-OpenBrowser|-NoBrowser] [-DevTools]

auto_pipeline_standalone.bat [v21|v24|all] [-Block 1|2|3|2,3] [-Branch <name>] [-SourceType git|package] [-Build <folder>]
                             [-UpdateJar] [-SkipGit] [-OnlyIfChanged] [-OpenBrowser|-NoBrowser] [-DevTools] [-Help]
```

| 옵션 | 값 | 기본값 | 덮어쓰는 txt 키 | 하는 일 |
|---|---|---|---|---|
| `v21` / `v24` / `all` | — | `all` | — | 실행 대상. `all` 은 v21 → v24 순서로 하나씩 실행 |
| `-Block <번호>` | `1` / `2` / `3` 조합 | `1,2,3` (전체) | (`3` 포함 시 `TestProEnabled` 무시) | 지정한 블럭만 실행. 1 다운로드 / 2 배포 / 3 TestPro (2-0) |
| `-Branch <이름>` | 브랜치명 | txt 의 `Branch` | `Branch` | 받을 소스 브랜치 지정 |
| `-SourceType git\|package` | `git` / `package` | txt 의 `SourceType` (없으면 `git`) | `SourceType` | lib 을 git 소스로 만들지, 빌드된 `nexacrolib.zip` 을 쓸지 |
| `-Build <빌드 폴더>` | 빌드 폴더명 | txt 의 `PackageBuild` (없으면 `latest`) | `PackageBuild` | package 방식에서 사용할 빌드 지정 |
| `-UpdateJar` | — | 꺼짐 | — | Deploy JAVA 엔진(Jar)을 서버 최신 버전과 비교해 갱신 |
| `-SkipGit` | — | 꺼짐 | — | git 원격 확인 / clone / fetch / pull 생략 |
| `-OnlyIfChanged` | — | 꺼짐 | — | 지난 성공 이후 변경이 없으면 배포하지 않고 건너뜀 |
| `-OpenBrowser` | — | 꺼짐 | `OpenBrowser` | 게시 후 Chrome 실행 |
| `-NoBrowser` | — | 꺼짐 | `OpenBrowser` | Chrome 실행 안 함 (`-OpenBrowser` 보다 우선) |
| `-DevTools` | — | 꺼짐 | — | Chrome 실행 시 개발자도구 자동 오픈 |
| `-Help` | — | — | — | 사용법 출력 (**standalone 만**) |

---

## 2. 옵션 상세

### 2-0. `-Block <번호>` (블럭 실행)

| 블럭 | 하는 일 |
|---|---|
| `1` 다운로드 | Jar 엔진 확인/설치 + 소스 받기(git) 또는 zip(package) + lib 구성 → `work\<v>\nexacrolib`, `block1_state.json` |
| `2` 배포 | Deploy + Tomcat 기동/게시 + Chrome. 블럭 1 이 만들어 둔 lib 사용 (없으면 FAIL) |
| `3` TestPro | JEBI_Main.exe 실행. `-Block` 에 `3` 이 있으면 `TestProEnabled=N` 이어도 실행 |

```bat
auto_pipeline.bat v21 -Block 1      :: 다운로드만
auto_pipeline.bat v21 -Block 2      :: 배포만
auto_pipeline.bat v21 -Block 3      :: TestPro 만
auto_pipeline.bat v21 -Block 2,3    :: 배포 + TestPro  (= -Block 23 = -Block 2 3)
```

- 생략하면 1 → 2 → 3 전체 (TestPro 는 `TestProEnabled=Y` 일 때만, 기존과 같음)
- 블럭 전용 옵션을 해당 블럭 없이 쓰면 **오류** (종료 코드 2)
  - 블럭 1 전용: `-Branch`, `-SourceType`, `-Build`, `-UpdateJar`, `-SkipGit`, `-OnlyIfChanged`
  - 블럭 2 전용: `-OpenBrowser`, `-NoBrowser`, `-DevTools`
- 상세: [README.md](README.md) 1장 "블럭 실행"

### 2-1. 실행 대상: `v21` / `v24` / `all`

| 값 | 동작 |
|---|---|
| `all` (생략 시) | v21 을 [0]~[6] 끝까지 처리한 뒤 v24 처리. 동시에 실행하지 않음 |
| `v21` | v21 만 |
| `v24` | v24 만 |

- txt 의 `Enabled=N` 인 대상은 지정해도 **건너뛴다** (결과 `DISABLED`)
- `all` 에서 v21 이 실패해도 v24 는 계속 진행 (종료 코드는 1)
- ⚠ `auto_pipeline.bat` 은 대상을 **반드시 첫 번째 인자**로 써야 한다 (3장)

### 2-2. `-Branch <이름>`

txt 의 `Branch` 대신 이 브랜치로 소스를 받는다.

```bat
auto_pipeline.bat v21 -Branch RELEASE/REL_26.05.19.00_21.0.0.2100
```

- **대상 하나일 때만** 사용 가능 (`all` 과 함께 쓰면 오류, 종료 코드 2)
- 소스 폴더는 txt 의 `SourceDir=D:\git\{Branch}` 규칙으로 정해진다
  - `master_21` → `D:\git\master_21` (기존 폴더)
  - `RELEASE/REL_26.05.19.00_21.0.0.2100` → `D:\git\RELEASE\REL_26.05.19.00_21.0.0.2100` (없으면 **full clone**, 처음엔 수십 분)
- 브랜치명에 버전(`_21.0.0.N` / `_24.0.0.N`)이 있으면 대상 버전과 맞는지 **받기 전에** 검사
- 원격에 없는 브랜치면 즉시 실패
- package 방식에서는 공유 폴더의 브랜치 폴더 선택에 쓰인다 (`RELEASE/REL_x` → `REL_x`)
- 브랜치명에 공백은 쓸 수 없다

### 2-3. `-SourceType git|package`

| 값 | lib(nexacrolib + generate) 구성 방법 |
|---|---|
| `git` | git 소스(`SourceDir`)에서 받고 → `Lib\FrameworkJS` 복사, UTF-8 BOM 변환, generate 구성 |
| `package` | 공유 폴더의 빌드된 `nexacrolib.zip` 을 받아 압축 해제 (BOM 변환 없음, [2] 단계 생략) |

```bat
auto_pipeline.bat v24 -SourceType package
```

- package 방식은 txt 에 `PackageRoot` 또는 `PackagePath` 가 있어야 한다 (현재 v21 은 비어 있음 → 오류)
- 잘못된 값(`-SourceType svn` 등)은 오류, 종료 코드 2

### 2-4. `-Build <빌드 폴더>`

package 방식에서 사용할 빌드 폴더를 지정한다. 생략하면 가장 최근 빌드(`latest`).

```bat
auto_pipeline.bat v24 -SourceType package -Build 2026.7.30.9(24.0.0.9991)
```

- 찾는 위치: `PackageRoot\<브랜치 폴더>\<빌드 폴더>\nexacrolib.zip`
- **대상 하나일 때만** 사용 가능
- txt 에 `PackagePath` 가 있으면 무시된다 (경고 출력)
- 괄호가 들어간 이름도 그대로 쓰면 된다
- `-SourceType git` 일 때는 영향 없음

### 2-5. `-UpdateJar`

배포 엔진(Deploy JAVA Jar)을 사내 서버의 최신 버전과 비교해서 갱신한다.

- 서버: `http://59.10.169.82:9900/NexacroN/serverN/Deploy_JAVA/분리_Jar/` (최신 연도 폴더의 최신 파일)
- 설치 위치: txt 의 `JarDir` (`AutoPipeline\work\jar`)
- 설치된 버전과 같으면 다운로드 생략
- 다운로드·검증이 끝난 뒤 교체하므로 실패해도 기존 엔진은 유지 (종료 코드는 1)
- 옵션이 없어도 `work\jar` 에 엔진이 **없으면** 자동 설치한다
- 실행당 한 번만 수행 (대상 처리 전)

### 2-6. `-SkipGit`

git 관련 작업(원격 확인, clone, fetch, pull)을 모두 건너뛰고 **현재 로컬 소스 그대로** 사용한다.

- 소스 폴더가 git 저장소로 이미 있어야 한다 (없으면 실패)
- lib 만들기 / 배포 / 게시는 그대로 진행
- 빠른 재배포 확인용
- package 방식에는 영향 없음

### 2-7. `-OnlyIfChanged`

지난번 **성공** 이후 바뀐 것이 없으면 배포하지 않고 건너뛴다 (결과 `UNCHANGED`, 실패 아님). 작업 스케줄러용.

| 방식 | 비교 기준 | 기록 파일 |
|---|---|---|
| git | 원격 브랜치 최신 커밋 해시 (clone/fetch 전에 1초 내 확인) | `work\<v>\last_success_hash_<브랜치>.txt` |
| package | zip 경로 + 크기 + 수정 시각 | `work\<v>\last_success_package_<브랜치>.txt` |

- 실패한 실행은 기록되지 않으므로 다음 실행에서 다시 시도한다
- `-SkipGit` 과 함께 쓰면 git 방식에서는 비교를 하지 않는다

### 2-8. `-OpenBrowser` / `-NoBrowser` / `-DevTools`

게시 후 Chrome 실행 여부. 결정 순서:

| 우선순위 | 조건 | Chrome |
|---|---|---|
| 1 | `-NoBrowser` | 실행 안 함 |
| 2 | `-OpenBrowser` | 실행 |
| 3 | txt `OpenBrowser=Y` | 실행 |
| 4 | txt `OpenBrowser=N` 또는 없음 | 실행 안 함 |

- 주소는 PC IP 기준 (`ServerHost=auto` → 예: `http://172.10.12.46:8080/...`)
- 버전별 전용 Chrome 프로필 사용 (`work\<v>\chrome_profile`)
- `-DevTools` : Chrome 이 실행될 때만 의미 있음 (개발자도구 자동 오픈)

### 2-9. `-Help` (standalone 만)

```bat
auto_pipeline_standalone.bat -Help
```

사용법과 현재 설정 폴더(`PIPELINE_HOME`)를 출력하고 종료 (종료 코드 0). `-h`, `/?` 도 같다.
`auto_pipeline.bat` 은 지원하지 않는다.

---

## 3. 두 bat 의 차이

| 항목 | `auto_pipeline.bat` | `auto_pipeline_standalone.bat` |
|---|---|---|
| 구성 | `auto_pipeline.ps1` 호출 (같은 폴더에 있어야 함) | bat 한 파일 |
| 대상 위치 | **반드시 첫 번째 인자** (`v21 -SkipGit` ✅ / `-SkipGit v21` ❌) | 아무 위치나 가능 |
| 대상 생략 + 옵션만 | `auto_pipeline.bat -SkipGit` → `all` 로 실행 | 같음 |
| `-Help` | 없음 | 있음 |
| 모르는 옵션 | PowerShell 오류 메시지 | `[ERROR] Unknown argument: ...` (종료 코드 2) |
| 설정 폴더 | bat / ps1 이 있는 폴더 | bat 맨 위 `set "PIPELINE_HOME=..."` → 없으면 bat 폴더 |
| 파이프라인 동작 | 동일 | 동일 |

> 참고: `auto_pipeline.exe` 도 같은 옵션 + `-Home <설정 폴더>` 를 지원한다. 10/8 재빌드로 [6] TestPro 도 포함됐다. 상세: [python/OPTIONS.md](python/OPTIONS.md)

---

## 4. 옵션이 없는 설정 (txt 에서만 변경)

다음은 실행 옵션으로 바꿀 수 없고 `pipeline_<v>.txt` 에서만 바꾼다.

| 구분 | txt 키 |
|---|---|
| 대상 on/off | `Enabled` |
| 소스 / 패키지 위치 | `RepoUrl`, `SourceDir`, `PackageRoot`, `PackageZip`, `PackagePath`, `CloneMinFreeGB` |
| 프로젝트 / 작업 폴더 | `ProjectPath`, `WorkDir`, `JarDir`, `ExpectedVersion` |
| Tomcat 게시 | `TomcatHome`, `TomcatPort`, `ServerHost`, `WebContext`, `PublishSubDir`, `StartPage` |
| Chrome 경로 | `ChromePath` |
| TestPro ([6]) | `TestProEnabled`, `JebiExePath`, `TestMode`, `TestScenarioFile`, `TestTCFiles`, `TestParallelManifest`, `TestOutputDir`, `TestVarsFile`, `TestScenarioId`, `TestHeadless`, `TestSkipDuplicatePreconditions`, `TestFailOnPageError`, `TestTimeoutSec`, `TestSourceFile` |
| Deploy 플래그 | `-MERGE`, `-COMPRESS`, `-SHRINK` (txt 의 `-` 로 시작하는 줄) |

---

## 5. 상황별 사용 예

| 상황 | 명령 |
|---|---|
| 평소 실행 (txt 대로, v21 → v24) | `auto_pipeline.bat` |
| v21 만 | `auto_pipeline.bat v21` |
| 전체 확인 (Jar 최신화 + git 받기 + 배포) | `auto_pipeline.bat v21 -UpdateJar` |
| 소스는 그대로 두고 다시 배포만 | `auto_pipeline.bat v21 -SkipGit` |
| 배포 후 브라우저로 확인 | `auto_pipeline.bat v21 -OpenBrowser` |
| 개발자도구까지 열기 | `auto_pipeline.bat v21 -OpenBrowser -DevTools` |
| RELEASE 브랜치로 한 번만 | `auto_pipeline.bat v21 -Branch RELEASE/REL_26.05.19.00_21.0.0.2100` |
| v24 최신 빌드 패키지로 | `auto_pipeline.bat v24 -SourceType package` |
| v24 특정 빌드 패키지로 | `auto_pipeline.bat v24 -SourceType package -Build 2026.7.30.9(24.0.0.9991)` |
| v24 main 브랜치 최신 패키지 | `auto_pipeline.bat v24 -SourceType package -Branch main` |
| 작업 스케줄러 (바뀐 경우만, 브라우저 없이) | `auto_pipeline.bat all -UpdateJar -OnlyIfChanged -NoBrowser` |
| 도움말 | `auto_pipeline_standalone.bat -Help` |

---

## 6. 종료 코드

| 코드 | 의미 |
|---|---|
| 0 | 모든 대상이 `SUCCESS` / `UNCHANGED` / `DISABLED`, Jar 단계 성공 |
| 1 | 대상 중 하나라도 `FAIL` (TestPro 실패 포함), 또는 `-UpdateJar` 실패 |
| 2 | 옵션 오류 (예: `all -Branch`, `all -Build`, 잘못된 `-SourceType`, 모르는 옵션) — standalone / exe 기준 |

## 7. 옵션 오류 메시지

| 메시지 | 원인 |
|---|---|
| `-Branch needs a single target (v21 or v24)` | `all` 과 `-Branch` 를 함께 사용 |
| `-Build needs a single target (v21 or v24)` | `all` 과 `-Build` 를 함께 사용 |
| `-SourceType must be git or package` | `-SourceType` 값 오류 |
| `-Branch needs a branch name` / `-Build needs a build folder name` | 값 없이 옵션만 사용 (standalone) |
| `Unknown argument: ...` | 없는 옵션 |
| `-Block must be 1, 2, 3 or a combination such as 2,3` | `-Block` 값 오류 (예: `-Block 4`) |
| `<옵션> needs block N (got -Block ...)` | 블럭 전용 옵션을 해당 블럭 없이 사용 (예: `-Block 2 -SkipGit`) |
