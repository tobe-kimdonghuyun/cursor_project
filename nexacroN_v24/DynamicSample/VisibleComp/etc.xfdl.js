(function()
{
    return function()
    {
        if (!this._is_form)
            return;
        
        var obj = null;
        
        this.on_create = function()
        {
            this.set_name("etc");
            this.set_titletext("New Form");
            if (Form == this.constructor)
            {
                this._setFormPosition(1280,720);
            }
            
            // Object(Dataset, ExcelExportObject) Initialize

            
            // UI Components Initialize
            obj = new Static("Static00","34","10","232","65",null,null,null,null,null,null,this);
            obj.set_taborder("0");
            obj.set_text("nexacro.open에서 initvalueid확인");
            this.addChild(obj.name, obj);

            obj = new Static("Static01","281","10","859","72",null,null,null,null,null,null,this);
            obj.set_taborder("1");
            obj.set_text("<initvalueid id=\"iv_Button0\" accessibilityenable=\"false\" defaultbutton=\"true\" background=\"red\" accessibilitylabel=\"initvalue세팅 00\" color=\"white\"/>\r\n    <initvalueid id=\"iv_Button1\" background=\"green\" accessibilityenable=\"true\" accessibilitylabel=\"initvalue세팅 01\" color=\"white\"/>");
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
        this.registerScript("etc.xfdl", function() {

        });
        
        // Regist UI Components Event
        this.on_initEvent = function()
        {
            this.addEventHandler("onload",this.etc_onload,this);
        };
        this.loadIncludeScript("etc.xfdl");
        this.loadPreloadList();
        
        // Remove Reference
        obj = null;
    };
}
)();
