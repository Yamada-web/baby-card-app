const MIN_DISTANCE = 30;

let isDragging = false;
let dragX = 0;
let dragY = 0;

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

function animateCard(x, y, callback) {
  const cardEl = document.getElementById("card");
  cardEl.style.transform = `translate(${x}px, ${y}px)`;
  cardEl.style.opacity = "0";

  setTimeout(() => {
    callback();
    cardEl.style.transform = "translate(0, 0)";
    cardEl.style.opacity = "1";
  }, 250);
}

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
  const touch = e.touches[0];
  startX = touch.clientX;
  startY = touch.clientY;
  startTime = Date.now();

  isDragging = true;
  dragX = 0;
  dragY = 0;

  const cardEl = document.getElementById("card");
  cardEl.style.transition = "none";
});

document.addEventListener("touchmove", (e) => {
  if (!isDragging) return;

  const touch = e.touches[0];
  dragX = touch.clientX - startX;
  dragY = touch.clientY - startY;

  const cardEl = document.getElementById("card");

  // 横スワイプ優先（ポケカ風）
  if (Math.abs(dragX) > Math.abs(dragY)) {
    const rotate = dragX * 0.05; // 傾き
    cardEl.style.transform =
      `translateX(${dragX * 0.6}px) rotate(${rotate}deg)`;
  } else {
    // 縦は少しだけ追従
    cardEl.style.transform =
      `translateY(${dragY * 0.3}px)`;
  }
});

document.addEventListener("touchend", (e) => {
  isDragging = false;

  const cardEl = document.getElementById("card");
  cardEl.style.transition = "transform 0.35s cubic-bezier(.22,1.2,.36,1)";

  const endX = e.changedTouches[0].clientX;
  const endY = e.changedTouches[0].clientY;

  const dx = endX - startX;
  const dy = endY - startY;
  const time = Date.now() - startTime;

  if (Math.abs(dx) < MIN_DISTANCE && Math.abs(dy) < MIN_DISTANCE) {
    cardEl.style.transform = "translate(0, 0) rotate(0deg)";
    return;
  }

  const speed = Math.max(Math.abs(dx), Math.abs(dy)) / time;
  let moveCount = 1;
  if (speed > 1) {
    moveCount = 3;
  } else if (speed > 0.5) {
    moveCount = 2;
  }

  if (Math.abs(dx) > Math.abs(dy)) {
    if (dx < 0) {
      animateCard(-120, 0, () => nextCard(moveCount));
      return;
    } else {
      animateCard(120, 0, () => prevCard(moveCount));
      return;
    }
  } else if (Math.abs(dy) > 50) {
    if (dy < 0) {
      animateCard(0, -120, () => nextCategory());
      return;
    } else {
      animateCard(0, 120, () => prevCategory());
      return;
    }
  }

  cardEl.style.transform = "translate(0, 0) rotate(0deg)";
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
