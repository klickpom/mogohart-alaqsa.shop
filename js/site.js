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

document.querySelectorAll(".drawer a").forEach((el) => {
  el.addEventListener("click", closeMenu);
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
  ".section-head, .product, .split, .center, .branch, .contact-card, .showcase-band, .footer-grid, .stat, .local-panel, .price-board, .poster-float"
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

  const poster = document.getElementById("posterFrame");
  const stage = poster?.querySelector(".poster-stage");
  if (poster && stage) {
    poster.addEventListener("pointermove", (event) => {
      const box = poster.getBoundingClientRect();
      const x = (event.clientX - box.left) / box.width - 0.5;
      const y = (event.clientY - box.top) / box.height - 0.5;
      stage.style.setProperty("--rx", `${x * 8}deg`);
      stage.style.setProperty("--ry", `${y * -6}deg`);
    });
    poster.addEventListener("pointerleave", () => {
      stage.style.setProperty("--rx", "0deg");
      stage.style.setProperty("--ry", "0deg");
    });
  }

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
const money = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});
const rows = {};
priceTable?.querySelectorAll("[data-karat]").forEach((row) => {
  rows[row.dataset.karat] = row;
});
const last = {};
let latest = null;
const gramInput = document.getElementById("gramInput");
const karatInput = document.getElementById("karatInput");
const calcOut = document.getElementById("calcOut");
const paintCalc = () => {
  if (!calcOut) return;
  const grams = Number(gramInput && gramInput.value);
  const quote = latest && latest[karatInput ? karatInput.value : "21"];
  calcOut.textContent = grams > 0 && quote ? `${money.format(quote.sell * grams)} ج.م` : "—";
};
gramInput?.addEventListener("input", paintCalc);
karatInput?.addEventListener("change", paintCalc);

const paintNumber = (el, next) => {
  if (!el) return;
  const from = Number(el.dataset.value || next);
  el.dataset.value = String(next);
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) {
    el.textContent = money.format(next);
    return;
  }
  const start = performance.now();
  const tick = (now) => {
    const t = Math.min(1, (now - start) / 800);
    const eased = 1 - (1 - t) ** 3;
    el.textContent = money.format(from + (next - from) * eased);
    if (t < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
};

const SYNC_EVERY = 15;
let syncLeft = SYNC_EVERY;
const paintSync = () => {
  const label = document.getElementById("syncLeft");
  const ring = document.querySelector(".auto-ring");
  if (label) label.textContent = String(syncLeft);
  if (ring) ring.style.setProperty("--p", `${((SYNC_EVERY - syncLeft) / SYNC_EVERY) * 100}%`);
};

const refreshPrices = async () => {
  syncLeft = SYNC_EVERY;
  paintSync();
  const status = document.getElementById("priceUpdated");
  try {
    const res = await fetch("https://golden-circle.net/api/current-prices");
    if (!res.ok) throw new Error("network");
    const data = await res.json();
    const p = data.prices;
    if (!p || !p.sell_21 || !p.buy_21) throw new Error("shape");
    const values = {
      24: { buy: Number(p.buy_24), sell: Number(p.sell_24), change: Number(p.sell_change_24) },
      21: { buy: Number(p.buy_21), sell: Number(p.sell_21), change: Number(p.sell_change_21) },
      18: { buy: Number(p.buy_18), sell: Number(p.sell_18), change: Number(p.sell_change_18) },
    };
    latest = values;
    paintCalc();
    paintNumber(document.getElementById("tickSell"), values[21].sell);
    Object.entries(values).forEach(([karat, quote]) => {
      const row = rows[karat];
      if (!row) return;
      paintNumber(row.querySelector('[data-side="buy"]'), quote.buy);
      paintNumber(row.querySelector('[data-side="sell"]'), quote.sell);
      const delta = row.querySelector(".price-delta");
      const prev = last[karat];
      const direction = quote.change > 0 || (prev && quote.sell > prev) ? 1 : quote.change < 0 || (prev && quote.sell < prev) ? -1 : 0;
      if (delta && (prev || quote.change)) {
        const pct = prev ? Math.abs(((quote.sell - prev) / prev) * 100) : 0;
        delta.textContent = `${direction > 0 ? "▲" : direction < 0 ? "▼" : "•"}${pct ? " " + pct.toFixed(2) + "%" : ""}`;
        delta.className = `price-delta ${direction > 0 ? "is-up" : direction < 0 ? "is-down" : ""}`;
        row.classList.remove("flash-up", "flash-down");
        if (direction) {
          void row.offsetWidth;
          row.classList.add(direction > 0 ? "flash-up" : "flash-down");
        }
      }
      last[karat] = quote.sell;
    });
    const oz = document.getElementById("ozPrice");
    const usd = document.getElementById("usdRate");
    if (oz) oz.textContent = `$${money.format(p.screen || p.ounce)}`;
    if (usd) usd.textContent = money.format(p.dollar);
    if (status) {
      const updated = data.timestamp ? new Date(data.timestamp) : new Date();
      status.textContent = `الآن ${updated.toLocaleTimeString("ar-EG", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}`;
    }
  } catch (error) {
    if (latest) return;
    try {
      const [goldRes, fxRes] = await Promise.all([
        fetch("https://api.gold-api.com/price/XAU"),
        fetch("https://open.er-api.com/v6/latest/USD"),
      ]);
      const gold = await goldRes.json();
      const fx = await fxRes.json();
      const gram24 = (Number(gold.price) / 31.1034768) * Number(fx.rates.EGP);
      const values = {
        24: { buy: gram24, sell: gram24, change: 0 },
        21: { buy: gram24 * (21 / 24), sell: gram24 * (21 / 24), change: 0 },
        18: { buy: gram24 * (18 / 24), sell: gram24 * (18 / 24), change: 0 },
      };
      latest = values;
      paintCalc();
      paintNumber(document.getElementById("tickSell"), values[21].sell);
      Object.entries(values).forEach(([karat, quote]) => {
        const row = rows[karat];
        if (!row) return;
        paintNumber(row.querySelector('[data-side="buy"]'), quote.buy);
        paintNumber(row.querySelector('[data-side="sell"]'), quote.sell);
      });
    } catch (fallbackError) {
      if (status) status.textContent = "جاري الاتصال بسعر السوق";
    }
  }
};

refreshPrices();
window.setInterval(() => {
  syncLeft -= 1;
  if (syncLeft <= 0) refreshPrices();
  else paintSync();
}, 1000);
