(function()
{
    return function()
    {
        if (!this._is_form)
            return;
        
        var obj = null;
        
        this.on_create = function()
        {
            this.set_name("TabStyle_K");
            this.set_titletext("New Form");
            if (Form == this.constructor)
            {
                this._setFormPosition(1280,720);
            }
            
            // Object(Dataset, ExcelExportObject) Initialize

            
            // UI Components Initialize
            obj = new Tab("Tab00","67","38","523","222",null,null,null,null,null,null,this);
            obj.set_cssclass("test1");
            obj.set_tabindex("0");
            obj.set_taborder("1");
            this.addChild(obj.name, obj);

            obj = new Tabpage("Tabpage1",this.Tab00);
            obj.set_background("beige");
            obj.set_text("Tabpage1");
            this.Tab00.addChild(obj.name, obj);

            obj = new Edit("Edit00","43","43","140","20",null,null,null,null,null,null,this.Tab00.Tabpage1.form);
            obj.set_taborder("0");
            this.Tab00.Tabpage1.addChild(obj.name, obj);

            obj = new Tabpage("Tabpage2",this.Tab00);
            obj.set_background("bisque");
            obj.set_text("Tabpage2");
            this.Tab00.addChild(obj.name, obj);

            obj = new Edit("Edit00","23","23","140","20",null,null,null,null,null,null,this.Tab00.Tabpage2.form);
            obj.set_taborder("0");
            this.Tab00.Tabpage2.addChild(obj.name, obj);

            obj = new Combo("Combo00","23","73","150","20",null,null,null,null,null,null,this.Tab00.Tabpage2.form);
            obj.set_taborder("1");
            obj.set_text("Combo00");
            this.Tab00.Tabpage2.addChild(obj.name, obj);

            obj = new PopupDiv("PopupDiv00","0","750","480","190",null,null,null,null,null,null,this);
            obj.set_background("ivory");
            obj.set_text("PopupDiv00");
            obj.set_visible("false");
            this.addChild(obj.name, obj);

            obj = new Button("Button01","296","75","120","50",null,null,null,null,null,null,this.PopupDiv00.form);
            obj.set_taborder("0");
            obj.set_text("closePopup");
            this.PopupDiv00.addChild(obj.name, obj);

            obj = new Button("Button00","68","71","125","43",null,null,null,null,null,null,this.PopupDiv00.form);
            obj.set_taborder("1");
            obj.set_text("get background");
            this.PopupDiv00.addChild(obj.name, obj);

            obj = new Tab("Tab01","67","318","533","222",null,null,null,null,null,null,this);
            obj.set_tabindex("1");
            obj.set_taborder("2");
            this.addChild(obj.name, obj);

            obj = new Tabpage("Tabpage1",this.Tab01);
            obj.set_background("beige");
            obj.set_text("Tabpage1");
            this.Tab01.addChild(obj.name, obj);

            obj = new Edit("Edit00","43","43","140","20",null,null,null,null,null,null,this.Tab01.Tabpage1.form);
            obj.set_taborder("0");
            this.Tab01.Tabpage1.addChild(obj.name, obj);

            obj = new Button("Button00","43","113","120","50",null,null,null,null,null,null,this.Tab01.Tabpage1.form);
            obj.set_taborder("1");
            obj.set_text("Button00");
            this.Tab01.Tabpage1.addChild(obj.name, obj);

            obj = new Tabpage("Tabpage2",this.Tab01);
            obj.set_background("bisque");
            obj.set_text("Tabpage2");
            this.Tab01.addChild(obj.name, obj);

            obj = new Edit("Edit00","23","23","140","20",null,null,null,null,null,null,this.Tab01.Tabpage2.form);
            obj.set_taborder("0");
            this.Tab01.Tabpage2.addChild(obj.name, obj);

            obj = new Combo("Combo00","23","73","150","20",null,null,null,null,null,null,this.Tab01.Tabpage2.form);
            obj.set_taborder("1");
            obj.set_text("Combo00");
            this.Tab01.Tabpage2.addChild(obj.name, obj);

            obj = new Tabpage("Tabpage3",this.Tab01);
            obj.set_text("Tabpage3");
            this.Tab01.addChild(obj.name, obj);

            obj = new Edit("Edit00","57","34","172","51",null,null,null,null,null,null,this.Tab01.Tabpage3.form);
            obj.set_taborder("0");
            this.Tab01.Tabpage3.addChild(obj.name, obj);

            obj = new PopupMenu("PopupMenu00","580","740","220","100",null,null,null,null,null,null,this);
            this.addChild(obj.name, obj);

            obj = new Button("Button00","658","320","102","46",null,null,null,null,null,null,this);
            obj.set_taborder("3");
            obj.set_text("Button00");
            this.addChild(obj.name, obj);

            obj = new Static("Static00","697","169","234","81",null,null,null,null,null,null,this);
            obj.set_taborder("3");
            obj.set_text("Static00");
            this.addChild(obj.name, obj);

            // Layout Functions
            //-- Default Layout : this.Tab00.Tabpage1.form
            obj = new Layout("default","",0,0,this.Tab00.Tabpage1.form,function(p){});
            this.Tab00.Tabpage1.form.addLayout(obj.name, obj);

            //-- Default Layout : this.Tab00.Tabpage2.form
            obj = new Layout("default","",0,0,this.Tab00.Tabpage2.form,function(p){});
            this.Tab00.Tabpage2.form.addLayout(obj.name, obj);

            //-- Default Layout : this.PopupDiv00.form
            obj = new Layout("default","",0,0,this.PopupDiv00.form,function(p){});
            this.PopupDiv00.form.addLayout(obj.name, obj);

            //-- Default Layout : this.Tab01.Tabpage1.form
            obj = new Layout("default","",0,0,this.Tab01.Tabpage1.form,function(p){});
            this.Tab01.Tabpage1.form.addLayout(obj.name, obj);

            //-- Default Layout : this.Tab01.Tabpage2.form
            obj = new Layout("default","",0,0,this.Tab01.Tabpage2.form,function(p){});
            this.Tab01.Tabpage2.form.addLayout(obj.name, obj);

            //-- Default Layout : this.Tab01.Tabpage3.form
            obj = new Layout("default","",0,0,this.Tab01.Tabpage3.form,function(p){});
            this.Tab01.Tabpage3.form.addLayout(obj.name, obj);

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
        this.registerScript("RP_103114.xfdl", function() {
        this._nClickTabIdx = -1;   // 클릭한 탭 버튼 index 저장
        this.Tab00_canchange = function(obj,e)
        {
        	this._nClickTabIdx = e.postindex;
          	this.PopupDiv00.trackPopupByComponent(this.Tab00,100,100,480,190);
          	this.PopupDiv00.form.setFocus(false,false);

          	// タブ遷移を阻止
          	obj.set_tabindex(e.preindex);
          	return false;

        };

        this.Tab01_canchange = function(obj,e)
        {
         	this.PopupMenu00.trackPopup( 300,500 );
        	return false;
        };

        this.PopupDiv00_Button01_onclick = function(obj,e)
        {
        	this.PopupDiv00.closePopup();
        };

        this.Button00_onrbuttondown = function(obj,e)
        {
        	this.PopupMenu00.trackPopup( 300,500 );
        };

        this.PopupDiv00_Button00_onclick = function(obj,e)
        {
        	var nIdx = this._nClickTabIdx;
            var objBtn = this.Tab00._tabbuttonitems && this.Tab00._tabbuttonitems[nIdx];
            var elem = objBtn && objBtn._control_element && objBtn._control_element.handle;

            if (!elem) {
                this.Static00.set_text("tab button 없음");
                return;
            }

            var sRgb = window.getComputedStyle(elem).backgroundColor;   // "rgb(255, 0, 0)"
            this.Static00.set_text(this.fnRgbToName(sRgb));
        };
        // ===== rgb → 색상 이름 변환 =====
        this._colorNames = "black silver gray white maroon red purple fuchsia green lime olive yellow navy blue teal aqua orange aliceblue antiquewhite aquamarine azure beige bisque blanchedalmond blueviolet brown burlywood cadetblue chartreuse chocolate coral cornflowerblue cornsilk crimson cyan darkblue darkcyan darkgoldenrod darkgray darkgreen darkgrey darkkhaki darkmagenta darkolivegreen darkorange darkorchid darkred darksalmon darkseagreen darkslateblue darkslategray darkslategrey darkturquoise darkviolet deeppink deepskyblue dimgray dimgrey dodgerblue firebrick floralwhite forestgreen gainsboro ghostwhite gold goldenrod greenyellow grey honeydew hotpink indianred indigo ivory khaki lavender lavenderblush lawngreen lemonchiffon lightblue lightcoral lightcyan lightgoldenrodyellow lightgray lightgreen lightgrey lightpink lightsalmon lightseagreen lightskyblue lightslategray lightslategrey lightsteelblue lightyellow limegreen linen magenta mediumaquamarine mediumblue mediumorchid mediumpurple mediumseagreen mediumslateblue mediumspringgreen mediumturquoise mediumvioletred midnightblue mintcream mistyrose moccasin navajowhite oldlace olivedrab orangered orchid palegoldenrod palegreen paleturquoise palevioletred papayawhip peachpuff peru pink plum powderblue rebeccapurple rosybrown royalblue saddlebrown salmon sandybrown seagreen seashell sienna skyblue slateblue slategray slategrey snow springgreen steelblue tan thistle tomato turquoise violet wheat whitesmoke yellowgreen";
        this._colorMap = null;

        this.fnRgbToName = function(sRgb)
        {
            if (!sRgb) return "";
            var sKey = sRgb.replace(/\s/g, "");
            if (sKey == "rgba(0,0,0,0)") return "transparent";

            if (!this._colorMap) {
                this._colorMap = {};
                var arr = this._colorNames.split(" ");
                var div = document.createElement("div");
                document.body.appendChild(div);
                for (var i = 0; i < arr.length; i++) {
                    div.style.color = arr[i];
                    var v = window.getComputedStyle(div).color.replace(/\s/g, "");
                    if (!this._colorMap[v]) this._colorMap[v] = arr[i];
                }
                document.body.removeChild(div);
            }
            if (this._colorMap[sKey]) return this._colorMap[sKey];

            // 이름 없는 색은 #RRGGBB로
            var m = sKey.match(/^rgb\((\d+),(\d+),(\d+)\)$/);
            if (m) return "#" + [m[1], m[2], m[3]].map(function(n){
                return ("0" + parseInt(n, 10).toString(16)).slice(-2);
            }).join("").toUpperCase();
            return sRgb;
        };
        });
        
        // Regist UI Components Event
        this.on_initEvent = function()
        {
            this.addEventHandler("ontimer",this.TabStyle_ontimer,this);
            this.Tab00.addEventHandler("canchange",this.Tab00_canchange,this);
            this.PopupDiv00.form.Button01.addEventHandler("onclick",this.PopupDiv00_Button01_onclick,this);
            this.PopupDiv00.form.Button00.addEventHandler("onclick",this.PopupDiv00_Button00_onclick,this);
            this.Tab01.addEventHandler("canchange",this.Tab01_canchange,this);
            this.Tab01.addEventHandler("onrbuttondown",this.Tab01_onrbuttondown,this);
            this.Button00.addEventHandler("onclick",this.Button00_onclick,this);
            this.Button00.addEventHandler("onrbuttondown",this.Button00_onrbuttondown,this);
        };

        this.loadIncludeScript("RP_103114.xfdl");
        this.loadPreloadList();
        
        // Remove Reference
        obj = null;
    };
}
)();
