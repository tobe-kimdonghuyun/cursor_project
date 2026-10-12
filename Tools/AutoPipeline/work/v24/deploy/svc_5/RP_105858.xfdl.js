(function()
{
    return function()
    {
        if (!this._is_form)
            return;
        
        var obj = null;
        
        this.on_create = function()
        {
            this.set_name("RP_105858");
            this.set_titletext("DateRangeCalendar iconbuttonsize");
            if (Form == this.constructor)
            {
                this._setFormPosition(1280,720);
            }
            
            // Object(Dataset, ExcelExportObject) Initialize

            
            // UI Components Initialize
            obj = new DateRangeCalendar("drc_105858","10","10","600","60",null,null,null,null,null,null,this);
            obj.set_taborder("0");
            this.addChild(obj.name, obj);

            obj = new Button("Button00","10","100","190","50",null,null,null,null,null,null,this);
            obj.set_taborder("1");
            obj.set_text("set iconbuttonsize");
            this.addChild(obj.name, obj);

            obj = new TextArea("txa_result","210","100","190","50",null,null,null,null,null,null,this);
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
        this.registerScript("RP_105858.xfdl", function() {
        /*
         *	RP 105858
         *  DateRangeCalendar iconbuttonsize 설정 시 enddate dropbutton만 적용되는 현상
         *
         *  - 재현 : DateRangeCalendar의 iconbuttonsize 동적으로 60 45으로 설정 후 사이즈 확인
         *  - 판정 : start/endDatefield 모두 적용되었다면 PASS
         */

        this.Button00_onclick = function(obj,e)
        {
        	this.drc_105858.iconbuttonsize = "60 45";

        	this.txa_result.value = this.fn_chkBtnSize();
        };

        this.fn_chkBtnSize = function ()
        {
        	var elDRC = this.drc_105858.getElement().handle;

        	var elSBtn = elDRC.querySelector('[id*="startdatefield.box.dropbutton"]');
        	var elEBtn = elDRC.querySelector('[id*="enddatefield.box.dropbutton"]');

        	var strSBCR = elSBtn.getBoundingClientRect();
        	var strEBCR = elEBtn.getBoundingClientRect();

        	// CSS 계산 소수점 고려해서 1px 이내라면 PASS 처리
        	var bSameWidth = Math.abs(strSBCR.width - 60) < 1 && Math.abs(strEBCR.width - 60) < 1
        	var bSameHeight = Math.abs(strSBCR.height - 45) < 1 && Math.abs(strEBCR.height - 45) < 1

        	return bSameWidth && bSameHeight;

        };
        });
        
        // Regist UI Components Event
        this.on_initEvent = function()
        {
            this.addEventHandler("ontimer",this.RP_105853_ontimer,this);
            this.drc_105858.addEventHandler("ondropdown",this.drc_105857_ondropdown,this);
            this.Button00.addEventHandler("onclick",this.Button00_onclick,this);
        };

        this.loadIncludeScript("RP_105858.xfdl");
        this.loadPreloadList();
        
        // Remove Reference
        obj = null;
    };
}
)();
