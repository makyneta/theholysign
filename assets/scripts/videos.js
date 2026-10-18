/* PÁGINA VÍDEOS — /assets/scripts/videos.js
   Miniaturas e títulos vêm automaticamente do YouTube; ao clicar abre o vídeo num popup. */
(() => {
  /* ===== LISTA DE VÍDEOS =====
     Cola o link do YouTube (ou só o ID de 11 caracteres).
     O título é opcional: se não o escreveres, é buscado ao YouTube. */
  const VIDEOS = [
    // "https://www.youtube.com/watch?v=XXXXXXXXXXX",
    // "https://youtu.be/XXXXXXXXXXX",
    // { url: "https://www.youtube.com/watch?v=XXXXXXXXXXX", title: "Título à tua escolha" },
  ];

  const grid = document.getElementById("videos-grid");
  const empty = document.getElementById("videos-empty");
  const dlg = document.getElementById("video-dialog");
  const frame = document.getElementById("video-frame");
  const closeBtn = document.getElementById("video-close");
  if (!grid || !dlg) return;

  const getId = s => {
    s = String(s || "").trim();
    const m = s.match(/(?:v=|youtu\.be\/|embed\/|shorts\/|live\/)([\w-]{11})/) || s.match(/^([\w-]{11})$/);
    return m ? m[1] : null;
  };
  const items = VIDEOS.map(v => typeof v === "string" ? { url: v } : v)
    .map(v => ({ id: getId(v.url), title: v.title || "" })).filter(v => v.id);

  empty.hidden = items.length > 0;

  // ---- cartões ----
  items.forEach(v => {
    const card = document.createElement("button");
    card.type = "button"; card.className = "video-card";

    const thumb = document.createElement("span"); thumb.className = "video-thumb";
    const img = document.createElement("img");
    img.loading = "lazy"; img.alt = v.title; img.decoding = "async";
    let fell = false;
    const fallback = () => { if (!fell) { fell = true; img.src = `https://i.ytimg.com/vi/${v.id}/hqdefault.jpg` } };
    img.onerror = fallback;
    img.onload = () => { if (img.naturalWidth < 200) fallback() };   // o YouTube devolve 120×90 quando não existe maxres
    img.src = `https://i.ytimg.com/vi/${v.id}/maxresdefault.jpg`;
    const play = document.createElement("span"); play.className = "video-play"; play.setAttribute("aria-hidden", "true");
    thumb.append(img, play);

    const title = document.createElement("span"); title.className = "video-title"; title.textContent = v.title;
    card.append(thumb, title);
    card.addEventListener("click", () => open(v, card));
    grid.append(card);

    // título automático (oEmbed do YouTube)
    if (!v.title) {
      fetch("https://www.youtube.com/oembed?format=json&url=" + encodeURIComponent("https://www.youtube.com/watch?v=" + v.id))
        .then(r => r.ok ? r.json() : Promise.reject())
        .then(d => { v.title = d.title || ""; title.textContent = v.title; img.alt = v.title })
        .catch(() => {});
    }
  });

  // ---- popup ----
  let lastFocus = null;
  function open(v, from) {
    lastFocus = from;
    const f = document.createElement("iframe");
    f.src = `https://www.youtube-nocookie.com/embed/${v.id}?autoplay=1&rel=0&modestbranding=1`;
    f.title = v.title || "Vídeo";
    f.allow = "autoplay; encrypted-media; picture-in-picture; fullscreen";
    f.allowFullscreen = true;
    frame.replaceChildren(f);
    dlg.setAttribute("aria-label", v.title || "Vídeo");
    document.body.style.overflow = "hidden";
    dlg.showModal();
  }
  dlg.addEventListener("close", () => {          // remove o iframe para parar o vídeo
    frame.replaceChildren();
    document.body.style.overflow = "";
    if (lastFocus) lastFocus.focus();
  });
  closeBtn.addEventListener("click", () => dlg.close());
  dlg.addEventListener("click", e => { if (e.target === dlg) dlg.close() });   // clicar fora fecha
})();