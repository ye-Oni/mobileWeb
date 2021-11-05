// User 라우팅 API 모듈화

const mongoose = require("mongoose");
// Router 함수 참조
const Router = require("express");
// userRouter 생성
const userRouter = Router();
// User model 참조
const { User } = require("../models/User");


// TODO : CRUD API
try{
    // post api (user 생성)
    userRouter.post("/user", async (req, res) => {
        // 클라이언트로부터 전송된 요청 데이터 추출
        let { username, info } = req.body;

        // 필수 항목(username, name, phone) validation
        if (!username || !info.name || !info.phone)
          return res
          .status(400) // client error
          .send({ error: "username, name, phone은 필수항목임."});

        // user model 인스턴스 생성 및 DB 저장
        try{
            //user model instance 생성(document)
            const user = new User(req.body);

            // DB에 document 저장
            await user.save();
            return res.send(user);
        } catch(error) {
            return res.status(500).send({ error: error.message }); // server error
        }
    });

    // get api(전체 조회)
    userRouter.get("/user", async (req, res) => {
      try{
        // 전체 document를 찾아서 users에 저장
        const users = await User.find({});
        return res.send({ users });
      } catch (error) {
        console.log(error);
        return res.status(500).send({ error: error.message });
      }
    });
    
    // get api(요청패스에 URL 파라미터를 추가하여 특정 사용자 정보를 조회)
    userRouter.get("/user/:userId", async (req, res) => {
      try {
        // req.params 에서 userId 값을 추출
        const { userId } =  req.params;
        console.log(userId);

        // userId validation
        if (!mongoose.isValidObjectId(userId))
          return res.status(400).send({ error: "invalid userId" });

        // userId에 해당하는 사용자 검색
        const user = await User.findOne({ _id: userId });
        return res.send({ user });
      } catch (error) {
        console.log(error);
        return res.status(500).send({ error: error.message })
      }
    });

    // delete api(특정 사용자 정보를 삭제)
    userRouter.delete("/user/:userId", async (req, res) => {
      try {
        // req.params 에서 userId 값을 추출
        const { userId } = req.params;
        console.log(userId);

        // userId validation
        if (!mongoose.isValidObjectId(userId))
          return res.status(400).send({ error: "invalid userId "});
        // 삭제할 user document를 DB에서 가져와서 user 객체에 저장하고 DB에서 삭제
        const user = await User.findOneAndDelete({ _id: userId });
        // await User.deleteOne({ _id: userId }); // user 반환이 필요없을 때 사용
        return res.send({ user });
      } catch (error) {
        console.log(error);
        return res.status(500).send({ error: error.message });
      }
    });

    // put api(특정 사용자 정보 수정)
    userRouter.put("/user/:userId", async (req, res) => {
      try {
        // req.params 에서 userId 값을 추출
        const { userId } = req.params;
        console.log(userId);

        // userId validation
        if (!mongoose.isValidObjectId(userId))
          return res.status(400).send({ error: "invalid userId" });

        // 사용자의 요청 정보 추출
        const { info } = req.body;
        console.log(info);

        // field validation
        if (!info.name && !info.phone && !info.email && !info.age)
          return res.status(400).send({ error: "no fields to modify" });
        
        if (info.name && typeof info.name != "string")
          return res.status(400).send({ error: "name must be a string" });
        if (info.phone && typeof info.phone != "string")
          return res.status(400).send({ error: "phone must be a string" });
        if (info.email && typeof info.email != "string")
          return res.status(400).send({ error: "email must be a string" });
        if (info.age && typeof info.age != "number")
          return res.status(400).send({ error: "age must be a Number" });
        
        // 수정할 user document를 mongoDB 에서 가져와서 user 객체에 저장
        let user = await User.findById(userId);
        console.log({ before: user });

        // 사용자의 요청정보를 user 객체의 각 필드에 할당
        if (info.name) user.info.name = info.name;
        if (info.phone) user.info.phone = info.phone;
        if (info.email) user.info.email = info.email;
        if (info.age) user.info.age = info.age;

        console.log({ after: user });
        // 수정한 user 객체를 MongoDB에 저장(내부적으로 updateOne()호출)
        await user.save();

        return res.send({ user });
      } catch (error) {
        console.log(error);
        return res.status(500).send({ error: error.message});
      }
    });
  } catch(error) {
      console.log(error);
      return res.status(500).send({ error: error.message });
  }

// userRouter 모듈화
module.exports = {
    userRouter,
};