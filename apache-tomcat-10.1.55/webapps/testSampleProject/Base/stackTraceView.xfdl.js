(function()
{
    return function()
    {
        if (!this._is_form)
            return;
        
        var obj = null;
        
        this.on_create = function()
        {
            this.set_name("stackTraceView");
            this.set_titletext("New Form");
            if (Form == this.constructor)
            {
                this._setFormPosition(1280,720);
            }
            
            // Object(Dataset, ExcelExportObject) Initialize
            obj = new Dataset("dsResult", this);
            obj.set_useclientlayout("false");
            obj._setContents({"ColumnInfo" : {"Column" : [ {"id" : "COL1","type" : "STRING","size" : "256"},{"id" : "COL2","type" : "STRING","size" : "256"},{"id" : "COL3","type" : "STRING","size" : "256"}]},"Rows" : [{"COL1" : "가","COL2" : "나","COL3" : "다"}]});
            this.addChild(obj.name, obj);


            obj = new Dataset("ds_input_param", this);
            obj._setContents({"ColumnInfo" : {"Column" : [ {"id" : "Column0","type" : "STRING","size" : "256"},{"id" : "Column1","type" : "STRING","size" : "256"}]},"Rows" : [{}]});
            this.addChild(obj.name, obj);
            
            // UI Components Initialize
            obj = new Button("Button00","153","129","444","144",null,null,null,null,null,null,this);
            obj.set_taborder("0");
            obj.set_text("비동기");
            this.addChild(obj.name, obj);

            obj = new Button("Button01","634","134","446","136",null,null,null,null,null,null,this);
            obj.set_taborder("1");
            obj.set_text("동기");
            this.addChild(obj.name, obj);

            obj = new MaskEdit("MaskEdit00","54","30","86","36",null,null,null,null,null,null,this);
            obj.set_taborder("2");
            this.addChild(obj.name, obj);

            obj = new Static("Static00","192","45","40","22",null,null,null,null,null,null,this);
            obj.set_taborder("3");
            obj.set_text("Static00");
            this.addChild(obj.name, obj);

            obj = new TextArea("TextArea00","340","34","92","38",null,null,null,null,null,null,this);
            obj.set_taborder("4");
            this.addChild(obj.name, obj);

            obj = new Edit("Edit00","478","38","104","36",null,null,null,null,null,null,this);
            obj.set_taborder("5");
            this.addChild(obj.name, obj);

            obj = new MaskEdit("MaskEdit01","166","323","142","43",null,null,null,null,null,null,this);
            obj.set_taborder("6");
            this.addChild(obj.name, obj);

            obj = new Edit("Edit01","380","317","616","99",null,null,null,null,null,null,this);
            obj.set_taborder("7");
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
        this.registerScript("stackTraceView.xfdl", function() {


        this.testSample_onload = function(obj,e)
        {
        	//this.Button02.click();
        };

        this.Button00_onclick = function(obj,e)
        {
        	this.transaction("JsonErrorTrJson_ASync"
        			   ,"http://172.10.12.45:9090/testA_json_error.jsp"
        			   ,"ds_input_param=ds_input_param"
        			   ,"ds_out=ds_input_param"
        			   ,""
        			   ,"fnCallbackJ"
        			   ,true);
        };

        this.fnCallbackJ = function(svcid, errCode, errMsg)
        {
        	this.Edit01.value = "";
        	trace("\nㅡㅡㅡㅡㅡㅡㅡㅡ" + svcid + " / " + errCode + " / " + errMsg + "ㅡㅡㅡㅡㅡㅡㅡㅡ\n");
        	this.Edit01.value = svcid + " / " + errCode + " / " + errMsg;
        }

        this.fnCallbackX = function(svcid, errCode, errMsg)
        {
        	this.Edit01.value = "";
        	trace("\nㅡㅡㅡㅡㅡㅡㅡㅡ" + svcid + " / " + errCode + " / " + errMsg + "ㅡㅡㅡㅡㅡㅡㅡㅡ\n");
        	this.Edit01.value = svcid + " / " + errCode + " / " + errMsg;
        }

        this.Button01_onclick = function(obj,e)
        {
        		this.transaction("JsonErrorTrJson_Sync"
        			   ,"http://172.10.12.45:9090/testA_json_error.jsp"
        			   ,"ds_input_param=ds_input_param"
        			   ,"ds_out=ds_input_param"
        			   ,""
        			   ,"fnCallbackJ"
        			   ,false);
        };

        });
        
        // Regist UI Components Event
        this.on_initEvent = function()
        {
            this.addEventHandler("onload",this.testSample_onload,this);
            this.Button00.addEventHandler("onclick",this.Button00_onclick,this);
            this.Button01.addEventHandler("onclick",this.Button01_onclick,this);
        };
        this.loadIncludeScript("stackTraceView.xfdl");
        this.loadPreloadList();
        
        // Remove Reference
        obj = null;
    };
}
)();
