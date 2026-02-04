// --- 1. 変数の宣言（ここが抜けていたため動きませんでした） ---
let isDragging = false;
let startX = 0;
let startY = 0;
let dragX = 0;
let dragY = 0;
let startTime = 0;
const MIN_DISTANCE = 30;

const frontCard = document.getElementById("card");
// HTMLに新しく追加した id="backCard" を取得
const backCard = document.getElementById("backCard");

// --- 2. タッチ開始（座標の初期位置を記録） ---
document.addEventListener("touchstart", (e) => {
  isDragging = true;
  startX = e.touches[0].clientX;
  startY = e.touches[0].clientY;
  startTime = Date.now();
  
  // アニメーションを一時停止して指に密着させる
  frontCard.style.transition = "none";
  if (backCard) backCard.style.transition = "none";
});

// --- 3. タッチ中（カードを動かす） ---
document.addEventListener("touchmove", (e) => {
  if (!isDragging) return;

  const touch = e.touches[0];
  dragX = touch.clientX - startX;
  dragY = touch.clientY - startY;

  // スワイプ量を0〜1に正規化
  const progress = Math.min(Math.max(Math.abs(dragX) + Math.abs(dragY), 0), 150) / 150;

  // 前面カードの変形
  const frontScale = 1 - progress * 0.05;
  if (Math.abs(dragX) > Math.abs(dragY)) {
    const rotate = dragX * 0.05;
    frontCard.style.transform = `translate(calc(-50% + ${dragX}px), -50%) rotate(${rotate}deg) scale(${frontScale})`;
  } else {
    frontCard.style.transform = `translate(-50%, calc(-50% + ${dragY}px)) scale(${frontScale})`;
  }

  // 背面カードの変形（逆方向から出現）
  if (backCard) {
    const scale = 0.95 + progress * 0.05;
    const opacity = 0.5 + progress * 0.5;
    
    let moveX = (dragX > 0 ? -40 : 40) * (1 - progress);
    let moveY = (dragY > 0 ? -40 : 40) * (1 - progress);

    if (Math.abs(dragX) > Math.abs(dragY)) {
      backCard.style.transform = `translate(calc(-50% + ${moveX}px), -50%) scale(${scale})`;
    } else {
      backCard.style.transform = `translate(-50%, calc(-50% + ${moveY}px)) scale(${scale})`;
    }
    backCard.style.opacity = opacity;
  }
});

// --- 4. タッチ終了（判定とリセット） ---
document.addEventListener("touchend", (e) => {
  if (!isDragging) return;
  isDragging = false;

  frontCard.style.transition = "transform 0.35s cubic-bezier(.22,1.2,.36,1)";
  if (backCard) backCard.style.transition = "all 0.35s cubic-bezier(.22,1.2,.36,1)";

  const dx = dragX;
  const dy = dragY;
  const time = Date.now() - startTime;

  // スワイプ距離が短い場合は元に戻す
  if (Math.abs(dx) < MIN_DISTANCE && Math.abs(dy) < MIN_DISTANCE) {
    resetCards();
    return;
  }

  // ここで本来の「カードを飛ばす」関数を呼ぶ
  // ※animateCard や nextCard 関数が定義されている必要があります
  if (Math.abs(dx) > Math.abs(dy)) {
    if (dx < 0) {
       console.log("左スワイプ：次のカードへ");
       // animateCard(-120, 0, () => nextCard(1)); // 実装済みならコメント解除
    } else {
       console.log("右スワイプ：前のカードへ");
       // animateCard(120, 0, () => prevCard(1)); // 実装済みならコメント解除
    }
  }

  // いったんリセット（次のカードを表示する処理ができるまで）
  resetCards();
});

function resetCards() {
  frontCard.style.transform = "translate(-50%, -50%) rotate(0deg) scale(1)";
  if (backCard) {
    backCard.style.transform = "translate(calc(-50% + 8px), -50%) scale(0.95)";
    backCard.style.opacity = "0.5";
  }
}
