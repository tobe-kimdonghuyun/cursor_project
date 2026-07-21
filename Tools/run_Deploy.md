# run_Deploy.bat

`deploy_config.txt` 설정을 읽어 Nexacro 프로젝트를 빌드/배포하고, 배포 결과물을 `deploy_engine` 폴더로 정리한 뒤 zip으로 압축하는 전체 배포 파이프라인 스크립트.

---

## 사용법

```bat
run_Deploy.bat [옵션...]
```

### 옵션

| 옵션 | 설명 |
|---|---|
| `-config <파일명 또는 경로>` | 사용할 config 파일 지정. 생략 시 자동 탐색 |
| `-ignore` | zip 압축 단계([13]) 건너뜀 |

### 예시

```bat
rem 기본 실행 (deploy_config*.txt 자동 탐색)
run_Deploy.bat

rem 파일명만 지정 (Tools 폴더 기준 탐색)
run_Deploy.bat -config deploy_config_dev.txt

rem 전체 경로 지정
run_Deploy.bat -config "D:\configs\my_config.txt"

rem config 지정 + zip 생략
run_Deploy.bat -config deploy_config_dev.txt -ignore
```

---

## 설정 파일: `deploy_config.txt`

`=` 구분자로 키-값을 정의한다.

```ini
ProjectPath=D:\git_prj\nexacroN\UI_source\nexa24_deploy_sample_prj\nexa24_deploy_sample_prj.xprj
OutputPath=D:\git_prj\nexacroN\output\nexa24_deploy_sample_prj
DeployPath=D:\git_prj\nexacroN\deploy\nexa24_deploy_sample_prj
NexacroLibPath=D:\git_prj\nexacroN\nexacrolib\nexacrolib
GenerateRule=D:\git_prj\nexacroN\nexacrolib\generate
-MERGE
-COMPRESS
-SHRINK
```

### 설정 항목

| 키 | 필수 | 설명 |
|---|---|---|
| `ProjectPath` | ✅ | 배포할 Nexacro 프로젝트 파일 (`.xprj`) 경로 |
| `OutputPath` | ✅ | 빌드 중간 출력 폴더 경로 |
| `DeployPath` | ✅ | 배포 결과물 폴더 경로 |
| `NexacroLibPath` | ✅ | nexacrolib 라이브러리 폴더 경로 |
| `GenerateRule` | ✅ | Generate Rule 폴더 경로 |
| `-MERGE` | ➖ | 파일 머지 옵션 (키만 있으면 활성화) |
| `-COMPRESS` | ➖ | 압축 옵션 (키만 있으면 활성화) |
| `-SHRINK` | ➖ | Shrink 옵션 (키만 있으면 활성화) |

---

## 실행 단계

### [1] config 파일 결정

`-config` 옵션이 없을 때 `deploy_config*.txt` 패턴으로 자동 탐색:

| 발견된 파일 수 | 동작 |
|---|---|
| 0개 | `deploy_config.txt` 기본값으로 설정 (이후 존재 확인에서 오류 처리) |
| 1개 | 해당 파일 자동 선택 후 `[INFO] Config 자동 선택: ...` 출력 |
| 2개 이상 | 발견된 파일 목록 출력 후 사용할 파일명 입력 요청 |

`-config`가 지정된 경우:
- 지정 경로가 그대로 존재하면 → 해당 경로 사용
- 존재하지 않으면 → `Tools` 폴더 기준 상대 경로로 재탐색

### [2] start.bat 동적 탐색

`Tools\Jar\` 하위를 재귀 탐색하여 `start.bat`을 찾는다.

```bat
dir /b /s "Tools\Jar\start.bat"
```

- 서브폴더 구조에 무관하게 자동으로 경로를 찾음
- 없으면 오류 종료 (`run update_jar.bat first` 안내 포함)

### [3] config 파일 파싱

- 파일이 없으면 즉시 오류 종료
- `=` 기준으로 키-값 분리하여 환경 변수로 설정
- 필수 항목(`ProjectPath`, `OutputPath`, `DeployPath`, `NexacroLibPath`, `GenerateRule`) 중 하나라도 누락되면 오류 종료

### [4] OutputPath / DeployPath 초기화

- 기존 폴더가 있으면 삭제 후 재생성
- 매 실행마다 클린 상태에서 빌드

### [5] JAVA_HOME 탐색

환경 변수 `JAVA_HOME`이 설정되지 않은 경우 아래 순서로 자동 탐색:

| 우선순위 | 방법 |
|---|---|
| 1 | 고정 경로 (`C:\microsoft-jdk-21.0.9-windows-x64\...`) 존재 확인 |
| 2 | 레지스트리 JDK 항목 (`HKLM\SOFTWARE\JavaSoft\JDK`) |
| 3 | 레지스트리 JRE 항목 (`HKLM\SOFTWARE\JavaSoft\Java Runtime Environment`) |
| 4 | `PATH`의 `java.exe` 위치에서 역산 |

모두 실패 시 오류 종료.

### [6] 배포 명령 실행 (Java 직접 호출)

`start.bat`을 직접 호출하지 않고 **Java를 직접 실행**한다.

> `start.bat` 끝의 `pause` 명령으로 파이프라인이 중단되는 현상을 방지하기 위해 Java를 직접 호출한다.

`start.bat` 위치에서 `_JAR_ROOT`(한 단계 상위)를 역산하여 절대 경로로 실행. 실행 후 `errorlevel`을 확인하여 실패 시 즉시 종료한다.

`RULE_OPT`는 step 7-1에서 감지한 버전에 따라 자동 결정된다 (`-CSSRULE` 또는 `-GENERATERULE`):

```
java.exe -Dlog4j.configurationFile=<_JAR_ROOT>\log4j2.xml
         -classpath "<_JAR_ROOT>\libs\*"
         com.nexacro.build.cli.Main
         -P <ProjectPath>
         -B <NexacroLibPath>
         -O <OutputPath>
         <RULE_OPT> <GenerateRule>   ← v21: -CSSRULE / v24: -GENERATERULE (자동 감지)
         -D <DeployPath>
         [-MERGE] [-COMPRESS] [-SHRINK]
```

### [7] deploy_engine 폴더 생성 및 기본 복사

배포 완료 후 `deploy_engine` 폴더를 초기화하고 파일 구성:

```
deploy_engine\
├── nexacrolib\              ← DeployPath\nexacrolib 복사
└── <GenerateRule 폴더명>\   ← GenerateRule 폴더 복사
```

### [8] component 파일 복사 (단계 10)

`nexacrolib\nexacrolib\component` → `deploy_engine\nexacrolib\component`:

- 루트의 `*.json` 파일 복사
- 하위 폴더를 **동적으로 열거**하여 재귀 복사 (v21/v24 폴더 구조 차이에 자동 대응)
  - 서브폴더가 있는 폴더 → `컴포넌트폴더\서브폴더\` 구조로 복사
  - 서브폴더가 없는 폴더 → `컴포넌트폴더\` 로 직접 복사

### [9] *.min.json → *.json 교체 (단계 10-1)

`deploy_engine\nexacrolib\component` 내에서:

- `파일명.min.json`이 존재하면 대응하는 `파일명.json` 삭제
- `파일명.min.json`을 `파일명.json`으로 이름 변경
- 교체된 파일 수 출력

### [10] 단일 파일 및 폴더 복사 (단계 10-2 ~ 10-4)

| 소스 | 대상 |
|---|---|
| `nexacrolib\nexacrolib\nexacrolib.json` | `deploy_engine\nexacrolib\nexacrolib.json` |
| `nexacrolib\nexacrolib\component\DesignComp\` | `deploy_engine\nexacrolib\component\DesignComp\` |
| `nexacrolib\nexacrolib\resources\Resource.json` | `deploy_engine\nexacrolib\resources\Resource.json` |

### [11] Framework 파일 복사 (단계 11)

```
nexacrolib\nexacrolib\framework\Framework.min.json
→ deploy_engine\nexacrolib\framework\Framework.json  (이름 변경하여 복사)

nexacrolib\nexacrolib\framework\metainfo\
→ deploy_engine\nexacrolib\framework\metainfo\
```

### [12] JSON 버전 문자열 교체 (단계 12)

`deploy_engine\nexacrolib` 하위의 모든 `.json` 파일에서:

```
"version": "21.0.0.9999"  →  "version": "24.0.0.9999"
```

- PowerShell로 파일별 인플레이스 치환
- 처리된 파일 수 출력

### [13] zip 압축 (단계 13)

`-ignore` 옵션이 없을 때만 실행.

```
deploy_engine\*
→ deploy_engine\nexacrolib_Merge_Compress_Shrink(버전).zip
```

- `get_version.ps1`으로 `deploy_engine\nexacrolib\nexacrolib.json`의 version 값을 읽어 파일명에 포함
- `compress_deploy.ps1`으로 압축 (파일 잠금 우회 지원)
- 기존 zip이 있으면 먼저 삭제 후 재생성

| 상황 | 생성 파일명 |
|---|---|
| version 정상 읽힘 | `nexacrolib_Merge_Compress_Shrink(24.0.0.1031).zip` |
| version 읽기 실패 | `nexacrolib_Merge_Compress_Shrink.zip` |

---

## 전체 파이프라인 요약

```
config 파일 결정 (-config 지정 or deploy_config*.txt 자동 탐색)
    ↓
start.bat 동적 탐색 (Tools\Jar\ 하위 재귀)
    ↓
config 파일 파싱 + 필수 항목 검증
    ↓
OutputPath / DeployPath 초기화
    ↓
JAVA_HOME 탐색
    ↓
Java 직접 호출로 Nexacro 빌드/배포 (start.bat의 pause 우회)
    ↓
deploy_engine 폴더 생성
    ↓
nexacrolib + GenerateRule 복사
    ↓
component 파일 복사 + *.min.json → *.json 교체
    ↓
nexacrolib.json / DesignComp / Resource.json 복사
    ↓
Framework.min.json → Framework.json 복사 + metainfo 복사
    ↓
JSON version 문자열 교체 (21.0.0.9999 → 24.0.0.9999)
    ↓
deploy_engine → nexacrolib_Merge_Compress_Shrink(버전).zip 압축  ← -ignore 시 생략
```

---

## 관련 파일

| 파일 | 역할 |
|---|---|
| `deploy_config.txt` | 배포 경로 및 옵션 설정 |
| `Tools\Jar\` | Nexacro 빌드/배포 엔진 (`update_jar.bat`으로 설치) |
| `get_version.ps1` | nexacrolib.json에서 version 값 추출 (zip 파일명 생성에 사용) |
| `compress_deploy.ps1` | deploy_engine zip 압축 (파일 잠금 우회 지원) |
