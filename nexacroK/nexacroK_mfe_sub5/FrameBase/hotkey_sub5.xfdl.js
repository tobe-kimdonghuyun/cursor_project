(function()
{
    const fn = function(nexacro, system, trace, environment, application)
    {
        if (!this._is_form)
            return;
        
        var obj = null;
        
        this.on_create = function()
        {
            this.set_name("hotkey_sub5");
            this.set_titletext("New Form");
            if (nexacro.Form == this.constructor)
            {
                this._setFormPosition(1280,720);
            }
            
            // Object(Dataset, ExcelExportObject) Initialize

            
            // UI Components Initialize
            obj = new nexacro.Static("Static00","51","53","399","57",null,null,null,null,null,null,this);
            obj.set_taborder("0");
            obj.set_text("CTRL+ALT+I");
            this.addChild(obj.name, obj);

            obj = new nexacro.Button("Button00","48","125","145","50",null,null,null,null,null,null,this);
            obj.set_hotkey("CTRL+ALT+I");
            obj.set_taborder("1");
            obj.set_text("Button00");
            this.addChild(obj.name, obj);

            obj = new nexacro.Edit("Edit00","231","120","264","59",null,null,null,null,null,null,this);
            obj.set_taborder("2");
            this.addChild(obj.name, obj);

            obj = new nexacro.CheckBox("CheckBox00","48","221","260","39",null,null,null,null,null,null,this);
            obj.set_hotkey("CTRL+ALT+J");
            obj.set_taborder("3");
            obj.set_text("CTRL+ALT+J");
            this.addChild(obj.name, obj);

            obj = new nexacro.Button("Button01","51","270","162","62",null,null,null,null,null,null,this);
            obj.set_taborder("4");
            obj.set_text("$.fn.jquery");
            this.addChild(obj.name, obj);

            // Layout Functions
            //-- Default Layout : this
            obj = new nexacro.Layout("default","",1280,720,this,function(p){});
            this.addLayout(obj.name, obj);
            
            // BindItem Information

            
            // TriggerItem Information

        };
        
        this.loadPreloadList = function()
        {

        };
        
        // User Script
        this.registerScript("hotkey_sub5.xfdl", function(nexacro, system, trace, environment, application) {

        this.CheckBox00_onclick = function(obj,e)
        {
        	this.Edit00.value = "";
        	this.Edit00.value = "CheckBox hotkey = "+obj.hotkey;
        };

        this.Button00_onclick = function(obj,e)
        {
        	this.Edit00.value = "";
        	this.Edit00.value = "Edit00 hotkey = "+obj.hotkey;
        };

        this.Button01_onclick = function(obj,e)
        {
        	this.Edit00.value = "";
        	this.Edit00.value ="$.fn.jquery ="+$.fn.jquery;
        };

        });
        
        // Regist UI Components Event
        this.on_initEvent = function()
        {
            this.Button00.addEventHandler("onclick",this.Button00_onclick,this);
            this.CheckBox00.addEventHandler("onclick",this.CheckBox00_onclick,this);
            this.Button01.addEventHandler("onclick",this.Button01_onclick,this);
        };

        this.loadIncludeScript("hotkey_sub5.xfdl");
        this.loadPreloadList();
        
        // Remove Reference
        obj = null;
    };
    if (document.currentScript)
        document.currentScript.dispatchEvent(new CustomEvent("loadModule", { detail: fn }));

    return fn;
}
)();

//# sourceMappingURL=hotkey_sub5.xfdl.js.map
