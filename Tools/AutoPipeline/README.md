# AutoPipeline

(선택) 사내 서버에서 최신 Deploy JAVA 엔진을 받고, Git 서버에서 Nexacro N 엔진 소스를 받아 `nexacrolib`를 구성하고, Nexacro Deploy(JAVA CLI)로 프로젝트를 배포한 뒤, 결과물을 Tomcat에 게시하여 Chrome으로 실행하는 **무인 자동화 파이프라인**.

- 대상: **Nexacro N v21**, **Nexacro N v24**
- 기존 `Tools\*.bat` / `Tools\*.ps1` 은 **사용·수정하지 않음**. 모든 로직은 이 폴더 안의 새 파일에 있음
- 작성일: 2026-10-01

---

## 1. 사용법

실행 파일은 두 가지이며 **동작과 옵션이 같다**. 위치를 옮겨 쓸 경우 단일 파일 버전을 사용한다 (자세한 내용은 10장).

| 실행 파일 | 구성 | 위치 |
|---|---|---|
| `auto_pipeline.bat` + `auto_pipeline.ps1` | bat 이 ps1 호출 | bat·ps1·txt 가 **같은 폴더**에 있어야 함 |
| `auto_pipeline_standalone.bat` | bat 한 파일에 PowerShell 포함 | **어디로 옮겨도 됨** (`PIPELINE_HOME` 으로 txt 폴더 지정) |

```bat
auto_pipeline.bat            [v21|v24|all] [-UpdateJar] [-SkipGit] [-OnlyIfChanged] [-OpenBrowser|-NoBrowser] [-DevTools]
auto_pipeline_standalone.bat [v21|v24|all] [-UpdateJar] [-SkipGit] [-OnlyIfChanged] [-OpenBrowser|-NoBrowser] [-DevTools] [-Help]
```

| 인자 / 옵션 | 설명 |
|---|---|
| `v21` / `v24` / `all` | 실행 대상. 생략 시 `all` (v21 → v24 순차 실행) |
| `-UpdateJar` | 서버의 최신 Deploy JAVA 엔진을 확인하여 `work\jar` 에 설치. 설치본과 같으면 다운로드 생략 |
| `-SkipGit` | git fetch/checkout/pull 생략 (현재 로컬 소스로 배포) |
| `-OnlyIfChanged` | 원격 커밋이 마지막 성공 이후 바뀌지 않았으면 해당 대상 건너뜀 (스케줄러용) |
| `-OpenBrowser` | 이번 실행만 Chrome 실행 (설정 `OpenBrowser=N` 이어도 실행) |
| `-NoBrowser` | 이번 실행만 Chrome 실행 안 함 (설정 `OpenBrowser=Y` 이어도 생략, `-OpenBrowser` 보다 우선) |
| `-DevTools` | Chrome 실행 시 개발자도구 자동 오픈 |

**Chrome 실행 여부 결정** — 기본은 **실행하지 않음**

| 우선순위 | 조건 | Chrome |
|---|---|---|
| 1 | `-NoBrowser` 지정 | 실행 안 함 |
| 2 | `-OpenBrowser` 지정 | 실행 |
| 3 | 설정 `OpenBrowser=Y` (`YES`/`TRUE`/`1` 도 가능) | 실행 |
| 4 | 설정 `OpenBrowser=N` 또는 키 없음 | 실행 안 함 (기본) |

### 예시

```bat
rem v21만 실행 (기본: Chrome 실행 안 함)
auto_pipeline.bat v21

rem v21, v24 모두 실행 + Chrome 으로 결과 확인
auto_pipeline.bat all -OpenBrowser

rem 소스 갱신 없이 v24 재배포 + Chrome + DevTools
auto_pipeline.bat v24 -SkipGit -OpenBrowser -DevTools

rem 스케줄러용: 엔진 최신화 + 새 커밋이 있을 때만 (설정이 Y 여도 브라우저 생략)
auto_pipeline.bat all -UpdateJar -OnlyIfChanged -NoBrowser
```

**대상별 실행 여부 (`Enabled`)** — 기본은 **실행**

각 `pipeline_<대상>.txt` 의 `Enabled` 로 v21 / v24 를 개별로 켜고 끈다.

| 설정 | 동작 |
|---|---|
| `Enabled=Y` / 키 없음 / 빈 값 | 실행 (기본) |
| `Enabled=N` (`NO` / `FALSE` / `0` 도 가능) | 건너뜀 → 요약에 `DISABLED` 표시 |

- `all` 은 물론 `v21` / `v24` 를 직접 지정해도 txt 의 `Enabled=N` 이 적용된다
- 꺼진 대상은 `[jar]` 엔진 확인 대상에서도 제외된다

종료 코드: 모든 대상이 `SUCCESS` / `UNCHANGED` / `DISABLED` 이고 Jar 단계가 실패하지 않았으면 `0`, 그 외 `1`.

---

## 2. 파일 구성

```
Tools\AutoPipeline\
├── auto_pipeline.bat      ← 실행 진입점 (인자 정리 후 ps1 호출)
├── auto_pipeline.ps1      ← 파이프라인 본체 (단계 0~5)
├── auto_pipeline_standalone.bat ← 단일 파일 버전 (bat + PowerShell 통합, 위치 이동 가능)
├── pipeline_v21.txt       ← v21 설정
├── pipeline_v24.txt       ← v24 설정
├── README.md              ← 이 문서
├── logs\                  ← 실행 로그 (yyyyMMdd_HHmmss_<대상>.log)
└── work\                  ← 작업 폴더 (실행 시 자동 생성)
    ├── jar\                         ← Deploy JAVA 엔진 (v21/v24 공용, [jar] 단계가 설치)
    │   ├── NexacroN_Deploy_JAVA_...\    (bin\start.bat, libs\*.jar, log4j2.xml)
    │   └── installed_package.txt    ← 설치된 서버 패키지 파일명 (최신 여부 비교용)
    ├── jar_staging\                 ← 다운로드 임시 폴더 (성공 시 삭제)
    ├── v21\
    │   ├── nexacrolib\nexacrolib\   ← 엔진 소스에서 구성한 라이브러리 (-B)
    │   ├── nexacrolib\generate\     ← Generate/CSS Rule (-CSSRULE / -GENERATERULE)
    │   ├── output\<프로젝트명>\       ← 빌드 중간 산출물 (-O). 프로젝트명 = xprj 파일명 (예: TC_NexaV21)
    │   ├── deploy\                  ← 배포 결과물 (-D) → Tomcat 으로 미러링
    │   ├── chrome_profile\          ← v21 전용 Chrome 프로필
    │   └── last_success_hash.txt    ← 마지막 성공 커밋 (-OnlyIfChanged 비교용)
    └── v24\  (동일 구조)
```

**게시 위치 (Tomcat)**

| 대상 | 폴더 | URL |
|---|---|---|
| v21 | `apache-tomcat-11.0.25\webapps\auto_v21` | http://172.10.12.46:8080/auto_v21/index.html |
| v24 | `apache-tomcat-11.0.25\webapps\auto_v24` | http://172.10.12.46:8080/auto_v24/index.html |

> URL 은 `localhost` 가 아닌 **이 PC 의 IP** 로 만든다 (`ServerHost=auto`, 현재 `172.10.12.46`). 같은 네트워크의 다른 PC 에서도 같은 주소로 접속할 수 있다.

> 게시 위치는 설정의 `WebContext` / `PublishSubDir` 로 바꿀 수 있다 (5장 참고).
> ⚠ 게시 폴더와 **같은 이름의 폴더가 이미 있으면 통째로 삭제한 뒤 새로 복사**한다.
> 예를 들어 `WebContext=nexacroN_v24`, `PublishSubDir=` 로 지정하면 기존 `webapps\nexacroN_v24` 전체가 지워진다.
> 단, `webapps` 밖이나 Tomcat 기본 앱 전체(`ROOT`, `manager`, `host-manager`, `docs`, `examples`)는 거부한다.

---

## 3. 전체 흐름도

```mermaid
flowchart TD
    A([▶ auto_pipeline.bat 실행]) --> A1["auto_pipeline.ps1 호출\n-Target v21 | v24 | all"]
    A1 --> A2["로그 시작\nlogs\yyyyMMdd_HHmmss_대상.log"]
    A2 --> J0{"🧰 [jar] (Enabled 대상만)\n-UpdateJar 지정\n또는 JarDir 에 엔진 없음?"}
    J0 -- No --> LOOP
    J0 -- Yes --> J1["서버 목록 조회\n최신 연도 폴더 → 이름 내림차순 첫 zip/jar"]
    J1 --> J2{"installed_package.txt\n== 서버 최신 파일명?"}
    J2 -- Yes --> J9["⏭ up to date\n(다운로드 생략)"]
    J2 -- No --> J3["jar_staging 에 다운로드\n1차 압축 해제 → 중첩 zip 2차 해제"]
    J3 --> J4{"start.bat 있음?"}
    J4 -- No --> J8["❌ jar FAIL\n기존 엔진 유지"]
    J4 -- Yes --> J5["work\jar 교체\ninstalled_package.txt 기록\nstaging 삭제"]
    J5 --> LOOP
    J9 --> LOOP
    J8 --> LOOP
    LOOP{{"대상 반복\n(all = v21 → v24 순차)"}}

    LOOP --> CFG["pipeline_대상.txt 읽기\n필수 키 검사"]
    CFG --> CFG1{누락 키?}
    CFG1 -- 있음 --> FAIL
    CFG1 -- 없음 --> EN{"Enabled=N ?\n(기본 Y)"}
    EN -- Yes --> DIS["⏭ DISABLED\n(이 대상 건너뜀)"]
    EN -- No --> S0

    %% Step 0
    S0["🔍 [0] Preflight\nSourceDir / ProjectPath / TomcatHome / JarDir 존재\n게시 폴더 확인 (webapps 안, Tomcat 기본 앱 전체 아님)\nJAVA_HOME\bin\java.exe 확인\nJar\**\start.bat 탐색 → JarRoot\nChrome 실행 여부 결정 (실행 시 chrome.exe 확인)"]
    S0 --> S0R{통과?}
    S0R -- No --> FAIL
    S0R -- Yes --> S1

    %% Step 1
    S1{"📥 [1] Git update\n-SkipGit?"}
    S1 -- Yes --> S1H
    S1 -- No --> S1a["git status --porcelain\n로컬 변경 있으면 중단"]
    S1a --> S1b["git fetch origin 브랜치"]
    S1b --> S1c{"-OnlyIfChanged\n& 원격 해시 == 마지막 성공 해시?"}
    S1c -- Yes --> UNCH["⏭ UNCHANGED\n(이 대상 건너뜀)"]
    S1c -- No --> S1d["git checkout 브랜치\ngit pull --ff-only origin 브랜치"]
    S1d --> S1H["커밋 해시 / 메시지 기록"]
    S1H --> S2

    %% Step 2
    S2["📦 [2] Framework copy\nwork\대상\nexacrolib 초기화\nLib\FrameworkJS\{component,framework,resources}\n+ nexacrolib.json 복사"]
    S2 --> S2a{"nexacrolib.json version 앞 2자리\n== ExpectedVersion?"}
    S2a -- No --> FAIL
    S2a -- Yes --> S2b["JS 파일 UTF-8 BOM 변환"]
    S2b --> S2c{ExpectedVersion}
    S2c -- 21 --> S2d["generate ← TiMetainfoLib\res"]
    S2c -- 24 --> S2e["generate ← TiMetainfoLib\res\n+ TiGenerateLib\Template\24"]
    S2d --> S3
    S2e --> S3

    %% Step 3
    S3["⚙️ [3] Deploy\noutput\프로젝트명 / deploy 초기화\njava -classpath JarRoot\libs\*\ncom.nexacro.build.cli.Main\n-P -B -O RULE -D + -MERGE -COMPRESS"]
    S3 --> S3a{"v21: -CSSRULE\nv24: -GENERATERULE"}
    S3a --> S3b{"exit code 0\n& deploy 폴더에 파일 있음?"}
    S3b -- No --> FAIL
    S3b -- Yes --> S4

    %% Step 4
    S4{"🌐 [4] Publish\nTomcat 포트 LISTEN?"}
    S4 -- No --> S4a["catalina.bat start\n최대 60초 대기"]
    S4a --> S4b{기동됨?}
    S4b -- No --> FAIL
    S4b -- Yes --> S4c
    S4 -- Yes --> S4x{"같은 이름 폴더\n이미 있음?"}
    S4x -- Yes --> S4y["🗑 기존 폴더 전체 삭제\n(삭제 파일 수 로그)"]
    S4x -- No --> S4c
    S4y --> S4c["robocopy /E\ndeploy → webapps\WebContext\PublishSubDir"]
    S4c --> S4d["시작 페이지 결정\nStartPage → index.html → 첫 *.html"]
    S4d --> S4e{"HTTP 200\n(최대 60초)?"}
    S4e -- No --> FAIL
    S4e -- Yes --> S5

    %% Step 5
    S5{"🖥 [5] Chrome 실행?\n-NoBrowser → 안 함\n-OpenBrowser → 실행\n그 외 OpenBrowser=Y|N (기본 N)"}
    S5 -- 안 함 --> OK
    S5 -- 실행 --> S5a["chrome.exe\n--user-data-dir=work\대상\chrome_profile\n--disk-cache-size=1 --new-window URL"]
    S5a --> OK

    OK["✅ SUCCESS\nlast_success_hash.txt 갱신"] --> NEXT
    UNCH --> NEXT
    DIS --> NEXT
    FAIL["❌ FAIL\n오류 메시지 기록"] --> NEXT
    NEXT{다음 대상?} -- 있음 --> LOOP
    NEXT -- 없음 --> SUM["📋 요약 출력\n대상별 상태 / 버전 / 커밋 / URL / 단계별 시간"]
    SUM --> END([종료 코드: FAIL 있으면 1, 없으면 0])

    style A fill:#4CAF50,color:#fff
    style END fill:#4CAF50,color:#fff
    style OK fill:#4CAF50,color:#fff
    style FAIL fill:#f44336,color:#fff
    style UNCH fill:#9E9E9E,color:#fff
    style DIS fill:#9E9E9E,color:#fff
    style J8 fill:#f44336,color:#fff
    style J9 fill:#9E9E9E,color:#fff
```

---

## 4. 단계별 상세

### [jar] Deploy JAVA 엔진 설치 / 갱신

대상(v21/v24) 처리 전에 **실행당 1회** 수행. `Tools\update_jar.ps1` 과 같은 서버·같은 선택 규칙을 쓰지만, 이 폴더 안에 새로 구현했다.

**실행 조건**
- `-UpdateJar` 지정 시
- 또는 설정의 `JarDir` 에 `start.bat` 이 없을 때 (최초 실행 시 자동 설치)

**동작**

```
[1] http://59.10.169.82:9900/NexacroN/serverN/Deploy_JAVA/분리_Jar/ 목록에서 최신 연도(YYYY) 폴더 선택
[2] 연도 폴더 안의 .zip/.jar 를 이름 내림차순 정렬 → 첫 번째 = 최신
[3] work\jar\installed_package.txt 의 파일명과 같고 start.bat 이 있으면 → 다운로드 생략 (up to date)
[4] work\jar_staging\download.zip 으로 다운로드 → level1 에 1차 압축 해제
[5] level1 안의 중첩 zip 을 pkg 에 2차 해제, 그 외 파일(.json 등)은 pkg 로 이동
[6] pkg 에 start.bat 이 없으면 FAIL (work\jar 는 건드리지 않음)
[7] work\jar 비우고 pkg 내용 이동 → installed_package.txt 기록 → jar_staging 삭제
```

**기존 `update_jar.ps1` 과의 차이**

| 항목 | `Tools\update_jar.ps1` | AutoPipeline `[jar]` |
|---|---|---|
| 설치 위치 | `Tools\Jar` | `AutoPipeline\work\jar` (`Tools\Jar` 는 건드리지 않음) |
| 기존 엔진 삭제 시점 | 다운로드 **전** (실패 시 엔진 없음) | 다운로드·검증 **후** (실패 시 기존 엔진 유지) |
| 최신 여부 확인 | 없음 (항상 다운로드) | `installed_package.txt` 비교 후 같으면 생략 |
| 설치 검증 | 없음 | `start.bat` 존재 확인 |
| 단일 서브폴더 평탄화 | 수행 | 생략 (start.bat 을 재귀 탐색하므로 불필요) |

- `JarDir` 가 `AutoPipeline\work` 밖(예: `Tools\Jar`)이면 갱신을 거부한다 (기존 폴더 보호)
- Jar 단계가 실패해도 기존 엔진이 있으면 대상 처리는 그 엔진으로 계속 진행되며, 최종 종료 코드는 1

### [0] Preflight — 사전 점검

| 점검 항목 | 실패 시 |
|---|---|
| `SourceDir`, `ProjectPath`, `TomcatHome` 경로 존재 | FAIL |
| 게시 폴더가 `webapps` 안인지 (`..` 등으로 밖을 가리키면 거부) | FAIL |
| `PublishSubDir` 가 비어 있을 때 `WebContext` 가 Tomcat 기본 앱(`ROOT`, `manager`, `host-manager`, `docs`, `examples`)이 아닌지 | FAIL |
| `JavaHome`(설정) 또는 `%JAVA_HOME%` 의 `bin\java.exe` 존재 | FAIL |
| `JarDir` 하위에서 `start.bat` 재귀 탐색 → 상위 폴더를 `JarRoot` 로 사용 | FAIL (`-UpdateJar` 실행 안내) |
| Chrome 실행 여부 결정 (1장 표). 실행하는 경우에만 `chrome.exe` 존재 확인 | FAIL |

현재 환경에서 사용되는 값:
- Java: `C:\Program Files\Microsoft\jdk-25.0.4.101-hotspot` (시스템 `JAVA_HOME`, JDK 25)
- Jar: `AutoPipeline\work\jar\NexacroN_Deploy_JAVA_20260825(1.1.90)_1`

### [1] Git update — 엔진 소스 갱신

```
git status --porcelain              ← 출력이 있으면 중단 (로컬 수정 보호)
git fetch origin <Branch>
(-OnlyIfChanged) origin/<Branch> 해시 == last_success_hash.txt → UNCHANGED 로 건너뜀
git checkout <Branch>
git pull --ff-only origin <Branch>  ← fast-forward 만 허용 (merge 커밋 생성 안 함)
```

- `GIT_TERMINAL_PROMPT=0` 으로 인증 프롬프트 대기를 막음 (인증 실패 시 즉시 FAIL)
- 커밋 해시와 메시지를 요약에 기록

| 대상 | SourceDir | Branch |
|---|---|---|
| v21 | `D:\git\master_21` | `master_21` |
| v24 | `D:\git\master` | `master` |

### [2] Framework copy — nexacrolib / generate 구성

```
SourceDir\Lib\FrameworkJS\component        → work\<대상>\nexacrolib\nexacrolib\component
SourceDir\Lib\FrameworkJS\framework        → work\<대상>\nexacrolib\nexacrolib\framework
SourceDir\Lib\FrameworkJS\resources        → work\<대상>\nexacrolib\nexacrolib\resources
SourceDir\Lib\FrameworkJS\nexacrolib.json  → work\<대상>\nexacrolib\nexacrolib\nexacrolib.json
```

1. `work\<대상>\nexacrolib` 전체 삭제 후 재생성
2. 위 복사 (`robocopy /E`)
3. **버전 검증**: `nexacrolib.json` 의 `"version"` 앞 2자리가 `ExpectedVersion` 과 다르면 FAIL
   (잘못된 브랜치/폴더 지정 방지)
4. `nexacrolib\nexacrolib` 하위 모든 `.js` 를 UTF-8 BOM 으로 변환 (이미 BOM 이면 건너뜀)
5. Generate Rule 구성

| 버전 | `work\<대상>\nexacrolib\generate` 구성 |
|---|---|
| v21 | `Tools\Lib\TiMetainfoLib\res` |
| v24 | `Tools\Lib\TiMetainfoLib\res` + `Tools\Lib\TiGenerateLib\Template\24` |

### [3] Deploy — Nexacro Deploy JAVA CLI

`start.bat` 은 끝에 `pause` 가 있어 무인 실행이 멈추므로 **Java 를 직접 호출**한다.

```
java.exe -Dlog4j.configurationFile=<JarRoot>\log4j2.xml
         -classpath <JarRoot>\libs\*
         com.nexacro.build.cli.Main
         -P <ProjectPath>
         -B work\<대상>\nexacrolib\nexacrolib
         -O work\<대상>\output\<프로젝트명>         ← 프로젝트명 = xprj 파일명 (TC_NexaV21 / JEBI_TOPS_V24)
         <RULE> work\<대상>\nexacrolib\generate     ← v21: -CSSRULE / v24: -GENERATERULE
         -D work\<대상>\deploy
         -MERGE -COMPRESS                           ← 설정 파일의 '-' 플래그
```

- `output\<프로젝트명>`, `deploy` 폴더는 매번 삭제 후 재생성 (`work\<대상>` 밖은 삭제 불가하도록 가드)
  - `output` 아래 다른 프로젝트 폴더는 건드리지 않음
- 종료 코드가 0 이 아니거나 `deploy` 폴더가 비어 있으면 FAIL

| 대상 | ProjectPath |
|---|---|
| v21 | `D:\nexacro UI\TC_NexaV21\TC_NexaV21.xprj` |
| v24 | `D:\nexacro UI\JEBI_TOPS_V24\JEBI_TOPS_V24.xprj` |

### [4] Publish — Tomcat 게시

1. `TomcatPort`(8080) LISTEN 확인. 이미 실행 중이면 **재시작하지 않음**
2. 꺼져 있으면 `catalina.bat start` (JAVA_HOME = 위 Java) 후 최대 60초 대기
3. 게시 폴더 결정: `TomcatHome\webapps\<WebContext>[\<PublishSubDir>]` (`{Project}` → 프로젝트명 치환)
4. **같은 이름의 폴더가 이미 있으면 전체 삭제** (삭제한 파일 수를 로그에 기록). 누가 만든 폴더인지 구분하지 않는다
5. `robocopy /E work\<대상>\deploy → 게시 폴더` 로 새로 복사
6. 시작 페이지 결정: 설정 `StartPage` → `index.html` → deploy 루트의 첫 `*.html`
7. URL 호스트 결정: 설정 `ServerHost` 값. 비우거나 `auto` 이면 **이 PC 의 IPv4 자동 탐색**
   - 기본 게이트웨이가 있는 활성 어댑터의 IPv4 (현재 `이더넷` → `172.10.12.46`)
   - 없으면 `127.*` / `169.254.*` 를 제외한 첫 IPv4, 그것도 없으면 `localhost`
8. `http://<호스트>:<TomcatPort>/...` 가 HTTP 200 을 반환할 때까지 최대 60초 대기 (Tomcat 자동 배포 지연 대응). Chrome 도 같은 주소로 연다

**게시 위치 / URL 예시** (프로젝트 `TC_NexaV21`, `ServerHost=auto` → `172.10.12.46`)

| `WebContext` | `PublishSubDir` | 게시 폴더 (`webapps\...`) | URL | 판정 |
|---|---|---|---|---|
| `auto_v21` | (비움) | `auto_v21` | http://172.10.12.46:8080/auto_v21/index.html | 허용 (현재 설정, 있으면 삭제 후 복사) |
| `auto_v21` | `{Project}` | `auto_v21\TC_NexaV21` | http://172.10.12.46:8080/auto_v21/TC_NexaV21/index.html | 허용 |
| `nexacroN_v21` | `{Project}` | `nexacroN_v21\TC_NexaV21` | http://172.10.12.46:8080/nexacroN_v21/TC_NexaV21/index.html | 허용 (하위 폴더만 교체) |
| `nexacroN_v21` | (비움) | `nexacroN_v21` | http://172.10.12.46:8080/nexacroN_v21/index.html | 허용 ⚠ **기존 `nexacroN_v21` 전체 삭제** |
| `ROOT` | `{Project}` | `ROOT\TC_NexaV21` | http://172.10.12.46:8080/TC_NexaV21/index.html | 허용 (ROOT 는 URL 에서 생략) |
| `ROOT` | (비움) | `ROOT` | — | **거부** (Tomcat 기본 앱 전체) |

### [5] Chrome — 실행 (선택)

기본은 실행하지 않는다. `OpenBrowser=Y` 또는 `-OpenBrowser` 일 때만 아래와 같이 실행한다 (`-NoBrowser` 가 최우선).

```
chrome.exe --user-data-dir="work\<대상>\chrome_profile"
           --no-first-run --no-default-browser-check
           --disk-cache-size=1 --new-window
           [--auto-open-devtools-for-tabs]
           http://<ServerHost>:8080/<WebContext>/<PublishSubDir>/<StartPage>
```

- 버전별 **전용 프로필** 사용 → 평소 Chrome 과 분리, 캐시로 인한 이전 빌드 노출 방지, v21/v24 동시 실행 가능

---

## 5. 설정 파일 (`pipeline_v21.txt` / `pipeline_v24.txt`)

`키=값` 형식. `#` 은 주석, `-` 로 시작하는 줄은 Deploy CLI 플래그로 그대로 전달.

```ini
# AutoPipeline config - Nexacro N v21
# Run this target: Y | N (default Y). N = skipped even when run as 'v21' or 'all'.
Enabled=Y
ExpectedVersion=21
SourceDir=D:\git\master_21
Branch=master_21
ProjectPath=D:\nexacro UI\TC_NexaV21\TC_NexaV21.xprj
WorkDir=D:\git\cursor_project\Tools\AutoPipeline\work\v21
JarDir=D:\git\cursor_project\Tools\AutoPipeline\work\jar
TomcatHome=C:\Users\tobesoft\cursor\apache-tomcat-11.0.25
TomcatPort=8080
# URL host: auto (= this PC's IPv4) or a fixed IP / host name
ServerHost=auto
# Publish -> TomcatHome\webapps\<WebContext>\<PublishSubDir>  ({Project} = xprj file name)
# URL     -> http://<ServerHost>:<TomcatPort>/<WebContext>/<PublishSubDir>/<StartPage>
WebContext=auto_v21
PublishSubDir=
StartPage=
# Open Chrome after publish: Y | N (default N). -OpenBrowser / -NoBrowser override.
OpenBrowser=N
ChromePath=C:\Program Files\Google\Chrome\Application\chrome.exe
-MERGE
-COMPRESS
```

| 키 | 필수 | 설명 |
|---|---|---|
| `Enabled` | ➖ | 이 대상 실행 여부 `Y` / `N`. **비우거나 없으면 `Y` (실행)**. `N` 이면 `DISABLED` 로 건너뜀 |
| `ExpectedVersion` | ✅ | `21` / `24`. 버전 검증, RULE 옵션, Template\24 복사 여부 결정 |
| `SourceDir` | ✅ | 엔진 소스 git 저장소 루트 |
| `Branch` | ✅ | checkout / pull 할 브랜치 |
| `ProjectPath` | ✅ | 배포할 `.xprj` |
| `WorkDir` | ✅ | 버전별 작업 폴더. 삭제 작업은 이 폴더 안에서만 허용 |
| `JarDir` | ✅ | Deploy JAVA 엔진 폴더. `[jar]` 단계로 갱신하려면 `AutoPipeline\work` 안이어야 함 |
| `TomcatHome` | ✅ | Tomcat 루트 |
| `TomcatPort` | ✅ | Tomcat HTTP 포트 (`conf\server.xml` 기준 8080) |
| `ServerHost` | ➖ | URL 호스트. **비우거나 `auto` 이면 이 PC 의 IPv4 자동 탐색**. 고정하려면 `172.10.12.46` 처럼 IP 지정 (`localhost` 도 가능) |
| `WebContext` | ✅ | `webapps` 아래 컨텍스트 폴더명 (URL 첫 경로). `ROOT` 이면 URL 에서 생략. `{Project}` 사용 가능 |
| `PublishSubDir` | ➖ | 컨텍스트 안 하위 폴더. 비우면 컨텍스트 루트에 게시. `{Project}` 사용 가능 (예: `{Project}`, `test\{Project}`) |
| `StartPage` | ➖ | 비우면 자동 탐색 (`index.html` → 첫 `*.html`) |
| `OpenBrowser` | ➖ | 게시 후 Chrome 실행 여부 `Y` / `N`. **비우거나 없으면 `N` (실행 안 함)**. `-OpenBrowser` / `-NoBrowser` 가 우선 |
| `ChromePath` | ➖ | 비우면 `C:\Program Files\Google\Chrome\Application\chrome.exe` |
| `JavaHome` | ➖ | 비우면 시스템 `%JAVA_HOME%` 사용 |
| `-MERGE` / `-COMPRESS` / `-SHRINK` | ➖ | Deploy CLI 옵션 |

---

## 6. 기존 Tools 스크립트 대신 새로 만든 이유 (검토 결과)

기존 스크립트를 연결하는 방식을 검토하면서 아래 문제를 확인했고, 그래서 독립 파이프라인으로 새로 작성했다. **기존 파일은 그대로 두었다.**

| # | 기존 스크립트 | 문제 | AutoPipeline 의 처리 |
|---|---|---|---|
| 1 | `update_framework_v3.bat` | `get_version.ps1` / `convert_utf8bom.ps1` / `update_version.ps1` 이 `param()` 방식으로 바뀌었는데 bat 은 여전히 환경변수로 전달 → 버전 감지 실패 시 **v21 에도 Template\24 복사**, BOM 변환이 **현재 작업 폴더**를 대상으로 동작 | 함수로 내장, 경로를 명시적으로 전달 |
| 2 | `run_Deploy.bat` 12단계 | 버전과 무관하게 `"21.0.0.9999"` → `"24.0.0.9999"` 치환 → v21 결과물 오염 | 해당 단계 없음 (게시용 산출물에는 불필요) |
| 3 | 두 스크립트 | `pause`, config 다중 선택 프롬프트 → 무인 실행 중단 | 프롬프트 없음 |
| 4 | `deploy_config*.txt` | 존재하지 않는 `D:\git_prj\...`, `E:\git\extension2\WORK800` 경로 / `SourceDir` 1개만 지원 | 버전별 설정 파일, 실제 경로 사용 |
| 5 | 공유 폴더 | v21/v24 가 `cursor_project\nexacrolib` 를 덮어씀 | `work\v21`, `work\v24` 로 분리 |
| 6 | 게시 | 기존 `webapps\nexacroN_v21/v24` 덮어쓰기 위험 | 설정으로 위치 지정, 같은 이름 폴더는 삭제 후 복사, `webapps` 밖·Tomcat 기본 앱 전체는 금지 |
| 7 | `update_jar.ps1` | 다운로드 전에 기존 엔진 삭제, 항상 재다운로드 | staging 후 교체, 동일 버전 생략 (`[jar]` 단계) |

> `run_Deploy.bat` 의 `deploy_engine` 구성 / zip 압축(9~13단계)은 엔진 배포 패키지를 만드는 용도라 이 파이프라인에는 포함하지 않았다.

---

## 7. 실행 결과 (2026-10-01 최초 실행)

| 대상 | 결과 | 버전 | 커밋 | 소요 시간 |
|---|---|---|---|---|
| v21 | ✅ SUCCESS | 21.0.0.9999 | `3b64f73` RP 106324 Chrome(System WebView) 154 ... | Git 4.4s / Copy 9s / Deploy 47.7s / Publish 2.2s |
| v24 | ✅ SUCCESS | 24.0.0.9999 | `1a69f17` RP 106325 Chrome(System WebView) 154 ... | Git 15.6s / Copy 13.9s / Deploy 84.6s / Publish 5.6s |

- v21: 배포 파일 156개, 오류 0건 → http://localhost:8080/auto_v21/index.html
- v24: 생성 성공 250 / **실패 2**, 배포 성공 667 / 실패 0 → http://localhost:8080/auto_v24/index.html
  - 실패 2건은 프로젝트에 등록된 화면 파일이 실제로 없어서 발생 (파이프라인 문제 아님)
    ```
    [ERROR] Cannot find the file : "TestSample_QC::RP_100712_stepForm.xfdl"
    [ERROR] Cannot find the file : "TestSample_QC::RP_99021_div_test.xfdl"
    ```
- 기존 `webapps\nexacroN_v24`(1,440 파일), `webapps\nexacroN_v21`(150 파일) 변경 없음 확인

**`[jar]` 단계 추가 후 확인 (v21, `-UpdateJar -SkipGit -NoBrowser`)**

| 실행 | Jar 결과 | v21 |
|---|---|---|
| 1회차 (`work\jar` 비어 있음) | `NexacroN_Deploy_JAVA_20260825(1.1.90)_1.zip` 다운로드·설치 (2.1s) | SUCCESS (배포 Fail 0) |
| 2회차 | 서버 최신 = 설치본 → `up to date`, 다운로드 생략 | SUCCESS |

- `Tools\Jar` 변경 없음 확인

---

## 8. 알려진 제한 / 주의 사항

- **Deploy CLI 는 일부 화면 생성 실패에도 종료 코드 0 을 반환**한다 (위 v24 사례). 현재는 로그의 `[ERROR]` 줄로만 확인 가능하다.
- `-OnlyIfChanged` 는 마지막 **성공** 해시와 비교한다. 실패한 커밋은 다음 실행에서 다시 시도된다.
- `git pull --ff-only` 이므로 로컬 브랜치가 원격과 갈라져 있으면 FAIL 처리된다 (자동 merge 하지 않음).
- 작업 스케줄러로 실행할 때는 TFS 자격 증명이 Windows 자격 증명 관리자에 저장되어 있어야 한다.
- `all` 실행 시 v21 이 실패해도 v24 는 계속 진행되며, 최종 종료 코드는 1 이 된다.

---

## 9. 문제 해결

| 증상 | 확인 |
|---|---|
| `Path not found` | `pipeline_<대상>.txt` 의 경로 |
| `start.bat not found under ...jar` | `-UpdateJar` 로 실행 |
| `[jar] FAIL - ...` | 사내 서버(`59.10.169.82:9900`) 접속 여부. 기존 엔진이 있으면 그대로 사용됨 |
| `JarDir must be under ...work` | `JarDir` 를 `AutoPipeline\work\jar` 로 지정 |
| `Refusing to replace Tomcat built-in app` | `ROOT` 등 기본 앱 전체를 지정함. `PublishSubDir` 로 하위 폴더를 지정 |
| 게시 중 `Remove-Item` 오류 (파일 사용 중) | 해당 폴더의 파일을 다른 프로그램이 열고 있음. 닫고 재실행 |
| `Source repo has local changes` | `SourceDir` 에서 `git status` 로 수정 파일 정리 |
| `git fetch failed` | 네트워크 / TFS 인증 (`git -C <SourceDir> fetch` 직접 실행) |
| `Version mismatch` | `SourceDir` / `Branch` 가 `ExpectedVersion` 과 맞는지 |
| `Deploy failed (exit N)` | 로그의 Java 출력 |
| `URL not ready within 60s` | Tomcat 로그 (`TomcatHome\logs`), 시작 페이지 이름 (`StartPage` 지정) |
| `pipeline_v21.txt / pipeline_v24.txt not found` (standalone) | `auto_pipeline_standalone.bat` 맨 위 `set "PIPELINE_HOME=..."` 경로 확인 |
| `Unknown argument` (standalone) | 옵션 철자 확인 (`-Help` 로 목록 출력) |

로그 위치: `Tools\AutoPipeline\logs\yyyyMMdd_HHmmss_<대상>.log`

---

## 10. 단일 파일 버전 (`auto_pipeline_standalone.bat`)

`auto_pipeline.bat` + `auto_pipeline.ps1` 을 **bat 한 파일로 합친 버전**. bat 파일의 위치가 바뀌어도 동작하도록 만들었다.
기존 `auto_pipeline.bat` / `auto_pipeline.ps1` 은 그대로 유지되며, 두 방식 모두 같은 `pipeline_*.txt` 를 사용한다.

### 10-1. 파일 구조

```
auto_pipeline_standalone.bat
├── [bat 부분]  (cmd 가 실행)
│   ├── set "PIPELINE_HOME=D:\git\cursor_project\Tools\AutoPipeline"   ← txt 폴더 지정 (사용자 수정)
│   ├── AP_SELF / AP_BATDIR / AP_ARGS 환경변수 설정
│   ├── powershell -Command "자기 자신을 읽어 :__PS_BEGIN__ 아래를 실행"
│   └── exit /b %ERRORLEVEL%        ← cmd 는 여기서 끝나므로 아래 내용을 읽지 않음
└── [PowerShell 부분]  (:__PS_BEGIN__ 아래, PowerShell 이 실행)
    ├── 인자 해석 (v21|v24|all, -UpdateJar, -SkipGit, ...)
    ├── 설정 폴더 결정 (PIPELINE_HOME → bat 폴더)
    └── auto_pipeline.ps1 과 동일한 파이프라인 ([jar] → [0]~[5] → 요약)
```

### 10-2. 실행 흐름

```mermaid
flowchart TD
    A([▶ auto_pipeline_standalone.bat 실행\n어느 위치에서든]) --> B["bat 부분\nPIPELINE_HOME / AP_SELF / AP_BATDIR / AP_ARGS 설정"]
    B --> C["powershell -Command\n자기 파일(AP_SELF) 읽기\n:__PS_BEGIN__ 이후 텍스트 → scriptblock 실행"]
    C --> C1{PowerShell 부분 찾음?}
    C1 -- No --> E2["❌ exit 2"]
    C1 -- Yes --> D["인자 해석\nv21 | v24 | all, -UpdateJar, -SkipGit,\n-OnlyIfChanged, -OpenBrowser, -NoBrowser, -DevTools, -Help"]
    D --> D1{알 수 없는 인자?}
    D1 -- Yes --> E2
    D1 -- No --> H{-Help?}
    H -- Yes --> E0["사용법 + PIPELINE_HOME 출력\nexit 0"]
    H -- No --> R1{"PIPELINE_HOME 에\npipeline_*.txt 있음?"}
    R1 -- Yes --> ROOT["설정 폴더 = PIPELINE_HOME"]
    R1 -- No --> R2{"bat 폴더에\npipeline_*.txt 있음?"}
    R2 -- Yes --> ROOT2["설정 폴더 = bat 폴더"]
    R2 -- No --> E3["❌ txt 를 찾지 못함\n(PIPELINE_HOME 수정 안내)\nexit 2"]
    ROOT --> P["로그: 설정폴더\logs\\n작업: txt 의 WorkDir / JarDir\n(상대 경로는 설정 폴더 기준)"]
    ROOT2 --> P
    P --> PIPE["[jar] → [0] Preflight → [1] Git → [2] Framework\n→ [3] Deploy → [4] Publish → [5] Chrome\n(3장 흐름도와 동일)"]
    PIPE --> END(["요약 출력 / 종료 코드 0 또는 1\n→ bat 의 exit /b 로 전달"])

    style A fill:#4CAF50,color:#fff
    style END fill:#4CAF50,color:#fff
    style E2 fill:#f44336,color:#fff
    style E3 fill:#f44336,color:#fff
```

### 10-3. 설정 폴더 (`PIPELINE_HOME`) 결정

bat 맨 위의 한 줄로 지정한다.

```bat
set "PIPELINE_HOME=D:\git\cursor_project\Tools\AutoPipeline"
```

| 순서 | 후보 | 사용 조건 |
|---|---|---|
| 1 | `PIPELINE_HOME` 에 적은 폴더 | 그 폴더에 `pipeline_v21.txt` 또는 `pipeline_v24.txt` 가 있음 |
| 2 | bat 파일이 있는 폴더 | 위가 아니고, bat 폴더에 `pipeline_*.txt` 가 있음 |
| — | 둘 다 아님 | 오류 종료 (exit 2), 확인한 두 경로 출력 |

- `logs\` 는 결정된 설정 폴더 아래에 생성된다
- Jar 갱신 허용 범위(`work\`)도 설정 폴더 기준이다

**사용 예**

| 상황 | 방법 |
|---|---|
| bat 만 바탕화면 등 다른 곳으로 복사 | 그대로 실행 (`PIPELINE_HOME` 이 AutoPipeline 폴더를 가리킴) |
| AutoPipeline 폴더를 통째로 이동 | bat 과 txt 가 같이 옮겨지므로 2순위(bat 폴더)로 자동 인식. 단, txt 의 절대 경로(`WorkDir` 등)는 수정 필요 → 상대 경로 권장 (10-4) |
| 설정 폴더를 여러 개 운영 | bat 을 복사해 각각 `PIPELINE_HOME` 만 다르게 지정 |

### 10-4. txt 의 상대 경로 지원 (standalone 전용)

`auto_pipeline_standalone.bat` 은 txt 의 아래 키가 **상대 경로이면 txt 가 있는 폴더 기준**으로 변환한다.

대상 키: `SourceDir`, `ProjectPath`, `WorkDir`, `JarDir`, `TomcatHome`, `JavaHome`, `ChromePath`

```ini
WorkDir=work\v21        → <설정 폴더>\work\v21
JarDir=work\jar         → <설정 폴더>\work\jar
```

> ⚠ 기존 `auto_pipeline.ps1` 은 상대 경로를 변환하지 않는다. 두 실행 파일을 같이 쓰려면 txt 는 지금처럼 **절대 경로를 유지**한다.

### 10-5. 기존 ps1 과의 차이

| 항목 | `auto_pipeline.ps1` | `auto_pipeline_standalone.bat` |
|---|---|---|
| 파일 수 | bat + ps1 (2개) | 1개 |
| 설정 폴더 | ps1 이 있는 폴더 고정 | `PIPELINE_HOME` → bat 폴더 |
| 인자 처리 | PowerShell `param()` | 직접 해석 (모르는 인자는 오류) |
| `-Help` | 없음 | 있음 |
| txt 상대 경로 | 미지원 | 지원 |
| 파이프라인 로직 | — | ps1 과 동일 |

**주의**
- 오류 메시지의 줄 번호는 bat 파일의 실제 줄 번호와 다르다 (PowerShell 부분만 기준으로 계산됨)
- 편집기에서 bat 으로 인식되어 PowerShell 문법 강조가 되지 않는다
- 파이프라인 로직을 수정할 때는 `auto_pipeline.ps1` 과 `auto_pipeline_standalone.bat` **양쪽을 같이 수정**해야 동작이 같게 유지된다
- PowerShell 부분은 ASCII 문자만 사용한다 (한글 주석을 넣으면 인코딩 문제가 생길 수 있음)
- 줄바꿈은 CRLF 로 저장한다

### 10-6. 확인 결과 (2026-10-01)

bat 을 AutoPipeline 폴더 밖(임시 폴더)으로 복사하여 실행.

| 테스트 | 결과 |
|---|---|
| `-Help` | 사용법 + `Config folder (PIPELINE_HOME): D:\git\cursor_project\Tools\AutoPipeline` 출력, exit 0 |
| `v21 -Foo` | `[ERROR] Unknown argument: -Foo`, exit 2 |
| `PIPELINE_HOME=D:\nowhere` + bat 폴더에 txt 없음 | 확인한 두 경로와 수정 안내 출력, exit 2 |
| `all -SkipGit -NoBrowser` | 설정 폴더 = AutoPipeline 인식, v21 SUCCESS (배포 Fail 0, `http://172.10.12.46:8080/nexacroN_v21/21.0.0.2100/TC_NexaV21/index.html`), v24 DISABLED, exit 0 |
| 상대 경로 (`WorkDir=work\v21`, `ProjectPath=..\proj\A.xprj`) | txt 폴더 기준 절대 경로로 변환됨 |
