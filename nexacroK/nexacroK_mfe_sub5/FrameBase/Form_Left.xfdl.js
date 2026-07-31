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
            this.set_name("Form_Left");
            this.set_titletext("Form_Left");
            if (nexacro.Form == this.constructor)
            {
                this._setFormPosition(170,670);
            }
            
            // Object(Dataset, ExcelExportObject) Initialize

            
            // UI Components Initialize
            obj = new nexacro.Static("Static00_00","40","18","120","32",null,null,null,null,null,null,this);
            obj.set_background("white");
            obj.set_taborder("0");
            obj.set_text("Form_Left.xfdl");
            this.addChild(obj.name, obj);

            obj = new nexacro.Button("Button00","10","92","146","58",null,null,null,null,null,null,this);
            obj.set_cssclass("btn_left");
            obj.set_taborder("1");
            obj.set_text("Button00");
            this.addChild(obj.name, obj);

            obj = new nexacro.Button("Button00_00","24","183","118","57",null,null,null,null,null,null,this);
            obj.set_cssclass("btn_left");
            obj.set_taborder("2");
            obj.set_text("Button01");
            this.addChild(obj.name, obj);

            obj = new nexacro.Button("Button00_00_00","14","290","130","77",null,null,null,null,null,null,this);
            obj.set_initvalueid("btn_left");
            obj.set_cssclass("btn_left");
            obj.set_taborder("3");
            obj.set_text("Button02");
            this.addChild(obj.name, obj);

            // Layout Functions
            //-- Default Layout : this
            obj = new nexacro.Layout("default","Desktop_screen",170,670,this,function(p){});
            this.addLayout(obj.name, obj);
            
            // BindItem Information

            
            // TriggerItem Information

        };
        
        this.loadPreloadList = function()
        {

        };
        
        // User Script
        this.registerScript("Form_Left.xfdl", function(nexacro, system, trace, environment, application) {

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

        this.loadIncludeScript("Form_Left.xfdl");
        this.loadPreloadList();
        
        // Remove Reference
        obj = null;
    };
    if (document.currentScript)
        document.currentScript.dispatchEvent(new CustomEvent("loadModule", { detail: fn }));

    return fn;
}
)();

//# sourceMappingURL=Form_Left.xfdl.js.map
