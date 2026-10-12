(function()
{
    return function()
    {
        if (!this._is_form)
            return;
        
        var obj = null;
        
        this.on_create = function()
        {
            this.set_name("RP_106032");
            this.set_titletext("DateRangeCalendar Bind CancelButton");
            if (Form == this.constructor)
            {
                this._setFormPosition(1280,720);
            }
            
            // Object(Dataset, ExcelExportObject) Initialize
            obj = new Dataset("ds_106032", this);
            obj._setContents({"ColumnInfo" : {"Column" : [{"id" : "startdate","size" : "256","type" : "STRING"},{"id" : "enddate","size" : "256","type" : "STRING"}]},"Rows" : [{"startdate" : "20260714","enddate" : "20260922"}]});
            this.addChild(obj.name, obj);
            
            // UI Components Initialize
            obj = new DateRangeCalendar("drc_106032","10","10","600","70",null,null,null,null,null,null,this);
            obj.set_taborder("0");
            this.addChild(obj.name, obj);

            // Layout Functions
            //-- Default Layout : this
            obj = new Layout("default","",1280,720,this,function(p){});
            this.addLayout(obj.name, obj);
            
            // BindItem Information
            obj = new BindItem("item0","drc_106032","startdate","ds_106032","startdate");
            this.addChild(obj.name, obj);
            obj.bind();

            obj = new BindItem("item1","drc_106032","enddate","ds_106032","enddate");
            this.addChild(obj.name, obj);
            obj.bind();
            
            // TriggerItem Information

        };
        
        this.loadPreloadList = function()
        {

        };
        
        // User Script
        this.registerScript("RP_106032.xfdl", function() {
        /*
         *	DateRangeCalendar에 BindDataset이 있는 경우 달력 팝업에서 값 선택 후 Cancel 동작을 수행해도 값이 입력되는 현상
         *
         *  - 재현 : BindDataset이 존재하는 DateRangeCalendar 달력 팝업에서 값 선택 후 Cancel or 팝업 밖 영역 선택
         *  - 판정 : Cancel 동작 이후 기존 값이 변경되지 않고 유지되면 PASS
         */
        });
        
        // Regist UI Components Event
        this.on_initEvent = function()
        {

        };

        this.loadIncludeScript("RP_106032.xfdl");
        this.loadPreloadList();
        
        // Remove Reference
        obj = null;
    };
}
)();
