(function()
{
    return function()
    {
        if (!this._is_form)
            return;
        
        var obj = null;
        
        this.on_create = function()
        {
            this.set_name("RP_105886");
            this.set_titletext("DateRangeCalendar format keyaction");
            if (Form == this.constructor)
            {
                this._setFormPosition(1280,720);
            }
            
            // Object(Dataset, ExcelExportObject) Initialize

            
            // UI Components Initialize
            obj = new DateRangeCalendar("drc_105886","10","10","600","70",null,null,null,null,null,null,this);
            obj.set_format("yyyyMMdd");
            obj.set_taborder("0");
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
        this.registerScript("RP_105886.xfdl", function() {
        /*
         *	RP 105886
         *  DateRangeCalendar의 format을 구분자가 없는 형식(yyyyMMdd)으로 설정 후
         *  편집(edit) 영역에서 월 또는 일 세그먼트를 선택하고 방향키(위/아래)를 눌렀을 때 월/일 값이 변하지 않고 포커스가 연도 영역으로 이동하는 현상
         *
         *  - 재현 : DateRangeCalendar의 format을 yyyMMdd로 설정 후 DD 세그먼트에서 방향키 위/아래 를 눌렀을 때 동작 확인
         *  - 판정 : 포커스가 이동하지 않고, DD 세그먼트의 값이 증가하거나 감소하면 PASS
         */
        });
        
        // Regist UI Components Event
        this.on_initEvent = function()
        {

        };

        this.loadIncludeScript("RP_105886.xfdl");
        this.loadPreloadList();
        
        // Remove Reference
        obj = null;
    };
}
)();
