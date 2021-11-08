/* 클라이언트 요청 패스에 따른 라우팅 함수 설정 모듈 */

console.log("call : /config/routes.js");

//모듈 가져오기
const marketReqInfo = require("../app/controllers/reqInfoController.js");
const marketReqSaveInfo = require("../app/controllers/reqSaveInfoController.js");
const auth = require("../app/controllers/AuthController.js");

//라우팅 API 설정
module.exports = function (app, passport) {};
