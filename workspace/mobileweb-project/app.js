/* 경락정보서비스 Main App */

console.log("call : app.js");

// 필요한 기본 모듈 참조
const express = require("express");
const mongoose = require("mongoose");
const fs = require("fs"); //file system 모듈

//요청에 대한 정보를 콘솔에 기록하는 morgan 참조
const logger = require("morgan");

//==== 패스포트 모듈 참조(1) ======//
//사용자 인증 처리에 필요한 기본 기능을 제공하는 모듈 참조
const passport = require("passport");

// 포트번호, DB, 서비스키, URL 등 위한 환경설정 모듈 참조
const ENV = require("./config/enviroment.js");

//express 객체 생성
const app = express();

/* 'app/models' 폴더 path 설정 */
const join = require("path").join;
const models = join(__dirname, "app/models");

/* models 폴더에 있는 모듈파일(.js)을 전부 읽어서 해당 모듈 참조
 */
fs.readdirSync(models)
  .filter((file) => file.match(/^[^\.].+\.js$/))
  .forEach((file) => require(join(models, file)));

/* passport, express,  routes 모듈(설정파일) 참조 */
require("./config/passport/passport.js")(passport);
require("./config/express.js")(app, passport);
require("./config/routes.js")(app, passport);

//app 내보내기
module.exports = app;

/* 몽고디비연결 */
mongoose.connect(ENV.DATABASE, {}, (err) => {
  if (err) {
    console.log("DB is not connected");
    console.log(err);
  } else {
    console.log("DB connected");
  }
});

/* mongoose가 생성하는 쿼리 내용을 콘솔에 출력 */
mongoose.set("debug", true);

//요청에 대한 정보를 console에 기록하는 morgan 미들웨어 등록
app.use(logger("dev"));

/* 서버 시작*/
app.listen(ENV.PORT || 3000, () => {
  console.log("running on " + ENV.PORT || 3000);
});
