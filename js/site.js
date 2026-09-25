const intro = document.getElementById("intro");
const introSkip = document.getElementById("introSkip");
const nav = document.getElementById("nav");
const menuBtn = document.getElementById("menuBtn");
const hero = document.querySelector(".hero");
const heroMedia = document.getElementById("heroMedia");
const heroSpot = document.getElementById("heroSpot");

document.documentElement.classList.add("motion");

let introClosed = false;
const finishIntro = () => {
  if (introClosed) return;
  introClosed = true;
  intro?.classList.add("is-done");
  document.body.classList.add("is-ready");
  document.body.classList.remove("intro-lock");
};

window.setTimeout(finishIntro, 3000);
window.setTimeout(finishIntro, 5000);
introSkip?.addEventListener("click", finishIntro);
intro?.addEventListener("click", (event) => {
  if (event.target === introSkip) return;
  finishIntro();
});
window.addEventListener("keydown", (event) => {
  if (introClosed) return;
  if (event.key === "Escape" || event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    finishIntro();
  }
});

let latestY = window.scrollY;
let ticking = false;

const onScroll = () => {
  latestY = window.scrollY;
  nav?.classList.toggle("is-scrolled", latestY > 24);
  if (ticking) return;
  ticking = true;
  window.requestAnimationFrame(() => {
    if (heroMedia) {
      heroMedia.style.transform = `translate3d(0, ${latestY * 0.24}px, 0)`;
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
  ".section-head, .product, .split, .center, .branch, .contact-card, .showcase-band, .footer-grid, .stat, .local-panel, .price-board"
);

revealItems.forEach((el, i) => {
  el.classList.add("reveal");
  if (
    el.classList.contains("product") ||
    el.classList.contains("stat") ||
    el.classList.contains("branch") ||
    el.classList.contains("contact-card")
  ) {
    el.style.setProperty("--d", `${(i % 6) * 70}ms`);
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
}, 9000);

const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
if (canHover) {
  document.querySelectorAll(".product").forEach((card) => {
    card.addEventListener("pointermove", (event) => {
      const box = card.getBoundingClientRect();
      const x = (event.clientX - box.left) / box.width - 0.5;
      const y = (event.clientY - box.top) / box.height - 0.5;
      card.style.transform = `translateY(-10px) rotateX(${y * -6}deg) rotateY(${x * 7}deg)`;
    });
    card.addEventListener("pointerleave", () => {
      card.style.transform = "";
    });
  });

  document.querySelectorAll(".btn-gold").forEach((btn) => {
    btn.addEventListener("pointermove", (event) => {
      const box = btn.getBoundingClientRect();
      const x = event.clientX - box.left - box.width / 2;
      const y = event.clientY - box.top - box.height / 2;
      btn.style.transform = `translate(${x * 0.12}px, ${y * 0.16}px)`;
    });
    btn.addEventListener("pointerleave", () => {
      btn.style.transform = "";
    });
  });
}

const priceTable = document.getElementById("priceTable");
if (priceTable) {
  const OUNCE_GRAMS = 31.1034768;
  const money = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  const rows = {};
  priceTable.querySelectorAll("[data-karat]").forEach((row) => {
    rows[row.dataset.karat] = row;
  });
  const last = {};

  const paintNumber = (el, next) => {
    const from = Number(el.dataset.value || next);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.dataset.value = String(next);
    if (reduce) {
      el.textContent = money.format(next);
      return;
    }
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min(1, (now - start) / 900);
      const eased = 1 - (1 - t) ** 3;
      el.textContent = money.format(from + (next - from) * eased);
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  const refreshPrices = async () => {
    const status = document.getElementById("priceUpdated");
    try {
      const [goldRes, fxRes] = await Promise.all([
        fetch("https://api.gold-api.com/price/XAU"),
        fetch("https://open.er-api.com/v6/latest/USD"),
      ]);
      if (!goldRes.ok || !fxRes.ok) throw new Error("network");
      const gold = await goldRes.json();
      const fx = await fxRes.json();
      const ounce = Number(gold.price);
      const egp = Number(fx.rates && fx.rates.EGP);
      if (!ounce || !egp) throw new Error("shape");
      const gram24 = (ounce / OUNCE_GRAMS) * egp;
      const values = { 24: gram24, 21: gram24 * (21 / 24), 18: gram24 * (18 / 24) };
      Object.entries(values).forEach(([karat, value]) => {
        const row = rows[karat];
        const num = row.querySelector(".price-num");
        const delta = row.querySelector(".price-delta");
        paintNumber(num, value);
        const prev = last[karat];
        if (prev) {
          const diff = value - prev;
          const pct = Math.abs((diff / prev) * 100);
          delta.textContent = `${diff > 0 ? "▲" : diff < 0 ? "▼" : "•"} ${pct.toFixed(2)}%`;
          delta.className = `price-delta ${diff > 0 ? "is-up" : diff < 0 ? "is-down" : ""}`;
          row.classList.remove("flash-up", "flash-down");
          void row.offsetWidth;
          if (diff !== 0) row.classList.add(diff > 0 ? "flash-up" : "flash-down");
        }
        last[karat] = value;
      });
      document.getElementById("ozPrice").textContent = `$${money.format(ounce)}`;
      document.getElementById("usdRate").textContent = money.format(egp);
      const updated = gold.updatedAt ? new Date(gold.updatedAt) : new Date();
      status.textContent = `آخر تحديث ${updated.toLocaleTimeString("ar-EG", { hour: "2-digit", minute: "2-digit" })}`;
    } catch (error) {
      status.textContent = "تعذر تحديث السعر. اسأل المحل على واتساب.";
    }
  };

  refreshPrices();
  window.setInterval(refreshPrices, 30000);
}
