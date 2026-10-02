(function()
{
    return function()
    {
        if (!this._is_form)
            return;
        
        var obj = null;
        
        this.on_create = function()
        {
            this.set_name("MainPage");
            this.set_titletext("New Form");
            if (Form == this.constructor)
            {
                this._setFormPosition(1280,720);
            }
            
            // Object(Dataset, ExcelExportObject) Initialize

            
            // UI Components Initialize
            obj = new Combo("Combo00","10","24",null,"53","10",null,null,null,null,null,this);
            obj.set_autoselect("true");
            obj.set_codecolumn("menuname");
            obj.set_datacolumn("menuname");
            obj.set_displaynulltext("RP 번호 입력");
            obj.set_innerdataset("ads_menudata");
            obj.set_taborder("1");
            obj.set_type("caseifilterlike");
            this.addChild(obj.name, obj);

            obj = new Div("Div00","12","95",null,null,"10","10",null,null,null,null,this);
            obj.set_border("1px solid #d5d5d5");
            obj.set_taborder("0");
            obj.set_text("Div00");
            obj.set_url("Base::HelpPage.xfdl");
            this.addChild(obj.name, obj);

            obj = new Button("outbutton","0","0","100","20",null,null,null,null,null,null,this);
            obj.set_taborder("2");
            obj.set_text("outbutton");
            this.addChild(obj.name, obj);

            // Layout Functions
            //-- Default Layout : this.Div00
            obj = new Layout("default","",0,0,this.Div00.form,function(p){});
            this.Div00.form.addLayout(obj.name, obj);

            //-- Default Layout : this
            obj = new Layout("default","",1280,720,this,function(p){});
            this.addLayout(obj.name, obj);
            
            // BindItem Information

            
            // TriggerItem Information

        };
        
        this.loadPreloadList = function()
        {
            this._addPreloadList("fdl","Base::HelpPage.xfdl");
        };
        
        // User Script
        this.registerScript("MainPage.xfdl", function() {

        this.Combo00_onitemchanged = function(obj,e)
        {
        	this.Div00.set_url(e.posttext);
        };



        });
        
        // Regist UI Components Event
        this.on_initEvent = function()
        {
            this.Combo00.addEventHandler("onitemchanged",this.Combo00_onitemchanged,this);
        };

        this.loadIncludeScript("MainPage.xfdl");
        this.loadPreloadList();
        
        // Remove Reference
        obj = null;
    };
}
)();
