/* 키워드 검색 map 서비스 
   - map 서비스: naver api
   - 키워드 검색 서비스: kakao api*/
const express = require("express");
const app = express();

//mongoose 참조
const mongoose = require("mongoose");

//요청에 대한 정보를 콘솔에 기록하는 morgan 모듈 참조
const logger = require("morgan");

//폴더의 경로를 지정하는 path 모듈 참조(내장 모듈)
const path = require("path");

//config() 함수를 호출하여 .env의 환경변수 가져오기
require("dotenv").config();

//=========== 19) indexRoute 라우팅 모듈 참조
//indexRoute.js 라우팅 모듈 참조
const indexRouter = require("./routes/indexRoute.js");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {});
    console.log("MongoDB Connected.");

    // view engine setup
    app.set("views", path.join(__dirname, "views"));
    app.set("view engine", "ejs");

    //요청에 대한 정보를 console에 기록하는 morgan 미들웨어 등록
    app.use(logger("dev"));

    //JSON 포멧을 파싱하는 미들웨어 설정
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));

    //static 폴더(public) 지정
    app.use(express.static(path.join(__dirname, "public")));

    //=========== 20) indexRoute 라우팅 모듈 미들웨어 등록
    //indexRouter 미들웨어 등록
    app.use("/", indexRouter);

    //============================================
    // /* GET ("/") API */
    // app.get("/", (req, res, next) => {
    //   res.render("index"); //index.ejs 랜더링
    // });

    // /* GET ("/upload") API */
    // app.get("/upload", (req, res, next) => {
    //   res.render("upload"); //upload.ejs 랜더링
    // });
    //==============================================

    //catch 404 error
    app.use(function (req, res, next) {
      res.status(404).send("Sorry can't find that!");
    });

    //start server
    app.listen(process.env.PORT, () => {
      console.log(`Server listening on port ${process.env.PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
}; //end of connectDB

connectDB();
