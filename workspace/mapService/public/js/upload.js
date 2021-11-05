/* 카카오 지도 서비스 */

//카카오 지도를 표시할 DOM 요소 id 가져오기
const mapContainer = document.getElementById("map");

//지도 option 설정
const mapOption = {
  center: new daum.maps.LatLng(37.56646527355311, 126.97783670182346), //맵의 중심을 서울시청으로
  level: 3, //지도의 초기 줌 레벨
};

//카카오 지도 생성
let map = new daum.maps.Map(mapContainer, mapOption);

//=========== 5) 마커의 인포윈도우 생성
//인포윈도우 생성
let infowindow = new daum.maps.InfoWindow({
  zIndex: 1, //인포위도우가 지도보다 위에 띄워질 수 있도록 설정
});

//=========== 6) 마커 List 배열 선언
//마커 List 배열 선언
let markerList = [];

//=========== 7) 키워드(장소) 검색 객체 생성
//daum.maps.services.Places() 함수로 키워드(장소) 검색 객체 생성
let ps = new daum.maps.services.Places();

//검색 키워드로 장소를 검색하는 searchPlaces()함수 선언
function searchPlaces() {
  //upload.ejs 키워드 검색창(#keyword)에서 검색 키워드(value)를 가져옴
  let keyword = $("#keyword").val();
  /* 검색 키워드로 장소 검색
     -  ps.keywordSearch(검색키워드, 콜백함수): 검색 키워드로 장소 검색하는 함수
     - 콜백함수(placesSearchCB): 검색 완료시 지도 UI를 갱신하는 콜백 */
  ps.keywordSearch(keyword, placesSearchCB);
} //end of searchPlaces()

//검색 완료시 호출되어 지도 UI를 갱신하는 콜백함수(data:검색결과, status:상태, pagination: 페이지네이션) 함수
function placesSearchCB(data, status, pagination) {
  if (status === daum.maps.services.Status.OK) {
    console.log(data);
    //검색 data로 웹페이지(UI)를 갱신하는 displayPlaces(data)함수 호출
    displayPlaces(data);
    //페이지 번호 표시하는 displayPagination(pagination)함수 호출
    displayPagination(pagination);
  } else if (status === daum.maps.services.Status.ZERO_RESULT) {
    alert("검색 결과가 존재하지 않습니다.");
    return;
  } else if (status === daum.maps.services.Status.ERROR) {
    alert("검색 중 오류가 발생했습니다.");
    return;
  }
} //end of placesSearchCB()

//=========== 9) 검색 data로 UI를 갱신하는 displayPlaces(data) 함수 선언
/* 검색 data로 UI를 갱신하는 displayPlaces(data) 함수 선언
   - 지도 위에 검색 결과를 표시(갱신)
   - 지도 위에 마커, 인포윈도우 표시(갱신)
   - 지도 위에 페이지네이션 표시(갱신)
   - 검색 결과(장소)의 좌표를 기준으로 지도 범위 재설정
*/
function displayPlaces(data) {
    //결과를 출력할 DOM 요소(placesList) 참조 - upload.ejs
    let listPlaces = document.getElementById("placesList");

      /* 지도를 재설정 할 범위정보를 가지고 있는 LatLngBounds 객체 생성
    - 검색된 장소 위치를 기준으로 지도범위를 재설정할 때 사용하는 객체
  */
  let bounds = new daum.maps.LatLngBounds();

  //검색 결과를 갱신하는 함수
  removeAllChildNodes(listPlaces);
  //마커를 갱신(기존 마커 삭제)하는 함수
  removeMarker();

    //검색한 결과에서 장소, 주소, 위/경도 추출, 마커 설정(for문)
    for (let i = 0; i < data.length; i++) {
      let place_name = data[i]["place_name"];
      let address_name = data[i]["address_name"];
      let lat = data[i].y;
      let lng = data[i].x;

      //마커의 좌표설정
      const placePosition = new daum.maps.LatLng(lat, lng);
      /* 검색된 장소 위치를 기준으로 지도범위를 재설정하기 위해
        LatLngBounds 객체에 좌표를 추가    
      */
      bounds.extend(placePosition);

      //마커 생성
      let marker = new daum.maps.Marker({
        position: placePosition,
      });

      //마커를 지도위에 표시
      marker.setMap(map);
      markerList.push(marker); //마커를 markerList 배열에 저장

      //검색 결과를 화면에 출력하기 위한 DOM 요소(div) 생성
      const divEl = document.createElement("div");
      const itemStr = `
      <div class="info">
        <div class="info_title">${place_name}</div>
        <span>${address_name}</span>
      </div>
    `;

      //검색 결과를 표시할 DOM 요소(div)에 UI 코드 추가
      divEl.innerHTML = itemStr;
      divEl.className = "item"; //검색 결과를 표시할 DOM 요소(div)에 item class 추가
      
      //마커를 클릭했을 때 인포윈도우 표시
      daum.maps.event.addListener(marker, "click", () => {
        console.log("마커 클릭");
        displayInfowindow(marker, place_name, address_name, lat, lng);
      });

      //맵을 클릭했을 때 인포윈도우 close
      daum.maps.event.addListener(map, "click", () => {
        console.log("map click");
        infowindow.close();
      });
      //검색결과 클릭했을 때 인포윈도우 표시
      divEl.onclick = () => {
        displayInfowindow(marker, place_name, address_name, lat, lng);
      };

    //결과를 출력할 element에 화면 UI append
    listPlaces.appendChild(divEl);
   }

  //LatLngBounds 객체에 추가된 좌표들을 기준으로 지도의 범위를 재설정
  map.setBounds(bounds);

} //end of displayPlaces()

//=========== 10) 검색 결과를 갱신하는 함수 선언
//검색 결과를 갱신하는 함수(removeAllChildNodes(el), 기존에 있던 모든 노드 삭제)
function removeAllChildNodes(el) {
  while (el.hasChildNodes()) {
    //모든 노드가 삭제될 때까지 반복
    //el 노드에게 자식노드가 있으면
    el.removeChild(el.lastChild); //모든 노드를 삭제(마지막 태그를 삭제함으로써 모두 삭제)
  }
} //end of removeAllChildNodes(el)

//=========== 11) 마커를 갱신(기존 마커 삭제)하는 함수(removeMarker()) 선언
//마커를 갱신(기존 마커 삭제)하는 함수
function removeMarker() {
  for (let i = 0; i < markerList.length; i++) {
    markerList[i].setMap(null); //기존에 있던 마커들을 지도에서 제거
  }
  markerList = []; //markerList 초기화
} //end of removeMarker()

//=========== 12) pagination을 표시하는 displayPagination(pagination)함수 선언
//pagination을 표시하는 displayPagination(pagination)함수 선언
function displayPagination(pagination) {
  let paginationEl = document.getElementById("pagination");
  let fragment = document.createDocumentFragment();
  let i;
  //기존에 추가된 페이지 번호 삭제
  while (paginationEl.hasChildNodes()) {
    paginationEl.removeChild(paginationEl.lastChild);
  }
  for (i = 1; i <= pagination.last; i++) {
    let el = document.createElement("a");
    el.href = "#";
    el.innerHTML = i;
    if (i === pagination.current) {
      //현재 페이지이면
      el.className = "on";
    } else {
      el.onclick = (function (i) {
        //immediately-invoked function expression
        return function () {
          pagination.gotoPage(i); //i번째 페이지 검색
        };
      })(i); //iife 함수 호출(실행)
    }
    fragment.appendChild(el);
  } //end of  pagination.last
  paginationEl.appendChild(fragment);
} //end of displayPagination()

//=========== 13) 검색 결과 목록 또는 마커를 클릭했을 때 인포윈도우를 표시하는 함수 선언
/* 검색 결과 목록 또는 마커를 클릭했을 때 인포윈도우를 표시하는 함수 선언
   - 인포윈도우에 장소명을 표시
   - 인포윈도우의 "등록" 버튼 클릭시 장소명, 주소, 위/경도 값이 DB에 저장 
     (onSubmit('title', 'address', lat, lng) 함수 호출)
*/

function displayInfowindow(marker, title, address, lat, lng) {
  //인포윈도우 content
  let content = `
    <div style="border: 2px solid gold; width: 250px; padding:25px;">
      ${title}<br>
      ${address}<br><br>
      <button onClick="onSubmit('${title}', '${address}', ${lat}, ${lng})">등록</button>
    </div>
  `;
  //지도의 중심좌표를 마커의 포지션으로 부드럽게 이동
  map.panTo(marker.getPosition());
  infowindow.setContent(content); //인포윈도우에 content 추가
  infowindow.open(map, marker); //인포윈도우를 맵에 표시
} //end of displayInfowindow()

//=========== 14) 인포윈도우에서 "등록" 버튼 클릭시 data를 데이터베이스에 저장할 것을 서버(indexRouter,js)에 요청하는 함수
/* 인포윈도우에서 "등록" 버튼 클릭시 data를 데이터베이스에 저장할 것을 서버(indexRouter,js)에 요청하는 함수
   - 'indexRouter.post("/location", () => {}' API로 라우팅 */
   function onSubmit(title, address, lat, lng) {
    $.ajax({
      //서버에 전송 요청
      url: "/location",
      data: { title, address, lat, lng },
      type: "POST",
    }).then(
      (response) => {
        console.log("데이터 요청 성공");
        alert("요청 성공");
      },
      (error) => {
        console.log("데이터 요청 실패");
        alert("요청 실패");
      }
    );
    //인포윈도우 닫기
    infowindow.close();
  } //end of onSubmit()