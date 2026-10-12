(function()
{
    return function()
    {
        if (!this._is_form)
            return;
        
        var obj = null;
        
        this.on_create = function()
        {
            this.set_name("daterangeSample");
            this.set_titletext("New Form");
            if (Form == this.constructor)
            {
                this._setFormPosition(1280,720);
            }
            
            // Object(Dataset, ExcelExportObject) Initialize

            
            // UI Components Initialize
            obj = new DateRangePicker("DateRangePicker00_00","15.00","10","610","310",null,null,null,null,null,null,this);
            obj.set_backgroundcolumn("Column1");
            obj.set_datecolumn("Column0");
            obj.set_direction("horizontal");
            obj.set_displaytype("datetime");
            obj.set_headlineposition("top");
            obj.set_headlinesize("60");
            obj.set_hintingcolumn("Column4");
            obj.set_rangeposition("start");
            obj.set_readonlycolumn("Column5");
            obj.set_taborder("0");
            obj.set_textcolorcolumn("Column3");
            obj.set_type("range");
            obj.set_visible("true");
            this.addChild(obj.name, obj);

            // Layout Functions
            //-- Default Layout : this
            obj = new Layout("default","",1280,720,this,function(p){});
            this.addLayout(obj.name, obj);
            
            // BindItem Information
            obj = new BindItem("item0","DateRangePicker00_00","startdate","Dataset01","");
            this.addChild(obj.name, obj);
            obj.bind();

            obj = new BindItem("item1","DateRangePicker00_00","enddate","Dataset01","");
            this.addChild(obj.name, obj);
            obj.bind();
            
            // TriggerItem Information

        };
        
        this.loadPreloadList = function()
        {

        };
        
        // User Script

        
        // Regist UI Components Event
        this.on_initEvent = function()
        {
            this.DateRangePicker00_00.addEventHandler("onchanged",this.DateRangePicker00_onchanged,this);
            this.DateRangePicker00_00.addEventHandler("ondayclick",this.DateRangePicker00_ondayclick,this);
        };

        this.loadIncludeScript("RP_98660_daterangeSample.xfdl");
        this.loadPreloadList();
        
        // Remove Reference
        obj = null;
    };
}
)();
