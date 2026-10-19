const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const welcomeScreen = document.getElementById('welcome-screen');
const startButton = document.getElementById('start-button');
const welcomeCanvas = document.getElementById('welcome-particles');
const welcomeLiveText = document.getElementById('welcome-live-text');

document.body.classList.add('welcome-active');
document.getElementById('year').textContent = new Date().getFullYear();
let welcomeFinished = false;

function startWelcome() {
  if (!welcomeScreen || !startButton || startButton.disabled) return;
  startButton.disabled = true;
  welcomeScreen.classList.add('is-starting');
  if (welcomeLiveText) welcomeLiveText.textContent = 'Bienvenue dans mon portfolio.';
  if (reducedMotion || !welcomeCanvas) { window.setTimeout(finishWelcome, 350); return; }
  animateWelcomeParticles(welcomeCanvas, finishWelcome);
}
function finishWelcome() {
  if (!welcomeScreen || welcomeFinished) return;
  welcomeFinished = true;
  welcomeScreen.classList.add('is-leaving');
  document.body.classList.remove('welcome-active', 'welcome-reveal', 'welcome-landed');
  window.setTimeout(() => welcomeScreen.remove(), reducedMotion ? 0 : 550);
}
welcomeScreen?.addEventListener('click', startWelcome);

function animateWelcomeParticles(canvas, onComplete) {
  const ctx = canvas.getContext('2d');
  if (!ctx) { onComplete(); return; }
  const dpr = Math.min(window.devicePixelRatio || 1, 1.5), w = window.innerWidth, h = window.innerHeight;
  canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr); ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  const off = document.createElement('canvas'); off.width = canvas.width; off.height = canvas.height;
  const octx = off.getContext('2d');
  if (!octx) { onComplete(); return; }
  octx.scale(dpr, dpr);
  const mobile = w < 640;
  const phraseLabel = document.querySelector('.hero-welcome-label');
  const labelRect = phraseLabel?.getBoundingClientRect();
  const labelStyle = phraseLabel ? getComputedStyle(phraseLabel) : null;
  const targetFontSize = labelStyle ? Number.parseFloat(labelStyle.fontSize) : (mobile ? 36 : 56);
  const targetLineHeight = labelStyle ? Number.parseFloat(labelStyle.lineHeight) : targetFontSize * .96;
  const sourceFontSize = targetFontSize;
  const landingScale = 1;
  const lines = ['BIENVENUE DANS', 'MON PORTFOLIO'];
  octx.textAlign = 'center'; octx.textBaseline = 'middle'; octx.fillStyle = '#fff';
  octx.font = `800 ${sourceFontSize}px "Barlow Condensed", sans-serif`;
  const gap = targetLineHeight;
  lines.forEach((line, i) => octx.fillText(line, w / 2, h / 2 + (i - (lines.length - 1) / 2) * gap, w * .92));
  const pixels = octx.getImageData(0, 0, off.width, off.height).data, step = Math.max(4, Math.round(sourceFontSize / 14)), targets = [];
  for (let y = 0; y < off.height; y += step) for (let x = 0; x < off.width; x += step) if (pixels[(y * off.width + x) * 4 + 3] > 100) targets.push({ x: x / dpr, y: y / dpr });
  const rect = startButton.getBoundingClientRect(), ox = rect.left + rect.width / 2, oy = rect.top + rect.height / 2;
  const labelCenterX = labelRect ? labelRect.left + labelRect.width / 2 : w * .3;
  const labelCenterY = labelRect ? labelRect.top + labelRect.height / 2 : h * .32;
  const particles = targets.map(t => {
    const a = Math.random() * Math.PI * 2, spread = Math.max(w, h) * (.45 + Math.random() * .4), z = (Math.random() - .5) * 240;
    return { sx: ox + Math.cos(a) * spread, sy: oy + Math.sin(a) * spread, tx: t.x, ty: t.y, lx: labelCenterX + (t.x - w / 2) * landingScale, ly: labelCenterY + (t.y - h / 2) * landingScale, z, delay: Math.random() * 350, size: Math.min(3.4, (1.7 + Math.random() * .35) * Math.sqrt(step / 4)), phase: Math.random() * 6.28 };
  });
  const dust = Array.from({ length: mobile ? 450 : 900 }, () => {
    const a = Math.random() * Math.PI * 2, r = Math.random() * Math.max(w, h) * .62, z = (Math.random() - .5) * 520;
    return { x: ox, y: oy, sx: ox + Math.cos(a) * r, sy: oy + Math.sin(a) * r, z, size: .35 + Math.random() * 1.15, phase: Math.random() * 6.28, speed: .25 + Math.random() * .75 };
  });
  const timeline = { burst: 750, gatherStart: 600, gather: 3300, moveStart: 4200, move: 900, land: 5100, crossfade: 550, finish: 5900 };
  const started = performance.now();
  const ease = v => 1 - Math.pow(1 - Math.max(0, Math.min(v, 1)), 3);
  const draw = now => {
    ctx.clearRect(0, 0, w, h); const elapsed = now - started;
    const burst = ease(elapsed / timeline.burst), formation = ease((elapsed - timeline.gatherStart) / timeline.gather);
    ctx.fillStyle = '#d9dadd';
    for (const p of dust) {
      const depth = 520 / Math.max(180, 520 - p.z);
      const x0 = p.x + (p.sx - p.x) * burst, y0 = p.y + (p.sy - p.y) * burst;
      const x = w / 2 + (x0 - w / 2) * depth + Math.sin(now * .00035 * p.speed + p.phase) * 15;
      const y = h / 2 + (y0 - h / 2) * depth + Math.cos(now * .0003 * p.speed + p.phase) * 13;
      const alpha = (.18 + .4 * (1 - formation)) * (1 - ease((elapsed - timeline.moveStart) / 850));
      ctx.globalAlpha = alpha; ctx.beginPath(); ctx.arc(x, y, p.size * depth, 0, Math.PI * 2); ctx.fill();
    }
    ctx.fillStyle = '#d9dadd'; ctx.shadowBlur = 0;
    for (const p of particles) {
      const gather = Math.max(0, Math.min(1, (elapsed - timeline.gatherStart - p.delay) / timeline.gather));
      const local = gather * gather * (3 - 2 * gather), particleBurst = ease(elapsed / timeline.burst);
      const depth = 360 / Math.max(190, 360 - p.z * (1 - local));
      const targetX = p.tx, targetY = p.ty;
      const dx = targetX - p.sx, dy = targetY - p.sy, length = Math.max(1, Math.hypot(dx, dy));
      const arc = Math.sin(local * Math.PI) * (16 + (p.z + 120) * .035) * (Math.sin(p.phase) < 0 ? -1 : 1);
      const x = ox + (p.sx - ox) * particleBurst + (targetX - p.sx) * local - (dy / length) * arc;
      const y = oy + (p.sy - oy) * particleBurst + (targetY - p.sy) * local + (dx / length) * arc;
      const perspectiveX = w / 2 + (x - w / 2) * depth, perspectiveY = h / 2 + (y - h / 2) * depth;
      const fadePhrase = ease((elapsed - timeline.land) / timeline.crossfade);
      ctx.globalAlpha = (.22 + local * .74) * (1 - fadePhrase); ctx.beginPath();
      ctx.arc(perspectiveX + Math.sin(now * .001 + p.phase) * (1 - local) * 2, perspectiveY, p.size * (.8 + depth * .2), 0, Math.PI * 2); ctx.fill();
    }
    ctx.globalAlpha = 1; ctx.shadowBlur = 0;
    if (elapsed >= timeline.moveStart && !document.body.classList.contains('welcome-reveal')) document.body.classList.add('welcome-reveal');
    if (elapsed >= timeline.land && !document.body.classList.contains('welcome-landed')) document.body.classList.add('welcome-landed');
    if (elapsed >= timeline.land && !welcomeScreen?.classList.contains('is-transitioning')) welcomeScreen?.classList.add('is-transitioning');
    if (elapsed < timeline.finish) requestAnimationFrame(draw); else onComplete();
  };
  requestAnimationFrame(draw);
}
// Portfolio work is presented in four featured cards, followed by the rest of the training projects.
const projects = [
  { title: "DEV 202 Contributions Tracker", type: "Dashboard", year: "OFPPT", description: "Tableau de bord pour suivre les contributions, l’historique, les classements, les pénalités, les retraits et les bilans hebdomadaires.", tools: "HTML · CSS · JavaScript · LocalStorage", status: "completed", preview: "dashboard", live: "https://milion999-lgtm.github.io/portfolio/projects/count/", source: "https://github.com/milion999-lgtm/portfolio/tree/main/projects/count" },
  { title: "BioProduits", type: "Site e-commerce", year: "OFPPT", description: "Boutique de produits biologiques avec catalogue, pages de présentation, panier et navigation entre les produits.", tools: "HTML · CSS · JavaScript · Bootstrap 5", status: "completed", preview: "shop", live: "https://milion999-lgtm.github.io/bioproduits/", source: "https://github.com/milion999-lgtm/bioproduits" },
  { title: "EduVerse Learning", type: "Plateforme e-learning", year: "2026", description: "Plateforme de formation en ligne avec un catalogue de 30 cours, des leçons structurées, des quiz, un suivi de progression et un classement des apprenants.", tools: "React · TypeScript · Vite · Supabase", status: "completed", preview: "education", live: "https://eduverse-learning-two.vercel.app/", source: "https://github.com/milion999-lgtm/projet-group" },
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
  const safeTitle = project.title.replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
  return `<div class="project-preview project-preview--live"><div class="live-preview-label"><span class="live-dot"></span> APERÇU DU SITE EN DIRECT</div><iframe src="${project.live}" title="Aperçu du site ${safeTitle}" loading="lazy" referrerpolicy="strict-origin-when-cross-origin"></iframe></div>`;
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
    const feature = status === 'completed' && Boolean(project.live);
    const number = String(index + 1).padStart(2, '0');
    const links = `${project.live ? `<a href="${project.live}" target="_blank" rel="noreferrer">VOIR LE SITE ↗</a>` : ''}${project.source ? `<a href="${project.source}" target="_blank" rel="noreferrer">CODE ↗</a>` : ''}`;
    return `<article class="project-card ${feature ? 'project-card--feature' : 'project-card--compact'}">${feature ? previewMarkup(project) : `<span class="project-index">${number}</span>`}<div class="project-card-copy"><div class="project-card-top"><span>${project.type}</span><span>${project.year}</span></div><h4>${project.title}</h4><p>${project.description}</p><div class="project-card-bottom"><span>${project.tools}</span>${links ? `<span class="project-links">${links}</span>` : ''}</div></div></article>`;
  }).join('');
}

renderProjects('completed', 'completed-projects');
renderProjects('ongoing', 'ongoing-projects');

// Run the short web fundamentals quiz.
const codeGame = document.getElementById('code-game');
if (codeGame) {
  const gameStart = document.getElementById('game-start');
  const gameQuestion = document.getElementById('game-question');
  const gameAnswers = document.getElementById('game-answers');
  const gameFeedback = document.getElementById('game-feedback');
  const gameScore = document.getElementById('game-score');
  const gameProgress = document.getElementById('game-progress-label');
  const gameTimeLabel = document.getElementById('game-time-label');
  const gameTimeFill = document.getElementById('game-time-fill');
  const roundDuration = 30;
  const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
  const shuffle = items => {
    const shuffled = [...items];
    for (let index = shuffled.length - 1; index > 0; index -= 1) {
      const swapIndex = randomInt(0, index);
      [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
    }
    return shuffled;
  };
  const pick = items => items[randomInt(0, items.length - 1)];
  const numericChoices = answer => shuffle([-1, 1, -2, 2, -3, 3, -5, 5, 7].map(offset => String(answer + offset)))
    .filter((option, index, all) => option !== String(answer) && all.indexOf(option) === index)
    .slice(0, 3);
  const makeQuestion = (question, correct, distractors) => {
    const answers = shuffle([String(correct), ...distractors.map(String)]);
    return { question, answers, correct: answers.indexOf(String(correct)) };
  };
  const questionFactories = [
    () => {
      const a = randomInt(4, 38), b = randomInt(3, 27), result = a + b;
      return makeQuestion(`En JavaScript, quel résultat affiche console.log(${a} + ${b}) ?`, result, numericChoices(result));
    },
    () => {
      const a = randomInt(3, 14), b = randomInt(2, 9), result = a * b;
      return makeQuestion(`Combien vaut ${a} × ${b} dans ce calcul JavaScript ?`, result, numericChoices(result));
    },
    () => {
      const a = randomInt(15, 59), b = randomInt(3, 11), result = a % b;
      return makeQuestion(`Quel reste donne l’expression ${a} % ${b} en JavaScript ?`, result, numericChoices(result));
    },
    () => {
      const word = pick(['CODE', 'BADER', 'WEB', 'REACT', 'PORTFOLIO', 'CASABLANCA', 'JAVASCRIPT', 'OFPPT']);
      return makeQuestion(`Quelle valeur renvoie « ${word} ».length en JavaScript ?`, word.length, numericChoices(word.length));
    },
    () => {
      const values = shuffle(['HTML', 'CSS', 'JavaScript', 'React', 'PHP', 'SQL']).slice(0, 3);
      const index = randomInt(0, values.length - 1), correct = values[index];
      const distractors = shuffle(['Python', 'Git', 'Laravel', 'MySQL', ...values.filter(value => value !== correct)]).slice(0, 3);
      return makeQuestion(`Que renvoie technologies[${index}] pour le tableau [${values.map(value => `'${value}'`).join(', ')}] ?`, correct, distractors);
    },
    () => {
      const elements = [
        { tag: '<a>', purpose: 'créer un lien' },
        { tag: '<img>', purpose: 'afficher une image' },
        { tag: '<form>', purpose: 'créer un formulaire' },
        { tag: '<nav>', purpose: 'regrouper les liens de navigation' },
        { tag: '<button>', purpose: 'déclencher une action' },
      ];
      const item = pick(elements);
      return makeQuestion(`Quelle balise HTML sert à ${item.purpose} ?`, item.tag, elements.filter(option => option !== item).map(option => option.tag).slice(0, 3));
    },
    () => {
      const attributes = [
        { name: 'href', purpose: 'indiquer la destination d’un lien' },
        { name: 'alt', purpose: 'décrire une image aux lecteurs d’écran' },
        { name: 'placeholder', purpose: 'afficher un exemple dans un champ' },
        { name: 'target', purpose: 'choisir où ouvrir un lien' },
        { name: 'required', purpose: 'rendre un champ obligatoire' },
      ];
      const item = pick(attributes);
      return makeQuestion(`Quel attribut HTML permet de ${item.purpose} ?`, item.name, attributes.filter(option => option !== item).map(option => option.name).slice(0, 3));
    },
    () => {
      const rules = [
        { prompt: 'aligner les éléments sur l’axe principal', answer: 'justify-content' },
        { prompt: 'définir un conteneur en grille', answer: 'display: grid' },
        { prompt: 'arrondir les coins d’un élément', answer: 'border-radius' },
        { prompt: 'créer une mise en page flexible', answer: 'display: flex' },
        { prompt: 'changer la couleur du texte', answer: 'color' },
      ];
      const rule = pick(rules);
      return makeQuestion(`Quelle règle CSS permet de ${rule.prompt} ?`, rule.answer, shuffle(rules.filter(option => option !== rule).map(option => option.answer)).slice(0, 3));
    },
    () => {
      const a = randomInt(2, 30), b = randomInt(2, 30), operator = pick(['>', '<', '===']);
      const result = operator === '>' ? a > b : operator === '<' ? a < b : a === b;
      return makeQuestion(`Dans JavaScript, que renvoie ${a} ${operator} ${b} ?`, result ? 'true' : 'false', ['null', 'undefined', result ? 'false' : 'true']);
    },
    () => {
      const concepts = [
        { name: 'WHERE', meaning: 'filtrer les lignes selon une condition' },
        { name: 'ORDER BY', meaning: 'trier les résultats' },
        { name: 'COUNT(*)', meaning: 'compter le nombre de lignes' },
        { name: 'INSERT INTO', meaning: 'ajouter de nouvelles lignes' },
        { name: 'UPDATE', meaning: 'modifier des lignes existantes' },
      ];
      const item = pick(concepts);
      return makeQuestion(`En SQL, à quoi sert ${item.name} ?`, item.meaning, shuffle(concepts.filter(option => option !== item).map(option => option.meaning)).slice(0, 3));
    },
    () => {
      const tools = [
        { command: 'git status', use: 'voir les changements du dépôt' },
        { command: 'git add', use: 'préparer des fichiers pour un commit' },
        { command: 'git commit', use: 'enregistrer un point dans l’historique' },
        { command: 'git push', use: 'envoyer des commits vers le dépôt distant' },
        { command: 'git clone', use: 'copier un dépôt distant en local' },
      ];
      const item = pick(tools);
      return makeQuestion(`Quelle commande Git permet de ${item.use} ?`, item.command, shuffle(tools.filter(option => option !== item).map(option => option.command)).slice(0, 3));
    },
    () => {
      const a = randomInt(3, 25), b = randomInt(2, 15), result = a + b;
      return makeQuestion(`En Python, quelle valeur affiche print(${a} + ${b}) ?`, result, numericChoices(result));
    },
    () => {
      const components = [
        { name: 'props', meaning: 'recevoir des données depuis un composant parent' },
        { name: 'state', meaning: 'gérer une donnée qui évolue dans un composant' },
        { name: 'key', meaning: 'identifier chaque élément d’une liste' },
        { name: 'useEffect', meaning: 'synchroniser un composant avec un effet externe' },
      ];
      const item = pick(components);
      return makeQuestion(`En React, quel terme correspond à « ${item.meaning} » ?`, item.name, shuffle(components.filter(option => option !== item).map(option => option.name)).slice(0, 3));
    },
  ];
  let previousRound = '';
  const createRound = () => {
    let selected;
    let signature;
    do {
      selected = shuffle(questionFactories.map((factory, id) => ({ factory, id }))).slice(0, 5);
      signature = selected.map(question => question.id).sort().join(',');
    } while (signature === previousRound);
    previousRound = signature;
    return selected.map(question => question.factory());
  };
  let questions = [];
  let currentQuestion = 0;
  let score = 0;
  let timeLeft = roundDuration;
  let timerId = 0;
  let gameRunning = false;
  let answerLocked = false;

  const updateTimer = () => {
    gameTimeLabel.textContent = `${timeLeft} S`;
    gameTimeFill.style.width = `${(timeLeft / roundDuration) * 100}%`;
    gameTimeFill.classList.toggle('is-low', timeLeft <= 8);
  };

  const endGame = (timedOut = false) => {
    if (!gameRunning) return;
    gameRunning = false;
    window.clearInterval(timerId);
    gameAnswers.hidden = true;
    gameStart.hidden = false;
    gameStart.innerHTML = 'REJOUER <span aria-hidden="true">↻</span>';
    gameProgress.textContent = 'DÉFI TERMINÉ';
    gameQuestion.textContent = timedOut ? 'Le chrono est terminé.' : 'Bien joué, défi terminé.';
    gameFeedback.textContent = `Score final : ${score} / ${questions.length}. ${score === questions.length ? 'Sans faute !' : 'Tu peux retenter le défi.'}`;
    gameFeedback.className = 'game-feedback';
  };

  const showQuestion = () => {
    const item = questions[currentQuestion];
    answerLocked = false;
    gameQuestion.classList.remove('is-entering');
    void gameQuestion.offsetWidth;
    gameQuestion.classList.add('is-entering');
    gameProgress.textContent = `QUESTION ${currentQuestion + 1} / ${questions.length}`;
    gameQuestion.textContent = item.question;
    gameFeedback.textContent = 'Choisis ta réponse.';
    gameFeedback.className = 'game-feedback';
    gameAnswers.replaceChildren(...item.answers.map((answer, index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'game-answer';
      button.style.setProperty('--option-order', index);
      button.textContent = answer;
      button.addEventListener('click', () => {
        if (!gameRunning || answerLocked) return;
        answerLocked = true;
        const isCorrect = index === item.correct;
        if (isCorrect) score += 1;
        gameScore.textContent = `SCORE  ${score} / ${questions.length}`;
        [...gameAnswers.children].forEach((option, optionIndex) => {
          option.disabled = true;
          if (optionIndex === item.correct) option.classList.add('is-correct');
          else if (optionIndex === index) option.classList.add('is-wrong');
        });
        gameFeedback.textContent = isCorrect ? 'Bonne réponse !' : `Pas tout à fait. La bonne réponse : ${item.answers[item.correct]}`;
        gameFeedback.classList.add(isCorrect ? 'is-correct' : 'is-wrong');
        window.setTimeout(() => {
          if (!gameRunning) return;
          currentQuestion += 1;
          if (currentQuestion >= questions.length) endGame();
          else showQuestion();
        }, 480);
      });
      return button;
    }));
  };

  const startGame = () => {
    window.clearInterval(timerId);
    questions = createRound();
    currentQuestion = 0;
    score = 0;
    timeLeft = roundDuration;
    gameRunning = true;
    gameStart.hidden = true;
    gameAnswers.hidden = false;
    gameScore.textContent = `SCORE  0 / ${questions.length}`;
    updateTimer();
    showQuestion();
    timerId = window.setInterval(() => {
      timeLeft -= 1;
      updateTimer();
      if (timeLeft <= 0) endGame(true);
    }, 1000);
  };

  gameStart.addEventListener('click', startGame);
}

// Keep the service list behaving like a single open panel.
document.querySelectorAll('.service-row').forEach((row) => {
  row.addEventListener('toggle', () => {
    if (!row.open) return;
    document.querySelectorAll('.service-row').forEach((other) => {
      if (other !== row) other.open = false;
    });
  });
});

// Mark the current section in the compact top navigation as the page scrolls.
const pageSections = document.querySelectorAll('main > section[id]');
const navigationLinks = document.querySelectorAll('.topbar nav a');
if ('IntersectionObserver' in window && pageSections.length && navigationLinks.length) {
  const navigationObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navigationLinks.forEach((link) => {
        const selected = link.getAttribute('href') === '#' + entry.target.id;
        link.classList.toggle('is-current', selected);
        if (selected) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    });
  }, { rootMargin: '-26% 0px -62% 0px', threshold: 0 });
  pageSections.forEach((section) => navigationObserver.observe(section));
}

const revealItems = document.querySelectorAll('.service-row, .project-card, .about-layout, .section-heading, .technology-item, .contact-layout, .code-game-panel');
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
