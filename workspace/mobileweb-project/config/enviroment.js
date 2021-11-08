//환경 설정 모듈

console.log("call : /config/environment.js");

module.exports = {
  PORT: 3000, //포트번호
  DATABASE: "mongodb://localhost:27017/marketDB", //Database 주소
  SERVICEKEY: "YOUR_SERVICE_KEY", //오픈 API에서 발급받은 server key 값
  MONGO_SESSION_COLLECTION_NAME: "sessions",
  SESSION_SECRET: "your_secret", //세션 암호화에 사용할 값
  API_URL: "",
  PAGINATION: {
    PAGE_SIZE: 10,
  },
};
