(function()
{
    return function()
    {
        if (!this._is_form)
            return;
        
        var obj = null;
        
        this.on_create = function()
        {
            this.set_name("test");
            this.set_titletext("New Form");
            if (Form == this.constructor)
            {
                this._setFormPosition(1280,720);
            }
            
            // Object(Dataset, ExcelExportObject) Initialize
            obj = new Dataset("ds00", this);
            obj._setContents({"ColumnInfo" : {"Column" : [{"id" : "Column0","size" : "256","type" : "STRING"},{"id" : "Column1","size" : "256","type" : "STRING"},{"id" : "Column2","size" : "256","type" : "STRING"}]}});
            this.addChild(obj.name, obj);
            
            // UI Components Initialize
            obj = new Grid("grd00","90","140","322","181",null,null,null,null,null,null,this);
            obj.set_binddataset("ds00");
            obj.set_nodatatext("조회결과가 없습니다");
            obj.set_taborder("0");
            obj._setContents("<Formats><Format id=\"default\"><Columns><Column size=\"80\"/><Column size=\"80\"/><Column size=\"80\"/></Columns><Rows><Row band=\"head\" size=\"24\"/><Row size=\"24\"/></Rows><Band id=\"head\"><Cell text=\"Column0\"/><Cell col=\"1\" text=\"Column1\"/><Cell col=\"2\" text=\"Column2\"/></Band><Band id=\"body\"><Cell text=\"bind:Column0\"/><Cell col=\"1\" text=\"bind:Column1\"/><Cell col=\"2\" text=\"bind:Column2\"/></Band></Format><Format id=\"format00\"><Columns><Column size=\"80\"/><Column size=\"80\"/><Column size=\"80\"/></Columns><Rows><Row band=\"head\" size=\"24\"/><Row size=\"24\"/><Row size=\"24\"/></Rows><Band id=\"head\"><Cell text=\"Column0\"/><Cell col=\"1\" text=\"Column1\"/><Cell col=\"2\" text=\"Column2\"/></Band><Band id=\"body\"><Cell text=\"bind:Column0\"/><Cell col=\"1\" text=\"bind:Column1\"/><Cell col=\"2\" text=\"bind:Column2\"/><Cell row=\"1\" text=\"bind:Column0\"/><Cell col=\"1\" row=\"1\" text=\"bind:Column0\"/><Cell col=\"2\" row=\"1\" text=\"bind:Column0\"/></Band></Format></Formats>");
            this.addChild(obj.name, obj);

            obj = new Button("Button00","81","69","104","46",null,null,null,null,null,null,this);
            obj.set_taborder("1");
            obj.set_text("설정");
            this.addChild(obj.name, obj);

            obj = new Button("Button01","244","71","178","49",null,null,null,null,null,null,this);
            obj.set_taborder("2");
            obj.set_text("동작확인");
            this.addChild(obj.name, obj);

            obj = new Edit("Edit00","430","71","323","49",null,null,null,null,null,null,this);
            obj.set_taborder("3");
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
        this.registerScript("RP_105285_test.xfdl", function() {

        this.Button00_onclick = function(obj,e)
        {
        	this.grd00.formatid = "format00";
        };

        /***********************************************************
         * [동작확인] 버튼 클릭
         * Grid의 "조회결과가 없습니다"(nodatatext) 문구가 몇 개 표시되는지
         * 세어서 Edit00에 출력한다. (2개 이상이면 버그)
         ***********************************************************/
        this.Button01_onclick = function(obj, e)
        {
            var nCnt = this.fn_getNoDataTextCount(this.grd00);

            var sMsg = "[" + this.grd00.nodatatext + "] " + nCnt + "개 표시 → "
                     + (nCnt >= 2 ? "FAIL (버그 재현)" : "PASS");

            this.Edit00.set_value(sMsg);
        };

        /***********************************************************
         * nodatatext가 표시되고 있는 문구 개수 반환
         * - Grid 자체 문구 : objGrid._text_elem
         * - Body 영역 문구 : objGrid._bodyBand._text_elem
         ***********************************************************/
        this.fn_getNoDataTextCount = function(objGrid)
        {
            var arrElem = [];
            var nCnt = 0;

            if (objGrid._text_elem)
                arrElem.push(objGrid._text_elem);

            if (objGrid._bodyBand && objGrid._bodyBand._text_elem)
                arrElem.push(objGrid._bodyBand._text_elem);

            for (var i = 0; i < arrElem.length; i++)
            {
                if (arrElem[i].visible && arrElem[i].text == objGrid.nodatatext)
                    nCnt++;
            }

            return nCnt;
        };
        });
        
        // Regist UI Components Event
        this.on_initEvent = function()
        {
            this.Button00.addEventHandler("onclick",this.Button00_onclick,this);
            this.Button01.addEventHandler("onclick",this.Button01_onclick,this);
        };

        this.loadIncludeScript("RP_105285_test.xfdl");
        this.loadPreloadList();
        
        // Remove Reference
        obj = null;
    };
}
)();
