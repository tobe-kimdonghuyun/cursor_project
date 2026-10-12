(function()
{
    return function()
    {
        if (!this._is_form)
            return;
        
        var obj = null;
        
        this.on_create = function()
        {
            this.set_name("RP_105889");
            this.set_titletext("DateRangeCalendar Script error");
            if (Form == this.constructor)
            {
                this._setFormPosition(1280,720);
            }
            
            // Object(Dataset, ExcelExportObject) Initialize
            obj = new Dataset("Dataset00", this);
            obj._setContents({"ColumnInfo" : {"Column" : [{"id" : "startdate","size" : "256","type" : "STRING"},{"id" : "enddate","size" : "256","type" : "STRING"}]},"Rows" : [{"startdate" : "20260714","enddate" : "20260922"}]});
            this.addChild(obj.name, obj);
            
            // UI Components Initialize
            obj = new DateRangeCalendar("drc_105889","10","10","600","70",null,null,null,null,null,null,this);
            obj.set_taborder("0");
            this.addChild(obj.name, obj);

            // Layout Functions
            //-- Default Layout : this
            obj = new Layout("default","",1280,720,this,function(p){});
            this.addLayout(obj.name, obj);
            
            // BindItem Information
            obj = new BindItem("item0","drc_105889","startdate","Dataset00","startdate");
            this.addChild(obj.name, obj);
            obj.bind();

            obj = new BindItem("item1","drc_105889","enddate","Dataset00","enddate");
            this.addChild(obj.name, obj);
            obj.bind();
            
            // TriggerItem Information

        };
        
        this.loadPreloadList = function()
        {

        };
        
        // User Script
        this.registerScript("RP_105889.xfdl", function() {
        /*
         *	RP 105889
         *  DateRangeCalendar 에 값이 바인딩되어 있는 경우 달력 팝업 내 OK 버튼 클릭 시 Script Error 가 발생하는 현상
         *
         *  - 재현 : 바인딩 값이 존재하는 DateRangeCalendar의 dropbutton을 클릭해 팝업 오픈 후 OK 버튼 클릭 10 회 반본
         *  - 판정 : 케이스 수행 중 Script Error 가 발생하지 않으면 PASS
         */
        });
        
        // Regist UI Components Event
        this.on_initEvent = function()
        {

        };

        this.loadIncludeScript("RP_105889.xfdl");
        this.loadPreloadList();
        
        // Remove Reference
        obj = null;
    };
}
)();
