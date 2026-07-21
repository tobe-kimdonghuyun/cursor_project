# update_framework.bat

소스 저장소에서 지정한 브랜치로 checkout하고 최신 커밋을 pull하는 스크립트.

> 파일 복사, 버전 변경, zip 압축 등 전체 배포 준비 기능이 필요하면 **`update_framework_v2.bat`** 을 사용한다.

---

## 사용법

```bat
update_framework.bat [branch명]
```

### 인자

| 인자 | 설명 |
|---|---|
| `[branch명]` | checkout할 브랜치 이름. 생략 시 실행 중 입력 요청 |

### 예시

```bat
rem 인자로 브랜치 지정
update_framework.bat main

rem 인자 생략 → 실행 중 입력 요청
update_framework.bat
```

---

## 경로 설정

아래 경로는 스크립트 내에 하드코딩되어 있다.

| 변수 | 값 | 설명 |
|---|---|---|
| `SOURCE_DIR` | `E:\git\VSCODE_WORK900\WORK900` | git 작업을 수행할 소스 저장소 루트 |

---

## 실행 단계

### [1/1] 소스 저장소 업데이트

```
SOURCE_DIR 으로 이동
git checkout <branch>
git pull origin <branch>
```

- 지정한 브랜치로 checkout 후 최신 커밋을 pull
- checkout 또는 pull 실패 시 즉시 중단 (errorlevel 체크)
- 완료 후 현재 커밋 해시(`COMMIT_HASH`)를 출력

---

## 완료 메시지

```
[DONE] Branch: main / Commit: abc1234...
```

실패 시:

```
[ERROR] Failed to checkout branch: main
```
또는

```
[ERROR] Git pull failed for branch: main
```

---

## 관련 파일

| 파일 | 역할 |
|---|---|
| `update_framework_v2.bat` | git pull + 파일 복사 + zip 압축까지 수행하는 확장 버전 |
