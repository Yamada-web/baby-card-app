// --- 1. データの設定（2次元配列：カテゴリ × カード） ---
const categories = [
  {
    categoryName: "animals",
    cards: [
      { name: "ねこ", img: "images/animals/neko.jpg" },
      { name: "ねこ", img: "images/animals/neko2.jpg" },
      { name: "ねこ", img: "images/animals/neko3.jpg" },
      { name: "ねこ", img: "images/animals/neko4.jpg" },
      { name: "ねこ", img: "images/animals/neko5.jpg" },
      { name: "いぬ", img: "images/animals/inu.jpg" },
      { name: "ぺんぎん", img: "images/animals/pengin.jpg" },
      { name: "うさぎ", img: "images/animals/usagi.jpg" },
      { name: "ハムスター", img: "images/animals/hamu.jpg" }
    ]
  },
  {
    categoryName: "foods",
    cards: [
      { name: "りんご", img: "images/foods/ringo.jpg" },
      { name: "バナナ", img: "images/foods/banana.jpg" },
      { name: "いちご", img: "images/foods/itigo.jpg" },
      { name: "パン", img: "images/foods/pan.jpg" },
      { name: "おにぎり", img: "images/foods/onigiri.jpg" }
    ]
  }
];

let categoryIndex = 0;
let cardIndex = 0;

// --- 2. 変数の初期化 ---
let isDragging = false;
let startX = 0;
let startY = 0;
let dragX = 0;
let dragY = 0;

const frontCard = document.getElementById("card");
const backCard = document.getElementById("backCard");

// 初回の表示をセット
updateCardContent();

// --- 3. タッチイベント ---
document.addEventListener("touchstart", (e) => {
  isDragging = true;
  startX = e.touches[0].clientX;
  startY = e.touches[0].clientY;
  
  frontCard.style.transition = "none";
  backCard.style.transition = "none";
});

document.addEventListener("touchmove", (e) => {
  if (!isDragging) return;

  const touch = e.touches[0];
  dragX = touch.clientX - startX;
  dragY = touch.clientY - startY;

  // 動かし始めた瞬間に、次に表示するカード（背面）を確定させる
  updateBackCard();

  const progress = Math.min(Math.max(Math.abs(dragX) + Math.abs(dragY), 0), 150) / 150;

  // 前面カードの移動と回転
  const frontScale = 1 - progress * 0.05;
  if (Math.abs(dragX) > Math.abs(dragY)) {
    const rotate = dragX * 0.1;
    frontCard.style.transform = `translate(calc(-50% + ${dragX}px), -50%) rotate(${rotate}deg) scale(${frontScale})`;
  } else {
    frontCard.style.transform = `translate(-50%, calc(-50% + ${dragY}px)) scale(${frontScale})`;
  }

  // 背面カードが徐々に中央へ
  const scale = 0.95 + progress * 0.05;
  const opacity = 0.5 + progress * 0.5;
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

  const threshold = 100; // この距離以上スワイプしたら切り替え

  if (Math.abs(dragX) > threshold || Math.abs(dragY) > threshold) {
    // どちらの方向に大きく動いたかで、インデックスを更新
    if (Math.abs(dragX) > Math.abs(dragY)) {
      // 左右：カード切り替え
      if (dragX > 0) {
        cardIndex = (cardIndex - 1 + categories[categoryIndex].cards.length) % categories[categoryIndex].cards.length;
      } else {
        cardIndex = (cardIndex + 1) % categories[categoryIndex].cards.length;
      }
    } else {
      // 上下：カテゴリ切り替え
      if (dragY > 0) {
        categoryIndex = (categoryIndex - 1 + categories.length) % categories.length;
      } else {
        categoryIndex = (categoryIndex + 1) % categories.length;
      }
      cardIndex = 0; // カテゴリが変わったら1枚目に戻す
    }
    completeTransition();
  } else {
    resetCards();
  }
});

// --- 4. 補助関数 ---

// 前面カードの画像と名前をセット
function updateCardContent() {
  const currentData = categories[categoryIndex].cards[cardIndex];
  document.getElementById("cardImage").src = currentData.img;
  document.getElementById("name").textContent = currentData.name;
}

// 背面カード（次に控えているカード）をスワイプ方向に応じてセット
function updateBackCard() {
  let nextCat = categoryIndex;
  let nextCard = cardIndex;

  if (Math.abs(dragX) > Math.abs(dragY)) {
    // 左右スワイプ中
    nextCard = (dragX < 0) 
      ? (cardIndex + 1) % categories[categoryIndex].cards.length 
      : (cardIndex - 1 + categories[categoryIndex].cards.length) % categories[categoryIndex].cards.length;
  } else {
    // 上下スワイプ中
    nextCat = (dragY < 0) 
      ? (categoryIndex + 1) % categories.length 
      : (categoryIndex - 1 + categories.length) % categories.length;
    nextCard = 0;
  }

  const nextData = categories[nextCat].cards[nextCard];
  backCard.querySelector(".card-image").src = nextData.img;
  backCard.querySelector(".card-name").textContent = nextData.name;
}

function completeTransition() {
  frontCard.style.transition = "all 0.3s ease-out";
  frontCard.style.opacity = "0";
  frontCard.style.transform = `translate(calc(-50% + ${dragX * 2}px), calc(-50% + ${dragY * 2}px)) scale(0.5)`;

  backCard.style.transition = "all 0.3s ease-out";
  backCard.style.transform = "translate(-50%, -50%) scale(1)";
  backCard.style.opacity = "1";

  setTimeout(() => {
    updateCardContent(); // 次のカードを前面にセット
    frontCard.style.transition = "none";
    backCard.style.transition = "none";
    resetCards();
    frontCard.style.opacity = "1";
    // ドラッグ距離をリセット
    dragX = 0;
    dragY = 0;
  }, 300);
}

function resetCards() {
  frontCard.style.transform = "translate(-50%, -50%) rotate(0deg) scale(1)";
  backCard.style.transform = "translate(calc(-50% + 8px), -50%) scale(0.95)";
  backCard.style.opacity = "0.5";
}
