(function()
{
    return function()
    {
        if (!this._is_form)
            return;
        
        var obj = null;
        
        this.on_create = function()
        {
            this.set_name("comCalFT");
            this.set_scrolltype("none");
            this.set_titletext("기본달력(FromTo)");
            this.getSetter("chkdata").set("");
            if (Form == this.constructor)
            {
                this._setFormPosition(191,20);
            }
            
            // Object(Dataset, ExcelExportObject) Initialize
            obj = new Dataset("dsDomainLang", this);
            obj.set_loadfiltermode("keep");
            obj.set_loadkeymode("keep");
            obj._setContents({"ColumnInfo" : {"Column" : [{"id" : "LANG","size" : "256","type" : "STRING"},{"id" : "D_M01","size" : "256","type" : "STRING"},{"id" : "D_M02","size" : "256","type" : "STRING"},{"id" : "D_M03","size" : "256","type" : "STRING"},{"id" : "D_M04","size" : "256","type" : "STRING"},{"id" : "D_M05","size" : "256","type" : "STRING"},{"id" : "D_M06","size" : "256","type" : "STRING"},{"id" : "D_M07","size" : "256","type" : "STRING"},{"id" : "D_M08","size" : "256","type" : "STRING"},{"id" : "D_M09","size" : "256","type" : "STRING"},{"id" : "D_M10","size" : "256","type" : "STRING"},{"id" : "D_M11","size" : "256","type" : "STRING"},{"id" : "D_M12","size" : "256","type" : "STRING"},{"id" : "D_Q01","size" : "256","type" : "STRING"},{"id" : "D_Q02","size" : "256","type" : "STRING"},{"id" : "D_Q03","size" : "256","type" : "STRING"},{"id" : "D_Q04","size" : "256","type" : "STRING"},{"id" : "D_H01","size" : "256","type" : "STRING"},{"id" : "D_H02","size" : "256","type" : "STRING"},{"id" : "D_T01","size" : "256","type" : "STRING"},{"id" : "D_T02","size" : "256","type" : "STRING"},{"id" : "D_T03","size" : "256","type" : "STRING"},{"id" : "D_T04","size" : "256","type" : "STRING"},{"id" : "D_T05","size" : "256","type" : "STRING"},{"id" : "D_T06","size" : "256","type" : "STRING"},{"id" : "D_T07","size" : "256","type" : "STRING"},{"id" : "D_APPLY","size" : "256","type" : "STRING"},{"id" : "D_CLOSE","size" : "256","type" : "STRING"}]},"Rows" : [{"LANG" : "ko","D_M01" : "1월","D_M02" : "2월","D_M03" : "3월","D_M04" : "4월","D_M05" : "5월","D_M06" : "6월","D_M07" : "7월","D_M08" : "8월","D_M09" : "9월","D_M10" : "10월","D_M11" : "11월","D_M12" : "12월","D_Q01" : "1/4분기","D_Q02" : "2/4분기","D_Q03" : "3/4분기","D_Q04" : "4/4분기","D_H01" : "상반기","D_H02" : "하반기","D_T01" : "오늘","D_T02" : "전일","D_T03" : "주간","D_T04" : "전주","D_T05" : "당월","D_T06" : "전월","D_T07" : "오늘까지","D_APPLY" : "적용","D_CLOSE" : "닫기"},{"LANG" : "en","D_M01" : "Jan","D_M02" : "Feb","D_M03" : "Mar","D_M04" : "Apr","D_M05" : "May","D_M06" : "Jun","D_M07" : "Jul","D_M08" : "Aug","D_M09" : "Sep","D_M10" : "Oct","D_M11" : "Nov","D_M12" : "Dec","D_Q01" : "First qu.","D_Q02" : "Sec. qu.","D_Q03" : "Third qu.","D_Q04" : "Fourth qu.","D_H01" : "First half","D_H02" : "Sec. half","D_T01" : "Today","D_T02" : "Yesterday","D_T03" : "Weekly","D_T04" : "Last week","D_T05" : "This Mon.","D_T06" : "Last Mon.","D_T07" : "To today","D_APPLY" : "Apply","D_CLOSE" : "Close"}]});
            this.addChild(obj.name, obj);
            
            // UI Components Initialize
            obj = new Static("Static00","0px","0px",null,null,"0px","0px",null,null,null,null,this);
            this.addChild(obj.name, obj);

            obj = new Calendar("calFrom","0","0","45%",null,null,"0",null,null,null,null,this);
            obj.set_autoselect("true");
            obj.set_buttonsize("0 0");
            obj.getSetter("chkdata").set("");
            obj.set_dateformat("yyyy-MM-dd");
            obj.set_popuptype("none");
            obj.set_taborder("0");
            obj.set_usetrailingday("true");
            this.addChild(obj.name, obj);

            obj = new Static("Static02","calFrom:0","0","14",null,null,"0",null,null,null,null,this);
            obj.set_cssclass("txtCenter");
            obj.set_text("~");
            this.addChild(obj.name, obj);

            obj = new Calendar("calTo","Static02:0","0",null,null,"0","0",null,null,null,null,this);
            obj.set_autoselect("true");
            obj.getSetter("chkdata").set("");
            obj.set_dateformat("yyyy-MM-dd");
            obj.set_popuptype("none");
            obj.set_taborder("2");
            this.addChild(obj.name, obj);

            obj = new PopupDiv("pdvCal","-3","21","384","306",null,null,null,null,null,null,this);
            obj.set_initvalueid("ivPopupDiv");
            obj.set_cssclass("pdivBg");
            this.addChild(obj.name, obj);

            obj = new Static("Static00_00","0","0",null,"57","0",null,null,null,null,null,this.pdvCal.form);
            obj.set_cssclass("calHead");
            obj.set_taborder("28");
            this.pdvCal.addChild(obj.name, obj);

            obj = new Calendar("calFrom","14","3","170","188",null,null,null,null,null,null,this.pdvCal.form);
            obj.set_initvalueid("ivCalendar");
            obj.set_border("0px none");
            obj.set_cssclass("calDpkBdrNA");
            obj.set_taborder("1");
            obj.set_type("monthonly");
            obj.set_usetrailingday("true");
            this.pdvCal.addChild(obj.name, obj);

            obj = new Calendar("calTo",null,"3","166","188","14",null,null,null,null,null,this.pdvCal.form);
            obj.set_initvalueid("ivCalendar");
            obj.set_border("0px none");
            obj.set_cssclass("calDpkBdrNA");
            obj.set_taborder("3");
            obj.set_type("monthonly");
            obj.set_usetrailingday("true");
            this.pdvCal.addChild(obj.name, obj);

            obj = new Button("btnToday","6",null,"50","20",null,"82",null,null,null,null,this.pdvCal.form);
            obj.set_cssclass("btn_WF_setFT");
            obj.set_taborder("0");
            obj.set_text("오늘");
            this.pdvCal.addChild(obj.name, obj);

            obj = new Button("btnBeforeDay","58",null,"50","20",null,"82",null,null,null,null,this.pdvCal.form);
            obj.set_cssclass("btn_WF_setFT");
            obj.set_taborder("2");
            obj.set_text("전일");
            this.pdvCal.addChild(obj.name, obj);

            obj = new Button("btnThisWeek","110",null,"50","20",null,"82",null,null,null,null,this.pdvCal.form);
            obj.set_cssclass("btn_WF_setFT");
            obj.set_taborder("4");
            obj.set_text("주간");
            this.pdvCal.addChild(obj.name, obj);

            obj = new Button("btnBeforeWeek","162",null,"50","20",null,"82",null,null,null,null,this.pdvCal.form);
            obj.set_cssclass("btn_WF_setFT");
            obj.set_taborder("5");
            obj.set_text("전주");
            this.pdvCal.addChild(obj.name, obj);

            obj = new Button("btnThisMonth","214",null,"50","20",null,"82",null,null,null,null,this.pdvCal.form);
            obj.set_cssclass("btn_WF_setFT");
            obj.set_taborder("6");
            obj.set_text("당월");
            this.pdvCal.addChild(obj.name, obj);

            obj = new Button("btnBeforeMonth","266",null,"50","20",null,"82",null,null,null,null,this.pdvCal.form);
            obj.set_cssclass("btn_WF_setFT");
            obj.set_taborder("7");
            obj.set_text("전월");
            this.pdvCal.addChild(obj.name, obj);

            obj = new Button("btnUntilToday","318",null,"58","20",null,"82",null,null,null,null,this.pdvCal.form);
            obj.set_cssclass("btn_WF_setFT");
            obj.set_taborder("8");
            obj.set_text("오늘까지");
            this.pdvCal.addChild(obj.name, obj);

            obj = new Button("btn1Quarter","6",null,"60","20",null,"60",null,null,null,null,this.pdvCal.form);
            obj.set_cssclass("btn_WF_setFT");
            obj.set_taborder("9");
            obj.set_text("1/4분기");
            this.pdvCal.addChild(obj.name, obj);

            obj = new Button("btn2Quarter","68",null,"60","20",null,"60",null,null,null,null,this.pdvCal.form);
            obj.set_cssclass("btn_WF_setFT");
            obj.set_taborder("10");
            obj.set_text("2/4분기");
            this.pdvCal.addChild(obj.name, obj);

            obj = new Button("btn3Quarter","130",null,"60","20",null,"60",null,null,null,null,this.pdvCal.form);
            obj.set_cssclass("btn_WF_setFT");
            obj.set_taborder("11");
            obj.set_text("3/4분기");
            this.pdvCal.addChild(obj.name, obj);

            obj = new Button("btn4Quarter","192",null,"60","20",null,"60",null,null,null,null,this.pdvCal.form);
            obj.set_cssclass("btn_WF_setFT");
            obj.set_taborder("12");
            obj.set_text("4/4분기");
            this.pdvCal.addChild(obj.name, obj);

            obj = new Button("btnFirstHalfYear","254",null,"60","20",null,"60",null,null,null,null,this.pdvCal.form);
            obj.set_cssclass("btn_WF_setFT");
            obj.set_taborder("13");
            obj.set_text("상반기");
            this.pdvCal.addChild(obj.name, obj);

            obj = new Button("btnSecondHalfYear","316",null,"60","20",null,"60",null,null,null,null,this.pdvCal.form);
            obj.set_cssclass("btn_WF_setFT");
            obj.set_taborder("14");
            obj.set_text("하반기");
            this.pdvCal.addChild(obj.name, obj);

            obj = new Button("btn01","6",null,"29","20",null,"38",null,null,null,null,this.pdvCal.form);
            obj.set_cssclass("btn_WF_setFT");
            obj.getSetter("month").set("01");
            obj.set_taborder("15");
            obj.set_text("1월");
            this.pdvCal.addChild(obj.name, obj);

            obj = new Button("btn02","37",null,"29","20",null,"38",null,null,null,null,this.pdvCal.form);
            obj.set_cssclass("btn_WF_setFT");
            obj.getSetter("month").set("02");
            obj.set_taborder("16");
            obj.set_text("2월");
            this.pdvCal.addChild(obj.name, obj);

            obj = new Button("btn03","68",null,"29","20",null,"38",null,null,null,null,this.pdvCal.form);
            obj.set_cssclass("btn_WF_setFT");
            obj.getSetter("month").set("03");
            obj.set_taborder("17");
            obj.set_text("3월");
            this.pdvCal.addChild(obj.name, obj);

            obj = new Button("btn04","99",null,"29","20",null,"38",null,null,null,null,this.pdvCal.form);
            obj.set_cssclass("btn_WF_setFT");
            obj.getSetter("month").set("04");
            obj.set_taborder("18");
            obj.set_text("4월");
            this.pdvCal.addChild(obj.name, obj);

            obj = new Button("btn05","130",null,"29","20",null,"38",null,null,null,null,this.pdvCal.form);
            obj.set_cssclass("btn_WF_setFT");
            obj.getSetter("month").set("05");
            obj.set_taborder("19");
            obj.set_text("5월");
            this.pdvCal.addChild(obj.name, obj);

            obj = new Button("btn06","161",null,"29","20",null,"38",null,null,null,null,this.pdvCal.form);
            obj.set_cssclass("btn_WF_setFT");
            obj.getSetter("month").set("06");
            obj.set_taborder("20");
            obj.set_text("6월");
            this.pdvCal.addChild(obj.name, obj);

            obj = new Button("btn07","192",null,"29","20",null,"38",null,null,null,null,this.pdvCal.form);
            obj.set_cssclass("btn_WF_setFT");
            obj.getSetter("month").set("07");
            obj.set_taborder("21");
            obj.set_text("7월");
            this.pdvCal.addChild(obj.name, obj);

            obj = new Button("btn08","223",null,"29","20",null,"38",null,null,null,null,this.pdvCal.form);
            obj.set_cssclass("btn_WF_setFT");
            obj.getSetter("month").set("08");
            obj.set_taborder("22");
            obj.set_text("8월");
            this.pdvCal.addChild(obj.name, obj);

            obj = new Button("btn09","254",null,"29","20",null,"38",null,null,null,null,this.pdvCal.form);
            obj.set_cssclass("btn_WF_setFT");
            obj.getSetter("month").set("09");
            obj.set_taborder("23");
            obj.set_text("9월");
            this.pdvCal.addChild(obj.name, obj);

            obj = new Button("btn10","285",null,"29","20",null,"38",null,null,null,null,this.pdvCal.form);
            obj.set_cssclass("btn_WF_setFT");
            obj.getSetter("month").set("10");
            obj.set_taborder("24");
            obj.set_text("10월");
            this.pdvCal.addChild(obj.name, obj);

            obj = new Button("btn11","316",null,"29","20",null,"38",null,null,null,null,this.pdvCal.form);
            obj.set_cssclass("btn_WF_setFT");
            obj.getSetter("month").set("11");
            obj.set_taborder("25");
            obj.set_text("11월");
            this.pdvCal.addChild(obj.name, obj);

            obj = new Button("btn12","347",null,"29","20",null,"38",null,null,null,null,this.pdvCal.form);
            obj.set_cssclass("btn_WF_setFT");
            obj.getSetter("month").set("12");
            obj.set_taborder("26");
            obj.set_text("12월");
            this.pdvCal.addChild(obj.name, obj);

            obj = new Div("Div00","0",null,null,"32","0","0",null,null,null,null,this.pdvCal.form);
            obj.set_cssclass("divPopBtnAr");
            obj.set_taborder("27");
            obj.set_text("버튼영역");
            this.pdvCal.addChild(obj.name, obj);

            obj = new CheckBox("ChkWeek","14","14","120","20",null,null,null,null,null,null,this.pdvCal.form.Div00.form);
            obj.set_falsevalue("N");
            obj.set_taborder("2");
            obj.set_text(" 주기준 (월~일)");
            obj.set_truevalue("Y");
            obj.set_value("N");
            this.pdvCal.form.Div00.addChild(obj.name, obj);

            obj = new Button("btnApply","155","263","55","22",null,null,null,null,null,null,this.pdvCal.form.Div00.form);
            obj.set_cssclass("btn_POP_cancle");
            obj.set_taborder("0");
            obj.set_text("적용");
            this.pdvCal.form.Div00.addChild(obj.name, obj);

            obj = new Button("btnClose","217","263","55","22",null,null,null,null,null,null,this.pdvCal.form.Div00.form);
            obj.set_cssclass("btn_POP_cancle");
            obj.set_taborder("1");
            obj.set_text("닫기");
            this.pdvCal.form.Div00.addChild(obj.name, obj);

            obj = new Static("stc00","0",null,null,"1","0","108",null,null,null,null,this.pdvCal.form);
            obj.set_background("#f0f0f0");
            obj.set_taborder("29");
            obj.set_text("stc00");
            this.pdvCal.addChild(obj.name, obj);

            // Layout Functions
            //-- Default Layout : this.pdvCal.form.Div00.form
            obj = new Layout("default","",0,0,this.pdvCal.form.Div00.form,function(p){});
            obj.set_flexcrossaxisalign("center");
            obj.set_flexmainaxisalign("start");
            obj.set_horizontalgap("2");
            obj.set_spacing("0px 10px 0px 10px");
            obj.set_type("horizontal");
            this.pdvCal.form.Div00.form.addLayout(obj.name, obj);

            //-- Default Layout : this.pdvCal.form
            obj = new Layout("default","",0,0,this.pdvCal.form,function(p){});
            this.pdvCal.form.addLayout(obj.name, obj);

            //-- Default Layout : this
            obj = new Layout("default","",this._adjust_width,this._adjust_height,this,function(p){});
            this.addLayout(obj.name, obj);
            
            // BindItem Information
            obj = new BindItem("item2","pdvCal.form.btn01","text","dsDomainLang","D_M01");
            this.addChild(obj.name, obj);
            obj.bind();

            obj = new BindItem("item3","pdvCal.form.btn02","text","dsDomainLang","D_M02");
            this.addChild(obj.name, obj);
            obj.bind();

            obj = new BindItem("item4","pdvCal.form.btn03","text","dsDomainLang","D_M03");
            this.addChild(obj.name, obj);
            obj.bind();

            obj = new BindItem("item5","pdvCal.form.btn04","text","dsDomainLang","D_M04");
            this.addChild(obj.name, obj);
            obj.bind();

            obj = new BindItem("item6","pdvCal.form.btn05","text","dsDomainLang","D_M05");
            this.addChild(obj.name, obj);
            obj.bind();

            obj = new BindItem("item7","pdvCal.form.btn06","text","dsDomainLang","D_M06");
            this.addChild(obj.name, obj);
            obj.bind();

            obj = new BindItem("item8","pdvCal.form.btn07","text","dsDomainLang","D_M07");
            this.addChild(obj.name, obj);
            obj.bind();

            obj = new BindItem("item9","pdvCal.form.btn08","text","dsDomainLang","D_M08");
            this.addChild(obj.name, obj);
            obj.bind();

            obj = new BindItem("item10","pdvCal.form.btn09","text","dsDomainLang","D_M09");
            this.addChild(obj.name, obj);
            obj.bind();

            obj = new BindItem("item11","pdvCal.form.btn10","text","dsDomainLang","D_M10");
            this.addChild(obj.name, obj);
            obj.bind();

            obj = new BindItem("item12","pdvCal.form.btn11","text","dsDomainLang","D_M11");
            this.addChild(obj.name, obj);
            obj.bind();

            obj = new BindItem("item13","pdvCal.form.btn12","text","dsDomainLang","D_M12");
            this.addChild(obj.name, obj);
            obj.bind();

            obj = new BindItem("item14","pdvCal.form.btn1Quarter","text","dsDomainLang","D_Q01");
            this.addChild(obj.name, obj);
            obj.bind();

            obj = new BindItem("item15","pdvCal.form.btn2Quarter","text","dsDomainLang","D_Q02");
            this.addChild(obj.name, obj);
            obj.bind();

            obj = new BindItem("item16","pdvCal.form.btn3Quarter","text","dsDomainLang","D_Q03");
            this.addChild(obj.name, obj);
            obj.bind();

            obj = new BindItem("item17","pdvCal.form.btn4Quarter","text","dsDomainLang","D_Q04");
            this.addChild(obj.name, obj);
            obj.bind();

            obj = new BindItem("item18","pdvCal.form.btnFirstHalfYear","text","dsDomainLang","D_H01");
            this.addChild(obj.name, obj);
            obj.bind();

            obj = new BindItem("item19","pdvCal.form.btnSecondHalfYear","text","dsDomainLang","D_H02");
            this.addChild(obj.name, obj);
            obj.bind();

            obj = new BindItem("item20","pdvCal.form.btnToday","text","dsDomainLang","D_T01");
            this.addChild(obj.name, obj);
            obj.bind();

            obj = new BindItem("item21","pdvCal.form.btnBeforeDay","text","dsDomainLang","D_T02");
            this.addChild(obj.name, obj);
            obj.bind();

            obj = new BindItem("item22","pdvCal.form.btnThisWeek","text","dsDomainLang","D_T03");
            this.addChild(obj.name, obj);
            obj.bind();

            obj = new BindItem("item23","pdvCal.form.btnBeforeWeek","text","dsDomainLang","D_T04");
            this.addChild(obj.name, obj);
            obj.bind();

            obj = new BindItem("item24","pdvCal.form.btnThisMonth","text","dsDomainLang","D_T05");
            this.addChild(obj.name, obj);
            obj.bind();

            obj = new BindItem("item25","pdvCal.form.btnBeforeMonth","text","dsDomainLang","D_T06");
            this.addChild(obj.name, obj);
            obj.bind();

            obj = new BindItem("item26","pdvCal.form.btnUntilToday","text","dsDomainLang","D_T07");
            this.addChild(obj.name, obj);
            obj.bind();

            obj = new BindItem("item0","pdvCal.form.Div00.form.btnApply","text","dsDomainLang","D_APPLY");
            this.addChild(obj.name, obj);
            obj.bind();

            obj = new BindItem("item1","pdvCal.form.Div00.form.btnClose","text","dsDomainLang","D_CLOSE");
            this.addChild(obj.name, obj);
            obj.bind();
            
            // TriggerItem Information

        };
        
        this.loadPreloadList = function()
        {

        };
        
        // User Script
        this.registerScript("RP_105670_comCalFT.xfdl", function() {
        this.fv_cal_lang = "";

        this.comCalendar_onload = function(obj, e) {

        	// @@
        	//trace ("1.comCalendar_onload ==>" +  this.parent.text);

        	if ( this.gfn_isNotNull(this.parent.text) )
        	{
        		this.calFrom.value = nexacro.isNumeric(this.parent.text.substr(0,8)) ? this.parent.text.substr(0,8) : "";
        		this.calTo.value = nexacro.isNumeric(this.parent.text.substr(8,8)) ? this.parent.text.substr(8,8) : "";
        	} else {
        		this.calFrom.value = this.gfn_getFirstDay();
        		this.calTo.value = this.gfn_getToday();
        	}

        	if (this.gfn_isNotNull(this.parent.cssclass)) this.calFrom.cssclass = this.parent.cssclass;
        	if (this.gfn_isNotNull(this.parent.cssclass)) this.calTo.cssclass = this.parent.cssclass;

        	if (this.gfn_isNotNull(this.parent.chkdata)) this.calFrom.chkdata = this.parent.chkdata;
        	if (this.gfn_isNotNull(this.parent.chkdata)) this.calTo.chkdata   = this.parent.chkdata;

        	if(this.gfn_isNotNull(nexacro.getPrivateProfile("chkWeek"))){
        		this.pdvCal.form.Div00.form.ChkWeek.value=nexacro.getPrivateProfile("chkWeek");
        	}else{
        		this.pdvCal.form.Div00.form.ChkWeek.value="N";
        	}

        	// @@
        	//trace ("2.comCalendar_onload ==>" + this.calFrom.value + " | " + this.calTo.value);
        };


        this.Calendar_ondropdown = function(obj, e)
        {
        	if(this.pdvCal.isPopup()) {
        		this.pdvCal.closePopup("");
        	}

        	if ( this.gfn_isNull(this.calFrom.value) )
        	{
        		this.pdvCal.form.calFrom.value = this.gfn_getFirstDay();
        	} else {
        		this.pdvCal.form.calFrom.value = this.calFrom.value;
        	}

        	var sVal = nexacro.trim(nexacro.replaceAll((obj.calendaredit.text+""),"-",""));

        	// @@
        	//trace ("3.Calendar_ondropdown ==>" + sVal + ", null?" + gfn_isNull(sVal));

        	if ( this.gfn_isNull(sVal) || sVal == "null")
        	{
        		this.pdvCal.form.calTo.value = this.gfn_getToday();
        	} else {
        		this.pdvCal.form.calTo.value = sVal;
        	}

        	// @@
        	//trace ("4.Calendar_ondropdown ==>" + pdvCal.calTo.value);

        	//var cX = system.clientToScreenX(this.calFrom, this.calFrom.getOffsetLeft() - 1);
        	//var cY = system.clientToScreenY(this.calFrom, this.calFrom.getOffsetHeight() + 1);

        	//this.pdvCal.trackPopup( cX, cY);
        	this.pdvCal.trackPopupByComponent(this.calFrom,this.calFrom.getOffsetLeft() - 1,this.calFrom.getOffsetHeight() + 1, null , null);
        };

        this.fn_compare = function(eventObj) {
        	if (this.gfn_isNull(this.calFrom.value) || this.gfn_isNull(this.calTo.value))
        		return true;
        	if (this.calFrom.value > this.calTo.value) {
        		//gfn_alert("", "시작일이 종료일 보다 큽니다.");
        		this.gfn_info("Warning.W007" + this.fv_cal_lang);

        		this.calTo.value = this.calFrom.value;
        		return false;
        	}
        	this.fn_callBackFunc();
        	return true;
        };



        this.Button_onclick = function(obj,  e)
        {
        	var strFromDt;
        	var strToDt;
        	var strToday = this.gfn_getToday();
        	trace("strToday : "+strToday);

        	/*
        	for ( var i=0; i<this.pdvCal.form.components.length; i++ )
        	{
        		if ( this.pdvCal.form.components[i].cssclass == "btn_select_btn" )
        		{
        			this.pdvCal.form.components[i].cssclass = "btn_grid_btn";
        		}
        	}
        	*/


        	switch ( obj.name )
        	{
        		case "btnToday" :	// 오늘
        			strFromDt = strToday;
        			strToDt = strToday;
        			break;

        		case "btnBeforeDay" :	// 전일
        			strFromDt = this.gfn_addDate(strToday, -1);
        			strToDt = this.gfn_addDate(strToday, -1);
        			break;

        		case "btnThisWeek" :	// 주간
        			if(this.pdvCal.form.Div00.form.ChkWeek.value=="N"){
        				strFromDt = this.gfn_addDate(strToday, this.gfn_getDay(strToday)*-1);
        				strToDt = strToday;
        			}else{
        				var todayDow = (this.gfn_getDay(strToday) + 6) % 7;   // 월=0, ... 일=6
        				strFromDt = this.gfn_addDate(strToday, todayDow * -1); // 이번주 월요일
        				strToDt   = strToday;
        			}
        			trace("strFromDt : "+strFromDt);
        			trace("strToday : "+strToday);

        			break;

        		case "btnBeforeWeek" :	// 전주
        			if(this.pdvCal.form.Div00.form.ChkWeek.value=="N"){
        				var strTempDt = this.gfn_addDate(strToday, -7);
        				var strTemp = this.gfn_getDay(strTempDt);
        				strFromDt = this.gfn_addDate(strTempDt, strTemp*-1);
        				strToDt = this.gfn_addDate(strTempDt, 6-strTemp);
        			}else{
        				var strTempDt = this.gfn_addDate(strToday, -7);        // 7일 전
        				var tempDow   = (this.gfn_getDay(strTempDt) + 6) % 7;  // 월=0, ... 일=6
        				strFromDt = this.gfn_addDate(strTempDt, tempDow * -1); // 전주 월요일
        				strToDt   = this.gfn_addDate(strFromDt, 6);            // 전주 일요일
        			}

        			trace("strTempDt : "+strTempDt);
        			trace("strTemp : "+strTemp);
        			trace("strFromDt : "+strFromDt);
        			trace("strToday : "+strToday);

        			break;

        		case "btnThisMonth" :	// 당월
        			strFromDt = this.gfn_getFirstDay(strToday);
        			strToDt = strToday;
        			break;

        		case "btnBeforeMonth" :	// 전월
        			var strTemp = this.gfn_addMonth(strToday,-1);
        			strFromDt = this.gfn_getFirstDay(strTemp);
        			strToDt = this.gfn_getLastDay(strTemp);
        			break;

        		case "btnUntilToday" :	// 오늘까지
        			strFromDt = strToday.substr(0,4)+"0101";
        			strToDt = strToday;
        			break;

        		case "btn1Quarter" :	// 1/4분기
        			strFromDt = strToday.substr(0,4)+"0101";
        			strToDt = this.gfn_getLastDay(strToday.substr(0,4)+"0301");

        // 			for ( var i=1; i<=3; i++ )
        // 			{
        // 				this.pdvCal.form["btn"+this.gfn_lpad(i,2,"0")].cssclass = "btn_select_btn";
        // 			}
        			break;

        		case "btn2Quarter" :	// 2/4분기
        			strFromDt = strToday.substr(0,4)+"0401";
        			strToDt = this.gfn_getLastDay(strToday.substr(0,4)+"0601");

        // 			for ( var i=4; i<=6; i++ )
        // 			{
        // 				this.pdvCal.form["btn"+this.gfn_lpad(i,2,"0")].cssclass = "btn_select_btn";
        // 			}
        			break;

        		case "btn3Quarter" :	// 3/4분기
        			strFromDt = strToday.substr(0,4)+"0701";
        			strToDt = this.gfn_getLastDay(strToday.substr(0,4)+"0901");

        // 			for ( var i=7; i<=9; i++ )
        // 			{
        // 				this.pdvCal.form["btn"+this.gfn_lpad(i,2,"0")].cssclass = "btn_select_btn";
        // 			}
        			break;

        		case "btn4Quarter" :	// 4/4분기
        			strFromDt = strToday.substr(0,4)+"1001";
        			strToDt = this.gfn_getLastDay(strToday.substr(0,4)+"1201");

        // 			for ( var i=10; i<=12; i++ )
        // 			{
        // 				this.pdvCal.form["btn"+this.gfn_lpad(i,2,"0")].cssclass = "btn_select_btn";
        // 			}
        			break;

        		case "btnFirstHalfYear" :	// 상반기
        			strFromDt = strToday.substr(0,4)+"0101";
        			strToDt = this.gfn_getLastDay(strToday.substr(0,4)+"0601");

        // 			for ( var i=1; i<=6; i++ )
        // 			{
        // 				this.pdvCal.form["btn"+this.gfn_lpad(i,2,"0")].cssclass = "btn_select_btn";
        // 			}
        			break;

        		case "btnSecondHalfYear" :	// 하반기
        			strFromDt = strToday.substr(0,4)+"0701";
        			strToDt = this.gfn_getLastDay(strToday.substr(0,4)+"1201");

        // 			for ( var i=7; i<=12; i++ )
        // 			{
        // 				this.pdvCal.form["btn"+this.gfn_lpad(i,2,"0")].cssclass = "btn_select_btn";
        // 			}
        			break;

        		default :
        			var strMonth = obj.month;

        			if ( this.gfn_isNotNull(strMonth) )
        			{
        				strFromDt = strToday.substr(0,4)+strMonth+"01";
        				strToDt = this.gfn_getLastDay(strToday.substr(0,4)+strMonth+"01");
        			}

        			break;
        	}

        	//obj.cssclass = "btn_select_btn";

        	this.pdvCal.form.calFrom.value = strFromDt;
        	this.pdvCal.form.calTo.value = strToDt;
        };

        this.pdvCal_btnApply_onclick = function(obj,  e)
        {
        	var sFrom_prevalue = this.calFrom.value;
        	var sFrom_postvalue = this.pdvCal.form.calFrom.value;

        	var sTo_prevalue = this.calTo.value;
        	var sTo_postvalue = this.pdvCal.form.calTo.value;

        	this.calFrom.value = this.pdvCal.form.calFrom.value;
        	this.calTo.value = this.pdvCal.form.calTo.value;

        	// @@
        	//trace (this.calFrom.value + " | " + this.calTo.value);

        	var rtn = this.fn_compare();

        	this.fn_chkFromDate(sFrom_prevalue, sFrom_postvalue);
        	this.fn_chkToDate(sTo_prevalue, sTo_postvalue);

        	if ( rtn )
        	{
        		this.pdvCal.closePopup();
        	}
        };

        this.pdvCal_btnClose_onclick = function(obj,  e)
        {
        	this.pdvCal.closePopup();
        };

        this.Calendar_onsetfocus = function(obj, e)
        {
        	obj._temp = "";
        };

        this.Calendar_onkillfocus = function(obj, e)
        {
        	this.fn_setValue(obj);
        	this.fn_compare();
        };

        this.fn_setValue = function(obj)
        {
        	if(this.gfn_isNull(obj.value)) return;

        	var prevalue = obj.value;

        	if ( obj._temp.length > 0 && obj._temp.length < 3 )
        	{
        		obj.value = this.gfn_getToday().substr(0,6) + obj._temp.padLeft(2,'0');
        	} else if ( obj._temp.length > 2 && obj._temp.length < 5 ) {
        		obj.value = this.gfn_getToday().substr(0,4) + obj._temp.padLeft(4,'0');
        	} else if ( obj._temp.length == 6 ) {
        		obj.value = "20" + obj._temp;
        	} else if ( obj._temp.length == 8) {
        		obj.value = obj._temp;
        	}
        	var postvalue = obj.value;

        	if(obj.name == "calFrom"){
        		this.fn_chkFromDate(prevalue, postvalue);
        	}else{
        		this.fn_chkToDate(prevalue, postvalue);
        	}

        	//trace("입력값 [" + obj._temp + "] 결과값 [" + obj.value + "]");
        };

        this.Calendar_oninput = function(obj,e)
        {
        	obj._temp = nexacro.trim(nexacro.replaceAll((obj.calendaredit.text),"-",""));

        	//trace("@@@==>" + obj._temp + "=" + obj._temp.replace(" ", "").length);

        	if (nexacro.replaceAll(obj._temp," ", "").length == 8) {
        		this.calTo.setFocus();
        	}
        };

        this.Calendar_onkeydown = function(obj, e)
        {
        	if ( e.keycode == 13 )
        	{
        		this.fn_setValue(obj);
        	}
        };

        this.fn_setDate = function(objDs, sFromDtCol,sToDtCol)
        {
        	this.removeChild("Bind01");
        	this.removeChild("Bind02");

        	var objBindItem = new BindItem("Bind01", "calFrom", "value", objDs.name, sFromDtCol);
        	this.addChild("Bind01", objBindItem);
        	objBindItem.bind();

        	objBindItem = new BindItem("Bind02", "calTo", "value", objDs.name, sToDtCol);
        	this.addChild("Bind02", objBindItem);
        	objBindItem.bind();
        };

        this.setDate = function(sStartDt, sEndDt)
        {
        	this.calFrom.value = sStartDt;
        	this.calTo.value = sEndDt;
        };

        //날짜 변경후  Function ( 필요의 경우 Include 되는 화면에서 재정의하여 사용가능
        /*
        	calFT.fn_callBackFunc() = function(){fn_xxxx()};
        */
        this.fn_callBackFunc = function(){
        	var sCallBack = this.parent.fn_callBackFunc;

        	// callBack 함수가 있을 때
        	if (this.gfn_isNotNull(sCallBack))
        	{
        		// callback 함수object로 파라미터 전달시 바로 호출
        		if (typeof(sCallBack) == "function")
        		{
        			return sCallBack.call();
        		}
        		else
        		{
        			return this.parent.parent.lookupFunc(sCallBack).call();
        		}
        	}

        	return;
        };

        this.fn_chkFromDate = function(prevalue, postvalue)
        {
        	var sCallBack = this.parent.fn_chkFromDate;

        	// callBack 함수가 있을 때
        	if (this.gfn_isNotNull(sCallBack))
        	{
        		// callback 함수object로 파라미터 전달시 바로 호출
        		if (typeof(sCallBack) == "function")
        		{
        			return sCallBack.call();
        		}
        		else
        		{
        			return this.parent.parent.lookupFunc(sCallBack).call();
        		}
        	}

        	return;
        };

        this.fn_chkToDate = function(prevalue, postvalue)
        {
        	var sCallBack = this.parent.fn_chkToDate;

        	// callBack 함수가 있을 때
        	if (this.gfn_isNotNull(sCallBack))
        	{
        		// callback 함수object로 파라미터 전달시 바로 호출
        		if (typeof(sCallBack) == "function")
        		{
        			return sCallBack.call();
        		}
        		else
        		{
        			return this.parent.parent.lookupFunc(sCallBack).call();
        		}
        	}

        	return;
        };


        // 다국어 처리
        this.fn_setLocal = function(pLang) {
        	var sLocal;
        	var lang;
        	var strFilter;

        	if (this.gfn_isNull(pLang) || pLang == "ko") {
        		sLocal = "";
        		lang = "ko";
        		this.fv_cal_lang = "";
        	}
        	else {
        		sLocal = "en_US";
        		lang = pLang;
        		this.fv_cal_lang = pLang;
        	}


        	this.pdvCal.form.calFrom.locale = sLocal;
        	this.pdvCal.form.calTo.locale = sLocal;

        	strFilter = "LANG== '" + lang + "' ";

        	this.dsDomainLang.filter(strFilter);
        	this.dsDomainLang.rowposition = 0;
        };



        this.pdvCal_Div00_ChkWeek_onchanged = function(obj,e)
        {
        	nexacro.setPrivateProfile("chkWeek",this.pdvCal.form.Div00.form.ChkWeek.value);
        };

        /**

         * @class NULL 여부 체크

         * @param {string} sValue 문자열

         * @return {boolean} 여부

         */

        this.gfn_isNull = function(sValue) {

            if (typeof sValue =="undefined") return true;

            if (new String(sValue).valueOf() == "undefined") return true;

            if (sValue == null) return true;

            if (sValue == "null") return true;

           	if (("x" + sValue == "xNaN") && (new String(sValue.length).valueOf() == "undefined")) return true;



            var v_ChkStr = new String(sValue);

            if (v_ChkStr == null) return true;

            if (v_ChkStr.toString().length == 0) return true;



            return false;

        };





        /**

         * @class NULL 아닌지 체크

         * @param {string} sValue 문자열

         * @return {boolean} 여부

         */

        this.gfn_isNotNull = function(sValue) {

            return !this.gfn_isNull(sValue);

        };





        /**

         * @class 입력된 월,일에 해당된 마지막 일자 구하기

         * @param {string} sDate 일자

         * @return {string} 마지막 일자

         */

        this.gfn_getLastDay = function(sDate) {

            // 파라메타 값이 없으면 오늘일자로 세팅

            if (this.gfn_isNull(sDate)) sDate = this.gfn_getToday();



            var nMonth = nexacro.toNumber(sDate.toString().substr(4, 2), 10);

            var nLastDate = "30";



            if (nMonth == 1 || nMonth == 3 || nMonth == 5 || nMonth == 7 ||

                nMonth == 8 || nMonth == 10 || nMonth == 12) {

        		nLastDate = "31";

            } else if (nMonth == 2) {

                //윤달 계산 Y:윤달

                if (this.gfn_getIsLeapYear(sDate.substr(0, 4)) == "Y") nLastDate = "29";

                else nLastDate = "28";

            }



            return sDate.toString().substr(0, 6) + nLastDate;

        };



        /**

         * @class 입력된 월,일에 해당된 첫일자 구하기

         * @param {string} sDate 일자

         * @return {string} 첫일자

         */

        this.gfn_getFirstDay = function(sDate) {

            // 파라메타 값이 없으면 오늘일자로 세팅

            if (this.gfn_isNull(sDate)) sDate = this.gfn_getToday();



            return sDate.toString(10).substr(0, 6) + "01";

        };



        /**

         * @class 입력된 날자에 nOffset 으로 지정된 만큼의 월을 증감한다.

         * @param {string} sDate 날짜 (예 : "20121122")

         * @param {string} nOffset 월 증감값 (예 : 10 또는 -10)

         * @return {string} yyyyMMdd 형태의 문자열 날짜

         */

        this.gfn_addMonth = function(strDate, OffSet) {

        	var date, d, s, mon, val;



        	/**

        	 * @class 입력일자 해당월의 마지막 일 <br>

        	 * @param {String} strMonth - 'yyyyMMdd' 형태로 표현된 날짜.

        	 * @return {Number} 해당월의 마지막일자 2자리

        	 */

        	var gfn_getMonthLastDate = function(strMonth) {

        		var iLastDay;

        		var iYear  = parseInt(strMonth.substr(0, 4),10) ;

        		var iMonth = parseInt(strMonth.substr(4, 2),10);

        		switch(iMonth)

        		{

        			case 2 :

        				if( ((iYear%4)==0) && ((iYear%100)!=0) || ((iYear%400)==0) )

        					iLastDay = 29;

        				else

        					iLastDay = 28;

        				break;

        			case 4 :

        			case 6 :

        			case 9 :

        			case 11 :

        				iLastDay = 30;

        				break;

        			default:

        				iLastDay = 31;

        				break;

        		}

        		return iLastDay;

        	};



            if (strDate) {

                date = this.gfn_strToDate(strDate);

                d = (new Date(date)).addMonth(OffSet);

            } else {

            	date = this.gfn_strToDate(this.gfn_getDate());

        		d = (new Date(date)).addMonth(OffSet);

            }

            if (gfn_getMonthLastDate(strDate) == date.getDate()) {

            	var sY = new Date(d).getFullYear();

            	var sM = new Date(d).getMonth();

            	var eY = date.getFullYear();

            	var eM = date.getMonth();



            	mon = -((eY - sY)* 12 + (eM - sM));

            	if (mon != OffSet) {

           			val = OffSet - mon;

            		d = (new Date(d)).addMonth(-1);

            	}

            	var ld = new Date((new Date(d)).getFullYear()

            			, (new Date(d)).getMonth()

            			, gfn_getMonthLastDate(this.gfn_dateToStr(new Date(d))));



            	s = (new Date(ld)).getFullYear()

        		   + (((new Date(ld)).getMonth() + 1) + "").padLeft(2, '0')

        		   + (((new Date(ld)).getDate()) + "").padLeft(2, '0');

            } else {

            	s = (new Date(d)).getFullYear()

        		   + (((new Date(d)).getMonth() + 1) + "").padLeft(2, '0')

        		   + (((new Date(d)).getDate()) + "").padLeft(2, '0');

            }

        	return (s);

        };



        /**

         * @class 입력된 날자에 nOffset 으로 지정된 만큼의 일을 증감한다.

         * @param {string} sDate 날짜 (예 : "20121122")

         * @param {number} nOffset 일 증감값 (예 : 10 또는 -10)

         * @return {string} yyyyMMdd 형태의 문자열 날짜 (예 : "20121202" 또는 "20121112")

         */

        this.gfn_addDate = function(sDate, nOffset) {

        	if (this.gfn_isNull(sDate) || this.gfn_isNull(nOffset))	return "";

            var nYear = parseInt(sDate.substr(0, 4));

            var nMonth = parseInt(sDate.substr(4, 2));

            var nDate = parseInt(sDate.substr(6, 2)) + nOffset;



            return this.gfn_makeDate(nYear, nMonth, nDate);

        };



        /**

         * @class 입력된 날자로부터 요일을 구함

         * @param {string} strDate 입력문자열

         * @return {string} 0-일요일 ~ 6-토요일

         */

        this.gfn_getDay = function(strDate) {

            var date = new Date(this.gfn_getFormat(strDate, "@@@@-@@-@@"));

            return date.getDay();

        };


        /**

         * @class 서버일자를 가져온다.

         * @param {string} sFormat 날짜 포맷(default : 'YYYYMMDD')

         * @return {string} 오늘 날짜

         */

        this.gfn_getToday = function(sFormat)
        {

            // TO-DO : 설계 리뷰 시 서버일자 가져올 수 없어서 임시로 로컬날짜 이용

        //     var sToday = "";

        //     var objDate = new Date();

        //     var sToday  = objDate.getFullYear().toString();

        //     sToday += gfn_lpad((objDate.getMonth() + 1), 2, "0");

        //     sToday += gfn_lpad(objDate.getDate(), 2, "0");

        //     sToday += gfn_lpad(objDate.getHours(), 2, "0");

        //     sToday += gfn_lpad(objDate.getMinutes(), 2, "0");

        //     sToday += gfn_lpad(objDate.getSeconds(), 2, "0");

        //

        //     return gfn_isNull(sFormat)?sToday.substr(0,8):sToday.substr(0,(""+sFormat).length);



        	var vFormat;

        	var vFullURL;

        	var bAsync;

        	if (this.gfn_isNull(sFormat)) vFormat = "YYYYMMDD";

        	else vFormat = sFormat;

        	//if (this.gfn_isNull(nexacro.getApplication().gv_today))		nexacro.getApplication().gv_today = {};

        	//var sToday = nexacro.getApplication().gv_today[vFormat];

        	// 날짜함수 캐쉬처리

        	//if (this.gfn_isNull(sToday)) {

        		vFullURL = nexacro.getApplication().gv_contextPath + "/cm/selectCurDt.do";

        		//nexacro.getApplication().gdsSearch.clear();

        		//this.gfn_searchArgAdd("format", vFormat);

        // 		this.transaction("selectCurDt",
        //
        // 					"svc::" + vFullURL,
        //
        // 					"__DS_TRANS_INFO__=gdsTransInfo __DS_SEARCH_INFO__=gdsSearch ",
        //
        // 					"",
        //
        // 					"",
        //
        // 					"gfn_callBackCurDate",
        //
        // 					false
        //
        // 					);

        		//sToday = nexacro.getApplication().gv_curDate;
        		sToday = "20260619";

        		//nexacro.getApplication().gv_today[vFormat] = sToday;

        	//}

        	return sToday;

        };
        });
        
        // Regist UI Components Event
        this.on_initEvent = function()
        {
            this.addEventHandler("onload",this.comCalendar_onload,this);
            this.calFrom.addEventHandler("oninput",this.Calendar_oninput,this);
            this.calFrom.addEventHandler("onkeydown",this.Calendar_onkeydown,this);
            this.calFrom.addEventHandler("onkillfocus",this.Calendar_onkillfocus,this);
            this.calFrom.addEventHandler("onsetfocus",this.Calendar_onsetfocus,this);
            this.calTo.addEventHandler("ondropdown",this.Calendar_ondropdown,this);
            this.calTo.addEventHandler("oninput",this.Calendar_oninput,this);
            this.calTo.addEventHandler("onkeydown",this.Calendar_onkeydown,this);
            this.calTo.addEventHandler("onkillfocus",this.Calendar_onkillfocus,this);
            this.calTo.addEventHandler("onsetfocus",this.Calendar_onsetfocus,this);
            this.pdvCal.form.btnToday.addEventHandler("onclick",this.Button_onclick,this);
            this.pdvCal.form.btnBeforeDay.addEventHandler("onclick",this.Button_onclick,this);
            this.pdvCal.form.btnThisWeek.addEventHandler("onclick",this.Button_onclick,this);
            this.pdvCal.form.btnBeforeWeek.addEventHandler("onclick",this.Button_onclick,this);
            this.pdvCal.form.btnThisMonth.addEventHandler("onclick",this.Button_onclick,this);
            this.pdvCal.form.btnBeforeMonth.addEventHandler("onclick",this.Button_onclick,this);
            this.pdvCal.form.btnUntilToday.addEventHandler("onclick",this.Button_onclick,this);
            this.pdvCal.form.btn1Quarter.addEventHandler("onclick",this.Button_onclick,this);
            this.pdvCal.form.btn2Quarter.addEventHandler("onclick",this.Button_onclick,this);
            this.pdvCal.form.btn3Quarter.addEventHandler("onclick",this.Button_onclick,this);
            this.pdvCal.form.btn4Quarter.addEventHandler("onclick",this.Button_onclick,this);
            this.pdvCal.form.btnFirstHalfYear.addEventHandler("onclick",this.Button_onclick,this);
            this.pdvCal.form.btnSecondHalfYear.addEventHandler("onclick",this.Button_onclick,this);
            this.pdvCal.form.btn01.addEventHandler("onclick",this.Button_onclick,this);
            this.pdvCal.form.btn02.addEventHandler("onclick",this.Button_onclick,this);
            this.pdvCal.form.btn03.addEventHandler("onclick",this.Button_onclick,this);
            this.pdvCal.form.btn04.addEventHandler("onclick",this.Button_onclick,this);
            this.pdvCal.form.btn05.addEventHandler("onclick",this.Button_onclick,this);
            this.pdvCal.form.btn06.addEventHandler("onclick",this.Button_onclick,this);
            this.pdvCal.form.btn07.addEventHandler("onclick",this.Button_onclick,this);
            this.pdvCal.form.btn08.addEventHandler("onclick",this.Button_onclick,this);
            this.pdvCal.form.btn09.addEventHandler("onclick",this.Button_onclick,this);
            this.pdvCal.form.btn10.addEventHandler("onclick",this.Button_onclick,this);
            this.pdvCal.form.btn11.addEventHandler("onclick",this.Button_onclick,this);
            this.pdvCal.form.btn12.addEventHandler("onclick",this.Button_onclick,this);
            this.pdvCal.form.Div00.form.ChkWeek.addEventHandler("onchanged",this.pdvCal_Div00_ChkWeek_onchanged,this);
            this.pdvCal.form.Div00.form.btnApply.addEventHandler("onclick",this.pdvCal_btnApply_onclick,this);
            this.pdvCal.form.Div00.form.btnClose.addEventHandler("onclick",this.pdvCal_btnClose_onclick,this);
        };

        this.loadIncludeScript("RP_105670_comCalFT.xfdl");
        this.loadPreloadList();
        
        // Remove Reference
        obj = null;
    };
}
)();
