(function()
{
    return function()
    {
        if (!this._is_form)
            return;
        
        var obj = null;
        
        this.on_create = function()
        {
            this.set_name("RP_105885");
            this.set_titletext("DateRangeCalendar InnerDataset Script error");
            if (Form == this.constructor)
            {
                this._setFormPosition(1280,720);
            }
            
            // Object(Dataset, ExcelExportObject) Initialize
            obj = new Dataset("ds_innerC", this);
            obj._setContents({"ColumnInfo" : {"Column" : [{"id" : "date","size" : "256","type" : "STRING"},{"id" : "textcolor","size" : "256","type" : "STRING"},{"id" : "bkcolor","size" : "256","type" : "STRING"},{"id" : "bordercolor","size" : "256","type" : "STRING"},{"id" : "hinting","size" : "256","type" : "STRING"},{"id" : "readonly","size" : "256","type" : "STRING"}]},"Rows" : [{"date" : "20260710","textcolor" : "black","bkcolor" : "yellow","bordercolor" : "1px solid gray","hinting" : "기본","readonly" : "false"},{"date" : "20260720","textcolor" : "blue","bkcolor" : "lightblue","bordercolor" : "1px solid blue","hinting" : "기본","readonly" : "false"}]});
            this.addChild(obj.name, obj);
            
            // UI Components Initialize
            obj = new DateRangeCalendar("drc_105885","10","10","600","70",null,null,null,null,null,null,this);
            obj.set_backgroundcolumn("bkcolor");
            obj.set_bordercolumn("bordercolor");
            obj.set_datecolumn("date");
            obj.set_hintingcolumn("hinting");
            obj.set_innerdataset("ds_innerC");
            obj.set_readonlycolumn("readonly");
            obj.set_taborder("0");
            obj.set_textcolorcolumn("textcolor");
            this.addChild(obj.name, obj);

            obj = new Grid("grd_innerds","10","90","609","174",null,null,null,null,null,null,this);
            obj.set_autofittype("col");
            obj.set_binddataset("ds_innerC");
            obj.set_taborder("1");
            obj._setContents("<Formats><Format id=\"default\"><Columns><Column size=\"80\"/><Column size=\"80\"/><Column size=\"80\"/><Column size=\"80\"/><Column size=\"80\"/><Column size=\"80\"/></Columns><Rows><Row band=\"head\" size=\"24\"/><Row size=\"24\"/></Rows><Band id=\"head\"><Cell text=\"date\"/><Cell col=\"1\" text=\"textcolor\"/><Cell col=\"2\" text=\"bkcolor\"/><Cell col=\"3\" text=\"bordercolor\"/><Cell col=\"4\" text=\"hinting\"/><Cell col=\"5\" text=\"readonly\"/></Band><Band id=\"body\"><Cell text=\"bind:date\"/><Cell col=\"1\" text=\"bind:textcolor\"/><Cell col=\"2\" text=\"bind:bkcolor\"/><Cell col=\"3\" text=\"bind:bordercolor\"/><Cell col=\"4\" text=\"bind:hinting\"/><Cell col=\"5\" text=\"bind:readonly\"/></Band></Format></Formats>");
            this.addChild(obj.name, obj);

            obj = new Button("btn_modify","630","90","240","40",null,null,null,null,null,null,this);
            obj.set_taborder("2");
            obj.set_text("Inner Dataset 수정");
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
        this.registerScript("RP_105885.xfdl", function() {
        /*
         *	RP 105885
         *  DateRangeCalendar의 start/enddate 값을 2회 이상 수정한 상태에서
         *  innerdataset 에 바인딩된 dataset 내용을 수정하는 경우 스크립트 에러가 발생하는 현상
         *
         *  - 재현 : DateRangeCalendar의 start 값을 2회 이상 수정 후 innerdataset 에 바인딩 된 dataset 내용 수정
         *  - 판정 : 케이스 수행 중 Script Error 가 발생하지 않으면 PASS
         */


         /* innerdataset 내 컬럼값 수정 */
        this.btn_modify_onclick = function(obj,e)
        {
        // 	this.grd_innerds.binddataset = "ds_innerC";
        // 	this.grd_innerds.createFormat();

        	if(this.fv_Toggle)
        	{
        		this.ds_innerC.setColumn(0, "bkcolor", "yellow");
        		this.ds_innerC.setColumn(0, "textcolor", "black");
        		this.ds_innerC.setColumn(0, "hinting", "기본");
        		this.fv_Toggle = false;
        	}
        	else
        	{
        		this.ds_innerC.setColumn(0, "bkcolor", "red");
        		this.ds_innerC.setColumn(0, "textcolor", "white");
        		this.ds_innerC.setColumn(0, "hinting", "변경됨");
        		this.fv_Toggle = true;
        	}
        };
        });
        
        // Regist UI Components Event
        this.on_initEvent = function()
        {
            this.btn_modify.addEventHandler("onclick",this.btn_modify_onclick,this);
        };

        this.loadIncludeScript("RP_105885.xfdl");
        this.loadPreloadList();
        
        // Remove Reference
        obj = null;
    };
}
)();
