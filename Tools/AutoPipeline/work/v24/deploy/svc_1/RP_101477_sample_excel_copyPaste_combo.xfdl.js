(function()
{
    return function()
    {
        if (!this._is_form)
            return;
        
        var obj = null;
        
        this.on_create = function()
        {
            this.set_name("sample_excel_copyPaste");
            this.set_titletext("New Form");
            this.getSetter("classname").set("sample_excel_copyPaste");
            if (Form == this.constructor)
            {
                this._setFormPosition(1024,768);
            }
            
            // Object(Dataset, ExcelExportObject) Initialize
            obj = new Dataset("productionPlanList", this);
            obj.set_enableevent("true");
            obj.getSetter("firefirstcount").set("0");
            obj.getSetter("firenextcount").set("0");
            obj.set_loadfiltermode("keep");
            obj.set_loadkeymode("keep");
            obj.set_reversesubsum("false");
            obj.set_updatecontrol("true");
            obj.set_useclientlayout("false");
            obj._setContents({"ColumnInfo" : {"Column" : [{"id" : "SAENGSAN_PLAN_NO","size" : "256","type" : "STRING"},{"id" : "SAENGSAN_GYEHOEK","size" : "256","type" : "STRING"},{"id" : "SAENGSAN_PLAN_DE","size" : "256","type" : "STRING"},{"id" : "SAENGSAN_GYEHOEK_NO_AUTO","size" : "256","type" : "STRING"},{"id" : "SAENGSAN_BUSEO","size" : "256","type" : "STRING"},{"id" : "SAENGSAN_PLANJA","size" : "256","type" : "STRING"},{"id" : "JEPUM_CD","size" : "256","type" : "STRING"},{"id" : "JEPUM_NM","size" : "256","type" : "STRING"},{"id" : "JUNGRYANG","size" : "256","type" : "BIGDECIMAL"},{"id" : "BATCH_SU","size" : "256","type" : "BIGDECIMAL"}]},"Rows" : [{"SAENGSAN_PLAN_NO" : "2","SAENGSAN_GYEHOEK" : "2","SAENGSAN_PLAN_DE" : "11","SAENGSAN_GYEHOEK_NO_AUTO" : "","SAENGSAN_BUSEO" : "","SAENGSAN_PLANJA" : "","JEPUM_CD" : "","JEPUM_NM" : "","JUNGRYANG" : "","BATCH_SU" : ""},{"SAENGSAN_PLAN_NO" : "1","SAENGSAN_GYEHOEK" : "1","SAENGSAN_PLAN_DE" : "22","SAENGSAN_GYEHOEK_NO_AUTO" : "","SAENGSAN_BUSEO" : "","SAENGSAN_PLANJA" : "","JEPUM_CD" : "","JEPUM_NM" : "","JUNGRYANG" : "","BATCH_SU" : ""},{"SAENGSAN_PLAN_NO" : "3","SAENGSAN_GYEHOEK" : "3","SAENGSAN_PLAN_DE" : "33","SAENGSAN_GYEHOEK_NO_AUTO" : "","SAENGSAN_BUSEO" : "","SAENGSAN_PLANJA" : "","JEPUM_CD" : "","JEPUM_NM" : "","JUNGRYANG" : "","BATCH_SU" : ""},{"SAENGSAN_PLAN_NO" : "","SAENGSAN_GYEHOEK" : "","SAENGSAN_PLAN_DE" : "","SAENGSAN_GYEHOEK_NO_AUTO" : "","SAENGSAN_BUSEO" : "","SAENGSAN_PLANJA" : "","JEPUM_CD" : "","JEPUM_NM" : "","JUNGRYANG" : "","BATCH_SU" : ""},{},{},{},{},{}]});
            this.addChild(obj.name, obj);


            obj = new Dataset("cboDs", this);
            obj._setContents({"ColumnInfo" : {"Column" : [{"id" : "code","size" : "256","type" : "STRING"},{"id" : "value","size" : "256","type" : "STRING"}]},"Rows" : [{"code" : "1","value" : "넥사크로17"},{"code" : "2","value" : "넥사크로N"},{"code" : "3","value" : "넥사크로"}]});
            this.addChild(obj.name, obj);
            
            // UI Components Initialize
            obj = new Button("Button00","370","155","120","50",null,null,null,null,null,null,this);
            obj.set_taborder("1");
            obj.set_text("Button00");
            this.addChild(obj.name, obj);

            obj = new Edit("Edit00","257","295","445","88",null,null,null,null,null,null,this);
            obj.set_taborder("1");
            obj.set_value("bbb");
            obj.set_text("bbb");
            this.addChild(obj.name, obj);

            // Layout Functions
            //-- Default Layout : this
            obj = new Layout("default","",this._adjust_width,this._adjust_height,this,function(p){});
            this.addLayout(obj.name, obj);
            
            // BindItem Information

            
            // TriggerItem Information

        };
        
        this.loadPreloadList = function()
        {

        };
        
        // User Script
        this.registerScript("RP_101477_sample_excel_copyPaste_combo.xfdl", function() {
        //
        // this.Grid00_onkeydown = function(obj:Grid, e:nexacro.KeyEventInfo)
        // {
        // 	//trace(obj.getEditCaret());
        // 	if (obj.getEditCaret() == 0) return;
        //
        // 	if(e.ctrlkey && e.keycode == 86) //ctrl+v
        // 	{
        // 		//복사(Ctrl + C), 붙여넣기(Ctrl + V) 키입력처리 공통함수 호출
        // 		//this.gfn_grdCopy_Paste(obj, e);
        // 		this.gfn_grdCopy_Paste(obj, e);
        // 	} else if(e.ctrlkey && e.keycode == 67){
        // 		this.gfn_grdCopy_Paste(obj, e);
        // 	}
        //
        // }
        //
        //
        // this.gfn_grdCopy_Paste = function (obj, e)
        // {
        // 	if(e.ctrlkey){
        // 	//trace("!!!!!");
        // 		if(e.keycode == 67){
        // 						/*
        // 						trace("obj.selectstartrow $$$ "+obj.selectstartrow);
        // 						trace("(obj.selectendrow $$$ "+obj.selectendrow);
        // 						trace("(obj.selectstartcol $$$ "+obj.selectstartcol);
        // 						trace("(obj.selectendcol $$$ "+obj.selectendcol);
        // 						*/
        // 			var strGrdDsNm = obj.binddataset;
        // 			var v_clip = "";
        // 			var strSeperate = "	";
        // 			for (var i= nexacro.toNumber(obj.selectstartrow);i<= nexacro.toNumber(obj.selectendrow);i++) {
        // 				for (var j=nexacro.toNumber(obj.selectstartcol);j<=nexacro.toNumber(obj.selectendcol);j++) {
        //
        // 					if (j < obj.selectendcol) {
        //
        // 						v_clip += obj.getCellValue(i,j) + strSeperate;
        //
        // 					} else {
        //
        // 							//trace("-------------1-------------"+ obj.getCellProperty("body", j, "displaytype"));
        // 						if(obj.getCellProperty("body", j, "displaytype")=="combocontrol"||obj.getCellProperty("body", j, "displaytype")=="combotext"){
        // 							var curVal = obj.getCellValue(i,j);
        // 							//trace("-------------2-------------"+ curVal);
        // 							var fRow = this.cboDs.findRow("code", curVal);
        // 							var cboVal = this.cboDs.getColumn(fRow, "value");
        // 							//trace("-------------3-------------"+ cboVal);
        //
        // 							v_clip += cboVal;
        // 						} else {
        // 							v_clip += obj.getCellValue(i,j);
        // 						}
        // 					}
        // 				}
        // 				if (i < obj.selectendrow) {
        // 					v_clip += "\r\n";
        // 				}
        // 			}
        // 			v_clip += "\r\n";
        // 			system.clearClipboard();
        // 			system.setClipboard("CF_TEXT",v_clip);
        // 			//trace(system.navigatorname);
        // 			if(system.navigatorname == "Edge" || system.navigatorname == "Chrome" || system.navigatorname == "Gecko"){
        // 			//trace("copyThis");
        // 				copyThis(v_clip);//크롬에서 복사 처리를 위해 index.html에 정의한 함수 호출.
        // 			}
        //
        // 			//trace("strGrdDsNm " + strGrdDsNm);
        // 			//trace("v_clip " + v_clip);
        //
        // 		} else if(e.keycode == 86) {
        //
        // 		//Chrome브라우저 일 경우 popupdiv를 띄워준다.
        // 		if(system.navigatorname == "Edge" || system.navigatorname == "Chrome" || system.navigatorname == "Gecko"){
        // 			this.PopupDiv00.trackPopup(400,200);
        //             this.PopupDiv00.form.TextArea00.setFocus();
        // 		}else{
        //
        // 			var bAddrow = true;
        // 			if (!this.utlf_IsNull(this.gfn_grdCopy_Paste.arguments[2])) {
        // 				bAddrow = this.gfn_grdCopy_Paste.arguments[2];
        // 			}
        // 			//Grid Binddataset
        // 			var strGrdDsNm = obj.binddataset;
        // 			//cell count
        // 			var nGrdCellCnt = obj.getCellCount("body");
        // 			//cell position
        // 			var nGrdCellPos = obj.getCellPos();
        //
        // 			//trace("nGrdCellPos  " + nGrdCellPos);
        // 			//row position
        // 			var nRowPos = eval("this." + strGrdDsNm).rowposition;
        //
        // 			//trace("nRowPos  " + nRowPos);
        //
        // 			//arrText2 index
        // 			var k = 0;
        // 			//Dataset rowcount
        // 			var nDsRowCnt = eval("this." + strGrdDsNm).getRowCount();
        //
        // 			//trace("nDsRowCnt  " + nDsRowCnt);
        //
        // 			//var t_clip = system.getClipboard("CF_UNICODETEXT");
        // 			var t_clip = system.getClipboard("CF_TEXT");
        //
        // 			var strText = new String(t_clip);
        // 			var arrText = new Array();
        // 			var arrText2 = new Array();
        // 			arrText = strText.split("\r\n");
        // 			/*
        // 			trace("t_clip " + t_clip);
        // 			trace("strText " + strText);
        // 			trace("arrText " + arrText);
        // 			trace("arrText2 " + arrText2);
        // 			*/
        //
        // 			if (nDsRowCnt < (arrText.length + nRowPos -1)) {
        // 				if (bAddrow) {
        //
        // 				} else {
        // 					return false;
        // 				}
        // 			}
        // 			//복사한 Row만큼
        // 			var oDs =  eval("this." + strGrdDsNm);
        // 			for (var i=0;i<arrText.length;i++) {
        //
        // 				if (this.utlf_IsNull(arrText[i])) {
        // 					return;
        // 				}
        // 				arrText2 = arrText[i].split("	");
        //
        // 				//trace("arrText2:" + arrText2);
        //
        // 				//기존 dataset갯수보다 많은 경우
        // 				if ( nDsRowCnt <= nRowPos) {
        // 					var nAddrow = oDs.addRow();
        // 				}
        //
        // 				var nLoopCnt = (nGrdCellPos + arrText2.length);
        // 				if (nLoopCnt > nGrdCellCnt) {
        // 					nLoopCnt = nGrdCellCnt;
        // 				}
        //
        // 				//Dataset setcolumn
        // 				//trace("nGrdCellPos  " + nGrdCellPos);
        // 				//trace("nLoopCnt  " + nLoopCnt);
        //
        // 				k = 0;
        // 				for (var j=nGrdCellPos;j<nLoopCnt;j++) {
        // 					var colid = obj.getCellProperty("body", j, "text").substr(5);
        //
        // 					oDs.setColumn(nRowPos, colid, arrText2[k]);
        //
        // 					k++;
        // 				}
        // 				nRowPos++;
        // 				eval("this." + strGrdDsNm).rowposition = nRowPos;
        // 			}
        // 			return true;
        // 		}
        //
        //
        //  		}
        // 	}
        // }
        //
        // //Chrome 브라우저용 메소드
        // this.fn_paste = function(obj,str)
        // {
        // 		var bAddrow = true;
        //
        // 			//Grid Binddataset
        // 			var strGrdDsNm = obj.binddataset;
        // 			//cell count
        // 			var nGrdCellCnt = obj.getCellCount("body");
        // 			//cell position
        // 			var nGrdCellPos = obj.getCellPos();
        //
        // 			//trace("nGrdCellPos  " + nGrdCellPos);
        // 			//row position
        // 			var nRowPos = eval("this." + strGrdDsNm).rowposition;
        //
        // 			//trace("nRowPos  " + nRowPos);
        //
        // 			//arrText2 index
        // 			var k = 0;
        // 			//Dataset rowcount
        // 			var nDsRowCnt = eval("this." + strGrdDsNm).getRowCount();
        //
        // 			//trace("nDsRowCnt  " + nDsRowCnt);
        //
        // 			//var t_clip = system.getClipboard("CF_UNICODETEXT");
        // 			//var t_clip = system.getClipboard("CF_TEXT");
        // 			//클립보드 사용이 불가 하기 때문에 textarea에서 넘겨받은 값을 이용.
        // 			var t_clip = str;
        //
        // 			var strText = new String(t_clip);
        // 			var arrText = new Array();
        // 			var arrText2 = new Array();
        // 			arrText = strText.split("\n");//넥사크로에서는 줄바꿈을 \n 으로 사용.
        // 			/*
        // 			trace("t_clip " + t_clip);
        // 			trace("strText " + strText);
        // 			trace("arrText " + arrText);
        // 			trace("arrText2 " + arrText2);
        // 			*/
        //
        // 			if (nDsRowCnt < (arrText.length + nRowPos -1)) {
        // 				if (bAddrow) {
        //
        // 				} else {
        // 					return false;
        // 				}
        // 			}
        // 			//복사한 Row만큼
        // 			var oDs =  eval("this." + strGrdDsNm);
        // 			for (var i=0;i<arrText.length;i++) {
        //
        // 				if (this.utlf_IsNull(arrText[i])) {
        // 					return;
        // 				}
        // 				arrText2 = arrText[i].split("	");
        //
        // 				//trace("arrText2:" + arrText2);
        //
        // 				//기존 dataset갯수보다 많은 경우
        // 				if ( nDsRowCnt <= nRowPos) {
        // 					var nAddrow = oDs.addRow();
        // 				}
        //
        // 				var nLoopCnt = (nGrdCellPos + arrText2.length);
        // 				if (nLoopCnt > nGrdCellCnt) {
        // 					nLoopCnt = nGrdCellCnt;
        // 				}
        //
        // 				//Dataset setcolumn
        // 				//trace("nGrdCellPos  " + nGrdCellPos);
        // 				//trace("nLoopCnt  " + nLoopCnt);
        //
        // 				k = 0;
        // 				for (var j=nGrdCellPos;j<nLoopCnt;j++) {
        // 					var colid = obj.getCellProperty("body", j, "text").substr(5);
        //
        // 					oDs.setColumn(nRowPos, colid, arrText2[k]);
        //
        // 					k++;
        // 				}
        // 				nRowPos++;
        // 				eval("this." + strGrdDsNm).rowposition = nRowPos;
        // 			}
        // 			return true;
        //
        // }
        //
        // /**
        //
        // * Null에 해당하는 값 체크.
        // * @param : sValue - Null 확인 값
        // * @return : true/false
        // * @example : utlf_IsNull(sValue);
        // */
        // this.utlf_IsNull = function (sValue)
        // {
        // 	if( new String(sValue).valueOf() == "undefined")
        // 		return true;
        // 	if( sValue == null )
        // 		return true;
        // 	if( ("x"+sValue == "xNaN") && ( new String(sValue.length).valueOf() == "undefined" ) )
        // 		return true;
        // 	if( sValue.length == 0 )
        // 		return true;
        // 	return false;
        // }
        // this.PopupDiv00_Button00_onclick = function(obj:nexacro.Button,e:nexacro.ClickEventInfo)
        // {
        // 	this.PopupDiv00.closePopup();
        // };
        //
        // this.PopupDiv00_oncloseup = function(obj:nexacro.PopupDiv,e:nexacro.EventInfo)
        // {
        // 	this.fn_paste(this.Grid00,this.PopupDiv00.form.TextArea00.value);
        // 	this.PopupDiv00.form.TextArea00.set_value("");
        // };
        //
        // this.productionPlanList_oncolumnchanged = function(obj:nexacro.NormalDataset,e:nexacro.DSColChangeEventInfo)
        // {
        // 	trace(e.row);
        // 	this.lfn_Dialog("frmpop"+e.row, "Base::searchPop.xfdl", "", 0, 0, 800, 651, true, "f_pop_callback");
        // };

        this.lfn_Dialog = function (sFormId, sUrl, sArg, nLeft, nTop, nWidth, nHeight, bModeless, sCallbackFunc)
        {

        };

        this.Button00_onclick = function(obj,e)
        {
        	//this.lfn_Dialog("test1", "Base::searchPop.xfdl", "", 0, 0, 800, 651, true, "f_pop_callback");

        	var objFrame = new ChildFrame();
        	var objParentFrame = this.getOwnerFrame();

        	objFrame.init( "modalsync00", 0, 0, 250, 250);
        	objFrame.set_formurl("svc_1::RP_101477_test_pop.xfdl");

        	var vRtn  = system.showModalSync(objFrame , "moda1" , objParentFrame, "", this);

        	this.Edit00.set_value("OK");
        	var rtn = this.Edit00.getElement();
        	trace(rtn);

        };



        });
        
        // Regist UI Components Event
        this.on_initEvent = function()
        {
            this.addEventHandler("onload",this.sample_excel_copyPaste_onload,this);
            this.addEventHandler("ontimer",this.sample_excel_copyPaste_ontimer,this);
            this.Button00.addEventHandler("onclick",this.Button00_onclick,this);
            this.productionPlanList.addEventHandler("cancolumnchange",this.productionPlanList_cancolumnchange,this);
            this.productionPlanList.addEventHandler("oncolumnchanged",this.productionPlanList_oncolumnchanged,this);
            this.productionPlanList.addEventHandler("onrowposchanged",this.productionPlanList_onrowposchanged,this);
        };

        this.loadIncludeScript("RP_101477_sample_excel_copyPaste_combo.xfdl");
        this.loadPreloadList();
        
        // Remove Reference
        obj = null;
    };
}
)();
