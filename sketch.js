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
  image(capture, width / 2, height / 2, width * 0.5, height * 0.5);
}

// 當視窗大小改變時，自動調整畫布以維持全螢幕
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}