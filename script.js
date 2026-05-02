const revealItems = document.querySelectorAll("[data-reveal]");
const cursorGlow = document.querySelector(".cursor-glow");

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

window.addEventListener("pointermove", (event) => {
  if (!cursorGlow || window.matchMedia("(max-width: 760px)").matches) return;

  cursorGlow.style.opacity = "1";
  cursorGlow.style.left = `${event.clientX}px`;
  cursorGlow.style.top = `${event.clientY}px`;
});

window.addEventListener("pointerleave", () => {
  if (cursorGlow) cursorGlow.style.opacity = "0";
});

document.querySelectorAll(".service-card, .choice-card").forEach((card) => {
  card.addEventListener("pointermove", (event) => {
    const rect = card.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;

    card.style.background = `radial-gradient(circle at ${x}% ${y}%, rgba(95, 243, 255, 0.16), transparent 34%), linear-gradient(145deg, rgba(255, 255, 255, 0.14), rgba(255, 255, 255, 0.045))`;
  });

  card.addEventListener("pointerleave", () => {
    card.style.background = "";
  });
});
