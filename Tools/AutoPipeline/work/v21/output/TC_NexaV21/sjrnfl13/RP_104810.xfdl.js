(function()
{
    return function()
    {
        if (!this._is_form)
            return;
        
        var obj = null;
        
        this.on_create = function()
        {
            this.set_name("ExportExcel");
            this.set_titletext("New Form");
            if (Form == this.constructor)
            {
                this._setFormPosition(1280,720);
            }
            
            // Object(Dataset, ExcelExportObject) Initialize
            obj = new Dataset("Dataset00", this);
            obj._setContents({"ColumnInfo" : {"Column" : [{"id" : "Column0","size" : "256","type" : "STRING"},{"id" : "Column1","size" : "256","type" : "STRING"},{"id" : "Column2","size" : "256","type" : "STRING"}]},"Rows" : [{"Column0" : "1","Column1" : "가","Column2" : "레몬즙"},{"Column0" : "2","Column1" : "나","Column2" : "아이스티"},{"Column0" : "3","Column1" : "다","Column2" : "초코파이"}]});
            this.addChild(obj.name, obj);
            
            // UI Components Initialize
            obj = new Button("Button00","22","23","120","50",null,null,null,null,null,null,this);
            obj.set_taborder("0");
            obj.set_text("값확인");
            this.addChild(obj.name, obj);

            obj = new Grid("Grid00","27","93","533","270",null,null,null,null,null,null,this);
            obj.set_binddataset("Dataset00");
            obj.set_taborder("1");
            obj._setContents("<Formats><Format id=\"default\"><Columns><Column size=\"80\"/><Column size=\"80\"/><Column size=\"80\"/></Columns><Rows><Row band=\"head\" size=\"24\"/><Row size=\"24\"/><Row band=\"summ\" size=\"24\"/></Rows><Band id=\"head\"><Cell text=\"Column0\"/><Cell col=\"1\" text=\"Column1\"/><Cell col=\"2\" text=\"Column2\"/></Band><Band id=\"body\"><Cell text=\"bind:Column0\"/><Cell col=\"1\" text=\"bind:Column1\"/><Cell col=\"2\" text=\"bind:Column2\"/></Band><Band id=\"summary\"><Cell/><Cell col=\"1\"/><Cell col=\"2\"/></Band></Format></Formats>");
            this.addChild(obj.name, obj);

            obj = new TextArea("TextArea00","592","94","419","268",null,null,null,null,null,null,this);
            obj.set_taborder("2");
            this.addChild(obj.name, obj);

            obj = new Edit("Edit00","95","378","268","75",null,null,null,null,null,null,this);
            obj.set_taborder("3");
            obj.set_value("값확인");
            obj.set_text("값확인");
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
        this.registerScript("RP_104810.xfdl", function() {
        this.url=null;

        this.Button00_onclick = function(obj,e)
        {
        	try{
        		this.ExcelExportObject00 = new ExcelExportObject();

        		this.ExcelExportObject00.addEventHandler("onsuccess", this.ExcelExportObject00_onsuccess, this);
        		this.ExcelExportObject00.addEventHandler("onerror", this.ExcelExportObject00_onerror, this);

        		var ret = this.ExcelExportObject00.addExportItem(nexacro.ExportItemTypes.GRID, this.Grid00, "Sheet1!A1","allband","allrecord","suppress","allstyle");

        	// 	this.ExcelExportObject00.set_exportmessageprocess("%d [ %d / %d ]");
        	// 	this.ExcelExportObject00.set_exportuitype("exportprogress");
        	//	this.ExcelExportObject00.set_exporteventtype("itemrecord");
        		this.ExcelExportObject00.set_exporttype(nexacro.ExportTypes.EXCEL2007);

        		this.ExcelExportObject00.set_exportfilename("ExcelExport_Sample");
        		this.ExcelExportObject00.set_exporturl(this.url);

        	this.ExcelExportObject00.exportDataEx();
        	} catch(e)
        	{
        		this.TextArea00.deleteText();
        		this.TextArea00.insertText(e);
        	}
        };

        this.ExcelExportObject00_onsuccess = function (obj, e)
        {
        	console.log(location.protocol);  // "https:"
        	console.log(location.host);
        	console.log(location.origin);
        	this.TextArea00.deleteText();
        	this.TextArea00.insertText("ExcelExportObject00_onsuccess");
        };

        this.ExcelExportObject00_onerror = function (obj, e)
        {
        	this.TextArea00.deleteText();
        	this.TextArea00.insertText(e.errormsg);
        };
        this.ExportExcel_onload = function(obj,e)
        {
        	if (location.hostname == "172.10.12.45")
        	{
        		//본인 PC 자리
        		this.url = location.origin+"/NexacroN_XENI_JAVA_20260720(1.6.2)_1/XExportImport";
        	}
        	else
        	{
        		// TestPro 운영 서버 pc
        		this.url = location.origin+"/nexacro-xeni-java-jakarta/XExportImport";
        	}

        };

        });
        
        // Regist UI Components Event
        this.on_initEvent = function()
        {
            this.addEventHandler("onload",this.ExportExcel_onload,this);
            this.Button00.addEventHandler("onclick",this.Button00_onclick,this);
        };

        this.loadIncludeScript("RP_104810.xfdl");
        this.loadPreloadList();
        
        // Remove Reference
        obj = null;
    };
}
)();
