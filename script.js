// ── YEAR ──
document.getElementById('year').textContent = new Date().getFullYear();

// ── NAV: scroll shadow ──
const navbar = document.getElementById('navbar');
window.addEventListener(
  'scroll',
  () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  },
  { passive: true }
);

// ── NAV: mobile toggle ──
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

function closeMenu() {
  navLinks.classList.remove('open');
  navToggle.setAttribute('aria-expanded', 'false');
}

navToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(isOpen));
});

// Close mobile menu when a link is clicked
navLinks.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', closeMenu);
});

// Close mobile menu on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && navLinks.classList.contains('open')) {
    closeMenu();
    navToggle.focus();
  }
});

// ── SMOOTH SCROLL ──
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (!target) return;

    e.preventDefault();

    const navH =
      parseInt(
        getComputedStyle(document.documentElement).getPropertyValue('--nav-h'),
        10
      ) || 72;

    const top = target.getBoundingClientRect().top + window.scrollY - navH;

    window.scrollTo({ top, behavior: 'smooth' });
  });
});

// ── SCROLL REVEAL ──
const revealEls = document.querySelectorAll(
  '.hero-content, .hero-visual, .credibility-list, .product-card, .step, .about-visual, .about-text, .section-header, .contact-info, .contact-form-wrap'
);

revealEls.forEach((el) => el.classList.add('reveal'));

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const siblings = [
          ...entry.target.parentElement.querySelectorAll('.reveal:not(.visible)')
        ];
        const idx = siblings.indexOf(entry.target);

        setTimeout(() => {
          entry.target.classList.add('visible');
        }, idx * 80);

        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

revealEls.forEach((el) => revealObserver.observe(el));

// ── CONTACT FORM ──
const form = document.getElementById('contactForm');
const submitBtn = document.getElementById('submitBtn');
const success = document.getElementById('formSuccess');
const error = document.getElementById('formError');

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function clearFieldError(field) {
  field.classList.remove('field-error');
}

function setFieldError(field) {
  field.classList.add('field-error');
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  // Hide any previous error message
  error.style.display = 'none';

  const required = form.querySelectorAll('[required]');
  let valid = true;

  required.forEach((field) => {
    clearFieldError(field);

    const isEmpty = !field.value.trim();
    const isEmailField = field.type === 'email';
    const emailInvalid = isEmailField && !isEmpty && !isValidEmail(field.value.trim());

    if (isEmpty || emailInvalid) {
      setFieldError(field);
      valid = false;
    }
  });

  if (!valid) {
    const firstInvalid = form.querySelector('.field-error');
    firstInvalid?.focus();
    return;
  }

  submitBtn.disabled = true;
  submitBtn.textContent = 'Sending…';

  try {
    const response = await fetch(form.action, {
      method: 'POST',
      body: new FormData(form),
      headers: { Accept: 'application/json' },
    });

    if (response.ok) {
      form.style.display = 'none';
      success.style.display = 'flex';
    } else {
      throw new Error(`Server responded with ${response.status}`);
    }
  } catch (err) {
    console.error('Form submission failed:', err);
    error.style.display = 'flex';
    submitBtn.disabled = false;
    submitBtn.textContent = 'Send Message';
  }
});

// Clear error styling when user starts typing
form.querySelectorAll('[required]').forEach((field) => {
  field.addEventListener('input', () => clearFieldError(field));
});

// ── ACTIVE NAV HIGHLIGHT ──
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navAnchors.forEach((a) => a.classList.remove('active'));
        const active = document.querySelector(
          `.nav-links a[href="#${entry.target.id}"]`
        );
        if (active) active.classList.add('active');
      }
    });
  },
  { rootMargin: '-40% 0px -55% 0px' }
);

sections.forEach((section) => sectionObserver.observe(section));