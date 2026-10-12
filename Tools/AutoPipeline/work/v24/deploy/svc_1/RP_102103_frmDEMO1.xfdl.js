(function()
{
    return function()
    {
        if (!this._is_form)
            return;
        
        var obj = null;
        
        this.on_create = function()
        {
            this.set_name("frmDEMO1");
            this.set_titletext("New Form");
            if (Form == this.constructor)
            {
                this._setFormPosition(1080,720);
            }
            
            // Object(Dataset, ExcelExportObject) Initialize
            obj = new Dataset("Dataset00", this);
            obj._setContents({"ColumnInfo" : {"Column" : [{"id" : "Column0","size" : "256","type" : "STRING"}]},"Rows" : [{}]});
            this.addChild(obj.name, obj);
            
            // UI Components Initialize
            obj = new TextField("TextField00_00_00","43","358","450","86",null,null,null,null,null,null,this);
            obj.set_cssclass("text_right");
            obj.set_footerheight("22");
            obj.set_headerheight("8");
            obj.set_inputtype("text");
            obj.set_labelfloatingfixed("false");
            obj.set_labelposition("overlap");
            obj.set_labeltext("Email");
            obj.set_maxlength("16");
            obj.set_postfixtext("@nexacro.com");
            obj.set_taborder("0");
            obj.set_usecharcount("false");
            obj.set_usehelpertext("true");
            obj.set_useleadingbutton("false");
            obj.set_usetrailingbutton("false");
            obj.set_contentheight("56");
            this.addChild(obj.name, obj);

            obj = new TextField("TextField00","40","37","450","86",null,null,null,null,null,null,this);
            obj.set_footerheight("22");
            obj.set_headerheight("8");
            obj.set_helpertext("日中連絡の取れる番号入力してください");
            obj.set_inputtype("text");
            obj.set_labelfloatingfixed("false");
            obj.set_labelposition("overlap");
            obj.set_labeltext("電話番号");
            obj.set_maxlength("25");
            obj.set_taborder("1");
            obj.set_usecharcount("false");
            obj.set_usehelpertext("true");
            obj.set_useleadingbutton("false");
            obj.set_usetrailingbutton("false");
            obj.set_contentheight("56");
            this.addChild(obj.name, obj);

            obj = new TextField("TextField00_00","40","204","450","86",null,null,null,null,null,null,this);
            obj.set_cssclass("text_right");
            obj.set_footerheight("22");
            obj.set_headerheight("8");
            obj.set_inputtype("tel");
            obj.set_labelfloatingfixed("false");
            obj.set_labelposition("overlap");
            obj.set_labeltext("金額");
            obj.set_maxlength("16");
            obj.set_prefixtext("＄");
            obj.set_taborder("2");
            obj.set_usecharcount("true");
            obj.set_usehelpertext("true");
            obj.set_useleadingbutton("false");
            obj.set_usetrailingbutton("false");
            obj.set_contentheight("56");
            this.addChild(obj.name, obj);

            obj = new Div("Div00","543","38","507","662",null,null,null,null,null,null,this);
            obj.set_border("1px solid silver");
            obj.set_taborder("3");
            obj.set_text("Div00");
            this.addChild(obj.name, obj);

            obj = new TextField("TextField00","27","35","450","86",null,null,null,null,null,null,this.Div00.form);
            obj.set_footerheight("22");
            obj.set_headerheight("8");
            obj.set_helpertext("日中連絡の取れる番号入力してください");
            obj.set_inputtype("text");
            obj.set_labelfloatingfixed("false");
            obj.set_labelposition("overlap");
            obj.set_labeltext("電話番号");
            obj.set_maxlength("25");
            obj.set_taborder("0");
            obj.set_usecharcount("false");
            obj.set_usehelpertext("true");
            obj.set_useleadingbutton("false");
            obj.set_usetrailingbutton("false");
            obj.set_contentheight("56");
            this.Div00.addChild(obj.name, obj);

            obj = new TextField("TextField00_00","27","202","450","86",null,null,null,null,null,null,this.Div00.form);
            obj.set_cssclass("text_right");
            obj.set_footerheight("22");
            obj.set_headerheight("8");
            obj.set_inputtype("tel");
            obj.set_labelfloatingfixed("false");
            obj.set_labelposition("overlap");
            obj.set_labeltext("金額");
            obj.set_maxlength("16");
            obj.set_prefixtext("＄");
            obj.set_taborder("1");
            obj.set_usecharcount("true");
            obj.set_usehelpertext("true");
            obj.set_useleadingbutton("false");
            obj.set_usetrailingbutton("false");
            obj.set_contentheight("56");
            this.Div00.addChild(obj.name, obj);

            obj = new TextField("TextField00_00_00","30","356","450","86",null,null,null,null,null,null,this.Div00.form);
            obj.set_cssclass("text_right");
            obj.set_footerheight("22");
            obj.set_headerheight("8");
            obj.set_inputtype("text");
            obj.set_labelfloatingfixed("false");
            obj.set_labelposition("overlap");
            obj.set_labeltext("Email");
            obj.set_maxlength("16");
            obj.set_postfixtext("@nexacro.com");
            obj.set_taborder("2");
            obj.set_usecharcount("false");
            obj.set_usehelpertext("true");
            obj.set_useleadingbutton("false");
            obj.set_usetrailingbutton("false");
            obj.set_contentheight("56");
            this.Div00.addChild(obj.name, obj);

            obj = new DateField("DateField00","70","534","222","73",null,null,null,null,null,null,this.Div00.form);
            obj.set_helpertext("날짜입력");
            obj.set_labeltext("DateField00");
            obj.set_taborder("3");
            obj.set_usehelpertext("true");
            this.Div00.addChild(obj.name, obj);

            obj = new MultiLineTextField("MultiLineTextField00_00","227","491","174","100",null,null,null,null,null,null,this.Div00.form);
            obj.set_helpertext("텍스트입력");
            obj.set_labeltext("MultiLineTextField00");
            obj.set_taborder("4");
            obj.set_usehelpertext("true");
            this.Div00.addChild(obj.name, obj);

            obj = new DateField("DateField00","43","497","222","73",null,null,null,null,null,null,this);
            obj.set_helpertext("날짜입력");
            obj.set_labeltext("DateField00");
            obj.set_taborder("4");
            obj.set_usehelpertext("true");
            this.addChild(obj.name, obj);

            obj = new MultiLineTextField("MultiLineTextField00","283","503","174","100",null,null,null,null,null,null,this);
            obj.set_helpertext("텍스트입력");
            obj.set_labeltext("MultiLineTextField00");
            obj.set_taborder("5");
            obj.set_usehelpertext("true");
            this.addChild(obj.name, obj);

            obj = new Button("Button00","16","631","146","47",null,null,null,null,null,null,this);
            obj.set_taborder("6");
            obj.set_text("Button00");
            this.addChild(obj.name, obj);

            obj = new TextArea("TextArea00","181","632","332","144",null,null,null,null,null,null,this);
            obj.set_taborder("7");
            this.addChild(obj.name, obj);

            // Layout Functions
            //-- Default Layout : this.Div00.form
            obj = new Layout("default","",0,0,this.Div00.form,function(p){});
            obj.set_flexwrap("wrap");
            obj.set_spacing("5px");
            obj.set_type("horizontal");
            obj.set_verticalgap("76");
            this.Div00.form.addLayout(obj.name, obj);

            //-- Default Layout : this
            obj = new Layout("default","",1080,720,this,function(p){});
            obj.set_horizontalgap("0");
            obj.set_mobileorientation("landscape");
            obj.set_spacing("0px");
            obj.set_tabletemplate("1* / 1*");
            obj.set_type("default");
            obj.set_verticalgap("0");
            this.addLayout(obj.name, obj);
            
            // BindItem Information

            
            // TriggerItem Information

        };
        
        this.loadPreloadList = function()
        {

        };
        
        // User Script
        this.registerScript("RP_102103_frmDEMO1.xfdl", function() {

        this.TextField_onchanged = function(obj,e)
        {

        };

        this.Button00_onclick = function(obj,e)
        {
        	this.TextArea00.insertText(JSON.stringify(this.checkHelper(this.Div00.form.TextField00))+"\n");
        	this.TextArea00.insertText(JSON.stringify(this.checkHelper(this.Div00.form.DateField00))+"\n");
        	this.TextArea00.insertText(JSON.stringify(this.checkHelper(this.Div00.form.MultiLineTextField00_00))+"\n");
        };
        this.checkHelper=function(comp) {

          // 컴포넌트 객체 또는 helpertext DOM id 문자열 둘 다 받음
          var id = (typeof comp === "string") ? comp : comp._unique_id + ".helpertext";
          var el = document.getElementById(id);
          if (!el) return { exists: false, id: id };

          var cs = getComputedStyle(el);
          var r  = el.getBoundingClientRect();

          // padding을 뺀 실제 내용 영역 크기
          var pt = parseFloat(cs.paddingTop)    || 0;
          var pb = parseFloat(cs.paddingBottom) || 0;
          var pl = parseFloat(cs.paddingLeft)   || 0;
          var pr = parseFloat(cs.paddingRight)  || 0;
          var contentW = Math.max(0, el.clientWidth  - pl - pr);
          var contentH = Math.max(0, el.clientHeight - pt - pb);

          var text = (el.innerText || el.textContent || "").trim();
          var inViewport = r.bottom > 0 && r.right > 0 &&
                           r.top < innerHeight && r.left < innerWidth;
          var styleVisible = cs.display !== "none" &&
                             cs.visibility !== "hidden" &&
                             parseFloat(cs.opacity) > 0;

          return {
            exists: true,
            boxW: r.width,  boxH: r.height,     // padding 포함 박스 크기
            contentW: contentW, contentH: contentH, // 실제 텍스트 표시 영역
            padding: cs.padding,
            display: cs.display, visibility: cs.visibility, opacity: cs.opacity,
            text: text,
            clipped: el.scrollWidth > el.clientWidth || el.scrollHeight > el.clientHeight,
            inViewport: inViewport,
            visible: styleVisible && inViewport && contentW > 0 && contentH > 0 && text !== ""
          };
        }



        });
        
        // Regist UI Components Event
        this.on_initEvent = function()
        {
            this.Div00.form.TextField00.addEventHandler("onchanged",this.TextField_onchanged,this);
            this.Div00.form.TextField00_00.addEventHandler("onchanged",this.TextField_onchanged,this);
            this.Div00.form.TextField00_00_00.addEventHandler("onchanged",this.TextField_onchanged,this);
            this.Button00.addEventHandler("onclick",this.Button00_onclick,this);
        };

        this.loadIncludeScript("RP_102103_frmDEMO1.xfdl");
        this.loadPreloadList();
        
        // Remove Reference
        obj = null;
    };
}
)();
