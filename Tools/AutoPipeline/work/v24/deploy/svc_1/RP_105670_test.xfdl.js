(function()
{
    return function()
    {
        if (!this._is_form)
            return;
        
        var obj = null;
        
        this.on_create = function()
        {
            this.set_name("test");
            this.set_titletext("New Form");
            if (Form == this.constructor)
            {
                this._setFormPosition(1280,720);
            }
            
            // Object(Dataset, ExcelExportObject) Initialize
            obj = new Dataset("dsSearchChk", this);
            obj.set_enableevent("true");
            obj.set_loadfiltermode("keep");
            obj.set_loadkeymode("keep");
            obj.set_reversesubsum("false");
            obj.set_updatecontrol("true");
            obj.set_useclientlayout("true");
            obj._setContents({"ColumnInfo" : {"Column" : [{"id" : "COMP_CD","size" : "256","type" : "STRING"},{"id" : "BRAND_CD","size" : "256","type" : "STRING"},{"id" : "JOIN_STRT","size" : "256","type" : "STRING"},{"id" : "JOIN_ENDT","size" : "256","type" : "STRING"},{"id" : "LAST_STRT","size" : "256","type" : "STRING"},{"id" : "LAST_ENDT","size" : "256","type" : "STRING"},{"id" : "BIRTH_GB","size" : "256","type" : "STRING"},{"id" : "BIRTH_STRT","size" : "256","type" : "STRING"},{"id" : "BIRTH_ENDT","size" : "256","type" : "STRING"},{"id" : "MILE_STR","size" : "256","type" : "STRING"},{"id" : "MILE_END","size" : "256","type" : "STRING"},{"id" : "SMILE_STR","size" : "256","type" : "STRING"},{"id" : "SMILE_END","size" : "256","type" : "STRING"},{"id" : "DMILE_STR","size" : "256","type" : "STRING"},{"id" : "DMILE_END","size" : "256","type" : "STRING"},{"id" : "PURC_GB","size" : "256","type" : "STRING"},{"id" : "PURC_STRT","size" : "256","type" : "STRING"},{"id" : "PURC_ENDT","size" : "256","type" : "STRING"},{"id" : "AMT_STRT","size" : "256","type" : "STRING"},{"id" : "AMT_ENDT","size" : "256","type" : "STRING"},{"id" : "CNT_STR","size" : "256","type" : "STRING"},{"id" : "CNT_END","size" : "256","type" : "STRING"},{"id" : "CUST_DGRE","size" : "256","type" : "STRING"},{"id" : "SHOP_CD","size" : "256","type" : "STRING"},{"id" : "JOIN_SHOP_CD","size" : "256","type" : "STRING"}]},"Rows" : [{"COMP_CD" : "","BRAND_CD" : "","JOIN_STRT" : "","JOIN_ENDT" : "","LAST_STRT" : "","LAST_ENDT" : "","BIRTH_GB" : "","BIRTH_STRT" : "","BIRTH_ENDT" : "","MILE_STR" : "","MILE_END" : "","SMILE_STR" : "","SMILE_END" : "","DMILE_STR" : "","DMILE_END" : "","PURC_GB" : "","PURC_STRT" : "","PURC_ENDT" : "","AMT_STRT" : "","AMT_ENDT" : "","CNT_STR" : "","CNT_END" : ""}]});
            this.addChild(obj.name, obj);
            
            // UI Components Initialize
            obj = new Div("calJoinFromTo","14.06%","115",null,"20","831",null,null,null,null,null,this);
            obj.set_initvalueid("ivDiv");
            obj.getSetter("chkdata").set("");
            obj.set_taborder("0");
            obj.set_text("");
            obj.getSetter("titletext").set("기본달력(FromTo)");
            obj.set_url("svc_1::RP_105670_comCalFT.xfdl");
            this.addChild(obj.name, obj);

            // Layout Functions
            //-- Default Layout : this.calJoinFromTo
            obj = new Layout("default","",0,0,this.calJoinFromTo.form,function(p){});
            this.calJoinFromTo.form.addLayout(obj.name, obj);

            //-- Default Layout : this
            obj = new Layout("default","",1280,720,this,function(p){});
            this.addLayout(obj.name, obj);
            
            // BindItem Information

            
            // TriggerItem Information

        };
        
        this.loadPreloadList = function()
        {
            this._addPreloadList("fdl","svc_1::RP_105670_comCalFT.xfdl");
        };
        
        // User Script
        this.registerScript("RP_105670_test.xfdl", function() {

        this.test_onload = function(obj,e)
        {
        	this.calJoinFromTo.form.fn_setDate(this.dsSearchChk,"JOIN_STRT","JOIN_ENDT");	//최초가입일
        	//this.divSrch.form.calLastFromTo.form.fn_setDate(this.dsSearchChk,"LAST_STRT","LAST_ENDT");	//최종구매일
        	this.dsSearchChk.set_enableevent(false);
        };

        });
        
        // Regist UI Components Event
        this.on_initEvent = function()
        {
            this.addEventHandler("onload",this.test_onload,this);
            this.dsSearchChk.addEventHandler("oncolumnchanged",this.dsSearchChk_oncolumnchanged,this);
        };

        this.loadIncludeScript("RP_105670_test.xfdl");
        this.loadPreloadList();
        
        // Remove Reference
        obj = null;
    };
}
)();
