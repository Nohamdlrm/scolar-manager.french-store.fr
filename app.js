/* =========================================================================
   CAMPUS ROSA PARKS — app.js (refonte "page-builder")
   - Authentification Firebase (mot de passe jamais présent dans le code)
   - Contenu stocké dans Firestore, synchronisé en direct pour tout le monde
   - Pages et composants entièrement gérables depuis le mode édition :
     ajouter/réordonner/supprimer des pages, ajouter/réordonner/modifier/
     supprimer des composants sur chaque page.
   ========================================================================= */

(function () {
  "use strict";

  /* ----------------------------------------------------------------------
     0. Icônes (jeu unique, traits fins, réutilisées partout)
     ---------------------------------------------------------------------- */

  const ICONS = {
    book:      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z"/></svg>',
    flask:     '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 2h6M10 2v6.2L4.5 18a2 2 0 0 0 1.7 3h11.6a2 2 0 0 0 1.7-3L14 8.2V2"/><path d="M7.5 14h9"/></svg>',
    cpu:       '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="6" width="12" height="12" rx="2"/><path d="M9 9h6v6H9z"/><path d="M9 2v3M15 2v3M9 19v3M15 19v3M2 9h3M2 15h3M19 9h3M19 15h3"/></svg>',
    tool:      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.5 2.5-2-2 2.5-2.5Z"/></svg>',
    scale:     '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v18M7 7 3 15h8L7 7ZM17 7l-4 8h8l-4-8ZM4 21h16"/></svg>',
    heart:     '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20.5S3.5 15 3.5 8.8a4.8 4.8 0 0 1 8.5-3 4.8 4.8 0 0 1 8.5 3c0 6.2-8.5 11.7-8.5 11.7Z"/></svg>',
    briefcase: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="7.5" width="18" height="12" rx="2"/><path d="M8.5 7.5v-2a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v2"/><path d="M3 12.5h18"/></svg>',
    link:      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M10 14a5 5 0 0 0 7 0l2.5-2.5a5 5 0 0 0-7-7L11 6"/><path d="M14 10a5 5 0 0 0-7 0L4.5 12.5a5 5 0 0 0 7 7L13 18"/></svg>',
    tray:      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 13h4.5l2 3h5l2-3H21"/><path d="M5.5 5h13l2.5 8v6a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-6L5.5 5Z"/></svg>',
    calendar:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3.5" y="5" width="17" height="16" rx="2"/><path d="M3.5 10h17M8 3v4M16 3v4"/></svg>',
    star:      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3 2.6 5.9 6.4.6-4.8 4.3 1.4 6.3L12 17l-5.6 3.1 1.4-6.3-4.8-4.3 6.4-.6L12 3Z"/></svg>',
    cap:       '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2 9 12 4l10 5-10 5-10-5Z"/><path d="M6 11.5V17c0 1.4 2.7 3 6 3s6-1.6 6-3v-5.5"/><path d="M22 9v6"/></svg>',
    users:     '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="8" r="3.2"/><path d="M2.5 20c.7-3.4 3.3-5.5 6.5-5.5s5.8 2.1 6.5 5.5"/><circle cx="17.5" cy="8.5" r="2.6"/><path d="M15.7 14.8c2.6.3 4.6 2.2 5.2 5.2"/></svg>',
    globe:     '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18 14 14 0 0 1 0-18Z"/></svg>',
    rocket:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2.5c3 1 5.5 4 6 8.5-3.5 1-7.5 6.5-7.5 6.5s-.6-2.4-2-4c-1.6-1.4-4-2-4-2s5.5-4 6.5-7.5c.7-.2 1-1.5 1-1.5Z"/><circle cx="14.5" cy="9.5" r="1.3"/><path d="M8 16c-2 .8-3 3.5-3 5.5 2 0 4.7-1 5.5-3"/></svg>',
    shield:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3 4.5 6v6c0 5 3.4 8.3 7.5 9 4.1-.7 7.5-4 7.5-9V6L12 3Z"/><path d="m9 12 2 2 4-4"/></svg>',
    message:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5.5h16v11H8.5L4 20V5.5Z"/></svg>',
    sparkle:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M18 6l-2.5 2.5M8.5 15.5 6 18"/></svg>'
  };
  const ICON_LABELS = { book:"Livre", flask:"Sciences", cpu:"Numérique", tool:"Technique", scale:"Justice", heart:"Bienveillance", briefcase:"Emploi", link:"Lien", tray:"Cantine", calendar:"Agenda", star:"Repère", cap:"Diplôme", users:"Communauté", globe:"International", rocket:"Ambition", shield:"Sécurité", message:"Dialogue", sparkle:"Nouveauté" };
  const ICON_KEYS = Object.keys(ICONS);
  const iconSvg = (key) => ICONS[key] || ICONS.link;

  function editPen()   { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>'; }
  function trash()      { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7h16M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2m-8 0 1 13a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2l1-13"/></svg>'; }
  function arrowUp()    { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5M5 12l7-7 7 7"/></svg>'; }
  function arrowDown()  { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M19 12l-7 7-7-7"/></svg>'; }
  function plusCircle() { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 8v8M8 12h8"/></svg>'; }
  function closeIcon()  { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 6l12 12M18 6 6 18"/></svg>'; }
  function extLink()    { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17 17 7M9 7h8v8"/></svg>'; }
  function gridIcon()   { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>'; }
  function barsIcon()   { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 20V10M12 20V4M19 20v-7"/></svg>'; }
  function stepsIcon()  { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 6h4M4 12h4M4 18h4M11 6h9M11 12h9M11 18h9"/></svg>'; }
  function briefcaseOutline() { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="8" width="18" height="12" rx="2"/><path d="M8 8V6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>'; }
  function lockShield() { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>'; }

  function busArt() {
    return `<svg viewBox="0 0 320 320" fill="none">
      <circle cx="160" cy="160" r="152" style="stroke:var(--line)" stroke-width="1.5" stroke-dasharray="2 9"/>
      <circle cx="160" cy="160" r="118" style="fill:var(--ink-2)"/>
      <path class="route-path" d="M46 196 C 110 120, 210 120, 274 196" style="stroke:var(--gold)" stroke-width="3.5" stroke-linecap="round"/>
      <circle cx="46" cy="196" r="5" style="fill:var(--gold)"/>
      <circle cx="274" cy="196" r="5" style="fill:var(--gold)"/>
      <rect x="110" y="138" width="100" height="68" rx="18" style="fill:var(--paper)"/>
      <rect x="124" y="152" width="28" height="22" rx="4" style="fill:var(--ink-2)"/>
      <rect x="168" y="152" width="28" height="22" rx="4" style="fill:var(--ink-2)"/>
      <rect x="110" y="196" width="100" height="10" style="fill:var(--brick)"/>
      <circle cx="132" cy="213" r="10" style="fill:var(--ink)"/>
      <circle cx="188" cy="213" r="10" style="fill:var(--ink)"/>
    </svg>`;
  }

  /* ----------------------------------------------------------------------
     1. Registre des types de composants disponibles
     ---------------------------------------------------------------------- */

  const BLOCK_DEFS = {
    hero: {
      label: "Bannière d'accueil", hint: "Grand titre en haut de page", icon: ICONS.sparkle,
      fields: [
        { key: "kicker", label: "Texte au-dessus du titre", type: "text" },
        { key: "title1", label: "Titre — première ligne", type: "text" },
        { key: "title2", label: "Titre — seconde ligne", type: "text" },
        { key: "text", label: "Texte de présentation", type: "textarea" },
        { key: "cta1_label", label: "Bouton principal — texte", type: "text" },
        { key: "cta1_href", label: "Bouton principal — lien", type: "link", placeholder: "#filieres ou https://…" },
        { key: "cta2_label", label: "Bouton secondaire — texte", type: "text" },
        { key: "cta2_href", label: "Bouton secondaire — lien", type: "link", placeholder: "#rejoindre ou https://…" }
      ]
    },
    richtext: {
      label: "Texte", hint: "Un titre et un paragraphe", icon: ICONS.message,
      fields: [
        { key: "title", label: "Titre", type: "text" },
        { key: "text", label: "Texte", type: "textarea" }
      ]
    },
    stats: {
      label: "Chiffres clés", hint: "Une ligne de chiffres mis en avant", icon: barsIcon(),
      fields: [],
      items: { label: "Chiffre", min: 1, max: 6, fields: [
        { key: "value", label: "Valeur", type: "text" },
        { key: "label", label: "Légende", type: "text" }
      ]}
    },
    cards: {
      label: "Grille de cartes", hint: "Filières, atouts, services…", icon: gridIcon(),
      fields: [
        { key: "title", label: "Titre de section", type: "text" },
        { key: "subtitle", label: "Sous-titre (optionnel)", type: "text" }
      ],
      items: { label: "Carte", min: 1, max: 12, fields: [
        { key: "icon", label: "Icône", type: "icon" },
        { key: "title", label: "Titre", type: "text" },
        { key: "text", label: "Texte", type: "textarea" },
        { key: "link", label: "Lien de sortie (optionnel)", type: "link", placeholder: "https://…" }
      ]}
    },
    cta: {
      label: "Bannière d'appel à l'action", hint: "Un message et un bouton", icon: ICONS.rocket,
      fields: [
        { key: "title", label: "Titre", type: "text" },
        { key: "text", label: "Texte", type: "textarea" },
        { key: "button_label", label: "Bouton — texte", type: "text" },
        { key: "button_href", label: "Bouton — lien", type: "link", placeholder: "#rejoindre ou https://…" }
      ]
    },
    jobs: {
      label: "Liste d'offres", hint: "Postes à pourvoir, avec lien de candidature", icon: ICONS.briefcase,
      fields: [
        { key: "title", label: "Titre de section", type: "text" },
        { key: "subtitle", label: "Sous-titre (optionnel)", type: "text" }
      ],
      items: { label: "Offre", min: 0, max: 30, fields: [
        { key: "titre", label: "Intitulé du poste", type: "text" },
        { key: "contrat", label: "Type de contrat", type: "text", placeholder: "Ex. Temps plein" },
        { key: "lieu", label: "Lieu / service", type: "text", placeholder: "Ex. Vie scolaire" },
        { key: "description", label: "Description", type: "textarea" },
        { key: "lien", label: "Lien de candidature (optionnel)", type: "link", placeholder: "https://…" }
      ]}
    },
    timeline: {
      label: "Chronologie / étapes", hint: "Une suite d'étapes numérotées", icon: stepsIcon(),
      fields: [
        { key: "title", label: "Titre", type: "text" },
        { key: "text", label: "Texte (optionnel)", type: "textarea" }
      ],
      items: { label: "Étape", min: 1, max: 8, fields: [
        { key: "title", label: "Titre de l'étape", type: "text" },
        { key: "text", label: "Texte", type: "textarea" }
      ]}
    }
  };

  /* ----------------------------------------------------------------------
     2. Contenu par défaut (1er chargement, si Firestore est vide)
     ---------------------------------------------------------------------- */

  function generateDefaultContent() {
    return {
      texts: {
        site_name: "Campus Rosa Parks",
        site_tagline: "Établissement scolaire",
        footer_text: "Un établissement qui prépare chaque élève à avancer, en s'inspirant du courage tranquille de Rosa Parks.",
        contact_address: "Campus Rosa Parks",
        contact_email: "contact@campus-rosaparks.fr",
        contact_phone: "01 23 45 67 89"
      },
      pages: [
        { id: "pg_accueil", slug: "accueil", label: "Accueil", blocks: [
          { id: uid("b"), type: "hero", data: {
            kicker: "Établissement public — dans l'esprit de Rosa Parks",
            title1: "Un campus qui donne",
            title2: "de l'élan à chacun.",
            text: "Le Campus Rosa Parks forme, accompagne et rassemble ses élèves autour de filières exigeantes et d'une vie de campus engagée. Ici, chaque parcours compte.",
            cta1_label: "Découvrir nos filières", cta1_href: "#filieres",
            cta2_label: "Voir les offres à pourvoir", cta2_href: "#rejoindre"
          }},
          { id: uid("b"), type: "stats", data: { items: [
            { value: "1 200+", label: "élèves accueillis" },
            { value: "6", label: "filières proposées" },
            { value: "120", label: "personnels engagés" }
          ]}},
          { id: uid("b"), type: "cards", data: { title: "Trois raisons de nous rejoindre", subtitle: "", items: [
            { icon: "book", title: "Filières exigeantes", text: "Des parcours généraux, technologiques et professionnels pensés pour ouvrir toutes les portes après le campus.", link: "" },
            { icon: "users", title: "Une communauté vivante", text: "Élèves, professeurs et personnels avancent ensemble, dans le respect et l'entraide qui font l'identité du campus.", link: "" },
            { icon: "tray", title: "Des services au quotidien", text: "Cantine, vie scolaire, plateformes numériques : tout ce qu'il faut pour simplifier la vie sur le campus.", link: "" }
          ]}},
          { id: uid("b"), type: "cta", data: {
            title: "Une place vous attend au Campus Rosa Parks.",
            text: "Consultez nos offres ou découvrez la filière qui vous correspond.",
            button_label: "Nous rejoindre", button_href: "#rejoindre"
          }}
        ]},
        { id: "pg_apropos", slug: "apropos", label: "Qui sommes-nous", blocks: [
          { id: uid("b"), type: "richtext", data: {
            title: "L'héritage d'un nom, l'ambition d'un campus.",
            text: "Le Campus Rosa Parks porte le nom d'une femme qui, par un acte de courage tranquille, a fait bouger les lignes. Nous nous en inspirons chaque jour : donner à chaque élève la place et les moyens d'avancer, quels que soient son parcours et ses ambitions."
          }},
          { id: uid("b"), type: "cards", data: { title: "Ce qui nous guide", subtitle: "", items: [
            { icon: "scale", title: "Exigence", text: "Un accompagnement scolaire rigoureux, pour chaque filière.", link: "" },
            { icon: "heart", title: "Bienveillance", text: "Une équipe attentive au bien-être de chaque élève.", link: "" },
            { icon: "message", title: "Dialogue", text: "Une communauté où la parole de chacun a du poids.", link: "" },
            { icon: "star", title: "Ambition", text: "Préparer chaque élève à choisir la suite de son parcours.", link: "" }
          ]}},
          { id: uid("b"), type: "timeline", data: {
            title: "Notre campus en quelques repères",
            text: "Un établissement à taille humaine, organisé pour que chaque élève trouve sa place, de l'accueil à la sortie du campus.",
            items: [
              { title: "Un accueil pour chacun", text: "Vie scolaire, infirmerie et cantine accompagnent le quotidien des élèves." },
              { title: "Des équipes disponibles", text: "Professeurs et personnels sont présents à chaque étape du parcours." },
              { title: "Une ouverture sur l'avenir", text: "Orientation, stages et partenariats préparent l'après-campus." }
            ]
          }}
        ]},
        { id: "pg_filieres", slug: "filieres", label: "Nos filières", blocks: [
          { id: uid("b"), type: "cards", data: { title: "Nos filières", subtitle: "Un parcours pour chaque projet, du général au professionnel.", items: [
            { icon: "book", title: "Seconde générale et technologique", text: "Un tronc commun solide pour construire son projet d'orientation en toute confiance.", link: "" },
            { icon: "flask", title: "Première et Terminale générales", text: "Spécialités scientifiques, littéraires et économiques pour préparer le baccalauréat.", link: "" },
            { icon: "cpu", title: "STMG", text: "Gestion, management et numérique, au plus près des réalités de l'entreprise.", link: "" },
            { icon: "tool", title: "Bac professionnel", text: "Des parcours concrets menant à l'emploi ou à la poursuite d'études en BTS.", link: "" },
            { icon: "globe", title: "Section européenne", text: "Un renforcement linguistique et culturel ouvert sur l'international.", link: "" },
            { icon: "heart", title: "Accompagnement personnalisé", text: "Un suivi individuel pour consolider les acquis et gagner en autonomie.", link: "" }
          ]}}
        ]},
        { id: "pg_rejoindre", slug: "rejoindre", label: "Nous rejoindre", blocks: [
          { id: uid("b"), type: "jobs", data: { title: "Nous rejoindre", subtitle: "Les postes actuellement à pourvoir sur le campus.", items: [
            { titre: "Professeur·e de mathématiques", contrat: "Temps plein", lieu: "Campus Rosa Parks", description: "Rejoignez l'équipe de mathématiques pour les classes de seconde et de première.", lien: "" },
            { titre: "Assistant·e d'éducation", contrat: "Temps partiel", lieu: "Vie scolaire", description: "Encadrement et suivi des élèves au sein de la vie scolaire du campus.", lien: "" }
          ]}}
        ]},
        { id: "pg_services", slug: "services", label: "Nos services", blocks: [
          { id: uid("b"), type: "cards", data: { title: "Nos services", subtitle: "Les plateformes et services numériques du campus, accessibles en un lien.", items: [
            { icon: "tray", title: "Turabo Self", text: "Réservation et paiement des repas de la cantine du campus.", link: "https://self.campus-rosaparks.fr/" },
            { icon: "cpu", title: "Espace numérique de travail", text: "Emploi du temps, notes et messagerie avec les équipes pédagogiques.", link: "" },
            { icon: "calendar", title: "Vie scolaire en ligne", text: "Absences, retards et informations de vie scolaire en temps réel.", link: "" }
          ]}}
        ]}
      ]
    };
  }

  let content = generateDefaultContent();
  let isAdmin = false;
  let saveTimer = null;
  let firstLoad = true;
  const contentRef = db.collection("site").doc("contenu");

  /* ----------------------------------------------------------------------
     3. Utilitaires
     ---------------------------------------------------------------------- */

  function uid(prefix) { return prefix + "_" + Math.random().toString(36).slice(2, 9); }

  function slugify(str) {
    return (str || "page").toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "page";
  }

  function showToast(msg) {
    const t = document.getElementById("toast");
    document.getElementById("toast-text").textContent = msg;
    t.classList.add("show");
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => t.classList.remove("show"), 2200);
  }

  function escapeHtml(str) {
    const d = document.createElement("div");
    d.textContent = str == null ? "" : str;
    return d.innerHTML;
  }
  function escapeAttr(str) { return escapeHtml(str).replace(/"/g, "&quot;"); }

  function normalizeUrl(value) {
    const v = (value || "").trim();
    if (!v || v === "#") return v;
    if (/^https?:\/\//i.test(v) || v.startsWith("/") || v.startsWith("#")) return v;
    return "https://" + v;
  }

  function openModal(id) { document.getElementById(id).classList.add("open"); }
  function closeModal(id) { document.getElementById(id).classList.remove("open"); }

  document.querySelectorAll("[data-close-modal]").forEach(btn => {
    btn.addEventListener("click", () => btn.closest(".modal").classList.remove("open"));
  });
  document.querySelectorAll(".modal").forEach(m => {
    m.addEventListener("click", (e) => { if (e.target === m) m.classList.remove("open"); });
  });

  function confirmAction(message, onConfirm) {
    document.getElementById("confirm-text").textContent = message;
    const btn = document.getElementById("confirm-delete-btn");
    btn.onclick = () => { onConfirm(); closeModal("confirm-modal"); };
    openModal("confirm-modal");
  }

  /* ----------------------------------------------------------------------
     4. Sauvegarde Firestore (debounced) — visible instantanément pour tous
     ---------------------------------------------------------------------- */

  function scheduleSave() {
    const status = document.getElementById("save-status");
    if (status) status.textContent = "Modification en cours…";
    clearTimeout(saveTimer);
    saveTimer = setTimeout(saveNow, 500);
  }

  function saveNow() {
    const status = document.getElementById("save-status");
    contentRef.set(content, { merge: false })
      .then(() => { if (status) status.textContent = "Enregistré ✓"; })
      .catch((err) => {
        console.error(err);
        if (status) status.textContent = "Erreur d'enregistrement";
        showToast("La sauvegarde a échoué — vérifiez la connexion.");
      });
  }

  /* ----------------------------------------------------------------------
     5. Formulaires génériques (champs + listes d'éléments répétables)
     ---------------------------------------------------------------------- */

  function iconSelect(fieldKey, current) {
    const opts = ICON_KEYS.map(k => `<option value="${k}" ${k === current ? "selected" : ""}>${ICON_LABELS[k] || k}</option>`).join("");
    return `<select data-field="${fieldKey}">${opts}</select>`;
  }

  function fieldInputHTML(f, value) {
    const val = value == null ? "" : value;
    const ph = f.placeholder ? ` placeholder="${escapeAttr(f.placeholder)}"` : "";
    if (f.type === "textarea") return `<div class="field"><label>${f.label}</label><textarea data-field="${f.key}"${ph}>${escapeHtml(val)}</textarea></div>`;
    if (f.type === "icon") return `<div class="field"><label>${f.label}</label>${iconSelect(f.key, val || ICON_KEYS[0])}</div>`;
    return `<div class="field"><label>${f.label}</label><input data-field="${f.key}" value="${escapeAttr(val)}"${ph}></div>`;
  }

  function readFields(container, fields) {
    const obj = {};
    fields.forEach(f => {
      const el = container.querySelector(`[data-field="${f.key}"]`);
      obj[f.key] = el ? el.value.trim() : "";
    });
    return obj;
  }

  function buildItemRow(itemsDef, data, idx) {
    const row = document.createElement("div");
    row.className = "item-row";
    row.innerHTML = `<div class="item-row-head"><span>${itemsDef.label} ${idx + 1}</span><button type="button" class="icon-btn row-remove" title="Supprimer">${trash()}</button></div>` +
      itemsDef.fields.map(f => fieldInputHTML(f, data[f.key])).join("");
    row.querySelector(".row-remove").addEventListener("click", () => {
      row.remove();
      renumberRows(row.parentElement, itemsDef.label);
    });
    return row;
  }

  function renumberRows(container, label) {
    Array.from(container.children).forEach((row, i) => {
      const span = row.querySelector(".item-row-head span");
      if (span) span.textContent = `${label} ${i + 1}`;
    });
  }

  function defaultBlockData(type) {
    const def = BLOCK_DEFS[type];
    const data = {};
    def.fields.forEach(f => { data[f.key] = ""; });
    if (def.items) {
      const n = Math.max(def.items.min || 1, 1);
      data.items = Array.from({ length: n }, () => {
        const o = {};
        def.items.fields.forEach(f => { o[f.key] = f.type === "icon" ? ICON_KEYS[0] : ""; });
        return o;
      });
    }
    return data;
  }

  /* ----------------------------------------------------------------------
     6. Édition d'un composant
     ---------------------------------------------------------------------- */

  function openBlockForm(pageId, blockId) {
    const page = content.pages.find(p => p.id === pageId);
    const block = page.blocks.find(b => b.id === blockId);
    const def = BLOCK_DEFS[block.type];

    document.getElementById("item-modal-title").textContent = "Modifier — " + def.label;
    document.getElementById("item-modal-sub").textContent = "Ce composant est visible par tous les visiteurs du site.";
    document.getElementById("item-form-error").textContent = "";

    const fieldsEl = document.getElementById("item-form-fields");
    let html = `<div id="block-top-fields">${def.fields.map(f => fieldInputHTML(f, block.data[f.key])).join("")}</div>`;
    if (def.items) {
      html += `<div class="items-editor" id="block-items"></div>`;
      html += `<button type="button" class="items-add-row" id="block-items-add">${plusCircle()} Ajouter — ${def.items.label}</button>`;
    }
    fieldsEl.innerHTML = html;

    if (def.items) {
      const itemsRoot = document.getElementById("block-items");
      (block.data.items || []).forEach((it, idx) => itemsRoot.appendChild(buildItemRow(def.items, it, idx)));
      document.getElementById("block-items-add").addEventListener("click", () => {
        if (itemsRoot.children.length >= (def.items.max || 99)) return;
        itemsRoot.appendChild(buildItemRow(def.items, {}, itemsRoot.children.length));
      });
    }

    const form = document.getElementById("item-form");
    form.onsubmit = (e) => {
      e.preventDefault();
      const top = document.getElementById("block-top-fields");
      const data = readFields(top, def.fields);
      def.fields.forEach(f => { if (f.type === "link") data[f.key] = normalizeUrl(data[f.key]); });
      if (def.items) {
        const rows = Array.from(document.querySelectorAll("#block-items .item-row"));
        if (rows.length < (def.items.min || 0)) {
          document.getElementById("item-form-error").textContent = `Ajoutez au moins ${def.items.min} élément(s).`;
          return;
        }
        data.items = rows.map(row => {
          const obj = readFields(row, def.items.fields);
          def.items.fields.forEach(f => { if (f.type === "link") obj[f.key] = normalizeUrl(obj[f.key]); });
          return obj;
        });
      }
      block.data = data;
      renderAll();
      scheduleSave();
      closeModal("item-modal");
      showToast("Composant enregistré");
    };
    openModal("item-modal");
  }

  function openBlockTypePicker(pageId) {
    const wrap = document.getElementById("type-picker");
    wrap.innerHTML = Object.keys(BLOCK_DEFS).map(type => {
      const def = BLOCK_DEFS[type];
      return `<button type="button" class="type-pick-btn" data-type="${type}">${def.icon}<b>${def.label}</b><span>${def.hint || ""}</span></button>`;
    }).join("");
    wrap.querySelectorAll(".type-pick-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const type = btn.dataset.type;
        const page = content.pages.find(p => p.id === pageId);
        const block = { id: uid("b"), type, data: defaultBlockData(type) };
        page.blocks.push(block);
        closeModal("type-modal");
        renderAll();
        scheduleSave();
        openBlockForm(pageId, block.id);
      });
    });
    openModal("type-modal");
  }

  function moveBlock(pageId, blockId, dir) {
    const page = content.pages.find(p => p.id === pageId);
    const idx = page.blocks.findIndex(b => b.id === blockId);
    const swap = idx + dir;
    if (swap < 0 || swap >= page.blocks.length) return;
    [page.blocks[idx], page.blocks[swap]] = [page.blocks[swap], page.blocks[idx]];
    renderAll();
    scheduleSave();
  }

  /* ----------------------------------------------------------------------
     7. Rendu des composants
     ---------------------------------------------------------------------- */

  function toolbarHTML(idx, total) {
    return `<div class="block-toolbar">
      <button type="button" data-act="up" title="Monter" ${idx === 0 ? "disabled" : ""}>${arrowUp()}</button>
      <button type="button" data-act="down" title="Descendre" ${idx === total - 1 ? "disabled" : ""}>${arrowDown()}</button>
      <button type="button" data-act="edit" title="Modifier">${editPen()}</button>
      <button type="button" data-act="del" title="Supprimer">${trash()}</button>
    </div>`;
  }

  function renderHeroBlock(b, idx, total) {
    const d = b.data;
    return `<div class="hero editable-block" data-block-id="${b.id}">
      ${toolbarHTML(idx, total)}
      <div class="container">
        <div>
          ${d.kicker ? `<div class="hero-kicker">${ICONS.star}${escapeHtml(d.kicker)}</div>` : ""}
          <h1 class="hero-title">
            <span class="line"><span>${escapeHtml(d.title1 || "")}</span></span>
            <span class="line"><span>${escapeHtml(d.title2 || "")}</span></span>
          </h1>
          ${d.text ? `<p class="hero-sub">${escapeHtml(d.text)}</p>` : ""}
          <div class="hero-cta">
            ${d.cta1_label ? `<a href="${escapeAttr(d.cta1_href || "#")}" class="btn btn-gold">${escapeHtml(d.cta1_label)}</a>` : ""}
            ${d.cta2_label ? `<a href="${escapeAttr(d.cta2_href || "#")}" class="btn btn-ghost">${escapeHtml(d.cta2_label)}</a>` : ""}
          </div>
        </div>
        <div class="hero-figure">${busArt()}</div>
      </div>
    </div>`;
  }

  function renderRichtextBlock(b, idx, total) {
    const d = b.data;
    return `<section class="block editable-block" data-block-id="${b.id}">
      ${toolbarHTML(idx, total)}
      <div class="container">
        <div class="reveal">
          ${d.title ? `<h2 style="font-size:clamp(1.8rem,3.4vw,2.6rem); max-width:18ch; margin-bottom:18px;">${escapeHtml(d.title)}</h2>` : ""}
          ${d.text ? `<p style="font-size:1.05rem;">${escapeHtml(d.text)}</p>` : ""}
        </div>
      </div>
    </section>`;
  }

  function renderStatsBlock(b, idx, total) {
    const items = b.data.items || [];
    return `<section class="block editable-block" data-block-id="${b.id}" style="padding-top:0;">
      ${toolbarHTML(idx, total)}
      <div class="container">
        <div class="hero-stats" style="margin-top:0; opacity:1; animation:none;">
          ${items.map(it => `<div class="stat"><b>${escapeHtml(it.value || "")}</b><span>${escapeHtml(it.label || "")}</span></div>`).join("")}
        </div>
      </div>
    </section>`;
  }

  function renderCardsBlock(b, idx, total) {
    const d = b.data;
    const items = d.items || [];
    return `<section class="block editable-block" data-block-id="${b.id}">
      ${toolbarHTML(idx, total)}
      <div class="container">
        ${(d.title || d.subtitle) ? `<div class="section-head reveal"><div>${d.title ? `<h2>${escapeHtml(d.title)}</h2>` : ""}${d.subtitle ? `<p>${escapeHtml(d.subtitle)}</p>` : ""}</div></div>` : ""}
        <div class="grid grid-3">
          ${items.map(it => `
            <div class="card">
              <div class="card-icon">${iconSvg(it.icon)}</div>
              <h3>${escapeHtml(it.title || "")}</h3>
              <p>${escapeHtml(it.text || "")}</p>
              ${it.link ? `<a class="service-link" href="${escapeAttr(it.link)}" target="_blank" rel="noopener">Ouvrir ${extLink()}</a>` : ""}
            </div>`).join("")}
        </div>
      </div>
    </section>`;
  }

  function renderCtaBlock(b, idx, total) {
    const d = b.data;
    return `<section class="block editable-block" data-block-id="${b.id}">
      ${toolbarHTML(idx, total)}
      <div class="container">
        <div class="cta-band">
          <div>${d.title ? `<h3>${escapeHtml(d.title)}</h3>` : ""}${d.text ? `<p>${escapeHtml(d.text)}</p>` : ""}</div>
          ${d.button_label ? `<a href="${escapeAttr(d.button_href || "#")}" class="btn btn-gold">${escapeHtml(d.button_label)}</a>` : ""}
        </div>
      </div>
    </section>`;
  }

  function renderJobsBlock(b, idx, total) {
    const d = b.data;
    const items = d.items || [];
    return `<section class="block editable-block" data-block-id="${b.id}">
      ${toolbarHTML(idx, total)}
      <div class="container">
        ${(d.title || d.subtitle) ? `<div class="section-head reveal"><div>${d.title ? `<h2>${escapeHtml(d.title)}</h2>` : ""}${d.subtitle ? `<p>${escapeHtml(d.subtitle)}</p>` : ""}</div></div>` : ""}
        <div class="jobs-list">
          ${items.length === 0 ? `<div class="empty-state">${briefcaseOutline()}<p>Aucun poste n'est à pourvoir pour le moment.</p></div>` : items.map(j => `
            <div class="job-card">
              <div class="job-main">
                <div class="job-icon">${ICONS.briefcase}</div>
                <div>
                  <div class="job-title">${escapeHtml(j.titre || "")}</div>
                  <div class="job-meta">${j.contrat ? `<span class="job-tag">${escapeHtml(j.contrat)}</span>` : ""}${j.lieu ? `<span class="job-tag">${escapeHtml(j.lieu)}</span>` : ""}</div>
                  ${j.description ? `<p class="job-desc">${escapeHtml(j.description)}</p>` : ""}
                </div>
              </div>
              ${j.lien ? `<a href="${escapeAttr(j.lien)}" target="_blank" rel="noopener" class="btn btn-outline-ink btn-sm">Postuler</a>` : ""}
            </div>`).join("")}
        </div>
      </div>
    </section>`;
  }

  function renderTimelineBlock(b, idx, total) {
    const d = b.data;
    const items = d.items || [];
    return `<section class="block editable-block" data-block-id="${b.id}">
      ${toolbarHTML(idx, total)}
      <div class="container">
        <div class="split">
          <div class="reveal">${d.title ? `<h2 style="font-size:2.1rem;">${escapeHtml(d.title)}</h2>` : ""}${d.text ? `<p style="margin-top:16px;">${escapeHtml(d.text)}</p>` : ""}</div>
          <div class="timeline">
            ${items.map(it => `<div class="t-item"><b>${escapeHtml(it.title || "")}</b><p>${escapeHtml(it.text || "")}</p></div>`).join("")}
          </div>
        </div>
      </div>
    </section>`;
  }

  function renderBlock(block, idx, total) {
    switch (block.type) {
      case "hero": return renderHeroBlock(block, idx, total);
      case "richtext": return renderRichtextBlock(block, idx, total);
      case "stats": return renderStatsBlock(block, idx, total);
      case "cards": return renderCardsBlock(block, idx, total);
      case "cta": return renderCtaBlock(block, idx, total);
      case "jobs": return renderJobsBlock(block, idx, total);
      case "timeline": return renderTimelineBlock(block, idx, total);
      default: return "";
    }
  }

  function wireBlockToolbars(container, page) {
    container.querySelectorAll(".editable-block").forEach(el => {
      const blockId = el.dataset.blockId;
      const up = el.querySelector('[data-act="up"]');
      const down = el.querySelector('[data-act="down"]');
      const edit = el.querySelector('[data-act="edit"]');
      const del = el.querySelector('[data-act="del"]');
      if (up) up.addEventListener("click", () => moveBlock(page.id, blockId, -1));
      if (down) down.addEventListener("click", () => moveBlock(page.id, blockId, 1));
      if (edit) edit.addEventListener("click", () => openBlockForm(page.id, blockId));
      if (del) del.addEventListener("click", () => {
        confirmAction("Supprimer ce composant ? Cette action est visible par tout le monde immédiatement.", () => {
          page.blocks = page.blocks.filter(b => b.id !== blockId);
          renderAll();
          scheduleSave();
          showToast("Composant supprimé");
        });
      });
    });
  }

  /* ----------------------------------------------------------------------
     8. Pages — navigation, routage, gestion (ajout / ordre / suppression)
     ---------------------------------------------------------------------- */

  function currentSlug() {
    return location.hash.replace("#", "") || (content.pages[0] && content.pages[0].slug) || "accueil";
  }

  function renderNav() {
    const nav = document.getElementById("main-nav");
    const slug = currentSlug();
    nav.innerHTML = content.pages.map(p => `<a href="#${p.slug}" data-slug="${p.slug}" class="${p.slug === slug ? "active" : ""}">${escapeHtml(p.label)}</a>`).join("");
    if (isAdmin) {
      const addBtn = document.createElement("button");
      addBtn.type = "button";
      addBtn.className = "nav-add";
      addBtn.innerHTML = `${plusCircle()} Pages`;
      addBtn.addEventListener("click", openPagesManage);
      nav.appendChild(addBtn);
    }
  }

  function renderPages() {
    const root = document.getElementById("page-root");
    root.innerHTML = "";
    const slug = currentSlug();
    content.pages.forEach(page => {
      const section = document.createElement("section");
      section.className = "page" + (page.slug === slug ? " active" : "");
      section.id = "page-" + page.id;
      section.innerHTML = page.blocks.map((b, i) => renderBlock(b, i, page.blocks.length)).join("");
      const addWrap = document.createElement("div");
      addWrap.className = "add-block-tile admin-only";
      addWrap.innerHTML = `<button type="button">${plusCircle()} Ajouter un composant à « ${escapeHtml(page.label)} »</button>`;
      addWrap.querySelector("button").addEventListener("click", () => openBlockTypePicker(page.id));
      section.appendChild(addWrap);
      root.appendChild(section);
      wireBlockToolbars(section, page);
    });
    observeReveals();
  }

  function applyActivePage() {
    const slug = currentSlug();
    content.pages.forEach(p => {
      const el = document.getElementById("page-" + p.id);
      if (el) el.classList.toggle("active", p.slug === slug);
    });
    document.querySelectorAll(".main-nav a[data-slug]").forEach(a => a.classList.toggle("active", a.dataset.slug === slug));
    document.getElementById("site-header").classList.remove("nav-open");
    window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
    observeReveals();
  }

  window.addEventListener("hashchange", applyActivePage);

  function renderPagesManageList() {
    const wrap = document.getElementById("pages-manage-list");
    wrap.innerHTML = "";
    content.pages.forEach((p, idx) => {
      const row = document.createElement("div");
      row.className = "pages-manage-row";
      row.innerHTML = `
        <input value="${escapeAttr(p.label)}">
        <div class="row-actions">
          <button type="button" class="icon-btn" data-move="up" title="Monter" ${idx === 0 ? "disabled" : ""}>${arrowUp()}</button>
          <button type="button" class="icon-btn" data-move="down" title="Descendre" ${idx === content.pages.length - 1 ? "disabled" : ""}>${arrowDown()}</button>
          <button type="button" class="icon-btn" data-del title="Supprimer">${trash()}</button>
        </div>`;
      row.querySelector("input").addEventListener("change", (e) => {
        p.label = e.target.value.trim() || p.label;
        renderAll();
        renderPagesManageList();
        scheduleSave();
      });
      const up = row.querySelector('[data-move="up"]');
      const down = row.querySelector('[data-move="down"]');
      if (up) up.addEventListener("click", () => {
        if (idx === 0) return;
        [content.pages[idx - 1], content.pages[idx]] = [content.pages[idx], content.pages[idx - 1]];
        renderAll(); renderPagesManageList(); scheduleSave();
      });
      if (down) down.addEventListener("click", () => {
        if (idx === content.pages.length - 1) return;
        [content.pages[idx + 1], content.pages[idx]] = [content.pages[idx], content.pages[idx + 1]];
        renderAll(); renderPagesManageList(); scheduleSave();
      });
      row.querySelector("[data-del]").addEventListener("click", () => {
        if (content.pages.length <= 1) { showToast("Impossible de supprimer la dernière page."); return; }
        confirmAction(`Supprimer la page « ${p.label} » et tout son contenu ? Cette action est visible par tout le monde immédiatement.`, () => {
          const wasActive = p.slug === currentSlug();
          content.pages = content.pages.filter(pg => pg.id !== p.id);
          if (wasActive) location.hash = content.pages[0] ? content.pages[0].slug : "";
          renderAll();
          renderPagesManageList();
          scheduleSave();
          showToast("Page supprimée");
        });
      });
      wrap.appendChild(row);
    });
  }

  function openPagesManage() {
    renderPagesManageList();
    openModal("pages-modal");
  }

  document.getElementById("pages-add-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const input = document.getElementById("pages-add-input");
    const label = input.value.trim();
    if (!label) return;
    const id = uid("pg");
    const existingSlugs = content.pages.map(p => p.slug);
    let base = slugify(label);
    let slug = base;
    let n = 2;
    while (existingSlugs.includes(slug)) { slug = base + "-" + n; n++; }
    content.pages.push({ id, slug, label, blocks: [] });
    input.value = "";
    renderAll();
    renderPagesManageList();
    scheduleSave();
    showToast("Page ajoutée");
    location.hash = slug;
    closeModal("pages-modal");
    openBlockTypePicker(id);
  });

  /* ----------------------------------------------------------------------
     9. Réglages du site (identité, pied de page, contact)
     ---------------------------------------------------------------------- */

  function applyBrand() {
    const name = content.texts.site_name || "Campus Rosa Parks";
    const tagline = content.texts.site_tagline || "Établissement scolaire";
    document.title = name;
    document.querySelectorAll(".js-site-name").forEach(el => { el.textContent = name; });
    document.querySelectorAll(".js-site-tagline").forEach(el => { el.textContent = tagline; });
    const footerText = document.getElementById("footer-text");
    if (footerText) footerText.textContent = content.texts.footer_text || "";
    const addr = document.getElementById("contact-address");
    if (addr) addr.textContent = content.texts.contact_address || "";
    const email = document.getElementById("contact-email");
    if (email) email.textContent = content.texts.contact_email || "";
    const phone = document.getElementById("contact-phone");
    if (phone) phone.textContent = content.texts.contact_phone || "";
    const footNav = document.getElementById("footer-nav");
    if (footNav) footNav.innerHTML = content.pages.map(p => `<li><a href="#${p.slug}">${escapeHtml(p.label)}</a></li>`).join("");
  }

  document.getElementById("btn-settings").addEventListener("click", () => {
    document.getElementById("set-name").value = content.texts.site_name || "";
    document.getElementById("set-tagline").value = content.texts.site_tagline || "";
    document.getElementById("set-footer").value = content.texts.footer_text || "";
    document.getElementById("set-address").value = content.texts.contact_address || "";
    document.getElementById("set-email").value = content.texts.contact_email || "";
    document.getElementById("set-phone").value = content.texts.contact_phone || "";
    openModal("settings-modal");
  });

  document.getElementById("settings-form").addEventListener("submit", (e) => {
    e.preventDefault();
    content.texts.site_name = document.getElementById("set-name").value.trim();
    content.texts.site_tagline = document.getElementById("set-tagline").value.trim();
    content.texts.footer_text = document.getElementById("set-footer").value.trim();
    content.texts.contact_address = document.getElementById("set-address").value.trim();
    content.texts.contact_email = document.getElementById("set-email").value.trim();
    content.texts.contact_phone = document.getElementById("set-phone").value.trim();
    applyBrand();
    scheduleSave();
    closeModal("settings-modal");
    showToast("Réglages enregistrés");
  });

  /* ----------------------------------------------------------------------
     10. Révélation au défilement (un seul geste sur les en-têtes)
     ---------------------------------------------------------------------- */

  let revealObserver = null;
  function observeReveals() {
    if (revealObserver) revealObserver.disconnect();
    revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in-view"); revealObserver.unobserve(e.target); } });
    }, { threshold: 0.16 });
    document.querySelectorAll(".reveal:not(.in-view)").forEach(el => revealObserver.observe(el));
  }

  /* ----------------------------------------------------------------------
     11. Rendu global
     ---------------------------------------------------------------------- */

  function renderAll() {
    applyBrand();
    renderNav();
    renderPages();
  }

  /* ----------------------------------------------------------------------
     12. Authentification
     ---------------------------------------------------------------------- */

  document.getElementById("btn-login").addEventListener("click", () => {
    document.getElementById("login-error").textContent = "";
    openModal("login-modal");
  });

  document.getElementById("login-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("login-email").value.trim();
    const pass = document.getElementById("login-password").value;
    const btn = document.getElementById("login-submit");
    const errEl = document.getElementById("login-error");
    errEl.textContent = "";
    btn.disabled = true;
    auth.signInWithEmailAndPassword(email, pass)
      .then(() => {
        closeModal("login-modal");
        document.getElementById("login-form").reset();
        showToast("Connecté — mode édition activé");
      })
      .catch(() => { errEl.textContent = "Adresse e-mail ou mot de passe incorrect."; })
      .finally(() => { btn.disabled = false; });
  });

  document.getElementById("btn-logout").addEventListener("click", () => {
    auth.signOut().then(() => showToast("Déconnecté"));
  });

  auth.onAuthStateChanged((user) => {
    isAdmin = !!user;
    document.body.classList.toggle("admin-mode", isAdmin);
    document.getElementById("btn-login").style.display = isAdmin ? "none" : "inline-flex";
    renderAll();
  });

  /* ----------------------------------------------------------------------
     13. Synchronisation Firestore en direct (onSnapshot)
     ---------------------------------------------------------------------- */

  contentRef.onSnapshot((doc) => {
    if (doc.exists) {
      const data = doc.data() || {};
      content = {
        texts: data.texts || {},
        pages: Array.isArray(data.pages) && data.pages.length ? data.pages : generateDefaultContent().pages
      };
    } else if (firstLoad) {
      content = generateDefaultContent();
      contentRef.set(content).catch(err => console.error(err));
    }
    firstLoad = false;
    renderAll();
  }, (err) => {
    console.error("Firestore:", err);
    renderAll();
  });

  /* ----------------------------------------------------------------------
     14. Divers — menu mobile, année, confort d'utilisation
     ---------------------------------------------------------------------- */

  document.getElementById("menu-toggle").addEventListener("click", () => {
    document.getElementById("site-header").classList.toggle("nav-open");
  });

  document.getElementById("year").textContent = new Date().getFullYear();

  window.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    document.querySelectorAll(".modal.open").forEach(m => m.classList.remove("open"));
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 900) {
      document.getElementById("site-header").classList.remove("nav-open");
    }
  });

  window.addEventListener("beforeunload", (e) => {
    if (saveTimer) { e.preventDefault(); e.returnValue = ""; }
  });

  renderAll();

})();
