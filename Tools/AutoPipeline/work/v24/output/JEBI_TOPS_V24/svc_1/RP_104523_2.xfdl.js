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
            this.set_name("FO_MK11000");
            this.getSetter("text").set("N Pangea 추천 리스트");
            if (Form == this.constructor)
            {
                this._setFormPosition(1366,780);
            }
            
            // Object(Dataset, ExcelExportObject) Initialize
            obj = new Dataset("dsCategory", this);
            obj._setContents({"ColumnInfo" : {"Column" : [{"id" : "ctgryNo","size" : "256","type" : "STRING"},{"id" : "ctgryNm","size" : "256","type" : "STRING"},{"id" : "ctgryDepth","size" : "256","type" : "INT"}]}});
            this.addChild(obj.name, obj);


            obj = new Dataset("dsSellerInfo", this);
            obj._setContents({"ColumnInfo" : {"Column" : [{"id" : "compApplNo","size" : "256","type" : "STRING"},{"id" : "mbrNo","size" : "256","type" : "STRING"},{"id" : "compNo","size" : "256","type" : "STRING"},{"id" : "compDivCd","size" : "256","type" : "STRING"},{"id" : "bizTp","size" : "256","type" : "STRING"},{"id" : "bizNo","size" : "256","type" : "STRING"},{"id" : "compNm","size" : "256","type" : "STRING"},{"id" : "corpNo","size" : "256","type" : "STRING"},{"id" : "corpNm","size" : "256","type" : "STRING"},{"id" : "ceoNm","size" : "256","type" : "STRING"},{"id" : "postNo","size" : "256","type" : "STRING"},{"id" : "addr1","size" : "256","type" : "STRING"},{"id" : "addr2","size" : "256","type" : "STRING"},{"id" : "bizStrt","size" : "256","type" : "STRING"},{"id" : "bizKnd","size" : "256","type" : "STRING"},{"id" : "tel","size" : "256","type" : "STRING"},{"id" : "homepage","size" : "256","type" : "STRING"},{"id" : "mngrNm","size" : "256","type" : "STRING"},{"id" : "mobile","size" : "256","type" : "STRING"},{"id" : "applMemo","size" : "256","type" : "STRING"},{"id" : "cnclRsnCd","size" : "256","type" : "STRING"},{"id" : "cnclRsn","size" : "256","type" : "STRING"},{"id" : "cnclEffPrefDtm","size" : "256","type" : "STRING"},{"id" : "prdCnt","size" : "256","type" : "STRING"},{"id" : "compApplStatCd","size" : "256","type" : "STRING"},{"id" : "bizRegCertDraftId","size" : "256","type" : "STRING"},{"id" : "biCiDraftId","size" : "256","type" : "STRING"},{"id" : "etcDraftId","size" : "256","type" : "STRING"},{"id" : "agreePrivacy","size" : "256","type" : "STRING"},{"id" : "agreeTerms","size" : "256","type" : "STRING"},{"id" : "applDtm","size" : "256","type" : "String"},{"id" : "procDtm","size" : "256","type" : "String"},{"id" : "files","size" : "256","type" : "String"}]}});
            this.addChild(obj.name, obj);
            
            // UI Components Initialize
            obj = new Static("Static00","45","80",null,"44","45",null,null,null,null,null,this);
            obj.set_cssclass("sta_WF_Txt30B, sta_WF_TxtC");
            obj.set_text("N Pangea Marketplace를 둘러보세요!");
            this.addChild(obj.name, obj);

            obj = new Panel("Panel04","45","138",null,"43","45",null,null,null,null,null,this);
            obj.set_flexmainaxisalign("center");
            obj.set_horizontalgap("10");
            obj._setContents("<Contents><PanelItem componentid=\"Div02\" id=\"PanelItem03\"/><PanelItem componentid=\"Button02_00\" id=\"PanelItem01\"/></Contents>");
            this.addChild(obj.name, obj);

            obj = new Div("Div02","278","850","630","43",null,null,null,null,null,null,this);
            obj.set_text("Div02");
            this.addChild(obj.name, obj);

            obj = new Edit("Edit00","0","0",null,"43","0",null,null,null,null,null,this.Div02.form);
            obj.set_cssclass("edt_WF_Search");
            obj.set_displaynulltext("에셋명 또는 키워드를 입력해주세요.");
            this.Div02.addChild(obj.name, obj);

            obj = new Panel("Panel00",null,"0","43","43","0",null,null,null,null,null,this.Div02.form);
            obj.set_flexcrossaxisalign("center");
            obj.set_flexmainaxisalign("end");
            obj.set_horizontalgap("8");
            obj.set_spacing("0px 10px 0px 0px");
            obj._setContents("<Contents><PanelItem componentid=\"Button01_01_01\" id=\"PanelItem00\"/></Contents>");
            this.Div02.addChild(obj.name, obj);

            obj = new Button("Button01_01_01","342","47","23","23",null,null,null,null,null,null,this.Div02.form);
            obj.set_cssclass("btn_WF_Clear");
            obj.set_visible("false");
            this.Div02.addChild(obj.name, obj);

            obj = new Static("Static01","0","0","43","43",null,null,null,null,null,null,this.Div02.form);
            obj.set_cssclass("sta_WF_Search");
            this.Div02.addChild(obj.name, obj);

            obj = new Button("Button02_00","640","132","86","43",null,null,null,null,null,null,this);
            obj.set_cssclass("btn_WF_MKSearch");
            obj.set_text("검색");
            this.addChild(obj.name, obj);

            obj = new Panel("Panel03","45","201",null,"463","45",null,null,null,null,null,this);
            obj.set_fittocontents("height");
            obj.set_flexcrossaxisalign("center");
            obj.set_type("vertical");
            obj._setContents("<Contents><PanelItem componentid=\"Div00\" id=\"PanelItem00\"/><PanelItem componentid=\"Static06_00_00\" id=\"PanelItem01\"/><PanelItem componentid=\"Panel02\" id=\"PanelItem02\"/><PanelItem componentid=\"Static06_00\" id=\"PanelItem03\"/><PanelItem componentid=\"Panel01\" id=\"PanelItem04\"/></Contents>");
            this.addChild(obj.name, obj);

            obj = new Div("Div00","45","195","1276","92",null,null,null,null,null,null,this);
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
            obj.set_text("새로운 경쟁력을 찾으세요.");
            this.Div00.addChild(obj.name, obj);

            obj = new Button("Button00",null,"26","40","40","30",null,null,null,null,null,this.Div00.form);
            obj.set_cssclass("btn_WF_MKBannerNext");
            this.Div00.addChild(obj.name, obj);

            obj = new Static("Static06_00_00","45","288","1276","20",null,null,null,null,null,null,this);
            obj.set_text("");
            this.addChild(obj.name, obj);

            obj = new Panel("Panel02","45","307","1276","32",null,null,null,null,null,null,this);
            obj.set_flexmainaxisalign("spacebetween");
            obj._setContents("<Contents><PanelItem componentid=\"Static00_00\" id=\"PanelItem00\"/><PanelItem componentid=\"Combo00_00\" id=\"PanelItem01\"/></Contents>");
            this.addChild(obj.name, obj);

            obj = new Static("Static00_00","45","307","325","32",null,null,null,null,null,null,this);
            obj.set_cssclass("sta_WF_Title");
            obj.set_fittocontents("width");
            obj.set_text("N Pangea 추천 리스트");
            this.addChild(obj.name, obj);

            obj = new Combo("Combo00_00",null,"307","160","32","45",null,null,null,null,null,this);
            obj.set_text("카테고리");
            obj.set_value("");
            obj.set_index("-1");
            this.addChild(obj.name, obj);

            obj = new Static("Static06_00","45","338","1276","14",null,null,null,null,null,null,this);
            obj.set_text("");
            this.addChild(obj.name, obj);

            obj = new Div("Panel01","45","353","1276","305",null,null,null,null,null,null,this);
            obj.set_fittocontents("height");
            obj.set_formscrollbartype("none none");
            obj.set_formscrolltype("none");
            obj.set_text("");
            this.addChild(obj.name, obj);

            obj = new Static("Static06","0","Panel03:0",null,"60","0",null,null,null,null,null,this);
            this.addChild(obj.name, obj);

            obj = new Div("Div00_00","45","Panel03:0",null,"122","45",null,null,null,null,null,this);
            obj.set_text("Div00");
            obj.set_visible("false");
            this.addChild(obj.name, obj);

            // Layout Functions
            //-- Default Layout : this.Div02.form
            obj = new Layout("default","",0,0,this.Div02.form,function(p){});
            this.Div02.form.addLayout(obj.name, obj);

            //-- Default Layout : this.Div00.form
            obj = new Layout("default","",0,0,this.Div00.form,function(p){});
            this.Div00.form.addLayout(obj.name, obj);

            //-- Default Layout : this.Panel01.form
            obj = new Layout("default","",0,0,this.Panel01.form,function(p){});
            obj.set_flexwrap("wrap");
            obj.set_horizontalgap("10");
            obj.set_type("horizontal");
            obj.set_verticalgap("10");
            this.Panel01.form.addLayout(obj.name, obj);

            //-- Default Layout : this.Div00_00.form
            obj = new Layout("default","",0,0,this.Div00_00.form,function(p){});
            this.Div00_00.form.addLayout(obj.name, obj);

            //-- Default Layout : this
            obj = new Layout("default","",1366,780,this,function(p){});
            this.addLayout(obj.name, obj);
            
            // BindItem Information

            
            // TriggerItem Information

        };
        
        this.loadPreloadList = function()
        {

        };
        
        // User Script

        
        // Regist UI Components Event
        this.on_initEvent = function()
        {
            this.addEventHandler("onload",this.form_onload,this);
            this.addEventHandler("onvscroll",this.form_onvscroll,this);
            this.Div02.form.Edit00.addEventHandler("onkeydown",this.Edit00_onkeydown,this);
            this.Div02.form.Edit00.addEventHandler("onkeyup",this.Edit00_onkeyup,this);
            this.Div02.form.Button01_01_01.addEventHandler("onclick",this.Button01_01_01_onclick,this);
            this.Button02_00.addEventHandler("onclick",this.Button02_00_onclick,this);
            this.Div00.addEventHandler("onclick",this.Div00_onclick,this);
            this.Combo00_00.addEventHandler("onitemchanged",this.Combo00_00_onitemchanged,this);
            this.dsSellerInfo.addEventHandler("oncolumnchanged",this.dsCompany_oncolumnchanged,this);
        };

        this.loadIncludeScript("RP_104523_2.xfdl");
        this.loadPreloadList();
        
        // Remove Reference
        obj = null;
    };
}
)();
