document.documentElement.classList.add("js");

const header = document.querySelector(".site-header");
const navToggle = document.querySelector(".nav-toggle");
const menu = document.querySelector(".primary-menu");

const closeMenu = () => {
  if (!navToggle || !menu) return;
  navToggle.setAttribute("aria-expanded", "false");
  navToggle.setAttribute("aria-label", "Open navigation");
  menu.classList.remove("open");
  document.body.classList.remove("menu-open");
};

if (navToggle && menu) {
  navToggle.addEventListener("click", () => {
    const willOpen = navToggle.getAttribute("aria-expanded") !== "true";
    navToggle.setAttribute("aria-expanded", String(willOpen));
    navToggle.setAttribute("aria-label", willOpen ? "Close navigation" : "Open navigation");
    menu.classList.toggle("open", willOpen);
    document.body.classList.toggle("menu-open", willOpen);
  });

  menu.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));

  window.addEventListener("resize", () => {
    if (window.innerWidth > 1050) closeMenu();
  });
}

if (header && !header.classList.contains("site-header-dark")) {
  const updateHeader = () => header.classList.toggle("scrolled", window.scrollY > 40);
  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });
}

document.querySelectorAll("[data-year]").forEach((node) => {
  node.textContent = String(new Date().getFullYear());
});

const revealNodes = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { rootMargin: "0px 0px -8%", threshold: 0.08 },
  );

  revealNodes.forEach((node) => observer.observe(node));
} else {
  revealNodes.forEach((node) => node.classList.add("is-visible"));
}

document.querySelectorAll("[data-accordion] details").forEach((item) => {
  item.addEventListener("toggle", () => {
    if (!item.open) return;
    document.querySelectorAll("[data-accordion] details").forEach((other) => {
      if (other !== item) other.open = false;
    });
  });
});

// =========================================================
// QIXTON 3D INTERACTION LAYER
// Adds mouse-responsive depth without changing the theme.
// =========================================================
(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (reduceMotion || !finePointer) return;

  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

  const tiltTargets = document.querySelectorAll(
    '.service-card, .work-card, .portrait-crop, .lead-form, .mission-panel'
  );

  tiltTargets.forEach((card) => {
    card.classList.add('is-3d-card');

    card.addEventListener('pointermove', (event) => {
      const rect = card.getBoundingClientRect();
      const px = clamp((event.clientX - rect.left) / rect.width, 0, 1);
      const py = clamp((event.clientY - rect.top) / rect.height, 0, 1);
      const rotateY = (px - 0.5) * 10;
      const rotateX = (0.5 - py) * 8;

      card.style.setProperty('--card-rx', `${rotateX.toFixed(2)}deg`);
      card.style.setProperty('--card-ry', `${rotateY.toFixed(2)}deg`);
      card.style.setProperty('--pointer-x', `${(px * 100).toFixed(1)}%`);
      card.style.setProperty('--pointer-y', `${(py * 100).toFixed(1)}%`);
    });

    card.addEventListener('pointerleave', () => {
      card.style.setProperty('--card-rx', '0deg');
      card.style.setProperty('--card-ry', '0deg');
      card.style.setProperty('--pointer-x', '50%');
      card.style.setProperty('--pointer-y', '50%');
    });
  });

  const hero = document.querySelector('.hero');
  const heroArt = document.querySelector('.hero-art');

  if (hero && heroArt) {
    hero.addEventListener('pointermove', (event) => {
      const rect = hero.getBoundingClientRect();
      const px = clamp((event.clientX - rect.left) / rect.width, 0, 1);
      const py = clamp((event.clientY - rect.top) / rect.height, 0, 1);

      heroArt.style.setProperty('--hero-x', `${((px - 0.5) * 22).toFixed(1)}px`);
      heroArt.style.setProperty('--hero-y', `${((py - 0.5) * 14).toFixed(1)}px`);
      heroArt.style.setProperty('--hero-ry', `${((px - 0.5) * 7).toFixed(2)}deg`);
      heroArt.style.setProperty('--hero-rx', `${((0.5 - py) * 5).toFixed(2)}deg`);
    });

    hero.addEventListener('pointerleave', () => {
      ['--hero-x', '--hero-y', '--hero-rx', '--hero-ry'].forEach((prop) => heroArt.style.removeProperty(prop));
    });
  }

  const processSection = document.querySelector('.process-section');
  const processArt = document.querySelector('.process-art');

  if (processSection && processArt) {
    processSection.addEventListener('pointermove', (event) => {
      const rect = processSection.getBoundingClientRect();
      const px = clamp((event.clientX - rect.left) / rect.width, 0, 1);
      const py = clamp((event.clientY - rect.top) / rect.height, 0, 1);
      processArt.style.setProperty('--process-ry', `${((px - 0.5) * 5).toFixed(2)}deg`);
      processArt.style.setProperty('--process-rx', `${((0.5 - py) * 4).toFixed(2)}deg`);
    });

    processSection.addEventListener('pointerleave', () => {
      processArt.style.setProperty('--process-rx', '0deg');
      processArt.style.setProperty('--process-ry', '0deg');
    });
  }
})();
