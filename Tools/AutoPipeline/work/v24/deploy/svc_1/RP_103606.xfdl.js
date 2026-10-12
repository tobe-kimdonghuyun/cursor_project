(function()
{
    return function()
    {
        if (!this._is_form)
            return;
        
        var obj = null;
        
        this.on_create = function()
        {
            this.set_name("test01");
            this.set_titletext("New Form");
            if (Form == this.constructor)
            {
                this._setFormPosition(600,400);
            }
            
            // Object(Dataset, ExcelExportObject) Initialize

            
            // UI Components Initialize
            obj = new Tab("Tab00","25","79","523","174",null,null,null,null,null,null,this);
            obj.set_showextrabutton("true");
            obj.set_tabbuttongap("10");
            obj.set_tabindex("0");
            obj.set_taborder("0");
            this.addChild(obj.name, obj);

            obj = new Tabpage("Tabpage1",this.Tab00);
            obj.set_text("Tabpage1");
            this.Tab00.addChild(obj.name, obj);

            obj = new Tabpage("Tabpage2",this.Tab00);
            obj.set_text("Tabpage2");
            this.Tab00.addChild(obj.name, obj);

            obj = new Tabpage("Tabpage3",this.Tab00);
            obj.set_text("Tabpage3");
            this.Tab00.addChild(obj.name, obj);

            obj = new Tabpage("Tabpage4",this.Tab00);
            obj.set_text("Tabpage4");
            this.Tab00.addChild(obj.name, obj);

            obj = new Tabpage("Tabpage5",this.Tab00);
            obj.set_text("Tabpage5");
            this.Tab00.addChild(obj.name, obj);

            obj = new Tabpage("Tabpage6",this.Tab00);
            obj.set_text("Tabpage6");
            this.Tab00.addChild(obj.name, obj);

            obj = new Tabpage("Tabpage7",this.Tab00);
            obj.set_text("Tabpage7");
            this.Tab00.addChild(obj.name, obj);

            obj = new Tabpage("Tabpage8",this.Tab00);
            obj.set_text("Tabpage8");
            this.Tab00.addChild(obj.name, obj);

            obj = new Tabpage("Tabpage9",this.Tab00);
            obj.set_text("Tabpage9");
            this.Tab00.addChild(obj.name, obj);

            obj = new Tabpage("Tabpage10",this.Tab00);
            obj.set_text("Tabpage10");
            this.Tab00.addChild(obj.name, obj);

            obj = new Button("Button00","193","15","120","50",null,null,null,null,null,null,this);
            obj.set_taborder("1");
            obj.set_text("Button00");
            this.addChild(obj.name, obj);

            obj = new Button("Button01","28","311","173","71",null,null,null,null,null,null,this);
            obj.set_taborder("2");
            obj.set_text("동작확인");
            this.addChild(obj.name, obj);

            obj = new Edit("Edit00","222","314","376","73",null,null,null,null,null,null,this);
            obj.set_taborder("3");
            this.addChild(obj.name, obj);

            // Layout Functions
            //-- Default Layout : this.Tab00.Tabpage1
            obj = new Layout("default","",0,0,this.Tab00.Tabpage1.form,function(p){});
            this.Tab00.Tabpage1.form.addLayout(obj.name, obj);

            //-- Default Layout : this.Tab00.Tabpage2
            obj = new Layout("default","",0,0,this.Tab00.Tabpage2.form,function(p){});
            this.Tab00.Tabpage2.form.addLayout(obj.name, obj);

            //-- Default Layout : this.Tab00.Tabpage3.form
            obj = new Layout("default","",0,0,this.Tab00.Tabpage3.form,function(p){});
            this.Tab00.Tabpage3.form.addLayout(obj.name, obj);

            //-- Default Layout : this.Tab00.Tabpage4.form
            obj = new Layout("default","",0,0,this.Tab00.Tabpage4.form,function(p){});
            this.Tab00.Tabpage4.form.addLayout(obj.name, obj);

            //-- Default Layout : this.Tab00.Tabpage5.form
            obj = new Layout("default","",0,0,this.Tab00.Tabpage5.form,function(p){});
            this.Tab00.Tabpage5.form.addLayout(obj.name, obj);

            //-- Default Layout : this.Tab00.Tabpage6.form
            obj = new Layout("default","",0,0,this.Tab00.Tabpage6.form,function(p){});
            this.Tab00.Tabpage6.form.addLayout(obj.name, obj);

            //-- Default Layout : this.Tab00.Tabpage7.form
            obj = new Layout("default","",0,0,this.Tab00.Tabpage7.form,function(p){});
            this.Tab00.Tabpage7.form.addLayout(obj.name, obj);

            //-- Default Layout : this.Tab00.Tabpage8.form
            obj = new Layout("default","",0,0,this.Tab00.Tabpage8.form,function(p){});
            this.Tab00.Tabpage8.form.addLayout(obj.name, obj);

            //-- Default Layout : this.Tab00.Tabpage9.form
            obj = new Layout("default","",0,0,this.Tab00.Tabpage9.form,function(p){});
            this.Tab00.Tabpage9.form.addLayout(obj.name, obj);

            //-- Default Layout : this.Tab00.Tabpage10.form
            obj = new Layout("default","",0,0,this.Tab00.Tabpage10.form,function(p){});
            this.Tab00.Tabpage10.form.addLayout(obj.name, obj);

            //-- Default Layout : this
            obj = new Layout("default","",600,400,this,function(p){});
            this.addLayout(obj.name, obj);
            
            // BindItem Information

            
            // TriggerItem Information

        };
        
        this.loadPreloadList = function()
        {

        };
        
        // User Script
        this.registerScript("RP_103606.xfdl", function() {

        this.Tab00_onextrabuttonclick = function(obj,e)
        {
        	var idx = e.index;
        	obj.removeTabpage(idx);
        };

        this.Button00_onclick = function(obj,e)
        {
        	this.Tab00.tabindex = 6;
        };

        this.Button01_onclick = function(obj,e)
        {
        	var oTab = this.Tab00;
        	var nIdx = -1;

        	for (var i = 0; i < oTab.tabpages.length; i++) {
        		if (oTab.tabpages[i].name == "Tabpage7") { nIdx = i; break; }
        	}
        	if (nIdx < 0) {
        		this.Edit00.set_value("Tabpage7 없음");
        		return;
        	}

        	var oBtn = oTab._tabbuttonitems[nIdx];

        	// 탭버튼이 보일 수 있는 영역의 오른쪽 끝 (◀ ▶ 버튼이 있으면 그 앞까지)
        	var nAreaRight = oTab._adjust_width;
        	if (oTab._p_prevbutton && oTab._p_prevbutton.visible) {
        		nAreaRight = oTab._p_prevbutton._adjust_left;
        	}

        	var bVisible = oBtn && oBtn.visible
        	            && oBtn._adjust_left >= 0
        	            && (oBtn._adjust_left + oBtn._adjust_width) <= nAreaRight;

        	this.Edit00.set_value(bVisible ? "Tabpage7 보임 O" : "Tabpage7 보임 X");
        };

        });
        
        // Regist UI Components Event
        this.on_initEvent = function()
        {
            this.Tab00.addEventHandler("onextrabuttonclick",this.Tab00_onextrabuttonclick,this);
            this.Button00.addEventHandler("onclick",this.Button00_onclick,this);
            this.Button01.addEventHandler("onclick",this.Button01_onclick,this);
        };

        this.loadIncludeScript("RP_103606.xfdl");
        this.loadPreloadList();
        
        // Remove Reference
        obj = null;
    };
}
)();
