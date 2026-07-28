(function()
{
    const fn = function(nexacro, system, trace, environment, application)
    {
        if (!this._is_form)
            return;
        
        var obj = null;
        
        this.on_create = function()
        {
            this.set_background("#e8eaf6");
            this.set_name("Form_Left");
            this.set_titletext("Form_Left");
            if (nexacro.Form == this.constructor)
            {
                this._setFormPosition(170,670);
            }
            
            // Object(Dataset, ExcelExportObject) Initialize

            
            // UI Components Initialize
            obj = new nexacro.Static("Static00_00","10","18","150","32",null,null,null,null,null,null,this);
            obj.set_background("white");
            obj.set_taborder("0");
            obj.set_text("Form_Left.xfdl");
            this.addChild(obj.name, obj);

            obj = new nexacro.CheckBox("CheckBox00","10","90","150","20",null,null,null,null,null,null,this);
            obj.set_cssclass("chb_left");
            obj.set_taborder("1");
            obj.set_text("CheckBox00");
            this.addChild(obj.name, obj);

            obj = new nexacro.CheckBox("CheckBox01","10","140","150","20",null,null,null,null,null,null,this);
            obj.set_cssclass("chb_left");
            obj.set_taborder("2");
            obj.set_text("CheckBox01");
            this.addChild(obj.name, obj);

            obj = new nexacro.CheckBox("CheckBox02","10","190","150","20",null,null,null,null,null,null,this);
            obj.set_cssclass("chb_left");
            obj.set_taborder("3");
            obj.set_text("CheckBox02");
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

        this.Combo_onsetfocus = function(obj,e)
        {
        	trace(e.fromobject.parent._base_url+" :: "+e.fromobject.id);
        };

        this.CheckBox_onsetfocus = function(obj,e)
        {
        	trace(e.fromobject.parent._base_url+" :: "+e.fromobject.id);
        };

        });
        
        // Regist UI Components Event
        this.on_initEvent = function()
        {
            this.CheckBox00.addEventHandler("onsetfocus",this.CheckBox_onsetfocus,this);
            this.CheckBox01.addEventHandler("onsetfocus",this.CheckBox_onsetfocus,this);
            this.CheckBox02.addEventHandler("onsetfocus",this.CheckBox_onsetfocus,this);
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
