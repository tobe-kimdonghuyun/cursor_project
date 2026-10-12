(function()
{
    return function()
    {
        if (!this._is_form)
            return;
        
        var obj = null;
        
        this.on_create = function()
        {
            this.set_name("RP_105863");
            this.set_titletext("DateRangeCalendar usedropbutton");
            if (Form == this.constructor)
            {
                this._setFormPosition(1280,720);
            }
            
            // Object(Dataset, ExcelExportObject) Initialize

            
            // UI Components Initialize
            obj = new DateRangeCalendar("drc_105863","10","10","600","60",null,null,null,null,null,null,this);
            obj.set_taborder("0");
            this.addChild(obj.name, obj);

            obj = new Button("Button00","10","100","190","50",null,null,null,null,null,null,this);
            obj.set_taborder("1");
            obj.set_text("set usedropbutton false");
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
        this.registerScript("RP_105863.xfdl", function() {
        /*
         *	RP 105863
         *  DateRangeCalendar usedropbutton false 설정 시 enddatefield 의 버튼만 사라지는 현상
         *
         *  - 재현 : DateRangeCalendar의 usedropbutton 속성을 false 설정
         *  - 판정 : usedropbutton이 start/enddatefield 둘다 사라지면 PASS
         */

        this.Button00_onclick = function(obj,e)
        {
        	this.drc_105863.usedropbutton = false;
        };
        });
        
        // Regist UI Components Event
        this.on_initEvent = function()
        {
            this.addEventHandler("ontimer",this.RP_105853_ontimer,this);
            this.drc_105863.addEventHandler("ondropdown",this.drc_105857_ondropdown,this);
            this.Button00.addEventHandler("onclick",this.Button00_onclick,this);
        };

        this.loadIncludeScript("RP_105863.xfdl");
        this.loadPreloadList();
        
        // Remove Reference
        obj = null;
    };
}
)();
