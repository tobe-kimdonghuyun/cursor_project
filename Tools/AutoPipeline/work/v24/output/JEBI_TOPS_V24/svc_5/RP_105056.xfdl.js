(function()
{
    return function()
    {
        if (!this._is_form)
            return;
        
        var obj = null;
        
        this.on_create = function()
        {
            this.set_name("editformat");
            this.set_titletext("Calendar editformat");
            if (Form == this.constructor)
            {
                this._setFormPosition(1280,720);
            }
            
            // Object(Dataset, ExcelExportObject) Initialize
            obj = new Dataset("Dataset00", this);
            obj._setContents({"ColumnInfo" : {"Column" : [{"id" : "Column0","size" : "256","type" : "STRING"},{"id" : "Column1","size" : "256","type" : "STRING"}]},"Rows" : [{"Column0" : ""}]});
            this.addChild(obj.name, obj);


            obj = new Dataset("Dataset01", this);
            obj._setContents({"ColumnInfo" : {"Column" : [{"id" : "Column0","size" : "256","type" : "STRING"}]},"Rows" : [{"Column0" : "yyyy-MM-dd HH"},{"Column0" : "yyyy-MM HH"},{"Column0" : "MM-dd HH"},{"Column0" : "yyyy HH"},{"Column0" : "MM HH"},{"Column0" : "dd HH"}]});
            this.addChild(obj.name, obj);


            obj = new Dataset("Dataset01_00", this);
            obj._setContents({"ColumnInfo" : {"Column" : [{"id" : "Column0","size" : "256","type" : "STRING"}]},"Rows" : [{"Column0" : "yyyy-MM-dd mm"},{"Column0" : "yyyy-MM mm"},{"Column0" : "MM-dd mm"},{"Column0" : "yyyy mm"},{"Column0" : "MM mm"},{"Column0" : "dd mm"}]});
            this.addChild(obj.name, obj);


            obj = new Dataset("Dataset01_01", this);
            obj._setContents({"ColumnInfo" : {"Column" : [{"id" : "Column0","size" : "256","type" : "STRING"}]},"Rows" : [{"Column0" : "yyyy-MM-dd ss"},{"Column0" : "yyyy-MM ss"},{"Column0" : "MM-dd ss"},{"Column0" : "yyyy ss"},{"Column0" : "MM ss"},{"Column0" : "dd ss"}]});
            this.addChild(obj.name, obj);


            obj = new Dataset("Dataset01_02", this);
            obj._setContents({"ColumnInfo" : {"Column" : [{"id" : "Column0","size" : "256","type" : "STRING"}]},"Rows" : [{"Column0" : "HH:mm:ss"},{"Column0" : "HH:mm"},{"Column0" : "HH"},{"Column0" : "mm:ss"},{"Column0" : "mm"},{"Column0" : "ss"}]});
            this.addChild(obj.name, obj);


            obj = new Dataset("Dataset01_03", this);
            obj._setContents({"ColumnInfo" : {"Column" : [{"id" : "Column0","size" : "256","type" : "STRING"}]},"Rows" : [{"Column0" : "yyyy-MM-dd"},{"Column0" : "yyyy-MM"},{"Column0" : "MM-dd"},{"Column0" : "yyyy"},{"Column0" : "MM"},{"Column0" : "dd"}]});
            this.addChild(obj.name, obj);


            obj = new Dataset("ds_format", this);
            obj._setContents({"ColumnInfo" : {"Column" : [{"id" : "HH","size" : "256","type" : "STRING"},{"id" : "mm","size" : "256","type" : "STRING"},{"id" : "ss","size" : "256","type" : "STRING"},{"id" : "Hms","size" : "256","type" : "STRING"},{"id" : "yMd","size" : "256","type" : "STRING"}]},"Rows" : [{"HH" : "yyyy-MM-dd HH","mm" : "yyyy-MM-dd mm","ss" : "yyyy-MM-dd ss","Hms" : "HH:mm:ss","yMd" : "yyyy-MM-dd"},{"HH" : "yyyy-MM HH","mm" : "yyyy-MM mm","ss" : "yyyy-MM ss","Hms" : "HH:mm","yMd" : "yyyy-MM"},{"HH" : "MM-dd HH","mm" : "MM-dd mm","ss" : "MM-dd ss","Hms" : "HH","yMd" : "MM-dd"},{"HH" : "yyyy HH","mm" : "yyyy mm","ss" : "yyyy ss","Hms" : "mm:ss","yMd" : "yyyy"},{"HH" : "MM HH","mm" : "MM mm","ss" : "MM ss","Hms" : "mm","yMd" : "MM"},{"HH" : "dd HH","mm" : "dd mm","ss" : "dd ss","Hms" : "ss","yMd" : "dd"}]});
            this.addChild(obj.name, obj);
            
            // UI Components Initialize
            obj = new Calendar("Calendar01","267","48","207","47",null,null,null,null,null,null,this);
            obj.set_autoselect("true");
            obj.set_editformat("yyyy-MM-dd HH:mm:ss");
            obj.set_taborder("0");
            this.addChild(obj.name, obj);

            obj = new Combo("Combo00","38","48","188","45",null,null,null,null,null,null,this);
            obj.set_codecolumn("Column0");
            obj.set_datacolumn("Column0");
            obj.set_innerdataset("Dataset01");
            obj.set_taborder("2");
            obj.set_text("Combo00");
            this.addChild(obj.name, obj);

            obj = new Combo("Combo01","38","110","188","45",null,null,null,null,null,null,this);
            obj.set_codecolumn("Column0");
            obj.set_datacolumn("Column0");
            obj.set_innerdataset("Dataset01_00");
            obj.set_taborder("3");
            obj.set_tabstop("false");
            obj.set_text("Combo01");
            this.addChild(obj.name, obj);

            obj = new Grid("Grid00","491","51","321","165",null,null,null,null,null,null,this);
            obj.set_autoenter("select");
            obj.set_binddataset("Dataset00");
            obj.set_taborder("1");
            obj._setContents("<Formats><Format id=\"default\"><Columns><Column size=\"190\"/><Column size=\"120\"/></Columns><Rows><Row band=\"head\" size=\"24\"/><Row size=\"36\"/></Rows><Band id=\"head\"><Cell text=\"Column0\"/><Cell col=\"1\" text=\"Column1\"/></Band><Band id=\"body\"><Cell displaytype=\"calendarcontrol\" edittype=\"date\" text=\"bind:Column0\"/><Cell col=\"1\" text=\"bind:Column1\"/></Band></Format></Formats>");
            this.addChild(obj.name, obj);

            obj = new Combo("Combo02","38","171","188","45",null,null,null,null,null,null,this);
            obj.set_codecolumn("Column0");
            obj.set_datacolumn("Column0");
            obj.set_innerdataset("Dataset01_01");
            obj.set_taborder("4");
            obj.set_tabstop("false");
            obj.set_text("Combo02");
            this.addChild(obj.name, obj);

            obj = new Combo("Combo03","38","234","188","45",null,null,null,null,null,null,this);
            obj.set_codecolumn("Column0");
            obj.set_datacolumn("Column0");
            obj.set_innerdataset("Dataset01_02");
            obj.set_taborder("5");
            obj.set_tabstop("false");
            obj.set_text("Combo03");
            this.addChild(obj.name, obj);

            obj = new Combo("Combo04","38","296","188","45",null,null,null,null,null,null,this);
            obj.set_codecolumn("Column0");
            obj.set_datacolumn("Column0");
            obj.set_innerdataset("Dataset01_03");
            obj.set_taborder("6");
            obj.set_tabstop("false");
            obj.set_text("Combo04");
            this.addChild(obj.name, obj);

            obj = new Edit("Edit00","267","110","173","45",null,null,null,null,null,null,this);
            obj.set_autoselect("true");
            obj.set_taborder("7");
            this.addChild(obj.name, obj);

            obj = new Button("Button00","440","110","34","45",null,null,null,null,null,null,this);
            obj.set_taborder("8");
            obj.set_text("set");
            this.addChild(obj.name, obj);

            obj = new Grid("Grid01","267","225","545","270",null,null,null,null,null,null,this);
            obj.set_autofittype("col");
            obj.set_binddataset("ds_format");
            obj.set_taborder("9");
            obj._setContents("<Formats><Format id=\"default\"><Columns><Column size=\"80\"/><Column size=\"80\"/><Column size=\"80\"/><Column size=\"80\"/><Column size=\"80\"/></Columns><Rows><Row band=\"head\" size=\"24\"/><Row size=\"24\"/></Rows><Band id=\"head\"><Cell text=\"HH\"/><Cell col=\"1\" text=\"mm\"/><Cell col=\"2\" text=\"ss\"/><Cell col=\"3\" text=\"Hms\"/><Cell col=\"4\" text=\"yMd\"/></Band><Band id=\"body\"><Cell text=\"bind:HH\"/><Cell col=\"1\" text=\"bind:mm\"/><Cell col=\"2\" text=\"bind:ss\"/><Cell col=\"3\" text=\"bind:Hms\"/><Cell col=\"4\" text=\"bind:yMd\"/></Band></Format></Formats>");
            this.addChild(obj.name, obj);

            obj = new TextArea("TextArea00","267","171","207","47",null,null,null,null,null,null,this);
            obj.set_readonly("true");
            obj.set_taborder("10");
            obj.set_textAlign("center");
            obj.set_value("yyyy-MM-dd HH:mm:ss");
            this.addChild(obj.name, obj);

            obj = new TextArea("txa_Calval","819","51","207","47",null,null,null,null,null,null,this);
            obj.set_readonly("true");
            obj.set_taborder("11");
            obj.set_textAlign("center");
            this.addChild(obj.name, obj);

            obj = new TextArea("txa_GridCalval","819","105","207","47",null,null,null,null,null,null,this);
            obj.set_readonly("true");
            obj.set_taborder("12");
            obj.set_textAlign("center");
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
        this.registerScript("RP_105056.xfdl", function() {
        /*

        Calendar 의 editformat에 따라 값을 입력시 비정상적인 값으로 자동보정되는 현상

        editformat    : 보정 값

        [ 1 입력 ]

        yyyy-MM-dd mm : 1
        yyyy-MM mm    : 1
        MM-dd mm      : 1

        yyyy-MM-dd ss : 1
        yyyy-MM ss    : 1
        MM-dd ss      : 1

        [ 6 입력 ]

        MM-dd HH      : 06-   00
        MM HH         : 06 00
        dd HH         : 06 00

        yyyy-MM-dd mm : 6
        yyyy-MM mm    : 6
        MM-dd mm      : 06- 00

        yyyy-MM-dd ss : 6
        yyyy-MM ss    : 6
        MM-dd ss      : 06- 00

        mm:ss         : 06:00
        mm            : 06

        */

        this.Combo00_onitemchanged = function(obj,e)
        {
        	this.fn_ChangeFormat(e.postvalue);
        };

        this.Button00_onclick = function(obj,e)
        {
        	var edtVal = this.Edit00.value;

        	this.fn_ChangeFormat(edtVal);
        };

        this.Grid01_oncellclick = function(obj,e)
        {
        	var nRow = e.row;
        	var nCol = e.col;

        	var cellVal = this.ds_format.getColumn(nRow, nCol);

        	this.fn_ChangeFormat(cellVal);
        };

        this.fn_ChangeFormat = function (strFormat)
        {
        	this.Calendar01.set_value("");
        	this.Calendar01.set_editformat(strFormat);
        	this.Calendar01.set_dateformat(strFormat);
        	this.Dataset00.setColumn(0,0,"");
        	this.Grid00.setCellProperty("Body", 0, "calendareditformat", strFormat);
        	this.Grid00.setCellProperty("Body", 0, "calendardateformat", strFormat);

        	this.TextArea00.value = this.Calendar01.editformat;
        };

        // 그냥 Get Value로 값 비교

        // this.editformat_onkeydown = function(obj:nexacro.Form,e:nexacro.KeyEventInfo)
        // {
        // 	// getDisplayText() 는 Calendar 값이 확정된 이후의 값을 가져옴
        // 	this.txa_Display.value = this.Calendar01.getDisplayText();
        //
        // 	// 입력중에 format 보정을 확인하기위해 <input> 의 value 값 확인
        // 	var elCal = this.Calendar01.getElement().handle;
        // 	var elGridCal = this.Grid00.getElement().handle;
        //
        // 	var strCal = elCal.querySelector("input.nexainput").value;
        // 	var strGridCal = elGridCal.querySelector("input.nexainput").value;
        //
        // 	this.txa_Calval.value = strCal;
        // 	this.txa_GridCalval.value = strGridCal;
        // };


        });
        
        // Regist UI Components Event
        this.on_initEvent = function()
        {
            this.addEventHandler("onkeydown",this.editformat_onkeydown,this);
            this.Calendar01.addEventHandler("oninput",this.Calendar01_oninput,this);
            this.Combo00.addEventHandler("onitemchanged",this.Combo00_onitemchanged,this);
            this.Combo01.addEventHandler("onitemchanged",this.Combo00_onitemchanged,this);
            this.Combo02.addEventHandler("onitemchanged",this.Combo00_onitemchanged,this);
            this.Combo03.addEventHandler("onitemchanged",this.Combo00_onitemchanged,this);
            this.Combo04.addEventHandler("onitemchanged",this.Combo00_onitemchanged,this);
            this.Button00.addEventHandler("onclick",this.Button00_onclick,this);
            this.Grid01.addEventHandler("oncellclick",this.Grid01_oncellclick,this);
        };

        this.loadIncludeScript("RP_105056.xfdl");
        this.loadPreloadList();
        
        // Remove Reference
        obj = null;
    };
}
)();
