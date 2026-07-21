# update_framework_v3.bat

소스 저장소에서 브랜치를 **커맨드라인 인자로 지정**하여 checkout·pull하고, 프레임워크 파일 복사, JSON 버전 치환, UTF-8 BOM 변환, GenerateRule 복사, zip 압축까지 수행하는 배포 준비 스크립트.

> 대화형 브랜치 선택 UI와 자동 버전 감지가 필요하면 **`update_framework_v2.bat`** 을 사용한다.

---

## 사용법

```bat
update_framework_v3.bat <branch명> [-version <값>] [-ignore] [-help]
```

### 옵션

| 옵션 | 설명 |
|---|---|
| `<branch명>` | checkout할 브랜치 이름. 생략 시 실행 중 입력 요청 |
| `-version <값>` | `nexacrolib` 하위 모든 JSON 파일의 `"version"` 값을 지정 값으로 치환 |
| `-ignore` | [5/5] zip 압축 단계를 건너뜀 |
| `-help` | 도움말 출력 후 종료. 다른 옵션이 있어도 도움말만 출력됨 |

### 예시

```bat
rem 기본 실행
update_framework_v3.bat main

rem 버전 치환 포함
update_framework_v3.bat master_21 -version "21.0.0.1031"

rem zip 생성 생략
update_framework_v3.bat main -ignore

rem 버전 치환 + zip 생략
update_framework_v3.bat main -version "24.0.0.1031" -ignore

rem 도움말 출력
update_framework_v3.bat -help
```

---

## 사전 설정

`Tools\deploy_config.txt` 파일에 소스 저장소 경로가 정의되어 있어야 한다.

```ini
SourceDir=E:\git\VSCODE_WORK900\WORK900
```

---

## 경로 설정

| 변수 | 값 | 설명 |
|---|---|---|
| `SOURCE_DIR` | `deploy_config.txt`의 `SourceDir` 값 | 소스 저장소 루트 |
| `FRAMEWORK_SRC` | `SOURCE_DIR\Lib\FrameworkJS` | 프레임워크 소스 |
| `DEST_DIR` | `PROJECT_ROOT\nexacrolib\nexacrolib` | 프레임워크 복사 대상 |
| `GENERATERULE_DEST` | `PROJECT_ROOT\nexacrolib\generate` | Generate Rule 복사 대상 |

---

## 실행 단계

### [1/5] 소스 저장소 업데이트

```
git checkout <branch>
git pull origin <branch>
```

- 실패 시 즉시 중단
- 완료 후 커밋 해시(`COMMIT_HASH`)와 커밋 메시지(`COMMIT_MSG`) 출력
- 커밋 메시지는 PowerShell을 통해 읽음 (BAT의 `%s` 확장 문제 우회)

### [Pre] nexacrolib 폴더 초기화

- 기존 `nexacrolib` 폴더가 있으면 전체 삭제 후 재생성

### [2/5] 프레임워크 파일 복사

```
FRAMEWORK_SRC\component        →  nexacrolib\nexacrolib\component
FRAMEWORK_SRC\framework        →  nexacrolib\nexacrolib\framework
FRAMEWORK_SRC\resources        →  nexacrolib\nexacrolib\resources
FRAMEWORK_SRC\nexacrolib.json  →  nexacrolib\nexacrolib\nexacrolib.json
```

- `xcopy /E /Y /I` 로 복사
- `nexacrolib.json` 파일도 별도 복사

### [Version] JSON version 값 일괄 치환 *(옵션)*

`-version` 옵션이 지정된 경우에만 실행.

- `update_version.ps1`을 호출해 `DEST_DIR` 하위 **모든 `.json` 파일**을 재귀 탐색
- `"version":"기존값"` 패턴을 `-version`으로 지정한 값으로 치환
- 변경된 파일명은 `[CHANGED] 파일명` 형태로 출력

### [3/5] JS 파일 UTF-8 BOM 변환

- `convert_utf8bom.ps1`을 통해 `DEST_DIR` 내 모든 `.js` 파일을 UTF-8 BOM 형식으로 변환
- Nexacro 런타임이 요구하는 인코딩으로 강제 변환

### [4/5] Generate Rule 파일 복사

버전 prefix(`21` 또는 `24`)에 따라 복사 대상이 달라진다.

- `-version` 옵션이 있으면 해당 값의 앞 두 자리를 사용
- 없으면 `get_version.ps1`으로 `nexacrolib.json`에서 버전을 읽어 결정 (읽기 실패 시 `24` 기본값)

**v24:**
```
TiMetainfoLib\res\*             →  nexacrolib\generate\
TiGenerateLib\Template\24\*    →  nexacrolib\generate\
```

**v21:**
```
TiMetainfoLib\res\*             →  nexacrolib\generate\
```

- 기존 `generate` 폴더 삭제 후 재생성하여 병합 복사

### [5/5] zip 압축 *(옵션)*

`-ignore` 옵션이 있으면 건너뜀.

```
nexacrolib\nexacrolib  +  nexacrolib\generate
→  nexacrolib\nexacrolib_noMerge_noCompress_noShrink(버전).zip
```

- `get_version.ps1`으로 `nexacrolib.json`의 version 값을 읽어 파일명에 포함
- `Compress-Archive`(PowerShell)로 압축
- 기존 zip 파일이 있으면 먼저 삭제 후 재생성

| 상황 | 생성 파일명 |
|---|---|
| version 정상 읽힘 | `nexacrolib_noMerge_noCompress_noShrink(24.0.0.1031).zip` |
| version 읽기 실패 | `nexacrolib_noMerge_noCompress_noShrink.zip` |

---

## 완료 메시지

```
==========================================
 [SUCCESS] All steps completed.
  Branch  : main
  Hash    : abc1234...
  Message : 커밋 메시지
  Version : 24.0.0.1031   ← -version 옵션 사용 시만 출력
==========================================
```

---

## 관련 파일

| 파일 | 역할 |
|---|---|
| `deploy_config.txt` | `SourceDir` 경로 설정 |
| `update_version.ps1` | JSON 파일 내 version 값 치환 (`-version` 옵션 시 사용) |
| `convert_utf8bom.ps1` | JS 파일 UTF-8 BOM 인코딩 변환 |
| `get_version.ps1` | nexacrolib.json에서 version 값 추출 (GenerateRule 분기 및 zip 파일명에 사용) |
