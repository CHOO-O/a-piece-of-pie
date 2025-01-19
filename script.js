const canvas = document.getElementById("canvas"); // index.html의 캔버스 요소 가져옴
const ctx = canvas.getContext("2d");

const cX = canvas.width / 2; // X좌표 중앙값
const cY = canvas.height / 2; // Y좌표 중앙값
const radius = 350;

function clock() {
  // 메인 원 그리기
  ctx.beginPath();
  ctx.arc(cX, cY, radius, 0, Math.PI * 2);
  ctx.fillStyle = "#ffffff";
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.strokeStyle = "#000000";
  ctx.stroke();
  ctx.closePath();

  // 눈금선, 시간 텍스트 등 그리기
  for (let i = 0; i < 24; i++) {
    const angle = (i / 24) * 2 * Math.PI - Math.PI / 2; // 각도 계산
    // 위쪽부터 시작해야 하기 때문에 - Math.PI/2가 필요

    // 눈금선을 위한 좌표 계산
    const x1 = cX + (radius - 20) * Math.cos(angle); // 안쪽 좌표
    const y1 = cY + (radius - 20) * Math.sin(angle); // 안쪽 좌표
    const x2 = cX + radius * Math.cos(angle); // 바깥쪽 좌표
    const y2 = cY + radius * Math.sin(angle); // 바깥쪽 좌표

    // 선 그리기
    ctx.beginPath();
    ctx.moveTo(x1, y1); // 시작점(안쪽 좌표)
    ctx.lineTo(x2, y2); // 끝점(바깥쪽 좌표)
    ctx.lineWidth = 2;
    ctx.strokeStyle = "black";
    ctx.stroke();
    ctx.closePath();

    // 시간 텍스트
    const tX = cX + (radius + 30) * Math.cos(angle);
    const tY = cY + (radius + 30) * Math.sin(angle);
    ctx.font = "28px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "black";

    // 0은 24로 표기하기 위함
    const num = i === 0 ? 24 : i;

    // 텍스트 렌더링
    ctx.fillText(num.toString(), tX, tY);

    // 중간 점 임시 표기
    ctx.fillText("🥧", cX, cY);
  }
}

clock();
