let capture;
let facemesh;
let predictions = [];
// 嘴唇周圍的特徵點編號陣列
const targetIndices = [409, 270, 269, 267, 0, 37, 39, 40, 185, 61, 146, 91, 181, 84, 17, 314, 405, 321, 375, 291];

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
    
    stroke(255, 0, 0); // 設定線條為紅色
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
  }
  pop();

  // 第四步：在擷取影像畫面的上方顯示文字
  fill('#006400');           // 設定文字顏色為深綠色
  textAlign(CENTER, CENTER); // 設定文字水平與垂直皆置中對齊
  textSize(36);              // 設定文字大小 (可依需求微調)
  text("教科414730233", width / 2, height * 0.15); // 將文字畫在畫面水平中間，高度約在影像上方
}

// 當視窗大小改變時，自動調整畫布以維持全螢幕
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}