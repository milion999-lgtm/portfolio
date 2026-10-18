const introScreen = document.getElementById('intro-screen');
const introSkip = document.getElementById('intro-skip');
const introPercent = document.getElementById('intro-percent');
const introProgressBar = document.getElementById('intro-progress-bar');

if (introScreen && document.documentElement.classList.contains('has-intro')) {
  let introStartedAt = null;
  let introClosing = false;
  const closeIntro = () => {
    if (introClosing) return;
    introClosing = true;
    try { sessionStorage.setItem('bader-cinematic-intro-seen-v2', '1'); } catch {}
    document.documentElement.classList.add('intro-finished');
    introScreen.classList.add('is-leaving');
    window.setTimeout(() => {
      introScreen.remove();
      document.documentElement.classList.remove('has-intro');
    }, 900);
  };
  const animateIntro = (timestamp) => {
    if (introStartedAt === null) introStartedAt = timestamp;
    const progress = Math.min((timestamp - introStartedAt) / 4800, 1);
    const percentage = String(Math.round(progress * 100)).padStart(2, '0') + '%';
    introPercent.textContent = percentage;
    introProgressBar.style.width = percentage;
    if (progress >= 1) closeIntro();
    else window.requestAnimationFrame(animateIntro);
  };
  introSkip.addEventListener('click', closeIntro);
  introSkip.focus({ preventScroll: true });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !introClosing) closeIntro();
  });
  window.requestAnimationFrame(animateIntro);
} else {
  introScreen?.remove();
}

document.getElementById('year').textContent = new Date().getFullYear();

// Add your real projects here. Use status: "completed" or status: "ongoing".
const projects = [
  { title: "DEV 202 Contributions Tracker", type: "Dashboard", year: "OFPPT", description: "Tableau de bord pour suivre les contributions, historiques, classements, pénalités, retraits et bilans hebdomadaires.", tools: "HTML, CSS, JavaScript, LocalStorage", status: "completed", live: "https://milion999-lgtm.github.io/portfolio/projects/count/", source: "https://github.com/milion999-lgtm/portfolio/tree/main/projects/count" },
  { title: "BioProduits", type: "Site e-commerce", year: "OFPPT", description: "Boutique de produits biologiques avec catalogue, pages de présentation, panier et navigation entre les produits.", tools: "HTML, CSS, JavaScript, Bootstrap 5", status: "completed", live: "https://milion999-lgtm.github.io/bioproduits/", source: "https://github.com/milion999-lgtm/bioproduits" },
  { title: "MedRendez", type: "Concept de site santé", year: "OFPPT", description: "Page d’accueil conceptuelle pour découvrir des médecins, rechercher des services et présenter une prise de rendez-vous.", tools: "HTML, CSS, Bootstrap 5", status: "completed" },
  { title: "Bella Cucina", type: "Projet en équipe · Restaurant", year: "OFPPT", description: "Site de présentation d’un restaurant avec menu, histoire, galerie et section de contact. Concept fictif de démonstration.", tools: "HTML, CSS, Bootstrap 5", status: "completed", live: "https://milion999-lgtm.github.io/portfolio/projects/bella-cucina/", source: "https://github.com/milion999-lgtm/portfolio/tree/main/projects/bella-cucina" },
  { title: "Book Catalogue", type: "Application web", year: "OFPPT", description: "Catalogue de livres avec Laravel, PHP, Blade et une base de données MySQL.", tools: "PHP, Laravel, MySQL, Blade", status: "completed" },
  { title: "Car Rental Manager", type: "Application React", year: "OFPPT", description: "Interface React pour ajouter et consulter des véhicules dans une petite application de location.", tools: "React, Vite, Axios", status: "completed" },
  { title: "Product Inventory Manager", type: "Application React", year: "OFPPT", description: "Gestion d’une liste de produits avec recherche, quantités en stock, ajout, suppression et mise à jour.", tools: "React, JavaScript, Vite", status: "completed" },
  { title: "Team Score Manager", type: "Application React", year: "OFPPT", description: "Gestion d’une équipe de joueurs, modification des scores et réinitialisation du tableau.", tools: "React, JavaScript, Vite", status: "completed" },
  { title: "Training Registration Form", type: "Formulaire React", year: "OFPPT", description: "Formulaire d’inscription à une formation construit avec des composants React.", tools: "React, JavaScript, Vite", status: "completed" },
  { title: "Student Profile & Dice Games", type: "Exercices React", year: "OFPPT", description: "Exercices avec fiches de profil, compteurs et petits jeux de dés interactifs.", tools: "React, JavaScript, Vite", status: "completed" },
  { title: "Travaux pratiques web", type: "Ensemble d’exercices", year: "OFPPT", description: "Exercices HTML, CSS et JavaScript sur les pages, formulaires, mises en page adaptatives et interactions DOM.", tools: "HTML, CSS, JavaScript, Bootstrap", status: "completed" },
  { title: "Exercices Python & SQL", type: "Ensemble d’exercices", year: "OFPPT", description: "Exercices de programmation Python et de requêtes sur bases de données SQL.", tools: "Python, SQL", status: "completed" },
];

function renderProjects(status, targetId) {
  const target = document.getElementById(targetId);
  const matchingProjects = projects.filter((project) => project.status === status);
  if (!matchingProjects.length) {
    target.innerHTML = `<p class="empty-projects">${status === 'completed' ? 'Les réalisations terminées' : 'Les projets en cours'} apparaîtront ici.</p>`;
    return;
  }
  target.innerHTML = matchingProjects.map((project, index) => {
    const card = `<article class="project-card"><div class="project-card-top"><span>${String(index + 1).padStart(2, '0')} / ${project.type}</span><span>${project.year}</span></div><h4>${project.title}</h4><p>${project.description}</p><div class="project-card-bottom"><span>${project.tools}</span>${(project.live || project.source) ? `<span class="project-links">${project.live ? `<a href="${project.live}" target="_blank" rel="noreferrer">LIVE DEMO ↗</a>` : ''}${project.source ? `<a href="${project.source}" target="_blank" rel="noreferrer">SOURCE ↗</a>` : ''}</span>` : ''}</div></article>`;
    return card;
  }).join('');
}

renderProjects('completed', 'completed-projects');
renderProjects('ongoing', 'ongoing-projects');

// A small reveal on scroll keeps the page lively without getting in the way.
const revealItems = document.querySelectorAll('.project-card, .about-grid, .contact h2, .contact-link');
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

revealItems.forEach((item, index) => {
  item.classList.add('reveal');
  if (item.classList.contains('project-card')) {
    item.style.setProperty('--reveal-delay', ((index % 3) * 90) + 'ms');
  }
  observer.observe(item);
});

