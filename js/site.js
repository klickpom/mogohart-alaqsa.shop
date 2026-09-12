const intro = document.getElementById("intro");
const nav = document.getElementById("nav");
const menuBtn = document.getElementById("menuBtn");
const hero = document.querySelector(".hero");
const heroMedia = document.getElementById("heroMedia");
const heroSpot = document.getElementById("heroSpot");

document.documentElement.classList.add("motion");
document.body.classList.add("is-ready");

const finishIntro = () => {
  intro?.classList.add("is-done");
};

window.setTimeout(finishIntro, 1250);

let latestY = window.scrollY;
let ticking = false;

const onScroll = () => {
  latestY = window.scrollY;
  nav?.classList.toggle("is-scrolled", latestY > 24);
  if (ticking) return;
  ticking = true;
  window.requestAnimationFrame(() => {
    if (heroMedia) {
      heroMedia.style.transform = `translate3d(0, ${latestY * 0.18}px, 0)`;
    }
    ticking = false;
  });
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

if (hero && heroSpot) {
  hero.addEventListener(
    "pointermove",
    (event) => {
      const box = hero.getBoundingClientRect();
      const x = ((event.clientX - box.left) / box.width) * 100;
      const y = ((event.clientY - box.top) / box.height) * 100;
      hero.style.setProperty("--mx", `${x}%`);
      hero.style.setProperty("--my", `${y}%`);
    },
    { passive: true }
  );
}

const revealItems = document.querySelectorAll(
  ".poster, .section-head, .product, .split, .center, .branch, .contact-card, .band, .footer-grid, .stat, .ticker"
);

revealItems.forEach((el, i) => {
  el.classList.add("reveal");
  if (
    el.classList.contains("product") ||
    el.classList.contains("stat") ||
    el.classList.contains("branch") ||
    el.classList.contains("contact-card")
  ) {
    el.style.setProperty("--d", `${(i % 4) * 90}ms`);
  }
});

const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-in");
        io.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
);

revealItems.forEach((el) => io.observe(el));
window.setTimeout(() => {
  revealItems.forEach((el) => el.classList.add("is-in"));
}, 4200);

const desktop = window.matchMedia("(min-width: 720px)").matches;
if (desktop) {
  document.querySelectorAll(".product").forEach((card) => {
    card.addEventListener("pointermove", (event) => {
      const box = card.getBoundingClientRect();
      const x = (event.clientX - box.left) / box.width - 0.5;
      const y = (event.clientY - box.top) / box.height - 0.5;
      card.style.transform = `translateY(-8px) rotateX(${y * -7}deg) rotateY(${x * 8}deg)`;
    });
    card.addEventListener("pointerleave", () => {
      card.style.transform = "";
    });
  });
}
