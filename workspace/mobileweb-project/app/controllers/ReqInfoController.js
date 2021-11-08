/* 경락정보조회 Controller(라우팅 API 모듈 선언) */

console.log("call : /controllers/ReqInfoController.js");

// marketData.json 참조 */
const marketList = require("../../config/marketData.json");

// utility.js에서 getNameByCode 함수 참조
const { getNameByCode } = require("../../helper/utility.js");

// enviroment.js.에서 API_URL과 SERVICEKEY 참조
const { API_URL, SERVICEKEY } = require("../../config/enviroment.js");

// 비동기 통신을 위한 Request.js 라이브러리 참조(request-promise 모듈)
const request = require("request-promise");
const pageTitle = "경락정보 조회";

// 경락정보조회(form) 라우팅 API 설정(localhost:3000/reqInfo)
module.exports.index = async (req, res) => {};

/* 경락정보조회(result) 요청 라우팅 API(/reqInfo/result) 설정
   - localhost:3000/reqInfo에서 form을 통해 요청파라미터를 받아 처리
   - form에서 날짜와 과일을 선택한 후 "조회하기" 버튼을 클릭하면
    "/reqInfo/result" API를 통해 이곳으로 경락가격정보 요청을 의뢰하면 처리하는 API 

   - Request.js 라이브러리의 request-promise 모듈을 이용하여 공공DB포털의 
     경락가격정보서비스 서버에 Get 요청(요청 파라이터는 qs 옵션에 설정) */
module.exports.result = async (req, res) => {};
