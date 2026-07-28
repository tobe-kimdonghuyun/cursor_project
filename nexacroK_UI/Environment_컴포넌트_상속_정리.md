# Environment / nexacro 객체 상속 관계 정리

> 조사 대상: `nexacroK_UI/DynamicSample` 프로젝트
> 참고 자료: `nexacro_reference/Environment.md`, `nexacroN_rules.md`
> 목적: 컴포넌트 속성 중 nexacro 객체·Environment 객체로부터 상속/참조되는 것을 파악하여 향후 샘플 작성 시 참고

---

## 1. 구조적 상속 (엔진 레벨)

`DynamicSample/typedefinition.xml`에 Studio 컴포넌트 id와 실제 JS 클래스명이 매핑되어 있고, 모든 컴포넌트는 `nexacro.*` 네임스페이스 클래스를 프로토타입 체인으로 상속한다.

| Studio id | classname |
|---|---|
| Button | `nexacro.Button` |
| Edit | `nexacro.Edit` |
| MaskEdit | `nexacro.MaskEdit` |
| TextArea | `nexacro.TextArea` |
| Static | `nexacro.Static` |
| Combo | `nexacro.Combo` |
| CheckBox | `nexacro.CheckBox` |
| Radio | `nexacro.Radio` |
| ListBox | `nexacro.ListBox` |
| Grid | `nexacro.Grid` |
| Tab | `nexacro.Tab` |
| Calendar | `nexacro.Calendar` |
| Dataset | `nexacro.NormalDataset` (Studio 표기는 "Dataset") |
| DataObject | `nexacro.DataObject` |
| VirtualFile | (typedefinition.xml에 없음 — 순수 스크립트 생성 Invisible 오브젝트) |

`new nexacro.Button(...)`, `new nexacro.Grid(...)` 등은 전부 `Component` → 베이스클래스(`_IconText`, `_EditBase`, `Div` 등) → 최종 클래스로 이어지는 엔진 내부 상속 체인을 사용한다. 프로젝트 전체 공통이며 컴포넌트마다 특별히 다르지 않다.

---

## 2. DynamicSample 스크립트에서 실제 nexacro/Environment/System 값을 참조한 사례

전체 xfdl grep 결과 `nexacro.getEnvironment()`, `nexacro.getApplication()`, `addVariable/getVariable`, `getGlobal/setGlobal` 사용은 **전혀 없음**. `environment.xml`의 `themeid`, `datatyperule`, `appkey`는 엔진이 로드 시 내부적으로 적용하는 설정일 뿐 스크립트에서 참조하지 않는다.

실제 값 참조 사례는 아래 두 부류뿐이다.

| 컴포넌트 | 파일:라인 | 코드 | 출처 객체 | 대입 속성 |
|---|---|---|---|---|
| Static | `VisibleComp/StaticSample.xfdl:58` | `nexacro.getDate("YYYY-MM-DD") + " " + nexacro.getTime("HH:MM:SS")` | `nexacro` (NexacroAPI 정적 메서드) | `Static.text` |
| Calendar | `VisibleComp/CalendarSample.xfdl:46` | `objCal.set_value(nexacro.getDate("YYYYMMDD"))` | `nexacro` | `Calendar.value` |
| VirtualFile | `InvisibleComp/VirtualFileSample.xfdl:83` | `nexacro.getDate("YYYY-MM-DD") + " " + nexacro.getTime("HH:MM:SS")` | `nexacro` | 파일 쓰기 문자열 |
| VirtualFile | `InvisibleComp/VirtualFileSample.xfdl:51` | `system.osversion` 존재 여부 체크 | **System** (Environment 아님) | WRE/NRE 분기 |

> `system.osversion`은 `nexacro_reference/Misc_Objects.md:3357`에 문서화된 **System** 전역 객체 속성으로, `Environment`와는 별개 객체이니 혼동 주의.

---

## 3. `Environment.md` 분석 — 컴포넌트와 연계되는 속성/메서드

### A. 문서에 "컴포넌트가 Environment 값을 상속(fallback)한다"고 명시된 것 — 실제 상속 사례

| Environment 속성 | 관련 컴포넌트 | 근거 (원문) |
|---|---|---|
| `datasetsaveinfinity` | Dataset | "DataSet 의 saveinfinity 속성을 설정하지 않으면 Environment 의 datasetsaveinfinity 속성값이 적용됩니다" |
| `datasetsaveinvaliddate` | Dataset | 동일 패턴 (`saveinvaliddate`) |
| `datasetsavenan` | Dataset | 동일 패턴 (`savenan`) |
| `filesecurelevel` | **VirtualFile** | "VirtualFile 오브젝트 사용" 시 적용 명시 |
| `calendarrestoreonblur` | **Calendar** | "Calendar 컴포넌트의 type 속성값이 'monthonly'로 설정된 경우..." |
| `usedateautocalibration` | **Calendar** | "Calendar 컴포넌트의 calendaredit 영역에..." |
| `multivalueseparator` | Dataset/MultiCombo | "Multi Value 바인딩된 Dataset 오브젝트에서 구분자로 사용할 값" |

→ `Calendar`, `VirtualFile`은 DynamicSample에 실제 샘플이 있는 컴포넌트. 스크립트로 건드리지 않아도 **엔진이 Environment 기본값을 자동 상속**해서 동작 중이었음.

### B. 이름이 같은 컴포넌트 속성이 있어 "전역 기본값 → 개별 오버라이드" 구조로 보이는 것

| Environment 속성군 | 대응 컴포넌트 속성 | 관련 컴포넌트 |
|---|---|---|
| `accessibility*` 13개 | `accessibilitylabel`, `accessibilityaction`, `accessibilitydescription`, `accessibilityenable`, `accessibilityrole` (Button.md 등) | Button, Edit, Combo, CheckBox, Radio, Calendar, ListBox, Tab |
| `rtl` | 각 컴포넌트의 `rtl` 속성 | 전 컴포넌트 |
| `scrollbartype`/`scrollbarsize`/`scrollindicatorsize` | Grid/ListBox/TextArea 등의 `vscrollbar`/`hscrollbar` Controls | Grid, ListBox, TextArea |
| `tabkeycirculation` | 각 컴포넌트 `taborder` | Button, Edit, Combo 등 |
| `enabletouchsoftkeyboard` | 컴포넌트 `usesoftkeyboard` 속성이 true일 때만 적용 | Edit, MaskEdit, TextArea, Combo |

### C. DataObject/통신 관련 (DataObjectSample과 직결)

| Environment 항목 | 역할 |
|---|---|
| `usewaitcursor` | transaction/DataObject 통신 대기 중 WaitCursor 표시 |
| `httptimeout`, `httpretry`, `usehttpkeepalive`, `useproxykeepalive`, `networksecurelevel`, `dnsquery`, `enablecache`, `enablecookie` | HTTP 통신 정책 — `DataObject.request()` 호출 시 적용 |
| `services` (읽기전용) | TypeDefinition Services 정보 — DataObjectSample REST URL이 여기 규칙을 따름 |
| `onerror` 이벤트 | "DataObject 오브젝트의 load, request 메서드 실행 중... 발생" |

### D. NexacroAPI의 Environment 전용 메서드 4개 — 프로젝트 미사용

```javascript
var objEnv = nexacro.getEnvironment();
nexacro.getEnvironmentVariable(strID);
nexacro.setEnvironmentVariable(strID, v);
nexacro.removeEnvironmentVariable(strID);
```

`nexacro.getApplication().addVariable()/getVariable()` (Application 전역변수)와는 **별개 저장소**. Environment.md 자체가 "Application의 AppVariables 영역 값을 얻으려면 getApplication()을 사용해야 한다"고 구분 명시.

---

## 4. 결론

- 스크립트 레벨에서 Environment를 직접 참조한 코드는 없었지만, **Calendar와 VirtualFile은 엔진이 Environment 기본값(`calendarrestoreonblur`, `usedateautocalibration`, `filesecurelevel`)을 자동 상속**해서 동작하고 있었다 → "코드상 참조는 없지만 런타임 상속은 존재".
- `accessibility*`, `rtl`, `scrollbartype` 계열은 컴포넌트 쪽에도 동일 이름 속성이 있어 전역 기본값 + 개별 오버라이드 구조.
- 값을 실제로 오버라이드하려면 `nexacro.getEnvironment()` 접근이 필요한데, 이 프로젝트엔 그 호출 자체가 없다.

---

## 5. 샘플 작성 제안 — 다음에 볼만한 부분

기존 `DynamicSample`은 "컴포넌트 동적 생성" 위주라 Environment 연동을 다루는 샘플이 없다. 아래를 신규 샘플 후보로 제안한다.

### 제안 1. `EnvironmentSample.xfdl` (신규, InvisibleComp 또는 별도 폴더)
- `nexacro.getEnvironment()`로 오브젝트를 얻고, `locale`, `usewaitcursor`, `themeid` 등 몇 개 속성을 읽어서 화면에 표시
- 버튼 클릭으로 `objEnv.enableclipboard = false` 처럼 값을 바꿔보고 Edit에서 복사/붙여넣기가 실제로 막히는지 확인 → "상속/오버라이드"를 눈으로 보여주는 가장 직관적인 샘플

### 제안 2. Calendar × Environment 상속 시연
- 현재 `CalendarSample.xfdl`은 `type="monthonly"`를 쓰지 않아 `calendarrestoreonblur` 속성이 사실상 동작하지 않음
- `type="monthonly"`로 Calendar 하나를 추가하고, `nexacro.getEnvironment().calendarrestoreonblur = false/true` 토글 버튼을 붙이면 A항목에서 정리한 상속 관계를 실제로 검증 가능

### 제안 3. VirtualFile × `filesecurelevel` 시연
- 현재 `VirtualFileSample.xfdl`은 파일 R/W만 테스트함
- `nexacro.getEnvironment().filesecurelevel = "private"`으로 두고 Personal Path 밖의 경로에 접근 시도 → UserConfirm 창이 뜨는지 확인하는 케이스를 추가하면 "Environment 속성이 VirtualFile 동작에 실제로 영향을 준다"를 증명할 수 있음
- 단, NRE 환경에서만 의미가 있으므로 WRE 실행 시 안내 문구 필요

### 제안 4. Dataset × `datasetsaveinfinity`/`datasetsavenan` 상속 시연
- `DatasetSample.xfdl`에 `Infinity`/`NaN` 값을 컬럼에 넣고 `saveXML()` 호출 결과를 TextArea에 출력
- Dataset 자체의 `saveinfinity`/`savenan` 속성을 설정한 경우와, 설정하지 않고 `Environment.datasetsaveinfinity`만 바꾼 경우를 비교 → "컴포넌트 개별 속성이 있으면 우선, 없으면 Environment로 fallback" 구조를 실증

### 제안 5. Environment Variables vs Application Variables 비교 샘플
- `nexacro.setEnvironmentVariable("V1", "env-value")`와 `nexacro.getApplication().addVariable("V2", "app-value")`를 나란히 실행
- `nexacro.getEnvironmentVariable("V1")` / `nexacro.getApplication().getVariable("V2")`로 각각 조회
- 두 저장소가 완전히 분리되어 있다는 점(Environment.md의 경고 문구)을 실습으로 보여주면 헷갈리기 쉬운 개념을 확실히 정리 가능

### 제안 6. `onerror` 전역 이벤트 vs 개별 콜백 비교 (DataObjectSample 확장)
- 현재 `DataObjectSample.xfdl`은 `onsuccess`만 처리하고 `onerror`가 없음
- 일부러 잘못된 URL로 호출해서 `Environment.onerror` 전역 이벤트가 잡히는지, 아니면 DataObject 자체 `onerror` 핸들러가 우선하는지 확인하는 샘플을 추가하면 통신 에러 처리 우선순위(C항목)를 검증할 수 있음

### 우선순위 제안
개인적으로는 **제안 1(EnvironmentSample) → 제안 4(Dataset 상속) → 제안 2(Calendar 상속)** 순으로 만들어보는 걸 추천한다. 제안 1은 Environment 접근 자체를 처음 다루는 가장 기초 샘플이고, 제안 4는 이미 있는 `DatasetSample.xfdl`을 확장하는 것이라 작업량이 적으면서도 "속성 상속"이라는 핵심 개념을 가장 명확하게 보여준다. 제안 2·3·5·6은 그 다음 단계로 진행하면 될 것 같다.
