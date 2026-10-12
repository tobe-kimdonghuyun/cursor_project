(function()
{
    return function()
    {
        if (!this._is_form)
            return;
        
        var obj = null;
        
        this.on_create = function()
        {
            this.set_name("grid_scroll_test6");
            this.set_titletext("New Form");
            if (Form == this.constructor)
            {
                this._setFormPosition(1280,720);
            }
            
            // Object(Dataset, ExcelExportObject) Initialize
            obj = new Dataset("Dataset00", this);
            obj._setContents({"ColumnInfo" : {"Column" : [{"id" : "Column0","size" : "256","type" : "STRING"}]},"Rows" : [{"Column0" : "123"}]});
            this.addChild(obj.name, obj);
            
            // UI Components Initialize
            obj = new Grid("Grid00","281","572","516","450",null,null,null,null,null,null,this);
            obj.set_binddataset("Dataset00");
            obj.set_taborder("1");
            obj._setContents("<Formats><Format id=\"default\"><Columns><Column size=\"80\"/></Columns><Rows><Row band=\"head\" size=\"24\"/><Row size=\"24\"/></Rows><Band id=\"head\"><Cell text=\"Column0\"/></Band><Band id=\"body\"><Cell text=\"bind:Column0\"/></Band></Format></Formats>");
            this.addChild(obj.name, obj);

            obj = new Edit("Edit00","167","307","693","66",null,null,null,null,null,null,this);
            obj.set_taborder("1");
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
        this.registerScript("RP_105534_grid_scroll_test6.xfdl", function() {
        this.fv_bKeyInput = false;   // 키 입력 중 여부
        this.fv_bScrolled = false;   // 키 입력 중 스크롤 발생 여부
        this.fv_nPrevPos  = 0;       // 키 입력 직전 스크롤 위치
        this.fv_nKey      = 0;
        this.fv_sComp     = "";

        /* Form onload : 각 컴포넌트에 onkeydown 연결 */
        this.Form_onload = function(obj, e)
        {
            for (var i = 0; i < this.components.length; i++)
            {
                var oComp = this.components[i];
                if (oComp == this.Edit00) continue;   // 결과 출력용 Edit 제외
                oComp.addEventHandler("onkeydown", this.fn_comp_onkeydown, this);
            }
        };

        /* 컴포넌트 onkeydown : 키 입력 직전 스크롤 위치 저장 */
        this.fn_comp_onkeydown = function(obj, e)
        {
            this.fv_bKeyInput = true;
            this.fv_bScrolled = false;
            this.fv_nPrevPos  = this.getVScrollPos();
            this.fv_nKey      = e.keycode;
            this.fv_sComp     = obj.name;
        };

        /* Form onvscroll : 키 입력 중 스크롤이 움직이면 FAIL */
        this.Form_onvscroll = function(obj, e)
        {
            if (!this.fv_bKeyInput || this.fv_bScrolled) return;

            var nCurPos = this.getVScrollPos();
            if (nCurPos != this.fv_nPrevPos)
            {
                this.fv_bScrolled = true;
                this.Edit00.set_value("[" + this.fv_sComp + "] 키 입력(keycode:" + this.fv_nKey
                    + ") 시 화면 스크롤 이동 " + this.fv_nPrevPos + " → " + nCurPos
                    + " : FAIL (버그 재현)");
            }
        };

        /* Form onkeyup : 스크롤 이동이 없었으면 PASS */
        this.Form_onkeyup = function(obj, e)
        {
            if (this.fv_bKeyInput && !this.fv_bScrolled)
            {
                this.Edit00.set_value("[" + this.fv_sComp + "] 키 입력(keycode:" + this.fv_nKey
                    + ") 시 화면 스크롤 이동 없음 : PASS");
            }
            this.fv_bKeyInput = false;
        };
        });
        
        // Regist UI Components Event
        this.on_initEvent = function()
        {
            this.addEventHandler("onkeyup",this.Form_onkeyup,this);
            this.addEventHandler("onload",this.Form_onload,this);
            this.addEventHandler("onvscroll",this.Form_onvscroll,this);
        };

        this.loadIncludeScript("RP_105534_grid_scroll_test6.xfdl");
        this.loadPreloadList();
        
        // Remove Reference
        obj = null;
    };
}
)();
