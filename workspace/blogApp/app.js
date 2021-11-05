// mongoose를 이용한 MongoDB 다루기 1

const express = require("express");
const app = express();

const mongoose = require("mongoose");

// TODO : config() 함수를 호출하여 .env의 환경변수 가져오기
require("dotenv").config();

// TODO : 라우팅 API 모듈(userRoute) 참조
const { userRouter } = require("./routes/userRoute");
const { blogRouter } = require("./routes/blogRoute");

// TODO: User model 참조
const { User } = require("./models/User");

// JSON 포멧을 파싱하는 미들웨어 설정
app.use(express.json());

// Add yout connection string into yout application code(MongoDB Atlas)
//const MONGO_URI = "mongodb+srv://ye5ni:ye5ni@cluster0.c8hvi.mongodb.net/blogApp?retryWrites=true&w=majority"

//TODO: MongoDB Connection(1)
const connectDB = async () => {
    try {
      await mongoose.connect(process.env.MONGO_URI, {
        // useNewUrlParser: true, //option 설정
        // useUnifiedTopology: true,
        // useCreateIndex: true,
        // useFindAndModify: false,
      });
      console.log("MongoDB Connected.");

      // TODO : 미들웨어(userRouter 등록)
        // - 요청패스가 '/user'로 들어오면 userRouter로 연결
        //             '/blog'로 들어오면 blogRouter로 연결
      app.use("/user", userRouter);
      app.use("/blog", blogRouter);

      // TODO : mongoose 가 생성하는 쿼리 내용을 콘솔에 출력
      mongoose.set("debug", true);

      //start server
      app.listen(process.env.PORT, () => {
        console.log(`Server listening on port ${process.env.PORT}`);
      });
    } catch (error) {
      console.log(error);
    }
  };

  connectDB();
  