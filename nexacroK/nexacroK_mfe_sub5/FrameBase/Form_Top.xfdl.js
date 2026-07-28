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
            this.set_name("Form_Top");
            this.set_titletext("Form_Top");
            if (nexacro.Form == this.constructor)
            {
                this._setFormPosition(600,50);
            }
            
            // Object(Dataset, ExcelExportObject) Initialize

            
            // UI Components Initialize
            obj = new nexacro.Static("Static00","10","8","120","32",null,null,null,null,null,null,this);
            obj.set_background("white");
            obj.set_taborder("0");
            obj.set_text("nexacroK_mfe_sub5");
            this.addChild(obj.name, obj);

            obj = new nexacro.Static("Static00_00","140","10","80","32",null,null,null,null,null,null,this);
            obj.set_background("white");
            obj.set_taborder("1");
            obj.set_text("Form_Top.xfdl");
            this.addChild(obj.name, obj);

            obj = new nexacro.Button("Button00","230","8","80","32",null,null,null,null,null,null,this);
            obj.set_cssclass("btn_top");
            obj.set_taborder("2");
            obj.set_text("Button00");
            this.addChild(obj.name, obj);

            obj = new nexacro.Button("Button00_00","320","7","80","32",null,null,null,null,null,null,this);
            obj.set_cssclass("btn_top");
            obj.set_taborder("3");
            obj.set_text("Button01");
            this.addChild(obj.name, obj);

            obj = new nexacro.Button("Button00_00_00","430","7","80","32",null,null,null,null,null,null,this);
            obj.set_initvalueid("btn_top");
            obj.set_cssclass("btn_top");
            obj.set_taborder("4");
            obj.set_text("Button02");
            this.addChild(obj.name, obj);

            // Layout Functions
            //-- Default Layout : this
            obj = new nexacro.Layout("default","Desktop_screen",600,50,this,function(p){});
            this.addLayout(obj.name, obj);
            
            // BindItem Information

            
            // TriggerItem Information

        };
        
        this.loadPreloadList = function()
        {

        };
        
        // User Script
        this.registerScript("Form_Top.xfdl", function(nexacro, system, trace, environment, application) {

        this.Button_onsetfocus = function(obj,e)
        {
        	trace(e.fromobject.parent._base_url+" :: "+e.fromobject.id);
        };

        });
        
        // Regist UI Components Event
        this.on_initEvent = function()
        {
            this.Button00.addEventHandler("onsetfocus",this.Button_onsetfocus,this);
            this.Button00_00.addEventHandler("onsetfocus",this.Button_onsetfocus,this);
            this.Button00_00_00.addEventHandler("onsetfocus",this.Button_onsetfocus,this);
        };

        this.loadIncludeScript("Form_Top.xfdl");
        this.loadPreloadList();
        
        // Remove Reference
        obj = null;
    };
    if (document.currentScript)
        document.currentScript.dispatchEvent(new CustomEvent("loadModule", { detail: fn }));

    return fn;
}
)();

//# sourceMappingURL=Form_Top.xfdl.js.map
