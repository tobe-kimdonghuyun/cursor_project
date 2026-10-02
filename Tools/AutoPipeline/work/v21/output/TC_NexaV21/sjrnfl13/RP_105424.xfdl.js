(function()
{
    return function()
    {
        if (!this._is_form)
            return;
        
        var obj = null;
        
        this.on_create = function()
        {
            this.set_name("drag_test");
            this.set_titletext("New Form");
            if (Form == this.constructor)
            {
                this._setFormPosition(1280,720);
            }
            
            // Object(Dataset, ExcelExportObject) Initialize
            obj = new Dataset("Dataset00", this);
            obj._setContents({"ColumnInfo" : {"Column" : [{"id" : "Column0","size" : "256","type" : "STRING"},{"id" : "Column1","size" : "256","type" : "STRING"},{"id" : "Column2","size" : "256","type" : "STRING"},{"id" : "Column3","size" : "256","type" : "STRING"},{"id" : "Column4","size" : "256","type" : "STRING"},{"id" : "Column5","size" : "256","type" : "STRING"},{"id" : "Column6","size" : "256","type" : "STRING"},{"id" : "Column7","size" : "256","type" : "STRING"}]},"Rows" : [{"Column0" : "1","Column2" : "aa","Column3" : "1","Column4" : "1","Column7" : "123","Column5" : "32","Column6" : "231","Column1" : "sdf"},{"Column0" : "2","Column2" : "bb","Column4" : "23","Column7" : "1","Column5" : "1","Column6" : "122g","Column3" : "gdsg","Column1" : "sdf"},{"Column1" : "3","Column2" : "cc","Column4" : "123","Column5" : "123","Column6" : "3","Column7" : "1","Column3" : "sdf"},{"Column0" : "1","Column2" : "aa","Column3" : "1","Column4" : "1","Column7" : "123","Column5" : "32","Column6" : "231","Column1" : "sdf"},{"Column0" : "2","Column2" : "bb","Column4" : "23","Column7" : "1","Column5" : "1","Column6" : "122g","Column3" : "gdsg","Column1" : "sdf"},{"Column1" : "3","Column2" : "cc","Column4" : "123","Column5" : "123","Column6" : "3","Column7" : "1","Column3" : "sdf"},{"Column0" : "1","Column2" : "aa","Column3" : "1","Column4" : "1","Column7" : "123","Column5" : "32","Column6" : "231","Column1" : "sdf"},{"Column0" : "2","Column2" : "bb","Column4" : "23","Column7" : "1","Column5" : "1","Column6" : "122g","Column3" : "gdsg","Column1" : "sdf"},{"Column1" : "3","Column2" : "cc","Column4" : "123","Column5" : "123","Column6" : "3","Column7" : "1","Column3" : "sdf"},{"Column0" : "1","Column2" : "aa","Column3" : "1","Column4" : "1","Column7" : "123","Column5" : "32","Column6" : "231","Column1" : "sdf"},{"Column0" : "2","Column2" : "bb","Column4" : "23","Column7" : "1","Column5" : "1","Column6" : "122g","Column3" : "gdsg","Column1" : "sdf"},{"Column1" : "3","Column2" : "cc","Column4" : "123","Column5" : "123","Column6" : "3","Column7" : "1","Column3" : "sdf"},{"Column0" : "1","Column2" : "aa","Column3" : "1","Column4" : "1","Column7" : "123","Column5" : "32","Column6" : "231","Column1" : "sdf"},{"Column0" : "2","Column2" : "bb","Column4" : "23","Column7" : "1","Column5" : "1","Column6" : "122g","Column3" : "gdsg","Column1" : "sdf"},{"Column1" : "3","Column2" : "cc","Column4" : "123","Column5" : "123","Column6" : "3","Column7" : "1","Column3" : "sdf"}]});
            this.addChild(obj.name, obj);


            obj = new Dataset("Dataset01", this);
            obj._setContents({"ColumnInfo" : {"Column" : [{"id" : "custGrpCd","size" : "256","type" : "STRING"},{"id" : "natiCd","size" : "256","type" : "STRING"},{"id" : "natiNm","size" : "256","type" : "STRING"},{"id" : "travCd","size" : "256","type" : "STRING"},{"id" : "travNm","size" : "256","type" : "STRING"},{"id" : "regDt","size" : "256","type" : "STRING"},{"id" : "exteDt","size" : "256","type" : "STRING"}]},"Rows" : [{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{}]});
            this.addChild(obj.name, obj);
            
            // UI Components Initialize
            obj = new Edit("Edit00","580","52","520","44",null,null,null,null,null,null,this);
            obj.set_taborder("0");
            obj.set_value("edit에서 text를 드래그하고 마우스 버튼을 누른 상태로 브라우저 밖으로 이동하여 좌우 무빙");
            obj.set_text("edit에서 text를 드래그하고 마우스 버튼을 누른 상태로 브라우저 밖으로 이동하여 좌우 무빙");
            this.addChild(obj.name, obj);

            obj = new TextArea("TextArea00","40","52","520","137",null,null,null,null,null,null,this);
            obj.set_taborder("1");
            obj.set_value("기존에 드래그가 edit, textarea 등 영역밖에서도 동작되던 부분이 크롬업데이트되면서 \n안되는 현상이 발생합니다.\n\nedit에서 text를 드래그한 상태이고 마우스버튼을 누른상태에서 edit 영역을 벗어나서 좌우로 움직이면 텍스트 선택이 되야하나 \n마우스가 edit를 벗어나는 순간 text선택이 끊깁니다.\n\n이러한 현상으로 제품단에서 이전동작과 맞추기 위해서 제품에서 처리해줘야하는지 \n크롬자체 정책 변경으로  변경된 동작으로 사용해야하는지 문의드립니다.\n\n[크롬 148업데이트 변경관련]\nhttps://developer.chrome.com/release-notes/148?utm_source=copilot.com&hl=ko");
            this.addChild(obj.name, obj);

            obj = new Grid("Grid00","625","500","465","190",null,null,null,null,null,null,this);
            obj.set_binddataset("Dataset00");
            obj.set_cellsizingtype("both");
            obj.set_taborder("2");
            obj._setContents("<Formats><Format id=\"default\"><Columns><Column size=\"80\"/><Column size=\"80\"/><Column size=\"80\"/><Column size=\"80\"/><Column size=\"80\"/><Column size=\"80\"/><Column size=\"80\"/><Column size=\"80\"/></Columns><Rows><Row band=\"head\" size=\"24\"/><Row size=\"24\"/></Rows><Band id=\"head\"><Cell text=\"Column0\"/><Cell col=\"1\" text=\"Column1\"/><Cell col=\"2\" text=\"Column2\"/><Cell col=\"3\" text=\"Column3\"/><Cell col=\"4\" text=\"Column4\"/><Cell col=\"5\" text=\"Column5\"/><Cell col=\"6\" text=\"Column6\"/><Cell col=\"7\" text=\"Column7\"/></Band><Band id=\"body\"><Cell text=\"bind:Column0\"/><Cell col=\"1\" text=\"bind:Column1\"/><Cell col=\"2\" text=\"bind:Column2\"/><Cell col=\"3\" text=\"bind:Column3\"/><Cell col=\"4\" text=\"bind:Column4\"/><Cell col=\"5\" text=\"bind:Column5\"/><Cell col=\"6\" text=\"bind:Column6\"/><Cell col=\"7\" text=\"bind:Column7\"/></Band></Format></Formats>");
            this.addChild(obj.name, obj);

            obj = new ListView("ListView00","35","505","520","155",null,null,null,null,null,null,this);
            obj.set_bandinitstatus("collapse");
            obj.set_binddataset("Dataset01");
            obj.set_taborder("3");
            obj._setContents("<Formats><Format id=\"default\"><Band expandbarsize=\"40 40\" expandbartype=\"true\" height=\"56\" id=\"body\" width=\"100%\"><Cell bottom=\"0\" id=\"Cell00\" left=\"0\" text=\"bind:exteDt\" top=\"0\" width=\"235\"/><Cell bottom=\"0\" id=\"Cell01\" left=\"230\" right=\"0\" text=\"bind:custGrpCd\" top=\"0\"/><Cell bottom=\"0\" cssclass=\"Cell_BodyLine\" height=\"10\" id=\"Cell02\" left=\"10\" right=\"10\"/></Band><Band height=\"206\" id=\"detail\" width=\"100%\"><Cell height=\"36\" id=\"Cell02\" left=\"20\" text=\"여행사\" top=\"13\" width=\"80\"/><Cell height=\"36\" id=\"Cell03\" left=\"110\" right=\"15\" text=\"bind:travNm\" top=\"13\"/><Cell height=\"36\" id=\"Cell06\" left=\"20\" text=\"그룹유형\" top=\"49\" width=\"80\"/><Cell height=\"36\" id=\"Cell07\" left=\"110\" right=\"15\" text=\"bind:natiCd\" top=\"49\"/><Cell height=\"36\" id=\"Cell00\" left=\"20\" text=\"그룹국적\" top=\"85\" width=\"80\"/><Cell height=\"36\" id=\"Cell01\" left=\"18\" text=\"등록일자\" top=\"121\" width=\"80\"/><Cell height=\"36\" id=\"Cell04\" left=\"110\" right=\"15\" text=\"bind:regDt\" top=\"121\"/><Cell height=\"36\" id=\"Cell05\" left=\"110\" right=\"15\" text=\"bind:natiNm\" top=\"85\"/><Cell height=\"36\" id=\"Cell08\" left=\"18\" text=\"운영기간\" top=\"157\" width=\"80\"/><Cell height=\"36\" id=\"Cell09\" left=\"110\" right=\"15\" text=\"bind:exteDt\" top=\"157\"/></Band></Format></Formats>");
            this.addChild(obj.name, obj);

            obj = new TextArea("TextArea01","42","214","478","166",null,null,null,null,null,null,this);
            obj.set_taborder("4");
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
        this.registerScript("RP_105424.xfdl", function() {

        this.TextArea00_onlbuttonup = function(obj,e)
        {
        	this.TextArea01.deleteText();
        	this.TextArea01.insertText(obj.getSelectedText());
        };

        this.Edit00_onlbuttonup = function(obj,e)
        {
        	this.TextArea01.deleteText();
        	this.TextArea01.insertText(obj.getSelectedText());
        };

        });
        
        // Regist UI Components Event
        this.on_initEvent = function()
        {
            this.Edit00.addEventHandler("onlbuttonup",this.Edit00_onlbuttonup,this);
            this.TextArea00.addEventHandler("onlbuttonup",this.TextArea00_onlbuttonup,this);
        };

        this.loadIncludeScript("RP_105424.xfdl");
        this.loadPreloadList();
        
        // Remove Reference
        obj = null;
    };
}
)();
