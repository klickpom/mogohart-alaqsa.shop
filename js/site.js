const intro = document.getElementById("intro");
const nav = document.getElementById("nav");
const menuBtn = document.getElementById("menuBtn");
const heroMedia = document.getElementById("heroMedia");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const finishIntro = () => {
  intro?.classList.add("is-done");
  document.body.classList.add("is-ready");
};

if (reduceMotion) {
  finishIntro();
} else {
  window.setTimeout(finishIntro, 1450);
}

const onScroll = () => {
  nav?.classList.toggle("is-scrolled", window.scrollY > 24);
  if (!reduceMotion && heroMedia) {
    heroMedia.style.transform = `translate3d(0, ${window.scrollY * 0.22}px, 0)`;
  }
};

onScroll();
window.addEventListener("scroll", onScroll, { passive: true });

const closeMenu = () => {
  document.body.classList.remove("menu-open");
  menuBtn?.setAttribute("aria-expanded", "false");
  menuBtn?.setAttribute("aria-label", "فتح القائمة");
};

menuBtn?.addEventListener("click", () => {
  const open = document.body.classList.toggle("menu-open");
  menuBtn.setAttribute("aria-expanded", String(open));
  menuBtn.setAttribute("aria-label", open ? "إغلاق القائمة" : "فتح القائمة");
});

document.querySelectorAll("[data-go]").forEach((el) => {
  el.addEventListener("click", () => {
    const id = el.getAttribute("data-go");
    const target = id ? document.getElementById(id) : null;
    closeMenu();
    target?.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

const revealItems = document.querySelectorAll(
  ".poster, .section-head, .product, .split, .center, .branch, .contact-card, .band, .footer-grid, .stat"
);

revealItems.forEach((el, i) => {
  el.classList.add("reveal");
  if (el.classList.contains("product") || el.classList.contains("stat") || el.classList.contains("branch") || el.classList.contains("contact-card")) {
    el.style.setProperty("--d", `${(i % 4) * 90}ms`);
  }
});

if (reduceMotion) {
  revealItems.forEach((el) => el.classList.add("is-in"));
} else {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.16, rootMargin: "0px 0px -8% 0px" }
  );
  revealItems.forEach((el) => io.observe(el));
}
