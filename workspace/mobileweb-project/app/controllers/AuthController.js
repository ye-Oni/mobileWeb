// 회원 가입 및 로그인 인증 모듈 */

console.log("call : /controllers/Authcontroller.js");

const mongoose = require("mongoose");
//User 모델 참조
const User = mongoose.model("User");

//login 라우팅 함수 설정 */
module.exports.login = async (req, res) => {
  console.log("login 함수 호출");

  //회원 가입에 성공한 경우 req.flash()에는 "회원가입성공" 메시지를 담고 있음
  res.render("user/login", { pageTitle: "로그인", alert: req.flash() });
};

//signup 라우팅 함수 설정 */
module.exports.signup = async (req, res) => {
  console.log("signup 함수 호출");

  //회원 가입에 실패한 경우 req.flash()에는 "err.message" 메시지를 담고 있음
  res.render("user/signup", { pageTitle: "회원가입", alert: req.flash() });
};

//logout 라우팅 함수 설정
module.exports.logout = async (req, res) => {
  console.log("logout 함수 호출");

  // console.log(req.session.passport.user);
  console.log(req.session);

  //logout 시 세션 정보 삭제(destroy)
};

//MongoDB에 user 정보(이메일과 비밀번호, salt)를 저장하는 라우팅 함수
module.exports.create = async (req, res) => {
  console.log("create 함수 호출");
};

/* requiresLogin 라우팅 함수 
   - 클리이언트 요청이 있을 때마다 사용자 인증 여부 확인
   - 인증(로그인)이 되어 있으면 다음을 실행할 수 있고,
     아니면 '/login'으로 리다이렉트
    예) app.get("/reqInfo", auth.requiresLogin,marketReqInfo.index);*/
module.exports.requiresLogin = async (req, res, next) => {
  console.log("requiresLogin 함수 호출");
  console.log(req.isAuthenticated());
};

//checkUserLogin 라우팅 함수 설정 */
module.exports.checkUserLogin = async (req, res) => {
  console.log(".checkUserLogin 함수 호출");

  /* sessions에 returnTo가 설정되어있다면 해당주소로, 없다면 rootpath('/')로 이동 
     - 세션에 리다이렉션할 url이 있으면 해당 url로 리다리렉션하고, 
       없으면 "/"로 리다이리렉션
  */
  const redirectTo = req.session.returnTo ? req.session.returnTo : "/";
  console.log(redirectTo);

  delete req.session.returnTo;
  res.redirect(redirectTo);
};
