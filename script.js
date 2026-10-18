const introScreen = document.getElementById('intro-screen');
const introSkip = document.getElementById('intro-skip');
const introProgressBar = document.getElementById('intro-progress-bar');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (introScreen && document.documentElement.classList.contains('has-intro')) {
  const duration = 5600;
  const startedAt = performance.now();
  let closing = false;
  const closeIntro = () => {
    if (closing) return;
    closing = true;
    try { sessionStorage.setItem('bader-cinematic-intro-seen-v2', '1'); } catch {}
    document.documentElement.classList.add('intro-finished');
    introScreen.classList.add('is-leaving');
    window.setTimeout(() => {
      introScreen.remove();
      document.documentElement.classList.remove('has-intro');
    }, 900);
  };
  const animateIntro = (timestamp) => {
    if (!introScreen.isConnected || closing) return;
    const progress = Math.min((timestamp - startedAt) / duration, 1);
    if (introProgressBar) introProgressBar.style.width = (progress * 100) + '%';
    if (progress >= 1) closeIntro();
    else window.requestAnimationFrame(animateIntro);
  };
  introSkip?.addEventListener('click', closeIntro);
  introSkip?.focus({ preventScroll: true });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !closing) closeIntro();
  });
  window.requestAnimationFrame(animateIntro);
} else {
  introScreen?.remove();
}

document.getElementById('year').textContent = new Date().getFullYear();

// This compact luminance map is generated from the supplied portrait.
// The website draws it as a live particle field; it never loads or displays the photo.
const portraitMap = 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAKqqqqoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACqqqqqqgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAKqqqqqqqqoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACqqqqqqqqqqgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAKqqqqqqqqqqqqoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACqqqqqqqqqqqqqqgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAqqqqmJiJmZmauqqqAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAKqqqoVEREVVVWeaqqsAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACqqYh1REM0REMzM1eKqwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAqoZTNDM0REQzMzRDVXmqAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAKlzM0RDIjREM0QzNEREVWgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACXUkQzMzMjM0REREQzNENFRwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAZTIkMzMzMiI0REQ0RDNDNFRGAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADMyIyIyMzMyIjMzNFRERFM0RUYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAyMyIyIiMzMzIjMiMzRDI0MjNFVQAAAAAAAAAAAAAAAAAAAAAAAAAA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IiIiIiIiEREREiIiIiIiIiIiIiIiIiIiIiIiIiESMzMzMzMkRVVERERETO3eyEIiMzMzMzMzMzIiIiIjIiIiIiIhEREREiIiIiIiIiIiIiIiIiIiIiIiIiESIzMzMzMkVFRERERES+3dt0IiMzQzMzMzMzIiIiIjIiIiIiIhEREREiIiIiIiIiIiIiIiIiIiIiIiIiIRIzMzMzMjVURERERESu3dtkIiMzMzMzMzMzIiIiIjIiIiIiIhERERESIiIiIiIiIiIiIiIiIiIiIiIiIREzMzMzMzVERERERFSe3dplIiMzMzMzMzMzIiIiIjIiIiIiIhERERESIiIiIiIiIiIiIiIiIiIiIiIiIhEjMzMzMzRERERERER+3dpUISMzMzMzMzMzIiIiIzIiIiIiIhERERESIiIiIiIiIiIiIiIiIiIiIiIiIhESMzMzMzREREREVERt3dpUIiMzMzMzMzMzIiIiIzIiIiIiIhERERESIiIiIiIiIiIiIiIiIiIiIiIiIiESMzMzMzRERERERERd3dtUISMzMzMzMzMzIiIiMzIiIiIiIhERERERIiIiIiIiIiIiIiIiIiIiIiIiIiERIzMzMzRERERERERM3dtTIiMzMzMzMzMyIiIiMjIiIiIiIhEREREREiIiIiIiIiIiIiIiIiIiIiIiIiIRIzMzMzRERERERERL3dxTISMzM0MzMzMyIiIiIjIiIiIiIhEREREREiIiIiIiIiIiIiIiIiIiIiIiIiIREjMzMzREREREREQ63NxiIiMzMzMzMzMyIiIiIjIiIiIiIhERERERERIiIiIiIiIiIiIiIiIiIiIiIiIREjMzMzNEREREREQ53MtiIiMzMzMzMzMyIiIiIjIiIiIiIhERERERERIiIiIiIiIiIiIiIiIiIiIiIiIhESMzMzNEREREREQ43MtyIiIzMzMzMzMyIiIiIiIiIiIiIhERERERERIiIiIiIiIiIiIiIiIiIiIiIiIhESMzMzNEREREREQ33MtyEiIzMzMzMzMyIiIiIiIiIiIiIREREREREREiIiIiIiIiIiIiIiIiIiIiIiIiERIzMzNEREREREQ23MtzEiIzMzMzMzMyIiIiIiIiIiIiIRERERERERESIiIiIiIiIiIiIiIiIiIiIiIiERIzMzM0REREREQ1zLpzEiIzMzMzMzMyIiIiIi';
const portraitColumns = 120;
const portraitRows = 180;
const portraitBytes = Uint8Array.from(atob(portraitMap), (character) => character.charCodeAt(0));

function buildPortraitDots() {
  const buckets = Array.from({ length: 16 }, () => []);
  let seed = 48971;
  const random = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
  const cellCount = portraitColumns * portraitRows;
  for (let index = 0; index < cellCount; index++) {
    const packed = portraitBytes[index >> 1];
    const shade = (index & 1) === 0 ? packed >> 4 : packed & 15;
    if (shade === 0) continue;
    const col = index % portraitColumns;
    const row = Math.floor(index / portraitColumns);
    const centerDistance = Math.hypot((col / portraitColumns) - .5, (row / portraitRows) - .44);
    buckets[shade].push({
      x: col + .5 + (random() - .5) * .52,
      y: row + .5 + (random() - .5) * .52,
      radius: .28 + shade / 15 * .96,
      alpha: .18 + shade / 15 * .76,
      phase: random() * Math.PI * 2,
      driftX: (random() - .5) * 1.65,
      driftY: (random() - .5) * 1.65,
      angle: random() * Math.PI * 2,
      scatter: .22 + random() * .82,
      stagger: .12 + centerDistance * .84 + random() * .18
    });
  }
  return buckets;
}

const portraitDots = buildPortraitDots();

function mountParticlePortrait(canvas) {
  const context = canvas.getContext('2d', { alpha: true });
  if (!context) return;
  const isIntro = canvas.dataset.particlePortrait === 'intro';
  const bornAt = performance.now();
  let width = 0;
  let height = 0;
  let lastFrame = 0;

  const resize = () => {
    const box = canvas.getBoundingClientRect();
    if (!box.width || !box.height) return;
    width = box.width;
    height = box.height;
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * pixelRatio);
    canvas.height = Math.round(height * pixelRatio);
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
  };

  const draw = (timestamp) => {
    if (!canvas.isConnected) return;
    if (timestamp - lastFrame < 32) {
      window.requestAnimationFrame(draw);
      return;
    }
    lastFrame = timestamp;
    if (document.hidden) {
      window.requestAnimationFrame(draw);
      return;
    }
    const box = canvas.getBoundingClientRect();
    if (box.width !== width || box.height !== height) resize();
    if (!width || !height) {
      window.requestAnimationFrame(draw);
      return;
    }

    context.clearRect(0, 0, width, height);
    const elapsed = timestamp - bornAt;
    for (let shade = 1; shade < portraitDots.length; shade++) {
      const dots = portraitDots[shade];
      const red = Math.round(78 + shade * 8.05);
      const green = Math.round(96 + shade * 8.0);
      const blue = Math.round(121 + shade * 7.4);
      context.fillStyle = 'rgb(' + red + ',' + green + ',' + blue + ')';
      for (const dot of dots) {
        let arrival = 1;
        if (isIntro && !reducedMotion) {
          const local = Math.max(0, Math.min(1, (elapsed / 1000 - dot.stagger) / 1.03));
          arrival = local * local * (3 - 2 * local);
          if (arrival < .015) continue;
        }
        const settle = isIntro && !reducedMotion ? 1 - arrival : 0;
        const pulse = reducedMotion ? 0 : Math.sin(timestamp * .0015 + dot.phase) * (isIntro ? .42 : .55);
        const x = ((dot.x + dot.driftX * settle * dot.scatter + pulse * .24) / portraitColumns) * width;
        const y = ((dot.y + dot.driftY * settle * dot.scatter + Math.cos(timestamp * .001 + dot.phase) * .15) / portraitRows) * height;
        context.globalAlpha = dot.alpha * (isIntro && !reducedMotion ? arrival : 1);
        context.beginPath();
        context.arc(x, y, dot.radius * (1 + pulse * .08), 0, Math.PI * 2);
        context.fill();
      }
    }
    context.globalAlpha = 1;
    window.requestAnimationFrame(draw);
  };

  resize();
  if ('ResizeObserver' in window) new ResizeObserver(resize).observe(canvas);
  else window.addEventListener('resize', resize, { passive: true });
  window.requestAnimationFrame(draw);
}

document.querySelectorAll('[data-particle-portrait]').forEach(mountParticlePortrait);


// Portfolio work is presented in four featured cards, followed by the rest of the training projects.
const projects = [
  { title: "DEV 202 Contributions Tracker", type: "Dashboard", year: "OFPPT", description: "Tableau de bord pour suivre les contributions, l’historique, les classements, les pénalités, les retraits et les bilans hebdomadaires.", tools: "HTML · CSS · JavaScript · LocalStorage", status: "completed", preview: "dashboard", live: "https://milion999-lgtm.github.io/portfolio/projects/count/", source: "https://github.com/milion999-lgtm/portfolio/tree/main/projects/count" },
  { title: "BioProduits", type: "Site e-commerce", year: "OFPPT", description: "Boutique de produits biologiques avec catalogue, pages de présentation, panier et navigation entre les produits.", tools: "HTML · CSS · JavaScript · Bootstrap 5", status: "completed", preview: "shop", live: "https://milion999-lgtm.github.io/bioproduits/", source: "https://github.com/milion999-lgtm/bioproduits" },
  { title: "MedRendez", type: "Concept de site santé", year: "OFPPT", description: "Page d’accueil conceptuelle pour découvrir des médecins, rechercher des services et présenter une prise de rendez-vous.", tools: "HTML · CSS · Bootstrap 5", status: "completed", preview: "phone" },
  { title: "Bella Cucina", type: "Projet en équipe · Restaurant", year: "OFPPT", description: "Site de présentation d’un restaurant avec menu, histoire, galerie et section de contact. Concept fictif de démonstration.", tools: "HTML · CSS · Bootstrap 5", status: "completed", preview: "food", live: "https://milion999-lgtm.github.io/portfolio/projects/bella-cucina/", source: "https://github.com/milion999-lgtm/portfolio/tree/main/projects/bella-cucina" },
  { title: "Book Catalogue", type: "Application web", year: "OFPPT", description: "Catalogue de livres développé avec Laravel, PHP, Blade et une base de données MySQL.", tools: "PHP · Laravel · MySQL · Blade", status: "completed" },
  { title: "Car Rental Manager", type: "Application React", year: "OFPPT", description: "Interface React pour ajouter et consulter des véhicules dans une application de location.", tools: "React · Vite · Axios", status: "completed" },
  { title: "Product Inventory Manager", type: "Application React", year: "OFPPT", description: "Gestion de produits avec recherche, suivi des quantités, ajout, suppression et mise à jour.", tools: "React · JavaScript · Vite", status: "completed" },
  { title: "Team Score Manager", type: "Application React", year: "OFPPT", description: "Gestion d’une équipe de joueurs, modification des scores et réinitialisation du tableau.", tools: "React · JavaScript · Vite", status: "completed" },
  { title: "Training Registration Form", type: "Formulaire React", year: "OFPPT", description: "Formulaire d’inscription à une formation construit avec des composants React.", tools: "React · JavaScript · Vite", status: "completed" },
  { title: "Student Profile & Dice Games", type: "Exercices React", year: "OFPPT", description: "Fiches de profil, compteurs et petits jeux de dés interactifs réalisés en React.", tools: "React · JavaScript · Vite", status: "completed" },
  { title: "Travaux pratiques web", type: "Ensemble d’exercices", year: "OFPPT", description: "Exercices HTML, CSS et JavaScript autour des pages, formulaires, mises en page adaptatives et interactions DOM.", tools: "HTML · CSS · JavaScript · Bootstrap", status: "completed" },
  { title: "Exercices Python & SQL", type: "Ensemble d’exercices", year: "OFPPT", description: "Exercices de programmation Python et de requêtes sur bases de données SQL.", tools: "Python · SQL", status: "completed" },
];

function previewMarkup(project) {
  const shop = project.preview === 'shop';
  const food = project.preview === 'food';
  const phone = project.preview === 'phone';
  const name = project.title.replaceAll('"', '&quot;');
  return `<div class="project-preview preview-${project.preview || 'dashboard'}" aria-hidden="true"><div class="preview-browser"><div class="preview-chrome"><i></i><i></i><i></i><span>${project.type}</span></div><div class="preview-layout"><div><span class="preview-label">BADER · PROJECT 0${projects.indexOf(project) + 1}</span><h5>${shop ? 'BIO<br>PRODUITS' : food ? 'BELLA<br>CUCINA' : phone ? 'MED<br>RENDEZ' : name}</h5><p>${shop ? 'Produits naturels · Boutique en ligne' : food ? 'Cuisine italienne · Restaurant' : phone ? 'Santé · Rendez-vous' : project.type}</p></div><div class="preview-side"><div class="preview-stat-row"><div class="preview-stat">${phone ? 'RENDEZ-VOUS' : 'ACTIVITÉ'}<b>${phone ? '09:30' : '24'}</b></div><div class="preview-stat">${phone ? 'SPÉCIALITÉS' : 'CE MOIS'}<b>${phone ? '08' : '+18%'}</b></div></div><div class="preview-bars"><i></i><i></i><i></i><i></i><i></i><i></i></div><div class="preview-list"><i></i><i></i><i></i></div></div></div></div></div>`;
}

function renderProjects(status, targetId) {
  const target = document.getElementById(targetId);
  const group = target.closest('.project-group');
  const matchingProjects = projects.filter((project) => project.status === status);
  if (!matchingProjects.length) {
    target.innerHTML = '';
    if (group) group.hidden = true;
    return;
  }
  if (group) group.hidden = false;
  target.innerHTML = matchingProjects.map((project, index) => {
    const feature = status === 'completed' && index < 4;
    const number = String(index + 1).padStart(2, '0');
    const links = `${project.live ? `<a href="${project.live}" target="_blank" rel="noreferrer">SITE ↗</a>` : ''}${project.source ? `<a href="${project.source}" target="_blank" rel="noreferrer">CODE ↗</a>` : ''}`;
    return `<article class="project-card ${feature ? 'project-card--feature' : 'project-card--compact'}">${feature ? previewMarkup(project) : `<span class="project-index">${number}</span>`}<div class="project-card-copy"><div class="project-card-top"><span>${project.type}</span><span>${project.year}</span></div><h4>${project.title}</h4><p>${project.description}</p><div class="project-card-bottom"><span>${project.tools}</span>${links ? `<span class="project-links">${links}</span>` : ''}</div></div></article>`;
  }).join('');
}

renderProjects('completed', 'completed-projects');
renderProjects('ongoing', 'ongoing-projects');

const revealItems = document.querySelectorAll('.service-row, .project-card, .about-grid, .contact-title, .contact-link');
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  revealItems.forEach((item, index) => {
    item.classList.add('reveal');
    item.style.setProperty('--reveal-delay', `${Math.min(index % 4, 3) * 70}ms`);
    observer.observe(item);
  });
} else {
  revealItems.forEach((item) => item.classList.add('is-visible'));
}

