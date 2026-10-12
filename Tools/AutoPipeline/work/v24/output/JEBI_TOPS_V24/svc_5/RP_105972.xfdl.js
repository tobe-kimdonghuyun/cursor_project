(function()
{
    return function()
    {
        if (!this._is_form)
            return;
        
        var obj = null;
        
        this.on_create = function()
        {
            this.set_name("RP_105972");
            this.set_titletext("DateRangeCalendar Start/Enddate");
            if (Form == this.constructor)
            {
                this._setFormPosition(1280,720);
            }
            
            // Object(Dataset, ExcelExportObject) Initialize

            
            // UI Components Initialize
            obj = new DateRangeCalendar("drc_105972","10","10","600","70",null,null,null,null,null,null,this);
            obj.set_taborder("0");
            this.addChild(obj.name, obj);

            obj = new Button("Button00","10","90","120","50",null,null,null,null,null,null,this);
            obj.set_taborder("1");
            obj.set_text("IsSame");
            this.addChild(obj.name, obj);

            obj = new TextArea("txa_result","140","90","120","50",null,null,null,null,null,null,this);
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
        this.registerScript("RP_105972.xfdl", function() {
        /*
         *	RP 105972
         *  DateRangeCalendar 팝업에서 Startdate만 선택한 경우 enddate도 동일하게 지정되도록 변경
         *
         *  - 재현 : DateRangeCalendar 에서 Startdate만 선택 후 OK 버튼을 눌러 팝업 닫기
         *  - 판정 : 선택한 날짜로 startdate와 enddate가 동일하게 설정되면 PASS
         */

        this.Button00_onclick = function(obj,e)
        {
        	this.txa_result.value = "";

        	var strSD = this.drc_105972.startdate;
        	var strED = this.drc_105972.enddate;

        	var bIsNull = strSD !== undefined && strSD !== null && strSD !== "";
        	this.txa_result.value = bIsNull && (strSD === strED);
        };

        });
        
        // Regist UI Components Event
        this.on_initEvent = function()
        {
            this.Button00.addEventHandler("onclick",this.Button00_onclick,this);
        };

        this.loadIncludeScript("RP_105972.xfdl");
        this.loadPreloadList();
        
        // Remove Reference
        obj = null;
    };
}
)();
