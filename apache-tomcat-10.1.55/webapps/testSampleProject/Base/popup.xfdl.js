(function()
{
    return function()
    {
        if (!this._is_form)
            return;
        
        var obj = null;
        
        this.on_create = function()
        {
            this.set_name("popup");
            this.set_titletext("New Form");
            if (Form == this.constructor)
            {
                this._setFormPosition(1280,720);
            }
            
            // Object(Dataset, ExcelExportObject) Initialize

            
            // UI Components Initialize
            obj = new Button("Button00","36","40","124","34",null,null,null,null,null,null,this);
            obj.set_taborder("0");
            obj.set_text("쇼모달");
            obj.set_background("red");
            this.addChild(obj.name, obj);

            obj = new Button("Button02","326","40","128","34",null,null,null,null,null,null,this);
            obj.set_taborder("1");
            obj.set_text("쇼모달싱크");
            obj.set_background("pink");
            this.addChild(obj.name, obj);

            obj = new Button("Button03","180","42","124","31",null,null,null,null,null,null,this);
            obj.set_taborder("2");
            obj.set_text("쇼모달윈도우");
            obj.set_background("yellow");
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
        this.registerScript("popup.xfdl", function() {

        this.Button00_onclick = function(obj,e)
        {

        	var objFrame = new ChildFrame();
        	var objParentFrame = this.getOwnerFrame();

        	objFrame.init( "modal00", 0, 0, 500, 500 );
        	objFrame.formurl = "Base::popWork.xfdl";
        	objFrame.visible = false;
        	objFrame.autosize = false;

        	var vRtn = objFrame.showModal( objParentFrame, {a:'aaa', b:'bbb'}, this, this.fn_callback );

        };

        this.fn_callback =  function(obj, e){}

        this.Button03_onclick = function(obj,e)
        {
        	var objCFrame = new ChildFrame();

        	objCFrame.init( "moda00", 0, 0, 500, 500 );
        	objCFrame.formurl = "Base::popWork.xfdl";
        	objCFrame.visible = false;
        	objCFrame.autosize = false;
        	var ret = system.showModalWindow( objCFrame, "modal00", this.getOwnerFrame(), "", this );
        };

        this.Button02_onclick = function(obj,e)
        {
        	var objFrame = new ChildFrame();
        	var objParentFrame = this.getOwnerFrame();

        	objFrame.init( "modalsync00", 0, 0, 500, 500 );
        	objFrame.visible = false;
        	objFrame.autosize = false;
        	objFrame.formurl = "Base::popWork.xfdl";
        	system.showModalSync( objFrame, objParentFrame, {a:'aaa', b:'bbb'}, this );
        };

        });
        
        // Regist UI Components Event
        this.on_initEvent = function()
        {
            this.Button00.addEventHandler("onclick",this.Button00_onclick,this);
            this.Button02.addEventHandler("onclick",this.Button02_onclick,this);
            this.Button03.addEventHandler("onclick",this.Button03_onclick,this);
        };
        this.loadIncludeScript("popup.xfdl");
        this.loadPreloadList();
        
        // Remove Reference
        obj = null;
    };
}
)();
