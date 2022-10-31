//예약 데이터 만큼 카드 생성 후 append
function makeCard() {
  //예약정보 가져오는 서비스
  fetch("https://frontend.tabling.co.kr/v1/store/9533/reservations")
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      data.reservations.forEach((ele) => {
        if (ele.status !== "done") {
          let time_state_div = document.createElement("div");
          time_state_div.setAttribute("class", "time_state_div");

          let reserve_div = document.createElement("div");
          reserve_div.setAttribute("class", "reserve_div");

          let status_btn = document.createElement("button");
          status_btn.setAttribute("class", "status_btn");

          status_btn.addEventListener("click", function handleClick(e) {
            if (e.target.innerText === "착석") {
              e.target.textContent = "퇴석";
            } else if ((e.target.innerText = "퇴석")) {
              let removeTarget = e.target.parentNode;
              removeTarget.parentNode.removeChild(removeTarget);
            }
          });

          let card_div = document.createElement("div");
          card_div.dataset.status =
            ele.status === "reserved" ? "예약" : "착석 중";
          card_div.dataset.timeReserved =
            ele.timeReserved.split(" ")[1].split(":")[0] +
            " : " +
            ele.timeReserved.split(" ")[1].split(":")[1];
          card_div.dataset.timeRegistered =
            ele.timeRegistered.split(" ")[1].split(":")[0] +
            " : " +
            ele.timeRegistered.split(" ")[1].split(":")[1];
          card_div.dataset.name = ele.customer.name;
          card_div.dataset.level = ele.customer.level;
          card_div.dataset.memo = ele.customer.memo;
          card_div.dataset.request = ele.customer.request;

          card_div.addEventListener("click", function handleClick(e) {
            //창크기에 따른 이벤트 처리
            if (window.innerWidth < 1024) {
              //모바일용 팝업
              openPop();
              setDataForMobile(e.currentTarget.dataset);
            }
            setDataForDesktop(e.currentTarget.dataset);
          });
          card_div.appendChild(time_state_div);
          card_div.appendChild(reserve_div);
          card_div.appendChild(status_btn);
          card_div.className = "listCard";
          //데이터 입력
          let time =
            ele.timeRegistered.split(" ")[1].split(":")[0] +
            " : " +
            ele.timeRegistered.split(" ")[1].split(":")[1];
          let status =
            ele.status === "reserved"
              ? "<span style='color: #3BB94C'>예약</span>"
              : "<span style='color: #162149'>착석 중</span>";
          ele.status === "reserved"
            ? (status_btn.textContent = "착석")
            : (status_btn.textContent = "퇴석");
          let menus = "";
          let tables = "";
          ele.tables.forEach((table) => {
            tables =
              tables === "" ? tables + table.name : tables + ", " + table.name;
          });
          ele.menus.forEach((ele) => {
            menus =
              menus === ""
                ? menus + `${ele.name}(${ele.qty}) `
                : menus + `, ${ele.name}(${ele.qty})`;
          });
          time_state_div.innerHTML += time + `<br>` + status;
          reserve_div.innerHTML +=
            ele.customer.name +
            " - " +
            tables +
            `<br>` +
            "성인 " +
            ele.customer.adult +
            " 아이 " +
            ele.customer.child +
            `<br>` +
            menus;

          document.getElementById("listDiv").appendChild(card_div);
          if (document.getElementById("status").innerText === "") {
            //초기렌더
            let dataset =
              document.getElementsByClassName("listCard")[0].dataset;
            setDataForDesktop(dataset);
          }
        }
      });
    })
    .catch((err) => {
      console.log(err.message);
    });
}

makeCard();
function setDataForDesktop(dataset) {
  document.getElementById("status").innerHTML = dataset.status;
  document.getElementById("timeReserved").innerHTML = dataset.timeReserved;
  document.getElementById("timeRegistered").innerHTML = dataset.timeRegistered;
  document.getElementById("name").innerHTML = dataset.name;
  document.getElementById("level").innerHTML = dataset.level;
  document.getElementById("memo").innerHTML = dataset.memo;
  document.getElementById("request").innerHTML = dataset.request;
}
function setDataForMobile(dataset) {
  document.getElementById("mob_status").innerHTML = dataset.status;
  document.getElementById("mob_timeReserved").innerHTML = dataset.timeReserved;
  document.getElementById("mob_timeRegistered").innerHTML =
    dataset.timeRegistered;
  document.getElementById("mob_name").innerHTML = dataset.name;
  document.getElementById("mob_level").innerHTML = dataset.level;
  document.getElementById("mob_memo").innerHTML = dataset.memo;
  document.getElementById("mob_request").innerHTML = dataset.request;
}
function openPop() {
  document.getElementById("popup_layer").style.display = "block";
}
function closePop() {
  document.getElementById("popup_layer").style.display = "none";
}
// 팝업 외 영역 클릭시 팝업 닫힘
let popup = document.getElementById("popup_layer");
popup.addEventListener("click", function (e) {
  if (document.getElementById("popup_layer").style.display === "block") {
    if (e.target.id === "popup_layer") {
      //e.target이 슬라이딩 이미지 재생 버튼이 아니면
      document.getElementById("popup_layer").style.display = "none";
    }
  }
});
