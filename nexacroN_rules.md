# nexacroN / nexacroK 코딩 규칙

> **필독**: nexacroN 또는 nexacroK 관련 작업 시 **반드시** 아래 메뉴얼을 먼저 참조한다.
>
> 메뉴얼 위치 (이 프로젝트): `DOC/NexacroN/` (Markdown 변환본)
>
> | 파일명 | 용도 |
> |--------|------|
> | `developer_guide_nexacro_n_v24_ko.md` | 컴포넌트, Dataset API, transaction, 이벤트 처리 |
> | `advanced_development_guide_nexacro_n_v24_ko.md` | Grid 고급, 팝업, 탭, 모듈, 에러 처리 |
> | `deployment_guide_nexacro_n_v24_ko.md` | 빌드/배포, 서버 파일 구조 |
> | `development_tools_guide_nexacro_n_v24_ko.md` | Nexacro Studio, 디버거 사용법 |
> | `getting_started_nexacro_n_v24_ko.md` | 프로젝트 구조, 파일 타입(.xprj/.xadl/.xfdl) |
> | `server_setup_guide_nexacro_n_v24_ko.md` | Tomcat 설정, PlatformData, 인코딩 |
> | `module_developer_guide_nexacro_n_v24_ko.md` | 모듈(.xmodule) 개발, TypeDefinition |
> | `product_information_nexacro_n_v24_ko.md` | 지원 플랫폼/브라우저, v24 신규 기능 |
> | `launcher_service.md` | 런처 서비스(TPLSvc) 연동 |
> | `eGovFrame Integration Guide_n.md` | eGovFrame 연동 가이드 |

---

## 기본 규칙

- 이벤트 핸들러명: `컴포넌트명_이벤트명` (예: `btnSave_onclick`)
- 공통 함수는 `gfn_` prefix 사용
- Dataset 컬럼명은 대문자 스네이크케이스 (예: `USER_ID`)
- 화면 스크립트는 기능 단위로 구역 주석 구분
- nexacro 화면은 `.xfdl` 확장자 파일 — XML(컴포넌트/레이아웃) + nexacro 스크립트(로직) 혼합
- 스크립트는 `<Script><![CDATA[ ... ]]></Script>` 태그 내부에 function으로 작성 javascript문법을 사용하고 있다
- `nexacrodeploy.exe` 를 통해 nexacroK, nexacroN 모두 빌드 → 최종 `.js` 파일 생성

---

## 프로젝트 파일 구조

| 확장자 | 역할 |
|--------|------|
| `.xprj` | 프로젝트 파일 (전체 프로젝트 설정) |
| `.xadl` | Application Definition — 앱 진입점, 전역 변수, 글로벌 Dataset 설정 |
| `.xfdl` | Form Definition — 화면 단위 UI + 스크립트 |
| `.xjs` | 외부 스크립트 파일 (공통 함수 모듈) |
| `.xtheme` | 테마/스타일 정의 |

**빌드 실행 흐름**: `launch.html` → `nexacro.js` 로드 → `application.xadl` 초기화 → startup Form 표시

---

## 주요 컴포넌트 목록

| 분류 | 컴포넌트 |
|------|---------|
| 입력 | `Edit`, `TextArea`, `Combo`, `CheckBox`, `Radio`, `Calendar`, `DateField` |
| 버튼 | `Button`, `ImageButton`, `CheckButton` |
| 표시 | `Static`, `Image`, `Grid`, `ListBox`, `ProgressBar` |
| 컨테이너 | `Div`, `Panel`, `PopupDiv`, `Tab` |
| 기타 | `FileUpload`, `FileDownload`, `WebBrowser`, `Menu`, `PopupMenu` |

**컴포넌트 ID 네이밍 prefix 권장**: `btn_`, `edt_`, `grd_`, `ds_`, `cmb_`, `chk_`, `div_`, `tab_`, `lst_`

---

## Dataset을 Grid에 연결 방법

2가지 방법이 있음:
- 생성된 Grid의 `binddataset`에 텍스트로 바로 설정한다
- script를 통해서 동적으로 등록한다: `this.grd_main.binddataset = "동적생성된 dataset id"`

## nexacro Grid 엑셀 내보내기 기능

- 기본적으로 제공되는 grid의 `saveXLS` 로직을 가져와서 사용하면 됨
- 기본 제공되는 `saveXLS`를 사용하면 엑셀로 내보내기 기능을 구현할 수 있음

---

## Dataset API

```javascript
// 행 추가
var nRow = this.dsMain.addRow();

// 값 설정/조회
this.dsMain.setColumn(nRow, "USER_ID", "hong");
var val = this.dsMain.getColumn(nRow, "USER_ID");

// 행 삭제
this.dsMain.deleteRow(nRow);

// 행 검색
var foundRow = this.dsMain.findRow("USER_ID", "hong");

// 전체 행 수
var cnt = this.dsMain.rowcount;

// 대량 데이터 처리 시 화면 갱신 비활성화 (성능)
this.dsMain.updatecontrol = false;
// ... 반복 처리 ...
this.dsMain.updatecontrol = true;

// Dataset 필터 적용
this.dsMain.setFilter("STATUS == 'Y'");
this.dsMain.setFilter("");  // 필터 해제

// 행 타입 (ROWTYPE_NORMAL, ROWTYPE_INSERT, ROWTYPE_UPDATE, ROWTYPE_DELETE)
this.dsMain.setRowType(nRow, Dataset.ROWTYPE_NORMAL);
```

---

## Dataset 심화 API (V24)

```javascript
// 행 검색 — 범위 지정 가능
var nRow = this.ds.findRow("COL", "100", 10, 10000);  // 10~10000행 범위
var nRow = this.ds.findRowExpr("dept_cd == 'A2' && pos_cd > '03'", 2, 10);

// filter — 빈문자열=해제, 인수없음=직전조건 재적용
this.ds.filter("amount > 1000 && model_cd = 'A-1'");
this.ds.filter("");   // 해제
this.ds.filter();     // 직전 조건 재적용

// keystring — S(정렬)/G(그룹)/O(locale옵션)
this.ds.keystring = "G:+column0,S:-column1";
this.ds.keystring = "S:Column0,O:Column0[en-US]{\"caseFirst\":\"upper\",\"numeric\":true}";

// 조건부 집계
this.ds.getCaseSum("Column0 > 10", "Column0");
this.ds.getCaseCount(strExpr, "Column0");

// 그룹 범위 집계 (소계 행 클릭 시)
var s = this.ds.getGroupRangeStart(e.row);
var cnt = this.ds.getGroupRangeCount(e.row);
this.ds.getAvg("Column1", s, s + cnt);
// getRowLevel(row) == 0 이면 그룹(소계) 행

// 변경 전 값 / 삭제된 행 조회
var orgVal = this.ds.getOrgColumn(i, "COL");       // 변경 전 원본 값
var delCnt = this.ds.getDeletedRowCount();
var delVal = this.ds.getDeletedColumn(i, "COL");

// Dataset 통째 복사
this.ds_copy.copyData(this.ds_input);

// 스크립트 동적 Dataset 생성 + Grid 바인딩
var ds = new Dataset; ds.name = "ds_data";
this.addChild("ds_data", ds);
this.ds_data.addColumn("COL0", "String");
this.Grid00.binddataset = "ds_data";
this.Grid00.createFormat();   // 동적 바인딩 후 필수

// RowType 강제변경 시 updatecontrol=false 필수
this.ds.updatecontrol = false;
this.ds.setRowType(i, Dataset.ROWTYPE_NORMAL);
this.ds.updatecontrol = true;
```

### Dataset JSON 포맷 `_rowtype_` (서버 통신 디버깅)

| 값 | 의미 |
|----|------|
| `n` | normal (변경 없음) |
| `i` | inserted (추가) |
| `u` | updated (수정) |
| `d` | deleted (삭제) |
| `o` | original — 바로 앞 `u` 행이 있을 때만 존재 (수정 원본값) |

---

## 서비스 통신 (transaction)

```javascript
// 기본 패턴
this.transaction(
    "svcId",             // 서비스 식별자
    "/api/endpoint",     // URL
    "dsSearch:dsSearch", // 입력 Dataset (로컬명:서버명)
    "dsResult:dsResult", // 출력 Dataset
    "",                  // 추가 파라미터
    "fn_callback"        // 콜백 함수명 (문자열)
);

// 콜백 패턴 — errCode 반드시 확인
this.fn_callback = function(svcId, errCode, errMsg) {
    if (errCode < 0) {   // 시스템 오류
        alert("시스템 오류: " + errMsg);
        return;
    }
    if (errCode > 0) {   // 업무 오류
        alert("업무 오류: " + errMsg);
        return;
    }
    // 성공 처리
};
```

### transaction() Promise/async-await 패턴

```javascript
// 전체 시그니처: transaction(svcId, url, inDs, outDs, args, callbackFn, bAsync)
// bAsync 기본 true. 콜백명을 null로 주면 Promise 반환

// Promise 패턴
var req = this.transaction(svcId, url, null, "dsResult:dsResult", null, null, true);
req.then(function(result) {
    var ErrorCode = result[0], ErrorMsg = result[1];
}).catch(function(err) { trace(err[1]); });

// async/await 패턴
this.fn_load = async function() {
    try {
        var result = await this.transaction(svcId, url, null, "dsResult:dsResult", null);
        var ErrorCode = result[0], ErrorMsg = result[1];
    } catch(err) { trace(err[1]); }
};

// URL에 로컬 리소스 Namespace 사용 가능
this.transaction(svcId, "FileSample::sample.xml", null, "dsResult:dsResult", null, "fn_callback");
```

---

## DataObject — REST/JSON 통신

nexacro v24에서 제공하는 REST API 직접 통신 방식 (`transaction` 대안).

```javascript
// POST 요청
var header = { "Content-Type": "application/json; charset=UTF-8" };
this.DataObject00.request("CREATE", "POST", url, {
    "httpheader": header,
    "postdata": JSON.stringify(body)
});

// 이벤트: onsuccess → onload, 오류 시 onerror
this.DataObject00_onsuccess = function(obj, e) {
    if (e.statuscode > 200) {
        e.preventDefault();
        this.TextArea00.value = obj.getResponse();
    }
};

// Dataset 바인딩: binddataobject + dataobjectpath(JSONPath "$.data.items")
// twoway 바인딩 지원 — Dataset 변경 시 DataObject에 자동 반영
```

---

## 이벤트 처리 패턴

```javascript
// 버튼 클릭
this.btnSearch_onclick = function(obj, e) { };

// Combo 항목 변경
this.cmbStatus_onitemchanged = function(obj, e) {
    var val = obj.value;
};

// Grid 셀 클릭
this.grdMain_oncellclick = function(obj, e) {
    var rowIdx = e.row;
    var colIdx = e.cell;
};

// Grid 헤더 클릭 (정렬/전체선택)
this.grdMain_onheadclick = function(obj, e) { };

// 키보드 단축키 (Form 레벨)
this.Form_onkeydown = function(obj, e) {
    if (e.ctrlKey && e.keycode == 83) { fn_save(); return false; }  // Ctrl+S
    if (e.keycode == 13) { fn_search(); return false; }              // Enter
    if (e.keycode == 27) { this.close(); return false; }             // Esc
};
```

---

## Form 생명주기 이벤트

```javascript
// 화면 최초 로드 (1회 실행) — 초기화 로직
this.Form_onload = function(obj, e) {
    fn_initForm();
    fn_loadInitData();
};

// 화면 활성화 시마다 실행 — 데이터 갱신
this.Form_onactivate = function(obj, e) { };

// 화면 비활성화 시
this.Form_ondeactivate = function(obj, e) { };

// 화면 종료 전 — return false 시 종료 취소
this.Form_onclose = function(obj, e) {
    if (!fn_validateBeforeClose()) return false;
};
```

### 생명주기 이벤트 정확한 순서

```
environment.onload
→ application.onloadingappvariables
→ mainframe.onactivate
→ childframe.onactivate
→ application.onload
→ form.oninit
→ form.onload
→ form.onactivate
→ application.onloadforms
```

---

## 팝업(Popup) 패턴

```javascript
// 팝업 열기
this.openPopup("popUser", "xfdl/UserPopup.xfdl",
    { p_userId: this.edtUserId.value, p_mode: "edit" },
    "fn_popupCallback");

// 팝업 내부 — argument로 전달된 데이터 수신
this.Form_onload = function(obj, e) {
    var userId = this.argument.p_userId;
    var mode   = this.argument.p_mode;
};

// 팝업 닫기 + 데이터 반환
this.btnConfirm_onclick = function(obj, e) {
    this.close({ resultCode: "OK", userId: this.edtUserId.value });
};

// 팝업 콜백 처리
this.fn_popupCallback = function(popupObj, returnValue) {
    if (returnValue && returnValue.resultCode == "OK") {
        this.edtUserId.set_value(returnValue.userId);
    }
};
```

### ChildFrame / 팝업 고급 패턴

```javascript
// 모달 ChildFrame 동적 생성
var cf = new ChildFrame();
cf.init("childframe00", 0, 0, 300, 300, null, null);
cf.openalign = "center middle";
cf.resizable = true;
cf.overlaycolor = "rgba(0,0,0,0.3)";
cf.showModal(this.getOwnerFrame());

// nexacro.open — 새 브라우저/NRE 창에 속성 전달
nexacro.open("POPUP", "Sample::frame.xfdl",
    nexacro.getApplication().getActiveFrame(),
    { p_userId: "hong", p_mode: "view" }
);
// 수신측: var userId = this.parent.p_userId;

// 엔터키 네비게이션 (다음 컴포넌트로 포커스 이동)
this.Form_onkeydown = function(obj, e) {
    if (e.keycode == 13) {
        obj.getNextComponent(this.getFocus(), true).setFocus();
    }
};
// 특정 버튼에서 엔터 전파 차단
this.btnSubmit_onkeydown = function(obj, e) { return true; };
```

---

## Div 동적 폼 로드

```javascript
// Div에 xfdl 로드
this.divContent.set_url("Form::SubForm.xfdl");

// Div 내부 컴포넌트 접근
var innerValue = this.divContent.form.dsMain.getColumn(0, "USER_ID");
var innerGrid  = this.divContent.form.grdMain;
```

### Div 레이아웃 (type 속성)

```xml
<!-- 가로 순차 배치 -->
<Div type="horizontal" horizontalgap="10" ...>
  <Button .../> <Button .../> <Button .../>
</Div>

<!-- 세로 순차 배치 -->
<Div type="vertical" verticalgap="8" ...>
  <Edit .../> <Edit .../>
</Div>
```

| 속성 | 설명 |
|------|------|
| `type="horizontal"` | 왼쪽부터 순서대로 가로 배치 |
| `type="vertical"` | 위에서부터 순서대로 세로 배치 |
| `horizontalgap` | 컴포넌트 간 가로 간격(px) |
| `verticalgap` | 컴포넌트 간 세로 간격(px) |

---

## 공통 함수(gfn_) 필수 패턴

```javascript
// Null/빈값 처리
function gfn_nvl(val, defaultVal) {
    return (val == null || val == undefined || val == "") ? defaultVal : val;
}

// 날짜 조회 — "YYYYMMDD" 형식
function gfn_getToday() { /* 오늘 날짜 반환 */ }

// 문자열 좌우 패딩
function gfn_lpad(str, len, padChar) { /* "1" → "0001" */ }
function gfn_rpad(str, len, padChar) { /* "1" → "1000" */ }

// 숫자 포맷
function gfn_numFormat(num) { return Number(num).toLocaleString(); }

// 유효성 검증 (이메일, 전화번호 등)
function gfn_isEmail(email) { /* regex 검증 */ }
function gfn_isPhone(phone) { /* regex 검증 */ }
```

---

## Grid 주요 패턴

```javascript
// 그리드 선택 행 배열 가져오기
var aRows = this.grdMain.getSelectRowArray();

// 셀 스타일 동적 변경
this.grdMain_ongetcellstyle = function(obj, e) {
    if (this.dsMain.getColumn(e.row, "STATUS") == "ERROR") {
        e.style.background = "#ffcccc";
    }
};

// 컬럼 표시/숨김
this.grdMain.setColHidden(colIndex, true);

// 전체 선택 체크박스 (헤더 클릭 시)
this.grdMain_onheadclick = function(obj, e) {
    if (e.cell == 0) obj.setAll("select", !obj.getCheckOldValue(0));
};
```

### Grid Cell expr 스크립트

Grid 셀 내부에서 `expr:` 표현식 사용 시 `this`는 Cell 컨텍스트이며 Form이 아님.

```xml
<Cell text="expr:column00"/>                       <!-- 바인딩 Dataset 컬럼 -->
<Cell text="expr:comp.currentcell"/>               <!-- comp = Grid 자신 -->
<Cell text="expr:dataset.parent.fn_format(row)"/>  <!-- Form 함수 호출 -->
```

### Grid autofittype (컬럼 너비 자동 조정)

| 값 | 동작 |
|----|------|
| `none` | 지정된 컬럼 너비 고정 (기본) |
| `col` | Grid 전체 너비에 맞게 모든 컬럼 너비 자동 조정 |
| `row` | 행 높이 자동 조정 |

```javascript
this.grdMain.autofittype = "col";
this.grdMain.autofittype = "none";
```

---

## Application 전역 변수

```javascript
// 전역 변수 저장/조회
application.setGlobal("USER_ID", "hong");
var userId = application.getGlobal("USER_ID");
```

---

## 스크립트 유효범위(scope) — `this` 사용 근거

nexacro 스크립트는 표준 JS와 스코프가 다름. `this` 없이 쓴 변수는 글로벌 멤버가 됨.

```javascript
alert("msg");                              // JS 표준 alert
this.alert("msg");                         // Form.alert()
nexacro.getApplication().alert("msg");     // Application.alert()

// transaction/close 등 Form 메서드는 반드시 this. 로 호출
this.transaction(svcId, url, ...);

// 전역값은 global 변수 대신 appVariables 권장
nexacro.getApplication().addVariable("USER_ID", "hong");
nexacro.getApplication().getVariable("USER_ID");
```

**명명 제약 (화면이 뜨지 않는 원인):**
- 언더바(`_`)로 시작하는 변수/함수명 금지 — 라이브러리 내부 충돌
- `createComponent` 등 라이브러리 예약 함수명 금지
- 컨테이너 멤버명과 같은 컴포넌트 id 금지 (예: Button id를 `text`로, Dataset 컬럼을 `length`로 지정 불가)

---

## Frame Tree 참조 경로

```javascript
this.parent;                           // form → 부모 childframe
this.getOwnerFrame();                  // form → 소속 childframe
this.div0.form.btn0;                   // Div 내부 컴포넌트
this.div1.form.ds2.parent.parent.name; // "form"

// Div 서브 폼에서 부모 폼 컴포넌트 접근
this.parent.parent.edtSearch;          // Div → form → 컴포넌트

// id 중복: 동일 레벨에서만 금지. btn0 와 div0.form.btn0 는 공존 허용
```

---

## 반응형 컴포넌트 배치 (right / bottom 속성)

```xml
<!-- Edit은 오른쪽 버튼과 거리 유지, 버튼은 오른쪽 고정 -->
<Edit  left="30" top="30" height="50" right="160"/>   <!-- right = 버튼left + 여백 -->
<Button right="30" top="30" height="50" width="120"/> <!-- left 제거, right만 사용 -->
```

- `left` 속성 대신 `right` 속성 지정 → 화면 너비 변경 시 컴포넌트가 오른쪽 기준으로 고정
- Edit의 `+` 핸들을 Button으로 드래그 → 상대 거리 자동 연결
- `bottom` 속성도 동일 원리 (화면 높이 기준 하단 고정)

---

## em/rem 단위 지원 속성

nexacroK/nexacroN에서 em/rem 단위를 사용할 수 있는 속성 목록:

| 속성 | em 기준 | 비고 |
|------|---------|------|
| `width`, `height` | self font | |
| `minwidth`, `maxwidth`, `minheight`, `maxheight` | MainFrame font | rem 사용 권장 |
| `padding` | self font | 1~4방향 모두 가능 |
| `border` | self font | 두께 부분만 |
| `borderRadius` | self font | |
| `font` | 부모 font | font-size 부분 |
| `letterSpacing` | self font | 음수도 허용 |
| `wordSpacing` | self font | |
| `textPadding` | self font | |
| `background` | self font | size/position 부분 |
| `boxShadow` | self font | offset/blur/spread |

- **em** = 해당 컴포넌트 자신의 font-size 기준
- **rem** = MainFrame의 font-size 기준
- **규칙: em/rem 속성은 XML에 직접 쓰지 않고, `FormId_onload` 스크립트에서 설정한다**

```javascript
// Form 태그: <Form id="MyForm" ... onload="MyForm_onload">
this.MyForm_onload = function(obj:nexacro.Form, e:nexacro.LoadEventInfo)
{
    this.btn01.padding       = "1em";
    this.btn01.border        = "0.5em solid #3B82F6";
    this.btn02.letterSpacing = "0.1em";
    this.btn02.wordSpacing   = "0.2em";
    this.btn03.font          = "0.8em/normal \"Malgun Gothic\"";
    this.btn04.boxShadow     = "0.2em 0.2em 0.5rem rgba(0,0,0,0.3)";
};
```

- `text` 속성 값에 em/rem 문자열이 포함되어도 제거 대상 아님 (설명 텍스트)
- 화면 초기화 버튼 패턴: `this.reload()` — taborder 마지막+1, left=1165, top=8

---

## xfdl 파일 복사·리네임 체크리스트

xfdl 파일을 복사하거나 파일명을 변경할 때 반드시 내부를 함께 수정한다:

1. `<Form id="...">` — 새 파일명과 동일하게 수정 (`MyForm01.xfdl` → `id="MyForm01"`)
2. `onload="..."` — 새 Form id에 맞게 수정 (`onload="MyForm01_onload"`)
3. 스크립트 내 `this.OldName_onload = function(...)` — 새 이름으로 수정
4. `$Geninfo$.geninfo` — 빌드 시 자동 재생성이므로 별도 수정 불필요

> xfdl 파일 인코딩: **UTF-8 without BOM** (첫 3바이트 `3C 3F 78` = `<?x`)
> PowerShell 수정 시: `New-Object System.Text.UTF8Encoding($false)` 사용

연속 리네임 시 충돌 방지: 임시 파일명을 경유한다 (10→tmp, 09→10, …, 01→02, tmp→01).

---

## main.xfdl dsMenu 관리

`FrameBase/main.xfdl`의 `dsMenu` Dataset에서 Combo 메뉴 항목을 관리한다:

```xml
<!-- Column0 = 순서 코드(정수), Column1 = Namespace::파일명.xfdl -->
<Row>
  <Col id="Column1">TestCase::MyNewForm.xfdl</Col>
  <Col id="Column0">17</Col>
</Row>
```

- Namespace: `TestCase::` (TestCase 폴더), `Base::` (Base 폴더)
- **새 xfdl 파일 생성 시 반드시 dsMenu에 Row 추가**
- Div에 로드되는 서브 폼(예: `EmRemChild.xfdl`)은 추가 여부를 별도 판단

---

## 앱 캐시 (CacheLevel)

| 값 | 동작 |
|----|------|
| `none` | 캐시 미사용 — 매번 서버에서 수신 |
| `dynamic` | 서버 변경 시에만 재다운로드 (기본 권장) |
| `session` | 실행 시 1회 캐시, 종료까지 유지 |
| `static` | 재실행해도 로컬 캐시만 사용 |

```javascript
// 특정 서비스의 캐시 레벨 동적 변경
nexacro.getEnvironment().services["base"].cachelevel = "none";
```

---

## QuickView vs Launch 실행 방식 구분

| 방식 | 단축키 | 용도 |
|------|--------|------|
| **QuickView** | `Ctrl+F6` / 돋보기 아이콘 | 현재 편집 중인 Form만 단독 실행 — 빠른 컴포넌트/레이아웃 테스트 |
| **Launch** | `Ctrl+F5` | 전체 앱(application.xadl 기준) 실행 — 화면 전환·팝업·메뉴 흐름 테스트 |

> QuickView로 실행 시 Form 단독 구동이므로 `Form_onload`에서 transaction 호출 시 서버가 필요하다.

---

## Nexacro Studio 주요 단축키

| 기능 | 단축키 |
|------|--------|
| 새 Form 만들기 | `Ctrl+N` |
| Dataset Editor | `Ctrl+D` |
| 화면 실행(Launch) | `Ctrl+F5` |
| Quick View | `Ctrl+F6` |
| 파일 내 검색 | `Ctrl+Shift+F` |
| Properties | `Alt+Enter` |
| ID 복사(부모 포함) | `Ctrl+Shift+C` |
| 인텔리센스 | `Ctrl+Space` |
| 중단점 토글 | `F9` |
| Step Into/Over/Out | `F11` / `F10` / `Shift+F11` |
| 디버그 시작/중지 | `F5` / `Shift+F5` |
| 커서까지 실행 | `Ctrl+F10` |

---

## NRE 원격 디버깅 (Chrome inspect)

```bash
# 1. Environment: enableinspector=true 설정
# 2. NRE 실행 시 원격 디버깅 포트 지정
nexacro.exe -K "KEY" -S "http://localhost:8080/start.json" -RPP 127.0.0.1:9223 -brk "true"
# 3. Chrome → chrome://inspect → 포트 추가(9223) → inspect 클릭
```

## NRE 로그 설정 (nexacro_config.xml)

```xml
<nexacro-config os="windows">
  <application file-logging="true" loglevel="debug" tracemode="new" traceduration="-1"/>
  <log filepath="%USERAPP%\Log\nre.log" filesize="408960" backupfilecount="5"/>
</nexacro-config>
```

- `loglevel`: `fatal|error|warn|info|debug` (trace()는 debug 레벨)
- Windows/macOS NRE 전용 (웹 브라우저 환경 미지원)

---

## xapi 서버 서비스 개발 (Java)

transaction() 호출 시 서버에서 처리하는 Java 서비스는 **nexacro xapi** 라이브러리로 구현한다.

### 패키지 구조 및 import

```java
import com.nexacro.java.xapi.data.*;            // PlatformData, DataSet, VariableList, DataTypes, ColumnHeader
import com.nexacro.java.xapi.data.datatype.*;   // PlatformDataType
import com.nexacro.java.xapi.tx.*;              // HttpPlatformRequest, HttpPlatformResponse, PlatformException, PlatformType
```

### PlatformData 구조

```
PlatformData (최상위 컨테이너)
  ├─ VariableList  — 단일 파라미터 (ErrorCode, ErrorMsg, 검색조건 등)
  └─ DataSetList   — DataSet 목록 (2차원 테이블 데이터)
       └─ DataSet  — ColumnHeader 목록 + 행 데이터
```

### DataTypes 상수

| 상수 | Java 타입 | 포맷 |
|------|---------|------|
| `DataTypes.STRING` | `String` | - |
| `DataTypes.INT` | `int` | - |
| `DataTypes.LONG` | `long` | - |
| `DataTypes.DOUBLE` | `double` | - |
| `DataTypes.FLOAT` | `float` | - |
| `DataTypes.BIG_DECIMAL` | `BigDecimal` | - |
| `DataTypes.BOOLEAN` | `boolean` | - |
| `DataTypes.DATE` | `Date` | yyyyMMdd |
| `DataTypes.DATE_TIME` | `Date` | yyyyMMddHHmmssSSS |
| `DataTypes.BLOB` | `byte[]` | - |

### DataSet API (Java)

```java
// 컬럼 정의
DataSet ds = new DataSet("dsResult");
ds.addColumn(new ColumnHeader("USER_ID",   DataTypes.STRING, 20));
ds.addColumn(new ColumnHeader("USER_NM",   DataTypes.STRING, 50));
ds.addColumn(new ColumnHeader("REG_DT",    DataTypes.DATE));
ds.addColumn(new ColumnHeader("AMT",       DataTypes.BIG_DECIMAL));

// 행 추가 및 값 설정
int row = ds.newRow();
ds.setValue(row, "USER_ID", "hong");
ds.setValue(row, "USER_NM", "홍길동");
ds.setValue(row, "AMT",     new BigDecimal("50000.00"));

// 값 읽기 (타입별)
String  userId = ds.getString(i,  "USER_ID");
int     cnt    = ds.getInt(i,     "CNT");
double  amt    = ds.getDouble(i,  "AMT");
Date    dt     = ds.getDateTime(i,"REG_DT");
Object  val    = ds.getObject(i,  "COL");

// 행 상태 확인 — 클라이언트가 변경한 행 처리 시 필수
int rowType = ds.getRowType(i);
// ROW_TYPE_NORMAL=0, ROW_TYPE_INSERT=1, ROW_TYPE_UPDATE=2, ROW_TYPE_DELETE=3
```

### VariableList API

```java
VariableList varList = resData.getVariableList();
varList.add("ErrorCode", 0);          // int
varList.add("ErrorMsg",  "SUCCESS");  // String
varList.add("TotalCnt",  100);

// 요청 Variable 읽기
VariableList inVar = reqData.getVariableList();
String searchNm = inVar.getString("SEARCH_NM");
int    pageNo   = inVar.getInt("PAGE_NO");
```

### 완전한 JSP 서비스 패턴

```jsp
<%@ page import="com.nexacro.java.xapi.data.*, com.nexacro.java.xapi.tx.*" %>
<%@ page contentType="text/xml; charset=UTF-8" %>
<%
    out.clearBuffer();  // 필수 — 앞선 출력 제거

    // 1. 요청 수신
    HttpPlatformRequest req = new HttpPlatformRequest(request);
    req.receiveData();
    PlatformData reqData = req.getData();

    // 2. 입력값 추출
    VariableList inVar = reqData.getVariableList();
    String searchNm = inVar.getString("SEARCH_NM");
    DataSet dsIn = reqData.getDataSet("dsSearch");

    // 3. 응답 생성
    PlatformData resData = new PlatformData();

    // 4. 결과 Dataset 구성
    DataSet dsOut = new DataSet("dsResult");
    dsOut.addColumn(new ColumnHeader("USER_ID", DataTypes.STRING, 20));
    dsOut.addColumn(new ColumnHeader("USER_NM", DataTypes.STRING, 50));
    // ... DB 조회 후 행 추가 ...
    resData.addDataSet(dsOut);

    // 5. 처리 결과 Variable
    resData.getVariableList().add("ErrorCode", 0);
    resData.getVariableList().add("ErrorMsg",  "SUCCESS");

    // 6. 응답 송신
    HttpPlatformResponse res = new HttpPlatformResponse(response, req);
    res.setData(resData);
    res.sendData();
%>
```

### Servlet 패턴 (복잡한 비즈니스 로직 시)

```java
protected void doPost(HttpServletRequest request, HttpServletResponse response)
        throws ServletException, IOException {
    try {
        HttpPlatformRequest  req     = new HttpPlatformRequest(request);
        req.receiveData();
        PlatformData         reqData = req.getData();
        PlatformData         resData = processService(reqData);
        HttpPlatformResponse res     = new HttpPlatformResponse(response, req);
        res.setData(resData);
        res.sendData();
    } catch (PlatformException e) {
        sendError(response, -1, e.getMessage());
    } catch (Exception e) {
        sendError(response, -999, "서버 오류: " + e.getMessage());
    }
}
```

### 행 상태(RowType)별 CRUD 처리 패턴

```java
DataSet dsIn = reqData.getDataSet("dsSave");
for (int i = 0; i < dsIn.getRowCount(); i++) {
    int rowType = dsIn.getRowType(i);
    if (rowType == DataSet.ROW_TYPE_INSERT) {
        // INSERT
    } else if (rowType == DataSet.ROW_TYPE_UPDATE) {
        // UPDATE
    } else if (rowType == DataSet.ROW_TYPE_DELETE) {
        // DELETE
    }
}
```

### ContentType / 인코딩 설정

| 항목 | 설정값 |
|------|--------|
| JSP contentType | `text/xml; charset=UTF-8` |
| Binary 응답 | `PlatformType.CONTENT_TYPE_BINARY` |
| ZLIB 압축 | `res.addProtocolType(PlatformType.PROTOCOL_TYPE_ZLIB)` |
| Tomcat JVM 옵션 | `-Dfile.encoding=UTF8` |

**Excel MIME 타입 (web.xml):**
```xml
<mime-mapping>
  <extension>xlsx</extension>
  <mime-type>application/vnd.openxmlformats-officedocument.spreadsheetml.sheet</mime-type>
</mime-mapping>
```

### xapi 서비스 개발 체크리스트

- `out.clearBuffer()` 호출 (JSP에서 필수)
- `receiveData()` / `sendData()` 는 반드시 `try-catch(PlatformException)` 으로 감쌀 것
- 응답에 `ErrorCode` (0=성공, 음수=오류) + `ErrorMsg` 포함 필수
- 저장 서비스는 `getRowType()` 으로 INSERT/UPDATE/DELETE 분기 처리
- 컬럼명은 **대문자** 사용 (클라이언트 Dataset과 일치해야 함)

### Jakarta EE 지원 (중요)

| Tomcat 버전 | 패키지 |
|------------|--------|
| Tomcat 9 이하 | `javax.servlet.*` |
| Tomcat 10 이상 | `jakarta.servlet.*` |

> 환경에 맞는 X-API 빌드(jar)를 사용해야 함. 패키지 불일치 시 ClassNotFoundException 발생.

### java.lang.IllegalStateException 대처 (빈발 이슈)

SSV/Binary 전송 시 발생 (XML/CSV는 미발생). JSP 대신 **Servlet** 사용이 근본 해결책.
Tomcat/WebSphere에서 발생, WebLogic/JEUS에서는 자동 무시됨.

### HTTP GET 파라미터 수신

```java
req.setProperty("http.getparameter.register", "true");
req.setProperty("http.getparameter.asvariable", "true");  // true=Variable, false=DataSet
```

### ZLIB 압축 응답

```java
HttpPlatformResponse res = new HttpPlatformResponse(response, PlatformType.CONTENT_TYPE_BINARY);
res.addProtocolType(PlatformType.PROTOCOL_TYPE_ZLIB);
res.setData(resData);
res.sendData();
```

### nexacro-xeni Excel 내보내기/가져오기 (web.xml 등록 필수)

```xml
<!-- web.xml -->
<servlet>
  <servlet-name>XExportImport</servlet-name>
  <servlet-class>com.nexacro.java.xeni.services.GridExportImportServlet</servlet-class>
</servlet>
<servlet-mapping>
  <servlet-name>XExportImport</servlet-name>
  <url-pattern>/XExportImport</url-pattern>
</servlet-mapping>
```

클라이언트: `ExcelExportObject`/`ExcelImportObject`의 `exporturl`/`importurl`을 `/XExportImport`로 설정.

> **null 문자(0x00) 주의**: NRE는 0x00을 문자열 종료로 인식하므로, X-API 응답 데이터에 0x00이 포함되면 잘림 현상 발생.

---

## 모듈(.xmodule) 개발 — Composite Component형

모듈은 재사용 가능한 복합 컴포넌트(Composite Component) 단위이다.

**패키지 구성:**
```
MyModule.xmodule
├── module.xml        — 타입 정의 (Property, Method, Event)
├── MyModule.xcdl     — 컴포지트 컴포넌트 UI 레이아웃
├── MyModule.js       — 동작 로직 (prototype 기반)
└── resource/         — 이미지, xcss 스타일
```

**모듈 스크립트 기본 구조:**
```javascript
nexacro.MyModule = function(name, left, top, width, height) {
    nexacro._CompositeComponent.call(this, name, left, top, width, height);
    this._p_myProp = "";
};
nexacro.MyModule.prototype = Object.create(nexacro._CompositeComponent.prototype);

// getter/setter
nexacro.MyModule.prototype.set_myProp = function(v) {
    if (this._p_myProp != v) { this._p_myProp = v; }
};
nexacro.MyModule.prototype.get_myProp = function() {
    return this._p_myProp;
};
```

**모듈 배포/설치:** `Deploy > Module Package` 생성 후 `File > Install Module`로 설치 → 컴포넌트 팔레트에 자동 등록.

---

## 모듈(.xmodule) 개발 — Action형

Composite Component형 외에 **Action형** 모듈도 존재 (nexacro v24 실측 확인).

**Action형 모듈 내부 구조 (xmodule은 ZIP):**
```
SimpleActionTest.xmodule (ZIP)
├── SimpleActionTest.json              ← 매니페스트
└── SimpleActionTest/
    ├── TestQueryAction.js             ← 동작 로직
    └── _metainfo_/{KOR,ENG,JPN}/      ← TypeDefinition (*.info, MetaInfo XML)
```

**매니페스트 JSON 핵심 키:**
```json
{
  "name": "SimpleActionTest",
  "moduletype": "action",
  "version": "1.0.0",
  "minnexacroversion": "24.0.0",
  "scripts": ["SimpleActionTest/TestQueryAction.js"]
}
```

**Action형 모듈 .js 패턴:**
```javascript
(function(nexacro) {
    "use strict";
    if (nexacro.TestAlertAction) return;   // 중복 로드 가드

    var TestAlertAction = function(id, parent) {
        nexacro.Action.call(this, id, parent);
    };
    var _p = nexacro._createPrototype(nexacro.Action, TestAlertAction);
    TestAlertAction.prototype = _p;
    _p._type_name = "TestAlertAction";

    _p.set_message = function(v) { this.message = v; };   // setter: set_<속성명>
    _p.run = function() { alert(this.message); };           // Action 진입점
    _p.destroy = function() {
        nexacro.Action.prototype.destroy.call(this);
        this.message = null;
    };

    nexacro.TestAlertAction = TestAlertAction;
})(nexacro);
```

**TypeDefinition (MetaInfo XML — `_metainfo_/<LANG>/*.info`):**
```xml
<MetaInfo version="2.0">
  <Object id="TestAlertAction">
    <ObjectInfo inheritance="nexacro.Action" classname="nexacro.TestAlertAction"
                group="Action" requirement="Edge,Chrome,Windows NRE"/>
    <PropertyInfo>
      <Property name="message" group="Action" edittype="String" description="표시할 메시지"/>
    </PropertyInfo>
    <MethodInfo/> <EventHandlerInfo/>
  </Object>
</MetaInfo>
```

**연관 파일 형식:**
- `.xmodel` — transaction 입출력 스키마 정의 (`iotype="input|output"`)
- `.xpackage` — 프로젝트 일괄 가져오기 ZIP (`File > Import Package`)

---

## X-PUSH 실시간 메시지 처리

```javascript
// Form_onload: X-PUSH 서버 연결
this.Form_onload = function(obj, e) {
    this.XPush00.connect("user00", "password");
};

// onsuccess: 연결 성공 시 구독 등록
this.XPush00_onsuccess = function(obj, e) {
    if (e.action == nexacro.XPushAction.AUTH) {  // AUTH=0
        this.XPush00.subscribe("OPDT", "ALL", this, this.Dataset00, "append", "fn_PushCallback");
    }
};

// 메시지 수신 콜백
this.fn_PushCallback = function(Row, ChangeColumn, AllColumn, Type, ActionType) {
    trace(Row, ChangeColumn, AllColumn, Type, ActionType);
};

// onerror: 연결 실패 원인 확인
this.XPush00_onerror = function(obj, e) {
    trace(e.errormsg, e.statuscode);
};
```

**XPush 오브젝트 필수 속성:**
- `layouturl` — 메시지 레이아웃 XML 파일 URL
- `iplist` — X-PUSH 서버 IP/PORT (TCP: 10081, HTTP: 10080)
  - `iplist="http://localhost:10080,localhost:10081"` (웹·NRE 동시 지원)

**신뢰성 메시지(Reliable):** `registerTopic` → `requestMessage` → `sendResponse` 순서

---

## 프로토콜 어댑터 (Protocol Adaptor)

```javascript
// 암호화: 전송 전 호출
nexacro.MyPtAdp.prototype.encrypt = function(strUrl, strData) {
    return strData;
};

// 복호화: 수신 후 호출
nexacro.MyPtAdp.prototype.decrypt = function(strUrl, strData) {
    return strData;
};

// 사용: transaction URL에 프로토콜 어댑터 스킴 적용
this.transaction("svcId", "myPtAdp://server:8080/api/endpoint", ...);
```

**배포 절차:** 넥사크로 모듈 디벨로퍼 → `[Deploy > ModulePackage]` → Type: `protocoladaptor` → Studio에서 Install → TypeDefinition에 Protocol 등록

---

## 런처 서비스 (Launcher Service / TPLSvc)

액티브X/플러그인 없이 웹 브라우저에서 nexacro NRE를 실행하는 Windows 서비스.

**통신 방식:** JSON 형식 → `http://127.0.0.1:7895/launcher/nexacro/<timestamp>`

```javascript
// 1. create: ID 할당 받기
var obj = { platform: "nexacro", action: "create" };
var xhr = new XMLHttpRequest();
xhr.onreadystatechange = function() {
    if (xhr.readyState == 4 && xhr.status == 200) {
        var result = JSON.parse(xhr.responseText);
        if (result.result == "success") { nexacroId = result.id; doSetProperty(); }
    }
};
xhr.open("POST", "http://127.0.0.1:7895/launcher/nexacro/" + new Date().getTime(), true);
xhr.send(JSON.stringify(obj));

// 2. setproperty: 필수 속성 설정
var setPropObj = {
    platform: "nexacro", id: nexacroId, action: "setproperty",
    value: {
        key: "myApp", bjson: "http://server/start.json",
        version: "24", onlyone: true
    }
};

// 3. method: launch — NRE 실행
var launchObj = { platform: "nexacro", id: nexacroId, action: "method", value: { launch: null } };
```

**런처 서비스 포트:**

| 통신 | 기본 포트 |
|------|---------|
| HTTP | 7895~7935 |
| HTTPS | 7936~7966 |
| WebSocket | 7970~7981 |

**주요 에러 코드:** 102: key 미설정 / 103: bjson 미설정 / 104: 이미지 다운로드 실패 / 105: nexacro.xml 읽기 실패

---

## eGovFrame(전자정부 프레임워크) 연동 개요

**핵심 원칙:**
- 기존 Service / DAO / SQL Mapper는 **그대로 재사용**
- nexacro 전용 **Controller만 새로 작성** (JSON 응답 처리)
- `pom.xml`에 Jackson 라이브러리 추가 (JSON 통신 지원)

**JSP 화면 전환 (iframe 삽입):**
```jsp
<c:choose>
  <c:when test="${param.menu == 'notice'}">
    <iframe src="/nexa_ui/launch.html" width="100%" height="600px" frameborder="0"/>
  </c:when>
  <c:otherwise><%-- 기존 eGovFrame 뷰 --%></c:otherwise>
</c:choose>
```

**연동 파일 복사 순서:**
1. `egov_nexacroN.zip` 압축 해제
2. 넥사크로 프로젝트 소스 → 기존 eGovFrame 프로젝트에 병합
3. Controller 파일 → `src/main/java/.../web/` 에 복사
4. Generate 산출물 → `src/main/webapp/nexa_ui/` 에 복사

---

## V24 동작 변경점 (v21 → v24 마이그레이션 시 주의)

| 구분 | 변경 전 | 변경 후 |
|------|---------|---------|
| 부등호 연산자 | `<>` | `!=` |
| switch-case 타입 비교 | 느슨한 비교 | 엄격 비교 (`case "2"` ≠ `case 2`) |
| regex replace | 전체 치환 | `/g` 없으면 첫 번째만 치환 |
| 소수점 반올림 | `Math.floor(v, digit)` | `nexacro.floor(v, digit)` |
| 이미지 객체 | `new Image()` | `new nexacro.Image()` |
| CSS 클래스 | `.class` | `.cssclass` |

---

## nexacrodeploy 콘솔 도구 (빌드 자동화)

```bash
# 필수 4개 옵션
nexacrodeploy.exe -P [xprj경로] -O [출력경로] -B [nexacrolib경로] -GENERATERULE [generate룰경로]

# Generate + Deploy + 압축 + 난독화
nexacrodeploy.exe -P "C:\Test.xprj" -O "E:\Gen" -B "C:\nexacrolib" \
    -GENERATERULE "C:\generate" -D "E:\Deploy" -COMPRESS -SHRINK
```

| 옵션 | 설명 |
|------|------|
| `-SERVICE "Base,FrameBase"` | 서비스 선택 (콤마 뒤 공백 금지) |
| `-REGENERATE` | 변경 무시, 전체 재변환 |
| `-COMPRESS` | 공백·주석 제거 |
| `-SHRINK` | JS 난독화 (`eval` 함수 제외) |
| `-MERGE` / `-MERGEXCSS` | JS/XCSS 병합 (HTTP 요청 수 감소) |
| `-COMPILE` | NRE 전용 암호화 |

> Generate Rule 경로: `[SDK]/{24.x}/generate` 폴더. 구 `-CSSRULE`는 폐지됨.

---

## 주의사항

- Dataset 컬럼명은 반드시 **대문자** 사용 (`USER_ID` ○, `user_id` ✕)
- `this` 스코프: 이벤트 핸들러 내부에서는 `this` = Form. 일반 함수에서는 `this`가 Form이 아니므로 `oForm` 파라미터로 전달받아 사용
- `nexacro.getForm("FormId")` **사용 금지** — 이벤트 핸들러에서는 `this`를, 일반 함수에서는 `oForm` 파라미터를 사용할 것
- Grid-Dataset 연결은 반드시 **`binddataset`** 속성 사용 (`innerdataset`은 외부 Dataset 바인딩에 사용 불가)
- Grid 정렬 후 행 인덱스가 변경되므로 Dataset 직접 접근으로 값 추적
- 대량 데이터 루프 전 `updatecontrol = false` 설정 필수 (성능)
- 팝업 콜백은 함수 참조가 아닌 **함수명 문자열**로 전달
- 지원 브라우저: Chrome, Edge (최신 버전)
- 서버 응답 콘텐츠 타입: `text/xml; charset=UTF-8` (PlatformData 포맷 사용 시)
