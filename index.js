document.addEventListener("DOMContentLoaded", () => {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  requestAnimationFrame(() => setTimeout(() => document.body.classList.add("ready"), 80));

  // Navbar
  const nav = document.getElementById("nav");
  const burger = nav.querySelector(".burger");
  const onScroll = () => nav.classList.toggle("scrolled", window.scrollY > 20);
  window.addEventListener("scroll", onScroll, { passive: true }); onScroll();
  burger.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    burger.setAttribute("aria-expanded", open);
    document.body.style.overflow = open ? "hidden" : "";
  });

  // Scorrimento con compensazione della barra
  document.querySelectorAll('a[href^="#"]').forEach(a => a.addEventListener("click", e => {
    const id = a.getAttribute("href"); const t = id === "#top" ? document.body : document.querySelector(id);
    if (!t) return; e.preventDefault();
    nav.classList.remove("open"); burger.setAttribute("aria-expanded", false); document.body.style.overflow = "";
    const y = id === "#top" ? 0 : t.getBoundingClientRect().top + window.scrollY - (id === "#contatti" || id === "#servizi" ? 0 : nav.offsetHeight);
    window.scrollTo({ top: y, behavior: reduce ? "auto" : "smooth" });
  }));

  // Comparse
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: .18 });
  document.querySelectorAll(".reveal,.scene").forEach(el => io.observe(el));
  // I testi "a sipario" hanno area visibile zero finché sono chiusi: osservo il contenitore
  const io2 = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.querySelectorAll(":scope > .clip").forEach(c => c.classList.add("in")); io2.unobserve(e.target); } }), { threshold: .1 });
  new Set([...document.querySelectorAll(".clip")].map(c => c.parentElement)).forEach(p => io2.observe(p));
  document.querySelectorAll(".scene-list .scene").forEach((el, i) => el.style.transitionDelay = (i * 0.12) + "s");

  // Manifesto: parole che si accendono durante lo scorrimento
  const box = document.querySelector("[data-words]");
  const wrap = node => {
    [...node.childNodes].forEach(n => {
      if (n.nodeType === 3) {
        const frag = document.createDocumentFragment();
        n.textContent.split(/(\s+)/).forEach(part => {
          if (!part) return;
          if (/^\s+$/.test(part)) frag.appendChild(document.createTextNode(part));
          else { const s = document.createElement("span"); s.className = "w"; s.textContent = part; frag.appendChild(s); }
        });
        n.replaceWith(frag);
      } else if (n.nodeType === 1) wrap(n);
    });
  };
  wrap(box);
  const words = [...box.querySelectorAll(".w")];

  // Parallasse
  const px = [...document.querySelectorAll("[data-parallax]")];
  const pxx = [...document.querySelectorAll("[data-parallax-x]")];
  let ticking = false;
  const frame = () => {
    const vh = window.innerHeight, sy = window.scrollY;
    if (!reduce) {
      if (sy < vh * 1.2) px.forEach(el => { el.style.setProperty("--py", (sy * parseFloat(el.dataset.parallax)) + "px"); el.style.setProperty("--sc", 1 + sy / vh * 0.08); });
      pxx.forEach(el => { const r = el.parentElement.getBoundingClientRect(); el.style.transform = "translateX(" + (-(vh - r.top) * parseFloat(el.dataset.parallaxX)) + "px)"; });
    }
    const r = box.getBoundingClientRect();
    const p = Math.min(1, Math.max(0, (vh * 0.85 - r.top) / (r.height + vh * 0.2)));
    const n = reduce ? words.length : Math.round(p * words.length);
    words.forEach((w, i) => w.classList.toggle("lit", i < n));
    ticking = false;
  };
  window.addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(frame); } }, { passive: true });
  window.addEventListener("resize", frame);
  frame();
});
