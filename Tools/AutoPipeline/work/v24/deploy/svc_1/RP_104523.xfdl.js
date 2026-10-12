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
                this._setFormPosition(1280,720);
            }
            
            // Object(Dataset, ExcelExportObject) Initialize

            
            // UI Components Initialize
            obj = new Div("Div00","0","86",null,"628","0",null,null,null,null,null,this);
            obj.set_taborder("0");
            obj.set_text("Div00");
            this.addChild(obj.name, obj);

            obj = new Button("Button00","160","5","120","50",null,null,null,null,null,null,this);
            obj.set_taborder("1");
            obj.set_text("main");
            this.addChild(obj.name, obj);

            obj = new Button("Button00_00","10","5","120","50",null,null,null,null,null,null,this);
            obj.set_taborder("2");
            obj.set_text("list");
            this.addChild(obj.name, obj);

            // Layout Functions
            //-- Default Layout : this.Div00
            obj = new Layout("default","",0,0,this.Div00.form,function(p){});
            this.Div00.form.addLayout(obj.name, obj);

            //-- Default Layout : this
            obj = new Layout("default","Desktop_screen",1280,720,this,function(p){});
            this.addLayout(obj.name, obj);
            
            // BindItem Information

            
            // TriggerItem Information

        };
        
        this.loadPreloadList = function()
        {

        };
        
        // User Script
        this.registerScript("RP_104523.xfdl", function() {

        this.Button00_onclick = function(obj,e)
        {
        	this.Div00.url = "svc_1::RP_104523_2.xfdl";
        };

        this.Button00_00_onclick = function(obj,e)
        {
        	this.Div00.url = "svc_1::RP_104523_1.xfdl";
        };

        });
        
        // Regist UI Components Event
        this.on_initEvent = function()
        {
            this.Button00.addEventHandler("onclick",this.Button00_onclick,this);
            this.Button00_00.addEventHandler("onclick",this.Button00_00_onclick,this);
        };

        this.loadIncludeScript("RP_104523.xfdl");
        this.loadPreloadList();
        
        // Remove Reference
        obj = null;
    };
}
)();
