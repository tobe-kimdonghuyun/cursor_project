(function()
{
    return function()
    {
        if (!this._is_form)
            return;
        
        var obj = null;
        
        this.on_create = function()
        {
            this.set_name("HelpPage");
            this.set_titletext("New Form");
            if (Form == this.constructor)
            {
                this._setFormPosition(1280,720);
            }
            
            // Object(Dataset, ExcelExportObject) Initialize

            
            // UI Components Initialize
            obj = new Static("Static00","20","20","883","451",null,null,null,null,null,null,this);
            obj.set_taborder("0");
            obj.set_text("\r\n1. form을 수동으로 해당 prefix폴더에 위치 시키고 appliaction의 Dataset에서 ads_menudata에 추가된 form정보를 등록한다 \r\n2. MainPage의 상단 combo의 item을 변경하면 div에 화면이 호출됨\r\n3. RP_번호.xfdl형태로 샘플을 작성한다 ");
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

        
        // Regist UI Components Event
        this.on_initEvent = function()
        {

        };

        this.loadIncludeScript("HelpPage.xfdl");
        this.loadPreloadList();
        
        // Remove Reference
        obj = null;
    };
}
)();
