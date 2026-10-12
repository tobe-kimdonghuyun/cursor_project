(function()
{
    return function()
    {
        if (!this._is_form)
            return;
        
        var obj = null;
        
        this.on_create = function()
        {
            this.set_name("RP_105887");
            this.set_titletext("DateRangeCalendar Start/Enddate");
            if (Form == this.constructor)
            {
                this._setFormPosition(1280,720);
            }
            
            // Object(Dataset, ExcelExportObject) Initialize

            
            // UI Components Initialize
            obj = new DateRangeCalendar("drc_105887","10","10","600","70",null,null,null,null,null,null,this);
            obj.set_enddate("20260922");
            obj.set_startdate("20260714");
            obj.set_taborder("0");
            this.addChild(obj.name, obj);

            obj = new Button("Button00","10","90","120","50",null,null,null,null,null,null,this);
            obj.set_taborder("1");
            obj.set_text("Get Start/Enddate");
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
        this.registerScript("RP_105887.xfdl", function() {
        /*
         *	RP 105887
         *  DateRangeCalendar start/enddate 정적 설정 시 설정한 startdate/enddate가 화면에 표시되지 않고 빈 값(undefined)으로 나오는 현상
         *
         *  - 재현 : DateRangeCalendar에 start/enddate 값을 정적 설정 후 start/enddate 속성 확인
         *  - 판정 : 정적 설정한 start/enddate 값이 확인되면 PASS
         */


        this.Button00_onclick = function(obj,e)
        {
        	var bStart = this.drc_105887.startdate === '20260714';
        	var bEnd = this.drc_105887.enddate === '20260922';

        	this.txa_result.value = bStart && bEnd;
        };

        });
        
        // Regist UI Components Event
        this.on_initEvent = function()
        {
            this.Button00.addEventHandler("onclick",this.Button00_onclick,this);
        };

        this.loadIncludeScript("RP_105887.xfdl");
        this.loadPreloadList();
        
        // Remove Reference
        obj = null;
    };
}
)();
