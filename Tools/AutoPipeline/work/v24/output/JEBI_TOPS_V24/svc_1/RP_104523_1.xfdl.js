(function()
{
    return function()
    {
        if (!this._is_form)
            return;
        
        var obj = null;
        
        this.on_create = function()
        {
            this.set_background("#F6F8FA");
            this.set_cssclass("frm_WF_GreyBg");
            this.set_name("FO_MK11100");
            if (Form == this.constructor)
            {
                this._setFormPosition(1366,1207);
            }
            
            // Object(Dataset, ExcelExportObject) Initialize
            obj = new Dataset("dsCategory", this);
            obj._setContents({"ColumnInfo" : {"Column" : [{"id" : "ctgryNo","size" : "256","type" : "STRING"},{"id" : "ctgryNm","size" : "256","type" : "STRING"},{"id" : "ctgryDepth","size" : "256","type" : "INT"}]}});
            this.addChild(obj.name, obj);


            obj = new Dataset("dsSort", this);
            obj._setContents({"ColumnInfo" : {"Column" : [{"id" : "code","size" : "256","type" : "STRING"},{"id" : "name","size" : "256","type" : "STRING"}]}});
            this.addChild(obj.name, obj);


            obj = new Dataset("dsSellerInfo", this);
            obj._setContents({"ColumnInfo" : {"Column" : [{"id" : "compApplNo","size" : "256","type" : "STRING"},{"id" : "mbrNo","size" : "256","type" : "STRING"},{"id" : "compNo","size" : "256","type" : "STRING"},{"id" : "compDivCd","size" : "256","type" : "STRING"},{"id" : "bizTp","size" : "256","type" : "STRING"},{"id" : "bizNo","size" : "256","type" : "STRING"},{"id" : "compNm","size" : "256","type" : "STRING"},{"id" : "corpNo","size" : "256","type" : "STRING"},{"id" : "corpNm","size" : "256","type" : "STRING"},{"id" : "ceoNm","size" : "256","type" : "STRING"},{"id" : "postNo","size" : "256","type" : "STRING"},{"id" : "addr1","size" : "256","type" : "STRING"},{"id" : "addr2","size" : "256","type" : "STRING"},{"id" : "bizStrt","size" : "256","type" : "STRING"},{"id" : "bizKnd","size" : "256","type" : "STRING"},{"id" : "tel","size" : "256","type" : "STRING"},{"id" : "homepage","size" : "256","type" : "STRING"},{"id" : "mngrNm","size" : "256","type" : "STRING"},{"id" : "mobile","size" : "256","type" : "STRING"},{"id" : "applMemo","size" : "256","type" : "STRING"},{"id" : "cnclRsnCd","size" : "256","type" : "STRING"},{"id" : "cnclRsn","size" : "256","type" : "STRING"},{"id" : "cnclEffPrefDtm","size" : "256","type" : "STRING"},{"id" : "prdCnt","size" : "256","type" : "STRING"},{"id" : "compApplStatCd","size" : "256","type" : "STRING"},{"id" : "bizRegCertDraftId","size" : "256","type" : "STRING"},{"id" : "biCiDraftId","size" : "256","type" : "STRING"},{"id" : "etcDraftId","size" : "256","type" : "STRING"},{"id" : "agreePrivacy","size" : "256","type" : "STRING"},{"id" : "agreeTerms","size" : "256","type" : "STRING"},{"id" : "applDtm","size" : "256","type" : "String"},{"id" : "procDtm","size" : "256","type" : "String"},{"id" : "files","size" : "256","type" : "String"}]}});
            this.addChild(obj.name, obj);
            
            // UI Components Initialize
            obj = new Static("Static00","45","80",null,"44","45",null,null,null,null,null,this);
            obj.set_cssclass("sta_WF_Txt30B, sta_WF_TxtC");
            obj.set_fittocontents("height");
            obj.set_text("“” 에 대한 검색 결과 입니다.");
            this.addChild(obj.name, obj);

            obj = new Button("btnMyMarketPlace",null,"40","147","32","40",null,null,null,null,null,this);
            obj.set_background("yellow");
            obj.set_cssclass("btn_WF_BR30Full");
            obj.set_text("생성");
            this.addChild(obj.name, obj);

            obj = new Static("Static03","45","Static00:2",null,"30","45",null,null,null,null,null,this);
            obj.set_cssclass("sta_WF_Txt20, sta_WF_TxtC");
            obj.set_text("에셋명 또는 키워드를 다시 확인해주세요");
            this.addChild(obj.name, obj);

            obj = new Static("Static04","320","207","726","20",null,null,null,null,null,null,this);
            obj.set_cssclass("sta_POP_TxtWarning");
            obj.set_text("에셋명, 업체명, 키워드, 카테고리 등으로 검색해보세요.");
            this.addChild(obj.name, obj);

            obj = new Div("Div00","45","295","1276","92",null,null,null,null,null,null,this);
            obj.set_cssclass("div_WF_Gradient");
            obj.set_text("Div00");
            this.addChild(obj.name, obj);

            obj = new Static("Static00","25","9","82","83",null,null,null,null,null,null,this.Div00.form);
            obj.set_cssclass("sta_WF_imgMKBanner");
            this.Div00.addChild(obj.name, obj);

            obj = new Static("Static01","117","15","343","40",null,null,null,null,null,null,this.Div00.form);
            obj.set_cssclass("sta_WF_Txt24B, sta_WF_TxtWhite");
            obj.set_fittocontents("width");
            obj.set_text("TOBE Premium");
            this.Div00.addChild(obj.name, obj);

            obj = new Static("Static02","117","55","351","20",null,null,null,null,null,null,this.Div00.form);
            obj.set_cssclass("sta_WF_TxtWhite");
            obj.set_fittocontents("width");
            obj.set_text("Tobesoft Asset으로 새로운 경쟁력을 찾으세요.");
            this.Div00.addChild(obj.name, obj);

            obj = new Button("Button00",null,"26","40","40","30",null,null,null,null,null,this.Div00.form);
            obj.set_cssclass("btn_WF_MKBannerNext");
            this.Div00.addChild(obj.name, obj);

            obj = new Combo("Combo00_00",null,"407","160","32","45",null,null,null,null,null,this);
            obj.set_text("카테고리");
            obj.set_value("");
            obj.set_index("-1");
            this.addChild(obj.name, obj);

            obj = new Static("Static02","45","407","325","32",null,null,null,null,null,null,this);
            obj.set_flexgrow("1");
            obj.set_text("N Pangea 추천 리스트");
            this.addChild(obj.name, obj);

            obj = new Div("divCardUnit","45","453","1276","630",null,null,null,null,null,null,this);
            obj.set_formscrollbartype("none none");
            obj.set_formscrolltype("none");
            this.addChild(obj.name, obj);

            obj = new Panel("Panel04","45","Static03:14",null,"43","45",null,null,null,null,null,this);
            obj.set_flexmainaxisalign("center");
            obj.set_horizontalgap("10");
            obj._setContents("<Contents><PanelItem componentid=\"Div02\" id=\"PanelItem03\"/><PanelItem componentid=\"Button02_00\" id=\"PanelItem01\"/></Contents>");
            this.addChild(obj.name, obj);

            obj = new Panel("PanelSearchArea","45","Panel04:14",null,"1","45",null,null,null,null,null,this);
            obj.set_fittocontents("height");
            obj.set_flexcrossaxisalign("center");
            obj.set_type("vertical");
            obj.set_verticalgap("73");
            obj.set_visible("false");
            obj._setContents("<Contents><PanelItem componentid=\"PanelSearchFilter\" id=\"PanelItemSA00\"/><PanelItem componentid=\"DivResultCardUnit\" id=\"PanelItemSA01\"/></Contents>");
            this.addChild(obj.name, obj);

            obj = new Panel("Panel00","45","Panel04:0",null,"68","45",null,null,null,null,null,this);
            obj.set_fittocontents("height");
            obj.set_flexcrossaxisalign("center");
            obj.set_type("vertical");
            obj.set_verticalgap("10");
            obj._setContents("<Contents><PanelItem componentid=\"Static04\" id=\"PanelItem00\"/><PanelItem componentid=\"Panel01\" id=\"PanelItem01\"/></Contents>");
            this.addChild(obj.name, obj);

            obj = new Panel("Panel03","45","Panel00:20",null,"788","45",null,null,null,null,null,this);
            obj.set_fittocontents("height");
            obj.set_flexcrossaxisalign("center");
            obj.set_type("vertical");
            obj._setContents("<Contents><PanelItem componentid=\"Div00\" id=\"PanelItem00\"/><PanelItem componentid=\"Static06_00_00\" id=\"PanelItem01\"/><PanelItem componentid=\"Panel02\" id=\"PanelItem02\"/><PanelItem componentid=\"Static06_00_00_00\" id=\"PanelItem03\"/><PanelItem componentid=\"divCardUnit\" id=\"PanelItem04\"/></Contents>");
            this.addChild(obj.name, obj);

            obj = new Static("Static06","0","Panel03:0",null,"60","0",null,null,null,null,null,this);
            this.addChild(obj.name, obj);

            obj = new Div("Div00_00","45","Panel03:0",null,"122","45",null,null,null,null,null,this);
            obj.set_text("Div00");
            obj.set_visible("false");
            this.addChild(obj.name, obj);

            obj = new Div("Div02","278","850","630","43",null,null,null,null,null,null,this);
            obj.set_text("Div02");
            this.addChild(obj.name, obj);

            obj = new Edit("Edit00","0","0",null,"43","0",null,null,null,null,null,this.Div02.form);
            obj.set_cssclass("edt_WF_Search");
            obj.set_displaynulltext("에셋명 또는 키워드를 입력해주세요.");
            this.Div02.addChild(obj.name, obj);

            obj = new Button("Button01_01_01","342","47","23","23",null,null,null,null,null,null,this.Div02.form);
            obj.set_cssclass("btn_WF_Clear");
            obj.set_visible("false");
            this.Div02.addChild(obj.name, obj);

            obj = new Panel("Panel00",null,"0","43","43","0",null,null,null,null,null,this.Div02.form);
            obj.set_flexcrossaxisalign("center");
            obj.set_flexmainaxisalign("end");
            obj.set_horizontalgap("8");
            obj.set_spacing("0px 10px 0px 0px");
            obj._setContents("<Contents><PanelItem componentid=\"Button01_01_01\" id=\"PanelItem00\"/></Contents>");
            this.Div02.addChild(obj.name, obj);

            obj = new Static("Static01","0","0","43","43",null,null,null,null,null,null,this.Div02.form);
            obj.set_cssclass("sta_WF_Search");
            this.Div02.addChild(obj.name, obj);

            obj = new Button("Button02_00","640","132","86","43",null,null,null,null,null,null,this);
            obj.set_cssclass("btn_WF_MKSearch");
            obj.set_text("검색");
            this.addChild(obj.name, obj);

            obj = new Panel("Panel02","45","407","1276","32",null,null,null,null,null,null,this);
            obj.set_horizontalgap("5");
            obj._setContents("<Contents><PanelItem componentid=\"Static02\" id=\"PanelItem00\"/><PanelItem componentid=\"Combo00_00\" id=\"PanelItem01\"/></Contents>");
            this.addChild(obj.name, obj);

            obj = new Static("Static06_00_00","45","382","1276","20",null,null,null,null,null,null,this);
            obj.set_text("");
            this.addChild(obj.name, obj);

            obj = new Static("Static06_00_00_00","45","432","1276","14",null,null,null,null,null,null,this);
            obj.set_text("");
            this.addChild(obj.name, obj);

            obj = new Static("StaticSearchCount","45","195","325","32",null,null,null,null,null,null,this);
            obj.set_flexgrow("1");
            obj.set_text("총 0개");
            this.addChild(obj.name, obj);

            obj = new CheckBox("CheckBoxInHouseOnly",null,"195","178","32","375",null,null,null,null,null,this);
            obj.set_fittocontents("width");
            obj.set_text("TOBESOFT 에셋만 보기");
            this.addChild(obj.name, obj);

            obj = new Combo("ComboSearchSort",null,"195","160","32","210",null,null,null,null,null,this);
            obj.set_text("다운로드순");
            obj.set_value("");
            obj.set_index("-1");
            this.addChild(obj.name, obj);

            obj = new Combo("ComboSearchCategory",null,"195","160","32","45",null,null,null,null,null,this);
            obj.set_text("카테고리");
            obj.set_value("");
            obj.set_index("-1");
            this.addChild(obj.name, obj);

            obj = new Panel("PanelSearchFilter","0","0","1276","32",null,null,null,null,null,null,this);
            obj.set_horizontalgap("5");
            obj.set_visible("false");
            obj._setContents("<Contents><PanelItem componentid=\"StaticSearchCount\" id=\"PanelItemSF00\"/><PanelItem componentid=\"CheckBoxInHouseOnly\" id=\"PanelItemSF01\"/><PanelItem componentid=\"ComboSearchSort\" id=\"PanelItemSF02\"/><PanelItem componentid=\"ComboSearchCategory\" id=\"PanelItemSF03\"/></Contents>");
            this.addChild(obj.name, obj);

            obj = new Div("DivResultCardUnit","0","0","1276","622",null,null,null,null,null,null,this);
            obj.set_fittocontents("height");
            obj.set_visible("false");
            this.addChild(obj.name, obj);

            obj = new Static("StaticListCount","45","140","325","32",null,null,null,null,null,null,this);
            obj.set_flexgrow("1");
            obj.set_text("총 0개");
            this.addChild(obj.name, obj);

            obj = new Combo("ComboListSort",null,"140","160","32","215",null,null,null,null,null,this);
            obj.set_text("다운로드순");
            obj.set_value("");
            obj.set_index("-1");
            this.addChild(obj.name, obj);

            obj = new Combo("ComboListCategory",null,"140","160","32","45",null,null,null,null,null,this);
            obj.set_text("카테고리");
            obj.set_value("");
            obj.set_index("-1");
            this.addChild(obj.name, obj);

            obj = new Panel("PanelListFilter","0","0","1276","32",null,null,null,null,null,null,this);
            obj.set_horizontalgap("5");
            obj.set_visible("false");
            obj._setContents("<Contents><PanelItem componentid=\"StaticListCount\" id=\"PanelItemLF00\"/><PanelItem componentid=\"ComboListSort\" id=\"PanelItemLF01\"/><PanelItem componentid=\"ComboListCategory\" id=\"PanelItemLF02\"/></Contents>");
            this.addChild(obj.name, obj);

            obj = new Panel("PanelListArea","45","140",null,"1","45",null,null,null,null,null,this);
            obj.set_fittocontents("height");
            obj.set_flexcrossaxisalign("center");
            obj.set_type("vertical");
            obj.set_verticalgap("30");
            obj.set_visible("false");
            obj._setContents("<Contents><PanelItem componentid=\"PanelListFilter\" id=\"PanelItemLA00\"/><PanelItem componentid=\"DivListCardUnit\" id=\"PanelItemLA01\"/></Contents>");
            this.addChild(obj.name, obj);

            obj = new Div("DivListCardUnit","0","0","1276","622",null,null,null,null,null,null,this);
            obj.set_fittocontents("height");
            obj.set_formscrollbartype("none none");
            obj.set_formscrolltype("none");
            obj.set_visible("false");
            this.addChild(obj.name, obj);

            obj = new Button("Button00","302","35","120","50",null,null,null,null,null,null,this);
            obj.set_taborder("31");
            obj.set_text("Button00");
            this.addChild(obj.name, obj);

            obj = new Edit("Edit00","488","27","372","55",null,null,null,null,null,null,this);
            obj.set_taborder("32");
            this.addChild(obj.name, obj);

            // Layout Functions
            //-- Default Layout : this.Div00.form
            obj = new Layout("default","",0,0,this.Div00.form,function(p){});
            this.Div00.form.addLayout(obj.name, obj);

            //-- Default Layout : this.divCardUnit.form
            obj = new Layout("default","",0,0,this.divCardUnit.form,function(p){});
            obj.set_flexwrap("wrap");
            obj.set_horizontalgap("10");
            obj.set_type("horizontal");
            obj.set_verticalgap("10");
            this.divCardUnit.form.addLayout(obj.name, obj);

            //-- Default Layout : this.Div00_00.form
            obj = new Layout("default","",0,0,this.Div00_00.form,function(p){});
            this.Div00_00.form.addLayout(obj.name, obj);

            //-- Default Layout : this.Div02.form
            obj = new Layout("default","",0,0,this.Div02.form,function(p){});
            this.Div02.form.addLayout(obj.name, obj);

            //-- Default Layout : this.DivResultCardUnit.form
            obj = new Layout("default","",0,0,this.DivResultCardUnit.form,function(p){});
            obj.set_flexwrap("wrap");
            obj.set_horizontalgap("10");
            obj.set_type("horizontal");
            obj.set_verticalgap("10");
            this.DivResultCardUnit.form.addLayout(obj.name, obj);

            //-- Default Layout : this.DivListCardUnit.form
            obj = new Layout("default","",0,0,this.DivListCardUnit.form,function(p){});
            obj.set_flexwrap("wrap");
            obj.set_horizontalgap("10");
            obj.set_type("horizontal");
            obj.set_verticalgap("10");
            this.DivListCardUnit.form.addLayout(obj.name, obj);

            //-- Default Layout : this
            obj = new Layout("default","",1366,1207,this,function(p){});
            this.addLayout(obj.name, obj);
            
            // BindItem Information

            
            // TriggerItem Information

        };
        
        this.loadPreloadList = function()
        {

        };
        
        // User Script
        this.registerScript("RP_104523_1.xfdl", function() {

        this.form_onload = function(obj,e)
        {
        	//this.btnMyMarketPlace.click();
        };

        this.btnMyMarketPlace_onclick = function(obj,e)
        {

        };


        this.clear = function()
        {
        	for(let i = 10 - 1; i >= 0; i--) {
        		const id = "div"+i;
        		if(!this.divCardUnit.form.components[id]) continue;
        		let removeObj = this.divCardUnit.removeChild(id);
        		removeObj.destroy();
        		removeObj = null;
        	}
        };

        this.Button11_00_01_00_onclick = function(obj,e)
        {
        	try {
        		this.clear();

        		for (let i = 0; i < 10; i++) {
        			const id = "div" + i;
        			const newDiv = new Div(id, 0, 0, 100, 100);
        			newDiv.background = 'red';

        			this.divCardUnit.addChild(id, newDiv);
        			newDiv.show();
        		}

        		this.divCardUnit.form.resetScroll();
        		this.resetScroll();

        		this.Edit00.set_value("OK");   // 에러 없이 끝까지 실행됨
        	}
        	catch (err) {
        		this.Edit00.set_value("NG");   // 엔진 에러 발생
        		trace("[ENGINE ERROR] " + err.name + " : " + err.message);
        	}
        };

        this.Button00_onclick = function(obj,e)
        {

        };

        });
        
        // Regist UI Components Event
        this.on_initEvent = function()
        {
            this.addEventHandler("onload",this.form_onload,this);
            this.addEventHandler("onvscroll",this.form_onvscroll,this);
            this.btnMyMarketPlace.addEventHandler("onclick",this.Button11_00_01_00_onclick,this);
            this.Div00.addEventHandler("onclick",this.Div00_onclick,this);
            this.Combo00_00.addEventHandler("onitemchanged",this.Combo00_00_onitemchanged,this);
            this.Div02.form.Edit00.addEventHandler("onkeydown",this.Edit00_onkeydown,this);
            this.Div02.form.Edit00.addEventHandler("onkeyup",this.Edit00_onkeyup,this);
            this.Div02.form.Button01_01_01.addEventHandler("onclick",this.Button01_01_01_onclick,this);
            this.Button02_00.addEventHandler("onclick",this.Button02_00_onclick,this);
            this.CheckBoxInHouseOnly.addEventHandler("onclick",this.CheckBoxInHouseOnly_onclick,this);
            this.ComboSearchSort.addEventHandler("onitemchanged",this.ComboSearchSort_onitemchanged,this);
            this.ComboSearchCategory.addEventHandler("onitemchanged",this.ComboSearchCategory_onitemchanged,this);
            this.ComboListSort.addEventHandler("onitemchanged",this.ComboListSort_onitemchanged,this);
            this.ComboListCategory.addEventHandler("onitemchanged",this.ComboListCategory_onitemchanged,this);
            this.Button00.addEventHandler("onclick",this.Button00_onclick,this);
            this.dsSellerInfo.addEventHandler("oncolumnchanged",this.dsCompany_oncolumnchanged,this);
        };

        this.loadIncludeScript("RP_104523_1.xfdl");
        this.loadPreloadList();
        
        // Remove Reference
        obj = null;
    };
}
)();
