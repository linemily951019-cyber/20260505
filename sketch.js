let capture;
let facemesh;
let predictions = [];
// 嘴唇周圍的特徵點編號陣列
const targetIndices = [409, 270, 269, 267, 0, 37, 39, 40, 185, 61, 146, 91, 181, 84, 17, 314, 405, 321, 375, 291];
// 嘴唇內側的特徵點編號陣列
const targetIndices2 = [76, 77, 90, 180, 85, 16, 315, 404, 320, 307, 306, 408, 304, 303, 302, 11, 72, 73, 74, 184];
// 右眼 (模型上的左眼，鏡像後顯示在畫面右邊) 的特徵點編號陣列
const eyeOuterIndices = [130, 247, 30, 29, 27, 28, 56, 190, 243, 112, 26, 22, 23, 24, 110, 25]; // 包含 247 的外圍
const eyeInnerIndices = [33, 246, 161, 160, 159, 158, 157, 173, 133, 155, 154, 153, 145, 144, 163, 7];  // 包含 246 的內圍
// 左眼 (模型上的右眼，鏡像後顯示在畫面左邊) 的特徵點編號陣列
const leftEyeOuterIndices = [359, 467, 260, 259, 257, 258, 286, 414, 463, 341, 256, 252, 253, 254, 339, 255];
const leftEyeInnerIndices = [263, 466, 388, 387, 386, 385, 384, 398, 362, 382, 381, 380, 374, 373, 390, 249];
// 臉部輪廓外圍的特徵點編號陣列
const faceOvalIndices = [10, 338, 297, 332, 284, 251, 389, 356, 454, 323, 361, 288, 397, 365, 379, 378, 400, 377, 152, 148, 176, 149, 150, 136, 172, 58, 132, 93, 234, 127, 162, 21, 54, 103, 67, 109];

function preload() {
  // 初始化 ml5.js v1 的 faceMesh 模型
  facemesh = ml5.faceMesh({ maxFaces: 1 });
}

function setup() {
  // 第一步：產生一個全螢幕的畫布
  createCanvas(windowWidth, windowHeight);
  
  // 取得攝影機影像
  capture = createCapture(VIDEO);
  // 隱藏 p5.js 預設產生的 HTML 影片元素，讓我們只在畫布中繪製
  capture.hide();

  // 開始辨識攝影機畫面
  facemesh.detectStart(capture, results => {
    predictions = results;
  });
}

function draw() {
  // 第二步：將畫布的背景顏色設定為奶綠色 (以 Hex 色碼表示)
  background('#D0F0C0');
  
  // 第三步：將影像對齊模式設定為中心，並顯示在正中間，寬高為畫布的 50%
  imageMode(CENTER);
  
  // 解決左右顛倒問題：使用 push/pop 與 translate/scale 來水平翻轉影像
  push();
  translate(width / 2, height / 2); // 將畫布原點移至畫面中心
  scale(-1, 1);                     // 水平翻轉 (X軸乘上 -1)
  image(capture, 0, 0, width * 0.5, height * 0.5); // 因為原點已在中心，座標改設為 0, 0

  // 第五步：利用 Facemesh 畫出指定的特徵點連線
  if (predictions.length > 0 && capture.width > 0) {
    let keypoints = predictions[0].keypoints;
    
    stroke(255, 255, 0); // 設定線條為黃色
    strokeWeight(1);   // 設定線條粗細為 1
    
    // 利用 line 指令將點位依序串接在一起
    for (let i = 0; i < targetIndices.length - 1; i++) {
      let p1 = keypoints[targetIndices[i]];
      let p2 = keypoints[targetIndices[i + 1]];
      
      let x1 = map(p1.x, 0, capture.width, -width * 0.25, width * 0.25);
      let y1 = map(p1.y, 0, capture.height, -height * 0.25, height * 0.25);
      let x2 = map(p2.x, 0, capture.width, -width * 0.25, width * 0.25);
      let y2 = map(p2.y, 0, capture.height, -height * 0.25, height * 0.25);
      line(x1, y1, x2, y2);
    }
    
    // 將最後一個點連回第一個點，形成一個封閉的嘴唇輪廓
    let pLast = keypoints[targetIndices[targetIndices.length - 1]];
    let pFirst = keypoints[targetIndices[0]];
    let xLast = map(pLast.x, 0, capture.width, -width * 0.25, width * 0.25);
    let yLast = map(pLast.y, 0, capture.height, -height * 0.25, height * 0.25);
    let xFirst = map(pFirst.x, 0, capture.width, -width * 0.25, width * 0.25);
    let yFirst = map(pFirst.y, 0, capture.height, -height * 0.25, height * 0.25);
    line(xLast, yLast, xFirst, yFirst);

    // 利用 line 指令將第二組點位 (嘴唇內側) 依序串接在一起
    for (let i = 0; i < targetIndices2.length - 1; i++) {
      let p1 = keypoints[targetIndices2[i]];
      let p2 = keypoints[targetIndices2[i + 1]];
      
      let x1 = map(p1.x, 0, capture.width, -width * 0.25, width * 0.25);
      let y1 = map(p1.y, 0, capture.height, -height * 0.25, height * 0.25);
      let x2 = map(p2.x, 0, capture.width, -width * 0.25, width * 0.25);
      let y2 = map(p2.y, 0, capture.height, -height * 0.25, height * 0.25);
      line(x1, y1, x2, y2);
    }
    
    // 將第二組最後一個點連回第一個點，形成一個封閉的輪廓
    let pLast2 = keypoints[targetIndices2[targetIndices2.length - 1]];
    let pFirst2 = keypoints[targetIndices2[0]];
    let xLast2 = map(pLast2.x, 0, capture.width, -width * 0.25, width * 0.25);
    let yLast2 = map(pLast2.y, 0, capture.height, -height * 0.25, height * 0.25);
    let xFirst2 = map(pFirst2.x, 0, capture.width, -width * 0.25, width * 0.25);
    let yFirst2 = map(pFirst2.y, 0, capture.height, -height * 0.25, height * 0.25);
    line(xLast2, yLast2, xFirst2, yFirst2);

    // 畫出包含 247 的眼睛外圍
    stroke(0, 255, 255); // 設定線條為青色，方便與嘴唇區分
    for (let i = 0; i < eyeOuterIndices.length - 1; i++) {
      let p1 = keypoints[eyeOuterIndices[i]];
      let p2 = keypoints[eyeOuterIndices[i + 1]];
      
      let x1 = map(p1.x, 0, capture.width, -width * 0.25, width * 0.25);
      let y1 = map(p1.y, 0, capture.height, -height * 0.25, height * 0.25);
      let x2 = map(p2.x, 0, capture.width, -width * 0.25, width * 0.25);
      let y2 = map(p2.y, 0, capture.height, -height * 0.25, height * 0.25);
      line(x1, y1, x2, y2);
    }
    // 將外圍最後一個點連回第一個點，形成一個封閉的輪廓
    let pLastOuter = keypoints[eyeOuterIndices[eyeOuterIndices.length - 1]];
    let pFirstOuter = keypoints[eyeOuterIndices[0]];
    let xLastOuter = map(pLastOuter.x, 0, capture.width, -width * 0.25, width * 0.25);
    let yLastOuter = map(pLastOuter.y, 0, capture.height, -height * 0.25, height * 0.25);
    let xFirstOuter = map(pFirstOuter.x, 0, capture.width, -width * 0.25, width * 0.25);
    let yFirstOuter = map(pFirstOuter.y, 0, capture.height, -height * 0.25, height * 0.25);
    line(xLastOuter, yLastOuter, xFirstOuter, yFirstOuter);

    // 畫出包含 246 的眼睛內圍
    for (let i = 0; i < eyeInnerIndices.length - 1; i++) {
      let p1 = keypoints[eyeInnerIndices[i]];
      let p2 = keypoints[eyeInnerIndices[i + 1]];
      
      let x1 = map(p1.x, 0, capture.width, -width * 0.25, width * 0.25);
      let y1 = map(p1.y, 0, capture.height, -height * 0.25, height * 0.25);
      let x2 = map(p2.x, 0, capture.width, -width * 0.25, width * 0.25);
      let y2 = map(p2.y, 0, capture.height, -height * 0.25, height * 0.25);
      line(x1, y1, x2, y2);
    }
    // 將內圍最後一個點連回第一個點，形成一個封閉的輪廓
    let pLastInner = keypoints[eyeInnerIndices[eyeInnerIndices.length - 1]];
    let pFirstInner = keypoints[eyeInnerIndices[0]];
    let xLastInner = map(pLastInner.x, 0, capture.width, -width * 0.25, width * 0.25);
    let yLastInner = map(pLastInner.y, 0, capture.height, -height * 0.25, height * 0.25);
    let xFirstInner = map(pFirstInner.x, 0, capture.width, -width * 0.25, width * 0.25);
    let yFirstInner = map(pFirstInner.y, 0, capture.height, -height * 0.25, height * 0.25);
    line(xLastInner, yLastInner, xFirstInner, yFirstInner);

    // 畫出畫面左邊的眼睛外圍
    for (let i = 0; i < leftEyeOuterIndices.length - 1; i++) {
      let p1 = keypoints[leftEyeOuterIndices[i]];
      let p2 = keypoints[leftEyeOuterIndices[i + 1]];
      
      let x1 = map(p1.x, 0, capture.width, -width * 0.25, width * 0.25);
      let y1 = map(p1.y, 0, capture.height, -height * 0.25, height * 0.25);
      let x2 = map(p2.x, 0, capture.width, -width * 0.25, width * 0.25);
      let y2 = map(p2.y, 0, capture.height, -height * 0.25, height * 0.25);
      line(x1, y1, x2, y2);
    }
    // 將外圍最後一個點連回第一個點
    let pLastLeftOuter = keypoints[leftEyeOuterIndices[leftEyeOuterIndices.length - 1]];
    let pFirstLeftOuter = keypoints[leftEyeOuterIndices[0]];
    let xLastLeftOuter = map(pLastLeftOuter.x, 0, capture.width, -width * 0.25, width * 0.25);
    let yLastLeftOuter = map(pLastLeftOuter.y, 0, capture.height, -height * 0.25, height * 0.25);
    let xFirstLeftOuter = map(pFirstLeftOuter.x, 0, capture.width, -width * 0.25, width * 0.25);
    let yFirstLeftOuter = map(pFirstLeftOuter.y, 0, capture.height, -height * 0.25, height * 0.25);
    line(xLastLeftOuter, yLastLeftOuter, xFirstLeftOuter, yFirstLeftOuter);

    // 畫出畫面左邊的眼睛內圍
    for (let i = 0; i < leftEyeInnerIndices.length - 1; i++) {
      let p1 = keypoints[leftEyeInnerIndices[i]];
      let p2 = keypoints[leftEyeInnerIndices[i + 1]];
      
      let x1 = map(p1.x, 0, capture.width, -width * 0.25, width * 0.25);
      let y1 = map(p1.y, 0, capture.height, -height * 0.25, height * 0.25);
      let x2 = map(p2.x, 0, capture.width, -width * 0.25, width * 0.25);
      let y2 = map(p2.y, 0, capture.height, -height * 0.25, height * 0.25);
      line(x1, y1, x2, y2);
    }
    // 將內圍最後一個點連回第一個點
    let pLastLeftInner = keypoints[leftEyeInnerIndices[leftEyeInnerIndices.length - 1]];
    let pFirstLeftInner = keypoints[leftEyeInnerIndices[0]];
    let xLastLeftInner = map(pLastLeftInner.x, 0, capture.width, -width * 0.25, width * 0.25);
    let yLastLeftInner = map(pLastLeftInner.y, 0, capture.height, -height * 0.25, height * 0.25);
    let xFirstLeftInner = map(pFirstLeftInner.x, 0, capture.width, -width * 0.25, width * 0.25);
    let yFirstLeftInner = map(pFirstLeftInner.y, 0, capture.height, -height * 0.25, height * 0.25);
    line(xLastLeftInner, yLastLeftInner, xFirstLeftInner, yFirstLeftInner);

    // 畫出臉部輪廓外圍
    stroke('#FFDF00'); // 設定線條為鵝黃色
    strokeWeight(2);   // 設定線條粗細為 2
    
    // 利用 line 指令將臉部輪廓點位依序串接在一起
    for (let i = 0; i < faceOvalIndices.length - 1; i++) {
      let p1 = keypoints[faceOvalIndices[i]];
      let p2 = keypoints[faceOvalIndices[i + 1]];
      
      let x1 = map(p1.x, 0, capture.width, -width * 0.25, width * 0.25);
      let y1 = map(p1.y, 0, capture.height, -height * 0.25, height * 0.25);
      let x2 = map(p2.x, 0, capture.width, -width * 0.25, width * 0.25);
      let y2 = map(p2.y, 0, capture.height, -height * 0.25, height * 0.25);
      line(x1, y1, x2, y2);
    }
    // 將臉部輪廓最後一個點連回第一個點，形成封閉的輪廓
    let pLastOval = keypoints[faceOvalIndices[faceOvalIndices.length - 1]];
    let pFirstOval = keypoints[faceOvalIndices[0]];
    let xLastOval = map(pLastOval.x, 0, capture.width, -width * 0.25, width * 0.25);
    let yLastOval = map(pLastOval.y, 0, capture.height, -height * 0.25, height * 0.25);
    let xFirstOval = map(pFirstOval.x, 0, capture.width, -width * 0.25, width * 0.25);
    let yFirstOval = map(pFirstOval.y, 0, capture.height, -height * 0.25, height * 0.25);
    line(xLastOval, yLastOval, xFirstOval, yFirstOval);
  }
  pop();

  // 第四步：在擷取影像畫面的上方顯示文字
  fill('#006400');           // 設定文字顏色為深綠色
  textAlign(CENTER, CENTER); // 設定文字水平與垂直皆置中對齊
  textSize(36);              // 設定文字大小 (可依需求微調)
  text("教科414730233林子靖", width / 2, height * 0.15); // 將文字畫在畫面水平中間，高度約在影像上方
}

// 當視窗大小改變時，自動調整畫布以維持全螢幕
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}