(function()
{
    return function()
    {
        if (!this._is_form)
            return;
        
        var obj = null;
        
        this.on_create = function()
        {
            this.set_name("assdf");
            this.set_titletext("New Form");
            if (Form == this.constructor)
            {
                this._setFormPosition(1280,720);
            }
            
            // Object(Dataset, ExcelExportObject) Initialize
            obj = new Dataset("Dataset00", this);
            obj._setContents({"ColumnInfo" : {"Column" : [{"id" : "Column0","size" : "256","type" : "STRING"},{"id" : "Column1","size" : "256","type" : "STRING"}]},"Rows" : [{}]});
            this.addChild(obj.name, obj);
            
            // UI Components Initialize
            obj = new Edit("Edit00","60","36","152","27",null,null,null,null,null,null,this);
            obj.set_autoselect("true");
            obj.set_taborder("0");
            this.addChild(obj.name, obj);

            obj = new Edit("Edit00_00","244","37","152","27",null,null,null,null,null,null,this);
            obj.set_autoselect("true");
            obj.set_taborder("1");
            this.addChild(obj.name, obj);

            // Layout Functions
            //-- Default Layout : this
            obj = new Layout("default","",1280,720,this,function(p){});
            this.addLayout(obj.name, obj);
            
            // BindItem Information
            obj = new BindItem("item0","Edit00","value","Dataset00","Column0");
            this.addChild(obj.name, obj);
            obj.bind();

            obj = new BindItem("item1","Edit00_00","value","Dataset00","Column1");
            this.addChild(obj.name, obj);
            obj.bind();
            
            // TriggerItem Information

        };
        
        this.loadPreloadList = function()
        {

        };
        
        // User Script
        this.registerScript("RP_102008_test.xfdl", function() {

        this.Dataset00_onvaluechanged = function(obj,e)
        {
        	if (e.columnid == "Column0")
        	{
        	    if (e.newvalue == "111")
        		{
        		    obj.setColumn(e.row, e.columnid, "");
        			trace(obj.saveXML());
        		}
        	}
        };

        });
        
        // Regist UI Components Event
        this.on_initEvent = function()
        {
            this.Dataset00.addEventHandler("onvaluechanged",this.Dataset00_onvaluechanged,this);
        };

        this.loadIncludeScript("RP_102008_test.xfdl");
        this.loadPreloadList();
        
        // Remove Reference
        obj = null;
    };
}
)();
