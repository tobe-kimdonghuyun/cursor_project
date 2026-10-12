(function()
{
    return function()
    {
        if (!this._is_form)
            return;
        
        var obj = null;
        
        this.on_create = function()
        {
            this.set_name("RP_101440_Edit");
            this.set_titletext("New Form");
            if (Form == this.constructor)
            {
                this._setFormPosition(1280,720);
            }
            
            // Object(Dataset, ExcelExportObject) Initialize

            
            // UI Components Initialize
            obj = new Edit("Edit00","50","50","140","50",null,null,null,null,null,null,this);
            obj.set_taborder("0");
            this.addChild(obj.name, obj);

            obj = new WebView("WebView00","50","120","300","200",null,null,null,null,null,null,this);
            obj.set_border("1px solid black");
            obj.set_taborder("1");
            this.addChild(obj.name, obj);

            obj = new Edit("Edit01","200","50","140","50",null,null,null,null,null,null,this);
            obj.set_taborder("2");
            this.addChild(obj.name, obj);

            // Layout Functions
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
        this.registerScript("RP_101440_Edit.xfdl", function() {

        this.RP_101440_Edit_onload = function(obj,e)
        {
        	this.WebView00.url = nexacro.getProjectPath() + "etc_file/RP_101440.html"
        };


        this.Edit00_onkillfocus = function(obj,e)
        {
        	this.Edit01.value = "onkillfocus";
        };

        });
        
        // Regist UI Components Event
        this.on_initEvent = function()
        {
            this.addEventHandler("onload",this.RP_101440_Edit_onload,this);
            this.Edit00.addEventHandler("onkillfocus",this.Edit00_onkillfocus,this);
        };

        this.loadIncludeScript("RP_101440_Edit.xfdl");
        this.loadPreloadList();
        
        // Remove Reference
        obj = null;
    };
}
)();
