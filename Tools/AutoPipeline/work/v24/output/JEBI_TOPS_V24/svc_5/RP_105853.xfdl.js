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
            this.set_titletext("DateRangeCalendar Focus");
            if (Form == this.constructor)
            {
                this._setFormPosition(1280,720);
            }
            
            // Object(Dataset, ExcelExportObject) Initialize

            
            // UI Components Initialize
            obj = new TextArea("txa_result","10","90","193","60",null,null,null,null,null,null,this);
            obj.set_taborder("0");
            this.addChild(obj.name, obj);

            obj = new DateRangeCalendar("drc_105853","10","10","600","70",null,null,null,null,null,null,this);
            obj.set_taborder("1");
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
        this.registerScript("RP_105853.xfdl", function() {
        /*
         *	RP 105853
         *  DateRangeCalendar 값 선택 후 팝업을 닫으면 StartDatefield 의 year 로 포커스가 가야하지만, EndDatefield로 포커스가 되는 현상
         *
         *  - 재현 : DateRangeCalendar 팝업 달력에서 값 선택 후 OK 버튼을 눌러 팝업을 닫았을 때 포커스 상태
         *  - 판정 : document.activeElement 와 startdatefield.getSelect() 비교, startdatefield input 연도 포커스라면 PASS
         */

        // DateRangeCalendar StartDatefield Label 제대로 안 올라가는 현상
        this.drc_105853_oncloseup = function(obj,e)
        {
        	this.setTimer(100, 2000);
        };

        this.RP_105853_ontimer = function(obj,e)
        {
        	if(e.timerid == 100)
        	{
        		this.txa_result.value = this.fn_chkFocus();
        		this.killTimer(100);
        	}
        };

        this.fn_chkFocus = function ()
        {
        	var elDRC = this.drc_105853.getElement().handle;
        	var elSInput = elDRC.querySelector('[id*="startdatefield.box:simpleinput"]'); // DateRangeCalendar startDatefield input Element

        	var bSameEl = elSInput === document.activeElement; // activeElement와 일치하는지 비교

        	var strSSel = this.drc_105853.startdatefield.getSelectedText();
        	var bSel = strSSel == this.drc_105853.getYear('start'); //

        	return bSameEl && bSel;
        };




        });
        
        // Regist UI Components Event
        this.on_initEvent = function()
        {
            this.addEventHandler("ontimer",this.RP_105853_ontimer,this);
            this.drc_105853.addEventHandler("oncloseup",this.drc_105853_oncloseup,this);
        };

        this.loadIncludeScript("RP_105853.xfdl");
        this.loadPreloadList();
        
        // Remove Reference
        obj = null;
    };
}
)();
