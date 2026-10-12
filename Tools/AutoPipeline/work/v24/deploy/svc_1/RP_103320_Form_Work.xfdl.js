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
            obj = new Button("Button00","88","65","174","56",null,null,null,null,null,null,this);
            obj.set_taborder("0");
            obj.set_text("popup");
            this.addChild(obj.name, obj);

            obj = new Button("Button01","368","68","187","60",null,null,null,null,null,null,this);
            obj.set_taborder("1");
            obj.set_text("lookup");
            this.addChild(obj.name, obj);

            obj = new Edit("Edit00","80","163","470","74",null,null,null,null,null,null,this);
            obj.set_taborder("2");
            this.addChild(obj.name, obj);

            // Layout Functions
            //-- Default Layout : this
            obj = new Layout("default","Desktop_screen",1280,720,this,function(p){});
            this.addLayout(obj.name, obj);
            
            // BindItem Information

            
            // TriggerItem Information

        };
        
        this.loadPreloadList = function()
        {

        };
        
        // User Script
        this.registerScript("RP_103320_Form_Work.xfdl", function() {

        this.Button00_onclick = function(obj,e)
        {
        	this.fn_callback = function( strID, vArgu ) {  }  // CallBack Function

        	var objFrame = new ChildFrame();
        	var objParentFrame = this.getOwnerFrame();

        	objFrame.init( "modal00", 0, 0, 500, 500 );
        	objFrame.formurl = "svc_1::RP_103320_testPopup.xfdl";

        	var vRtn = objFrame.showModal( "modal00", objParentFrame, null, this, this.fn_callback );
        };

        this.Button01_onclick = function(obj,e)
        {
        	var obj = this.lookup("form");
        	this.Edit00.set_value("obj : "+obj+", obj.name="+obj.name+", obj.id=" +obj.id);
        	trace("obj.name="+obj.name);
        	trace("obj.id="+obj.id);
        };

        });
        
        // Regist UI Components Event
        this.on_initEvent = function()
        {
            this.Button00.addEventHandler("onclick",this.Button00_onclick,this);
            this.Button01.addEventHandler("onclick",this.Button01_onclick,this);
        };

        this.loadIncludeScript("RP_103320_Form_Work.xfdl");
        this.loadPreloadList();
        
        // Remove Reference
        obj = null;
    };
}
)();
