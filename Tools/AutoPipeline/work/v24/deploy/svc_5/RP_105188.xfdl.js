(function()
{
    return function()
    {
        if (!this._is_form)
            return;
        
        var obj = null;
        
        this.on_create = function()
        {
            this.set_name("RP_105188_Panel");
            this.set_titletext("Panel tablecellarea");
            if (Form == this.constructor)
            {
                this._setFormPosition(1280,720);
            }
            
            // Object(Dataset, ExcelExportObject) Initialize

            
            // UI Components Initialize
            obj = new Button("btn_105188","228","205","100%","100%",null,null,null,null,null,null,this);
            obj.set_background("darkgray");
            obj.set_tablecellarea("B");
            obj.set_taborder("0");
            obj.set_text("");
            this.addChild(obj.name, obj);

            obj = new Panel("pn_105188","50","50","300","300",null,null,null,null,null,null,this);
            obj.set_border("1px solid black");
            obj.set_tablecellincompalign("end end");
            obj.set_tabletemplate("1* 1* / 1* 1*");
            obj.set_tabletemplatearea("\"A B\" \"C B\"");
            obj.set_taborder("1");
            obj.set_type("table");
            obj._setContents("<Contents><PanelItem componentid=\"btn_105188\" id=\"PanelItem00\"/></Contents>");
            this.addChild(obj.name, obj);

            obj = new TextArea("txa_105188","360","50","150","60",null,null,null,null,null,null,this);
            obj.set_taborder("2");
            this.addChild(obj.name, obj);

            // Layout Functions
            //-- Default Layout : this
            obj = new Layout("default","",1280,720,this,function(p){});
            this.addLayout(obj.name, obj);
            
            // BindItem Information

            
            // TriggerItem Information

        };
        
        this.loadPreloadList = function()
        {

        };
        
        // User Script
        this.registerScript("RP_105188.xfdl", function() {
        /*
         *	Panel type=table / tabletemplatearea="A B" "C B" 일 때
         *  tablecellarea=B인 컴포넌트 style에서 grid-area: B; 가 지정되지 않아 A 위치에 그려지는 현상
         *
         *  - 재현 : Panel type=table, tabletemplatearea="A B" "C B" 설정 후 getComputedStyle 확인
         *  - 판정 : Panel 내 Button의 스타일이 grid-area: B 로 설정되었다면 PASS
         */


        this.btn_105188_onclick = function(obj,e)
        {
        	var elBtn = obj.getElement().handle;

        	var strGridArea = window.getComputedStyle(elBtn).gridArea;
        	trace(" strGridArea: " +strGridArea);
        	this.txa_105188.value = (strGridArea == 'B');
        };

        });
        
        // Regist UI Components Event
        this.on_initEvent = function()
        {
            this.btn_105188.addEventHandler("onclick",this.btn_105188_onclick,this);
        };

        this.loadIncludeScript("RP_105188.xfdl");
        this.loadPreloadList();
        
        // Remove Reference
        obj = null;
    };
}
)();
