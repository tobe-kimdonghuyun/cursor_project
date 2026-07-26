(function()
{
    return function()
    {
        if (!this._is_form)
            return;
        
        var obj = null;
        
        this.on_create = function()
        {
            this.set_name("Form_Work");
            this.set_titletext("DataObject REST API 연동 샘플");
            if (Form == this.constructor)
            {
                this._setFormPosition(1280,720);
            }
            
            // Object(Dataset, ExcelExportObject) Initialize
            obj = new DataObject("dobj_post", this);
            this.addChild(obj.name, obj);


            obj = new Dataset("ds_post", this);
            obj._setContents({"ColumnInfo" : {}});
            this.addChild(obj.name, obj);
            
            // UI Components Initialize
            obj = new Static("stc_title","30","20","900","30",null,null,null,null,null,null,this);
            obj.set_taborder("0");
            obj.set_text("DataObject 오브젝트 REST API 연동 샘플 (GET https://jsonplaceholder.typicode.com/posts)");
            this.addChild(obj.name, obj);

            obj = new Button("btn_search","30","60","140","40",null,null,null,null,null,null,this);
            obj.set_taborder("1");
            obj.set_text("게시글 조회");
            this.addChild(obj.name, obj);

            obj = new Static("stc_status","190","60","700","40",null,null,null,null,null,null,this);
            obj.set_taborder("2");
            obj.set_text("");
            this.addChild(obj.name, obj);

            obj = new Grid("grd_post","30","120","1220","560",null,null,null,null,null,null,this);
            obj.set_autofittype("col");
            obj.set_taborder("3");
            obj._setContents("");
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
        this.registerScript("Form_Work.xfdl", function() {

        this.Form_Work_onload = function(obj, e)
        {
            this.dobj_post.addEventHandler("onsuccess", this.dobj_post_onsuccess, this);
            this.dobj_post.addEventHandler("onload", this.dobj_post_onload, this);
            this.dobj_post.addEventHandler("onerror", this.dobj_post_onerror, this);
        };

        this.btn_search_onclick = function(obj, e)
        {
            this.stc_status.set_text("조회 중...");
            this.dobj_post.request("SEARCH", "GET", "https://jsonplaceholder.typicode.com/posts");
        };

        // request 호출 후 통신이 성공하면 onsuccess가 먼저 발생하고, 이어서 onload에서 data 속성값을 확인할 수 있다
        this.dobj_post_onsuccess = function(obj, e)
        {
            trace(e.serviceid + ":" + e.statuscode);

            if (e.statuscode > 200)
            {
                e.preventDefault();
                this.stc_status.set_text("통신 오류: " + e.statuscode);
            }
        };

        // request 메소드 호출로 인한 로딩 완료 시에만 처리 (DataObject.REASON_REQUEST = 2)
        this.dobj_post_onload = function(obj, e)
        {
            if (e.reason != DataObject.REASON_REQUEST) return;

            if (!(obj.data instanceof Array) || obj.data.length == 0)
            {
                this.stc_status.set_text("조회된 데이터가 없습니다.");
                return;
            }

            this.ds_post.clear();

            // 응답 데이터의 첫 행을 기준으로 Dataset 컬럼을 동적으로 구성한다 (JSON key -> 대문자 컬럼 id)
            var objSample = obj.data[0];
            for (var key in objSample)
            {
                var objColInfo = new ColumnInfo();
                objColInfo.type = "String";
                objColInfo.datapath = "@." + key;
                this.ds_post.addColumnInfo(key.toUpperCase(), objColInfo);
            }

            this.ds_post.binddataobject = obj.id;
            this.ds_post.dataobjectpath = "$[*]";

            this.grd_post.binddataset = this.ds_post.name;
            this.grd_post.createFormat();

            this.stc_status.set_text("조회 완료: " + this.ds_post.rowcount + "건");
        };

        this.dobj_post_onerror = function(obj, e)
        {
            trace(e.statuscode + ":" + e.errormsg);
            this.stc_status.set_text("통신 오류: " + e.statuscode + " " + e.errormsg);
        };


        });
        
        // Regist UI Components Event
        this.on_initEvent = function()
        {
            this.addEventHandler("onload",this.Form_Work_onload,this);
            this.btn_search.addEventHandler("onclick",this.btn_search_onclick,this);
        };

        this.loadIncludeScript("Form_Work.xfdl");
        this.loadPreloadList();
        
        // Remove Reference
        obj = null;
    };
}
)();
