(function()
{
    return function()
    {
        if (!this._is_form)
            return;
        
        var obj = null;
        
        this.on_create = function()
        {
            this.set_name("importTest");
            this.set_titletext("New Form");
            if (Form == this.constructor)
            {
                this._setFormPosition(1280,720);
            }
            
            // Object(Dataset, ExcelExportObject) Initialize
            obj = new Dataset("Dataset00", this);
            obj._setContents({"ColumnInfo" : {"Column" : [ {"id" : "Column0","type" : "STRING","size" : "256"},{"id" : "Column1","type" : "STRING","size" : "256"}]}});
            this.addChild(obj.name, obj);
            
            // UI Components Initialize
            obj = new Grid("Grid00","83","60","547","240",null,null,null,null,null,null,this);
            obj.set_taborder("0");
            obj.set_binddataset("Dataset00");
            obj.set_cellsizingtype("col");
            obj._setContents("<Formats><Format id=\"default\"><Columns><Column size=\"80\"/><Column size=\"80\"/></Columns><Rows><Row band=\"head\" size=\"24\"/><Row size=\"24\"/></Rows><Band id=\"head\"><Cell text=\"Column0\"/><Cell col=\"1\" text=\"Column1\"/></Band><Band id=\"body\"><Cell text=\"bind:Column0\"/><Cell col=\"1\" text=\"bind:Column1\"/></Band></Format></Formats>");
            this.addChild(obj.name, obj);

            obj = new Button("Button00","90","15","530","35",null,null,null,null,null,null,this);
            obj.set_taborder("1");
            obj.set_text("임포트(업로드)");
            obj.set_background("red");
            this.addChild(obj.name, obj);

            obj = new TextArea("TextArea00","660","22","468","432",null,null,null,null,null,null,this);
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
        this.registerScript("RP_105472_importTest.xfdl", function() {

        this.Button00_onclick = function(obj,e)
        {
        	//this.url = "http://localhost:8080/XExportImport";
        	//this.url = "https://api-dev.apps.lis-prj.seegenemedical.com/xeni/XExportImport";
        	//this.url = "https://api-qa.apps.lis-prj.seegenemedical.com/xeni/XExportImport";
        	//this.url = "https://api-dev.apps.lis-dev.seegenemedical.com/xeni/XExportImport";
        	//this.url = "https://api-qa.apps.lis-dev.seegenemedical.com/xeni/XExportImport";
        	this.url = "http://172.10.12.45:9090/NexacroN_XENI_JAVA_20251024(1.5.11)/XExportImport";


        	//this.url = "http://demo.nexacro.com/developer_guide/XExportImport";

            this.importObj = new ExcelImportObject("Import00",this);
            this.importObj.set_importtype(nexacro.ImportTypes.EXCEL);
        	//this.importObj.set_importtype(nexacro.ImportTypes.TXT);
            this.importObj.addEventHandler("onsuccess", this.Import00_onsuccess, this);
            this.importObj.addEventHandler("onerror", this.Import00_onerror, this);
            this.importObj.set_importurl(this.url);
            this.importObj.importData("local","Body=Sheet1!A1;output=ds","Dataset00=ds");
        	this.importObj.set_separator("0x09");
        	this.importObj.set_quotechar("none");
        };

        this.Import00_onsuccess = function(obj, e)
        {
        	this.TextArea00.set_value(this.TextArea00.value + "\n=========== onsuccess event start=============");
        	this.TextArea00.set_value(this.TextArea00.value + "\ne.eventid: " 				+ e.eventid			);
        	this.TextArea00.set_value(this.TextArea00.value + "\ne.fromobject: " 			+ e.fromobject		);
        	this.TextArea00.set_value(this.TextArea00.value + "\ne.fromreferenceobject: " 	+ e.fromreferenceobject);
        	this.TextArea00.set_value(this.TextArea00.value + "\ne.url: " 					+  e.url			);
        };

        this.Import00_onerror = function(obj,  e)
        {
        	this.TextArea00.set_value(this.TextArea00.value + "\n=========== onerror event start===============");
        	this.TextArea00.set_value(this.TextArea00.value + "\ne.eventid: " 				+ e.eventid			);
        	this.TextArea00.set_value(this.TextArea00.value + "\ne.fromobject: " 			+ e.fromobject		);
        	this.TextArea00.set_value(this.TextArea00.value + "\ne.fromreferenceobject: " 	+ e.fromreferenceobject);
        	this.TextArea00.set_value(this.TextArea00.value + "\ne.errorcode: " 			+  e.errorcode		);
        	this.TextArea00.set_value(this.TextArea00.value + "\ne.errormsg: " 				+ e.errormsg		);
        };

        });
        
        // Regist UI Components Event
        this.on_initEvent = function()
        {
            this.Button00.addEventHandler("onclick",this.Button00_onclick,this);
        };
        this.loadIncludeScript("RP_105472_importTest.xfdl");
        this.loadPreloadList();
        
        // Remove Reference
        obj = null;
    };
}
)();
