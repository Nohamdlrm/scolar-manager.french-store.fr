/* =========================================================================
   CAMPUS ROSA PARKS — app.js
   - Authentification Firebase (mot de passe jamais présent dans le code)
   - Contenu stocké dans Firestore, synchronisé en direct pour tout le monde
   - Édition de texte au fil de l'eau + gestion des filières / offres / services
   ========================================================================= */

(function () {
  "use strict";

  /* ----------------------------------------------------------------------
     0. Bibliothèque d'icônes (SVG "emoji" maison, réutilisées partout)
     ---------------------------------------------------------------------- */

  const ICONS = {
    livre:    '<svg viewBox="0 0 48 48" fill="none"><path d="M24 12c-5-4-13-4-18-1v26c5-3 13-3 18 1 5-4 13-4 18-1V11c-5-3-13-3-18 1Z" fill="#D9A441" stroke="#17233C" stroke-width="2" stroke-linejoin="round"/><path d="M24 12v26" stroke="#17233C" stroke-width="2"/></svg>',
    beaker:   '<svg viewBox="0 0 48 48" fill="none"><path d="M19 6h10M20 6v13l-11 19a4 4 0 0 0 3.5 6h23a4 4 0 0 0 3.5-6L28 19V6" fill="#D9A441" stroke="#17233C" stroke-width="2" stroke-linejoin="round"/><path d="M15 30h18" stroke="#17233C" stroke-width="2"/></svg>',
    outil:    '<svg viewBox="0 0 48 48" fill="none"><path d="M31 6a9 9 0 0 0-11 11L7 30l6 6 13-13a9 9 0 0 0 11-11l-6 6-5-1-1-5 6-6Z" fill="#B23A2E" stroke="#17233C" stroke-width="2" stroke-linejoin="round"/></svg>',
    chip:     '<svg viewBox="0 0 48 48" fill="none"><rect x="12" y="12" width="24" height="24" rx="3" fill="#17233C"/><rect x="18" y="18" width="12" height="12" rx="2" fill="#D9A441"/><path d="M20 6v6M28 6v6M20 36v6M28 36v6M6 20h6M6 28h6M36 20h6M36 28h6" stroke="#17233C" stroke-width="2.2" stroke-linecap="round"/></svg>',
    balance:  '<svg viewBox="0 0 48 48" fill="none"><path d="M24 6v36M12 14h24M12 14 6 26h12l-6-12ZM36 14l-6 12h12l-6-12Z" stroke="#17233C" stroke-width="2.2" fill="none" stroke-linejoin="round"/><rect x="16" y="40" width="16" height="3" rx="1.5" fill="#D9A441"/></svg>',
    coeur:    '<svg viewBox="0 0 48 48" fill="none"><path d="M24 41S6 29 6 16a10 10 0 0 1 18-6 10 10 0 0 1 18 6c0 13-18 25-18 25Z" fill="#B23A2E" stroke="#17233C" stroke-width="2" stroke-linejoin="round"/></svg>',
    briefcase:'<svg viewBox="0 0 48 48" fill="none"><rect x="6" y="16" width="36" height="24" rx="4" fill="#D9A441" stroke="#17233C" stroke-width="2"/><path d="M17 16v-4a3 3 0 0 1 3-3h8a3 3 0 0 1 3 3v4" stroke="#17233C" stroke-width="2"/><path d="M6 26h36" stroke="#17233C" stroke-width="2"/></svg>',
    lien:     '<svg viewBox="0 0 48 48" fill="none"><path d="M20 28 28 20" stroke="#17233C" stroke-width="2.4" stroke-linecap="round"/><path d="M26 14l3-3a8 8 0 0 1 11 11l-4 4M22 34l-3 3a8 8 0 0 1-11-11l4-4" stroke="#B23A2E" stroke-width="2.4" fill="none" stroke-linecap="round"/></svg>',
    plateau:  '<svg viewBox="0 0 48 48" fill="none"><rect x="6" y="22" width="36" height="6" rx="2" fill="#D9A441"/><circle cx="16" cy="16" r="6" fill="#17233C"/><circle cx="32" cy="16" r="6" fill="#B23A2E"/><rect x="10" y="30" width="28" height="10" rx="2" fill="#17233C"/></svg>',
    calendrier:'<svg viewBox="0 0 48 48" fill="none"><rect x="7" y="10" width="34" height="30" rx="4" fill="#F5EFE1" stroke="#17233C" stroke-width="2"/><path d="M7 19h34" stroke="#17233C" stroke-width="2"/><path d="M15 6v8M33 6v8" stroke="#B23A2E" stroke-width="2.4" stroke-linecap="round"/><rect x="14" y="24" width="6" height="6" fill="#D9A441"/></svg>'
  };
  const ICON_KEYS = Object.keys(ICONS);
  const iconSvg = (key) => ICONS[key] || ICONS.lien;

  /* ----------------------------------------------------------------------
     1. Contenu par défaut (utilisé si Firestore est vide au 1er chargement)
     ---------------------------------------------------------------------- */

  const DEFAULT_CONTENT = {
    texts: {},
    filieres: [
      { id: "f1", nom: "Seconde générale et technologique", niveau: "Seconde", icon: "livre", description: "Un tronc commun solide pour construire son projet d'orientation en toute confiance." },
      { id: "f2", nom: "Première et Terminale générales", niveau: "Cycle terminal", icon: "beaker", description: "Spécialités scientifiques, littéraires et économiques pour préparer le baccalauréat." },
      { id: "f3", nom: "STMG", niveau: "Technologique", icon: "chip", description: "Gestion, management et numérique, au plus près des réalités de l'entreprise." },
      { id: "f4", nom: "Bac professionnel", niveau: "Professionnel", icon: "outil", description: "Des parcours concrets menant à l'emploi ou à la poursuite d'études en BTS." },
      { id: "f5", nom: "Section européenne", niveau: "Option", icon: "balance", description: "Un renforcement linguistique et culturel ouvert sur l'international." },
      { id: "f6", nom: "Accompagnement personnalisé", niveau: "Transversal", icon: "coeur", description: "Un suivi individuel pour consolider les acquis et gagner en autonomie." }
    ],
    jobs: [
      { id: "j1", titre: "Professeur·e de mathématiques", contrat: "Temps plein", lieu: "Campus Rosa Parks", lien: "", description: "Rejoignez l'équipe de mathématiques pour les classes de seconde et de première." },
      { id: "j2", titre: "Assistant·e d'éducation", contrat: "Temps partiel", lieu: "Vie scolaire", lien: "", description: "Encadrement et suivi des élèves au sein de la vie scolaire du campus." }
    ],
    services: [
      { id: "s1", nom: "Turabo Self", icon: "plateau", description: "Réservation et paiement des repas de la cantine du campus.", lien: "https://self.campus-rosaparks.fr/" },
      { id: "s2", nom: "Espace numérique de travail", icon: "chip", description: "Emploi du temps, notes et messagerie avec les équipes pédagogiques.", lien: "#" },
      { id: "s3", nom: "Vie scolaire en ligne", icon: "calendrier", description: "Absences, retards et informations de vie scolaire en temps réel.", lien: "#" }
    ]
  };

  let content = JSON.parse(JSON.stringify(DEFAULT_CONTENT));
  let isAdmin = false;
  let saveTimer = null;
  const contentRef = db.collection("site").doc("contenu");

  /* ----------------------------------------------------------------------
     2. Utilitaires
     ---------------------------------------------------------------------- */

  function uid(prefix) {
    return prefix + "_" + Math.random().toString(36).slice(2, 9);
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

  function openModal(id) { document.getElementById(id).classList.add("open"); }
  function closeModal(id) { document.getElementById(id).classList.remove("open"); }

  document.querySelectorAll("[data-close-modal]").forEach(btn => {
    btn.addEventListener("click", () => btn.closest(".modal").classList.remove("open"));
  });
  document.querySelectorAll(".modal").forEach(m => {
    m.addEventListener("click", (e) => { if (e.target === m) m.classList.remove("open"); });
  });

  /* ----------------------------------------------------------------------
     3. Sauvegarde Firestore (debounced) — visible instantanément pour tous
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
     4. Rendu — textes éditables
     ---------------------------------------------------------------------- */

  function applyTexts() {
    document.querySelectorAll("[data-editable]").forEach(el => {
      if (document.activeElement === el) return; // on ne touche pas au champ en cours de frappe
      const key = el.getAttribute("data-editable");
      const value = content.texts[key];
      if (value != null && el.innerHTML !== value) {
        el.innerHTML = value;
      } else if (value == null) {
        content.texts[key] = el.innerHTML; // première initialisation
      }
    });
  }

  function bindEditableTexts() {
    document.querySelectorAll("[data-editable]").forEach(el => {
      el.addEventListener("blur", () => {
        if (!isAdmin) return;
        const key = el.getAttribute("data-editable");
        content.texts[key] = el.innerHTML;
        scheduleSave();
      });
    });
  }

  function setEditableState() {
    document.querySelectorAll("[data-editable]").forEach(el => {
      el.setAttribute("contenteditable", isAdmin ? "true" : "false");
    });
  }

  /* ----------------------------------------------------------------------
     5. Rendu — Filières
     ---------------------------------------------------------------------- */

  function renderFilieres() {
    const grid = document.getElementById("filieres-grid");
    grid.innerHTML = "";
    content.filieres.forEach(f => {
      const card = document.createElement("div");
      card.className = "card filiere-card";
      card.innerHTML = `
        <div class="card-admin-actions">
          <button class="icon-btn" data-edit-filiere="${f.id}" title="Modifier">${editPen()}</button>
          <button class="icon-btn" data-del-filiere="${f.id}" title="Supprimer">${trash()}</button>
        </div>
        <div class="card-icon">${iconSvg(f.icon)}</div>
        <span class="filiere-level">${escapeHtml(f.niveau)}</span>
        <h3>${escapeHtml(f.nom)}</h3>
        <p>${escapeHtml(f.description)}</p>
      `;
      grid.appendChild(card);
    });
    const addTile = document.createElement("button");
    addTile.type = "button";
    addTile.className = "admin-add-tile";
    addTile.id = "btn-add-filiere";
    addTile.innerHTML = `${plusCircle()}<span>Ajouter une filière</span>`;
    grid.appendChild(addTile);

    grid.querySelectorAll("[data-edit-filiere]").forEach(b => b.addEventListener("click", () => openFiliereForm(b.dataset.editFiliere)));
    grid.querySelectorAll("[data-del-filiere]").forEach(b => b.addEventListener("click", () => confirmDelete("filieres", b.dataset.delFiliere, "cette filière")));
    document.getElementById("btn-add-filiere").addEventListener("click", () => openFiliereForm(null));
  }

  function openFiliereForm(id) {
    const existing = id ? content.filieres.find(f => f.id === id) : null;
    document.getElementById("item-modal-title").textContent = existing ? "Modifier la filière" : "Ajouter une filière";
    document.getElementById("item-modal-sub").textContent = "Ces informations sont visibles par tous les visiteurs du site.";
    const fields = document.getElementById("item-form-fields");
    fields.innerHTML = `
      <div class="field"><label>Nom de la filière</label><input id="f-nom" required value="${existing ? escapeAttr(existing.nom) : ""}"></div>
      <div class="field"><label>Niveau</label><input id="f-niveau" required value="${existing ? escapeAttr(existing.niveau) : ""}"></div>
      <div class="field"><label>Description</label><textarea id="f-desc" required>${existing ? escapeHtml(existing.description) : ""}</textarea></div>
      <div class="field"><label>Icône</label>${iconSelect("f-icon", existing ? existing.icon : "livre")}</div>
    `;
    const form = document.getElementById("item-form");
    form.onsubmit = (e) => {
      e.preventDefault();
      const data = {
        id: existing ? existing.id : uid("f"),
        nom: document.getElementById("f-nom").value.trim(),
        niveau: document.getElementById("f-niveau").value.trim(),
        description: document.getElementById("f-desc").value.trim(),
        icon: document.getElementById("f-icon").value
      };
      if (!data.nom) return;
      if (existing) {
        const idx = content.filieres.findIndex(f => f.id === existing.id);
        content.filieres[idx] = data;
      } else {
        content.filieres.push(data);
      }
      renderFilieres();
      scheduleSave();
      closeModal("item-modal");
      showToast("Filière enregistrée");
    };
    openModal("item-modal");
  }

  /* ----------------------------------------------------------------------
     6. Rendu — Offres (Nous rejoindre)
     ---------------------------------------------------------------------- */

  function renderJobs() {
    const list = document.getElementById("jobs-list");
    list.innerHTML = "";
    if (content.jobs.length === 0) {
      list.innerHTML = `
        <div class="empty-state">
          ${briefcaseOutline()}
          <p>Aucun poste n'est à pourvoir pour le moment.</p>
        </div>`;
    }
    content.jobs.forEach(j => {
      const row = document.createElement("div");
      row.className = "job-card";
      row.innerHTML = `
        <div class="job-main">
          <div class="job-icon">${ICONS.briefcase}</div>
          <div>
            <div class="job-title">${escapeHtml(j.titre)}</div>
            <div class="job-meta">
              ${j.contrat ? `<span class="job-tag">${escapeHtml(j.contrat)}</span>` : ""}
              ${j.lieu ? `<span class="job-tag">${escapeHtml(j.lieu)}</span>` : ""}
            </div>
            ${j.description ? `<p class="job-desc">${escapeHtml(j.description)}</p>` : ""}
          </div>
        </div>
        <div class="job-actions">
          ${j.lien ? `<a href="${escapeAttr(j.lien)}" target="_blank" rel="noopener" class="btn btn-outline-ink btn-sm">Postuler</a>` : ""}
          <div class="job-admin-actions">
            <button class="icon-btn" data-edit-job="${j.id}" title="Modifier">${editPen()}</button>
            <button class="icon-btn" data-del-job="${j.id}" title="Supprimer">${trash()}</button>
          </div>
        </div>
      `;
      list.appendChild(row);
    });
    list.querySelectorAll("[data-edit-job]").forEach(b => b.addEventListener("click", () => openJobForm(b.dataset.editJob)));
    list.querySelectorAll("[data-del-job]").forEach(b => b.addEventListener("click", () => confirmDelete("jobs", b.dataset.delJob, "ce poste")));
  }

  function openJobForm(id) {
    const existing = id ? content.jobs.find(j => j.id === id) : null;
    document.getElementById("item-modal-title").textContent = existing ? "Modifier le poste" : "Ajouter un poste";
    document.getElementById("item-modal-sub").textContent = "Le poste sera visible immédiatement sur la page « Nous rejoindre ».";
    const fields = document.getElementById("item-form-fields");
    fields.innerHTML = `
      <div class="field"><label>Intitulé du poste</label><input id="j-titre" required value="${existing ? escapeAttr(existing.titre) : ""}"></div>
      <div class="field"><label>Type de contrat</label><input id="j-contrat" value="${existing ? escapeAttr(existing.contrat) : ""}" placeholder="Ex. Temps plein"></div>
      <div class="field"><label>Lieu / service</label><input id="j-lieu" value="${existing ? escapeAttr(existing.lieu) : ""}" placeholder="Ex. Vie scolaire"></div>
      <div class="field"><label>Description</label><textarea id="j-desc">${existing ? escapeHtml(existing.description) : ""}</textarea></div>
      <div class="field"><label>Lien de candidature (optionnel)</label><input id="j-lien" value="${existing ? escapeAttr(existing.lien) : ""}" placeholder="https://…"></div>
    `;
    const form = document.getElementById("item-form");
    form.onsubmit = (e) => {
      e.preventDefault();
      const data = {
        id: existing ? existing.id : uid("j"),
        titre: document.getElementById("j-titre").value.trim(),
        contrat: document.getElementById("j-contrat").value.trim(),
        lieu: document.getElementById("j-lieu").value.trim(),
        description: document.getElementById("j-desc").value.trim(),
        lien: normalizeUrl(document.getElementById("j-lien").value)
      };
      if (!data.titre) return;
      if (existing) {
        const idx = content.jobs.findIndex(j => j.id === existing.id);
        content.jobs[idx] = data;
      } else {
        content.jobs.push(data);
      }
      renderJobs();
      scheduleSave();
      closeModal("item-modal");
      showToast("Poste enregistré");
    };
    openModal("item-modal");
  }

  document.getElementById("btn-add-job").addEventListener("click", () => openJobForm(null));

  /* ----------------------------------------------------------------------
     7. Rendu — Services (plateformes)
     ---------------------------------------------------------------------- */

  function renderServices() {
    const grid = document.getElementById("services-grid");
    grid.innerHTML = "";
    content.services.forEach(s => {
      const card = document.createElement("div");
      card.className = "card service-card";
      card.innerHTML = `
        <div class="card-admin-actions">
          <button class="icon-btn" data-edit-service="${s.id}" title="Modifier">${editPen()}</button>
          <button class="icon-btn" data-del-service="${s.id}" title="Supprimer">${trash()}</button>
        </div>
        <div class="card-icon">${iconSvg(s.icon)}</div>
        <h3>${escapeHtml(s.nom)}</h3>
        <p>${escapeHtml(s.description)}</p>
        <a class="service-link" href="${escapeAttr(s.lien || "#")}" target="_blank" rel="noopener">
          Ouvrir le service
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M7 17 17 7M9 7h8v8"/></svg>
        </a>
      `;
      grid.appendChild(card);
    });
    const addTile = document.createElement("button");
    addTile.type = "button";
    addTile.className = "admin-add-tile";
    addTile.id = "btn-add-service";
    addTile.innerHTML = `${plusCircle()}<span>Ajouter un service</span>`;
    grid.appendChild(addTile);

    grid.querySelectorAll("[data-edit-service]").forEach(b => b.addEventListener("click", () => openServiceForm(b.dataset.editService)));
    grid.querySelectorAll("[data-del-service]").forEach(b => b.addEventListener("click", () => confirmDelete("services", b.dataset.delService, "ce service")));
    document.getElementById("btn-add-service").addEventListener("click", () => openServiceForm(null));
  }

  function openServiceForm(id) {
    const existing = id ? content.services.find(s => s.id === id) : null;
    document.getElementById("item-modal-title").textContent = existing ? "Modifier le service" : "Ajouter un service";
    document.getElementById("item-modal-sub").textContent = "Le service apparaîtra avec un lien cliquable sur la page « Nos services ».";
    const fields = document.getElementById("item-form-fields");
    fields.innerHTML = `
      <div class="field"><label>Nom du service</label><input id="s-nom" required value="${existing ? escapeAttr(existing.nom) : ""}"></div>
      <div class="field"><label>Description</label><textarea id="s-desc" required>${existing ? escapeHtml(existing.description) : ""}</textarea></div>
      <div class="field"><label>Lien du service</label><input id="s-lien" required value="${existing ? escapeAttr(existing.lien) : ""}" placeholder="https://…"></div>
      <div class="field"><label>Icône</label>${iconSelect("s-icon", existing ? existing.icon : "lien")}</div>
    `;
    const form = document.getElementById("item-form");
    form.onsubmit = (e) => {
      e.preventDefault();
      const data = {
        id: existing ? existing.id : uid("s"),
        nom: document.getElementById("s-nom").value.trim(),
        description: document.getElementById("s-desc").value.trim(),
        lien: normalizeUrl(document.getElementById("s-lien").value),
        icon: document.getElementById("s-icon").value
      };
      if (!data.nom) return;
      if (existing) {
        const idx = content.services.findIndex(s => s.id === existing.id);
        content.services[idx] = data;
      } else {
        content.services.push(data);
      }
      renderServices();
      scheduleSave();
      closeModal("item-modal");
      showToast("Service enregistré");
    };
    openModal("item-modal");
  }

  /* ----------------------------------------------------------------------
     8. Suppression (confirmation commune aux 3 listes)
     ---------------------------------------------------------------------- */

  function confirmDelete(collection, id, label) {
    document.getElementById("confirm-text").textContent = `Voulez-vous vraiment supprimer ${label} ? Cette action est visible par tout le monde immédiatement.`;
    const btn = document.getElementById("confirm-delete-btn");
    btn.onclick = () => {
      content[collection] = content[collection].filter(item => item.id !== id);
      if (collection === "filieres") renderFilieres();
      if (collection === "jobs") renderJobs();
      if (collection === "services") renderServices();
      scheduleSave();
      closeModal("confirm-modal");
      showToast("Élément supprimé");
    };
    openModal("confirm-modal");
  }

  /* ----------------------------------------------------------------------
     9. Icônes utilitaires (pictogrammes d'interface)
     ---------------------------------------------------------------------- */

  function editPen() { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>'; }
  function trash() { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 7h16M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2m-8 0 1 13a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2l1-13"/></svg>'; }
  function plusCircle() { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M12 8v8M8 12h8"/></svg>'; }
  function briefcaseOutline() { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="8" width="18" height="12" rx="2"/><path d="M8 8V6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>'; }
  function escapeAttr(str) { return escapeHtml(str).replace(/"/g, "&quot;"); }
  function iconSelect(id, current) {
    const opts = ICON_KEYS.map(k => `<option value="${k}" ${k === current ? "selected" : ""}>${k}</option>`).join("");
    return `<select id="${id}">${opts}</select>`;
  }

  /* ----------------------------------------------------------------------
     10. Routage — une page visible à la fois, menu fixe
     ---------------------------------------------------------------------- */

  const PAGES = ["accueil", "apropos", "filieres", "rejoindre", "services"];

  function showPage(name) {
    if (!PAGES.includes(name)) name = "accueil";
    PAGES.forEach(p => {
      document.getElementById("page-" + p).classList.toggle("active", p === name);
    });
    document.querySelectorAll(".main-nav a").forEach(a => {
      a.classList.toggle("active", a.dataset.page === name);
    });
    document.getElementById("site-header").classList.remove("nav-open");
    window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
  }

  window.addEventListener("hashchange", () => showPage(location.hash.replace("#", "")));

  /* ----------------------------------------------------------------------
     11. Authentification
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
      .catch(() => {
        errEl.textContent = "Adresse e-mail ou mot de passe incorrect.";
      })
      .finally(() => { btn.disabled = false; });
  });

  document.getElementById("btn-logout").addEventListener("click", () => {
    auth.signOut().then(() => showToast("Déconnecté"));
  });

  auth.onAuthStateChanged((user) => {
    isAdmin = !!user;
    document.body.classList.toggle("admin-mode", isAdmin);
    document.getElementById("btn-login").style.display = isAdmin ? "none" : "inline-flex";
    document.querySelectorAll(".admin-only").forEach(el => { el.style.display = isAdmin ? "inline-flex" : "none"; });
    setEditableState();
    renderFilieres();
    renderJobs();
    renderServices();
  });

  /* ----------------------------------------------------------------------
     12. Synchronisation Firestore en direct (onSnapshot)
     ---------------------------------------------------------------------- */

  let firstLoad = true;
  contentRef.onSnapshot((doc) => {
    if (doc.exists) {
      content = doc.data();
      content.texts = content.texts || {};
      content.filieres = content.filieres || [];
      content.jobs = content.jobs || [];
      content.services = content.services || [];
    } else if (firstLoad) {
      content = JSON.parse(JSON.stringify(DEFAULT_CONTENT));
      contentRef.set(content).catch(err => console.error(err));
    }
    firstLoad = false;
    applyTexts();
    renderFilieres();
    renderJobs();
    renderServices();
  }, (err) => {
    console.error("Firestore:", err);
    // Site quand même utilisable en lecture avec le contenu par défaut
    applyTexts();
    renderFilieres();
    renderJobs();
    renderServices();
  });

  /* ----------------------------------------------------------------------
     13. Divers — menu mobile, année, init
     ---------------------------------------------------------------------- */

  document.getElementById("menu-toggle").addEventListener("click", () => {
    document.getElementById("site-header").classList.toggle("nav-open");
  });

  document.getElementById("year").textContent = new Date().getFullYear();

  /* ----------------------------------------------------------------------
     14. Confort d'utilisation
     ---------------------------------------------------------------------- */

  // Fermer n'importe quelle modale ouverte avec la touche Échap
  window.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    document.querySelectorAll(".modal.open").forEach(m => m.classList.remove("open"));
  });

  // Normalise un lien saisi par l'admin : ajoute "https://" si absent,
  // pour éviter les liens cassés du type "self.campus-rosaparks.fr".
  function normalizeUrl(value) {
    const v = (value || "").trim();
    if (!v || v === "#") return v;
    if (/^https?:\/\//i.test(v) || v.startsWith("/") || v.startsWith("#")) return v;
    return "https://" + v;
  }

  // Ferme automatiquement le menu mobile si la fenêtre repasse en format bureau,
  // pour éviter un menu resté ouvert après un redimensionnement.
  window.addEventListener("resize", () => {
    if (window.innerWidth > 720) {
      document.getElementById("site-header").classList.remove("nav-open");
    }
  });

  // Empêche la fermeture accidentelle de la fenêtre pendant un enregistrement
  // en cours (évite de perdre une modification tapée juste avant de fermer l'onglet).
  window.addEventListener("beforeunload", (e) => {
    if (saveTimer) { e.preventDefault(); e.returnValue = ""; }
  });

  bindEditableTexts();
  applyTexts();
  renderFilieres();
  renderJobs();
  renderServices();
  showPage(location.hash.replace("#", "") || "accueil");

})();
