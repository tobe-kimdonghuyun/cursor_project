(function()
{
    const fn = function(nexacro, system, trace, environment, application)
    {
        if (!this._is_form)
            return;
        
        var obj = null;
        
        this.on_create = function()
        {
            this.set_background("gray");
            this.set_name("Form_Work");
            this.set_titletext("Form_Work");
            if (nexacro.Form == this.constructor)
            {
                this._setFormPosition(430,670);
            }
            
            // Object(Dataset, ExcelExportObject) Initialize

            
            // UI Components Initialize
            obj = new nexacro.Static("Static00_00","40","18","120","32",null,null,null,null,null,null,this);
            obj.set_background("white");
            obj.set_taborder("0");
            obj.set_text("Form_Work.xfdl");
            this.addChild(obj.name, obj);

            obj = new nexacro.Button("Button00","10","90","146","58",null,null,null,null,null,null,this);
            obj.set_cssclass("btn_work");
            obj.set_taborder("1");
            obj.set_text("Button00");
            this.addChild(obj.name, obj);

            obj = new nexacro.Button("Button01","166","90","118","57",null,null,null,null,null,null,this);
            obj.set_cssclass("btn_work");
            obj.set_taborder("2");
            obj.set_text("Button01");
            this.addChild(obj.name, obj);

            obj = new nexacro.Button("Button02","294","80","132","77",null,null,null,null,null,null,this);
            obj.set_cssclass("btn_work");
            obj.set_taborder("3");
            obj.set_text("Button02");
            this.addChild(obj.name, obj);

            // Layout Functions
            //-- Default Layout : this
            obj = new nexacro.Layout("default","Desktop_screen",430,670,this,function(p){});
            this.addLayout(obj.name, obj);
            
            // BindItem Information

            
            // TriggerItem Information

        };
        
        this.loadPreloadList = function()
        {

        };
        
        // User Script
        this.registerScript("Form_Work.xfdl", function(nexacro, system, trace, environment, application) {

        this.Button_onsetfocus = function(obj,e)
        {
        	trace(e.fromobject.parent._base_url+" :: "+e.fromobject.id);
        };

        });
        
        // Regist UI Components Event
        this.on_initEvent = function()
        {
            this.Button00.addEventHandler("onsetfocus",this.Button_onsetfocus,this);
            this.Button01.addEventHandler("onsetfocus",this.Button_onsetfocus,this);
            this.Button02.addEventHandler("onsetfocus",this.Button_onsetfocus,this);
        };

        this.loadIncludeScript("Form_Work.xfdl");
        this.loadPreloadList();
        
        // Remove Reference
        obj = null;
    };
    if (document.currentScript)
        document.currentScript.dispatchEvent(new CustomEvent("loadModule", { detail: fn }));

    return fn;
}
)();

//# sourceMappingURL=Form_Work.xfdl.js.map
