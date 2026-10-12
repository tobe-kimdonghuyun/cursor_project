(function()
{
    return function()
    {
        if (!this._is_form)
            return;
        
        var obj = null;
        
        this.on_create = function()
        {
            this.set_name("RP_105857");
            this.set_titletext("DateRangeCalendar displaymonthcount");
            if (Form == this.constructor)
            {
                this._setFormPosition(1280,720);
            }
            
            // Object(Dataset, ExcelExportObject) Initialize

            
            // UI Components Initialize
            obj = new DateRangeCalendar("drc_105857","10","10","600","60",null,null,null,null,null,null,this);
            obj.set_taborder("0");
            this.addChild(obj.name, obj);

            obj = new Button("Button00","10","100","190","50",null,null,null,null,null,null,this);
            obj.set_taborder("1");
            obj.set_text("set displaymonthcount : -1");
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
        this.registerScript("RP_105857.xfdl", function() {
        /*
         *	RP 105857
         *  DateRangeCalendar displaymonthcount -1 입력 시 dropbutton을 눌러도 팝업 출력이 안되는 현상
         *
         *  - 재현 : DateRangeCalendar의 displaymonthcount를 동적으로 -1로 설정 후 dropbutton 클릭
         *  - 판정 : displaymonthcount=2(디폴트) 처럼 팝업이 출력되어 dayitem 버튼을 누를 수 있다면 PASS
         */

        this.Button00_onclick = function(obj,e)
        {
        	this.drc_105857.displaymonthcount = -1;
        };

        });
        
        // Regist UI Components Event
        this.on_initEvent = function()
        {
            this.addEventHandler("ontimer",this.RP_105853_ontimer,this);
            this.drc_105857.addEventHandler("ondropdown",this.drc_105857_ondropdown,this);
            this.Button00.addEventHandler("onclick",this.Button00_onclick,this);
        };

        this.loadIncludeScript("RP_105857.xfdl");
        this.loadPreloadList();
        
        // Remove Reference
        obj = null;
    };
}
)();
