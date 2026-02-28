const revealItems = document.querySelectorAll(".reveal");
const toggleBtn = document.getElementById("formToggle");
const overlay = document.getElementById("formOverlay");
const closeBtn = document.getElementById("formClose");
const backdrop = document.querySelector("[data-close-overlay]");
const page = document.querySelector(".page");
const headlineWrap = document.querySelector(".headline-wrap");
const formModal = document.querySelector(".form-modal");
const contactForm = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");
const submitBtn = contactForm ? contactForm.querySelector(".submit-btn") : null;

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

const resetFormUi = () => {
  if (!formModal || !contactForm || !submitBtn) return;
  formModal.classList.remove("submitted");
  setFormStatus("");
  contactForm.reset();
  submitBtn.disabled = false;
  submitBtn.textContent = "→";
};

const openOverlay = () => {
  resetFormUi();
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

const setFormStatus = (message, kind = "") => {
  if (!formStatus) return;
  formStatus.textContent = message;
  formStatus.className = kind ? `form-status ${kind}` : "form-status";
};

const submitForm = async (event) => {
  event.preventDefault();
  if (!contactForm || !submitBtn) return;

  setFormStatus("");
  submitBtn.disabled = true;

  const originalButtonText = submitBtn.textContent;
  submitBtn.textContent = "…";

  const formData = new FormData(contactForm);

  try {
    const response = await fetch(contactForm.action, {
      method: "POST",
      body: formData,
      headers: {
        Accept: "application/json"
      }
    });

    if (response.ok) {
      if (formModal) {
        formModal.classList.add("submitted");
      }
      setFormStatus("");
      return;
    }

    let errorMessage = "Could not submit. Please try again.";
    try {
      const payload = await response.json();
      if (payload?.errors?.length) {
        errorMessage = payload.errors.map((item) => item.message).join(" ");
      }
    } catch (_error) {
      // Ignore parse failures and show generic message.
    }
    setFormStatus(errorMessage, "error");
  } catch (_error) {
    setFormStatus("Network error. Please try again.", "error");
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = originalButtonText;
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

if (contactForm) {
  contactForm.addEventListener("submit", submitForm);
}
