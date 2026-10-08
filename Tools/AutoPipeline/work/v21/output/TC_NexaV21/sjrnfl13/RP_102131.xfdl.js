(function()
{
    return function()
    {
        if (!this._is_form)
            return;
        
        var obj = null;
        
        this.on_create = function()
        {
            this.set_cssclass("frm_WF");
            this.set_name("VMIS_SPA001Q");
            this.set_titletext("제작자 등록현황 조회");
            if (Form == this.constructor)
            {
                this._setFormPosition(1288,770);
            }
            
            // Object(Dataset, ExcelExportObject) Initialize
            obj = new Dataset("dsSearch", this);
            obj._setContents({"ColumnInfo" : {"Column" : [{"id" : "selfCertRqisit","prop" : "default","size" : "256","type" : "STRING"},{"id" : "asort","prop" : "default","size" : "256","type" : "STRING"},{"id" : "makrSe","prop" : "default","size" : "256","type" : "STRING"},{"id" : "bzentyNm","prop" : "default","size" : "256","type" : "STRING"},{"id" : "rtrcnSe","prop" : "default","size" : "256","type" : "STRING"},{"id" : "rtnSe","prop" : "default","size" : "256","type" : "STRING"},{"id" : "rtnDtlSe","prop" : "default","size" : "256","type" : "STRING"},{"id" : "bgngYmd","prop" : "default","size" : "256","type" : "STRING"},{"id" : "endYmd","prop" : "default","size" : "256","type" : "STRING"},{"id" : "wmi","prop" : "default","size" : "256","type" : "STRING"},{"id" : "chkWMI","size" : "256","type" : "STRING"},{"id" : "dmstcMakr","size" : "256","type" : "STRING"},{"id" : "dmstcAscm","size" : "256","type" : "STRING"},{"id" : "dsgnImpr","size" : "256","type" : "STRING"},{"id" : "indvdlImpr","size" : "256","type" : "STRING"}]},"Rows" : [{"selfCertRqisit" : ""}]});
            this.addChild(obj.name, obj);


            obj = new Dataset("dsMnfctList", this);
            obj._setContents({"ColumnInfo" : {"Column" : [{"id" : "fbctnBzentyNo","prop" : "default","size" : "255","type" : "STRING"},{"id" : "bzentyNm","size" : "256","type" : "STRING"},{"id" : "ntnNm","size" : "256","type" : "STRING"},{"id" : "fbctnNm","size" : "256","type" : "STRING"},{"id" : "carmdlAsortNm","size" : "256","type" : "STRING"},{"id" : "psngrSubmAt","size" : "256","type" : "STRING"},{"id" : "psngrSsizeAt","size" : "256","type" : "STRING"},{"id" : "psngrMesiAt","size" : "256","type" : "STRING"},{"id" : "psngrLgzAt","size" : "256","type" : "STRING"},{"id" : "ritgSubmAt","size" : "256","type" : "STRING"},{"id" : "ritgSsizeAt","size" : "256","type" : "STRING"},{"id" : "ritgMesiAt","size" : "256","type" : "STRING"},{"id" : "ritgLgzAt","size" : "256","type" : "STRING"},{"id" : "frghtSubmAt","size" : "256","type" : "STRING"},{"id" : "frghtSsizeAt","size" : "256","type" : "STRING"},{"id" : "frghtMesiAt","size" : "256","type" : "STRING"},{"id" : "frghtLgzAt","size" : "256","type" : "STRING"},{"id" : "spcltSubmAt","size" : "256","type" : "STRING"},{"id" : "spclSsizeAt","size" : "256","type" : "STRING"},{"id" : "spclMesiAt","size" : "256","type" : "STRING"},{"id" : "spclLgzAt","size" : "256","type" : "STRING"},{"id" : "twowhlSubmAt","size" : "256","type" : "STRING"},{"id" : "twowhlSsizeAt","size" : "256","type" : "STRING"},{"id" : "twowhllMesiAt","size" : "256","type" : "STRING"},{"id" : "twowhlLgzAt","size" : "256","type" : "STRING"},{"id" : "selfCertYn","size" : "256","type" : "STRING"},{"id" : "brno","size" : "256","type" : "STRING"},{"id" : "crno","size" : "256","type" : "STRING"},{"id" : "addrNm","size" : "256","type" : "STRING"},{"id" : "rprsvIdecno","size" : "256","type" : "STRING"},{"id" : "rprsvNm","size" : "256","type" : "STRING"},{"id" : "telno","size" : "256","type" : "STRING"},{"id" : "regYmd","size" : "256","type" : "STRING"},{"id" : "inptYmd","size" : "256","type" : "STRING"},{"id" : "rtrcnYmd","size" : "256","type" : "STRING"},{"id" : "rtnYmd","size" : "256","type" : "STRING"},{"id" : "regPrpsSeNm","size" : "256","type" : "STRING"},{"id" : "submYn","size" : "256","type" : "STRING"},{"id" : "ssizeYn","size" : "256","type" : "STRING"},{"id" : "mesiYn","size" : "256","type" : "STRING"},{"id" : "lgzYn","size" : "256","type" : "STRING"},{"id" : "bzentyNo","size" : "256","type" : "STRING"},{"id" : "ctrtBgngYmd","size" : "256","type" : "STRING"},{"id" : "ctrtEndYmd","size" : "256","type" : "STRING"},{"id" : "mbrNm","size" : "256","type" : "STRING"},{"id" : "cvlcptAplyNo","size" : "256","type" : "STRING"},{"id" : "unityAplyRcptNo","size" : "256","type" : "STRING"},{"id" : "aplySeCd","size" : "256","type" : "STRING"},{"id" : "aplyPrcsSttsCd","size" : "256","type" : "STRING"},{"id" : "delYmd","size" : "256","type" : "STRING"},{"id" : "rprsOwnrRegNo","size" : "256","type" : "STRING"},{"id" : "frstMakrNm","size" : "256","type" : "STRING"},{"id" : "aftrMngBzentyNm","size" : "256","type" : "STRING"},{"id" : "aftrMngBzentyNo","size" : "256","type" : "STRING"},{"id" : "aftrMngCtrtBgngYmd","size" : "256","type" : "STRING"},{"id" : "aftrMngCtrtEndYmd","size" : "256","type" : "STRING"}]}});
            this.addChild(obj.name, obj);


            obj = new Dataset("dsSelfCrtfcCode", this);
            obj._setContents({"ColumnInfo" : {"Column" : [{"id" : "code","prop" : "default","size" : "256","type" : "STRING"},{"id" : "code_name","prop" : "default","size" : "256","type" : "STRING"},{"id" : "code_label","prop" : "default","size" : "256","type" : "STRING"}]},"Rows" : [{"code" : "","code_label" : "=  전체 =","code_name" : "=  전체 ="},{"code" : "Y","code_label" : "1 확보","code_name" : "확보"},{"code" : "N","code_label" : "0 미확보","code_name" : "미확보"}]});
            this.addChild(obj.name, obj);


            obj = new Dataset("dsCncAtCode", this);
            obj._setContents({"ColumnInfo" : {"Column" : [{"id" : "code","prop" : "default","size" : "256","type" : "STRING"},{"id" : "code_name","prop" : "default","size" : "256","type" : "STRING"},{"id" : "code_label","prop" : "default","size" : "256","type" : "STRING"}]},"Rows" : [{"code" : "","code_label" : "= 전체 =","code_name" : "= 전체 ="},{"code" : "0","code_label" : "0 미취소","code_name" : "미취소"},{"code" : "1","code_label" : "1 취소","code_name" : "취소"}]});
            this.addChild(obj.name, obj);


            obj = new Dataset("dsSchDtCode", this);
            obj._setContents({"ColumnInfo" : {"Column" : [{"id" : "code","prop" : "default","size" : "256","type" : "STRING"},{"id" : "code_name","prop" : "default","size" : "256","type" : "STRING"},{"id" : "code_label","prop" : "default","size" : "256","type" : "STRING"}]},"Rows" : [{"code" : "","code_label" : "= 전체 =","code_name" : "= 전체 ="},{"code" : "0","code_label" : "0 등록일","code_name" : "등록일"},{"code" : "1","code_label" : "1 변경일","code_name" : "변경일"},{"code" : "2","code_label" : "2 등록취소일","code_name" : "등록취소일"},{"code" : "3","code_label" : "3 반납일","code_name" : "반납일"},{"code" : "4","code_label" : "4 사후관리 계약만료일","code_name" : "사후관리 계약종료일"},{"code" : "5","code_label" : "5 최초제작자 계약종료일","code_name" : "최초제작자 계약종료일"}]});
            this.addChild(obj.name, obj);


            obj = new Dataset("dsRtnAtCode", this);
            obj._setContents({"ColumnInfo" : {"Column" : [{"id" : "code","prop" : "default","size" : "256","type" : "STRING"},{"id" : "code_name","prop" : "default","size" : "256","type" : "STRING"},{"id" : "code_label","prop" : "default","size" : "256","type" : "STRING"}]},"Rows" : [{"code" : "","code_label" : "= 전체 =","code_name" : "= 전체 ="},{"code" : "0","code_label" : "0 미반납","code_name" : "미반납"},{"code" : "1","code_label" : "1 반납","code_name" : "반납"}]});
            this.addChild(obj.name, obj);


            obj = new Dataset("dsCodeGroup", this);
            obj._setContents({"ColumnInfo" : {"Column" : [{"id" : "cdGroupId","prop" : "default","size" : "256","type" : "STRING"},{"id" : "datasetId","prop" : "default","size" : "256","type" : "STRING"},{"id" : "firstSet","prop" : "default","size" : "256","type" : "STRING"},{"id" : "useYn","size" : "256","type" : "STRING"}]},"Rows" : [{"cdGroupId" : "291","datasetId" : "ds00","firstSet" : "","useYn" : ""},{"cdGroupId" : "02","datasetId" : "ds01","firstSet" : "","useYn" : ""}]});
            this.addChild(obj.name, obj);


            obj = new Dataset("ds00", this);
            obj._setContents({"ColumnInfo" : {"Column" : [{"id" : "cd","size" : "256","type" : "STRING"},{"id" : "cdDtls","size" : "256","type" : "STRING"},{"id" : "cdLabel","size" : "256","type" : "STRING"}]}});
            this.addChild(obj.name, obj);


            obj = new Dataset("ds01", this);
            obj._setContents({"ColumnInfo" : {"Column" : [{"id" : "cd","size" : "256","type" : "STRING"},{"id" : "cdDtls","size" : "256","type" : "STRING"},{"id" : "cdLabel","size" : "256","type" : "STRING"}]}});
            this.addChild(obj.name, obj);
            
            // UI Components Initialize
            obj = new Div("divSrchA","0","38",null,"144","0",null,null,null,null,null,this);
            obj.set_cssclass("div_SA");
            obj.set_formscrolltype("none");
            obj.set_taborder("0");
            obj.set_text("Div0");
            this.addChild(obj.name, obj);

            obj = new Static("Static4","20","58","43","28",null,null,null,null,null,null,this.divSrchA.form);
            obj.set_cssclass("sta_SA_label");
            obj.set_taborder("18");
            obj.set_text("종별*");
            this.divSrchA.addChild(obj.name, obj);

            obj = new MultiCombo("asort_lst","Static4:0","58","390","28",null,null,null,null,null,null,this.divSrchA.form);
            obj.set_autoselect("false");
            obj.set_codecolumn("cd");
            obj.set_datacolumn("cdDtls");
            obj.set_innerdataset("ds00");
            obj.set_showselectallcheckbox("false");
            obj.set_taborder("3");
            obj.set_text("mcb00");
            obj.set_index("-1");
            this.divSrchA.addChild(obj.name, obj);

            obj = new Combo("cbSelfCrtfc_S","108","20","108","28",null,null,null,null,null,null,this.divSrchA.form);
            obj.set_codecolumn("code");
            obj.set_datacolumn("code_label");
            obj.set_innerdataset("dsSelfCrtfcCode");
            obj.set_taborder("0");
            obj.set_type("filter");
            obj.set_text("=  전체 =");
            obj.set_value("");
            obj.set_index("0");
            this.divSrchA.addChild(obj.name, obj);

            obj = new Static("Static1","cbSelfCrtfc_S:20","20","49","28",null,null,null,null,null,null,this.divSrchA.form);
            obj.set_cssclass("sta_SA_label");
            obj.set_taborder("16");
            obj.set_text("업체명");
            this.divSrchA.addChild(obj.name, obj);

            obj = new Edit("edtMberNm","Static1:0","20","147","28",null,null,null,null,null,null,this.divSrchA.form);
            obj.getSetter("binddataset").set("dsCond");
            obj.getSetter("column").set("ENTRPS_NM");
            obj.set_maxlength("50");
            obj.set_taborder("1");
            obj.getSetter("userdata").set("업체명");
            this.divSrchA.addChild(obj.name, obj);

            obj = new Static("Static19","20","20","88","28",null,null,null,null,null,null,this.divSrchA.form);
            obj.set_cssclass("sta_SA_label");
            obj.set_taborder("17");
            obj.set_text("자기인증요건");
            this.divSrchA.addChild(obj.name, obj);

            obj = new Static("Static0","20","96","62","28",null,null,null,null,null,null,this.divSrchA.form);
            obj.set_cssclass("sta_SA_label");
            obj.set_taborder("19");
            obj.set_text("취소구분");
            this.divSrchA.addChild(obj.name, obj);

            obj = new Button("btnMaker","edtMberNm:1","20","36","28",null,null,null,null,null,null,this.divSrchA.form);
            obj.set_cssclass("btn_SA_search");
            obj.set_taborder("2");
            this.divSrchA.addChild(obj.name, obj);

            obj = new Edit("edtWmi","976","96","81","28",null,null,null,null,null,null,this.divSrchA.form);
            obj.set_imemode("alpha");
            obj.set_inputmode("upper");
            obj.set_inputtype("alpha,comma,digit,dot,english,number,sign,space");
            obj.set_maxlength("3");
            obj.set_taborder("15");
            obj.getSetter("userdata").set("업체명");
            this.divSrchA.addChild(obj.name, obj);

            obj = new Combo("cboSchGubun","394","96","195","28",null,null,null,null,null,null,this.divSrchA.form);
            obj.set_codecolumn("code");
            obj.getSetter("column").set("code_name");
            obj.set_datacolumn("code_name");
            obj.set_innerdataset("dsSchDtCode");
            obj.set_taborder("11");
            obj.set_type("filter");
            obj.set_index("0");
            this.divSrchA.addChild(obj.name, obj);

            obj = new Calendar("calSchFrDt","599","96","130","28",null,null,null,null,null,null,this.divSrchA.form);
            obj.set_initvalueid("iv_Calendar0");
            obj.set_enable("false");
            obj.getSetter("mindate").set("");
            obj.set_taborder("12");
            obj.set_type("normal");
            obj.getSetter("userdata").set("검색일자");
            this.divSrchA.addChild(obj.name, obj);

            obj = new Calendar("calSchToDt","749","96","130","28",null,null,null,null,null,null,this.divSrchA.form);
            obj.set_initvalueid("iv_Calendar0");
            obj.set_dateformat("yyyy.MM.dd");
            obj.set_enable("false");
            obj.getSetter("maxdate").set("");
            obj.set_taborder("13");
            obj.set_type("normal");
            obj.getSetter("userdata").set("검색일자");
            this.divSrchA.addChild(obj.name, obj);

            obj = new Static("Static25","729","96","20","28",null,null,null,null,null,null,this.divSrchA.form);
            obj.set_cssclass("sta_WF_unit");
            obj.set_taborder("20");
            obj.set_text("~");
            this.divSrchA.addChild(obj.name, obj);

            obj = new CheckBox("chkWmi","895","96","64","28",null,null,null,null,null,null,this.divSrchA.form);
            obj.set_cssclass("chk_RB");
            obj.set_falsevalue("N");
            obj.set_taborder("14");
            obj.set_text("WMI");
            obj.set_truevalue("Y");
            obj.set_value("N");
            this.divSrchA.addChild(obj.name, obj);

            obj = new Static("Static3","212","96","62","28",null,null,null,null,null,null,this.divSrchA.form);
            obj.set_cssclass("sta_SA_label");
            obj.set_taborder("21");
            obj.set_text("반납구분");
            this.divSrchA.addChild(obj.name, obj);

            obj = new Combo("cbRtnde_S","274","96","110","28",null,null,null,null,null,null,this.divSrchA.form);
            obj.getSetter("binddataset").set("dsSearch");
            obj.set_codecolumn("code");
            obj.getSetter("column").set("rtnSe");
            obj.set_datacolumn("code_label");
            obj.set_imemode("none");
            obj.set_innerdataset("dsRtnAtCode");
            obj.set_taborder("10");
            obj.set_type("filter");
            obj.set_text("= 전체 =");
            obj.set_value("");
            obj.set_index("0");
            this.divSrchA.addChild(obj.name, obj);

            obj = new Combo("cbCncde_S","78","96","108","28",null,null,null,null,null,null,this.divSrchA.form);
            obj.getSetter("binddataset").set("dsSearch");
            obj.set_codecolumn("code");
            obj.getSetter("column").set("rtrcnSe");
            obj.set_datacolumn("code_label");
            obj.set_innerdataset("dsCncAtCode");
            obj.set_taborder("9");
            obj.set_type("filter");
            obj.set_text("=  전체 =");
            obj.set_value("");
            obj.set_index("0");
            this.divSrchA.addChild(obj.name, obj);

            obj = new Static("Static00_00","asort_lst:20","58","73","28",null,null,null,null,null,null,this.divSrchA.form);
            obj.set_cssclass("sta_SA_label");
            obj.set_taborder("22");
            obj.set_text("제작구분*");
            this.divSrchA.addChild(obj.name, obj);

            obj = new CheckBox("chkMake0","Static00_00:0","58","57","28",null,null,null,null,null,null,this.divSrchA.form);
            obj.set_falsevalue("N");
            obj.set_taborder("4");
            obj.set_text("전체");
            obj.set_truevalue("Y");
            obj.set_value("Y");
            this.divSrchA.addChild(obj.name, obj);

            obj = new CheckBox("chkMake1","chkMake0:0","58","96","28",null,null,null,null,null,null,this.divSrchA.form);
            obj.set_falsevalue("99");
            obj.set_taborder("5");
            obj.set_text("국내제작자");
            obj.set_truevalue("Y");
            obj.set_value("Y");
            this.divSrchA.addChild(obj.name, obj);

            obj = new CheckBox("chkMake2","chkMake1:0","58","96","28",null,null,null,null,null,null,this.divSrchA.form);
            obj.set_falsevalue("99");
            obj.set_taborder("6");
            obj.set_text("국내조립자");
            obj.set_truevalue("Y");
            obj.set_value("true");
            this.divSrchA.addChild(obj.name, obj);

            obj = new CheckBox("chkMake3","chkMake2:0","58","96","28",null,null,null,null,null,null,this.divSrchA.form);
            obj.set_falsevalue("99");
            obj.set_taborder("7");
            obj.set_text("지정수입자");
            obj.set_truevalue("1");
            obj.set_value("true");
            this.divSrchA.addChild(obj.name, obj);

            obj = new CheckBox("chkMake4","chkMake3:0","58","127","28",null,null,null,null,null,null,this.divSrchA.form);
            obj.set_falsevalue("99");
            obj.set_taborder("8");
            obj.set_text("개인/병행수입자");
            obj.set_truevalue("2");
            obj.set_value("true");
            this.divSrchA.addChild(obj.name, obj);

            obj = new Static("stUnmasking",null,"96","109","24","72",null,null,null,null,null,this.divSrchA.form);
            obj.set_cssclass("sta_WF_security");
            obj.set_fittocontents("width");
            obj.set_taborder("23");
            obj.set_text("개인정보 열람");
            this.divSrchA.addChild(obj.name, obj);

            obj = new CheckBox("chkUnmasking",null,"96","42","24","20",null,null,null,null,null,this.divSrchA.form);
            obj.set_cssclass("chk_WF_toggle");
            obj.getSetter("pvrcFlag").set("true");
            obj.set_taborder("24");
            obj.set_text("");
            this.divSrchA.addChild(obj.name, obj);

            obj = new Button("Button00","946","17","176","35",null,null,null,null,null,null,this.divSrchA.form);
            obj.set_taborder("25");
            obj.set_text("동작 확인");
            this.divSrchA.addChild(obj.name, obj);

            obj = new Edit("Edit00","520","13","273","45",null,null,null,null,null,null,this.divSrchA.form);
            obj.set_taborder("26");
            this.divSrchA.addChild(obj.name, obj);

            obj = new Div("div01","0","divSrchA:0",null,null,"0","0",null,null,null,null,this);
            obj.set_formscrolltype("none");
            obj.set_taborder("2");
            obj.set_text("Div0");
            this.addChild(obj.name, obj);

            obj = new Div("divTotal",null,"14","190",null,"0","552",null,null,null,null,this.div01.form);
            obj.getSetter("bindtotal").set("dsMnfctList");
            obj.set_taborder("1");
            obj.set_visible("true");
            this.div01.addChild(obj.name, obj);

            obj = new Div("divTopBtn02",null,"0","508","28","0",null,null,null,null,null,this);
            obj.set_formscrolltype("none");
            obj.set_taborder("1");
            obj.set_text("Div0");
            this.addChild(obj.name, obj);

            obj = new Button("btnClose0","437","0","69","28",null,null,null,null,null,null,this.divTopBtn02.form);
            obj.set_cssclass("btn_comm_F0");
            obj.set_taborder("1");
            obj.set_text("F9 닫기");
            this.divTopBtn02.addChild(obj.name, obj);

            obj = new Button("btnCancel0","346","0","89","28",null,null,null,null,null,null,this.divTopBtn02.form);
            obj.set_cssclass("btn_comm_F0");
            obj.set_taborder("0");
            obj.set_text("F10 초기화");
            this.divTopBtn02.addChild(obj.name, obj);

            obj = new Button("btnExcel0","267","0","77","28",null,null,null,null,null,null,this.divTopBtn02.form);
            obj.set_cssclass("btn_comm_F0");
            obj.set_taborder("3");
            obj.set_text("F11 엑셀");
            this.divTopBtn02.addChild(obj.name, obj);

            obj = new Button("btnPrint0","196","0","69","28",null,null,null,null,null,null,this.divTopBtn02.form);
            obj.set_cssclass("btn_comm_F0");
            obj.set_taborder("2");
            obj.set_text("F6 인쇄");
            this.divTopBtn02.addChild(obj.name, obj);

            obj = new Button("btnRetrieve0","125","0","69","28",null,null,null,null,null,null,this.divTopBtn02.form);
            obj.set_cssclass("btn_comm_F0");
            obj.set_taborder("4");
            obj.set_text("F4 조회");
            this.divTopBtn02.addChild(obj.name, obj);

            // Layout Functions
            //-- Default Layout : this.divSrchA.form
            obj = new Layout("default","",0,0,this.divSrchA.form,function(p){});
            this.divSrchA.form.addLayout(obj.name, obj);

            //-- Default Layout : this.div01.form.divTotal.form
            obj = new Layout("default","",0,0,this.div01.form.divTotal.form,function(p){});
            this.div01.form.divTotal.form.addLayout(obj.name, obj);

            //-- Default Layout : this.div01.form
            obj = new Layout("default","",0,0,this.div01.form,function(p){});
            this.div01.form.addLayout(obj.name, obj);

            //-- Default Layout : this.divTopBtn02.form
            obj = new Layout("default","",0,0,this.divTopBtn02.form,function(p){});
            this.divTopBtn02.form.addLayout(obj.name, obj);

            //-- Default Layout : this
            obj = new Layout("default","",1288,770,this,function(p){});
            this.addLayout(obj.name, obj);
            
            // BindItem Information
            obj = new BindItem("divSrchA_form_edtMberNm_value","divSrchA.form.edtMberNm","value","dsSearch","bzentyNm");
            this.addChild(obj.name, obj);
            obj.bind();

            obj = new BindItem("divSrchA_form_cbSelfCrtfc_S_value","divSrchA.form.cbSelfCrtfc_S","value","dsSearch","selfCertRqisit");
            this.addChild(obj.name, obj);
            obj.bind();

            obj = new BindItem("divSrchA_form_cbCncde_S_value","divSrchA.form.cbCncde_S1","value","dsSearch","rtrcnSe");
            this.addChild(obj.name, obj);
            obj.bind();

            obj = new BindItem("divSrchA_form_cbRtnde_S_value","divSrchA.form.cbRtnde_S1","value","dsSearch","rtnSe");
            this.addChild(obj.name, obj);
            obj.bind();

            obj = new BindItem("item0","divSrchA.form.asort_lst","value","dsSearch","asort");
            this.addChild(obj.name, obj);
            obj.bind();

            obj = new BindItem("item1","divSrchA.form.makrSe_lst","imemode","dsSearch","makrSe");
            this.addChild(obj.name, obj);
            obj.bind();

            obj = new BindItem("item3","divSrchA.form.cboSchGubun","value","dsSearch","rtnDtlSe");
            this.addChild(obj.name, obj);
            obj.bind();

            obj = new BindItem("item7","divSrchA.form.cbRtnde_S1","value","dsSearch","cncde");
            this.addChild(obj.name, obj);
            obj.bind();

            obj = new BindItem("item8","divSrchA.form.cbRtnde_S1","imemode","dsSearch","rtrcnSe");
            this.addChild(obj.name, obj);
            obj.bind();

            obj = new BindItem("item2","divSrchA.form.cbRtnde_S","value","dsSearch","rtnSe");
            this.addChild(obj.name, obj);
            obj.bind();

            obj = new BindItem("item9","divSrchA.form.cbCncde_S","value","dsSearch","rtrcnSe");
            this.addChild(obj.name, obj);
            obj.bind();

            obj = new BindItem("item10","divSrchA.form.cbCncde_S00","value","dsSearch","selfCertRqisit");
            this.addChild(obj.name, obj);
            obj.bind();

            obj = new BindItem("item11","divSrchA.form.calSchToDt","value","dsSearch","endYmd");
            this.addChild(obj.name, obj);
            obj.bind();

            obj = new BindItem("item4","divSrchA.form.calSchFrDt","value","dsSearch","bgngYmd");
            this.addChild(obj.name, obj);
            obj.bind();

            obj = new BindItem("item5","divSrchA.form.chkWmi","value","dsSearch","chkWMI");
            this.addChild(obj.name, obj);
            obj.bind();
            
            // TriggerItem Information

        };
        
        this.loadPreloadList = function()
        {

        };
        
        // User Script
        this.registerScript("RP_102131.xfdl", function() {


        this.divSrchA_Button00_onclick = function(obj,e)
        {
        	if(this.divSrchA.form.chkMake0.value == "Y" &&this.divSrchA.form.chkMake1.value == "Y" && this.divSrchA.form.chkMake2.value == "Y" && this.divSrchA.form.chkMake3.value == "1" && this.divSrchA.form.chkMake4.value == "2")
        		this.divSrchA.form.Edit00.set_value("OK");
        	else
        		this.divSrchA.form.Edit00.set_value("NG");
        };

        });
        
        // Regist UI Components Event
        this.on_initEvent = function()
        {
            this.addEventHandler("onload",this.form_OnLoadCompleted,this);
            this.divSrchA.form.asort_lst.addEventHandler("onitemchanged",this.divSrchA_asort_lst_onitemchanged,this);
            this.divSrchA.form.edtMberNm.addEventHandler("onkeydown",this.edtMberNm_OnKeyDown,this);
            this.divSrchA.form.btnMaker.addEventHandler("onclick",this.btnMaker_OnClick,this);
            this.divSrchA.form.cboSchGubun.addEventHandler("onitemchanged",this.divSrchA_cboSchGubun_onitemchanged,this);
            this.divSrchA.form.chkWmi.addEventHandler("onclick",this.divSrchA_chkWmi_onclick,this);
            this.divSrchA.form.chkMake0.addEventHandler("onclick",this.chkMake0_OnClick,this);
            this.divSrchA.form.chkMake1.addEventHandler("onclick",this.fn_chckBoxInit,this);
            this.divSrchA.form.chkMake2.addEventHandler("onclick",this.fn_chckBoxInit,this);
            this.divSrchA.form.chkMake3.addEventHandler("onclick",this.fn_chckBoxInit,this);
            this.divSrchA.form.chkMake4.addEventHandler("onclick",this.fn_chckBoxInit,this);
            this.divSrchA.form.chkUnmasking.addEventHandler("onchanged",this.chkUnmasking_onchanged,this);
            this.divSrchA.form.Button00.addEventHandler("onclick",this.divSrchA_Button00_onclick,this);
            this.divTopBtn02.form.btnClose0.addEventHandler("onclick",this.btnClose0_OnClick,this);
            this.divTopBtn02.form.btnCancel0.addEventHandler("onclick",this.btnCancel0_OnClick,this);
            this.divTopBtn02.form.btnExcel0.addEventHandler("onclick",this.BtnExcel0_OnClick,this);
            this.divTopBtn02.form.btnPrint0.addEventHandler("onclick",this.BtnPrint0_OnClick,this);
            this.divTopBtn02.form.btnRetrieve0.addEventHandler("onclick",this.btnRetrieve0_OnClick,this);
        };

        this.loadIncludeScript("RP_102131.xfdl");
        this.loadPreloadList();
        
        // Remove Reference
        obj = null;
    };
}
)();
