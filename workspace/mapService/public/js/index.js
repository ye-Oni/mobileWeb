//네이버 지도 서비스

//지도 option 설정
const mapOption = {
  center: new naver.maps.LatLng(37.56646527355311, 126.97783670182346), //지도의 초기 중심 좌표(서울시청)
  zoom: 10, //지도의 초기 줌 레벨
  minZoom: 7, //지도의 최소 줌 레벨
  zoomControl: true, //줌 컨트롤의 표시 여부
  zoomControlOptions: {
    //줌 컨트롤의 옵션
    position: naver.maps.Position.TOP_RIGHT,
  },
};

/* 네이버 지도 객체 생성
    - new naver.maps.Map("지도를 표시할 DOM 요소 id", mapOptions)*/
const map = new naver.maps.Map("map", mapOption);


// 1) 지도에 마커 표시
//======== 1) 지도에 마커 표시
//locationDatas 데이터 형식
// const locationDatas = [
//   {
//     title: "서울시청",
//     address: "서울 중구",
//     lat: 37.56646527355311,
//     lng: 126.97783670182346,
//   },
//   {
//     title: "서울역",
//     address: "서울 중구",
//     lat: 37.55604152003483,
//     lng: 126.97230381605866,
//   },
// ]; //end of locationDatas

//======== 23) DB에 저장된 맛집 정보(locationDatas)를 가져와서 지도에 마커 표시
/* DB에 저장된 맛집 정보(locationDatas)를 가져와서 지도에 마커 표시 
   - ajax()로 서버(indexRoute.js)에 요청하여, 
     DB에 등록된 모든 맛집 정보(response.data)를 받아 지도에 마커 표시 
*/
$.ajax({
  url: "/location",
  type: "GET",
  }).done((response) => {
      //DB 검색에 실패 한 경우(response.message !== "success") 처리
      if (response.message !== "success") {
        console.log(response.message);
        return;
      }
      //서버(indexRoute.js)에 응답받은 위치 정보(response.data)
      const locationDatas = response.data;

      /* 마커, 인포윈도우 배열 선언
    - 몇 번째 마커를 클릭했을 때, 
      몇 번째 인포윈도우를 띄워주고, 닫아야 하는 지 알아야 하기 때문 */
      let markerList = [];
      let infowindowList = [];

// 위치정보(locationDatas)를 사용하여 마커 표시
for (let i in locationDatas) {
    //위치정보(locationDatas)에서 [i]값에 해당하는 위치정보를 target변수에 할당
    const target = locationDatas[i];

    //LatLng 클래스를 이용하여 위/경도 좌표 정의
    const latlng = new naver.maps.LatLng(target.lat, target.lng);

     //마커 생성
    let marker = new naver.maps.Marker({
      map: map, //지도객체
      position: latlng, //위치
      //마커 아이콘 설정
      icon: {
        content: `<img src="../images/maps_maker.png" class="marker"></img>`,
        anchor: new naver.maps.Point(20, 20), //중심좌표 설정(마커 크기의 1/2로 설정)
      },
    });

// 2) 마커를 클릭했을 때 정보를 보여줄 인포 윈도우 표시
  //마커의 인포윈도우 contents 선언(style.css에서 스타일 지정)
  const content = `
    <div class="infowindow_wrap">
      <div class="infowindow_title">${target.title}</div>
      <div class="infowindow_address">${target.address}</div>
    </div>
  `;

   //마커의 인포윈도우 생성
   const infowindow = new naver.maps.InfoWindow({
    content: content,
    backgroundColor: "#00ff0000",
    borderColor: "#00ff0000",
    anchorSize: new naver.maps.Size(0, 0), //말풍선 꼬리 표시 제거
  });

    //마커와 인포윈도우 배열에 marker와 infowindow에 push
    markerList.push(marker);
    infowindowList.push(infowindow);
}//end of for(locationDatas)

//======== 3) 마커를 클릭했을 때  인포윈도우 표시/제거 이벤트 처리
//마커를 클릭했을 인포윈도우를 표시 또는 제거하는 이벤트 핸들러
const infowindowDisplayToggleHandler = (i) => () => {
  // function infowindowDisplayToggleHandler(i) {
  //   return function() { ... }//리턴값으로 함수 반환
  // }
  // 마커와 인포윈도우를 가져옴
  const marker = markerList[i];
  const infowindow = infowindowList[i];
  //만약 인포윈도우가 지도 위에 표시되어 있으면
  if (infowindow.getMap()) {
    infowindow.close();
  } else {
    //인포윈도우가 지도 위에 없으면 표시
    infowindow.open(map, marker);
  }
}; //end of infowindowDisplayToggleHandler

//지도를 클릭했을 때 인포윈도우 닫는 이벤트 핸들러
const infowindowRemoveHandler = (i) => () => {
  const infowindow = infowindowList[i];
  infowindow.close();
}; //end of infowindowRemoveHandler

//마커와 맵을 클릭시 이벤트 처리(인포윈도우를 표시/제거)
for (let i = 0; i < markerList.length; i++) {
  /* 마커 클릭시 인포윈도우를 표시/제거(toggle)하는 이벤트 처리
     - 마커 클릭시 인포윈도우를 표시/제거(toggle)하는 infowindowDisplayToggleHandler(i) 호출
  */
  naver.maps.Event.addListener(
    markerList[i],
    "click",
    infowindowDisplayToggleHandler(i)
  );
  /* 지도 클릭시 인포윈도우를 제거하는 이벤트 처리
    - 지도 클릭시 인포윈도우를 제거하는 infowindowRemoveHandler(i) 호출 */
  naver.maps.Event.addListener(map, "click", infowindowRemoveHandler(i));
} //end of for(markerList.length)

 /* Maker Clustering 기능 추가
     - Maker Clustering: 마커 클러스터링이란?
       => 마커가 여러 개 뭉쳐있을 때, 이것을 하나의 클러스터로 묶어 관리하는 
          기능으로 마커를 한 눈에 확인할 수 있고, 지도 위에 마커를 표시할 때
          좀 더 최적화할 수 있는 기능
  */
  /* 마커 클러스터링을 위한 cluster 선언
     - 마커의 수에따라 cluster를 구분하여 적용하기 위해 3개 선언
  */
  // //10개미만
  // const cluster1 = {
  //   content: `<div class="cluster1"></div>`,
  // };
  // //10-19개
  // const cluster2 = {
  //   content: `<div class="cluster2"></div>`,
  // };
  // //20개이상
  // const cluster3 = {
  //   content: `<div class="cluster3"></div>`,
  // };

  const cluster1 = {
    content:
      '<div style="cursor:pointer;width:40px;height:40px;line-height:42px;font-size:10px;color:white;text-align:center;font-weight:bold;background:url(../images/cluster-marker-1.png);background-size:contain;"></div>',
    size: N.Size(40, 40),
    anchor: N.Point(20, 20),
  },
  cluster2 = {
    content:
      '<div class="cluster2" style="cursor:pointer;width:40px;height:40px;line-height:42px;font-size:10px;color:white;text-align:center;font-weight:bold;background:url(../images/cluster-marker-2.png);background-size:contain;"></div>',
    size: N.Size(40, 40),
    anchor: N.Point(20, 20),
  },
  cluster3 = {
    content:
      '<div  class="cluster3" style="cursor:pointer;width:40px;height:40px;line-height:42px;font-size:10px;color:white;text-align:center;font-weight:bold;background:url(../images/cluster-marker-3.png);background-size:contain;"></div>',
    size: N.Size(40, 40),
    anchor: N.Point(20, 20)
    };
      //마커 클러스터링 정의
    const markerClustering = new MarkerClustering({
      minClusterSize: 2, //// 클러스터 마커를 표시할 최소 마커 개수
      maxZoom: 13, // 최대 지도 확대 레벨
      map: map, // 클러스터 마커 표시할 지도
      markers: markerList, // 클러스터 마커에서 사용할 마커 목록
      disableClickZoom: false, //클러스터를 클릭했을 때 줌 동작 여부
      gridSize: 100, //지도에서 클러스터의 영역을 결정(평균값:100, 작으면 세분화된 클러스터를 만들 수 있음)
      icons: [cluster1, cluster2, cluster3],
      /* 숫자에 맞게 클러스터 생성 
       - 2-9개: cluster1 생성
       - 10-19개: cluster2 생성
       - 20개이상: cluster3 생성
    */
      indexGernerator: [2, 10, 20],
      //클러스터 안에 몇개의 마커가 있는지 시각적으로 확인하는 기능
      stylingFunction: (clusterMarker, count) => {
        $(clusterMarker.getElement()).find("div:first-child").text(count);
      },
    }); //end of markerClustering
  });//end of ajax-done()


