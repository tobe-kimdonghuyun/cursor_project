(function()
{
    return function()
    {
        if (!this._is_form)
            return;
        
        var obj = null;
        
        this.on_create = function()
        {
            this.set_name("RP_105156_Grid");
            this.set_titletext("Grid MergeCell textAlign");
            if (Form == this.constructor)
            {
                this._setFormPosition(1280,720);
            }
            
            // Object(Dataset, ExcelExportObject) Initialize
            obj = new Dataset("Dataset00", this);
            obj._setContents({"ColumnInfo" : {"Column" : [{"id" : "Column0","size" : "256","type" : "STRING"}]},"Rows" : [{"Column0" : "자동차"},{"Column0" : "자동차"},{"Column0" : "자동차"}]});
            this.addChild(obj.name, obj);
            
            // UI Components Initialize
            obj = new Button("Button00","50","50","120","50",null,null,null,null,null,null,this);
            obj.set_taborder("0");
            obj.set_text("mergeCell");
            this.addChild(obj.name, obj);

            obj = new Grid("grd_RP_105156","50","110","300","180",null,null,null,null,null,null,this);
            obj.set_binddataset("Dataset00");
            obj.set_taborder("1");
            obj._setContents("<Formats><Format id=\"default\"><Columns><Column size=\"80\"/></Columns><Rows><Row band=\"head\" size=\"24\"/><Row size=\"24\"/></Rows><Band id=\"head\"><Cell text=\"Column0\"/></Band><Band id=\"body\"><Cell padding=\"0px 0px 0px 10px\" text=\"bind:Column0\"/></Band></Format></Formats>");
            this.addChild(obj.name, obj);

            obj = new TextArea("txa_Result","180","50","170","50",null,null,null,null,null,null,this);
            obj.set_taborder("2");
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
        this.registerScript("RP_105156.xfdl", function() {
        /*
         *	Grid Cell textAlign = left 로 설정한 경우 Grid.mergeCell()을 수행하면 padding left 가 사라지는 현상
         *
         *  - 재현 : Cell textAlign/padding 이 각각 'left'/'0px 0px 0px 10px'로 설정된 Grid Cell을 mergeCell() 수행
         *  - 판정 : getComputedStyle(grid.overlaycontrol.ctrl:text Element).left이 padding에 설정된 10px과 동일하면 통과
         */

        this.Button00_onclick = function(obj,e)
        {
        	this.grd_RP_105156.mergeCell(0, 0, 0, 2);

        	trace("padding : " + this.grd_RP_105156.getCellProperty("body", 0 , "padding"));

        	var elGrid = document.querySelector('[id*="grd_RP_105156.overlaycontrol.ctrl:text"]'); // Merge Cell text 요소

        	var nleft = window.getComputedStyle(elGrid).left;

        	this.txa_Result.value = ( nleft == '10px' ); // Element getComputedStyle left 가 padding 과 동일하면 PASS
        };

        });
        
        // Regist UI Components Event
        this.on_initEvent = function()
        {
            this.Button00.addEventHandler("onclick",this.Button00_onclick,this);
        };

        this.loadIncludeScript("RP_105156.xfdl");
        this.loadPreloadList();
        
        // Remove Reference
        obj = null;
    };
}
)();
