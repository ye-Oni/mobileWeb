/* 과일 코드로 과일명을 찾아 반환하는 모듈 
   - marketData.json
*/
console.log("call : /helper/utility.js");

const marketList = require("../config/marketData.json");

/* 코드명을 넣어 과일 이름을 반환하는 함수 내보내기*/
module.exports.getNameByCode = (code) =>
  marketList.filter((data) => data.mcode == code)[0].name;

// module.exports.getNameByCode = (code) => {
//   return marketList.filter((data) => {
//     return data.mcode == code;
//   })[0].name;
// };
