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
            obj = new Div("Div00","0","1","528","111",null,null,null,null,null,null,this);
            obj.set_taborder("0");
            obj.set_text("Div00");
            this.addChild(obj.name, obj);

            obj = new Button("Button00","25","17","183","63",null,null,null,null,null,null,this.Div00.form);
            obj.set_taborder("0");
            obj.set_text("돌아가기");
            this.Div00.addChild(obj.name, obj);

            obj = new Div("divwork","2","116","526","600",null,null,null,null,null,null,this);
            obj.set_taborder("1");
            obj.set_text("");
            obj.set_url("svc_1::RP_101874_2.xfdl");
            this.addChild(obj.name, obj);

            // Layout Functions
            //-- Default Layout : this.Div00.form
            obj = new Layout("default","",0,0,this.Div00.form,function(p){});
            this.Div00.form.addLayout(obj.name, obj);

            //-- Default Layout : this.divwork
            obj = new Layout("default","",0,0,this.divwork.form,function(p){});
            this.divwork.form.addLayout(obj.name, obj);

            //-- Default Layout : this
            obj = new Layout("default","Desktop_screen",530,720,this,function(p){});
            this.addLayout(obj.name, obj);
            
            // BindItem Information

            
            // TriggerItem Information

        };
        
        this.loadPreloadList = function()
        {
            this._addPreloadList("fdl","svc_1::RP_101874_2.xfdl");
        };
        
        // User Script
        this.registerScript("RP_101874_1.xfdl", function() {

        this.Div00_Button00_onclick = function(obj,e)
        {
        	this.divwork.url = "svc_1::RP_101874_2.xfdl";
        };

        });
        
        // Regist UI Components Event
        this.on_initEvent = function()
        {
            this.Div00.form.Button00.addEventHandler("onclick",this.Div00_Button00_onclick,this);
        };

        this.loadIncludeScript("RP_101874_1.xfdl");
        this.loadPreloadList();
        
        // Remove Reference
        obj = null;
    };
}
)();
