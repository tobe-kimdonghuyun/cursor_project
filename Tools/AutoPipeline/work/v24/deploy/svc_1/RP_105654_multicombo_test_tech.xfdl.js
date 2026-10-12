(function()
{
    return function()
    {
        if (!this._is_form)
            return;
        
        var obj = null;
        
        this.on_create = function()
        {
            this.set_name("multicombo_test_tech");
            this.set_titletext("MultiCombo 빈 code 테스트");
            if (Form == this.constructor)
            {
                this._setFormPosition(1280,720);
            }
            
            // Object(Dataset, ExcelExportObject) Initialize
            obj = new Dataset("Dataset00", this);
            obj._setContents({"ColumnInfo" : {"Column" : [{"id" : "code","size" : "256","type" : "STRING"},{"id" : "data","size" : "256","type" : "STRING"}]},"Rows" : [{"code" : "","data" : "전체"},{"code" : "1","data" : "aa"},{"code" : "2","data" : "bb"},{"code" : "3","data" : "cc"},{"code" : "4","data" : "dd"}]});
            this.addChild(obj.name, obj);


            obj = new Dataset("Dataset01", this);
            obj._setContents({"ColumnInfo" : {"Column" : [{"id" : "Column0","size" : "256","type" : "STRING"}]},"Rows" : [{}]});
            this.addChild(obj.name, obj);
            
            // UI Components Initialize
            obj = new MultiCombo("MultiCombo00","201","145","200","50",null,null,null,null,null,null,this);
            obj.set_border("1px solid black");
            obj.set_codecolumn("code");
            obj.set_datacolumn("data");
            obj.set_innerdataset("Dataset00");
            obj.set_showselectallcheckbox("false");
            obj.set_taborder("0");
            obj.set_type("caseifilterlike");
            obj.set_text("");
            obj.set_index("-1");
            this.addChild(obj.name, obj);

            obj = new Edit("Edit00","210","220","300","40",null,null,null,null,null,null,this);
            obj.set_border("1px solid black");
            obj.set_readonly("true");
            obj.set_taborder("1");
            this.addChild(obj.name, obj);

            obj = new Static("Static00","201","270","400","30",null,null,null,null,null,null,this);
            obj.set_taborder("2");
            obj.set_text("MultiCombo value 바인딩 확인");
            this.addChild(obj.name, obj);

            obj = new Edit("Edit01","212","313","298","44",null,null,null,null,null,null,this);
            obj.set_taborder("3");
            this.addChild(obj.name, obj);

            obj = new Button("Button00","450","133","199","65",null,null,null,null,null,null,this);
            obj.set_taborder("4");
            obj.set_text("동작확인");
            this.addChild(obj.name, obj);

            // Layout Functions
            //-- Default Layout : this
            obj = new Layout("default","",1280,720,this,function(p){});
            this.addLayout(obj.name, obj);
            
            // BindItem Information
            obj = new BindItem("item0","MultiCombo00","value","Dataset01","Column0");
            this.addChild(obj.name, obj);
            obj.bind();

            obj = new BindItem("item1","Edit00","value","Dataset01","Column0");
            this.addChild(obj.name, obj);
            obj.bind();
            
            // TriggerItem Information

        };
        
        this.loadPreloadList = function()
        {

        };
        
        // User Script
        this.registerScript("RP_105654_multicombo_test_tech.xfdl", function() {

        this.MultiCombo00_onitemchanged = function(obj,e)
        {
        	//nexacro._OnceCallbackTimer.callonce(this, function(){
        	var selectVal = e.newvalue;

            var timestamp = new Date().getTime();

            var sUrl = "etc_file::RP_105654.do"
                     + "?comboVal=" + encodeURIComponent(selectVal)
                     + "&_rs_=" + timestamp;

            this.transaction(
                "MyService01",
                sUrl,
                "",
                "Dataset03=output1",
                "a=b",
                "callbackFunction",
                true
            );
        	//},1000);

        };

        this.callbackFunction = function()
        {
            trace("=========================");
        };


        this.MultiCombo00_ondropdown = function(obj,e)
        {
        	this.Edit01.set_value("MultiCombo00_ondropdown");
        };

        this.MultiCombo00_oncloseup = function(obj,e)
        {
        	this.Edit01.set_value("MultiCombo00_oncloseup");
        };

        this.Button00_onclick = function(obj,e)
        {
        	this.Edit01.set_value("화면 lock 동작 확인 버튼");
        };

        });
        
        // Regist UI Components Event
        this.on_initEvent = function()
        {
            this.MultiCombo00.addEventHandler("oncloseup",this.MultiCombo00_oncloseup,this);
            this.MultiCombo00.addEventHandler("ondropdown",this.MultiCombo00_ondropdown,this);
            this.MultiCombo00.addEventHandler("onitemchanged",this.MultiCombo00_onitemchanged,this);
            this.Button00.addEventHandler("onclick",this.Button00_onclick,this);
        };

        this.loadIncludeScript("RP_105654_multicombo_test_tech.xfdl");
        this.loadPreloadList();
        
        // Remove Reference
        obj = null;
    };
}
)();
