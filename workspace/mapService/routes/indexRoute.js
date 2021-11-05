/* index 라우팅 API 모듈화 */

//=========== 15) "express" 모듈 참조 및 indexRouter 생성
//express 모듈 참조
const express = require("express");
//indexRouter 생성
const indexRouter = express.Router();

//=========== 16) LocationModel model 가져오기
//LocationModel model 가져오기
const { LocationModel } = require("../model/Location");

//=========== 17) 클라이언트 요청 라우팅 API 선언
/* GET("/") API */
indexRouter.get("/", (req, res, next) => {
    res.render("index"); //index.ejs 랜더링
  });
  /* GET("/upload") API */
  indexRouter.get("/upload", (req, res, next) => {
    res.render("upload"); //upload.ejs 랜더링
  });

/* POST("/location") API
   - 클라이언트(upload.js)에서 post('/location') 요청 패스로 들어온 요청(req) 정보를 MongoDB에 저장 
   - upload.js의 onSubmit()함수에서 ajax() 요청
*/
indexRouter.post("/location", async (req, res, next) => {
  //요청 정보 추출
  const { title, address, lat, lng } = req.body;
  //필수 항목(title, address, lat, lng) validation
  if (!title || !address || !lat || !lng)
    return res
      .status(400)
      .send({ error: "title, address, lat, lng은 필수항목임." });
  //클라이언트(upload.js)에서 요청한 정보를 데이터베이스에 저장
  try {
    //location model 인스턴스 생성(document)
    let location = new LocationModel(req.body);
    //DB에 document 저장(locations 컬렉션에 저장)
    await location.save();
    console.log(location);
    //클라이언트에게 DB 저장 성공 message를 json 형태로 응답
    return res.json({ message: "success" });
  } catch (error) {
    console.log(error);
    //클라이언트에게 DB 저장 실패 message를 json 형태로 응답
    return res.status(500).json({ message: "error" });
  }
}); //end of post("/location")

/* GET("/location") API
  - 클라이언트(index.js)에서 get('/location') 요청 패스로 들어온 요청(req) 정보로 MongoDB 검색
  - MongoDB 등록된 모든 맛집의 위치정보(locations)를 검색하여
    message, data를 json 형태로 client(index.js) 응답(response)
   (index.js에서 message, data를 받아 지도 위에 마커 표시)
 */
   indexRouter.get("/location", async (req, res, next) => {
    try {
      //위치 정보 검색(전체)
      let locations = await LocationModel.find({}, { _id: 0, __v: 0 });
      console.log(locations);
      //검색한 위치 정보(data)를 성공 message와 함께 클라이언트(index.js)에 json 형태로 응답
      return res.json({
        message: "success",
        data: locations,
      });
    } catch (error) {
      //검색 실패 message를 클라이언트(index.js)에 json 형태로 응답
      return res.status(500).json({ message: "error" });
    }
  }); //end of get("/location")

//=========== 18) indexRouter 모듈 내보내기
module.exports = indexRouter;
