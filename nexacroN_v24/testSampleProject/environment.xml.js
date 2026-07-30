if (nexacro.Environment)
{
    var env = nexacro._environment = new nexacro.Environment();
    env.on_init = function ()
    {
        this.set_themeid("theme::blue");
        this.set_datatyperule("2.0");
        this.set_tracemode("new");
        this.set_networksecurelevel("all");
        this.set_filesecurelevel("all");
    };
    env.on_initEvent = function ()
    {
        // add event handler
        this.addEventHandler("onerror",this.Environment_onerror,this);
    };
    env.loadTypeDefinition = function ()
    {
        nexacro._setTypeDefinitionURL("typedefinition.xml");
        nexacro._addService("theme", "file", "./_resource_/_theme_/", "session", null, "", "0", "");
        nexacro._addService("initvalue", "file", "./_resource_/_initvalue_/", "session", null, "", "0", "");
        nexacro._addService("xcssrc", "file", "./_resource_/_xcss_/", "session", null, "", "0", "");
        nexacro._addService("imagerc", "file", "./_resource_/_images_/", "session", null, "", "0", "");
        nexacro._addService("font", "file", "./_resource_/_font_/", "session", null, "", "0", "");
        nexacro._addService("stringrc", "file", "./_resource_/_stringrc_/", "session", null, "", "0", "");
        nexacro._addService("extlib", "file", "./_extlib_/", "session", null, "", "0", "");
        nexacro._addService("Base", "form", "./Base/", "none", null, "", "0", "0");
    	nexacro._component_uri = (nexacro._arg_compurl ? nexacro._arg_compurl : "./nexacrolib/component/");
    	nexacro._theme_uri = "./_resource_/_theme_/";
    	// load components
        var registerclass = [
        		{"id":"Button", "classname":"nexacro.Button", "type":"JavaScript"},
        		{"id":"Combo", "classname":"nexacro.Combo", "type":"JavaScript"},
        		{"id":"Edit", "classname":"nexacro.Edit", "type":"JavaScript"},
        		{"id":"MaskEdit", "classname":"nexacro.MaskEdit", "type":"JavaScript"},
        		{"id":"TextArea", "classname":"nexacro.TextArea", "type":"JavaScript"},
        		{"id":"Static", "classname":"nexacro.Static", "type":"JavaScript"},
        		{"id":"Div", "classname":"nexacro.Div", "type":"JavaScript"},
        		{"id":"PopupDiv", "classname":"nexacro.PopupDiv", "type":"JavaScript"},
        		{"id":"Radio", "classname":"nexacro.Radio", "type":"JavaScript"},
        		{"id":"CheckBox", "classname":"nexacro.CheckBox", "type":"JavaScript"},
        		{"id":"ListBox", "classname":"nexacro.ListBox", "type":"JavaScript"},
        		{"id":"Grid", "classname":"nexacro.Grid", "type":"JavaScript"},
        		{"id":"Spin", "classname":"nexacro.Spin", "type":"JavaScript"},
        		{"id":"Menu", "classname":"nexacro.Menu", "type":"JavaScript"},
        		{"id":"PopupMenu", "classname":"nexacro.PopupMenu", "type":"JavaScript"},
        		{"id":"Tab", "classname":"nexacro.Tab", "type":"JavaScript"},
        		{"id":"GroupBox", "classname":"nexacro.GroupBox", "type":"JavaScript"},
        		{"id":"Calendar", "classname":"nexacro.Calendar", "type":"JavaScript"},
        		{"id":"ImageViewer", "classname":"nexacro.ImageViewer", "type":"JavaScript"},
        		{"id":"ProgressBar", "classname":"nexacro.ProgressBar", "type":"JavaScript"},
        		{"id":"Plugin", "classname":"nexacro.Plugin", "type":"JavaScript"},
        		{"id":"Dataset", "classname":"nexacro.NormalDataset", "type":"JavaScript"},
        		{"id":"ListView", "classname":"nexacro.ListView", "type":"JavaScript"},
        		{"id":"DataObject", "classname":"nexacro.DataObject", "type":"JavaScript"},
        		{"id":"CheckBoxSet", "classname":"nexacro.CheckBoxSet", "type":"JavaScript"},
        		{"id":"MultiCombo", "classname":"nexacro.MultiCombo", "type":"JavaScript"},
        		{"id":"Panel", "classname":"nexacro.Panel", "type":"JavaScript"},
        		{"id":"TextField", "classname":"nexacro.TextField", "type":"JavaScript"},
        		{"id":"MultiLineTextField", "classname":"nexacro.MultiLineTextField", "type":"JavaScript"},
        		{"id":"DateField", "classname":"nexacro.DateField", "type":"JavaScript"},
        		{"id":"DateRangePicker", "classname":"nexacro.DateRangePicker", "type":"JavaScript"},
        		{"id":"PopupDateRangePicker", "classname":"nexacro.PopupDateRangePicker", "type":"JavaScript"},
        		{"id":"SpinField", "classname":"nexacro.SpinField", "type":"JavaScript"},
        		{"id":"SelectField", "classname":"nexacro.SelectField", "type":"JavaScript"},
        		{"id":"WebView", "classname":"nexacro.WebView", "type":"JavaScript"}
        ];
    	nexacro._addClasses(registerclass);
    };
    env.on_loadVariables = function ()
    {
        // Variables

        // Cookies

        // HTTP Header

    };
	env.on_loadDeviceAdaptors = function ()
	{
        // load device adatpor

	};
	
    // StringResource Information

	
    // User Script
    env.registerScript("environment.xml", function() {
    //[20260601][TOBE_TECH]e.responsebody 에, 값이 담겼을경우 error시에 한함.
    this.Environment_onerror = function(obj, e)
    {
        trace("statuscode   = " + e.statuscode);
        trace("responsebody = " + e.responsebody);


        var stackTrace = null;

        try {
            // responsebody 유효성 체크
            if (!e.responsebody || e.responsebody === "undefined" || e.responsebody.length === 0) {
                trace("responsebody 없음 - 추출 불가");
                trace("errormsg = " + e.errormsg);
                return;
            }

            if (nexacro._Browser != "Runtime")
            {
                // WRE: DOMParser 사용
                var parser = new DOMParser();
                var xmlDoc = parser.parseFromString(e.responsebody, "text/xml");

                // XML 파싱 오류 체크
                var parseError = xmlDoc.getElementsByTagName("parsererror");
                if (parseError.length > 0) {
                    trace("XML 파싱 오류: " + parseError[0].textContent);
                    return;
                }

                var parameters = xmlDoc.getElementsByTagName("Parameter");
                for (var i = 0; i < parameters.length; i++) {
                    if (parameters[i].getAttribute("id") === "ErrorMsg") {
                        var errorMsgText = parameters[i].textContent;
                        if (!errorMsgText) {
                            trace("ErrorMsg 값 없음");
                            break;
                        }
                        var errorMsgJson = JSON.parse(errorMsgText);
                        if (!errorMsgJson || !errorMsgJson.data || !errorMsgJson.data.stackTrace) {
                            trace("stackTrace 키 없음");
                            break;
                        }
                        stackTrace = errorMsgJson.data.stackTrace;
                        break;
                    }
                }
            }
            else
            {
                // NRE: 정규식으로 추출
    		    var errorMsgMatch = e.responsebody.match(/<Parameter id="ErrorMsg"[^>]*>([\s\S]*?)<\/Parameter>/);
                if (!errorMsgMatch || !errorMsgMatch[1]) {
                    trace("ErrorMsg 파라미터 찾지 못함");
                } else {
                    var decoded = errorMsgMatch[1]
                        .replace(/&quot;/g, '"')
                        .replace(/&#(\d+);/g, function(match, dec) {
                            return String.fromCharCode(dec);
                        });
                    var jsonObj = JSON.parse(decoded);
                    if (!jsonObj || !jsonObj.data || !jsonObj.data.stackTrace) {
                        trace("stackTrace 키 없음");
                    } else {
                        stackTrace = jsonObj.data.stackTrace;
                    }
                }
            }

        } catch (err) {
            trace("stackTrace 추출 실패: " + err.message);
        }

        trace("stackTrace = " + stackTrace);
    };









    //테스트코드
    this.Environment_onerror_test = function(obj, e)
    {
        trace("statuscode   = " + e.statuscode);
        trace("responsebody = " + e.responsebody);

        var stackTrace = null;

        try {
            // responsebody 유효성 체크
            if (!e.responsebody || e.responsebody === "undefined" || e.responsebody.length === 0) {
                trace("responsebody 없음 - 추출 불가");
                trace("errormsg = " + e.errormsg);
                return;
            }

            if (nexacro._Browser != "Runtime")
            {
                // WRE: DOMParser 사용
                var parser = new DOMParser();
                var xmlDoc = parser.parseFromString(e.responsebody, "text/xml");

                // XML 파싱 오류 체크
                var parseError = xmlDoc.getElementsByTagName("parsererror");
                if (parseError.length > 0) {
                    trace("XML 파싱 오류: " + parseError[0].textContent);
                    return;
                }

                var parameters = xmlDoc.getElementsByTagName("Parameter");
                for (var i = 0; i < parameters.length; i++) {
                    if (parameters[i].getAttribute("id") === "ErrorMsg") {
                        var errorMsgText = parameters[i].textContent;
                        if (!errorMsgText) {
                            trace("ErrorMsg 값 없음");
                            break;
                        }
                        var errorMsgJson = JSON.parse(errorMsgText);
                        if (!errorMsgJson || !errorMsgJson.data || !errorMsgJson.data.stackTrace) {
                            trace("stackTrace 키 없음");
                            break;
                        }
                        stackTrace = errorMsgJson.data.stackTrace;
                        break;
                    }
                }
            }
            else
            {
    		var testBody = '<?xml version="1.0" encoding="UTF-8"?>\n<Root xmlns="http://www.nexacroplatform.com/platform/dataset">\n\t<Parameters>\n\t\t<Parameter id="ErrorCode" type="int">-404</Parameter>\n\t\t<Parameter id="ErrorMsg" type="string">{&quot;success&quot;:false,&quot;code&quot;:&quot;404&quot;,&quot;message&quot;:&quot;&#50836;&#52397;&#54620; &#47532;&#49548;&#49828;&#47484; &#52286;&#51012; &#49688; &#50630;&#49845;&#45768;&#45796;.&quot;,&quot;data&quot;:{&quot;stackTrace&quot;:&quot;org.springframework.web.servlet.resource.ResourceHttpRequestHandler.handleRequest(ResourceHttpRequestHandler.java:585)&quot;}}</Parameter>\n\t</Parameters>\n\t<Dataset id="dsResult">\n\t\t<ColumnInfo>\n\t\t\t<Column id="COL1" type="string" size="256"/>\n\t\t\t<Column id="COL2" type="string" size="256"/>\n\t\t\t<Column id="COL3" type="int" size="10"/>\n\t\t</ColumnInfo>\n\t\t<Rows>\n\t\t\t<Row>\n\t\t\t\t<Col id="COL1">&#44050;1</Col>\n\t\t\t\t<Col id="COL2">&#44050;2</Col>\n\t\t\t\t<Col id="COL3">123</Col>\n\t\t\t</Row>\n\t\t</Rows>\n\t</Dataset>\n</Root>';
                // NRE: 정규식으로 추출
                  var errorMsgMatch =testBody.match(/<Parameter id="ErrorMsg"[^>]*>([\s\S]*?)<\/Parameter>/);
    		   // var errorMsgMatch = e.responsebody.match(/<Parameter id="ErrorMsg"[^>]*>([\s\S]*?)<\/Parameter>/);
                if (!errorMsgMatch || !errorMsgMatch[1]) {
                    trace("ErrorMsg 파라미터 찾지 못함");
                } else {
                    var decoded = errorMsgMatch[1]
                        .replace(/&quot;/g, '"')
                        .replace(/&#(\d+);/g, function(match, dec) {
                            return String.fromCharCode(dec);
                        });
                    var jsonObj = JSON.parse(decoded);
                    if (!jsonObj || !jsonObj.data || !jsonObj.data.stackTrace) {
                        trace("stackTrace 키 없음");
                    } else {
                        stackTrace = jsonObj.data.stackTrace;
                    }
                }
            }

        } catch (err) {
            trace("stackTrace 추출 실패: " + err.message);
        }

        trace("stackTrace = " + stackTrace);
    };
    });
					
    env = null;
    nexacro._getExtUserCssScreenType = nexacro._getCurrentScreenType;
}
