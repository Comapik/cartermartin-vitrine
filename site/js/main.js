/* Carter & Martin — menu mobile, en-tête, navigation entre œuvres, formulaire de contact. */
(() => {
  "use strict";

  const body = document.body;
  const header = document.getElementById("site-header");
  const menu = document.getElementById("mobile-menu");
  const toggle = header && header.querySelector(".menu-toggle");

  /* ── Menu mobile ────────────────────────────────── */

  const isMenuOpen = () => body.classList.contains("menu-open");

  function setMenu(open) {
    if (!toggle || !menu) return;
    body.classList.toggle("menu-open", open);
    menu.inert = !open;
    menu.setAttribute("aria-hidden", String(!open));
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? toggle.dataset.labelClose : toggle.dataset.labelOpen);
  }

  if (toggle && menu) {
    toggle.addEventListener("click", () => setMenu(!isMenuOpen()));
    menu.addEventListener("click", (e) => { if (e.target.closest("a")) setMenu(false); });
    window.matchMedia("(min-width: 861px)").addEventListener("change", (e) => { if (e.matches) setMenu(false); });
    // Retour arrière depuis le cache du navigateur : menu refermé
    window.addEventListener("pageshow", (e) => { if (e.persisted) setMenu(false); });
  }

  /* ── Clavier ────────────────────────────────────── */

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && isMenuOpen()) {
      setMenu(false);
      toggle.focus();
      return;
    }
    // Flèches ← → : œuvre précédente / suivante
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
    if (e.altKey || e.metaKey || e.ctrlKey || e.shiftKey) return;
    if (e.target.closest("input, textarea, select, [contenteditable]")) return;
    const link = document.querySelector(e.key === "ArrowLeft" ? '.pager [rel="prev"]' : '.pager [rel="next"]');
    if (link) window.location.href = link.href;
  });

  /* ── En-tête au défilement ──────────────────────── */

  if (header) {
    const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ── Formulaire de contact ──────────────────────── */

  const form = document.getElementById("formulaire");
  if (!form) return;

  const noticeOk = form.querySelector(".notice--ok");
  const noticeError = form.querySelector(".notice--error");
  const submit = form.querySelector('button[type="submit"]');
  const message = form.querySelector('textarea[name="message"]');
  const params = new URLSearchParams(window.location.search);

  function showNotice(el, text) {
    noticeOk.hidden = true;
    noticeError.hidden = true;
    if (text) el.textContent = text;
    el.hidden = false;
  }

  function errorText(code) {
    const key = code ? "msg" + code.charAt(0).toUpperCase() + code.slice(1) : "";
    return noticeError.dataset[key] || noticeError.dataset.msgDefault;
  }

  // Lien « Nous écrire à propos de cette œuvre » : message pré-rempli
  let works = {};
  try { works = JSON.parse(form.dataset.works || "{}"); } catch (e) { /* ignoré */ }
  const workId = params.get("oeuvre") || params.get("work");
  if (workId && Object.prototype.hasOwnProperty.call(works, workId) && !message.value) {
    message.value = message.dataset.prefill.replace("{title}", works[workId]);
  }

  // Retour de contact.php sans JavaScript (redirection)
  const status = params.get("statut") || params.get("status");
  if (status === "ok") showNotice(noticeOk);
  else if (status) showNotice(noticeError, errorText(status === "erreur" || status === "error" ? "" : status));

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (submit.disabled) return;

    submit.disabled = true;
    form.setAttribute("aria-busy", "true");
    noticeOk.hidden = true;
    noticeError.hidden = true;

    try {
      const res = await fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" },
        credentials: "same-origin"
      });
      let data = {};
      try { data = await res.json(); } catch (err) { /* réponse non JSON */ }

      if (res.ok && data.ok) {
        form.reset();
        showNotice(noticeOk);
      } else {
        showNotice(noticeError, errorText(data.code));
      }
    } catch (err) {
      showNotice(noticeError, errorText());
    } finally {
      submit.disabled = false;
      form.removeAttribute("aria-busy");
    }
  });
})();
