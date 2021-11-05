//마커의 인포윈도우 content에 들어갈 정보를 MongoDB Schema 선언
const { Schema, model } = require("mongoose");
//TODO: LocationSchema 객체 정의
const LocationSchema = new Schema(
  {
    title: { type: String, required: true },
    address: { type: String, required: true },
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  { timestamps: true }
);
//TODO: model 정의
const LocationModel = model("location", LocationSchema);
//TODO: model 모듈화
module.exports = {
  LocationModel,
};