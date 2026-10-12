(function()
{
    return function()
    {
        if (!this._is_form)
            return;
        
        var obj = null;
        
        this.on_create = function()
        {
            this.set_name("Form_Work");
            this.set_titletext("Form_Work");
            if (Form == this.constructor)
            {
                this._setFormPosition(1280,720);
            }
            
            // Object(Dataset, ExcelExportObject) Initialize

            
            // UI Components Initialize
            obj = new Div("Div00","0","86",null,"628","0",null,null,null,null,null,this);
            obj.set_taborder("0");
            obj.set_text("Div00");
            obj.set_url("svc_5::RP_104585/RP_104585_Form_Main.xfdl");
            this.addChild(obj.name, obj);

            obj = new Button("Button00_00","10","5","120","50",null,null,null,null,null,null,this);
            obj.set_taborder("1");
            obj.set_text("Main");
            this.addChild(obj.name, obj);

            obj = new Button("Button01","140","5","120","50",null,null,null,null,null,null,this);
            obj.set_taborder("2");
            obj.set_text("Change URL");
            this.addChild(obj.name, obj);

            // Layout Functions
            //-- Default Layout : this.Div00
            obj = new Layout("default","",0,0,this.Div00.form,function(p){});
            this.Div00.form.addLayout(obj.name, obj);

            //-- Default Layout : this
            obj = new Layout("default","Desktop_screen",1280,720,this,function(p){});
            this.addLayout(obj.name, obj);
            
            // BindItem Information

            
            // TriggerItem Information

        };
        
        this.loadPreloadList = function()
        {
            this._addPreloadList("fdl","svc_5::RP_104585/RP_104585_Form_Main.xfdl");
        };
        
        // User Script
        this.registerScript("RP_104585_Form_Cover.xfdl", function() {
        /*
         *	Div 에서 Panel 내 fittocontents 적용된 div가 포함된 form url로 화면 전환 후
         *  동적으로 생성된 div destroy 시  '_on_getFitSize' of null 에러 발생
         *
         *  - 재현 : Div url 변경 후 빈 Div 내부에 Div 3개 동적 생성 후 생성된 개수 만큼 삭제
         *  - 판정 : 에러 발생으로 destroy가 제대로 이뤄지지 않아 Div 내부 잔여 컴포넌트가 있다면 실패
         */


        this.Button00_00_onclick = function(obj,e)
        {
        	this.Div00.url = "svc_5::RP_104585/RP_104585_Form_Main.xfdl";
        };

        this.Button01_onclick = function(obj,e)
        {
        	this.Div00.url = "svc_5::RP_104585/RP_104585_Form_ChangeURL.xfdl";
        };

        });
        
        // Regist UI Components Event
        this.on_initEvent = function()
        {
            this.Button00_00.addEventHandler("onclick",this.Button00_00_onclick,this);
            this.Button01.addEventHandler("onclick",this.Button01_onclick,this);
        };

        this.loadIncludeScript("RP_104585_Form_Cover.xfdl");
        this.loadPreloadList();
        
        // Remove Reference
        obj = null;
    };
}
)();
