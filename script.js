const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const cX = canvas.width / 2;
const cY = canvas.height / 2;
const radius = 300;

let isDragging = false;
let startTick = null;
let endTick = null;
let colorId = 1;
const grid = Array(48).fill(0);
let backgroundCanvas;

// 고정된 배경 레이어 그리기
function drawBackground() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.beginPath();
  ctx.arc(cX, cY, radius, 0, Math.PI * 2);
  ctx.fillStyle = "#ffffff";
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.strokeStyle = "#000000";
  ctx.stroke();
  ctx.closePath();

  for (let i = 0; i < 48; i++) {
    const angle = (i / 48) * 2 * Math.PI - Math.PI / 2;
    const length = i % 2 === 0 ? 20 : 10;

    const x1 = cX + (radius - length) * Math.cos(angle);
    const y1 = cY + (radius - length) * Math.sin(angle);
    const x2 = cX + radius * Math.cos(angle);
    const y2 = cY + radius * Math.sin(angle);

    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineWidth = 2;
    ctx.strokeStyle = "black";
    ctx.stroke();
    ctx.closePath();

    if (i % 2 === 0) {
      const num = i / 2 === 0 ? 24 : i / 2;
      const tX = cX + (radius + 20) * Math.cos(angle);
      const tY = cY + (radius + 20) * Math.sin(angle);

      ctx.font = "23px Arial";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = "black";
      ctx.fillText(num.toString(), tX, tY);
    }
  }

  backgroundCanvas = ctx.getImageData(0, 0, canvas.width, canvas.height);
}

// 색칠된 구간만 그리기
function drawSections() {
  ctx.putImageData(backgroundCanvas, 0, 0);

  for (let i = 0; i < grid.length; i++) {
    if (grid[i] !== 0) {
      fillSection(i, i + 1, grid[i]);
    }
  }
}

// 특정 구간 색칠 함수
function fillSection(start, end, colorId) {
  const startAngle = (start / 48) * 2 * Math.PI - Math.PI / 2;
  const endAngle = (end / 48) * 2 * Math.PI - Math.PI / 2;

  ctx.beginPath();
  ctx.moveTo(cX, cY);
  ctx.arc(cX, cY, radius, startAngle, endAngle);
  ctx.closePath();
  ctx.fillStyle = `rgba(100, ${100 + colorId * 20}, 237, 0.5)`;
  ctx.fill();
}

// 각도에서 눈금 계산
function getTickFromAngle(x, y) {
  const dx = x - cX;
  const dy = y - cY;
  let angle = Math.atan2(dy, dx) + Math.PI / 2;
  if (angle < 0) angle += 2 * Math.PI;
  return Math.round((angle / (2 * Math.PI)) * 48) % 48;
}

// 마우스 이벤트 처리
canvas.addEventListener("mousedown", (e) => {
  if (e.button === 2) return;
  const rect = canvas.getBoundingClientRect();
  const mouseX = e.clientX - rect.left;
  const mouseY = e.clientY - rect.top;

  startTick = getTickFromAngle(mouseX, mouseY);
  isDragging = true;
});

canvas.addEventListener("mousemove", (e) => {
  if (!isDragging) return;

  const rect = canvas.getBoundingClientRect();
  const mouseX = e.clientX - rect.left;
  const mouseY = e.clientY - rect.top;

  endTick = getTickFromAngle(mouseX, mouseY);

  drawSections(); // 기존 구간 다시 그리기

  if (startTick !== null && endTick !== null) {
    if (startTick === endTick) {
      // 360도 드래그 미리보기
      fillSection(0, 48, colorId);
    } else if (startTick > endTick) {
      // 반시계 방향 드래그 미리보기
      fillSection(startTick, 48, colorId); // 첫 번째 구간
      fillSection(0, endTick, colorId); // 두 번째 구간
    } else {
      // 일반적인 경우 (시계 방향)
      fillSection(startTick, endTick, colorId);
    }
  }
});

canvas.addEventListener("mouseup", () => {
  if (!isDragging) return;

  isDragging = false;

  if (startTick !== null && endTick !== null) {
    if (startTick === endTick) {
      // 360도 드래그 처리
      const canFill = grid.every((tick) => tick === 0);
      if (canFill) {
        grid.fill(colorId); // 원 전체 색칠
        colorId++;
      } else {
        alert("구간이 겹칩니다!");
      }
    } else if (startTick > endTick) {
      // 반시계 방향 드래그
      const canFillFirstPart = grid
        .slice(startTick, 48)
        .every((tick) => tick === 0);
      const canFillSecondPart = grid
        .slice(0, endTick)
        .every((tick) => tick === 0);

      if (canFillFirstPart && canFillSecondPart) {
        grid.fill(colorId, startTick, 48); // 첫 번째 구간
        grid.fill(colorId, 0, endTick); // 두 번째 구간
        colorId++;
      } else {
        alert("구간이 겹칩니다!");
      }
    } else {
      // 일반적인 경우 (시계 방향)
      const canFill = grid
        .slice(startTick, endTick)
        .every((tick) => tick === 0);
      if (canFill) {
        grid.fill(colorId, startTick, endTick); // 구간 색칠
        colorId++;
      } else {
        alert("구간이 겹칩니다!");
      }
    }
  }

  drawSections(); // 기존 구간 다시 그리기
  startTick = null;
  endTick = null;
});

// 우클릭으로 구간 삭제
canvas.addEventListener("contextmenu", (e) => {
  e.preventDefault();

  const rect = canvas.getBoundingClientRect();
  const mouseX = e.clientX - rect.left;
  const mouseY = e.clientY - rect.top;

  const tick = getTickFromAngle(mouseX, mouseY);
  const colorToDelete = grid[tick];

  if (colorToDelete !== 0) {
    grid.forEach((value, index) => {
      if (value === colorToDelete) grid[index] = 0;
    });
    drawSections();
  }
});

// 초기 배경 및 시계 그리기
drawBackground();
drawSections();
