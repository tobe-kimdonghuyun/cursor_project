(function()
{
    return function()
    {
        if (!this._is_form)
            return;
        
        var obj = null;
        
        this.on_create = function()
        {
            this.set_name("RP_105861");
            this.set_titletext("DateRangeCalendar Label");
            if (Form == this.constructor)
            {
                this._setFormPosition(1280,720);
            }
            
            // Object(Dataset, ExcelExportObject) Initialize

            
            // UI Components Initialize
            obj = new DateRangeCalendar("drc_105861","10","10","600","70",null,null,null,null,null,null,this);
            obj.set_labelfloatingfixed("false");
            obj.set_labelposition("outside");
            obj.set_taborder("0");
            this.addChild(obj.name, obj);

            obj = new Static("Static00","620","20","193","60",null,null,null,null,null,null,this);
            obj.set_taborder("1");
            obj.set_text("labelfloatingfixed : false\r\nlabelposition : outside");
            this.addChild(obj.name, obj);

            obj = new TextArea("txa_105861_result","10","90","193","60",null,null,null,null,null,null,this);
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
        this.registerScript("RP_105861.xfdl", function() {
        /*
         *	RP 105861
         *  DateRangeCalendar dropbutton 클릭 시 StartDatefield Label 안 올라가는 현상
         *
         *  - 재현 : DateRangeCalendar 팝업 달력 dayclick 이벤트로 팝업이 열린 상태에서 Label이 올라갔는지 확인
         *  - 판정 : StartDatefield의 Box 영역 top 과 Label 영역 bottom 을 비교해 bottom 이 같거나 더 높이 위치하면 PASS
         */

        // DateRangeCalendar StartDatefield Label 제대로 안 올라가는 현상
        this.drc_ondayclick = function(obj,e)
        {
        	var elSLabel = document.querySelector('[id*="drc_105861.startdatefield.label"]');
        	var elSBox = document.querySelector('[id*="drc_105861.startdatefield.box"]');

        	var labelRect = elSLabel.getBoundingClientRect();
        	var boxRect = elSBox.getBoundingClientRect();

        	// Box 의 top 이 Label 의 bottom 값 보다 더 크면 아래에 위치한 것으로 판단
        	var bOutside = labelRect.bottom <= boxRect.top;

        	this.txa_105861_result.value = bOutside;
        };
        });
        
        // Regist UI Components Event
        this.on_initEvent = function()
        {
            this.drc_105861.addEventHandler("ondayclick",this.drc_ondayclick,this);
        };

        this.loadIncludeScript("RP_105861.xfdl");
        this.loadPreloadList();
        
        // Remove Reference
        obj = null;
    };
}
)();
