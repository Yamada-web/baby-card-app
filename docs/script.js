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

  // 裏カード（スワイプ反対方向から出てくる）
  const scale = 0.95 + progress * 0.05;
  const opacity = 0.4 + progress * 0.6;
  const shadow = 8 + progress * 20;

  // 方向判定
  let offsetX = 0;
  let offsetY = 0;

  if (Math.abs(dragX) > Math.abs(dragY)) {
    // 横スワイプ
    offsetX = dragX > 0 ? -40 : 40; // 右スワイプ→左から / 左スワイプ→右から
  } else {
    // 縦スワイプ
    offsetY = dragY > 0 ? -40 : 40; // 下スワイプ→上から / 上スワイプ→下から
  }

  // スワイプ量に応じて中央へ寄ってくる
  const moveX = offsetX * (1 - progress);
  const moveY = offsetY * (1 - progress);

  back.style.transform =
    `translate(calc(-50% + ${moveX}px), calc(-50% + ${moveY}px)) scale(${scale})`;
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
    back.style.transform = "translate(calc(-50% + 8px), -50%) scale(0.95)";
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
      back.style.transform = "translate(calc(-50% + 8px), -50%) scale(0.95)";
      back.style.opacity = "0.5";
      back.style.boxShadow = "0 10px 20px rgba(0,0,0,0.15)";
      return;
    } else {
      animateCard(120, 0, () => prevCard(moveCount));
      const back = document.querySelector(".back-card");
      back.style.transform = "translate(calc(-50% + 8px), -50%) scale(0.95)";
      back.style.opacity = "0.5";
      back.style.boxShadow = "0 10px 20px rgba(0,0,0,0.15)";
      return;
    }
  } else if (Math.abs(dy) > 50) {
    if (dy < 0) {
      animateCard(0, -120, () => nextCategory());
      const back = document.querySelector(".back-card");
      back.style.transform = "translate(calc(-50% + 8px), -50%) scale(0.95)";
      back.style.opacity = "0.5";
      back.style.boxShadow = "0 10px 20px rgba(0,0,0,0.15)";
      return;
    } else {
      animateCard(0, 120, () => prevCategory());
      const back = document.querySelector(".back-card");
      back.style.transform = "translate(calc(-50% + 8px), -50%) scale(0.95)";
      back.style.opacity = "0.5";
      return;
    }
  }

  cardEl.style.transform = "translate(0, 0) rotate(0deg)";
  const back = document.querySelector(".back-card");
  back.style.transform = "translate(calc(-50% + 8px), -50%) scale(0.95)";
  back.style.opacity = "0.5";
  back.style.boxShadow = "0 10px 20px rgba(0,0,0,0.15)";
});
