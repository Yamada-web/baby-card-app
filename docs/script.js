document.addEventListener("touchmove", (e) => {
  if (!isDragging) return;

  const touch = e.touches[0];
  dragX = touch.clientX - startX;
  dragY = touch.clientY - startY;

  const front = document.getElementById("card");
  const back = document.querySelector(".back-card");

  // スワイプ量を0〜1に正規化
  const progress = Math.min(
    Math.max(Math.abs(dragX) + Math.abs(dragY), 0),
    150
  ) / 150;

  // 表カード（指についてくる + 少し小さく）
  const frontScale = 1 - progress * 0.05;

  if (Math.abs(dragX) > Math.abs(dragY)) {
    const rotate = dragX * 0.05;
    front.style.transform =
      `translate(${dragX * 0.6}px, 0) rotate(${rotate}deg) scale(${frontScale})`;
  } else {
    front.style.transform =
      `translate(0, ${dragY * 0.4}px) scale(${frontScale})`;
  }

  // 裏カード（だんだん浮き上がる + 影強調・上下ずらし）
  const scale = 0.95 + progress * 0.05;
  const opacity = 0.5 + progress * 0.5;
  const liftY = 10 - progress * 10; // 少しずつ上にくる
  const shadow = 10 + progress * 20;

  back.style.transform =
    `translate(-50%, calc(-50% + ${liftY}px)) scale(${scale})`;
  back.style.opacity = opacity;
  back.style.boxShadow = `0 ${shadow}px ${shadow * 2}px rgba(0,0,0,0.25)`;
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
    const back = document.querySelector(".back-card");
    back.style.transform = "translate(-50%, -50%) scale(0.95)";
    back.style.opacity = "0.5";
    back.style.boxShadow = "0 10px 20px rgba(0,0,0,0.15)";
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
      const back = document.querySelector(".back-card");
      back.style.transform = "translate(-50%, -50%) scale(0.95)";
      back.style.opacity = "0.5";
      back.style.boxShadow = "0 10px 20px rgba(0,0,0,0.15)";
      return;
    } else {
      animateCard(120, 0, () => prevCard(moveCount));
      const back = document.querySelector(".back-card");
      back.style.transform = "translate(-50%, -50%) scale(0.95)";
      back.style.opacity = "0.5";
      back.style.boxShadow = "0 10px 20px rgba(0,0,0,0.15)";
      return;
    }
  } else if (Math.abs(dy) > 50) {
    if (dy < 0) {
      animateCard(0, -120, () => nextCategory());
      const back = document.querySelector(".back-card");
      back.style.transform = "translate(-50%, -50%) scale(0.95)";
      back.style.opacity = "0.5";
      back.style.boxShadow = "0 10px 20px rgba(0,0,0,0.15)";
      return;
    } else {
      animateCard(0, 120, () => prevCategory());
      const back = document.querySelector(".back-card");
      back.style.transform = "translate(-50%, -50%) scale(0.95)";
      back.style.opacity = "0.5";
      return;
    }
  }

  cardEl.style.transform = "translate(0, 0) rotate(0deg)";
  const back = document.querySelector(".back-card");
  back.style.transform = "translate(-50%, -50%) scale(0.95)";
  back.style.opacity = "0.5";
  back.style.boxShadow = "0 10px 20px rgba(0,0,0,0.15)";
});
