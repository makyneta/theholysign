(async function () {
  const T = window.THS;
  // injeta um partial HTML numa div
  const inject = async (id, url) => {
    const el = document.getElementById(id); if (!el) return;
    try { const r = await fetch(url); if (!r.ok) throw 0; el.innerHTML = await r.text() } catch { console.error("Erro a carregar " + url) }
  };
  await Promise.all([inject("site-header", "/assets/partials/header.html"), inject("site-footer", "/assets/partials/footer.html")]);

  // link ativo no header
  const normalizePath = p => p.replace(/\/index\.html$/, "/").replace(/\.html$/, "").replace(/\/$/, "") || "/";
  const path = normalizePath(location.pathname);
  document.querySelectorAll("#nav a").forEach(a => { const u = new URL(a.href); if (!u.hash && normalizePath(u.pathname) === path) a.classList.add("active") });
  // ano no footer
  document.querySelectorAll("[data-year]").forEach(s => s.textContent = new Date().getFullYear());
  // menu hambúrguer
  const b = document.getElementById("burger"), n = document.getElementById("nav");
  if (b && n) {
    const t = o => { b.classList.toggle("open", o); n.classList.toggle("open", o); b.setAttribute("aria-expanded", o); document.body.style.overflow = o ? "hidden" : "" };
    b.onclick = () => t(!n.classList.contains("open")); n.querySelectorAll("a").forEach(a => a.onclick = () => t(false));
  }
  // cookies
  const ck = document.getElementById("cookie");
  if (ck) {
    if (!localStorage.getItem("ths_cookies")) setTimeout(() => ck.classList.add("show"), 700);
    ck.querySelectorAll("button").forEach(x => x.onclick = () => { localStorage.setItem("ths_cookies", x.dataset.c); ck.classList.remove("show") });
  }
  // slideshow
  const sl = [...document.querySelectorAll(".slide")];
  if (sl.length > 1) { let i = Math.max(0, sl.findIndex(s => s.classList.contains("active"))); setInterval(() => { sl[i].classList.remove("active"); i = (i + 1) % sl.length; sl[i].classList.add("active") }, 5500); }
  // reveal
  const io = new IntersectionObserver(e => e.forEach(x => { if (x.isIntersecting) { x.target.classList.add("in"); io.unobserve(x.target) } }), { threshold: .12 });
  document.querySelectorAll(".rv").forEach(el => io.observe(el));
  // formulário
  const f = document.getElementById("contact-form");
  if (f) f.addEventListener("submit", async e => {
    e.preventDefault(); if (f.website.value) return;
    const m = document.getElementById("form-msg"), btn = f.querySelector("button"); btn.disabled = true;
    try {
      const r = await fetch(f.action, { method: f.method, headers: { "Accept": "application/json" }, body: new FormData(f) });
      if (!r.ok) throw 0; m.textContent = "Mensagem enviada! Responderemos em breve."; f.reset()
    }
    catch { m.innerHTML = "Erro ao enviar. Escreva-nos diretamente para <a href='mailto:" + T.email + "'>" + T.email + "</a>." }
    m.style.display = "block"; btn.disabled = false
  });
})();
