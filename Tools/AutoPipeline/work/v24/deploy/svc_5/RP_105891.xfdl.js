(function()
{
    return function()
    {
        if (!this._is_form)
            return;
        
        var obj = null;
        
        this.on_create = function()
        {
            this.set_name("RP_105891");
            this.set_titletext("DateRangeCalendar Delimiter UI");
            if (Form == this.constructor)
            {
                this._setFormPosition(1280,720);
            }
            
            // Object(Dataset, ExcelExportObject) Initialize

            
            // UI Components Initialize
            obj = new DateRangeCalendar("drc_105891","10","10","600","70",null,null,null,null,null,null,this);
            obj.set_taborder("0");
            this.addChild(obj.name, obj);

            obj = new Button("Button00","10","90","120","50",null,null,null,null,null,null,this);
            obj.set_taborder("1");
            obj.set_text("Set Delimiter");
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
        this.registerScript("RP_105891.xfdl", function() {
        /*
         *	RP 105891
         *  DateRangeCalendar Delimeter 텍스트 수정 후 텍스트가 잘려서 출력되는 현상
         *
         *  - 재현 : DateRangeCalendar Delimeter 텍스트를 동적으로 변경
         *  - 판정 : Delimeter 텍스트를 변경한 뒤에 Element Screenshot 비교
         */

        this.Button00_onclick = function(obj,e)
        {
        	this.drc_105891.delimitertext = '-----';
        };


        /*
        elementscreenshot 사용으로 변경

        // getTextSize 와 Delimiter.getBoundingClientRect().width 를 비교하는 형식으로 확인하려고 했지만,
        // Delimiter 영역 사이즈 계산이 문제가 아니라 컴포넌트 _recalcLayout()로 datefield 사이즈가 조절되지 않는 것이 문제


        this.Button00_onclick = function(obj:nexacro.Button,e:nexacro.ClickEventInfo)
        {
        	var strDeliText = '-----';
        	this.drc_105891.delimitertext = strDeliText;

        	var elDRC = this.drc_105891.getElement().handle;
        	var elDeli = elDRC.querySelector('[id*="delimiter:text"]');

        	var strCSFont = window.getComputedStyle(elDeli).font;

        	var nTextSize =	nexacro.getTextSize(strDeliText, strCSFont).nx;

        	var nBCRWidth = elDeli.getBoundingClientRect().width;

        	this.txa_result.value = Math.abs(nTextSize - nBCRWidth) < 1;
        };
        */
        });
        
        // Regist UI Components Event
        this.on_initEvent = function()
        {
            this.Button00.addEventHandler("onclick",this.Button00_onclick,this);
        };

        this.loadIncludeScript("RP_105891.xfdl");
        this.loadPreloadList();
        
        // Remove Reference
        obj = null;
    };
}
)();
