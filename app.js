/* =========================================================================
   TURABO SELF — app.js
   Site de présentation, même mécanique que le site Campus Rosa Parks :
   - une page visible à la fois, navigation par #ancres (hashchange)
   - contenu décrit en données (CONTENT) puis rendu en composants :
     héro, chiffres clés, cartes, rôles, chronologie, bandeau d'appel…
   - FR / EN
   Pour modifier un texte : éditez l'objet CONTENT plus bas.
   ========================================================================= */

(function () {
  "use strict";

  /* ----------------------------------------------------------------------
     0. Réglages
     ---------------------------------------------------------------------- */

  const APP_URL = "https://self.campus-rosaparks.fr/";   // lien « Ouvrir l'application »
  const LANG_KEY = "turabo-lang";
  const GALLERY_IMAGES = [                                // captures d'écran à déposer dans /img
    "img/capture-1.png", "img/capture-2.png", "img/capture-3.png",
    "img/capture-4.png", "img/capture-5.png", "img/capture-6.png"
  ];

  /* ----------------------------------------------------------------------
     1. Icônes (jeu unique, traits fins, réutilisées partout)
     ---------------------------------------------------------------------- */

  const svg = (inner, sw) => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="' + (sw || 1.8) + '" stroke-linecap="round" stroke-linejoin="round">' + inner + '</svg>';

  const ICONS = {
    tray:     svg('<path d="M3 13h4.5l2 3h5l2-3H21"/><path d="M5.5 5h13l2.5 8v6a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-6L5.5 5Z"/>'),
    bell:     svg('<path d="M6 9a6 6 0 0 1 12 0c0 6 2.5 7.5 2.5 7.5h-17S6 15 6 9Z"/><path d="M10 20a2.2 2.2 0 0 0 4 0"/>'),
    wallet:   svg('<path d="M4 8a2 2 0 0 1 2-2h12v3"/><rect x="3" y="8" width="18" height="12" rx="2"/><path d="M16.5 14h2"/>'),
    cap:      svg('<path d="M2 9 12 4l10 5-10 5-10-5Z"/><path d="M6 11.5V17c0 1.4 2.7 3 6 3s6-1.6 6-3v-5.5"/><path d="M22 9v6"/>'),
    chef:     svg('<path d="M7 14v5.5h10V14"/><path d="M7 14a3.6 3.6 0 0 1-.6-7.1A4 4 0 0 1 12 4.2a4 4 0 0 1 5.6 2.7A3.6 3.6 0 0 1 17 14"/><path d="M7 17h10"/>'),
    stock:    svg('<path d="M3.5 7.5 12 3l8.5 4.5v9L12 21l-8.5-4.5v-9Z"/><path d="M3.5 7.5 12 12l8.5-4.5M12 12v9"/>'),
    shield:   svg('<path d="M12 3 4.5 6v6c0 5 3.4 8.3 7.5 9 4.1-.7 7.5-4 7.5-9V6L12 3Z"/><path d="m9 12 2 2 4-4"/>'),
    star:     svg('<path d="m12 3 2.6 5.9 6.4.6-4.8 4.3 1.4 6.3L12 17l-5.6 3.1 1.4-6.3-4.8-4.3 6.4-.6L12 3Z"/>'),
    grid:     svg('<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>'),
    bolt:     svg('<path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z"/>'),
    image:    svg('<rect x="3.5" y="4.5" width="17" height="15" rx="2"/><circle cx="9" cy="10" r="1.8"/><path d="m4 17 5-4.5 4 3.5 3-2.5 4.5 3.5"/>'),
    plus:     svg('<path d="M12 5v14M5 12h14"/>', 2),
    extLink:  svg('<path d="M7 17 17 7M9 7h8v8"/>', 2.2)
  };

  function birdArt() {
    return `<svg viewBox="0 0 320 320" fill="none" role="img" aria-label="Colibri en vol">
      <circle cx="160" cy="160" r="152" style="stroke:var(--line)" stroke-width="1.5" stroke-dasharray="2 9"/>
      <circle cx="160" cy="160" r="118" style="fill:var(--ink-soft)"/>
      <path class="route-path" d="M40 250 C 100 292, 220 292, 280 250" style="stroke:var(--gold)" stroke-width="3.5" stroke-linecap="round"/>
      <circle cx="40" cy="250" r="5" style="fill:var(--gold)"/>
      <circle cx="280" cy="250" r="5" style="fill:var(--gold)"/>
      <path d="M202 200 L252 244 L230 250 L190 214 Z" style="fill:var(--brick)"/>
      <path d="M132 168 C 146 136, 196 136, 214 170 C 222 190, 198 214, 168 212 C 144 210, 126 190, 132 168 Z" style="fill:var(--paper)"/>
      <circle cx="136" cy="164" r="22" style="fill:var(--paper)"/>
      <path d="M176 160 C 176 100, 214 70, 262 62 C 258 108, 226 150, 184 176 Z" style="fill:var(--gold)"/>
      <path d="M170 156 C 168 112, 190 92, 214 84 C 206 116, 192 140, 176 164 Z" style="fill:var(--gold-dark)"/>
      <path d="M116 158 L58 134 L118 176 Z" style="fill:var(--gold)"/>
      <path d="M122 172 C 130 186, 146 190, 156 184 C 146 178, 132 174, 122 172 Z" style="fill:var(--brick)"/>
      <circle cx="130" cy="160" r="4" style="fill:var(--ink)"/>
    </svg>`;
  }

  /* ----------------------------------------------------------------------
     2. Contenu (FR / EN)
     ---------------------------------------------------------------------- */

  const CONTENT = {
    fr: {
      htmlLang: "fr",
      title: "Turabo Self — la cantine du campus, en ligne",
      tagline: "Cantine du campus",
      openApp: "Ouvrir l'application",
      footer: {
        text: "Turabo Self, l'application de cantine du campus : commander, suivre son solde et voir le stock en direct, sans attente.",
        navTitle: "Navigation",
        appTitle: "Application",
        appLinks: ["Ouvrir Turabo Self"],
        note: "Site de présentation de l'application"
      },
      gallery: { missing: "Ajoutez votre capture ici :", close: "Fermer" },
      pages: [
        { slug: "accueil", label: "Accueil", blocks: [
          { type: "hero",
            kicker: "La cantine du campus, en ligne",
            title1: "Commandez votre repas,",
            title2: "sans faire la queue.",
            text: "Turabo Self permet aux élèves de composer leur plateau, de suivre leur solde et de voir en direct ce qui reste au menu — depuis leur téléphone, avec leur compte Discord.",
            cta1: { label: "Ouvrir l'application", href: APP_URL, external: true },
            cta2: { label: "Découvrir le fonctionnement", href: "#fonctionnement" } },
          { type: "stats", items: [
            { value: "Discord",    label: "connexion en un clic" },
            { value: "Temps réel", label: "stock et ruptures visibles" },
            { value: "2",          label: "mini-jeux pour patienter" }
          ]},
          { type: "cards", title: "Trois raisons de l'adopter", subtitle: "", items: [
            { icon: "tray",   title: "Un menu clair, jour par jour", text: "Chaque jour affiche ses plats fixes et ses choix : on compose son plateau en quelques touches." },
            { icon: "bell",   title: "Toujours informé",             text: "Notifications et ruptures de stock signalées : plus de mauvaise surprise au moment de passer au self." },
            { icon: "wallet", title: "Un solde sous contrôle",       text: "Le solde reste visible en permanence en haut de l'application, à côté de votre nom." }
          ]},
          { type: "cta", title: "Prêt à passer au self ?", text: "Connectez-vous avec Discord et commandez votre prochain repas.",
            button: { label: "Ouvrir Turabo Self", href: APP_URL, external: true } }
        ]},

        { slug: "fonctionnement", label: "Fonctionnement", blocks: [
          { type: "timeline", title: "Un repas en quatre étapes", text: "De la connexion au plateau, tout tient en quelques touches.", items: [
            { title: "Se connecter",  text: "Un clic avec son compte Discord, et l'application retrouve le rôle de chacun." },
            { title: "Choisir",       text: "Le menu du jour affiche les plats fixes et les choix encore disponibles." },
            { title: "Commander",     text: "Le repas est réservé et le solde reste visible pendant toute la commande." },
            { title: "Rester informé", text: "Notifications et solde restent à portée de main, sur téléphone comme sur ordinateur." }
          ]},
          { type: "values", title: "Une application, plusieurs rôles", subtitle: "Chacun retrouve les outils qui lui correspondent.", items: [
            { icon: "cap",    title: "Élève",          text: "Compose son plateau, consulte son solde et reçoit les notifications." },
            { icon: "chef",   title: "Cuisine",        text: "Suit les commandes et signale en un geste les ruptures de stock." },
            { icon: "stock",  title: "Gestion",        text: "Tient le stock par catégorie et prépare les menus de la semaine." },
            { icon: "shield", title: "Administration", text: "Supervise les comptes et l'ensemble du service." }
          ]}
        ]},

        { slug: "jeux", label: "Jeux", blocks: [
          { type: "cards", cols: 2, title: "Une pause ludique", subtitle: "Pendant l'attente, l'application propose des mini-jeux intégrés.", items: [
            { icon: "grid", title: "Mémoire",  text: "Retrouvez les paires en un minimum de coups : un classique pour s'occuper quelques minutes." },
            { icon: "bolt", title: "Réflexes", text: "Appuyez au bon moment, le plus vite possible, et battez votre meilleur temps." }
          ]},
          { type: "cta", title: "Envie d'essayer ?", text: "Les jeux se trouvent dans l'application, à côté de la commande.",
            button: { label: "Ouvrir Turabo Self", href: APP_URL, external: true } }
        ]},

        { slug: "galerie", label: "Galerie", blocks: [
          { type: "gallery", title: "L'application en images", subtitle: "Quelques écrans de Turabo Self.",
            captions: ["Connexion", "Menu du jour", "Commande", "Solde", "Stock", "Jeux"] }
        ]},

        { slug: "faq", label: "FAQ", blocks: [
          { type: "faq", title: "Questions fréquentes", subtitle: "L'essentiel pour bien démarrer.", items: [
            { q: "Comment me connecter ?", a: "Avec votre compte Discord : cliquez sur « Ouvrir l'application », puis sur « Se connecter avec Discord »." },
            { q: "Que signifie « rupture » ?", a: "Un élément marqué « rupture » n'est plus disponible pour le moment. Il redevient sélectionnable dès que le stock est réapprovisionné." },
            { q: "Où voir mon solde ?", a: "Il s'affiche en permanence en haut de l'application, à côté de votre nom." },
            { q: "L'application fonctionne-t-elle sur téléphone ?", a: "Oui, l'interface s'adapte aussi bien aux écrans de téléphone qu'aux ordinateurs." },
            { q: "Existe-t-il un mode sombre ?", a: "Oui, un bouton lune / soleil permet de basculer entre le thème clair et le thème sombre." }
          ]}
        ]}
      ]
    },

    en: {
      htmlLang: "en",
      title: "Turabo Self — the campus canteen, online",
      tagline: "Campus canteen",
      openApp: "Open the app",
      footer: {
        text: "Turabo Self, the campus canteen app: order, follow your balance and see live stock, without waiting in line.",
        navTitle: "Navigation",
        appTitle: "Application",
        appLinks: ["Open Turabo Self"],
        note: "Presentation site for the app"
      },
      gallery: { missing: "Add your screenshot here:", close: "Close" },
      pages: [
        { slug: "accueil", label: "Home", blocks: [
          { type: "hero",
            kicker: "The campus canteen, online",
            title1: "Order your meal,",
            title2: "skip the queue.",
            text: "Turabo Self lets students build their tray, follow their balance and see what is left on the menu in real time — from their phone, with their Discord account.",
            cta1: { label: "Open the app", href: APP_URL, external: true },
            cta2: { label: "See how it works", href: "#fonctionnement" } },
          { type: "stats", items: [
            { value: "Discord",   label: "one-click sign-in" },
            { value: "Real time", label: "stock and sold-out items visible" },
            { value: "2",         label: "mini-games while you wait" }
          ]},
          { type: "cards", title: "Three reasons to use it", subtitle: "", items: [
            { icon: "tray",   title: "A clear menu, day by day", text: "Each day shows its fixed dishes and its choices: build your tray in a few taps." },
            { icon: "bell",   title: "Always informed",          text: "Notifications and sold-out items are flagged: no more surprises when you reach the counter." },
            { icon: "wallet", title: "Your balance under control", text: "Your balance stays visible at the top of the app, next to your name." }
          ]},
          { type: "cta", title: "Ready to go self-service?", text: "Sign in with Discord and order your next meal.",
            button: { label: "Open Turabo Self", href: APP_URL, external: true } }
        ]},

        { slug: "fonctionnement", label: "How it works", blocks: [
          { type: "timeline", title: "A meal in four steps", text: "From sign-in to tray, it all fits in a few taps.", items: [
            { title: "Sign in",     text: "One click with your Discord account, and the app finds everyone's role." },
            { title: "Choose",      text: "Today's menu shows the fixed dishes and the choices still available." },
            { title: "Order",       text: "The meal is booked and your balance stays visible throughout the order." },
            { title: "Stay informed", text: "Notifications and balance stay within reach, on phone or computer." }
          ]},
          { type: "values", title: "One app, several roles", subtitle: "Everyone finds the tools that fit them.", items: [
            { icon: "cap",    title: "Student",        text: "Builds a tray, checks the balance and receives notifications." },
            { icon: "chef",   title: "Kitchen",        text: "Follows orders and flags sold-out items in one tap." },
            { icon: "stock",  title: "Management",     text: "Keeps stock by category and prepares the weekly menus." },
            { icon: "shield", title: "Administration", text: "Oversees accounts and the whole service." }
          ]}
        ]},

        { slug: "jeux", label: "Games", blocks: [
          { type: "cards", cols: 2, title: "A playful break", subtitle: "While you wait, the app offers built-in mini-games.", items: [
            { icon: "grid", title: "Memory",    text: "Find the pairs in as few moves as possible: a classic to fill a few minutes." },
            { icon: "bolt", title: "Reflexes",  text: "Tap at the right moment, as fast as you can, and beat your best time." }
          ]},
          { type: "cta", title: "Want to try?", text: "The games live inside the app, next to the ordering screen.",
            button: { label: "Open Turabo Self", href: APP_URL, external: true } }
        ]},

        { slug: "galerie", label: "Gallery", blocks: [
          { type: "gallery", title: "The app in pictures", subtitle: "A few Turabo Self screens.",
            captions: ["Sign-in", "Today's menu", "Order", "Balance", "Stock", "Games"] }
        ]},

        { slug: "faq", label: "FAQ", blocks: [
          { type: "faq", title: "Frequently asked questions", subtitle: "The essentials to get started.", items: [
            { q: "How do I sign in?", a: "With your Discord account: click “Open the app”, then “Sign in with Discord”." },
            { q: "What does “sold out” mean?", a: "An item marked “sold out” is not available right now. It becomes selectable again as soon as stock is replenished." },
            { q: "Where can I see my balance?", a: "It is always displayed at the top of the app, next to your name." },
            { q: "Does the app work on a phone?", a: "Yes, the interface adapts to phone screens as well as computers." },
            { q: "Is there a dark mode?", a: "Yes, a moon / sun button switches between the light and dark themes." }
          ]}
        ]}
      ]
    }
  };

  /* ----------------------------------------------------------------------
     3. Utilitaires
     ---------------------------------------------------------------------- */

  function escapeHtml(str) {
    const d = document.createElement("div");
    d.textContent = str == null ? "" : str;
    return d.innerHTML;
  }
  function escapeAttr(str) { return escapeHtml(str).replace(/"/g, "&quot;"); }

  function loadLang() {
    try {
      const saved = localStorage.getItem(LANG_KEY);
      if (saved === "fr" || saved === "en") return saved;
    } catch (e) { /* stockage indisponible : on continue */ }
    return (navigator.language || "fr").toLowerCase().startsWith("en") ? "en" : "fr";
  }
  function saveLang(l) { try { localStorage.setItem(LANG_KEY, l); } catch (e) { /* ignoré */ } }

  let lang = loadLang();
  const T = () => CONTENT[lang];

  const link = (l, cls) => '<a href="' + escapeAttr(l.href) + '" class="btn ' + cls + '"' + (l.external ? ' target="_blank" rel="noopener"' : '') + '>' + escapeHtml(l.label) + '</a>';
  const sectionHead = (b) => (b.title || b.subtitle)
    ? '<div class="section-head"><div>' + (b.title ? '<h2>' + escapeHtml(b.title) + '</h2>' : '') + (b.subtitle ? '<p>' + escapeHtml(b.subtitle) + '</p>' : '') + '</div></div>'
    : '';

  /* ----------------------------------------------------------------------
     4. Rendu des composants
     ---------------------------------------------------------------------- */

  function renderHero(b) {
    return `<div class="hero">
      <div class="container">
        <div>
          ${b.kicker ? `<div class="hero-kicker">${ICONS.star}${escapeHtml(b.kicker)}</div>` : ""}
          <h1 class="hero-title">
            <span class="line"><span>${escapeHtml(b.title1)}</span></span>
            <span class="line"><span>${escapeHtml(b.title2)}</span></span>
          </h1>
          ${b.text ? `<p class="hero-sub">${escapeHtml(b.text)}</p>` : ""}
          <div class="hero-cta">
            ${b.cta1 ? link(b.cta1, "btn-gold") : ""}
            ${b.cta2 ? link(b.cta2, "btn-ghost") : ""}
          </div>
        </div>
        <div class="hero-figure">${birdArt()}</div>
      </div>
    </div>`;
  }

  function renderStats(b) {
    return `<section class="block" style="padding-bottom:0;">
      <div class="container">
        <div class="hero-stats stats-paper" style="margin-top:0; opacity:1; animation:none;">
          ${b.items.map(it => `<div class="stat"><b>${escapeHtml(it.value)}</b><span>${escapeHtml(it.label)}</span></div>`).join("")}
        </div>
      </div>
    </section>`;
  }

  function renderCards(b) {
    return `<section class="block">
      <div class="container">
        ${sectionHead(b)}
        <div class="grid ${b.cols === 2 ? "grid-2" : "grid-3"}">
          ${b.items.map(it => `
            <div class="card">
              <div class="card-icon">${ICONS[it.icon] || ICONS.star}</div>
              <h3>${escapeHtml(it.title)}</h3>
              <p>${escapeHtml(it.text)}</p>
              ${it.link ? `<a class="service-link" href="${escapeAttr(it.link)}" target="_blank" rel="noopener">${lang === "en" ? "Open" : "Ouvrir"} ${ICONS.extLink}</a>` : ""}
            </div>`).join("")}
        </div>
      </div>
    </section>`;
  }

  function renderValues(b) {
    return `<section class="block">
      <div class="container">
        ${sectionHead(b)}
        <div class="values-row">
          ${b.items.map(it => `<div class="value-item">${ICONS[it.icon] || ICONS.star}<h4>${escapeHtml(it.title)}</h4><p>${escapeHtml(it.text)}</p></div>`).join("")}
        </div>
      </div>
    </section>`;
  }

  function renderTimeline(b) {
    return `<section class="block">
      <div class="container">
        <div class="split">
          <div>${b.title ? `<h2 style="font-size:2.1rem;">${escapeHtml(b.title)}</h2>` : ""}${b.text ? `<p style="margin-top:16px;">${escapeHtml(b.text)}</p>` : ""}</div>
          <div class="timeline">
            ${b.items.map(it => `<div class="t-item"><b>${escapeHtml(it.title)}</b><p>${escapeHtml(it.text)}</p></div>`).join("")}
          </div>
        </div>
      </div>
    </section>`;
  }

  function renderCta(b) {
    return `<section class="block">
      <div class="container">
        <div class="cta-band">
          <div>${b.title ? `<h3>${escapeHtml(b.title)}</h3>` : ""}${b.text ? `<p>${escapeHtml(b.text)}</p>` : ""}</div>
          ${b.button ? link(b.button, "btn-gold") : ""}
        </div>
      </div>
    </section>`;
  }

  function renderGallery(b) {
    return `<section class="block">
      <div class="container">
        ${sectionHead(b)}
        <div class="gallery">
          ${GALLERY_IMAGES.map((src, i) => `
            <figure class="shot s${i + 1}" data-caption="${escapeAttr(b.captions[i] || "")}">
              <img src="${escapeAttr(src)}" alt="${escapeAttr(b.captions[i] || "")}" loading="lazy">
              <div class="ph">${ICONS.image}<span>${escapeHtml(T().gallery.missing)}</span><code>${escapeHtml(src)}</code></div>
              <figcaption>${escapeHtml(b.captions[i] || "")}</figcaption>
            </figure>`).join("")}
        </div>
      </div>
    </section>`;
  }

  function renderFaq(b) {
    return `<section class="block">
      <div class="container">
        ${sectionHead(b)}
        <div class="faq">
          ${b.items.map(it => `<details><summary>${escapeHtml(it.q)}${ICONS.plus}</summary><p>${escapeHtml(it.a)}</p></details>`).join("")}
        </div>
      </div>
    </section>`;
  }

  function renderBlock(b) {
    switch (b.type) {
      case "hero": return renderHero(b);
      case "stats": return renderStats(b);
      case "cards": return renderCards(b);
      case "values": return renderValues(b);
      case "timeline": return renderTimeline(b);
      case "cta": return renderCta(b);
      case "gallery": return renderGallery(b);
      case "faq": return renderFaq(b);
      default: return "";
    }
  }

  /* ----------------------------------------------------------------------
     5. Pages — navigation, routage
     ---------------------------------------------------------------------- */

  function currentSlug() {
    const slug = location.hash.replace("#", "");
    return T().pages.some(p => p.slug === slug) ? slug : T().pages[0].slug;
  }

  function renderNav() {
    const slug = currentSlug();
    document.getElementById("main-nav").innerHTML = T().pages
      .map(p => `<a href="#${p.slug}" data-slug="${p.slug}" class="${p.slug === slug ? "active" : ""}">${escapeHtml(p.label)}</a>`).join("");
  }

  function renderPages() {
    const root = document.getElementById("page-root");
    const slug = currentSlug();
    root.innerHTML = T().pages.map(p =>
      `<section class="page${p.slug === slug ? " active" : ""}" id="page-${p.slug}">${p.blocks.map(renderBlock).join("")}</section>`
    ).join("");
    wireGallery();
  }

  function renderFooter() {
    const f = T().footer;
    document.getElementById("footer-root").innerHTML = `
      <div class="footer-top">
        <div>
          <span class="brand-text"><span class="school">Turabo Self</span></span>
          <p class="footer-text">${escapeHtml(f.text)}</p>
        </div>
        <div>
          <h5>${escapeHtml(f.navTitle)}</h5>
          <ul>${T().pages.map(p => `<li><a href="#${p.slug}">${escapeHtml(p.label)}</a></li>`).join("")}</ul>
        </div>
        <div>
          <h5>${escapeHtml(f.appTitle)}</h5>
          <ul>${f.appLinks.map(t => `<li><a href="${escapeAttr(APP_URL)}" target="_blank" rel="noopener">${escapeHtml(t)}</a></li>`).join("")}</ul>
        </div>
      </div>
      <div class="footer-bottom">
        <span>© ${new Date().getFullYear()} Turabo Self</span>
        <span>${escapeHtml(f.note)}</span>
      </div>`;
  }

  function renderChrome() {
    document.documentElement.lang = T().htmlLang;
    document.title = T().title;
    document.getElementById("site-tagline").textContent = T().tagline;
    const app = document.getElementById("btn-app");
    app.textContent = T().openApp;
    app.href = APP_URL;
    document.querySelectorAll(".lang-switch button").forEach(b => b.setAttribute("aria-pressed", b.dataset.lang === lang ? "true" : "false"));
  }

  function renderAll() {
    renderChrome();
    renderNav();
    renderPages();
    renderFooter();
  }

  function applyActivePage() {
    const slug = currentSlug();
    T().pages.forEach(p => {
      const el = document.getElementById("page-" + p.slug);
      if (el) el.classList.toggle("active", p.slug === slug);
    });
    document.querySelectorAll(".main-nav a[data-slug]").forEach(a => a.classList.toggle("active", a.dataset.slug === slug));
    closeMenu();
    window.scrollTo({ top: 0, behavior: "auto" });
  }

  /* ----------------------------------------------------------------------
     6. Menu mobile, langue, galerie / visionneuse
     ---------------------------------------------------------------------- */

  const header = document.getElementById("site-header");
  const toggle = document.getElementById("menu-toggle");
  function closeMenu() { header.classList.remove("nav-open"); toggle.setAttribute("aria-expanded", "false"); }
  toggle.addEventListener("click", () => {
    const open = header.classList.toggle("nav-open");
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
  });

  document.querySelectorAll(".lang-switch button").forEach(btn => {
    btn.addEventListener("click", () => {
      if (btn.dataset.lang === lang) return;
      lang = btn.dataset.lang;
      saveLang(lang);
      renderAll();
    });
  });

  const lightbox = document.getElementById("lightbox");
  const lbImg = document.getElementById("lightbox-img");
  const lbCap = document.getElementById("lightbox-caption");
  function openLightbox(src, caption) {
    lbImg.src = src; lbImg.alt = caption; lbCap.textContent = caption;
    lightbox.classList.add("open"); lightbox.setAttribute("aria-hidden", "false");
  }
  function closeLightbox() { lightbox.classList.remove("open"); lightbox.setAttribute("aria-hidden", "true"); }
  lightbox.addEventListener("click", (e) => { if (e.target !== lbImg) closeLightbox(); });
  document.getElementById("lightbox-close").addEventListener("click", closeLightbox);
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeLightbox(); });

  function wireGallery() {
    document.querySelectorAll(".shot").forEach(shot => {
      const img = shot.querySelector("img");
      const markEmpty = () => shot.classList.add("empty");
      img.addEventListener("error", markEmpty);
      if (img.complete && img.naturalWidth === 0) markEmpty();
      shot.addEventListener("click", () => {
        if (shot.classList.contains("empty")) return;
        openLightbox(img.currentSrc || img.src, shot.dataset.caption || "");
      });
    });
  }

  /* ----------------------------------------------------------------------
     7. Démarrage
     ---------------------------------------------------------------------- */

  window.addEventListener("hashchange", applyActivePage);
  renderAll();
})();
