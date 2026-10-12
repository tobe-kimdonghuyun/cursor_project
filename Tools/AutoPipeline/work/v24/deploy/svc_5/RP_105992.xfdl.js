(function()
{
    return function()
    {
        if (!this._is_form)
            return;
        
        var obj = null;
        
        this.on_create = function()
        {
            this.set_name("RP_105992");
            this.set_titletext("DateRangeCalendar Popup Status");
            if (Form == this.constructor)
            {
                this._setFormPosition(1280,720);
            }
            
            // Object(Dataset, ExcelExportObject) Initialize

            
            // UI Components Initialize
            obj = new DateRangeCalendar("drc_105992","10","10","600","70",null,null,null,null,null,null,this);
            obj.set_taborder("0");
            this.addChild(obj.name, obj);

            obj = new Button("Button00","10","90","120","50",null,null,null,null,null,null,this);
            obj.set_taborder("1");
            obj.set_text("Get Status");
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
        this.registerScript("RP_105992.xfdl", function() {
        /*
         *	RP 105992
         *  DateRangeCalendar undefined 값에서 팝업 선택 없이 OK 반복 시 invalid 되는 현상
         *
         *  - 재현 : DateRangeCalendar 에서 아무 날짜 선택 없이 팝업 OK 버튼 클릭 반복
         *  - 판정 : start/enddate 가 invaild status로 변하지 않으면 PASS
         */

        this.Button00_onclick = function(obj,e)
        {
        	this.txa_result.value = "";

        	var bSStatus = this.drc_105992.startdatefield.getValidStatus() == 'invalid';
        	var bEStatus = this.drc_105992.enddatefield.getValidStatus() == 'invalid';

        	this.txa_result.value = !bSStatus && !bEStatus;
        };

        });
        
        // Regist UI Components Event
        this.on_initEvent = function()
        {
            this.Button00.addEventHandler("onclick",this.Button00_onclick,this);
        };

        this.loadIncludeScript("RP_105992.xfdl");
        this.loadPreloadList();
        
        // Remove Reference
        obj = null;
    };
}
)();
