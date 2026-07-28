(function()
{
    const fn = function(nexacro, system, trace, environment, application)
    {
        if (!this._is_form)
            return;
        
        var obj = null;
        
        this.on_create = function()
        {
            this.set_background("#ecf0f3");
            this.set_name("Form_Work");
            this.set_titletext("Form_Work");
            if (nexacro.Form == this.constructor)
            {
                this._setFormPosition(430,670);
            }
            
            // Object(Dataset, ExcelExportObject) Initialize

            
            // UI Components Initialize
            obj = new nexacro.Static("Static00_00","40","18","150","32",null,null,null,null,null,null,this);
            obj.set_background("white");
            obj.set_taborder("0");
            obj.set_text("Form_Work.xfdl");
            this.addChild(obj.name, obj);

            obj = new nexacro.CheckBox("CheckBox00","30","110","120","20",null,null,null,null,null,null,this);
            obj.set_cssclass("chb_work");
            obj.set_taborder("1");
            obj.set_text("CheckBox00");
            this.addChild(obj.name, obj);

            obj = new nexacro.CheckBox("CheckBox01","160","110","120","20",null,null,null,null,null,null,this);
            obj.set_cssclass("chb_work");
            obj.set_taborder("2");
            obj.set_text("CheckBox01");
            this.addChild(obj.name, obj);

            obj = new nexacro.CheckBox("CheckBox02","290","110","120","20",null,null,null,null,null,null,this);
            obj.set_cssclass("chb_work");
            obj.set_taborder("3");
            obj.set_text("CheckBox02");
            this.addChild(obj.name, obj);

            obj = new nexacro.Button("Button00","275","160","131","53",null,null,null,null,null,null,this);
            obj.set_taborder("4");
            obj.set_text("클릭테스트");
            this.addChild(obj.name, obj);

            obj = new nexacro.TextArea("TextArea00","40","156","225","61",null,null,null,null,null,null,this);
            obj.set_taborder("5");
            this.addChild(obj.name, obj);

            obj = new nexacro.Button("Button01","46","226","268","74",null,null,null,null,null,null,this);
            obj.set_taborder("6");
            obj.set_text("Button01");
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

        this.Combo_onsetfocus = function(obj,e)
        {
        	trace(e.fromobject.parent._base_url+" :: "+e.fromobject.id);
        };

        this.CheckBox_onsetfocus = function(obj,e)
        {
        	trace(e.fromobject.parent._base_url+" :: "+e.fromobject.id);
        };

        this.customFunction = function()
        {
        	this.TextArea00.deleteText();
        	this.TextArea00.insertText("customFunction 실행");
        	alert("customFunction 실행");
        }

        this.Button00_onclick = function(obj,e)
        {
        	this.TextArea00.deleteText();
        	this.TextArea00.insertText("클릭테스트");

        };

        this.Button01_onclick = function(obj,e)
        {
        	trace(this.parent);
        	trace(this.parent.parent);
        };

        });
        
        // Regist UI Components Event
        this.on_initEvent = function()
        {
            this.CheckBox00.addEventHandler("onsetfocus",this.CheckBox_onsetfocus,this);
            this.CheckBox01.addEventHandler("onsetfocus",this.CheckBox_onsetfocus,this);
            this.CheckBox02.addEventHandler("onsetfocus",this.CheckBox_onsetfocus,this);
            this.Button00.addEventHandler("onclick",this.Button00_onclick,this);
            this.Button01.addEventHandler("onclick",this.Button01_onclick,this);
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
