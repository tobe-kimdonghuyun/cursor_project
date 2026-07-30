(function()
{
    return function()
    {
        if (!this._is_form)
            return;
        
        var obj = null;
        
        this.on_create = function()
        {
            this.set_name("testGrdEdit");
            this.set_titletext("New Form");
            if (Form == this.constructor)
            {
                this._setFormPosition(1280,720);
            }
            
            // Object(Dataset, ExcelExportObject) Initialize
            obj = new Dataset("Dataset00", this);
            obj._setContents({"ColumnInfo" : {"Column" : [ {"id" : "Column0","type" : "STRING","size" : "256"},{"id" : "Column1","type" : "STRING","size" : "256"}]},"Rows" : [{"Column0" : "abcde1","Column1" : "abcde3"},{"Column1" : "abcde4","Column0" : "abcde2"},{"Column0" : "abcde1","Column1" : "abcde3"},{"Column0" : "abcde1","Column1" : "abcde3"},{"Column0" : "abcde1","Column1" : "abcde3"},{"Column0" : "abcde1","Column1" : "abcde3"},{"Column0" : "abcde2","Column1" : "abcde4"}]});
            this.addChild(obj.name, obj);
            
            // UI Components Initialize
            obj = new Grid("Grid00","106","94","308","166",null,null,null,null,null,null,this);
            obj.set_taborder("0");
            obj.set_binddataset("Dataset00");
            obj.set_autofittype("col");
            obj._setContents("<Formats><Format id=\"default\"><Columns><Column size=\"80\"/><Column size=\"80\"/></Columns><Rows><Row size=\"24\" band=\"head\"/><Row size=\"24\"/></Rows><Band id=\"head\"><Cell text=\"Column0\"/><Cell col=\"1\" text=\"Column1\"/></Band><Band id=\"body\"><Cell text=\"bind:Column0\" displaytype=\"text\" edittype=\"text\"/><Cell col=\"1\" text=\"bind:Column1\" displaytype=\"text\" edittype=\"text\"/></Band></Format></Formats>");
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
        this.registerScript("testGrdEdit.xfdl", function() {

        this.Grid00_onkeyup = function(obj,e)
        {
        // 	   if(e.ctrlkey)
        // 		{
        // 			if(e.keycode == 67)
        // 			{
        // 				trace("=====Grid00_onkeyup=====");
        //
        // 				system.setClipboard( "CF_TEXT", "☆copy data★" );
        // 			}
        // 		}
        };

        this.Grid00_onkeydown = function(obj,e)
        {
        	   if(e.ctrlkey)
        		{
        			if(e.keycode == 67)
        			{
        				trace("=====Grid00_onkeydown=====");

        				system.setClipboard( "CF_TEXT", "※copy data※" );
        			}
        		}
        };

        });
        
        // Regist UI Components Event
        this.on_initEvent = function()
        {
            this.addEventHandler("onkeydown",this.testGrdEdit_onkeydown,this);
            this.Grid00.addEventHandler("onkeyup",this.Grid00_onkeyup,this);
            this.Grid00.addEventHandler("onkeydown",this.Grid00_onkeydown,this);
        };
        this.loadIncludeScript("testGrdEdit.xfdl");
        this.loadPreloadList();
        
        // Remove Reference
        obj = null;
    };
}
)();
