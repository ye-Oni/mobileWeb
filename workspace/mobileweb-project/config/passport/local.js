/*  Pssport Strategy(인증 방식) 설정 모듈 
   - 로컬 인증 방식(LocalStrategy)으로 스트래티지 설정
*/
console.log("call : /config/passport/local.js");

const mongoose = require("mongoose");

// =========== 패스포트 Strategy(인증방식) 설정(8) =============//
// ('passport-local').Strategy 모듈 참조
// 사용자의 이메일과 비밀번호를 전달받아 db에 저장된 정보와 비교하는 로컬 인증 방식 기능 제공
const LocalStrategy = require("passport-local").Strategy;

// User 모델 참조
const User = mongoose.model("User");

/* 로컬 패스포트 인증을 위한 LocalStrategy 스트래티지 설정
   - login.hbs에서 입력받은 요청 파라미터 값으로 User의 아이디와 비밀번호를 인증

   - 첫 번째 파라미터{객체}: 어떤 Form 필드에서 아이디와 비밀번호를 전달받을 지 설정하는 옵션   
     . login.hbs의 Form Data에서 name으로 설정한 값과 패스포트 내에서 사용할 값을 맵핑시켜줌
       <input name="user_email" class="form-control" type="email"/> 
       <input name="user_password" class="form-control" type="password"/> */

module.exports = new LocalStrategy(
  {
    //첫 번째 파라미터: 인증에 사용할 필드 지정
  },
  /* 두 번째 파라미터: email과 password가 들어오면 실행하는 인증 콜백함수(local 인증처리)
     -  email로 등록된 user가 없으면 "매칭되는 아이디가 없습니다"라고 error를 보내고,
        user가 있으면, password를 비교하여 인증 처리
     -  인증결과를 done()메서드를 이용하여 authenticate 쪽으로 알려 주어야
        라우팅 함수안에서 authenticate를 호출했을 때 각각의 상황에 따라 처리할 수 있음 
  */
  async (req, email, password, done) => {
    console.log("passport local 인증 처리");

    //user가 있으면, password를 비교하여 인증 처리
  }
);
