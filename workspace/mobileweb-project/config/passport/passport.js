/*  passport 사용자 인증 처리
  - 인증 방식(LocalStrategy) 등록
  - 인증 후 사용자 정보를 세션에 저장하거나 사용자 정보를 복원하는 모듈 */

console.log("call : /config/passport/passport.js");

/* 인증 방식(LocalStrategy) 모듈(local.js) 참조
   - 인증 방식별로 설정 파일을 만들어 스트래티지를 선언
*/
const local = require("./local.js");
//const facebook = require('./facebook.js');//페이스북 스트래티지
//const twitter = require('./twitter.js');//트위터 스트래티지

//인증 후 사용자 정보를 세션에 저장하거나 사용자 정보를 확인
//========================================================
