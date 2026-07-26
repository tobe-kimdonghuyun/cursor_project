---
name: nexacro-deploy
description: nexacroN 프로젝트 빌드 및 배포 스킬. "배포해줘", "빌드해줘", "deploy해줘", "Tomcat 실행", "nexacroN 배포 설정", "deploy_config", "run_Deploy", "nexacroK 실행", "xprj", "xadl", "xfdl 배포", "서버 배포 구조", "MIME 타입", "UTF-8", "인코딩", "xapi 라이브러리" 등을 언급할 때 이 스킬을 사용하세요.
---

# nexacroN 배포 스킬

이 스킬은 nexacroN v21/v24/nexacroK 프로젝트의 빌드·배포 전 과정을 안내합니다.

---

## 0. 자동 배포 절차 (Claude 전용 — "deploy해줘" 트리거 시 이 순서대로 실행)

> 사용자가 프로젝트 폴더, `.xprj` 경로, 또는 "방금 만든/작업한 프로젝트"를 가리키며 배포를 요청하면
> **매번 사용자에게 경로를 되묻지 말고** 아래 절차를 자동으로 수행한다.
> 목적은 "로컬 Tomcat에 올려서 브라우저로 바로 확인"이며, 아래 §1의 `run_Deploy.bat`(엔진 zip 번들링용, 목적이 다름)과는 별개다.

### 0-1. 대상 xprj 결정
- 사용자가 폴더를 줬다면 → 그 폴더 루트에서 `*.xprj` 1개를 Glob으로 찾는다.
- `.xprj` 파일을 직접 줬다면 → 그대로 사용.
- 아무 경로도 없이 "방금 만든/작업하던 프로젝트 배포해줘"라면 → 대화 맥락상 가장 최근에 생성/작업한 nexacro 프로젝트 폴더를 사용.
- **프로젝트명**은 `.xprj` 파일명(확장자 제외)을 사용한다 (관례상 폴더명과 동일).

### 0-2. 배포 전 nexacrolib 무결성 점검 (매번 필수)
```bash
git status --porcelain -- nexacrolib/
```
`D ` (deleted)로 표시되는 파일이 하나라도 있으면 **반드시 먼저 복원**한다 (이유: §"작업 사례"의 실패 사례 1 참고 — `nexacrolib.json` 등이 없으면 테마 생성이 조용히 실패해 화면이 빈 채로 배포됨).
```bash
git restore -- nexacrolib/
```
"이 모듈은 지금 프로젝트에 안 쓰니까 안 복원해도 됨" 같은 판단을 하지 말 것 — 사용여부와 무관하게 전체 복원한다.

### 0-3. Deploy CLI 실행 (반드시 CLI 자신의 bin 폴더 안에서 실행)
```powershell
# deploy_jar/nexacroN 하위에서 start.bat 위치를 동적으로 찾는다 (버전 폴더명이 바뀔 수 있으므로 하드코딩 금지)
# 2026-07-25부터 Tools/Jar가 아니라 저장소 루트의 deploy_jar/nexacroN 로 이동됨
Glob: deploy_jar/nexacroN/**/start.bat

Push-Location "<start.bat이 있는 bin 폴더 절대경로>"
& ".\start.bat" `
    -P "<xprj 절대경로>" `
    -B "<repo>\nexacrolib\nexacrolib" `
    -O "<repo>\apache-tomcat-10.1.55\webapps\ROOT\<프로젝트명>" `
    -GENERATERULE "<repo>\nexacrolib\generate" `
    -REGENERATE
Pop-Location
```
- `-REGENERATE`는 매번 붙인다 (증분빌드 캐시로 인한 누락 방지, 특히 nexacrolib을 방금 복원/수정한 직후에는 필수).
- `bin` 폴더 밖에서 절대경로로 바로 실행하면 `classpath ..\libs\*`가 깨져 `ClassNotFoundException`이 난다 (실패 사례 4). 반드시 `Push-Location`으로 이동 후 실행.
- 출력 마지막 줄 `Finish generating ( N sec ) : Success X, Fail Y` 를 확인한다. **`Fail`이 0이 아니면 절대 "배포 성공"으로 보고하지 말 것** — 특히 `Cannot generate theme` / `-CSSRULE version does not match` 경고가 보이면 0-2를 다시 점검한다.

### 0-4. Tomcat 기동 확인
```powershell
netstat -ano | findstr ":7070"
```
- 이미 리스닝 중이면 (정적 파일 재배포이므로) 재시작 불필요 — 바로 0-5로.
- 안 떠 있으면 이 PC 전용 스크립트(`Tools/start_tomcat_home.bat`, JDK 경로가 이 PC 실제 설치 경로로 맞춰져 있음)를 `run_in_background: true`로 실행. 이 파일이 없으면 `Tools/start_tomcat.bat`을 시도하되, JDK 경로 오류(`JRE_HOME environment variable is not defined correctly`)가 나면 실패 사례 3을 참고해 이 PC의 실제 JDK로 지정한 사본을 만든다.
- Tomcat을 새로 만드는 배치 파일로 만들 때는 **절대 Write로 새로 쓰지 말고, 기존 정상 동작하는 `.bat`을 `cp`로 복사한 뒤 필요한 줄만 `Edit`으로 바꾼다** (실패 사례 5 — Write로 새로 만들면 LF 줄바꿈이 되어 cmd.exe가 깨진다).

### 0-5. 최종 검증 및 보고
```powershell
Invoke-WebRequest -Uri "http://localhost:7070/<프로젝트명>/index.html" -UseBasicParsing
```
200이면 사용자에게 테스트 주소(`http://localhost:7070/<프로젝트명>/index.html`)를 안내한다. 실패하거나 화면이 비어 보인다는 피드백을 받으면 0-2(nexacrolib 무결성)부터 다시 확인한다.

### 현재 환경 고정값 (조건이 바뀌면 이 표를 갱신할 것)

| 항목 | 값 |
|------|-----|
| 저장소 루트 | `E:\git_prj\cursor_project` |
| Deploy CLI | `deploy_jar\nexacroN\**\bin\start.bat` (버전 폴더명 변동 가능 — Glob으로 탐색, 저장소 루트 기준) |
| nexacrolib | `nexacrolib\nexacrolib` |
| Generate Rule | `nexacrolib\generate` |
| 배포 대상(Tomcat) | `apache-tomcat-10.1.55\webapps\ROOT\<프로젝트명>` |
| Tomcat 포트 | `7070` (server.xml Connector 기준, 8080 아님) |
| 이 PC의 JDK | `C:\Program Files\Eclipse Adoptium\jdk-25.0.3.9-hotspot` (팀 표준은 JDK21이나 이 PC엔 미설치) |

---

## 1. 배포 스크립트 구조 (Tools/)

```
(저장소 루트)
├── deploy_jar/nexacroN/        — nexacroN Deploy CLI 엔진 (2026-07-25부터 여기, 과거 Tools/Jar)
└── Tools/
    ├── run_Deploy.bat          — deploy_config.txt 기반 빌드+배포 + deploy_engine(zip) 번들링 파이프라인
    │                              (§0의 간단 배포와 목적이 다름 — nexacrolib 엔진을 다른 환경에 배포하기 위한 패키징용)
    ├── deploy_config.txt       — run_Deploy.bat 설정 (ProjectPath/OutputPath/DeployPath/NexacroLibPath/GenerateRule)
    │                              ⚠ 현재 D드라이브 기준 경로 + RP_105654 프로젝트로 고정되어 있음 (§2 참고)
    ├── deploy_nexacro.ps1      — deploy_config.txt 를 읽어 Deploy CLI를 직접 호출하는 대안 스크립트.
    │                              ⚠ 사용처 없는 것으로 확인됨(orphan) — CLAUDE.md가 언급하는 run_BuildDeploy.bat이 실제로는 없고,
    │                              내부적으로 flat "NexacroN_Deploy_JAVA.jar" 파일을 기대해 현재 폴더 구조와도 안 맞음. 실행 금지, 참고만.
    ├── update_jar.bat/.ps1/.md — Deploy CLI(deploy_jar/nexacroN) 최신 버전 사내 서버에서 다운로드/설치
    ├── delect_folder.bat       — ⚠ 저장소 루트의 deploy/deploy_engine/output/**nexacrolib**을 통째로 rd /s /q 삭제.
    │                              nexacrolib 삭제 후 git으로만 복구 가능 (실패 사례 1의 원인일 가능성 높음). 함부로 실행 금지.
    ├── test_path.bat           — 현재 cwd와 deploy_config.txt 존재 여부만 확인하는 디버그용 스크립트
    ├── start_tomcat.bat        — Tomcat 시작 (팀 공용, JDK21 경로 하드코딩 — 이 PC에는 없는 경로일 수 있음)
    ├── start_tomcat_home.bat   — 이 PC 전용 사본 (JDK25 Eclipse Adoptium 경로로 수정됨)
    ├── stop_tomcat.bat         — Tomcat 중지 (⚠ apache-tomcat-9.0.89 참조 — 이 저장소엔 10.1.55만 있음, 미수정 상태)
    ├── update_framework*.bat   — nexacrolib 프레임워크 자체 업데이트 (Jar 이동과 무관, nexacroK와도 무관)
    └── git_push.bat            — Git push 스크립트
```

> `run_Deploy.bat` 상세 흐름은 `Tools/run_Deploy.md`, `Tools/run_Deploy_flow.md` 참고. 이 파이프라인은 `deploy_engine\nexacrolib_Merge_Compress_Shrink(버전).zip` 을 만드는 것이 최종 목적이며, Tomcat webapps로 바로 서빙하는 용도가 아니다. **"화면 확인용 배포"는 항상 §0 절차를 사용한다.**
> `Tools/nexacroK/` 폴더는 별도 관리 대상 — nexacroN 작업 시 분석/수정 대상에서 제외한다.

---

## 2. deploy_config.txt (run_Deploy.bat 전용 설정)

```ini
ProjectPath=D:\git_prj\cursor_project\nexacroNv24_UI\RP_105654\RP_105654.xprj
OutputPath=D:\git_prj\cursor_project\output\nexacroN_v24\RP_105654
DeployPath=D:\git_prj\cursor_project\output\nexacroN_v24\Deploy\RP_105654
NexacroLibPath=D:\git_prj\cursor_project\nexacrolib\nexacrolib
GenerateRule=D:\git_prj\cursor_project\nexacrolib\generate
-MERGE
-COMPRESS
```

- ⚠ 현재 이 파일은 **D 드라이브 기준 경로**로 고정되어 있다 (이 저장소는 실제로 E 드라이브에 있음 — server.xml Context 오류와 동일한 원인). `run_Deploy.bat`을 실제로 쓰려면 먼저 이 파일의 드라이브 문자를 확인/수정해야 한다.
- 여러 프로젝트를 다루려면 `deploy_config_<이름>.txt` 형태로 여러 개 만들어두고 `run_Deploy.bat -config <파일명>`으로 선택 실행 가능 (자동 탐색 로직이 이미 구현되어 있음).

---

## 3. nexacroK 실행 설정 (run_nexacroK_config.json)

```json
{
  "NexacroExePath": "Nexacro.exe 절대경로",
  "Key": "프로젝트 키 이름",
  "ServiceUrl": "http://서버IP:포트/앱경로/start.json",
  "DebugId": "디버그 ID (임의값)"
}
```

---

## 4. Tomcat 제어

```bash
# 시작 (이 PC)
Tools/start_tomcat_home.bat

# 시작 (팀 공용 — JDK21 경로가 있는 PC에서만)
Tools/start_tomcat.bat

# 중지 — 현재 apache-tomcat-9.0.89를 참조하므로 이 저장소(10.1.55)에서는 직접 catalina.bat stop 사용 권장
```

### Tomcat 로그 위치
```
apache-tomcat-10.1.55/logs/catalina.<날짜>.log     — 메인 로그 (부팅 실패 원인 확인용)
apache-tomcat-10.1.55/logs/localhost_access_log.<날짜>.txt — 요청/응답 로그 (404 원인 추적에 유용)
```

---

## 5. NexacroN_Deploy_JAVA CLI 직접 실행 (저수준)

```powershell
# 반드시 bin 폴더 안에서 실행
Push-Location "deploy_jar\nexacroN\<버전폴더>\bin"
& ".\start.bat" -P "<xprj>" -B "<nexacrolib\nexacrolib>" -O "<출력경로>" -GENERATERULE "<nexacrolib\generate>" [-D "<deploy경로>"] [-MERGE] [-COMPRESS] [-SHRINK] [-REGENERATE]
Pop-Location
```

---

## 6. 배포 후 검증

```powershell
# HTTP 상태 확인
Invoke-WebRequest -Uri "http://localhost:7070/<프로젝트명>/index.html" -UseBasicParsing

# 배포 로그의 Fail 카운트 확인 (0이어야 함)
# access log에서 404 여부 확인 (특히 _resource_/_theme_/ 경로)
```

---

## 7. 자주 발생하는 오류

| 오류 | 원인 | 해결 |
|------|------|------|
| `ClassNotFoundException: com.nexacro.build.cli.Main` | `start.bat`을 bin 폴더 밖에서 실행 (상대 classpath 깨짐) | bin 폴더로 이동 후 실행 (§0-3) |
| 배포는 성공했는데 화면이 비어 보임 | `nexacrolib.json` 등 누락 → 테마 생성 실패 | `git status --porcelain -- nexacrolib/` 확인 후 `git restore` (§0-2) |
| Tomcat 전체가 안 뜸 (특정 앱이 아니라 서버 자체) | `server.xml`의 `<Context docBase>`가 다른 PC 기준 절대경로 | docBase를 현재 저장소 경로로 수정 |
| `The JRE_HOME environment variable is not defined correctly` | `start_tomcat.bat`의 JDK 경로가 이 PC에 없음 | `start_tomcat_home.bat` 사용 또는 이 PC 경로로 사본 생성 |
| 새로 만든 `.bat`이 "내부 또는 외부 명령이 아닙니다"로 조각남 | Write로 새로 쓴 파일이 LF 줄바꿈 | 기존 파일을 `cp`로 복사 후 `Edit`으로 수정 |
| 한글 깨짐 | 인코딩 문제 | server.xml `URIEncoding="UTF-8"` 확인 |
| 포트 충돌 | 7070 이미 사용 중 | `netstat -ano \| findstr :7070` 으로 PID 확인 후 종료 |

> 각 실패 사례의 상세 원인/재현/해결 과정은 `nexacroN_rules.md` 맨 끝 **"작업 사례 (성공/실패)"** 섹션 참고.

---

## 8. 프로젝트 파일 확장자 역할

| 확장자 | 역할 |
|--------|------|
| `.xprj` | 프로젝트 파일 — 전체 구조 정의 |
| `.xadl` | Application Definition — 앱 진입점, 전역 Dataset, 글로벌 설정 |
| `.xfdl` | Form Definition — 화면 단위 UI + 스크립트 혼합 |
| `.xjs` | 외부 공통 스크립트 모듈 |
| `.xtheme` | 테마/스타일 정의 |
| `.xmodule` | 재사용 가능한 복합 컴포넌트 패키지 |

**빌드 실행 흐름:**
```
index.html → nexacrolib 프레임워크/컴포넌트 JS 로드 → environment.xml.js → Application_Desktop.xadl.js 초기화 → startup Form 표시
```

---

## 9. 서버 배포 파일 구조 (실제 생성물 기준)

```
webapps/ROOT/<프로젝트명>/
├── index.html                — 웹 진입점 (엔진 스크립트 로딩 + oninitframework)
├── launch.html / quickview.html / popup.html
├── environment.xml.js
├── Application_Desktop.xadl.js
├── start.json
├── FrameBase/                — Form 스크립트 (.xfdl → .xfdl.js)
├── nexacrolib/                — nexacrolib 프레임워크/컴포넌트 복사본
└── _resource_/
    └── _theme_/               — 테마 CSS + map.js + 이미지 (누락 시 화면 렌더링 깨짐, §0-2 참고)
```

---

## 10. 서버 필수 설정

### Tomcat — 인코딩 설정 (catalina.bat)
```bat
set "JAVA_OPTS=%JAVA_OPTS% -Dfile.encoding=UTF8"
```

### Tomcat — URIEncoding (server.xml)
```xml
<Connector port="7070" protocol="HTTP/1.1"
           URIEncoding="UTF-8"
           connectionTimeout="20000" redirectPort="8443" />
```

### Excel MIME 타입 (web.xml)
```xml
<mime-mapping>
  <extension>xlsx</extension>
  <mime-type>application/vnd.openxmlformats-officedocument.spreadsheetml.sheet</mime-type>
</mime-mapping>
<mime-mapping>
  <extension>xls</extension>
  <mime-type>application/vnd.ms-excel</mime-type>
</mime-mapping>
```

### JSP 서비스 — 인코딩 선언 필수
```jsp
<%@ page contentType="text/xml; charset=UTF-8" %>
```

---

## 11. xapi 라이브러리 배포

서버 서비스(JSP/Servlet)에서 PlatformData 통신 시 아래 JAR이 WEB-INF/lib에 있어야 한다.

```
WEB-INF/lib/
├── nexacro-xapi-java-x.x.x.jar   — 넥사크로 xapi 라이브러리
├── nexacro_server_license.xml     — 라이선스 파일 (jar와 같은 위치)
├── commons-logging-x.x.x.jar     — xapi 내부 로깅
└── json-simple-x.x.x.jar         — xapi 내부 사용
```

> `nexacro_server_license.xml` 파일이 없으면 서버 서비스가 정상 작동하지 않는다.

---

## 12. log4j2 설정 (log4j2.xml)

```xml
<!-- 로그 레벨: TRACE > DEBUG > INFO > WARN > ERROR -->
<Loggers>
  <Root level="INFO">
    <AppenderRef ref="Console"/>
    <AppenderRef ref="File"/>
  </Root>
</Loggers>
```
- 개발 환경: `level="DEBUG"`
- 운영 환경: `level="WARN"` 이상 권장
