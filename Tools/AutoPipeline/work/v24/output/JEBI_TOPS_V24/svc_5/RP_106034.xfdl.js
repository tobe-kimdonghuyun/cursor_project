(function()
{
    return function()
    {
        if (!this._is_form)
            return;
        
        var obj = null;
        
        this.on_create = function()
        {
            this.set_name("RP_106034");
            this.set_titletext("DataRangeCalendar Edit > Bind");
            if (Form == this.constructor)
            {
                this._setFormPosition(1280,720);
            }
            
            // Object(Dataset, ExcelExportObject) Initialize
            obj = new Dataset("ds_dynamic", this);
            obj._setContents({"ColumnInfo" : {"Column" : [{"id" : "startdate","size" : "256","type" : "STRING"},{"id" : "enddate","size" : "256","type" : "STRING"}]},"Rows" : [{"startdate" : "20260714","enddate" : "20260922"}]});
            this.addChild(obj.name, obj);
            
            // UI Components Initialize
            obj = new DateRangeCalendar("drc_106034","10","10","600","70",null,null,null,null,null,null,this);
            obj.set_taborder("0");
            this.addChild(obj.name, obj);

            obj = new Grid("Grid00","10","90","600","65",null,null,null,null,null,null,this);
            obj.set_autoenter("select");
            obj.set_autofittype("col");
            obj.set_binddataset("ds_dynamic");
            obj.set_taborder("1");
            obj._setContents("<Formats><Format id=\"default\"><Columns><Column size=\"80\"/><Column size=\"80\"/></Columns><Rows><Row band=\"head\" size=\"24\"/><Row size=\"24\"/></Rows><Band id=\"head\"><Cell text=\"startdate\"/><Cell col=\"1\" text=\"enddate\"/></Band><Band id=\"body\"><Cell edittype=\"text\" text=\"bind:startdate\"/><Cell col=\"1\" edittype=\"text\" text=\"bind:enddate\"/></Band></Format></Formats>");
            this.addChild(obj.name, obj);

            obj = new TextArea("txa_onchanged","620","20","160","60",null,null,null,null,null,null,this);
            obj.set_taborder("2");
            this.addChild(obj.name, obj);

            // Layout Functions
            //-- Default Layout : this
            obj = new Layout("default","",1280,720,this,function(p){});
            this.addLayout(obj.name, obj);
            
            // BindItem Information
            obj = new BindItem("item0","drc_106034","startdate","ds_dynamic","startdate");
            this.addChild(obj.name, obj);
            obj.bind();

            obj = new BindItem("item1","drc_106034","enddate","ds_dynamic","enddate");
            this.addChild(obj.name, obj);
            obj.bind();
            
            // TriggerItem Information

        };
        
        this.loadPreloadList = function()
        {

        };
        
        // User Script
        this.registerScript("RP_106034.xfdl", function() {
        /*
         *	DateRangeCalendar의 start/enddatefield edit 영역에서 수정한 값이 binddataset 에 반영되지 않는 현상
         *
         *  - 재현 : DateRangeCalendar start/enddate 에 Dataset을 바인드한 상태에서 edit 영역을 통해 값 변경
         *  - 판정 : DateRangeCalendar 변경값과 Grid 에 출력되는 BindDataset 값이 일치하면 PASS
         */

        // 값 변경 확인을 위해 onchanged 이벤트 사용
        this.drc_106034_onchanged = function(obj,e)
        {
        	this.txa_onchanged.value = "changed";
        };

        });
        
        // Regist UI Components Event
        this.on_initEvent = function()
        {
            this.drc_106034.addEventHandler("onchanged",this.drc_106034_onchanged,this);
        };

        this.loadIncludeScript("RP_106034.xfdl");
        this.loadPreloadList();
        
        // Remove Reference
        obj = null;
    };
}
)();
