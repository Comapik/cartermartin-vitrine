#!/usr/bin/env node
/*
 * Générateur du site statique Carter & Martin.
 *
 *   node generateur/build.js
 *
 * Lit les contenus de generateur/data.js et écrit une page HTML par page dans site/ :
 *   FR à la racine (index.html, serie.html, oeuvres/…, a-propos.html, contact.html)
 *   EN dans en/    (index.html, series.html, works/…, about.html, contact.html)
 * Les CSS, JS, images et contact.php de site/ ne sont pas modifiés.
 */
"use strict";

const fs = require("fs");
const path = require("path");
const D = require("./data.js");

const OUT = path.resolve(__dirname, "../site");

// URL publique du site, sans « / » final (ex. "https://www.carter-martin.fr").
// Une fois renseignée : balises canonical / hreflang, image Open Graph et sitemap.xml.
const SITE_URL = "";

const PATHS = {
  fr: { home: "index.html", series: "serie.html", about: "a-propos.html", contact: "contact.html", work: (id) => `oeuvres/${id}.html` },
  en: { home: "en/index.html", series: "en/series.html", about: "en/about.html", contact: "en/contact.html", work: (id) => `en/works/${id}.html` }
};
const OTHER = { fr: "en", en: "fr" };
const LOCALE = { fr: "fr_FR", en: "en_GB" };

const ESC = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ESC[c]);

const absUrl = (p) => SITE_URL + "/" + p.replace(/(^|\/)index\.html$/, "$1");

/* ── Fragments partagés ─────────────────────────────── */

function navLinks(ctx, cls) {
  const { t, P, page } = ctx;
  const current = page.key === "work" ? "series" : page.key;
  const items = [["series", P.series, t.nav.series], ["about", P.about, t.nav.about], ["contact", P.contact, t.nav.contact]];
  return items.map(([key, p, label], i) => {
    const num = cls === "mobile-menu__link" ? `<span class="mobile-menu__num">0${i + 1}</span>` : "";
    const cur = current === key ? ' aria-current="page"' : "";
    return `<a class="${cls}" href="${ctx.url(p)}"${cur}>${num}${esc(label)}</a>`;
  }).join("\n        ");
}

function langSwitch(ctx, extraCls) {
  const { page } = ctx;
  const hrefs = { [page.lang]: ctx.url(page.path), [OTHER[page.lang]]: ctx.url(page.alt) };
  const links = ["fr", "en"].map((l) =>
    `<a class="lang__btn" href="${hrefs[l]}" hreflang="${l}" lang="${l}"${l === page.lang ? ' aria-current="true"' : ""}>${l.toUpperCase()}</a>`
  );
  return `<div class="lang${extraCls ? " " + extraCls : ""}" role="group" aria-label="${esc(ctx.t.langLabel)}">
          ${links.join('\n          <span class="lang__sep" aria-hidden="true">/</span>\n          ')}
        </div>`;
}

function showBand(ctx, modifier) {
  const s = D.show[ctx.lang];
  return `
    <section class="show${modifier ? " " + modifier : ""}" aria-label="${esc(s.eyebrow)}">
      <div class="container">
        <div class="show__box">
          <div class="show__row">
            <span class="eyebrow">${esc(s.eyebrow)}</span>
            <span class="show__name">${esc(s.name)}</span>
            <span class="show__dates">${esc(s.dates)}</span>
          </div>
          <div class="show__meta">
            <span class="show__place">${esc(s.place)}</span>
            <span class="show__nocturne">${esc(s.nocturne)}</span>
          </div>
        </div>
      </div>
    </section>`;
}

const seriesMeta = (ctx) => `${D.series.works.length} ${ctx.t.series.count} · ${D.series.year}`;

const workCard = (ctx, w) => `
        <a class="work-card" href="${ctx.url(ctx.P.work(w.id))}">
          <div class="work-card__frame">
            <img class="work-card__img" src="${ctx.url(w.img)}" alt="${esc(w.title[ctx.lang])}" width="${w.w}" height="${w.h}" loading="lazy" decoding="async">
          </div>
          <div class="work-card__caption">
            <h3 class="work-card__title">${esc(w.title[ctx.lang])}</h3>
            <span class="work-card__year">${D.series.year}</span>
          </div>
        </a>`;

const findWork = (id) => D.series.works.find((w) => w.id === id);

/* ── Pages ──────────────────────────────────────────── */

function pageHome(ctx) {
  const { t, lang } = ctx;
  return {
    title: t.siteTitle,
    description: t.homeDescription,
    image: "images/gamin-route.webp",
    body: `
    <section class="hero">
      <img class="cover cover--hero" src="${ctx.url("images/gamin-route.webp")}" alt="" width="1500" height="1193" fetchpriority="high">
      <div class="shade shade--hero"></div>
      <div class="hero__content">
        <div class="hero__text">
          <p class="eyebrow hero__eyebrow">${esc(t.home.eyebrow)}</p>
          <h1 class="hero__title">${esc(t.home.heroTitle)}</h1>
          <p class="hero__sub">${esc(t.home.heroSub)}</p>
        </div>
        <a class="cta" href="${ctx.url(ctx.P.series)}">
          <span class="cta__label">${esc(t.home.heroCta)}</span>
          <span class="cta__arrow" aria-hidden="true">→</span>
        </a>
      </div>
    </section>
${showBand(ctx)}

    <section class="container intro">
      <p class="intro__quote">${esc(t.home.statement)}</p>
      <div class="intro__body">
        <p class="text">${esc(t.home.intro1)}</p>
        <p class="text">${esc(t.home.intro2)}</p>
        <a class="link-line" href="${ctx.url(ctx.P.about)}">${esc(t.home.aboutLink)}</a>
      </div>
    </section>

    <section class="works works--home">
      <div class="works-head works-head--bleed">
        <h2 class="works-head__title">${esc(D.series.title)}</h2>
        <span class="meta-label">${esc(seriesMeta(ctx))}</span>
      </div>
      <div class="container container--wide">
        <div class="works-grid">${D.series.works.map((w) => workCard(ctx, w)).join("")}
        </div>
      </div>
    </section>`
  };
}

function pageSeries(ctx) {
  const { t, lang } = ctx;
  return {
    title: `${D.series.title} — Carter & Martin`,
    description: D.series.desc[lang],
    image: "images/aubergiste.webp",
    body: `
    <section class="page-hero">
      <img class="cover cover--series" src="${ctx.url("images/aubergiste.webp")}" alt="" width="1500" height="1133" fetchpriority="high">
      <div class="shade shade--page"></div>
      <div class="page-hero__content">
        <p class="eyebrow">${esc(t.series.eyebrow)}</p>
        <h1 class="page-hero__title">${esc(D.series.title)}</h1>
        <p class="page-hero__desc">${esc(D.series.desc[lang])}</p>
      </div>
    </section>
${showBand(ctx, "show--compact")}

    <section class="container container--wide works works--series">
      <div class="works-head">
        <h2 class="works-head__label">${esc(t.series.works)}</h2>
        <span class="meta-label">${esc(seriesMeta(ctx))}</span>
      </div>
      <div class="works-grid">${D.series.works.map((w) => workCard(ctx, w)).join("")}
      </div>
    </section>`
  };
}

function pageWork(ctx) {
  const { t, lang, P } = ctx;
  const w = ctx.page.work;
  const works = D.series.works;
  const i = works.indexOf(w);
  const prev = works[(i - 1 + works.length) % works.length];
  const next = works[(i + 1) % works.length];
  const specs = [
    [t.specKeys.medium, t.specVals.medium],
    [t.specKeys.signature, t.specVals.signature],
    [t.specKeys.studio, t.specVals.studio],
    [t.specKeys.place, w.place[lang]]
  ];

  return {
    title: `${w.title[lang]} — Carter & Martin`,
    description: w.story[lang],
    image: w.img,
    body: `
    <article class="work">
      <div class="work__media">
        <img class="work__img" src="${ctx.url(w.img)}" alt="${esc(w.title[lang])}" width="${w.w}" height="${w.h}" fetchpriority="high">
      </div>
      <div class="work__info">
        <a class="back" href="${ctx.url(P.series)}"><span aria-hidden="true">←</span> ${esc(D.series.title)}</a>
        <h1 class="work__title">${esc(w.title[lang])}</h1>
        <p class="work__meta">${esc(D.series.title)} · ${D.series.year} · ${esc(w.place[lang])}</p>
        <p class="text work__story">${esc(w.story[lang])}</p>
        <a class="link-line work__enquire" href="${ctx.url(P.contact)}?${t.work.param}=${w.id}#formulaire">${esc(t.work.enquire)}</a>
        <dl class="specs">
          ${specs.map(([k, v]) => `<div class="spec"><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join("\n          ")}
        </dl>
        <nav class="pager" aria-label="${esc(t.work.pager)}">
          <a class="pager__link" href="${ctx.url(P.work(prev.id))}" rel="prev">
            <span class="pager__dir"><span aria-hidden="true">←</span> ${esc(t.work.prev)}</span>
            <span class="pager__title">${esc(prev.title[lang])}</span>
          </a>
          <a class="pager__link pager__link--next" href="${ctx.url(P.work(next.id))}" rel="next">
            <span class="pager__dir">${esc(t.work.next)} <span aria-hidden="true">→</span></span>
            <span class="pager__title">${esc(next.title[lang])}</span>
          </a>
        </nav>
      </div>
    </article>`
  };
}

function pageAbout(ctx) {
  const { t, lang } = ctx;
  return {
    title: `${t.nav.about} — Carter & Martin`,
    description: t.about.lead,
    image: "images/joueur.webp",
    body: `
    <section class="about-hero">
      <div class="about-hero__text">
        <p class="eyebrow">${esc(t.about.eyebrow)}</p>
        <h1 class="about-hero__title">${esc(t.about.title)}</h1>
        <p class="about-hero__lead">${esc(t.about.lead)}</p>
        <p class="text text--long">${esc(t.about.p1)}</p>
        <p class="text text--long">${esc(t.about.p2)}</p>
      </div>
      <div class="about-hero__media">
        <img class="cover" src="${ctx.url("images/joueur.webp")}" alt="${esc(findWork("tricheur").title[lang])}" width="1200" height="1500">
        <div class="shade shade--side"></div>
      </div>
    </section>

    <section class="container authors">${D.authors.map((a) => `
      <div class="author">
        <h2 class="author__name">${esc(a.name)}</h2>
        <p class="eyebrow author__role">${esc(a.role[lang])}</p>
        <p class="text author__bio">${esc(a.bio[lang])}</p>
      </div>`).join("")}
    </section>

    <section class="quote-band">
      <img class="cover" src="${ctx.url("images/cimetiere-innocents.webp")}" alt="" width="1500" height="1205" loading="lazy">
      <div class="shade shade--quote"></div>
      <blockquote class="quote-band__text">${esc(t.about.quote)}</blockquote>
    </section>

    <section class="container exhibitions">
      <h2 class="exhibitions__title">${esc(t.about.exhibTitle)}</h2>
      <ul class="exhibitions__list">${D.exhibitions.map((e) => `
        <li class="exhib">
          <span class="exhib__year">${esc(e.year)}</span>
          <span class="exhib__name">${esc(e.name[lang])}</span>
          <span class="exhib__place">${esc(e.place[lang])}</span>
        </li>`).join("")}
      </ul>
    </section>`
  };
}

function pageContact(ctx) {
  const { t, lang } = ctx;
  const c = t.contact;
  const worksMap = Object.fromEntries(D.series.works.map((w) => [w.id, w.title[lang]]));
  const blocks = [
    [t.contactBlocks.studio, esc(D.studio.city)],
    [t.contactBlocks.appointment, esc(t.contactBlocks.hours)],
    [lang === "en" ? "Phone" : "Téléphone", `<a href="tel:${D.studio.phoneHref}">${esc(D.studio.phone[lang])}</a>`],
    ["Email", `<a href="mailto:${D.studio.email}">${esc(D.studio.email)}</a>`]
  ];

  return {
    title: `${t.nav.contact} — Carter & Martin`,
    description: c.intro,
    image: "images/penitente.webp",
    body: `
    <div class="contact">
      <div class="contact__media">
        <img class="cover" src="${ctx.url("images/penitente.webp")}" alt="${esc(findWork("penitente").title[lang])}" width="1244" height="1500" fetchpriority="high">
        <div class="shade shade--contact"></div>
        <p class="contact__caption">${esc(c.imageCaption)}</p>
      </div>

      <section class="contact__panel">
        <p class="eyebrow">${esc(c.eyebrow)}</p>
        <h1 class="contact__title">${esc(c.title)}</h1>
        <p class="text contact__intro">${esc(c.intro)}</p>

        <form class="form" id="formulaire" action="${ctx.url("contact.php")}" method="post" data-works="${esc(JSON.stringify(worksMap))}">
          <input type="hidden" name="lang" value="${lang}">
          <div class="form__hp" aria-hidden="true">
            <label>${esc(c.honeypot)} <input type="text" name="website" tabindex="-1" autocomplete="off"></label>
          </div>
          <div class="form__row">
            <label class="field">
              <span class="field__label">${esc(c.name)}</span>
              <input class="field__input" type="text" name="name" autocomplete="name" maxlength="120" required>
            </label>
            <label class="field">
              <span class="field__label">${esc(c.email)}</span>
              <input class="field__input" type="email" name="email" autocomplete="email" maxlength="254" required>
            </label>
          </div>
          <label class="field">
            <span class="field__label">${esc(c.subject)}</span>
            <span class="field__select">
              <select class="field__input" name="subject">
                ${t.subjects.map((s, i) => `<option value="${D.subjectKeys[i]}">${esc(s)}</option>`).join("\n                ")}
              </select>
            </span>
          </label>
          <label class="field">
            <span class="field__label">${esc(c.message)}</span>
            <textarea class="field__input" name="message" rows="5" maxlength="5000" required data-prefill="${esc(c.prefill)}"></textarea>
          </label>
          <div class="form__actions">
            <button type="submit" class="btn">${esc(c.send)}</button>
          </div>
          <p class="notice notice--ok" role="status" hidden>${esc(c.sent)}</p>
          <p class="notice notice--error" role="alert" hidden
             data-msg-default="${esc(c.error)}" data-msg-invalid="${esc(c.invalid)}" data-msg-throttle="${esc(c.throttle)}">${esc(c.error)}</p>
        </form>

        <dl class="contact-blocks">
          ${blocks.map(([k, v]) => `<div class="contact-block"><dt>${esc(k)}</dt><dd>${v}</dd></div>`).join("\n          ")}
        </dl>
      </section>
    </div>`
  };
}

/* ── Gabarit ────────────────────────────────────────── */

function layout(ctx, content) {
  const { t, lang, page } = ctx;
  const seo = SITE_URL ? `
<link rel="canonical" href="${absUrl(page.path)}">
<link rel="alternate" hreflang="${lang}" href="${absUrl(page.path)}">
<link rel="alternate" hreflang="${OTHER[lang]}" href="${absUrl(page.alt)}">
<link rel="alternate" hreflang="x-default" href="${absUrl(lang === "fr" ? page.path : page.alt)}">
<meta property="og:url" content="${absUrl(page.path)}">
<meta property="og:image" content="${SITE_URL}/${content.image}">` : "";

  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(content.title)}</title>
<meta name="description" content="${esc(content.description)}">
<meta name="theme-color" content="#17120d">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Carter &amp; Martin">
<meta property="og:locale" content="${LOCALE[lang]}">
<meta property="og:title" content="${esc(content.title)}">
<meta property="og:description" content="${esc(content.description)}">${seo}
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' fill='%2317120d'/%3E%3Cpath d='M16 6c3 4 4 7 0 12-4-5-3-8 0-12z' fill='%23e8b877'/%3E%3Crect x='14' y='19' width='4' height='8' fill='%23f3e9db'/%3E%3C/svg%3E">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Jost:wght@300;400;500&display=swap" rel="stylesheet">
<link rel="stylesheet" href="${ctx.url("css/styles.css")}">
<script src="${ctx.url("js/main.js")}" defer></script>
</head>
<body>
<a class="skip-link" href="#main">${esc(t.skip)}</a>

<header class="site-header" id="site-header">
  <a class="brand" href="${ctx.url(ctx.P.home)}">
    <span class="brand__name">Carter &amp; Martin</span>
    <span class="brand__tag">${esc(t.tagShort)}</span>
  </a>
  <nav class="nav" aria-label="${esc(t.nav.label)}">
        ${navLinks(ctx, "nav__link")}
        ${langSwitch(ctx)}
  </nav>
  <button type="button" class="menu-toggle" aria-controls="mobile-menu" aria-expanded="false"
    aria-label="${esc(t.nav.open)}" data-label-open="${esc(t.nav.open)}" data-label-close="${esc(t.nav.close)}">
    <span></span><span></span>
  </button>
</header>

<div class="mobile-menu" id="mobile-menu" aria-hidden="true" inert>
  <nav class="mobile-menu__links" aria-label="${esc(t.nav.label)}">
        ${navLinks(ctx, "mobile-menu__link")}
  </nav>
  <div class="mobile-menu__foot">
    <div class="mobile-menu__contact">
      <a href="tel:${D.studio.phoneHref}">${esc(D.studio.phone[lang])}</a>
      <a href="mailto:${D.studio.email}">${esc(D.studio.email)}</a>
      <span>${esc(D.studio.city)}</span>
    </div>
        ${langSwitch(ctx, "lang--menu")}
  </div>
</div>

<main id="main" tabindex="-1">
  <div class="page page--${page.key}">${content.body}
  </div>
</main>

<footer class="site-footer">
  <div class="footer__grid">
    <div class="footer__brand">
      <p class="footer__name">Carter &amp; Martin</p>
      <p class="footer__blurb">${esc(t.footer.blurb)}</p>
    </div>
    <nav class="footer__col" aria-label="${esc(t.footer.navTitle)}">
      <p class="footer__title">${esc(t.footer.navTitle)}</p>
      <a class="footer__link" href="${ctx.url(ctx.P.series)}">${esc(t.nav.series)}</a>
      <a class="footer__link" href="${ctx.url(ctx.P.about)}">${esc(t.nav.about)}</a>
      <a class="footer__link" href="${ctx.url(ctx.P.contact)}">${esc(t.nav.contact)}</a>
    </nav>
    <div class="footer__col footer__col--studio">
      <p class="footer__title">${esc(t.footer.studioTitle)}</p>
      <span>${esc(D.studio.city)}</span>
      <a class="footer__link" href="mailto:${D.studio.email}">${esc(D.studio.email)}</a>
      <a class="footer__link" href="tel:${D.studio.phoneHref}">${esc(D.studio.phone[lang])}</a>
    </div>
  </div>
  <div class="footer__bottom">
    <span>© 2026 Linaupe Carter &amp; Allan Martin</span>
    <span>${esc(t.footer.legal)}</span>
  </div>
</footer>
</body>
</html>
`;
}

/* ── Construction ───────────────────────────────────── */

const PAGES = [];
for (const lang of ["fr", "en"]) {
  const P = PATHS[lang];
  const A = PATHS[OTHER[lang]];
  PAGES.push({ lang, key: "home", path: P.home, alt: A.home, render: pageHome });
  PAGES.push({ lang, key: "series", path: P.series, alt: A.series, render: pageSeries });
  for (const w of D.series.works) {
    PAGES.push({ lang, key: "work", work: w, path: P.work(w.id), alt: A.work(w.id), render: pageWork });
  }
  PAGES.push({ lang, key: "about", path: P.about, alt: A.about, render: pageAbout });
  PAGES.push({ lang, key: "contact", path: P.contact, alt: A.contact, render: pageContact });
}

for (const page of PAGES) {
  const root = "../".repeat(page.path.split("/").length - 1);
  const ctx = { lang: page.lang, t: D.t[page.lang], P: PATHS[page.lang], page, url: (p) => root + p };
  const file = path.join(OUT, page.path);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, layout(ctx, page.render(ctx)));
}

if (SITE_URL) {
  const urls = PAGES.map((p) => `  <url><loc>${absUrl(p.path)}</loc></url>`).join("\n");
  fs.writeFileSync(path.join(OUT, "sitemap.xml"),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`);
}

console.log(`${PAGES.length} pages générées dans ${path.relative(process.cwd(), OUT) || "."}`);
