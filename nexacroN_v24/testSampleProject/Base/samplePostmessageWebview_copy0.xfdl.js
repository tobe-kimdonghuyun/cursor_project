(function()
{
    return function()
    {
        if (!this._is_form)
            return;
        
        var obj = null;
        
        this.on_create = function()
        {
            this.set_name("samplePostmessageWebview");
            this.set_titletext("화면 연결");
            if (Form == this.constructor)
            {
                this._setFormPosition(904,840);
            }
            
            // Object(Dataset, ExcelExportObject) Initialize
            obj = new Dataset("ds00", this);
            obj._setContents({"ColumnInfo" : {"Column" : [ {"id" : "testds","type" : "STRING","size" : "256"}]},"Rows" : [{"testds" : "ABCDE"}]});
            this.addChild(obj.name, obj);
            
            // UI Components Initialize
            obj = new WebView("wbvSample","20","55","580",null,null,"230",null,null,null,null,this);
            obj.set_taborder("0");
            this.addChild(obj.name, obj);

            obj = new Static("staTitle",null,"9","139","36","249",null,null,null,null,null,this);
            obj.set_taborder("1");
            obj.set_text("html에서 넘겨받은 내용");
            obj.set_cssclass("sta_WF_Title");
            this.addChild(obj.name, obj);

            obj = new TextArea("txaRtn","610","60",null,null,"94","450",null,null,null,null,this);
            obj.set_taborder("2");
            obj.set_background("red");
            this.addChild(obj.name, obj);

            obj = new Button("btnCallHtml",null,"11","148","28","100",null,null,null,null,null,this);
            obj.set_taborder("3");
            obj.set_text("HTML로 데이터셋 전송");
            obj.set_fittocontents("width");
            this.addChild(obj.name, obj);

            obj = new Static("staTitle00","0","0",null,"43","680",null,null,null,null,null,this);
            obj.set_taborder("4");
            obj.set_text("웹뷰");
            obj.set_cssclass("sta_WF_Title");
            this.addChild(obj.name, obj);
            // Layout Functions
            //-- Default Layout : this
            obj = new Layout("default","",904,840,this,function(p){});
            this.addLayout(obj.name, obj);
            
            // BindItem Information

            
            // TriggerItem Information

        };
        
        this.loadPreloadList = function()
        {

        };
        
        // User Script
        this.registerScript("samplePostmessageWebview_copy0.xfdl", function() {
        this.sPageUrl = "http://172.10.12.45:7070/RP_105464_postMsgTobeTechSample.html";

        //this.sTargetOrigin = "http://172.10.11.74:8080";
        this.sTargetOrigin = "*";

        this.form_onload = function(obj, e)
        {
        	this.wbvSample.set_url(this.sPageUrl);
        };

        this.wbvSample_onloadcompleted = function(obj, e)
        {
        	trace("====================wbvSample_onloadcompleted====================");
        };

        this.wbvSample_onmessage  = function(obj, e)
        {
        	trace("====================|wbvSample_onmessage | origin: " + e.origin + " | data: " + e.data + "|====================");
        	alert("wbvSample_onmessage");
        	if(e.data.indexOf("toValue:") > -1){
        		let sValue = this.txaRtn.value;
        		if(this.fnIsNull(sValue)) sValue = "";

        		let sRtnValue = e.data.replace("toValue:", "");
        		if(this.fnIsNull(sRtnValue)) return;

        		this.txaRtn.set_value(sValue + sRtnValue + "\n");
        	}
        };

        this.btnCallHtml_onclick = function(obj, e)
        {
            let sData = this.ds00.saveXML();
            let bRtn = this.wbvSample.postMessage("[Nexacro -> HTML]" + sData, this.sTargetOrigin);
        	trace("btnCallHtml_onclick | postMessage result: " + bRtn);
        };

        this.fnIsNull = function(sValue)
        {
            if (new String(sValue).valueOf() == "undefined") return true;
            if (sValue == null) return true;

            var ChkStr = new String(sValue);

            if (ChkStr == null) return true;
            if (ChkStr.toString().length == 0 ) return true;
            return false;
        };


        });
        
        // Regist UI Components Event
        this.on_initEvent = function()
        {
            this.addEventHandler("onload",this.form_onload,this);
            this.wbvSample.addEventHandler("onloadcompleted",this.wbvSample_onloadcompleted,this);
            this.wbvSample.addEventHandler("onmessage",this.wbvSample_onloadcompleted,this);
            this.btnCallHtml.addEventHandler("onclick",this.btnCallHtml_onclick,this);
        };
        this.loadIncludeScript("samplePostmessageWebview_copy0.xfdl");
        this.loadPreloadList();
        
        // Remove Reference
        obj = null;
    };
}
)();
