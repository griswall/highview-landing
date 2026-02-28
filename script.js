const revealItems = document.querySelectorAll(".reveal");
const toggleBtn = document.getElementById("formToggle");
const overlay = document.getElementById("formOverlay");
const closeBtn = document.getElementById("formClose");
const backdrop = document.querySelector("[data-close-overlay]");
const page = document.querySelector(".page");
const headlineWrap = document.querySelector(".headline-wrap");

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.2 }
);

revealItems.forEach((item) => observer.observe(item));

const openOverlay = () => {
  overlay.classList.add("open");
  overlay.setAttribute("aria-hidden", "false");
  toggleBtn.setAttribute("aria-expanded", "true");
  document.body.classList.add("overlay-open");
};

const closeOverlay = () => {
  overlay.classList.remove("open");
  overlay.setAttribute("aria-hidden", "true");
  toggleBtn.setAttribute("aria-expanded", "false");
  document.body.classList.remove("overlay-open");
};

const toggleOverlay = () => {
  const isOpen = overlay.classList.contains("open");
  if (isOpen) {
    closeOverlay();
  } else {
    openOverlay();
  }
};

const setMotion = (event) => {
  const rect = page.getBoundingClientRect();
  const normX = (event.clientX - rect.left) / rect.width;
  const normY = (event.clientY - rect.top) / rect.height;

  const x = Math.min(Math.max(normX * 100, 0), 100);
  const y = Math.min(Math.max(normY * 100, 0), 100);
  document.documentElement.style.setProperty("--mx", `${x}%`);
  document.documentElement.style.setProperty("--my", `${y}%`);

  const logoX = (normX - 0.5) * 12;
  const logoY = (normY - 0.5) * 10;
  const wrapX = (normX - 0.5) * 10;
  const wrapY = (normY - 0.5) * 7;
  document.documentElement.style.setProperty("--lx", `${logoX}px`);
  document.documentElement.style.setProperty("--ly", `${logoY}px`);
  headlineWrap.style.setProperty("--hx", `${wrapX}px`);
  headlineWrap.style.setProperty("--hy", `${wrapY}px`);
};

if (toggleBtn && overlay) {
  toggleBtn.addEventListener("click", toggleOverlay);
}

if (closeBtn) {
  closeBtn.addEventListener("click", closeOverlay);
}

if (backdrop) {
  backdrop.addEventListener("click", closeOverlay);
}

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && overlay.classList.contains("open")) {
    closeOverlay();
  }
});

if (page && headlineWrap) {
  window.addEventListener("mousemove", setMotion);
}
