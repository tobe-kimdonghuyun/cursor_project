(function()
{
    return function()
    {
        if (!this._is_form)
            return;
        
        var obj = null;
        
        this.on_create = function()
        {
            this.set_name("forUrlCahnge");
            this.set_titletext("New Form");
            if (Form == this.constructor)
            {
                this._setFormPosition(1280,720);
            }
            
            // Object(Dataset, ExcelExportObject) Initialize

            
            // UI Components Initialize
            obj = new Div("Div01","10","75","200","150",null,null,null,null,null,null,this);
            obj.set_fittocontents("width");
            obj.set_taborder("0");
            obj.set_text("Div01");
            this.addChild(obj.name, obj);

            obj = new Panel("Panel00","10","60","330","316",null,null,null,null,null,null,this);
            obj.set_taborder("1");
            obj._setContents("<Contents><PanelItem componentid=\"Div01\" id=\"PanelItem00\"/></Contents>");
            this.addChild(obj.name, obj);

            obj = new Static("Static00","10","10","184","60",null,null,null,null,null,null,this);
            obj.set_taborder("2");
            obj.set_text("Panel [ Div(fittocontents : width) ]");
            this.addChild(obj.name, obj);

            // Layout Functions
            //-- Default Layout : this.Div01
            obj = new Layout("default","",0,0,this.Div01.form,function(p){});
            this.Div01.form.addLayout(obj.name, obj);

            //-- Default Layout : this
            obj = new Layout("default","",1280,720,this,function(p){});
            this.addLayout(obj.name, obj);
            
            // BindItem Information

            
            // TriggerItem Information

        };
        
        this.loadPreloadList = function()
        {

        };
        
        // User Script
        this.registerScript("RP_104585_Form_ChangeURL.xfdl", function() {
        // Panel 안에 fittocontents 가 설정된 div 가 있는 form
        });
        
        // Regist UI Components Event
        this.on_initEvent = function()
        {

        };

        this.loadIncludeScript("RP_104585_Form_ChangeURL.xfdl");
        this.loadPreloadList();
        
        // Remove Reference
        obj = null;
    };
}
)();
