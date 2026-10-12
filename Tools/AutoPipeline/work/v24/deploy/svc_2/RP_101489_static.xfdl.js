(function()
{
    return function()
    {
        if (!this._is_form)
            return;
        
        var obj = null;
        
        this.on_create = function()
        {
            this.set_name("Form_Work");
            this.set_titletext("Form_Work");
            if (Form == this.constructor)
            {
                this._setFormPosition(1300,1090);
            }
            
            // Object(Dataset, ExcelExportObject) Initialize
            obj = new Dataset("ds_feedback", this);
            obj._setContents({"ColumnInfo" : {"Column" : [{"id" : "code","size" : "256","type" : "STRING"},{"id" : "name","size" : "256","type" : "STRING"}]}});
            this.addChild(obj.name, obj);
            
            // UI Components Initialize
            obj = new Button("Button00","401","194","279","72",null,null,null,null,null,null,this);
            obj.set_taborder("0");
            obj.set_text("static expr 확인");
            this.addChild(obj.name, obj);

            obj = new Static("Static00","71","160","279","140",null,null,null,null,null,null,this);
            obj.set_background("aqua");
            obj.set_expr("comp.parent.fn_LeftBottomMessage()");
            obj.set_taborder("1");
            this.addChild(obj.name, obj);

            obj = new TextArea("TextArea00","71","336","279","89",null,null,null,null,null,null,this);
            obj.set_taborder("2");
            this.addChild(obj.name, obj);

            // Layout Functions
            //-- Default Layout : this
            obj = new Layout("default","Desktop_screen",1300,1090,this,function(p){});
            this.addLayout(obj.name, obj);
            
            // BindItem Information

            
            // TriggerItem Information

        };
        
        this.loadPreloadList = function()
        {

        };
        
        // User Script
        this.registerScript("RP_101489_static.xfdl", function() {
        //교육 일정 하단 텍스트 출력 함수
        this.fn_LeftBottomMessage = function()
        {
        	trace("====");
        	return "테스트 expr셋팅";
        };

        this.Button00_onclick = function(obj,e)
        {
        	this.TextArea00.value = this.Static00.getDisplayText();
        };

        });
        
        // Regist UI Components Event
        this.on_initEvent = function()
        {
            this.addEventHandler("onload",this.Form_Work_onload,this);
            this.Button00.addEventHandler("onclick",this.Button00_onclick,this);
        };

        this.loadIncludeScript("RP_101489_static.xfdl");
        this.loadPreloadList();
        
        // Remove Reference
        obj = null;
    };
}
)();
