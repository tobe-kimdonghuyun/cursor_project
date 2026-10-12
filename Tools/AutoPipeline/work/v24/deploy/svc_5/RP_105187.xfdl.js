(function()
{
    return function()
    {
        if (!this._is_form)
            return;
        
        var obj = null;
        
        this.on_create = function()
        {
            this.set_name("RP_105187_Panel");
            this.set_titletext("Panel tablecellincompalign");
            if (Form == this.constructor)
            {
                this._setFormPosition(1280,720);
            }
            
            // Object(Dataset, ExcelExportObject) Initialize

            
            // UI Components Initialize
            obj = new Panel("pn_105187","50","50","300","300",null,null,null,null,null,null,this);
            obj.set_border("1px solid black");
            obj.set_tablecellincompalign("end end");
            obj.set_taborder("0");
            obj.set_type("table");
            obj._setContents("<Contents><PanelItem componentid=\"btn_105187\" id=\"PanelItem00\"/></Contents>");
            this.addChild(obj.name, obj);

            obj = new Button("btn_105187","228","205","150","150",null,null,null,null,null,null,this);
            obj.set_background("darkgray");
            obj.set_tablecellarea("0/0");
            obj.set_taborder("1");
            obj.set_text("");
            this.addChild(obj.name, obj);

            obj = new TextArea("txa_105187","360","50","150","60",null,null,null,null,null,null,this);
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
        this.registerScript("RP_105187.xfdl", function() {
        /*
         *	Panel type=table 일 때 tablecellincompaling='end end'로 설정 했으나
         *  display: grid; justify-items: end; 형식으로 'align-items: end;'가 빠진style이 생성되어 'start end'로 출력되는 현상
         *
         *  - 재현 : Panel type=table, tablecellincompaling='end end' 설정 후 getComputedStyle 확인
         *  - 판정 : justify-items / align-items 둘다 end 로 설정되었다면 PASS
         */


        this.btn_105187_onclick = function(obj,e)
        {
        	var elPanel = this.pn_105187.getElement().handle;

        	var strJustItems = window.getComputedStyle(elPanel).justifyItems;
        	var strAlignItems = window.getComputedStyle(elPanel).alignItems;

        	this.txa_105187.value = (strJustItems == 'end') && (strAlignItems == 'end');
        };

        });
        
        // Regist UI Components Event
        this.on_initEvent = function()
        {
            this.btn_105187.addEventHandler("onclick",this.btn_105187_onclick,this);
        };

        this.loadIncludeScript("RP_105187.xfdl");
        this.loadPreloadList();
        
        // Remove Reference
        obj = null;
    };
}
)();
