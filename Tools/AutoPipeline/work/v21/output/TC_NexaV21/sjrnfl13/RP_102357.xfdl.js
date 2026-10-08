(function()
{
    return function()
    {
        if (!this._is_form)
            return;
        
        var obj = null;
        
        this.on_create = function()
        {
            this.set_name("tss8168");
            this.set_titletext("New Form");
            if (Form == this.constructor)
            {
                this._setFormPosition(1024,768);
            }
            
            // Object(Dataset, ExcelExportObject) Initialize
            obj = new Dataset("Dataset00", this);
            obj._setContents({"ColumnInfo" : {"Column" : [{"id" : "data","size" : "256","type" : "STRING"},{"id" : "code","size" : "256","type" : "STRING"}]},"Rows" : [{"data" : "りんご","code" : "aaa"},{"data" : "みかん","code" : "bbb"},{"data" : "バナナ","code" : "ccc"}]});
            this.addChild(obj.name, obj);
            
            // UI Components Initialize
            obj = new Div("Div00","16","30","120","120",null,null,null,null,null,null,this);
            obj.set_async("false");
            obj.set_formscrollbartrackbarsize("20");
            obj.set_formscrollbartype("fixed");
            obj.set_taborder("0");
            obj.set_text("Div00");
            obj.set_url("sjrnfl13::RP_102357_1.xfdl");
            this.addChild(obj.name, obj);

            obj = new Div("Div01","149","29","120","120",null,null,null,null,null,null,this);
            obj.set_async("false");
            obj.set_formscrollbartrackbarsize("20");
            obj.set_formscrollbartype("fixed");
            obj.set_formscrolltype("none");
            obj.set_taborder("1");
            obj.set_text("Div00");
            obj.set_url("sjrnfl13::RP_102357_2.xfdl");
            this.addChild(obj.name, obj);

            obj = new Div("Div03","149","165","120","120",null,null,null,null,null,null,this);
            obj.set_async("false");
            obj.set_formscrollbartrackbarsize("20");
            obj.set_formscrollbartype("fixed");
            obj.set_formscrolltype("vertical");
            obj.set_taborder("3");
            obj.set_text("Div00");
            obj.set_url("sjrnfl13::RP_102357_3.xfdl");
            this.addChild(obj.name, obj);

            obj = new Div("Div04","280","165","120","120",null,null,null,null,null,null,this);
            obj.set_async("false");
            obj.set_formscrollbartrackbarsize("20");
            obj.set_formscrollbartype("fixed");
            obj.set_formscrolltype("horizontal");
            obj.set_taborder("4");
            obj.set_text("Div00");
            obj.set_url("sjrnfl13::RP_102357_2.xfdl");
            this.addChild(obj.name, obj);

            obj = new Div("Div02","278","29","120","120",null,null,null,null,null,null,this);
            obj.set_async("false");
            obj.set_formscrollbartrackbarsize("20");
            obj.set_formscrollbartype("fixed");
            obj.set_formscrolltype("none");
            obj.set_taborder("2");
            obj.set_text("Div00");
            obj.set_url("sjrnfl13::RP_102357_3.xfdl");
            this.addChild(obj.name, obj);

            obj = new Static("Static00","28","10","39","15",null,null,null,null,null,null,this);
            obj.set_taborder("5");
            obj.set_text("1:Div");
            this.addChild(obj.name, obj);

            obj = new Static("Static00_00","160","10","39","15",null,null,null,null,null,null,this);
            obj.set_taborder("6");
            obj.set_text("2:Div");
            this.addChild(obj.name, obj);

            obj = new Static("Static00_00_00","290","10","39","15",null,null,null,null,null,null,this);
            obj.set_taborder("7");
            obj.set_text("3:Div");
            this.addChild(obj.name, obj);

            obj = new Static("Static00_00_00_00","160","152","39","15",null,null,null,null,null,null,this);
            obj.set_taborder("8");
            obj.set_text("4:Div");
            this.addChild(obj.name, obj);

            obj = new Static("Static00_00_00_00_00","290","152","39","15",null,null,null,null,null,null,this);
            obj.set_taborder("9");
            obj.set_text("5:Div");
            this.addChild(obj.name, obj);

            obj = new Tab("Tab00","31","350","183","135",null,null,null,null,null,null,this);
            obj.set_tabindex("0");
            obj.set_taborder("10");
            this.addChild(obj.name, obj);

            obj = new Tabpage("Tabpage1",this.Tab00);
            obj.set_formscrollbartype("fixed");
            obj.set_text("Tabpage1");
            obj.set_url("sjrnfl13::RP_102357_1.xfdl");
            this.Tab00.addChild(obj.name, obj);

            obj = new Tabpage("Tabpage2",this.Tab00);
            obj.set_text("Tabpage2");
            this.Tab00.addChild(obj.name, obj);

            obj = new Tab("Tab00_00","280","350","183","135",null,null,null,null,null,null,this);
            obj.set_tabindex("0");
            obj.set_taborder("11");
            this.addChild(obj.name, obj);

            obj = new Tabpage("Tabpage1",this.Tab00_00);
            obj.set_formscrollbartype("fixed");
            obj.set_formscrolltype("none");
            obj.set_text("Tabpage1");
            obj.set_url("sjrnfl13::RP_102357_2.xfdl");
            this.Tab00_00.addChild(obj.name, obj);

            obj = new Tabpage("Tabpage2",this.Tab00_00);
            obj.set_text("Tabpage2");
            this.Tab00_00.addChild(obj.name, obj);

            obj = new Tab("Tab00_01","531","350","183","135",null,null,null,null,null,null,this);
            obj.set_tabindex("0");
            obj.set_taborder("12");
            this.addChild(obj.name, obj);

            obj = new Tabpage("Tabpage1",this.Tab00_01);
            obj.set_formscrollbartype("fixed");
            obj.set_formscrolltype("none");
            obj.set_text("Tabpage1");
            obj.set_url("sjrnfl13::RP_102357_3.xfdl");
            this.Tab00_01.addChild(obj.name, obj);

            obj = new Tabpage("Tabpage2",this.Tab00_01);
            obj.set_text("Tabpage2");
            this.Tab00_01.addChild(obj.name, obj);

            obj = new Tab("Tab00_02","280","576","183","135",null,null,null,null,null,null,this);
            obj.set_tabindex("0");
            obj.set_taborder("13");
            this.addChild(obj.name, obj);

            obj = new Tabpage("Tabpage1",this.Tab00_02);
            obj.set_formscrollbartype("fixed");
            obj.set_formscrolltype("vertical");
            obj.set_text("Tabpage1");
            obj.set_url("sjrnfl13::RP_102357_3.xfdl");
            this.Tab00_02.addChild(obj.name, obj);

            obj = new Tabpage("Tabpage2",this.Tab00_02);
            obj.set_text("Tabpage2");
            this.Tab00_02.addChild(obj.name, obj);

            obj = new Tab("Tab00_03","529","576","183","135",null,null,null,null,null,null,this);
            obj.set_tabindex("0");
            obj.set_taborder("14");
            this.addChild(obj.name, obj);

            obj = new Tabpage("Tabpage1",this.Tab00_03);
            obj.set_formscrollbartype("fixed");
            obj.set_formscrolltype("horizontal");
            obj.set_text("Tabpage1");
            obj.set_url("sjrnfl13::RP_102357_2.xfdl");
            this.Tab00_03.addChild(obj.name, obj);

            obj = new Tabpage("Tabpage2",this.Tab00_03);
            obj.set_text("Tabpage2");
            this.Tab00_03.addChild(obj.name, obj);

            obj = new Static("Static00_01","31","320","39","15",null,null,null,null,null,null,this);
            obj.set_taborder("15");
            obj.set_text("1:Tab");
            this.addChild(obj.name, obj);

            obj = new Static("Static00_00_01","280","320","39","15",null,null,null,null,null,null,this);
            obj.set_taborder("16");
            obj.set_text("2:Tab");
            this.addChild(obj.name, obj);

            obj = new Static("Static00_00_00_01","531","320","39","15",null,null,null,null,null,null,this);
            obj.set_taborder("17");
            obj.set_text("3:Tab");
            this.addChild(obj.name, obj);

            obj = new Static("Static00_00_01_00","280","533","39","15",null,null,null,null,null,null,this);
            obj.set_taborder("18");
            obj.set_text("4:Tab");
            this.addChild(obj.name, obj);

            obj = new Static("Static00_00_01_00_00","529","533","39","15",null,null,null,null,null,null,this);
            obj.set_taborder("19");
            obj.set_text("5:Tab");
            this.addChild(obj.name, obj);

            obj = new TextArea("TextArea00","431","20","249","139",null,null,null,null,null,null,this);
            obj.set_taborder("20");
            this.addChild(obj.name, obj);

            obj = new Button("Button00","434","182","172","88",null,null,null,null,null,null,this);
            obj.set_taborder("21");
            obj.set_text("비교");
            this.addChild(obj.name, obj);

            obj = new Button("Button01","719","30","261","48",null,null,null,null,null,null,this);
            obj.set_taborder("22");
            obj.set_text("Div의 가로세로 스크롤바 위치 기억히기");
            this.addChild(obj.name, obj);

            // Layout Functions
            //-- Default Layout : this.Div00
            obj = new Layout("default","",0,0,this.Div00.form,function(p){});
            this.Div00.form.addLayout(obj.name, obj);

            //-- Default Layout : this.Div01
            obj = new Layout("default","",0,0,this.Div01.form,function(p){});
            this.Div01.form.addLayout(obj.name, obj);

            //-- Default Layout : this.Div03
            obj = new Layout("default","",0,0,this.Div03.form,function(p){});
            this.Div03.form.addLayout(obj.name, obj);

            //-- Default Layout : this.Div04
            obj = new Layout("default","",0,0,this.Div04.form,function(p){});
            this.Div04.form.addLayout(obj.name, obj);

            //-- Default Layout : this.Div02
            obj = new Layout("default","",0,0,this.Div02.form,function(p){});
            this.Div02.form.addLayout(obj.name, obj);

            //-- Default Layout : this.Tab00.Tabpage1
            obj = new Layout("default","",0,0,this.Tab00.Tabpage1.form,function(p){});
            this.Tab00.Tabpage1.form.addLayout(obj.name, obj);

            //-- Default Layout : this.Tab00.Tabpage2
            obj = new Layout("default","",0,0,this.Tab00.Tabpage2.form,function(p){});
            this.Tab00.Tabpage2.form.addLayout(obj.name, obj);

            //-- Default Layout : this.Tab00_00.Tabpage1
            obj = new Layout("default","",0,0,this.Tab00_00.Tabpage1.form,function(p){});
            this.Tab00_00.Tabpage1.form.addLayout(obj.name, obj);

            //-- Default Layout : this.Tab00_00.Tabpage2
            obj = new Layout("default","",0,0,this.Tab00_00.Tabpage2.form,function(p){});
            this.Tab00_00.Tabpage2.form.addLayout(obj.name, obj);

            //-- Default Layout : this.Tab00_01.Tabpage1
            obj = new Layout("default","",0,0,this.Tab00_01.Tabpage1.form,function(p){});
            this.Tab00_01.Tabpage1.form.addLayout(obj.name, obj);

            //-- Default Layout : this.Tab00_01.Tabpage2
            obj = new Layout("default","",0,0,this.Tab00_01.Tabpage2.form,function(p){});
            this.Tab00_01.Tabpage2.form.addLayout(obj.name, obj);

            //-- Default Layout : this.Tab00_02.Tabpage1
            obj = new Layout("default","",0,0,this.Tab00_02.Tabpage1.form,function(p){});
            this.Tab00_02.Tabpage1.form.addLayout(obj.name, obj);

            //-- Default Layout : this.Tab00_02.Tabpage2
            obj = new Layout("default","",0,0,this.Tab00_02.Tabpage2.form,function(p){});
            this.Tab00_02.Tabpage2.form.addLayout(obj.name, obj);

            //-- Default Layout : this.Tab00_03.Tabpage1
            obj = new Layout("default","",0,0,this.Tab00_03.Tabpage1.form,function(p){});
            this.Tab00_03.Tabpage1.form.addLayout(obj.name, obj);

            //-- Default Layout : this.Tab00_03.Tabpage2
            obj = new Layout("default","",0,0,this.Tab00_03.Tabpage2.form,function(p){});
            this.Tab00_03.Tabpage2.form.addLayout(obj.name, obj);

            //-- Default Layout : this
            obj = new Layout("default","",1024,768,this,
            	//-- Layout function
            	function(p)
            	{
                var rootobj = p;
                p = rootobj;
                p.set_titletext("New Form");

                p.Div00.set_async("false");
                p.Div00.set_formscrollbartrackbarsize("20");
                p.Div00.set_formscrollbartype("fixed");
                p.Div00.set_taborder("0");
                p.Div00.set_text("Div00");
                p.Div00.set_url("sjrnfl13::RP_102357_1.xfdl");
                p.Div00.move("16","30","120","120",null,null);

                p.Div01.set_async("false");
                p.Div01.set_formscrollbartrackbarsize("20");
                p.Div01.set_formscrollbartype("fixed");
                p.Div01.set_formscrolltype("none");
                p.Div01.set_taborder("1");
                p.Div01.set_text("Div00");
                p.Div01.set_url("sjrnfl13::RP_102357_2.xfdl");
                p.Div01.move("149","29","120","120",null,null);

                p.Div03.set_async("false");
                p.Div03.set_formscrollbartrackbarsize("20");
                p.Div03.set_formscrollbartype("fixed");
                p.Div03.set_formscrolltype("vertical");
                p.Div03.set_taborder("3");
                p.Div03.set_text("Div00");
                p.Div03.set_url("sjrnfl13::RP_102357_3.xfdl");
                p.Div03.move("149","165","120","120",null,null);

                p.Div04.set_async("false");
                p.Div04.set_formscrollbartrackbarsize("20");
                p.Div04.set_formscrollbartype("fixed");
                p.Div04.set_formscrolltype("horizontal");
                p.Div04.set_taborder("4");
                p.Div04.set_text("Div00");
                p.Div04.set_url("sjrnfl13::RP_102357_2.xfdl");
                p.Div04.move("280","165","120","120",null,null);

                p.Div02.set_async("false");
                p.Div02.set_formscrollbartrackbarsize("20");
                p.Div02.set_formscrollbartype("fixed");
                p.Div02.set_formscrolltype("none");
                p.Div02.set_taborder("2");
                p.Div02.set_text("Div00");
                p.Div02.set_url("sjrnfl13::RP_102357_3.xfdl");
                p.Div02.move("278","29","120","120",null,null);

                p.Static00.set_taborder("5");
                p.Static00.set_text("1:Div");
                p.Static00.move("28","10","39","15",null,null);

                p.Static00_00.set_taborder("6");
                p.Static00_00.set_text("2:Div");
                p.Static00_00.move("160","10","39","15",null,null);

                p.Static00_00_00.set_taborder("7");
                p.Static00_00_00.set_text("3:Div");
                p.Static00_00_00.move("290","10","39","15",null,null);

                p.Static00_00_00_00.set_taborder("8");
                p.Static00_00_00_00.set_text("4:Div");
                p.Static00_00_00_00.move("160","152","39","15",null,null);

                p.Static00_00_00_00_00.set_taborder("9");
                p.Static00_00_00_00_00.set_text("5:Div");
                p.Static00_00_00_00_00.move("290","152","39","15",null,null);

                p.Tab00.set_tabindex("0");
                p.Tab00.set_taborder("10");
                p.Tab00.move("31","350","183","135",null,null);

                p.Tab00.Tabpage1.set_formscrollbartype("fixed");
                p.Tab00.Tabpage1.set_text("Tabpage1");
                p.Tab00.Tabpage1.set_url("sjrnfl13::RP_102357_1.xfdl");

                p.Tab00.Tabpage2.set_text("Tabpage2");

                p.Tab00_00.set_tabindex("0");
                p.Tab00_00.set_taborder("11");
                p.Tab00_00.move("280","350","183","135",null,null);

                p.Tab00_00.Tabpage1.set_formscrollbartype("fixed");
                p.Tab00_00.Tabpage1.set_formscrolltype("none");
                p.Tab00_00.Tabpage1.set_text("Tabpage1");
                p.Tab00_00.Tabpage1.set_url("sjrnfl13::RP_102357_2.xfdl");

                p.Tab00_00.Tabpage2.set_text("Tabpage2");

                p.Tab00_01.set_tabindex("0");
                p.Tab00_01.set_taborder("12");
                p.Tab00_01.move("531","350","183","135",null,null);

                p.Tab00_01.Tabpage1.set_formscrollbartype("fixed");
                p.Tab00_01.Tabpage1.set_formscrolltype("none");
                p.Tab00_01.Tabpage1.set_text("Tabpage1");
                p.Tab00_01.Tabpage1.set_url("sjrnfl13::RP_102357_3.xfdl");

                p.Tab00_01.Tabpage2.set_text("Tabpage2");

                p.Tab00_02.set_tabindex("0");
                p.Tab00_02.set_taborder("13");
                p.Tab00_02.move("280","576","183","135",null,null);

                p.Tab00_02.Tabpage1.set_formscrollbartype("fixed");
                p.Tab00_02.Tabpage1.set_formscrolltype("vertical");
                p.Tab00_02.Tabpage1.set_text("Tabpage1");
                p.Tab00_02.Tabpage1.set_url("sjrnfl13::RP_102357_3.xfdl");

                p.Tab00_02.Tabpage2.set_text("Tabpage2");

                p.Tab00_03.set_tabindex("0");
                p.Tab00_03.set_taborder("14");
                p.Tab00_03.move("529","576","183","135",null,null);

                p.Tab00_03.Tabpage1.set_formscrollbartype("fixed");
                p.Tab00_03.Tabpage1.set_formscrolltype("horizontal");
                p.Tab00_03.Tabpage1.set_text("Tabpage1");
                p.Tab00_03.Tabpage1.set_url("sjrnfl13::RP_102357_2.xfdl");

                p.Tab00_03.Tabpage2.set_text("Tabpage2");

                p.Static00_01.set_taborder("15");
                p.Static00_01.set_text("1:Tab");
                p.Static00_01.move("31","320","39","15",null,null);

                p.Static00_00_01.set_taborder("16");
                p.Static00_00_01.set_text("2:Tab");
                p.Static00_00_01.move("280","320","39","15",null,null);

                p.Static00_00_00_01.set_taborder("17");
                p.Static00_00_00_01.set_text("3:Tab");
                p.Static00_00_00_01.move("531","320","39","15",null,null);

                p.Static00_00_01_00.set_taborder("18");
                p.Static00_00_01_00.set_text("4:Tab");
                p.Static00_00_01_00.move("280","533","39","15",null,null);

                p.Static00_00_01_00_00.set_taborder("19");
                p.Static00_00_01_00_00.set_text("5:Tab");
                p.Static00_00_01_00_00.move("529","533","39","15",null,null);

                p.TextArea00.set_taborder("20");
                p.TextArea00.move("431","20","249","139",null,null);

                p.Button00.set_taborder("21");
                p.Button00.set_text("비교");
                p.Button00.move("434","182","172","88",null,null);

                p.Button01.set_taborder("22");
                p.Button01.set_text("Div의 가로세로 스크롤바 위치 기억히기");
                p.Button01.move("719","30","261","48",null,null);
            	}
            );
            obj.set_mobileorientation("landscape");
            obj.set_stepcount("0");
            this.addLayout(obj.name, obj);

            //-- Normal Layout : this
            obj = new Layout("Layout0","tab",800,1280,this,
            	//-- Layout function
            	function(p)
            	{
                var rootobj = p;
                p = rootobj;

            	}
            );
            obj.set_mobileorientation("portrait");
            obj.set_stepcount("0");
            this.addLayout(obj.name, obj);
            
            // BindItem Information

            
            // TriggerItem Information

        };
        
        this.loadPreloadList = function()
        {
            this._addPreloadList("fdl","sjrnfl13::RP_102357_1.xfdl");
            this._addPreloadList("fdl","sjrnfl13::RP_102357_2.xfdl");
            this._addPreloadList("fdl","sjrnfl13::RP_102357_3.xfdl");
        };
        
        // User Script
        this.registerScript("RP_102357.xfdl", function() {
        // Div 이름 → 출력 번호
        this.divNoMap = {Div00:1, Div01:2, Div02:3, Div03:4, Div04:5};
        this.savedPos = null;

        // Div의 가로/세로 스크롤 위치
        this.fn_getScrollPos = function(div)
        {
            var f = div.form;
            return {
                h : f.hscrollbar ? f.hscrollbar.pos : 0,
                v : f.vscrollbar ? f.vscrollbar.pos : 0
            };
        };

        // 번호 순서로 Div 목록 반환
        this.fn_getDivList = function()
        {
            var arr = [];
            for (var name in this.divNoMap) arr.push({name:name, no:this.divNoMap[name]});
            arr.sort(function(a, b){ return a.no - b.no; });
            return arr;
        };

        // [Div의 가로세로 스크롤바 위치 기억하기]
        this.Button01_onclick = function(obj, e)
        {
            this.savedPos = {};
            var list = this.fn_getDivList();
            for (var i = 0; i < list.length; i++) {
                this.savedPos[list[i].name] = this.fn_getScrollPos(this.components[list[i].name]);
            }
            this.TextArea00.set_value("스크롤바 위치 저장 완료");
        };

        // [비교]
        this.Button00_onclick = function(obj, e)
        {
            if (!this.savedPos) {
                this.TextArea00.set_value("저장된 위치가 없습니다. 먼저 [Div의 가로세로 스크롤바 위치 기억하기]를 클릭하세요.");
                return;
            }
            var list = this.fn_getDivList(), lines = [];
            for (var i = 0; i < list.length; i++) {
                var sp = this.savedPos[list[i].name];
                var cp = this.fn_getScrollPos(this.components[list[i].name]);
                lines.push(list[i].no + "번 Div: " + ((sp.h == cp.h && sp.v == cp.v) ? " 화면 스크롤 움직임 X" : " 화면 스크롤 움직임 O"));
            }
            this.TextArea00.set_value(lines.join("\n"));
        };
        });
        
        // Regist UI Components Event
        this.on_initEvent = function()
        {
            this.addEventHandler("onload",this.form_onload,this);
            this.addEventHandler("ontimer",this.tss8168_ontimer,this);
            this.Button00.addEventHandler("onclick",this.Button00_onclick,this);
            this.Button01.addEventHandler("onclick",this.Button01_onclick,this);
        };

        this.loadIncludeScript("RP_102357.xfdl");
        this.loadPreloadList();
        
        // Remove Reference
        obj = null;
    };
}
)();
