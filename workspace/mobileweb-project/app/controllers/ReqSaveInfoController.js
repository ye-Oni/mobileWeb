/* 경락정보조회및저장 Controller(라우팅 API 모듈 선언) */

console.log("call : /controllers/ReqSaveInfoController.js");

const marketList = require("../../config/marketData.json");
const { SERVICEKEY, API_URL } = require("../../config/enviroment.js");
const { getNameByCode } = require("../../helper/utility.js");

//mongoose 모듈 참조
const mongoose = require("mongoose");

//MarketHistory 모델 가져오기
const MarketHistory = mongoose.model("MarketHistory");

// 비동기 통신을 위한 Request.js 라이브러리 참조(request-promise 모듈)
const request = require("request-promise");
const pageTitle = "경락정보 조회 및 저장"; //타이틀

/* 경락가격정보 조회 라우팅 API 설정(localhost:3000/reqSaveInfo)
   - DB에 저장된 경락가격정보를 조회하는 API
     lean() 함수: Mongoose 쿼리는 기본적으로 Mongoose Document 객체를 반환한다. 
            Mongoose Document 객체는 변경 추적을 위한 internal state가 크기 때문에 
            Vanilla JavaScript 객체보다 훨씬 무겁다.
            lean() 옵션을 사용하면 Mongoose는 Mongoose Document 객체가 아닌 
            가벼운 POJO(Plain Old Java Object, 오래된 방식의 간단한 자바 객체라는 의미
            즉, 특정 기술과 환경에 종속되어 동작하는 것이 아닌 순수한 자바 객체)객체를 반환
   */
module.exports.index = async (req, res) => {
  /* MongoDB(markethistories)의 데이터를 조회(전체) */
};

/* DB 저장내역 show 상세보기 라우팅 API 설정 */
// http://localhost/reqSaveInfo/show?id={Object_ID}
module.exports.show = async (req, res) => {
  //DB(markethistories)의 데이터를 조회(특정 _id 조회)
};

// DELETE 라우팅 API 설정 - http://localhost/reqSaveInfo/delete
module.exports.deleteResult = async (req, res) => {
  //DB(MarketHistory)에서 데이터 삭제(id)
  console.log(req.body.id);
};

/* 공공DB포털에 경락가격정보 요청(GET) 라우팅 API 설정
   - localhost:3000/reqSaveInfo에서 form.hbs을 통해 요청파라미터를 받아 처리
   - form에서 날짜와 저장개수, 과일을 선택한 후 "조회및저장하기" 버튼을 클릭하면
    post("/reqSaveInfo/result") API를 통해 이곳으로 경락가격정보 요청을 의뢰하면 처리하는 API */
module.exports.createResult = async (req, res) => {
  /* Request.js 라이브러리의 request-promise 모듈을 이용하여 공공DB포털의 
       경락가격정보서비스 서버에 Get 요청(요청 파라미터는 qs 옵션에 설정)
       - 서버에서 응답한 경락가격정보를 DB에 저장 */
};
