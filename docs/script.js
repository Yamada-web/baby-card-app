const MIN_DISTANCE = 30;

const categories = {
  animals: [
    { name: "いぬ", image: "images/animals/inu.jpg" },
    { name: "ねこ", image: "images/animals/neko.jpg" },
    { name: "うさぎ", image: "images/animals/usagi.jpg"},
    { name: "ハムスター", image: "images/animals/hamu.jpg"}
  ],
  foods: [
    { name: "りんご", image: "images/foods/ringo.jpg" },
    { name: "バナナ", image: "images/foods/banana.jpg" }
  ]
};

let categoryKeys = Object.keys(categories);
let currentCategoryIndex = 0;
let currentIndex = 0;

// カード表示
function updateCard() {
  const category = categoryKeys[currentCategoryIndex];
  const card = categories[category][currentIndex];

  document.getElementById("cardImage").src = card.image;
  document.getElementById("name").textContent = card.name;
}

updateCard();

// スワイプ用変数
let startX = 0;
let startY = 0;
let startTime = 0;

document.addEventListener("touchstart", (e) => {
  startX = e.touches[0].clientX;
  startY = e.touches[0].clientY;
  startTime = Date.now();
});

document.addEventListener("touchend", (e) => {
  const endX = e.changedTouches[0].clientX;
  const endY = e.changedTouches[0].clientY;

  const dx = endX - startX;
  const dy = endY - startY;
  const time = Date.now() - startTime;

  // 動きが小さすぎたら無視
  if (Math.abs(dx) < MIN_DISTANCE && Math.abs(dy) < MIN_DISTANCE) {
    return;
  }

  // スワイプの勢い
  const speed = Math.max(Math.abs(dx), Math.abs(dy)) / time;
  let moveCount = 1;
  if (speed > 1) {
    moveCount = 3;
  } else if (speed > 0.5) {
    moveCount = 2;
  }

  // 左右スワイプ（カード）
  if (Math.abs(dx) > Math.abs(dy)) {
    if (dx < 0) {
      nextCard(moveCount);
    } else {
      prevCard(moveCount);
    }
  }
  // 上下スワイプ（カテゴリ）
  else if (Math.abs(dy) > 50) {
    if (dy < 0) {
      nextCategory();
    } else {
      prevCategory();
    }
  }
});

// ▶ カード：次（ループ）
function nextCard(count) {
  const list = categories[categoryKeys[currentCategoryIndex]];
  currentIndex = (currentIndex + count) % list.length;
  updateCard();
}

// ◀ カード：前（ループ）
function prevCard(count) {
  const list = categories[categoryKeys[currentCategoryIndex]];
  currentIndex =
    (currentIndex - count % list.length + list.length) % list.length;
  updateCard();
}

// ▲ カテゴリ：次（ループ）
function nextCategory() {
  currentCategoryIndex =
    (currentCategoryIndex + 1) % categoryKeys.length;
  currentIndex = 0;
  updateCard();
}

// ▼ カテゴリ：前（ループ）
function prevCategory() {
  currentCategoryIndex =
    (currentCategoryIndex - 1 + categoryKeys.length) % categoryKeys.length;
  currentIndex = 0;
  updateCard();
}