(function()
{
    return function()
    {
        if (!this._is_form)
            return;
        
        var obj = null;
        
        this.on_create = function()
        {
            this.set_name("RP_105862");
            this.set_titletext("DateRangeCalendar Out of Min Max Range");
            if (Form == this.constructor)
            {
                this._setFormPosition(1280,720);
            }
            
            // Object(Dataset, ExcelExportObject) Initialize
            obj = new Dataset("ds_invaild", this);
            obj._setContents({"ColumnInfo" : {"Column" : [{"id" : "startdate","size" : "256","type" : "STRING"},{"id" : "enddate","size" : "256","type" : "STRING"}]},"Rows" : [{"startdate" : "20260922","enddate" : "20260714"}]});
            this.addChild(obj.name, obj);


            obj = new Dataset("ds_dynamic", this);
            obj._setContents({"ColumnInfo" : {"Column" : [{"id" : "startdate","size" : "256","type" : "STRING"},{"id" : "enddate","size" : "256","type" : "STRING"}]},"Rows" : [{}]});
            this.addChild(obj.name, obj);
            
            // UI Components Initialize
            obj = new DateRangeCalendar("drc_105862_Static_Prop","10","10","600","70",null,null,null,null,null,null,this);
            obj.set_enddate("20260922");
            obj.set_maxdate("20250102");
            obj.set_mindate("20250101");
            obj.set_startdate("20260714");
            obj.set_taborder("0");
            this.addChild(obj.name, obj);

            obj = new TextArea("txa_result","10","170","120","50",null,null,null,null,null,null,this);
            obj.set_taborder("1");
            this.addChild(obj.name, obj);

            obj = new DateRangeCalendar("drc_105862_Dynamic_Bind","10","495","600","70",null,null,null,null,null,null,this);
            obj.set_maxdate("20250102");
            obj.set_mindate("20250101");
            obj.set_taborder("2");
            this.addChild(obj.name, obj);

            obj = new TextArea("txa_result_dynamic","10","650","120","50",null,null,null,null,null,null,this);
            obj.set_taborder("3");
            this.addChild(obj.name, obj);

            obj = new Grid("Grid00","10","575","600","65",null,null,null,null,null,null,this);
            obj.set_autofittype("col");
            obj.set_binddataset("ds_dynamic");
            obj.set_taborder("4");
            obj._setContents("<Formats><Format id=\"default\"><Columns><Column size=\"80\"/><Column size=\"80\"/></Columns><Rows><Row band=\"head\" size=\"24\"/><Row size=\"24\"/></Rows><Band id=\"head\"><Cell text=\"startdate\"/><Cell col=\"1\" text=\"enddate\"/></Band><Band id=\"body\"><Cell edittype=\"text\" text=\"bind:startdate\"/><Cell col=\"1\" edittype=\"text\" text=\"bind:enddate\"/></Band></Format></Formats>");
            this.addChild(obj.name, obj);

            obj = new Button("Button00","140","650","120","50",null,null,null,null,null,null,this);
            obj.set_taborder("5");
            obj.set_text("get status");
            this.addChild(obj.name, obj);

            obj = new DateRangeCalendar("drc_105862_Static_Bind","10","90","600","70",null,null,null,null,null,null,this);
            obj.set_maxdate("20250102");
            obj.set_mindate("20250101");
            obj.set_taborder("6");
            this.addChild(obj.name, obj);

            obj = new DateRangeCalendar("drc_105862_Dynamic_Prop","10","415","600","70",null,null,null,null,null,null,this);
            obj.set_maxdate("20250102");
            obj.set_mindate("20250101");
            obj.set_taborder("7");
            this.addChild(obj.name, obj);

            obj = new DateRangeCalendar("drc_105862_Dynamic_Edit","10","335","600","70",null,null,null,null,null,null,this);
            obj.set_maxdate("20250102");
            obj.set_mindate("20250101");
            obj.set_taborder("8");
            this.addChild(obj.name, obj);

            obj = new Button("Button01","620","425","120","50",null,null,null,null,null,null,this);
            obj.set_taborder("9");
            obj.set_text("set Prop");
            this.addChild(obj.name, obj);

            // Layout Functions
            //-- Default Layout : this
            obj = new Layout("default","",1280,720,this,function(p){});
            this.addLayout(obj.name, obj);
            
            // BindItem Information
            obj = new BindItem("item2","drc_105862_Dynamic_Bind","startdate","ds_dynamic","startdate");
            this.addChild(obj.name, obj);
            obj.bind();

            obj = new BindItem("item3","drc_105862_Dynamic_Bind","enddate","ds_dynamic","enddate");
            this.addChild(obj.name, obj);
            obj.bind();

            obj = new BindItem("item4","drc_105862_Static_Bind","startdate","ds_invaild","startdate");
            this.addChild(obj.name, obj);
            obj.bind();

            obj = new BindItem("item5","drc_105862_Static_Bind","enddate","ds_invaild","enddate");
            this.addChild(obj.name, obj);
            obj.bind();
            
            // TriggerItem Information

        };
        
        this.loadPreloadList = function()
        {

        };
        
        // User Script
        this.registerScript("RP_105862.xfdl", function() {
        /*
         *  RP 105862
         *	DataRangeCalendar edit 영역에 mix/max 영역 초과 값이 입력되는 현상
         *
         *  - 재현 : DataRangeCalendar 에 정적/동적으로 mix/max range 초과 값 설정
         *  - 판정 : startdatefield/enddatefield 모두 invaild 하게 입력했을 때 getValidStatus() 가 모두 invalid 라면 PASS
         */

        // 정적
        this.RP_105892_onload = function(obj,e)
        {
        	var objProp = this.drc_105862_Static_Prop; // 속성 정적 설정
        	var objBind = this.drc_105862_Static_Bind; // 속성 정적 바인딩

        	var bSProp = objProp.startdatefield.getValidStatus() == 'invalid';
        	var bEProp = objProp.enddatefield.getValidStatus() == 'invalid';

        	var bSBind = objBind.startdatefield.getValidStatus() == 'invalid';
        	var bEBind = objBind.enddatefield.getValidStatus() == 'invalid';

        	this.txa_result.value = bSProp && bEProp && bSBind && bEBind;
        };

        // 동적
        this.Button00_onclick = function(obj,e)
        {
        	var objEdit = this.drc_105862_Dynamic_Edit; // 속성 동적 입력
        	var objProp = this.drc_105862_Dynamic_Prop; // 속성 동적 설정
        	var objBind = this.drc_105862_Dynamic_Bind; // 속성 동적 바인딩

        	var bSEdit = objEdit.startdatefield.getValidStatus() == 'invalid';
        	var bEEdit = objEdit.enddatefield.getValidStatus() == 'invalid';

        	var bSProp = objProp.startdatefield.getValidStatus() == 'invalid';
        	var bEProp = objProp.enddatefield.getValidStatus() == 'invalid';

        	var bSBind = objBind.startdatefield.getValidStatus() == 'invalid';
        	var bEBind = objBind.enddatefield.getValidStatus() == 'invalid';

        	this.txa_result_dynamic.value = bSEdit && bEEdit && bSProp && bEProp && bSBind && bEBind;
        };

        // 동적 속성 설정 버튼
        this.Button01_onclick = function(obj,e)
        {
        	this.drc_105862_Dynamic_Prop.startdate = "20260714";
        	this.drc_105862_Dynamic_Prop.enddate = "20260922";
        };

        });
        
        // Regist UI Components Event
        this.on_initEvent = function()
        {
            this.addEventHandler("onload",this.RP_105892_onload,this);
            this.drc_105862_Dynamic_Bind.addEventHandler("onchanged",this.drc_105892_Dynamic_onchanged,this);
            this.Button00.addEventHandler("onclick",this.Button00_onclick,this);
            this.drc_105862_Dynamic_Prop.addEventHandler("onchanged",this.drc_105892_Dynamic_onchanged,this);
            this.drc_105862_Dynamic_Edit.addEventHandler("onchanged",this.drc_105892_Dynamic_onchanged,this);
            this.Button01.addEventHandler("onclick",this.Button01_onclick,this);
        };

        this.loadIncludeScript("RP_105862.xfdl");
        this.loadPreloadList();
        
        // Remove Reference
        obj = null;
    };
}
)();
