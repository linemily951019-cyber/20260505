let capture;

function setup() {
  // 第一步：產生一個全螢幕的畫布
  createCanvas(windowWidth, windowHeight);
  
  // 取得攝影機影像
  capture = createCapture(VIDEO);
  // 隱藏 p5.js 預設產生的 HTML 影片元素，讓我們只在畫布中繪製
  capture.hide();
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