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
                this._setFormPosition(530,720);
            }
            
            // Object(Dataset, ExcelExportObject) Initialize

            
            // UI Components Initialize
            obj = new Div("Div00","0","0",null,null,"0","0",null,null,null,null,this);
            obj.set_taborder("0");
            this.addChild(obj.name, obj);

            obj = new Button("Button00","177","150","93","64",null,null,null,null,null,null,this.Div00.form);
            obj.set_taborder("0");
            obj.set_text("2메뉴");
            this.Div00.addChild(obj.name, obj);

            obj = new Button("Button01","293","149","165","65",null,null,null,null,null,null,this.Div00.form);
            obj.set_taborder("1");
            obj.set_text("form onload 이벤트 확인");
            this.Div00.addChild(obj.name, obj);

            obj = new TextArea("TextArea00","45","262","428","227",null,null,null,null,null,null,this.Div00.form);
            obj.set_taborder("2");
            this.Div00.addChild(obj.name, obj);

            // Layout Functions
            //-- Default Layout : this.Div00.form
            obj = new Layout("default","",0,0,this.Div00.form,function(p){});
            this.Div00.form.addLayout(obj.name, obj);

            //-- Default Layout : this
            obj = new Layout("default","Desktop_screen",530,720,this,function(p){});
            this.addLayout(obj.name, obj);
            
            // BindItem Information

            
            // TriggerItem Information

        };
        
        this.loadPreloadList = function()
        {

        };
        
        // User Script
        this.registerScript("RP_101874_3.xfdl", function() {
        // ※ 스크립트 상단에 this.cnt = 0; 같은 선언을 두지 않음

        this.Form_Work_onload = function(obj, e)
        {
            // 스크립트가 다시 실행되어도 초기화되지 않도록 여기서만 초기화
            this._onloadCnt = (this._onloadCnt || 0) + 1;

            trace("Form_Work onload 발생 : " + this._onloadCnt);
        	//alert("Form_Work_onload");
        };

        // [form onload 이벤트 확인] 버튼
        this.Div00_Button01_onclick = function(obj, e)
        {
           this.Div00.form.TextArea00.value="form onload 이벤트 발생 횟수 : " + (this._onloadCnt || 0);
        };
        });
        
        // Regist UI Components Event
        this.on_initEvent = function()
        {
            this.addEventHandler("onclose",this.Form_Work_onclose,this);
            this.addEventHandler("onload",this.Form_Work_onload,this);
            this.Div00.form.Button00.addEventHandler("onclick",this.Div00_Button00_onclick,this);
            this.Div00.form.Button01.addEventHandler("onclick",this.Div00_Button01_onclick,this);
        };

        this.loadIncludeScript("RP_101874_3.xfdl");
        this.loadPreloadList();
        
        // Remove Reference
        obj = null;
    };
}
)();
