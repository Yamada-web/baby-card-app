// --- 1. データの設定（テスト用） ---
const cardData = [
  { name: "いぬ", img: "dog.png" },
  { name: "ねこ", img: "cat.png" },
  { name: "ぞう", img: "elephant.png" },
  { name: "ぱんだ", img: "panda.png" }
];

let currentIndex = 0;

// --- 2. 変数の初期化 ---
let isDragging = false;
let startX = 0;
let startY = 0;
let dragX = 0;
let dragY = 0;
let startTime = 0;
const MIN_DISTANCE = 50;

const frontCard = document.getElementById("card");
const backCard = document.getElementById("backCard");

// 初期表示の更新
updateCardContent();

// --- 3. タッチイベント ---
document.addEventListener("touchstart", (e) => {
  isDragging = true;
  startX = e.touches[0].clientX;
  startY = e.touches[0].clientY;
  startTime = Date.now();
  
  frontCard.style.transition = "none";
  backCard.style.transition = "none";
});

document.addEventListener("touchmove", (e) => {
  if (!isDragging) return;

  const touch = e.touches[0];
  dragX = touch.clientX - startX;
  dragY = touch.clientY - startY;

  const progress = Math.min(Math.max(Math.abs(dragX) + Math.abs(dragY), 0), 150) / 150;

  // 前面カードの移動
  const frontScale = 1 - progress * 0.05;
  if (Math.abs(dragX) > Math.abs(dragY)) {
    const rotate = dragX * 0.1;
    frontCard.style.transform = `translate(calc(-50% + ${dragX}px), -50%) rotate(${rotate}deg) scale(${frontScale})`;
  } else {
    frontCard.style.transform = `translate(-50%, calc(-50% + ${dragY}px)) scale(${frontScale})`;
  }

  // 背面カード（次のカード）が徐々に中央へ
  const scale = 0.95 + progress * 0.05;
  const opacity = 0.5 + progress * 0.5;
  
  // スワイプ方向の逆から出す
  let moveX = (dragX > 0 ? -30 : 30) * (1 - progress);
  let moveY = (dragY > 0 ? -30 : 30) * (1 - progress);

  if (Math.abs(dragX) > Math.abs(dragY)) {
    backCard.style.transform = `translate(calc(-50% + ${moveX}px), -50%) scale(${scale})`;
  } else {
    backCard.style.transform = `translate(-50%, calc(-50% + ${moveY}px)) scale(${scale})`;
  }
  backCard.style.opacity = opacity;
});

document.addEventListener("touchend", () => {
  if (!isDragging) return;
  isDragging = false;

  // 一定距離以上スワイプしたら「切り替え」
  if (Math.abs(dragX) > 100 || Math.abs(dragY) > 100) {
    completeTransition();
  } else {
    resetCards();
  }
});

// --- 4. 補助関数 ---

// カードの内容（画像と名前）をセットする
function updateCardContent() {
  const nextIndex = (currentIndex + 1) % cardData.length;

  // 前面のカード
  document.getElementById("cardImage").src = cardData[currentIndex].img;
  document.getElementById("name").textContent = cardData[currentIndex].name;

  // 背面のカード（次に控えているカード）
  backCard.querySelector(".card-image").src = cardData[nextIndex].img;
  backCard.querySelector(".card-name").textContent = cardData[nextIndex].name;
}

// スワイプ成功時のアニメーション
function completeTransition() {
  frontCard.style.transition = "all 0.3s ease-out";
  // 画面外へ飛ばす
  frontCard.style.opacity = "0";
  frontCard.style.transform = `translate(calc(-50% + ${dragX * 2}px), calc(-50% + ${dragY * 2}px)) scale(0.5)`;

  backCard.style.transition = "all 0.3s ease-out";
  backCard.style.transform = "translate(-50%, -50%) scale(1)";
  backCard.style.opacity = "1";

  // アニメーション完了後にデータを入れ替えて位置をリセット
  setTimeout(() => {
    currentIndex = (currentIndex + 1) % cardData.length;
    updateCardContent();
    
    // transitionを消して一瞬で元の位置に戻す
    frontCard.style.transition = "none";
    backCard.style.transition = "none";
    resetCards();
    frontCard.style.opacity = "1";
  }, 300);
}

function resetCards() {
  frontCard.style.transform = "translate(-50%, -50%) rotate(0deg) scale(1)";
  backCard.style.transform = "translate(calc(-50% + 8px), -50%) scale(0.95)";
  backCard.style.opacity = "0.5";
}
