(function()
{
    return function()
    {
        if (!this._is_form)
            return;
        
        var obj = null;
        
        this.on_create = function()
        {
            this.set_name("frmMain");
            this.set_scrollbartype("auto auto");
            this.set_titletext("Main Area");
            if (Form == this.constructor)
            {
                this._setFormPosition(1248,1000);
            }
            
            // Object(Dataset, ExcelExportObject) Initialize

            
            // UI Components Initialize
            obj = new Div("div_footer","717","22","100%","250",null,null,null,"1200",null,null,this);
            obj.set_fittocontents("height");
            obj.set_formscrollbartype("none none");
            obj.set_formscrolltype("none");
            obj.set_taborder("0");
            obj.set_text("");
            obj.set_url("svc_5::RP_104818/RP_104818_frmFooter.xfdl");
            this.addChild(obj.name, obj);

            obj = new Panel("pan_footer","0","100",null,"250","0",null,null,null,null,null,this);
            obj.set_cssclass("pnl_BF_Bg_pc");
            obj.set_fittocontents("height");
            obj.set_flexcrossaxisalign("center");
            obj.set_taborder("1");
            obj.set_type("vertical");
            obj._setContents("<Contents><PanelItem componentid=\"div_footer\" id=\"PanelItem00\"/></Contents>");
            this.addChild(obj.name, obj);

            obj = new Button("Button00","20","395","120","50",null,null,null,null,null,null,this);
            obj.set_taborder("2");
            obj.set_text("Button00");
            this.addChild(obj.name, obj);

            obj = new Button("btn_getLeft","50%","540","120","50",null,null,null,null,null,null,this);
            obj.set_taborder("3");
            obj.set_text("Get Left");
            this.addChild(obj.name, obj);

            obj = new TextArea("txa_result","50%","600","120","50",null,null,null,null,null,null,this);
            obj.set_taborder("4");
            this.addChild(obj.name, obj);

            // Layout Functions
            //-- Default Layout : this.div_footer
            obj = new Layout("default","",0,0,this.div_footer.form,function(p){});
            this.div_footer.form.addLayout(obj.name, obj);

            //-- Default Layout : this
            obj = new Layout("default","Desktop_screen",1248,1000,this,function(p){});
            this.addLayout(obj.name, obj);
            
            // BindItem Information

            
            // TriggerItem Information

        };
        
        this.loadPreloadList = function()
        {
            this._addPreloadList("fdl","svc_5::RP_104818/RP_104818_frmFooter.xfdl");
        };
        
        // User Script
        this.registerScript("RP_104818_frmMain.xfdl", function() {
        /*
         *	Panel 내부 witdh 100% 배치된 컨텐츠가
         *  브라우저 창 사이즈 조절 시 위치가 틀어져 viewport 영역 밖으로 나가는 현상
         *
         *  - 재현 : Panel 내부에 width 100% Div 배치 후 Panel 포함된 Form을 url로 설정 후 브라우저 창 제어 단축키로 창 크기 조절
         *  - 판정 : 창 크기를 줄였을 때 겉 Panel 과 Div 내부 Paenl 의 getBoundingClientRect().left 를 비교해 일치하면 PASS
         */

        this.btn_getLeft_onclick = function(obj,e)
        {
        	var elCoverPn = this.pan_footer.getElement().handle;
        	var elInnerPn  = this.div_footer.form.pan_footerInfo.getElement().handle;

        	var nCoverLeft = elCoverPn.getBoundingClientRect().left;
        	var nInnerLeft = elInnerPn.getBoundingClientRect().left;

        	trace("nCoverLeft : " + nCoverLeft);
        	trace("nInnerLeft : " + nInnerLeft);

        	this.txa_result.value =	Math.abs(nCoverLeft - nInnerLeft) < 1; // CSS 계산 소수점을 고려해 1px 이내라면 PASS
        };

        // mainframe 사이즈 조절하는 방식으로는 증상 재현 X
        // this.Button00_onclick = function(obj:nexacro.Button,e:nexacro.ClickEventInfo)
        // {
        // 	var app = nexacro.getApplication();
        //
        // 	app.mainframe.width = 500;
        // 	app.mainframe.height = 600;
        // };

        });
        
        // Regist UI Components Event
        this.on_initEvent = function()
        {
            this.Button00.addEventHandler("onclick",this.Button00_onclick,this);
            this.btn_getLeft.addEventHandler("onclick",this.btn_getLeft_onclick,this);
        };

        this.loadIncludeScript("RP_104818_frmMain.xfdl");
        this.loadPreloadList();
        
        // Remove Reference
        obj = null;
    };
}
)();
