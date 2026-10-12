(function()
{
    return function()
    {
        if (!this._is_form)
            return;
        
        var obj = null;
        
        this.on_create = function()
        {
            this.set_name("RP_105860");
            this.set_titletext("DateRangeCalendar datenulltext");
            if (Form == this.constructor)
            {
                this._setFormPosition(1280,720);
            }
            
            // Object(Dataset, ExcelExportObject) Initialize

            
            // UI Components Initialize
            obj = new DateRangeCalendar("drc_105860","10","10","600","60",null,null,null,null,null,null,this);
            obj.set_enddatenulltext("enD null Text");
            obj.set_startdatenulltext("STart Null Text");
            obj.set_taborder("0");
            this.addChild(obj.name, obj);

            obj = new Button("Button00","10","85","120","50",null,null,null,null,null,null,this);
            obj.set_taborder("1");
            obj.set_text("Change Null Text");
            this.addChild(obj.name, obj);

            // Layout Functions
            //-- Default Layout : this
            obj = new Layout("default","",1280,720,this,function(p){});
            obj.set_mobileorientation("landscape");
            this.addLayout(obj.name, obj);
            
            // BindItem Information

            
            // TriggerItem Information

        };
        
        this.loadPreloadList = function()
        {

        };
        
        // User Script
        this.registerScript("RP_105860.xfdl", function() {
        /*
         *	RP 105860
         *  DateRangeCalendar startdatenulltext, enddatenulltext 정적 설정이 되지 않는 현상
         *
         *  - 재현 : 정적으로 startdatenulltext, enddatenulltext 를 설정한 DateRangeCalendar 실행
         *  - 판정 : 값이 없는 상태에서 start/enddatenulltext 정적/동적 모두 적용되었다면 PASS
         */

        // datenulltext 동적 설정
        this.Button00_onclick = function(obj,e)
        {
        	this.drc_105860.startdatenulltext = "123";
        	this.drc_105860.enddatenulltext = "456";
        };

        });
        
        // Regist UI Components Event
        this.on_initEvent = function()
        {
            this.addEventHandler("ontimer",this.RP_105853_ontimer,this);
            this.drc_105860.addEventHandler("ondropdown",this.drc_105857_ondropdown,this);
            this.Button00.addEventHandler("onclick",this.Button00_onclick,this);
        };

        this.loadIncludeScript("RP_105860.xfdl");
        this.loadPreloadList();
        
        // Remove Reference
        obj = null;
    };
}
)();
