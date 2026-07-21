/**
 *  devPack Library
 *  @FileName 	Frame.js
 *  @Creator 	TOBESOFT
 *  @CreateDate 	2020.11.24
 *  @Desction
 ************** 소스 수정 이력 ***********************************************
 *  date          		Modifier                Description
 *******************************************************************************
 * 2020.11.24			TOBESOFT				Frame Library
 *******************************************************************************
 */

var pForm = nexacro.Form.prototype;

/* 메뉴정보 칼럼 변수*/
pForm.FRAME_MENUCOLUMNS =
{
	menuId 			: "menuId",    		// 아이디
	menuNm 			: "menuNm",			// 명칭
	groupId			: "groupId",			// 메뉴그룹 아이디
	menuNavi		: "naviNm",			// 메뉴 네비게이션
	menuUrl 		: "menuUrl",			// 프로그램 URL(서비스그룹명 + "::" + 파일명)
	menuLevel 		: "level",     		// 메뉴레벨
    upMenuId    	: "upMenuId",		// 상위메뉴 아이디
	useYn			: "useYn",			// 사용여부
	//searchBtnYn     : "CMMNBTNSEARCH",      // 공통조회버튼 사용여부
	//addBtnYn		: "CMMNBTNADD",			// 공통추가버튼 사용여부
	//delBtnYn		: "CMMNBTNDEL",			// 공통삭제버튼 사용여부
	//saveBtnYn		: "CMMNBTNSAVE",		// 공통저장버튼 사용여부
	//printBtnYn		: "CMMNBTNPRINT",		// 공통출력버튼 사용여부
	//excelBtnYn	    : "CMMNBTNEXCELDOWN",	// 공통엑셀버튼 사용여부
	winId 			: "winId",      		// 윈도우(프레임)아이디(열린 메뉴의 윈도우 아이디)
	//title 			: "menuNm",			// 메뉴타이틀
	//param			: "param",
};

/************************************************************************************************
 * Frame 제어 관련
 ************************************************************************************************/
/**
 * @class Profile을 반환하는 메소드
 * @param  none
 * @return {String} 실행환경 구분(S:NexacroStudio, L:로컬(웹), R:운영(웹), D:개발)
 * @example this.gfnGetRunMode();
 */
pForm.gfnGetRunMode = function()
{
	return app.gvRunMode;
}

/**
 * @class Nexacro browser 여부 확인
 * @return {Boolean} Nexacro browser 여부
 * @example this.gfnIsNexaBrowser();
 */
pForm.gfnIsNexaBrowser = function()
{
	return (system.navigatorname == "nexacro");
}

/**
 * @class 모바일여부반환
 * @param  none
 * @return "1"/"0"
 * @example this.gfnIsMobile();
 */
pForm.gfnIsMobile = function ()
{
	var uA = ((nexacro._isMobile && nexacro._isMobile()) || (nexacro._isHybrid && nexacro._isHybrid()) || (!nexacro._isDesktop() && nexacro._OS == "Android" && nexacro._Browser == "Runtime"))
	if (uA==true||uA=="true") {
		return "1";
	}
	else {
		return "0";
	}
};

/**
 * @class 로그인 처리
 * @param  none
 * @return N/A
 * @example this.gfnSetLogin();
 */
pForm.gfnSetLogin = function()
{
	app.gvCloseCheck = true;

	// URL 연결
	app.gvFrmTop.set_formurl(app.TOP_FORM_PATH);

	// LogIn Frame Form Url Initiate
	app.gvFrmLogin.set_formurl("");

	// 메인화면셋팅
	this.gfnSetMain();
};

/**
 * @class  메인(홈) 화면으로 이동
 * @return N/A
 * @example this.gfnSetMain();
 */
pForm.gfnSetMain = function()
{
	if (this.gfnIsNull(app.gvFrmBody.formurl))
	{
		app.gvFrmBody.set_formurl(app.MAIN_FORM_PATH);
	}

	if (app.gvFrmMain)
	{
		this.gfnResizeFrameHeight(app.gvFrmMain.form.divWork.form, true);
		app.gvFrmMain.set_visible(true);
		app.gvFrmMain.form.setFocus(false);
	}

	if (app.gvFrsWork) app.gvFrsWork.set_visible(false);
	
	if (app.gvFrmMdi) app.gvFrmMdi.form.fnSetButtonStyle('home');
};

/**
 * @class  좌측 Frame을 보여준다.
 * @param  none
 * @return N/A
 * @example this.gfnShowLeftFrame();
 */
pForm.gfnShowLeftFrame = function ()
{
	app.gvFrmLeft.set_width(app.gvFrmLeft.org_width);

	app.gvFrmTop.form.divLeft.set_width(app.gvFrmTop.form.divLeft.org_width);
	app.gvFrmTop.form.staLogo.set_visible(false);
	app.gvFrmTop.form.resetScroll();

	app.gvFrmBody.form.btnLeftMenuShowHide.set_cssclass("btn_LF_hide");
	app.gvFrmBody.form.resetScroll();
	app.gvFrmBody.form.fnResizeBottomWidth();
};

/**
 * @class  좌측 Frame을 숨긴다.
 * @param  none
 * @return N/A
 * @example this.gfnHideLeftFrame();
 */
pForm.gfnHideLeftFrame = function ()
{
	app.gvFrmLeft.set_width(0);

	app.gvFrmTop.form.divLeft.set_width(0);
	app.gvFrmTop.form.staLogo.set_visible(true);
	app.gvFrmTop.form.resetScroll();

	app.gvFrmBody.form.btnLeftMenuShowHide.set_cssclass("btn_LF_show");
	app.gvFrmBody.form.resetScroll();
	app.gvFrmBody.form.fnResizeBottomWidth();
};

/**
 * @class  우측 Frame을 보여준다.
 * @param  none
 * @return N/A
 * @example this.gfnShowRightFrame();
 */
pForm.gfnShowRightFrame = function ()
{
	app.gvFrmRight.set_width(app.gvFrmRight.org_width);
	app.gvFrsWork.set_right(app.gvFrsWork.org_right);
	app.gvFrmMain.set_right(app.gvFrmMain.org_right);
	
	app.gvFrmTop.form.divMdi.set_right(app.gvFrmTop.form.divMdi.org_right);

	app.gvFrmBody.form.btnRightMenuShowHide.set_cssclass("btn_RF_hide");
	app.gvFrmBody.form.resetScroll();
	app.gvFrmBody.form.fnResizeBottomWidth();
	
	if (app.gvFrmBody.form.hscrollbar.max > 0) app.gvFrmBody.form.hscrollbar.set_pos(app.gvFrmBody.form.hscrollbar.max);
};

/**
 * @class  우측 Frame을 숨긴다.
 * @param  none
 * @return N/A
 * @example this.gfnHideRightFrame();
 */
pForm.gfnHideRightFrame = function ()
{
	app.gvFrmRight.set_width(0);
	app.gvFrsWork.set_right(0);
	app.gvFrmMain.set_right(0);
	
	app.gvFrmTop.form.divMdi.set_right(77);

	app.gvFrmBody.form.btnRightMenuShowHide.set_cssclass("btn_RF_show");
	app.gvFrmBody.form.resetScroll();
	app.gvFrmBody.form.fnResizeBottomWidth();
};

/**
 * @class  메뉴오픈 (frame open)
 * @param {String} sMenuId : 화면ID
 * @param {Object} bjParam : 화면에 넘길 파라미터 Object
 * @param {Boolean} bReload	: 화면을 리로드 할지 여부
 * @return {Boolean} 화면오픈 성공여부
 * @example this.gfnOpenMenu(sMenuId, objParam);
 */
pForm.gfnOpenMenu = function(sMenuId, objParam, bReload)
{
	// Null Check
	if (this.gfnIsNull(sMenuId))
	{
		this.gfnAlert("msg.nomenu");
		return false;
	}

	if (this.gfnIsNull(bReload)) bReload = true;

	var nRow = app.gdsMenu.findRow(this.FRAME_MENUCOLUMNS.menuId, sMenuId);
	var sMenuUrl = app.gdsMenu.getColumn(nRow, this.FRAME_MENUCOLUMNS.menuUrl);
	var sWinId = app.gdsOpenMenu.lookupAs(this.FRAME_MENUCOLUMNS.menuId, sMenuId, this.FRAME_MENUCOLUMNS.winId);
	var sMenuNm	= app.gdsOpenMenu.lookupAs(this.FRAME_MENUCOLUMNS.menuId, sMenuId, this.FRAME_MENUCOLUMNS.menuNm);

	var objMdi = app.gvFrsWork.form.components[sWinId];

	// 기존에 오픈된 화면이 있는 경우 처리
	if (objMdi != null)
	{
		// 리로드(화면에서 오픈)
		if (bReload == true)
		{
			// 변경된 데이터가 있는 경우 confirm, 그외는 그냥 reload
			if (!this.gfnIsNull(objMdi.form.fnWorkFrameClose) && objMdi.form.fnWorkFrameClose() == false)
			{
				// 변경된 데이터가 있습니다. 화면을 다시 여시겠습니까?
				this.gfnAlert("confirm.before.reopen", null, "confirm.before.reopen", function(sId, sVal)
				{
					if (sVal)
					{
						objMdi.arguments["menuId"] 	= sMenuId;
						objMdi.arguments["menuParam"] 	= objParam;
						objMdi.arguments["menuUrl"] 	= sMenuUrl;
						app.gvFrmMdi.form.fnActivateMdi(sWinId);
						objMdi.form.reload();
						return;
					}
					else
					{
						app.gvFrmMdi.form.fnActivateMdi(sWinId);
					}
				});
			}
			else
			{
				objMdi.arguments["menuId"] 	= sMenuId;
				objMdi.arguments["menuParam"] 	= objParam;
				objMdi.arguments["menuUrl"] 	= sMenuUrl;
				app.gvFrmMdi.form.fnActivateMdi(sWinId);
				objMdi.form.reload();
			}
		// 리로드 안함(left메뉴쪽에서 클릭)
		}
		else
		{
			app.gvFrmMdi.form.fnActivateMdi(sWinId);
			//hj	20220525	열려있는 화면에 파라미터 전달 및 호출
			if (this.gfnIsNotEmpty2(objParam)) {
				objMdi.arguments["menuParam"] 	= objParam;
				var workForm = objMdi.form.fvDivWork.form;
				if (this.gfnIsFunction(workForm["fnOpenMenuAction"]))
				{
					workForm.lookupFunc("fnOpenMenuAction").call(objParam);
				}
			}

		}
		return;
	}

	var sMenuUrl	= app.gdsMenu.getColumn(nRow, this.FRAME_MENUCOLUMNS.menuUrl);
	var sMenuNm		= app.gdsMenu.getColumn(nRow, this.FRAME_MENUCOLUMNS.menuNm);

	if(this.gfnIsNull(sMenuUrl)) 	return;
	if(this.gfnIsNull(sMenuNm)) 	return;

	if (app.gdsOpenMenu.rowcount >= app.gvOpenMaxFrame)
	{
		// 팝업 호출
		this.gfnAlert("msg.err.mdicount.max", [app.gvOpenMaxFrame], "msg.err.mdicount.max", null);
		return false;
	}
	else
	{
		this.gfnNewMdi(app.gdsMenu, nRow, objParam, bReload);
	}

	return true;
};

/**
 * @class gds_menu의 해당 Row의 정보를 기준으로 신규 윈도우 화면을 생성하고 open 시킴 <br>
 * @param {Object} objDs - 메뉴 dataset
 * @param {Number} nRow - gds_menu의rowpostion
 * @param  {Object} objParam - 화면에 넘길 파라미터 Object
 * @param {Boolean} bReload	- 화면을 리로드 할지 여부(디폴트 : false)
 * @return N/A
 * @example this.gfnNewMdi(this.gdsMenu, nRow, objParam, false);
 */
pForm.gfnNewMdi = function(objDs, nRow, objParam, bReload)
{
	var objGdsOpenMenu = app.gdsOpenMenu;		// 열린 dataset

	var sMenuId			= objDs.getColumn(nRow, this.FRAME_MENUCOLUMNS.menuId);
	var sMenuUrl		= objDs.getColumn(nRow, this.FRAME_MENUCOLUMNS.menuUrl);
	var sGroupId		= objDs.getColumn(nRow, this.FRAME_MENUCOLUMNS.groupId);
	var sMenuNm  		= objDs.getColumn(nRow, this.FRAME_MENUCOLUMNS.menuNm);
	var sMenuNavi		= objDs.getColumn(nRow, this.FRAME_MENUCOLUMNS.menuNavi);

	if(this.gfnIsNull(sGroupId)) return;		// Group 아이디 없으면 return
	if(this.gfnIsNull(sMenuUrl)) return;		// MenuUrl 이 없으면 return

	var sWinId = "FRAMEWORK_" + "_" + app.gdsOpenMenu.getRowCount() + "_" + parseInt(Math.random() * 1000);

	this.gfnSetOpenMenuDs(sWinId, sMenuId, sMenuNm, sMenuUrl, sGroupId);		// 열린메뉴 화면 삽입

	var objNewWin = new Div();
	objNewWin.init(sWinId, 0, 0, null, null, 0, 0);

	objNewWin.arguments = [];
	objNewWin.arguments[this.FRAME_MENUCOLUMNS.winId] 			= sWinId;
	objNewWin.arguments[this.FRAME_MENUCOLUMNS.menuId] 			= sMenuId;
	objNewWin.arguments[this.FRAME_MENUCOLUMNS.menuNm] 			= sMenuNm;
	objNewWin.arguments[this.FRAME_MENUCOLUMNS.menuUrl] 		= sMenuUrl;
	objNewWin.arguments[this.FRAME_MENUCOLUMNS.groupId] 		= sGroupId;
	objNewWin.arguments["menuParam"] 							= objParam;
	objNewWin.arguments["menuNavi"] 							= sMenuNavi;

	objNewWin._mdi_root = true;
	objNewWin.set_async(false);
	objNewWin.set_url("frame::frmWork.xfdl");

	app.gvFrsWork.form.addChild(objNewWin.name, objNewWin);

	objNewWin.show();

	app.gvFrmMdi.form.fnAddTab(sWinId, sMenuNm);    //mdi tab button add
	app.gvFrmMdi.form.fnActivateMdi(sWinId);
};

/**
 * @class 열린화면 데이터셋에 추가 <br>
 * @param {String} sWinId : childframe key
 * @param {String} sMenuid : 메뉴ID
 * @param {String} sMenuNm : 화면명
 * @param {String} sMenuUrl : 화면 URL
 * @param {String} sGroupId : 그룹ID
//* @param {String} sPrgmId : 프로그램ID
 * @return N/A
 * @example this.gfnSetOpenMenuDs(sWinId, sMenuId, sMenuNm, sMenuUrl, sGroupId, sPrgmId);
 */
pForm.gfnSetOpenMenuDs = function(sWinId, sMenuid, sMenuNm, sMenuUrl, sGroupId)//, sPrgmId)
{
	var nRow = app.gdsOpenMenu.addRow();
	app.gdsOpenMenu.setColumn(nRow, this.FRAME_MENUCOLUMNS.winId, sWinId);
	app.gdsOpenMenu.setColumn(nRow, this.FRAME_MENUCOLUMNS.menuId, sMenuid);
	app.gdsOpenMenu.setColumn(nRow, this.FRAME_MENUCOLUMNS.menuNm, sMenuNm);
	app.gdsOpenMenu.setColumn(nRow, this.FRAME_MENUCOLUMNS.menuUrl, sMenuUrl);
	app.gdsOpenMenu.setColumn(nRow, this.FRAME_MENUCOLUMNS.groupId, sGroupId);
};

/**
 * @class 열린메뉴 데이터셋에 삭제 <br>
 * @param {String} sWinId : ChildFrame의 윈도우ID
 * @return N/A
 * @example this.gfnRemoveOpenMenuDs(sWinId);
 */
pForm.gfnRemoveOpenMenuDs = function(sWinId)
{
	var nRow = app.gdsOpenMenu.findRow(this.FRAME_MENUCOLUMNS.winId, sWinId);
	app.gdsOpenMenu.deleteRow(nRow);
};

/**
 * @class 화면에 설정된 파라미터객체 반환
 * @param {String} sName : 파라미터 id
 * @return {String} 파라미터값
 * @example this.gfnGetArgument("param");
 */
pForm.gfnGetArgument = function(sName)
{
	if (this.gfnIsNull(sName))
	{
		return this.gfnGetMdiRootDiv().arguments["menuParam"];
	}
	else
	{
		return this.gfnGetMdiRootDiv().arguments[sName];
	}
};

/**
 * @class mdi를 구성하는 최상위 div를 찾아서 반환
 * @param {Object} objForm : 대상 Form
 * @return {Object} Div
 * @example this.gfnGetMdiRootDiv();
 */
pForm.gfnGetMdiRootDiv = function(objForm)
{
	if (objForm == null) objForm = this;

	var objParent = objForm.parent;
	
	
	while (true)
	{
		
		if (objParent instanceof ChildFrame){
			
			return;
		}
		else if (objParent instanceof Div)
		{
			
			
			if (objParent._mdi_root) return objParent;
		}
		objParent = objParent.parent;
		
		
	}
	
	
}

/**
 * @class Url을 변경하고 전달할 Argument를 설정 <br>
 * @param {String} sUrl - 화면
 * @param {Object} objArg - 전달할 Argument
 * @param {Object} objTarget - 전환하려는 Object
 * @return N/A
 * @example this.gfnSetUrl("sample::sampleMessage.xfdl", {aaa:"abc", num:123});
 */
 /*
pForm.gfnSetUrl = function (sUrl, objArg, objTarget)
{
	// 팝업 일때
	if (this.opener) {
		objTarget = this.getOwnerFrame();
		objTarget.arguments["menuParam"] = objArg;
		objTarget.set_autosize(true);
		objTarget.set_formurl("");
		objTarget.set_formurl(sUrl);
	}
	// 화면 일때
	else {
		if (!objTarget) objTarget = this.gfnGetMdiRootDiv();
		objTarget.arguments["menuParam"] = objArg;
		objTarget.form.divWork.set_url("");
		objTarget.form.divWork.set_url(sUrl);
		objTarget.form.divWork.form.scrollTo(0, 0); // 화면이동 시 스크롤 상단으로 고정
		this.gfnResizeFrameHeight(objTarget.form.divWork.form, true);
	}
};
 */
pForm.gfnSetUrl = function (sUrl, objArg, objTarget)
{
	
	// 팝업 일때
	if (this.opener) {
		objTarget = this.getOwnerFrame();
		objTarget.arguments["menuParam"] = objArg;
		objTarget.set_autosize(true);
		objTarget.set_formurl("");
		objTarget.set_formurl(sUrl);
	}
	// 화면 일때
	else {
		
		if (!objTarget){
		
			objTarget = this.gfnGetMdiRootDiv();
			
			
			if (!objTarget){
				objTarget = this.getOwnerFrame();
				console.log("111################");
				console.log(objTarget);
				console.log("111################");
				objTarget.objArg =  objArg;
				//objTarget.arguments["menuParam"] = {};
				
				//objTarget.arguments["menuParam"] = objArg;				
				objTarget.set_autosize(true);
				objTarget.set_formurl("");
				objTarget.set_formurl(sUrl);
				
				
			}else{
				
				console.log("222################");
				console.log(objTarget);
				console.log("222################");
				objTarget.arguments["menuParam"] = objArg;
				objTarget.form.divWork.set_url("");
				objTarget.form.divWork.set_url(sUrl);
				objTarget.form.divWork.form.scrollTo(0, 0); // 화면이동 시 스크롤 상단으로 고정
				this.gfnResizeFrameHeight(objTarget.form.divWork.form, true);
			}
			
		}
		
		
	}
	
	
};


// /************************************************************************************************
// * Form 제어 관련
// ************************************************************************************************/
/**
 * @class form open 시 초기 처리 <br>
 * @param {Object} objForm - Form 객체
 * @return N/A
 * @example this.gfnFormOnLoad(objForm);
 */
pForm.gfnFormOnLoad = function (objForm)
{

	// 부모가 divWork일때(업무화면일때) keyDown 이벤트 추가 및 화면 loading 시간 측정
	if (objForm.parent.name == "divWork")
	{
		// 키다운 이벤트 추가
		objForm.addEventHandler("onkeydown", this.gfnOnkeydown, this);

		// 폼 높이 조정 : MDI영역의 수직 스크롤바가 생성되지 않도록 높이 늘리기
		objForm.gfnResizeFrameHeight(objForm);
	}

	// 팝업 일때 처리
	if (objForm.opener)
	{
		if (objForm.parent instanceof nexacro.ChildFrame)
		{
			// 키다운 이벤트 추가
			objForm.addEventHandler("onkeydown", this.gfnOnkeydown, this);
		}
	}

	// QuikView 일때 처리
	if (nexacro.getEnvironmentVariable("evQuickView") == "Y")
	{
		if (this.gfnIsNull(objForm.opener) && objForm.parent instanceof nexacro.ChildFrame)
		{
			// 키다운 이벤트 추가
			objForm.addEventHandler("onkeydown", this.gfnOnkeydown, this);
		}
	}

	//그리드 우클릭 메뉴가 있을때 form 에 스크롤이벤트 발생시
	objForm.addEventHandler("onmousewheel", this.gfnOnmousewheel, this);

	// Component 초기화 처리
	this.gfnInitComp(objForm);

// 	// 조회영역 focus 처리, 엔터시 자동조회, 조회버튼 권한 제어
// 	var oDiv = objForm.components["divSearch"];
// 	if (!this.gfnIsNull(oDiv))
// 	{
// 		// 조회영역에 focus 처리
// 		oDiv.setFocus();
//
// 		// 엔터시 자동조회
// 		this.gfnSearchCondInint(oDiv);
//
// 		// 조회권한 없을때 조회버튼 비활성화
// 		var oSearch = oDiv.form.components["btnSearch"];
// 		if (!this.gfnIsNull(oSearch))
// 		{
// 			if (!this.gfnGetAuth("Search"))
// 			{
// 				oSearch.set_enable(false);
// 			}
// 		}
// 	}
};

/**
 * @class MDI/Main Form의 높이를 기준으로 Body Frame 높이 조정
 * @param {Object} objForm - 업무화면 Form
 * @return N/A
 * @example this.gfnResizeFrameHeight(this);
 */

/*
pForm.gfnResizeFrameHeight = function(objForm, bInit)
{//trace('gfnResizeFrameHeight', objForm.name);
	let divMdi = this.gfnGetMdiRootDiv(objForm);
	if (!divMdi) return;
	
	objForm = divMdi.form.divWork.form;

	app.gvFrmBody.form.set_enableevent(false);
	objForm.set_enableevent(false);

	if (bInit)
	{
		app.gvFrmBottom.set_top(window.innerHeight - app.gvFrmTop.getOffsetHeight() - app.gvFrmBottom.getOffsetHeight());
		objForm.resetScroll();
		app.gvFrmBody.form.resetScroll();
	}

	if (objForm.parent.visible && objForm.vscrollbar.max > 0)
	{
		app.gvFrmBottom.set_top(objForm.parent.parent.getOffsetHeight() + objForm.vscrollbar.max);
		objForm.resetScroll();
		app.gvFrmBody.form.resetScroll();
	}	

	if (divMdi._vscrollbar_pos) app.gvFrmBody.form.vscrollbar.set_pos(divMdi._vscrollbar_pos);

	objForm.set_enableevent(true);
	app.gvFrmBody.form.set_enableevent(true);
}
*/

pForm.gfnResizeFrameHeight = function(objForm, bInit)
{//trace('gfnResizeFrameHeight', objForm.name);
	trace(this.gfnGetDate("milli",":")+"==========9");
	let divMdi = this.gfnGetMdiRootDiv(objForm);
	
	if(!divMdi) {
		// Mdi가 없을 경우 (quickview 호출한 경우)
		objForm = this.getOwnerFrame().form;
		objForm.set_enableevent(false);
		
		if (bInit) objForm.resetScroll();
		
		if (objForm.parent.visible && objForm.vscrollbar.max > 0) objForm.resetScroll();
		
		objForm.set_enableevent(true);
	} else {
	trace(this.gfnGetDate("milli",":")+"==========90");
	
		objForm = divMdi.form.divWork.form;
		
		app.gvFrmBody.form.set_enableevent(false);
		objForm.set_enableevent(false);
	trace(this.gfnGetDate("milli",":")+"==========91");

		if (bInit)
		{
	trace(this.gfnGetDate("milli",":")+"==========92");
			app.gvFrmBottom.set_top(window.innerHeight - app.gvFrmTop.getOffsetHeight() - app.gvFrmBottom.getOffsetHeight());
	trace(this.gfnGetDate("milli",":")+"==========93");
			objForm.resetScroll();
	trace(this.gfnGetDate("milli",":")+"==========94");
			app.gvFrmBody.form.resetScroll();
	trace(this.gfnGetDate("milli",":")+"==========95");
		}

		if (objForm.parent.visible && objForm.vscrollbar.max > 0)
		{
	trace(this.gfnGetDate("milli",":")+"==========96");
			app.gvFrmBottom.set_top(objForm.parent.parent.getOffsetHeight() + objForm.vscrollbar.max);
	trace(this.gfnGetDate("milli",":")+"==========97");
			objForm.resetScroll();
	trace(this.gfnGetDate("milli",":")+"==========98");
			app.gvFrmBody.form.resetScroll();
	trace(this.gfnGetDate("milli",":")+"==========99");
		}	

		// 화면 전환 시 기존에 있던 스크롤 위치로 이동하여 해당 주석 처리하여 화면 전환 시 상단표시되도록 함.
		//if (divMdi._vscrollbar_pos) app.gvFrmBody.form.vscrollbar.set_pos(divMdi._vscrollbar_pos);
	trace(this.gfnGetDate("milli",":")+"==========910");
		objForm.set_enableevent(true);
		app.gvFrmBody.form.set_enableevent(true);
	trace(this.gfnGetDate("milli",":")+"==========911");		
	}
}

/**
 * @class 업무화면에서 Container Component의 높이를 내부 컴포넌트에 따라 동적 처리
 * @param {Object} container - Container Component
 * @return N/A
 * @example this.gfnResizeContainerHeight(this.div00);
 */
pForm.gfnResizeContainerHeight = function(container)
{
	let getBottomComponent = function(form)
	{
		let oBottomComp;
		for (let comp,i=0; i<form.components.length; i++)
		{
			comp = form.components[i];
			if (!oBottomComp || oBottomComp.getOffsetBottom() < comp.getOffsetBottom()) oBottomComp = comp;
		}
		return oBottomComp;
	}
	
	let getStretchHeight = function(form)
	{
		let oBottomComp = getBottomComponent(form);
		if (!oBottomComp) return;
		return oBottomComp.getOffsetBottom() - form.getOffsetHeight();
	}

	let oTarget;
	if (container instanceof nexacro.Div) oTarget = container.form;
	else if (container instanceof nexacro.Tab) oTarget = container.tabpages[container.tabindex].form;
	
	if (!oTarget) return;
	
	let nStretchHeight;
	let oBottomComp = getBottomComponent(oTarget);
	if (oBottomComp)
	{
		// todo 여백 필요?
		let nPadding = 10;
		nStretchHeight = getStretchHeight(oTarget) + nPadding;
	}
	else
	{
		nStretchHeight = -oTarget.getOffsetHeight();
	}
	
	if (nStretchHeight === 0) return;
	
	while (true)
	{
		if (this == oTarget || oTarget._mdi_root || oTarget instanceof nexacro.ChildFrame) break;
		
		if (oTarget.set_height) oTarget.set_height(oTarget.getOffsetHeight() + nStretchHeight);
		
		oTarget = oTarget.parent;
		
		if (oTarget instanceof nexacro.Form) oTarget.resetScroll();
	}
	
	app.gvFrsWork.form[app.gvFrmMdi.form.fnGetActiveId()]._vscrollbar_pos;
	
	this.gfnResizeFrameHeight(null, true);
}

/**
 * @class form open 시 Component 초기화 처리 <br>
 * @param {Object} objForm - 화면
 * @return N/A
 * @example this.gfnInitComp(this);
 */
pForm.gfnInitComp = function(objForm)
{
	var arrComp = objForm.components;
	var nLength = arrComp.length;

	for (var i=0; i<nLength; i++)
	{
		if (arrComp[i] instanceof nexacro.Div)
		{
			//URL로 링크된 경우에는 존재하는 경우에는 해당 링크된 Form Onload에서 처리하도록 한다.
			if (this.gfnIsNull(arrComp[i].url)) this.gfnInitComp(arrComp[i].form);
		}
		else if (arrComp[i] instanceof nexacro.Tab)	{
			var nPages = arrComp[i].tabpages.length;

			for (var j=0; j<nPages;j++)
			{
				//URL로 링크된 경우에는 존재하는 경우에는 해당 링크된 Form Onload에서 처리하도록 한다.
				if (this.gfnIsNull(arrComp[i].tabpages[j].url)) this.gfnInitComp(arrComp[i].tabpages[j].form);
			}
		}
		else {
			//Grid 처리
			if (arrComp[i] instanceof nexacro.Grid)
			{
				this.gfnSetGrid(arrComp[i]);
			}
		}
	}
};

/**
 * @class  각 화면에 키다운 이벤트에 사용하는 함수
 * @param {Object} obj - Event가 발생한 Object.
 * @param {Evnet}  e	  - Event Object.
 * @return N/A
 * @example objForm.addEventHandler("onkeydown", this.gfnOnkeydown, this);
 */
pForm.gfnOnkeydown = function(obj, e)
{
	// 디버그 창 : Ctrl + Alt + D
	if (e.ctrlkey && e.altkey && e.keycode == 68)
	{
		// 운영환경에서는 실행 방지
		if (this.gfnGetRunMode() == "R") return;

		var objArg = {};
		var objOption = {width:"1000", height:"700", popuptype:"modeless", titlebar:true, title:"디버그", resize:true};

		this.gfnOpenPopup("popupDebug", "common::cmmDebug.xfdl", objArg, "", objOption);

		return true;
	}
};

/**
 * @class 스크롤이벤트 발생시 그리드 우클릭메뉴가 open되어 있으면 close 하는 처리
 * @param {Object} obj - Event가 발생한 Object.
 * @param {Evnet}  e	  - Event Object.
 * @return N/A
 * @example objForm.addEventHandler("onmousewheel", this.gfnOnmousewheel, this);
 */
pForm.gfnOnmousewheel = function(obj, e)
{
	//open된 우클릭popupMenu close
	if (!this.gfnIsNull(this.OPEN_SEL_POPMENU))
	{
		var pdiv = this.components[this.OPEN_SEL_POPMENU.name];
		if (pdiv.isPopup()){
			pdiv.closePopup();
			return;
		}
	}
};

// /**
// * @class 조회영역에 키업이벤트 추가 <br>
// * @param {Object} oDiv - 조회Div
// * @return N/A
// * @example this.gfnSearchCondInint(oDiv);
// */
// pForm.gfnSearchCondInint = function (oDiv)
// {
// 	var arrComp = oDiv.form.components;
// 	for ( var i=0; i<arrComp.length; i++){
// 		if( arrComp[i] instanceof nexacro.Edit || arrComp[i] instanceof nexacro.Combo
// 			|| arrComp[i] instanceof nexacro.MaskEdit || arrComp[i] instanceof nexacro.Calendar){
// 			if(arrComp[i].uUse != "false"){
// 				arrComp[i].addEventHandler("onkeyup", this.gfnSearchCond_onkeyup, this);
// 			}
// 		}
// 	}
// };

// /**
// * @class 조회영역 키업이벤트에서 사용하는 함수  <br>
// * @param {Object} obj - Event가 발생한 Object.
// * @param {Evnet}  e	  - Event Object.
// * @return N/A
// * @example arrComp[i].addEventHandler("onkeyup", this.gfnSearchCond_onkeyup, this);
// */
// pForm.gfnSearchCond_onkeyup = function (obj, e)
// {
// 	if (e.keycode == 13) {
// 		var sFunc = "cfnSearch";
// 		if (this.gfnGetAuth("Search"))
// 		{
// 			if (this[sFunc]) this.lookupFunc(sFunc).call();
// 		}
// 	}
// };

//----------------------------------------------------------------------------------
// 권한 처리
//----------------------------------------------------------------------------------

// /**
// * @class gdsMenu에서 버튼권한 가져오기
// * @param {String} sMenuId: 메뉴Id
// * @return N/A
// * @example this.gfnGetAuthButton(sMenuId)
// */
// pForm.gfnGetAuthButton = function(sMenuId)
// {
// 	var sSearch 	= app.gdsMenu.lookup(this.FRAME_MENUCOLUMNS.menuId, sMenuId, this.FRAME_MENUCOLUMNS.searchBtnYn)=="1"?"1":"0";
// 	var sAdd 		= app.gdsMenu.lookup(this.FRAME_MENUCOLUMNS.menuId, sMenuId, this.FRAME_MENUCOLUMNS.addBtnYn)=="1"?"1":"0";
// 	var sDelete 	= app.gdsMenu.lookup(this.FRAME_MENUCOLUMNS.menuId, sMenuId, this.FRAME_MENUCOLUMNS.delBtnYn)=="1"?"1":"0";
// 	var sSave 		= app.gdsMenu.lookup(this.FRAME_MENUCOLUMNS.menuId, sMenuId, this.FRAME_MENUCOLUMNS.saveBtnYn)=="1"?"1":"0";
// 	var sPrint 		= app.gdsMenu.lookup(this.FRAME_MENUCOLUMNS.menuId, sMenuId, this.FRAME_MENUCOLUMNS.printBtnYn)=="1"?"1":"0";
// 	var sExcel   	= app.gdsMenu.lookup(this.FRAME_MENUCOLUMNS.menuId, sMenuId, this.FRAME_MENUCOLUMNS.excelBtnYn)=="1"?"1":"0";
// 	var sInit   	= app.gdsMenu.lookup(this.FRAME_MENUCOLUMNS.menuId, sMenuId, this.FRAME_MENUCOLUMNS.excelBtnYn)=="1"?"1":"0";
//
// 	var sValue = sSearch + sAdd + sDelete + sSave + sPrint + sExcel + sInit;
//
// 	return sValue;
// };

// /**
// * @class  현재 화면의 버튼권한 가져오기
// * @param  {String} sAuthGubn: 권한
// * @return {String}
// * @example this.gfnGetAuth("Add")
// */
// pForm.gfnGetAuth = function(sAuthGubn)
// {
// 	var sButtonAuth = "";
// 	if (this.gfnIsNull(this.opener)) {
// 		sButtonAuth = this.getOwnerFrame().form.fvButtonAuth;
// 	}
// 	else {
//         var p = this.parent;
//         while (p)
// 		{
// 			if (!this.gfnIsNull(p.form.fvButtonAuth) || p.form.name == "frmWork" )
// 			{
// 				sButtonAuth = p.form.fvButtonAuth;
// 				break;
// 			}
//             p = p.parent;
//         }
// 	}
// 	if (this.gfnIsNull(sButtonAuth)) sButtonAuth = "0000000";
//
// 	if (this.gfnIsNull(sAuthGubn)) {
// 		return sButtonAuth;
// 	}
//
// 	// 공통버튼별 권한
// 	var sSearch = sButtonAuth[0];	// 조회
// 	var sAdd 	= sButtonAuth[1];	// 추가
// 	var sDel 	= sButtonAuth[2];	// 삭제
// 	var sSave 	= sButtonAuth[3];	// 저장
// 	var sPrint 	= sButtonAuth[4];	// 출력
// 	var sExcel  = sButtonAuth[5];	// 엑셀
// 	var sInit 	= sButtonAuth[6];	// 초기화
//
// 	var bAuth = false;
// 	switch(sAuthGubn)
// 	{
// 		case "Search":
// 			bAuth = (sSearch=="1" ? true : false);
// 			break;
// 		case "Add":
// 			bAuth = (sAdd=="1" ? true : false);
// 			break;
// 		case "Del":
// 			bAuth = (sDel=="1" ? true : false);
// 			break;
// 		case "Save":
// 			bAuth = (sSave=="1" ? true : false);
// 			break;
// 		case "Print":
// 			bAuth = (sPrint=="1" ? true : false);
// 			break;
// 		case "Excel":
// 			bAuth = (sExcel=="1" ? true : false);
// 			break;
// 		case "Init":
// 			bAuth = (sInit=="1" ? true : false);
// 			break;
// 		default:
// 			bAuth = false;
// 			break;
// 	}
//
// 	return bAuth;
// };

// /**
// * @class  공통모듈버튼 셋팅 <br>
// * @param  {Object} objDiv - 공통모듈버튼 셋팅할 DIV
// * @return N/A
// * @example this.gfnSetCommBtn(this.divCommBtn1, this.divCommBtn2);
// */
// pForm.gfnSetCommBtn = function()
// {
// 	// 권한없을때 버튼을 보이게 할지 여부
// 	var bButtonVisable = true;
//
// 	var objDs  = app.gdsCmmnBtn;
//
// 	var sButtonAuth = this.gfnGetAuth();
// 	if (this.gfnIsNull(sButtonAuth)) sButtonAuth = "0000000";
//
// 	// 공통버튼별 권한
// 	var sSearch = sButtonAuth[0];	// 조회
// 	var sAdd 	= sButtonAuth[1];	// 추가
// 	var sDel 	= sButtonAuth[2];	// 삭제
// 	var sSave 	= sButtonAuth[3];	// 저장
// 	var sPrint 	= sButtonAuth[4];	// 출력
// 	var sExcel  = sButtonAuth[5];	// 엑셀
// 	var sInit 	= sButtonAuth[6];	// 초기화
//
// 	// Div 목록
// 	for (var m=0; m<arguments.length; m++)
// 	{
// 		// Div 여부 체크
// 		if (!(arguments[m] instanceof Div))
// 		{
// 			this.gfnLog("gfnSetCommBtn함수에 Parameter로 전달된 Div이 없습니다. [" + (m+1) + "번째]");
// 			return;
// 		}
//
// 		var objForm = arguments[m].form;
// 		var arrComp = objForm.components;
// 		var nLength = arrComp.length;
// 		var bPreVisible = true;
//
// 		objDs.clearData();
// 		objDs.set_enableevent(false);
// 		for (var i=0; i<nLength; i++)
// 		{
// 			var sCompName = arrComp[i].name;
//
// 			var nRow = objDs.addRow();
// 			objDs.setColumn(nRow, "component", sCompName);
// 			objDs.setColumn(nRow, "right", arrComp[i].getOffsetRight());	// arrComp[i].getOffsetRight() or right
// 			objDs.setColumn(nRow, "width", arrComp[i].getOffsetWidth());
//
// 			bPreVisible = arrComp[i].visible;
//
// 			// 권한 체크
// 			var bVisible = false;
// 			if (sCompName.indexOf("btn") >- 1)
// 			{
// 				// 3자리만 비교
// 				var sAuthGubn = sCompName.substr(3,3);
// 				switch(sAuthGubn)
// 				{
// 					//Search
// 					case "Sea":
// 						bVisible = (sSearch=="1" ? true : false);
// 						break;
// 					//Add
// 					case "Add":
// 						bVisible = (sAdd=="1" ? true : false);
// 						break;
// 					//Del
// 					case "Del":
// 						bVisible = (sDel=="1" ? true : false);
// 						break;
// 					//Save
// 					case "Sav":
// 						bVisible = (sSave=="1" ? true : false);
// 						break;
// 					//Print
// 					case "Pri":
// 						bVisible = (sPrint=="1" ? true : false);
// 						break;
// 					//Excel
// 					case "Exc":
// 						bVisible = (sExcel=="1" ? true : false);
// 						break;
// 					//Init
// 					case "Ini":
// 						bVisible = (sInit=="1" ? true : false);
// 						break;
// 					default:
// 						bVisible = true;
// 						break;
// 				}
// 				// 원래 안보이는 버튼은 안보이게 처리
// 				if (bPreVisible == false) {
// 					bVisible = bPreVisible;
// 				}
// 			}
// 			else {
// 					bVisible = arrComp[i].visible;
// 			}
//
// 			// 권한없을때 버튼을 보이게 할지 여부
// 			if (!bButtonVisable) {
// 				objDs.setColumn(nRow, "visible", bVisible);
// 				arrComp[i].set_visible(bVisible);
// 			}
// 			else {
// 				arrComp[i].set_enable(bVisible);
// 			}
// 		}
//
// 		// 권한없을때 버튼을 보이게 할지 여부
// 		if (!bButtonVisable) {
// 			objDs.set_enableevent(true);
// 			objDs.set_keystring("S:-right");
// 			objDs.set_filterstr("");
// 			objDs.set_filterstr("visible=='true'");
//
// 			var nRight = 0;
// 			var nGap   = 5;    // 버튼사이 간격
// 			var nCnt   = objDs.rowcount;
//
// 			for (var j=0; j < nCnt; j++)
// 			{
// 				var objComp = objForm.components[objDs.getColumn(j, "component")];
//
// 				objComp.move(null, 0, objComp.getOffsetWidth(), objComp.getOffsetHeight(), nRight);
// 				nRight = nRight + nGap + nexacro.toNumber(objComp.getOffsetWidth());
// 			}
// 		}
// 	}
// };

//----------------------------------------------------------------------------------
// Log 처리
//----------------------------------------------------------------------------------

/**
 * @class 메뉴오픈로그저장(Transaction)
 * @param {String} sType	- 로그저장타입
 * @param {String} sProg	- 프로그램아이디
 * @param {String} sMenu	- 메뉴아이디
 * @return N/A
 * @example this.gfnSaveMenuOpenLog("MENU", this.fvPrgmId, this.fvMenuId);
 */
pForm.gfnSaveMenuOpenLog = function (sType, sMenu)
{
// 	var oDs = app.gdsLog;
// 	oDs.clearData();
// 
// 	var nRow = oDs.addRow();
// 
// 	oDs.setColumn(nRow, "menuId", sMenu);
// 
// 	var strSvcId    = "saveMenuCnncnLog";
// 	var strSvcUrl   = "cmmnn/saveMenuCnncnLog.do";
// 	var inData      = "dsList=gdsLog:U";
// 	var outData     = "";
// 	var strArg      = "";	// System별 접속차단자 체크
// 	var callBackFnc = "gfnStopCallback";
// 
// 	this.gfnTransaction(strSvcId,		// transaction을 구분하기 위한 svc id값
// 						strSvcUrl,		// transaction을 요청할 주소
// 						inData,			// 입력값으로 보낼 dataset id, a=b형태로 실제이름과 입력이름을 매칭
// 						outData,		// 결과값으로 받을 dataset id, a=b형태로 실제이름과 입력이름을 매칭
// 						strArg,			// 입력값으로 보낼 arguments, strFormData="20120607"
// 						callBackFnc, true
// 						, "Y"
// 						);
};

// /**
// * @class 로그인로그 저장시 글로벌데이터셋 세팅
// * @param  none
// * @return N/A
// * @example this.gfnSetLoginLogDataset();
// */
// pForm.gfnSetLoginLogDataset = function ()
// {
// 	var oDs = app.gdsLoginLog;
// 	oDs.clearData();
//
// 	// Window 값이 일관성없이 이상케 들어옴 SystemBase_Runtime.js
// 	var osversion = nexacro._OSVersion + "";
// 	if (nexacro._OS.indexOf("Win") >= 0) {
// 		switch (osversion) {
// 			case "5.0":
// 			case "5.01":
// 			case "Windows 2000":
// 			case "Windows 2000, Service Pack 1 (SP1)":
// 				osversion = "2000"; break;
// 			case "5.1":
// 			case "Windows XP":
// 				osversion = "XP"; break;
// 			case "5.2":
// 			case "Windows Server 2003 / Windows XP 64-bit":
// 				osversion = "2003"; break;
// 			case "6.0":
// 			case "Windows Vista":
// 				osversion = "Vista"; break;
// 			case "6.1":
// 			case "Windows 7":
// 				osversion = "7"; break;
// 			case "6.2":
// 			case "Windows 8":
// 				osversion = "8"; break;
// 			case "6.3":
// 			case "Windows 8.1":
// 				osversion = "8.1"; break;
// 			case "10.0":
// 			case "Windows 10":
// 				osversion = "10"; break;
// 			default :
// 		}
// 	}
//
// 	var oLogInfo = {
// 		browser			: nexacro._Browser
// 		,browserver		: nexacro._BrowserVersion
// 		,os				: nexacro._OS
// 		,osver			: osversion
// 		,mobile			: this.gfnIsMobile()
// 		,screenwidth	: system.getScreenWidth()
// 		,screenheight	: system.getScreenHeight()
// 	}
//
// 	var nRow = oDs.addRow();
// 	oDs.setColumn(nRow, "BROWSER_CD"		, oLogInfo.browser);
// 	oDs.setColumn(nRow, "BROWSER_VERSION"	, oLogInfo.browserver);
// 	oDs.setColumn(nRow, "OS_CD"				, oLogInfo.os);
// 	oDs.setColumn(nRow, "OS_VERSION"		, oLogInfo.osver);
// 	oDs.setColumn(nRow, "SCREEN_HEIGHT"		, oLogInfo.screenheight);
// 	oDs.setColumn(nRow, "SCREEN_WIDTH"		, oLogInfo.screenwidth);
// 	oDs.setColumn(nRow, "MOB_YN"			, oLogInfo.mobile);
// };


/**
 * @class  하위(상세)화면 열기
 * @param {String} pageInfo : Menu ID or Page URL
 * @param {Object} param : 화면에 넘길 파라미터 Object
 * @return {Boolean} 화면오픈 성공여부
 * @example this.gfnOpenSubPage(sMenuId, objParam);
 */
pForm.gfnOpenSubPage = function(pageInfo, param)
{
	if (!pageInfo) return;
	
	let form = this;
	
	let openSubPage = function(pageUrl)
	{
		let divMainPage = form.parent;
		let divSubPage = new Div('divSub_'+pageUrl.replace(/\.xfdl|[^\w]/g, ''), divMainPage.left, divMainPage.top, null, null, divMainPage.right, divMainPage.bottom);
		
		divSubPage.mainPage = divMainPage;
		
		divSubPage._mdi_root = true;
		divSubPage.arguments = [];
		divSubPage.arguments[form.FRAME_MENUCOLUMNS.menuUrl] = pageUrl;
		divSubPage.arguments["menuParam"] = param;
		
		divMainPage.parent.addChild(divSubPage.name, divSubPage);
		
		divSubPage.show();
		divSubPage.set_url(pageUrl);
		
		divMainPage.set_visible(false);
		divMainPage.subPage = divSubPage;
		
		form.gfnResizeFrameHeight(form, true);
	}
	
	let sMenuUrl = app.gdsMenu.lookup(this.FRAME_MENUCOLUMNS.menuId, pageInfo, this.FRAME_MENUCOLUMNS.menuUrl);
	if (sMenuUrl)
	{
		openSubPage(sMenuUrl);
	}
	else if (pageInfo.includes('::'))
	{
		openSubPage(pageInfo);
	}
	else
	{
		trace('"'+pageInfo+'"는 잘못된 ')
	}
}

/**
 * @class  하위(상세)화면 닫기
 * @return N/A
 * @example this.gfnCloseSubPage();
 */
pForm.gfnCloseSubPage = function()
{
	let divMainPage = this.parent.mainPage;
	divMainPage.set_visible(true);
	
	this.parent.parent.removeChild(this.parent.name).destroy();
	
	divMainPage.form.gfnResizeFrameHeight(divMainPage.form, true);
}


pForm = null;