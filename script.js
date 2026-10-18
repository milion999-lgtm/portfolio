document.getElementById('year').textContent = new Date().getFullYear();

// Add your real projects here. Use status: "completed" or status: "ongoing".
const projects = [
  { title: "DEV 202 Contributions Tracker", type: "Dashboard", year: "OFPPT", description: "A class contribution tracker with payment history, weekly summaries, rankings, fines, withdrawals, and data import/export.", tools: "HTML, CSS, JavaScript, LocalStorage", status: "completed" },
  { title: "BioProduits", type: "E-commerce website", year: "OFPPT", description: "A multi-page organic products storefront with product listings, product details, and a shopping cart interface.", tools: "HTML, CSS, JavaScript, Bootstrap 5", status: "completed" },
  { title: "MedRendez", type: "Healthcare landing page", year: "OFPPT", description: "A healthcare booking concept that presents doctor discovery, appointment booking, and service information.", tools: "HTML, CSS, Bootstrap 5, Bootstrap Icons", status: "completed" },
  { title: "Bella Cucina", type: "Team project · Restaurant website", year: "OFPPT", description: "A restaurant website featuring a menu, restaurant story, gallery, and contact section.", tools: "HTML, CSS, JavaScript, Bootstrap 5", status: "completed" },
  { title: "Book Catalogue", type: "Web application", year: "OFPPT", description: "A Laravel application that reads book records from a MySQL database and displays them in a catalogue.", tools: "PHP, Laravel, MySQL, Blade", status: "completed" },
  { title: "Car Rental Manager", type: "React application", year: "OFPPT", description: "A small application for adding and displaying cars in a rental management interface.", tools: "React, Vite, Axios", status: "completed" },
  { title: "Product Inventory Manager", type: "React application", year: "OFPPT", description: "Manage a product list with search, stock counts, adding and removing products, and stock updates.", tools: "React, JavaScript, Vite", status: "completed" },
  { title: "Team Score Manager", type: "React application", year: "OFPPT", description: "Add and remove players, adjust scores, and reset the team scoreboard.", tools: "React, JavaScript, Vite", status: "completed" },
  { title: "Training Registration Form", type: "React application", year: "OFPPT", description: "A component-based registration form for collecting training and applicant information.", tools: "React, JavaScript, Vite", status: "completed" },
  { title: "Student Profile & Dice Games", type: "React exercises", year: "OFPPT", description: "Component-based student profile cards, counters, and interactive dice game exercises.", tools: "React, JavaScript, Vite", status: "completed" },
  { title: "Web Development Practical Work", type: "Coursework collection", year: "OFPPT", description: "Practical exercises covering page structure, styling, responsive layouts, forms, DOM interaction, and JavaScript fundamentals.", tools: "HTML, CSS, JavaScript, Bootstrap", status: "completed" },
  { title: "Python & SQL Exercises", type: "Coursework collection", year: "OFPPT", description: "Programming exercises in Python and database query practice in SQL.", tools: "Python, SQL", status: "completed" },
];

function renderProjects(status, targetId) {
  const target = document.getElementById(targetId);
  const matchingProjects = projects.filter((project) => project.status === status);
  if (!matchingProjects.length) {
    target.innerHTML = `<p class="empty-projects">Your ${status === 'completed' ? 'finished' : 'in progress'} projects will show up here.</p>`;
    return;
  }
  target.innerHTML = matchingProjects.map((project, index) => {
    const card = `<article class="project-card"><div class="project-card-top"><span>${String(index + 1).padStart(2, '0')} / ${project.type}</span><span>${project.year}</span></div><h4>${project.title}</h4><p>${project.description}</p><div class="project-card-bottom"><span>${project.tools}</span>${project.link ? `<a href="${project.link}" target="_blank" rel="noreferrer">VIEW PROJECT ↗</a>` : ''}</div></article>`;
    return card;
  }).join('');
}

renderProjects('completed', 'completed-projects');
renderProjects('ongoing', 'ongoing-projects');

// A small reveal on scroll keeps the page lively without getting in the way.
const revealItems = document.querySelectorAll('.project, .about-grid, .contact h2, .contact-link');
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

revealItems.forEach((item) => {
  item.classList.add('reveal');
  observer.observe(item);
});
