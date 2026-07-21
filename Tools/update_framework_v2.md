# update_framework_v2.bat

소스 저장소에서 브랜치를 **대화형 UI로 선택**하여 checkout·pull하고, 프레임워크 파일을 로컬 `nexacrolib` 폴더에 복사한 뒤 선택적으로 zip 압축까지 수행하는 배포 준비 스크립트.

> 커맨드라인 인자 방식, JSON 버전 치환, UTF-8 BOM 변환이 필요하면 **`update_framework_v3.bat`** 을 사용한다.

---

## 사용법

```bat
update_framework_v2.bat
```

인자 없음. 실행하면 대화형 브랜치 선택 UI가 표시된다.

---

## 사전 설정

`Tools\deploy_config.txt` 파일에 소스 저장소 경로가 정의되어 있어야 한다.

```ini
SourceDir=E:\git\VSCODE_WORK900\WORK900
```

---

## 브랜치 선택 UI (`select_branch.ps1`)

실행 시 `select_branch.ps1`을 통해 대화형으로 브랜치를 선택한다.

### 키 바인딩

| 키 | 동작 |
|---|---|
| ↑ / ↓ | 커서 이동 |
| 숫자 + Enter | 해당 번호 항목으로 이동 |
| 문자 입력 | 검색/필터 모드 |
| Enter | 브랜치 선택 또는 폴더 진입 |
| Backspace | 검색어 삭제 / 상위 폴더로 이동 |
| ESC | 검색 초기화 / 종료 |

### 자동 버전 결정 규칙

브랜치명에 따라 v21/v24 및 버전 번호가 자동으로 결정되어 수동 입력을 건너뛸 수 있다.

| 조건 | 자동 결정 |
|---|---|
| `master_21` 또는 `main_21` | v21 자동 선택 |
| `master` 또는 `main` | v24 자동 선택 |
| `RELEASE/` 폴더 내 브랜치 (`REL_날짜.00_버전[_AS]` 형식) | v21/v24 + 버전 번호 자동 추출, `_AS` 접미사가 있으면 마지막 자리 +1 |
| `SITE/` 폴더 내 브랜치 (브랜치명 끝에 `버전[_]`) | v21/v24 + 버전 번호 자동 추출 |

---

## 버전 번호 입력

브랜치에서 자동 추출되지 않은 경우 수동으로 입력한다.

- 형식: `N.N.N.N` (예: `24.0.0.1031`)
- 앞 두 자리는 선택한 버전(v21 → `21`, v24 → `24`)과 일치해야 함
- Enter만 입력 시 기본값 `VER_PREFIX.0.0.9999` 사용

```
Enter nexacro version (24.x.x.x, Enter=24.0.0.9999):
```

---

## zip 생성 여부 입력

```
Create zip archive? (Y/N, Enter=Y):
```

---

## 실행 단계

### [1/3] 소스 저장소 업데이트

```
git checkout <branch>
git pull origin <branch>
```

- 실패 시 즉시 중단
- 완료 후 커밋 해시(`COMMIT_HASH`) 출력

### [Pre] nexacrolib 폴더 초기화

- 기존 `nexacrolib` 폴더가 있으면 전체 삭제 후 재생성

### [2/3] 프레임워크 파일 복사

```
FRAMEWORK_SRC\component     →  nexacrolib\nexacrolib\component
FRAMEWORK_SRC\framework     →  nexacrolib\nexacrolib\framework
FRAMEWORK_SRC\resources     →  nexacrolib\nexacrolib\resources
FRAMEWORK_SRC\nexacrolib.json  →  nexacrolib\nexacrolib\nexacrolib.json
```

- `xcopy /E /Y /I` 로 복사
- `nexacrolib.json` 파일도 별도 복사

### [3/3] Generate Rule 파일 복사

버전에 따라 복사 대상이 달라진다.

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

### [5/5] zip 압축 *(선택)*

`N`을 선택하면 건너뜀.

```
nexacrolib\nexacrolib  +  nexacrolib\generate
→  nexacrolib\nexacrolib_noMerge_noCompress_noShrink(버전번호).zip
```

- `compress_deploy.ps1`을 사용하여 압축 (파일 잠금 우회, 다중 소스 지원)
- 버전 번호가 있으면 파일명에 포함

| 상황 | 생성 파일명 |
|---|---|
| 버전 번호 있음 | `nexacrolib_noMerge_noCompress_noShrink(24.0.0.1031).zip` |
| 버전 번호 없음 | `nexacrolib_noMerge_noCompress_noShrink.zip` |

---

## 완료 메시지

```
==========================================
 All steps completed successfully.
 Branch : main
 Commit : abc1234...
 Version: 24.0.0.1031
==========================================
```

---

## 관련 파일

| 파일 | 역할 |
|---|---|
| `deploy_config.txt` | `SourceDir` 경로 설정 |
| `select_branch.ps1` | 대화형 브랜치 선택 UI 및 자동 버전 감지 |
| `compress_deploy.ps1` | 다중 소스 zip 압축 (파일 잠금 우회 지원) |
| `get_version.ps1` | nexacrolib.json에서 version 값 추출 |
