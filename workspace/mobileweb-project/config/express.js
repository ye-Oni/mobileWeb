/* express 서버 구축 관련 설정 모듈 */

console.log("call : /config/express.js");

const express = require("express");
const path = require("path");

//UI를 처리하기 위한 express-handlebars(템플릿 엔진) 참조
const exphbs = require("express-handlebars");
// const hbsHelper = require("handlebars-helpers");

//환경 설정 모듈 참조
const ENV = require("./enviroment.js");

//요청된 cookie를 파싱해주는 cookie-parse 모듈 참조(cookie 설정시 사용)
const cookieParser = require("cookie-parser");
//cookie-session 모듈 참조
const cookieSession = require("cookie-session");

//세션(session)모듈 참조
const session = require("express-session");

/* 세션을 DB에 저장하기 위한  mongoStore
   - 세션을 메모리가 아닌 mongoStore(db)에 저장하여 서버 재시작과 관계없이 세션을 유지시키기 위해
*/
const MongoStore = require("connect-mongo");
//const FileStore = require('session-file-store')(session); 파일스토리지사용시

// ===== flash 메시지(일회성 메시지)를 보내기 위한 'connect-flash' 모듈 참조(2) ====//
/* - connect-flash 모듈은 1회성 메시지를 요청 객체에 넣어 둘 수 있는 기능을 제공   
   - 주로 회원가입이나 로그인 error 같은 1회성 메시지를 요청 객체에 담아 보낼 때 사용
   - 메시지는 req.flash(key, message) 메서드를 이용해 key에 메시지를 설정하여 보냄
     ex) if (err) { 
             req.flash("msg", err.message);
             res.redirect("/signup");
         } else {
             req.flash("msg", "회원가입성공");
             res.redirect("/login");
          }
      - flash 메시지를 불러올 때는 req.flash() 메서드 사용
      - 'connect-flash' 모듈은 'cookie-parser'와 'cookie-session'을 사용함으로
         이들보다 뒤에서 참조해야 함
*/
const flash = require("connect-flash");

module.exports = (app, passport) => {
  //static 폴더(public) 정의
  app.use(express.static("public"));

  //view template 엔진(handlebars)의 인스턴스(hbs) 생성
  const hbs = exphbs.create({
    extname: ".hbs", //사용할 확장자
    defaultLayout: __dirname + "/../app/views/layouts/default.hbs", //기본 레이아웃으로 사용할 템플릿 이름
    layoutsDir: __dirname + "/../app/views/layouts", // 기본 레이아웃인 defaultLayout의 경로 설정
  });

  /* 핸들바에서 사용하는 helper 클래스들의 handlebars-helpers 모듈 참조
       https://github.com/helpers/handlebars-helpers 플러그인을 사용*/
  require("handlebars-helpers")(hbs);

  //사용할 뷰 엔진(hbs.engine) 설정
  app.engine(".hbs", hbs.engine);

  /* 쿠기설정 */
  app.use(cookieParser()); //쿠키사용을 설정
  // app.use(cookieSession({ secret: ENV.SESSION_SECRET })); //세션값을 쿠키에 저장

  /* 세션을 저장할 곳을 설정  
     - session ID는 cookie에 저장되고, session DATA는 서버에 저장
     - 실무에서는 일반적으로 메모리DB(etc. redis) 사용하지만 실습에선 mongodb를 이용
 */
  //============================================================

  //======= passport 초기화(3) ============//
  /* passport 사용을 위한 설정
     - passport 모듈의 initialize()함수와 session() 함수를 호출했을 때
       반환되는 객체를 미들웨어로 사용하도록 설정
  */
  app.use(passport.initialize()); //새로운 요청마다 패스포트 초기화
  app.use(passport.session()); //새로운 요청마다 세션 변경

  //flash 메세지 미들웨어 등록
  app.use(flash());

  /** JSON Parser 미들웨어 등록*/
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  app.set("view engine", ".hbs"); //사용할 뷰 엔진 정의
  app.set("views", path.join(__dirname, "/../app/views")); //뷰가 있는 디렉토리를 정의
};
