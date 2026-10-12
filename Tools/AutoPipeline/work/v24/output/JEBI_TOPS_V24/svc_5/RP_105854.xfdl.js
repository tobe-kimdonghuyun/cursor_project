(function()
{
    return function()
    {
        if (!this._is_form)
            return;
        
        var obj = null;
        
        this.on_create = function()
        {
            this.set_name("RP_105853");
            this.set_titletext("DateRangeCalendar Delimiter UI");
            if (Form == this.constructor)
            {
                this._setFormPosition(1280,720);
            }
            
            // Object(Dataset, ExcelExportObject) Initialize

            
            // UI Components Initialize
            obj = new DateRangeCalendar("drc_105854_overlap","10","10","600","60",null,null,null,null,null,null,this);
            obj.set_labelposition("overlap");
            obj.set_taborder("0");
            this.addChild(obj.name, obj);

            obj = new DateRangeCalendar("drc_105854_inside","10","80","600","60",null,null,null,null,null,null,this);
            obj.set_labelposition("inside");
            obj.set_taborder("1");
            this.addChild(obj.name, obj);

            obj = new DateRangeCalendar("drc_105854_outside","10","150","600","60",null,null,null,null,null,null,this);
            obj.set_labelposition("outside");
            obj.set_taborder("2");
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
        this.registerScript("RP_105854.xfdl", function() {
        /*
         *	RP 105854
         *  labelposition에 따라 변경되는 box size에 따라 delimiter도 동일하게 배치되도록 수정
         *
         *  - 재현 : DateRangeCalendar의 labelposition별 delimiter 위치 확인
         *  - 판정 : delimiter가 정상적으로 변경되었는지 ElementScreenshot 비교
         */
        });
        
        // Regist UI Components Event
        this.on_initEvent = function()
        {
            this.addEventHandler("ontimer",this.RP_105853_ontimer,this);
        };

        this.loadIncludeScript("RP_105854.xfdl");
        this.loadPreloadList();
        
        // Remove Reference
        obj = null;
    };
}
)();
