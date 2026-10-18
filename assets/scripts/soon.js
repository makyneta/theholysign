/* PÁGINA "EM BREVE" — /assets/scripts/em-breve.js
   Independente: contagem decrescente (opcional), aparecer ao fazer scroll e formulário de contacto. */
(() => {
  // ano no rodapé
  document.querySelectorAll("[data-year]").forEach(s => s.textContent = new Date().getFullYear());

  // contagem decrescente — só aparece se data-launch tiver uma data futura válida
  const cd = document.getElementById("soon-count");
  if (cd) {
    const target = new Date(cd.dataset.launch || "");
    if (!isNaN(target) && target > new Date()) {
      const u = k => cd.querySelector(`[data-unit="${k}"]`);
      const pad = n => String(n).padStart(2, "0");
      const tick = () => {
        const diff = Math.max(0, target - new Date());
        u("d").textContent = pad(Math.floor(diff / 864e5));
        u("h").textContent = pad(Math.floor(diff / 36e5) % 24);
        u("m").textContent = pad(Math.floor(diff / 6e4) % 60);
        u("s").textContent = pad(Math.floor(diff / 1e3) % 60);
        if (!diff) { clearInterval(timer); cd.hidden = true }
      };
      const timer = setInterval(tick, 1000); tick(); cd.hidden = false;
    }
  }

  // aparecer ao fazer scroll
  const rv = document.querySelectorAll(".rv");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target) } }), { threshold: .12 });
    rv.forEach(el => io.observe(el));
  } else rv.forEach(el => el.classList.add("in"));

  // formulário de contacto
  const f = document.getElementById("contact-form");
  if (f) f.addEventListener("submit", async e => {
    e.preventDefault();
    if (f.website.value) return;                       // campo-armadilha para robôs
    const m = document.getElementById("form-msg"), btn = f.querySelector("button");
    btn.disabled = true;
    try {
      const r = await fetch(f.action, { method: f.method, headers: { Accept: "application/json" }, body: new FormData(f) });
      if (!r.ok) throw 0;
      m.textContent = "Mensagem enviada! Responderemos em breve."; f.reset();
    } catch {
      const mail = document.querySelector(".contact-info a[href^='mailto:']");
      m.innerHTML = "Erro ao enviar." + (mail ? " Escreva-nos diretamente para <a href='" + mail.getAttribute("href") + "'>" + mail.textContent.trim() + "</a>." : "");
    }
    m.style.display = "block"; btn.disabled = false;
  });
})();