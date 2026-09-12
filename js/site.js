const intro = document.getElementById("intro");
const nav = document.getElementById("nav");
const menuBtn = document.getElementById("menuBtn");

window.setTimeout(() => {
  intro?.classList.add("is-done");
}, 1100);

const onScroll = () => {
  nav?.classList.toggle("is-scrolled", window.scrollY > 24);
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
