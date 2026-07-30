(function()
{
    return function()  
	{
        this.on_loadAppVariables = function()
        {		
            var obj = null;
			// global dataobject
		
            // global dataset

            
            // global variable

            
            obj = null;
        };
 
        // property, event, createMainFrame
        this.on_initApplication = function()
        {
            // properties
            this.set_id("Application_Desktop");
            this.set_screenid("Desktop_screen");

            if (this._is_attach_childframe)
            	return;
        
            // frame
            var mainframe = this.createMainFrame("mainframe","0","0","1280","720",null,null,this);
            mainframe.set_showtitlebar("true");
            mainframe.set_showstatusbar("true");
            mainframe.set_titletext("FullFrame");
            mainframe.on_createBodyFrame = this.mainframe_createBodyFrame;        
            // tray

        };
        
        this.loadPreloadList = function()
        {

        };
        
        this.mainframe_createBodyFrame = function()
        {
            var frame0 = new ChildFrame("WorkFrame",null,null,null,null,null,null,"Base::stackTraceView.xfdl",this);
            frame0.set_showtitlebar("false");
            frame0.set_showstatusbar("false");
            this.addChild(frame0.name, frame0);
            frame0.set_formurl("Base::stackTraceView.xfdl");

            this.frame=frame0;
        };
        
        this.on_initEvent = function()
        {
            this.addEventHandler("onerror",this.Application_onerror,this);
        };
        
        // script Compiler
        this.registerScript("Application_Desktop.xadl", function() {
        var _origShowModalSync = nexacro._showModalSync;
        nexacro._showModalSync = function(childframe, str_id, parent_frame, arr_arg, opener) {
            var _self = childframe;

            trace("=== [TOBE_TECH] [_showModalSync] 진입 ===");
            trace("=== [TOBE_TECH] [_showModalSync] formurl      : " + (_self ? _self.formurl : "null") + " ===");
            trace("=== [TOBE_TECH] [_showModalSync] parent_frame : " + (parent_frame ? parent_frame.id : "null") + " ===");
            try {
                trace("=== [TOBE_TECH] [_showModalSync] arr_arg      : " + JSON.stringify(arr_arg) + " ===");
            } catch(e) {
                trace("=== [TOBE_TECH] [_showModalSync] arr_arg      : [순환참조 객체] ===");
            }
            trace("=== [TOBE_TECH] [_showModalSync] opener       : " + (opener ? opener.id : "null") + " ===");
            trace("=== [TOBE_TECH] [_showModalSync] visible      : " + (_self ? _self.visible : "null") + " ===");
            trace("=== [TOBE_TECH] [_showModalSync] autosize     : " + (_self ? _self.autosize : "null") + " ===");

            if (_self && _self.formurl && _self.formurl.replace(/\./g, "").indexOf("popWorkxfdl") !== -1) {
        	   trace("=== [타이머 시작★] ===");
                nexacro._OnceCallbackTimer.callonce(_self, function() {
                    trace(_self.visible);
                    trace(_self);
                    if (_self && _self.visible == false) {
                        trace("=== [TOBE_TECH] [_showModalSync] 10초 후 visible=false → 강제 visible=true 처리 ===");
                        _self.visible = true;
                    }
                }, 7000);
            }
            return _origShowModalSync.apply(this, arguments);
        };

        var _origShowModalWindow = nexacro.ChildFrame.prototype._showModalWindow;
        nexacro.ChildFrame.prototype._showModalWindow = function(str_id, parent_frame, arr_arg, opener) {

           var _self = this;

            trace("=== [TOBE_TECH] [_showModalWindow] 진입 ===");
            trace("=== [TOBE_TECH] [_showModalWindow] formurl      : " + this.formurl + " ===");
            trace("=== [TOBE_TECH] [_showModalWindow] parent_frame : " + (parent_frame ? parent_frame.id : "null") + " ===");
            trace("=== [TOBE_TECH] [_showModalWindow] arr_arg      : " + JSON.stringify(arr_arg) + " ===");
            trace("=== [TOBE_TECH] [_showModalWindow] opener       : " + (opener ? opener.id : "null") + " ===");
            trace("=== [TOBE_TECH] [_showModalWindow] callback     : " + (typeof callback) + " ===");
            trace("=== [TOBE_TECH] [_showModalWindow] visible      : " + this.visible + " ===");
            trace("=== [TOBE_TECH] [_showModalWindow] autosize     : " + this.autosize + " ===");
        	//[TOBE_TECH]Base::popWorkxfdl / Base::popWork.xfdl 둘 다 인식
        	if (_self.formurl && _self.formurl.replace(/\./g, "").indexOf("popWorkxfdl") !== -1) {

                trace("=== [타이머 시작☆] ===");
                nexacro._OnceCallbackTimer.callonce(_self, function() {
                    if (_self && _self.visible == false) {
                        trace("=== [강제 VISIBLE TRUE] visible=true ===");
                        _self.visible = true;
                    }
                }, 7000);
            }
            return _origShowModalWindow.apply(this, arguments);
        };

        // ====================================================================
        // [TOBE_TECH][2026.05.29] showModal override 예외처리
        // 팝업 호출 시 정상적이지 못한 서버 응답 오류로 인해
        // 로직구현에 따른 ChildFrame 이 로드되지(visible=false 상태) 못하고
        // 모달 블로킹 상태가 유지되는 현상 방어처리적용안내.
        // 7초 후에도 visible=false 이면 서버 오류로 판단하고
        // 강제 visible=true 활성화하여
        // 사용자가 강제 종료 없이 업무를 볼 수 있도록 처리
        // ====================================================================

        var _origShowModal = nexacro.ChildFrame.prototype.showModal;
        nexacro.ChildFrame.prototype.showModal = function(parent_frame, arr_arg, opener, callback) {
            trace("=== [TOBE_TECH] [showModal] 진입 ===");
            trace("=== [TOBE_TECH] [showModal] formurl      : " + this.formurl + " ===");
            trace("=== [TOBE_TECH] [showModal] parent_frame : " + (parent_frame ? parent_frame.id : "null") + " ===");
            trace("=== [TOBE_TECH] [showModal] arr_arg      : " + JSON.stringify(arr_arg) + " ===");
            trace("=== [TOBE_TECH] [showModal] opener       : " + (opener ? opener.id : "null") + " ===");
            trace("=== [TOBE_TECH] [showModal] callback     : " + (typeof callback) + " ===");
            trace("=== [TOBE_TECH] [showModal] visible      : " + this.visible + " ===");
            trace("=== [TOBE_TECH] [showModal] autosize     : " + this.autosize + " ===");
            var _self = this;

            if (this.formurl && this.formurl.replace(/\./g, "").indexOf("popWorkxfdl") !== -1) {
                trace("=== [TOBE_TECH] popWork(공통) ▶ 타이머 시작 ===");
                nexacro._OnceCallbackTimer.callonce(_self, function() {
                    if (_self && _self.visible == false) {
                        trace("=== [TOBE_TECH] [showModal] 5초 후 visible=false 확인 ▶ 강제 visible=true 처리★");
                        _self.visible = true;
                    }
                }, 7000);
            }
            return _origShowModal.apply(this, arguments);
        };

        /**
         *=================================================
         * [TOBE_TECH][2026.05.29] nexacro.__startLoad 오버라이딩
         *  xfdl 파일 로드 체크/ 파일 수신 성공(status 0)
         *=================================================
         */
        if (nexacro.__startLoad) {
            var _origStartLoad = nexacro.__startLoad;
            nexacro.__startLoad = function(url, bindfn, type, cachelevel, async) {
                if (url && url.replace(/\./g, "").indexOf("popWorkxfdl") !== -1) {
                    var _origBindfn = bindfn;
                    bindfn = function(status, responseText) {
                        //[TOBE_TECH][RESULT] status 0 외, Error trace 출력
                        if (status !== 0) {
                            trace("=== [TOBE_TECH] [startLoad ERROR] url: " + url + " | status: " + status + " ===");
                        }

                        if (_origBindfn) _origBindfn.apply(this, arguments);
                    };
                }

                return _origStartLoad.apply(this, arguments);
            };
        }
        });
        this.checkLicense("");
        
        this.loadPreloadList();

        this.loadIncludeScript("Application_Desktop.xadl");
    };
}
)();
