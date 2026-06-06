const yearNodes = document.querySelectorAll('[data-current-year]');
yearNodes.forEach((node) => {
  node.textContent = new Date().getFullYear();
});

const menuToggle = document.querySelector('[data-menu-toggle]');
const mobilePanel = document.querySelector('[data-mobile-panel]');
const menuIcon = document.querySelector('[data-menu-icon]');

function setMenuIcon(open) {
  if (!menuIcon) return;
  menuIcon.innerHTML = open
    ? '<path d="M18 6 6 18"></path><path d="m6 6 12 12"></path>'
    : '<line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="18" x2="21" y2="18"></line>';
}

function closeMenu() {
  if (!mobilePanel || !menuToggle) return;
  mobilePanel.classList.remove('open');
  menuToggle.setAttribute('aria-expanded', 'false');
  setMenuIcon(false);
}

if (menuToggle && mobilePanel) {
  menuToggle.addEventListener('click', () => {
    const isOpen = mobilePanel.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    setMenuIcon(isOpen);
  });

  document.querySelectorAll('.mobile-nav a').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 1100) closeMenu();
  });
}

function wireForm(selector) {
  const form = document.querySelector(selector);
  if (!form) return;
  const status = form.querySelector('.status');

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (status) {
      status.classList.add('show');
      status.textContent = form.dataset.success || 'Thank you. Your message has been received.';
    }
    form.reset();
    window.setTimeout(() => {
      status?.classList.remove('show');
    }, 4200);
  });
}

wireForm('[data-form="inquiry"]');
wireForm('[data-form="contact"]');


// Single-page navigation: keep active state in sync without reloading the page.
const pageAnchors = Array.from(document.querySelectorAll('.page-anchor[id]'));
const navLinks = Array.from(document.querySelectorAll('.site-nav a[href^="#"], .mobile-nav a[href^="#"], .footer-list a[href^="#"], .brand[href^="#"]'));
const sectionNavLinks = Array.from(document.querySelectorAll('.site-nav a[href^="#"], .mobile-nav a[href^="#"]'));

function setActiveNav(hash) {
  sectionNavLinks.forEach((link) => {
    link.classList.toggle('active', link.getAttribute('href') === hash);
  });
}

navLinks.forEach((link) => {
  link.addEventListener('click', () => {
    const hash = link.getAttribute('href');
    if (hash && hash.startsWith('#')) setActiveNav(hash);
  });
});

if ('IntersectionObserver' in window && pageAnchors.length) {
  const observer = new IntersectionObserver((entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (visible?.target?.id) {
      setActiveNav(`#${visible.target.id}`);
    }
  }, {
    rootMargin: '-25% 0px -60% 0px',
    threshold: [0.01, 0.2, 0.5]
  });

  pageAnchors.forEach((section) => observer.observe(section));
}


function initCarousel() {
  const carousel = document.querySelector('[data-carousel]');
  if (!carousel) return;

  const slides = Array.from(carousel.querySelectorAll('[data-slide]'));
  const dots = Array.from(carousel.querySelectorAll('[data-dot]'));
  const prev = carousel.querySelector('[data-prev]');
  const next = carousel.querySelector('[data-next]');
  if (!slides.length) return;

  let current = 0;
  let timer;

  function showSlide(index) {
    current = (index + slides.length) % slides.length;
    slides.forEach((slide, slideIndex) => {
      slide.classList.toggle('active', slideIndex === current);
    });
    dots.forEach((dot, dotIndex) => {
      const active = dotIndex === current;
      dot.classList.toggle('active', active);
      dot.setAttribute('aria-selected', String(active));
    });
  }

  function startAuto() {
    stopAuto();
    timer = window.setInterval(() => showSlide(current + 1), 4500);
  }

  function stopAuto() {
    if (timer) window.clearInterval(timer);
  }

  prev?.addEventListener('click', () => {
    showSlide(current - 1);
    startAuto();
  });

  next?.addEventListener('click', () => {
    showSlide(current + 1);
    startAuto();
  });

  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      showSlide(index);
      startAuto();
    });
  });

  carousel.addEventListener('mouseenter', stopAuto);
  carousel.addEventListener('mouseleave', startAuto);
  carousel.addEventListener('focusin', stopAuto);
  carousel.addEventListener('focusout', startAuto);

  showSlide(0);
  startAuto();
}

initCarousel();
