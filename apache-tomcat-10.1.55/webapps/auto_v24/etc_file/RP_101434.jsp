<%@ page contentType="text/html; charset=euc-kr" %>
<%@ page language="java"%>

<%@ page import="com.nexacro.java.xapi.tx.*" %>
<%@ page import="com.nexacro.java.xapi.data.*" %>
<%@ page import="com.nexacro.java.xapi.data.datatype.*" %>


<%

	
	String strChar = "euc-kr";
	String formatMethod = "";
	String Data = "";
	
	/*********************************************************
	* request로 들어온 내용을 parsing하여
	* input variable list, input dataset list에 저장한다.
	* (XPLATFORM 에서 보내온 데이터를 parsing한다.)
	
	
	*********************************************************/
	
	
	PlatformRequest platformRequest = new PlatformRequest(request.getInputStream(), PlatformType.CONTENT_TYPE_XML);
    platformRequest.receiveData();
   	
	
	
	PlatformData inPD = platformRequest.getData();
	
	VariableList   inVariableList  = inPD.getVariableList(); //Agument를 가져옴
    DataSetList    inDataSetList   = inPD.getDataSetList();  //Dataset을 가져옴
	
    /*********************************************************
     * response로 보낼 내용을 생성한다.
     * output variable list, output dataset list에 저장한다.
     * (XPLATFORM 이 받을 수 있는 데이터 형태로 가공)
     *********************************************************/
 
     out.clear();
    out=pageContext.pushBody();    
    
     PlatformResponse platformResponse = new PlatformResponse(response.getOutputStream(), PlatformType.CONTENT_TYPE_XML, strChar);
     PlatformData outPD = platformRequest.getData();
     VariableList    outVariableList  = new VariableList();
     DataSetList     outDataSetList   = new DataSetList();
     
     
     try {

         // MiPlatform 으로 전송할 Output Dataset 을 생성한다.
        

	String ErrorMsgData = "ORACLE,DUAL ),;";
			 for(int i = 0 ; i<1000 ; i ++)
			 {
				ErrorMsgData += "SELECT A.SONG,NVL(B.SONG,0) KIKI FROM (SELECT 'TOBE' TITLE FROM DUAL) A , (SELECT 'COCO' SONG, KIKI FROM AAA) B WHERE A.SONG = B.SONG(+)";				
			 }
		

			// outDataSetList.add(outDataSet);
			outVariableList.add("ErrorCode", -3);	
			outVariableList.add("ErrorMsg", ErrorMsgData );
			//outVariableList.add("ErrorMsg", "ErrorMsgData" ); //ssh
		
        // Output Vairable 을 세팅한다.
        //outVariableList.add("ErrorMsg",  "error");
		//outVariableList.add("strOutputData", "※ Output Vairable을 받으려면, 화면의 전역변수로 선언하면 됩니다.");

     } catch(Exception e) {
		 
         // Output Vairable 을 세팅한다.
         outVariableList.add("ErrorCode", -1);
         outVariableList.add("ErrorMsg",  "error");
		// outVariableList.add("ErrorCode", -1);
     } finally {

         // 조회 결과(Output Dataset List, Output Variable List)를 MiPlatform 으로 전송
        outPD.setDataSetList(outDataSetList);
        outPD.setVariableList(outVariableList);
        platformResponse.setData(outPD);
        platformResponse.sendData();
     }
    
%>