const revealItems = document.querySelectorAll("[data-reveal]");
const backgroundGrid = document.querySelector(".background-grid");

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.16 }
);

revealItems.forEach((item) => revealObserver.observe(item));

if (backgroundGrid) {
  const ctx = backgroundGrid.getContext("2d");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const isTouchLayout = window.matchMedia("(max-width: 760px)");

  if (!ctx || reduceMotion.matches) {
    backgroundGrid.remove();
  } else {
    const pointer = { x: -9999, y: -9999, active: false };
    const smoothPointer = { x: -9999, y: -9999 };
    let width = 0;
    let height = 0;
    let dpr = 1;

    const resizeGrid = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      backgroundGrid.width = Math.floor(width * dpr);
      backgroundGrid.height = Math.floor(height * dpr);
      backgroundGrid.style.width = `${width}px`;
      backgroundGrid.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const deformPoint = (x, y, time) => {
      const dx = x - smoothPointer.x;
      const dy = y - smoothPointer.y;
      const distance = Math.hypot(dx, dy);
      const radius = 300;

      if (!pointer.active || distance > radius) return { x, y };

      const falloff = Math.cos((distance / radius) * Math.PI * 0.5);
      const lift = falloff * falloff;
      const angle = Math.atan2(dy, dx);
      const ripple = Math.sin(distance * 0.042 - time * 0.005) * 10 * lift;
      const pull = -42 * lift;

      return {
        x: x + Math.cos(angle) * pull + Math.cos(angle + Math.PI / 2) * ripple,
        y: y + Math.sin(angle) * pull + Math.sin(angle + Math.PI / 2) * ripple - 18 * lift,
      };
    };

    const drawGrid = (time) => {
      smoothPointer.x += (pointer.x - smoothPointer.x) * 0.16;
      smoothPointer.y += (pointer.y - smoothPointer.y) * 0.16;

      ctx.clearRect(0, 0, width, height);
      ctx.lineWidth = 1;
      ctx.strokeStyle = "rgba(255, 255, 255, 0.035)";

      const spacing = width < 760 ? 46 : 58;
      const overscan = spacing * 2;

      for (let x = -overscan; x <= width + overscan; x += spacing) {
        ctx.beginPath();
        for (let y = -overscan; y <= height + overscan; y += 10) {
          const point = deformPoint(x, y, time);
          if (y === -overscan) ctx.moveTo(point.x, point.y);
          else ctx.lineTo(point.x, point.y);
        }
        ctx.stroke();
      }

      for (let y = -overscan; y <= height + overscan; y += spacing) {
        ctx.beginPath();
        for (let x = -overscan; x <= width + overscan; x += 10) {
          const point = deformPoint(x, y, time);
          if (x === -overscan) ctx.moveTo(point.x, point.y);
          else ctx.lineTo(point.x, point.y);
        }
        ctx.stroke();
      }

      requestAnimationFrame(drawGrid);
    };

    window.addEventListener("resize", resizeGrid);
    window.addEventListener("pointermove", (event) => {
      if (isTouchLayout.matches) return;
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      pointer.active = true;
    });
    window.addEventListener("pointerleave", () => {
      pointer.active = false;
    });

    resizeGrid();
    requestAnimationFrame(drawGrid);
  }
}

const contactForm = document.querySelector(".contact-form");

if (contactForm && new URLSearchParams(window.location.search).get("skickat") === "true") {
  const successMessage = document.createElement("p");
  successMessage.className = "form-status";
  successMessage.textContent = "Tack! Din förfrågan har skickats.";
  contactForm.prepend(successMessage);
}
