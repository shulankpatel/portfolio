/* ============================================================
   PORTFOLIO — main.js
   Theme toggle, mobile nav, contact form, scroll reveal.
   ============================================================ */

/* ---- Theme ---- */
const PortfolioTheme = (() => {
  const KEY = 'pg-theme';

  function getInitialTheme() {
    try {
      const stored = localStorage.getItem(KEY);
      if (stored === 'dark' || stored === 'light') return stored;
    } catch (_) { /* private mode, etc. */ }
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
      return 'light';
    }
    return 'dark';
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    try { localStorage.setItem(KEY, theme); } catch (_) {}
    const btn = document.querySelector('[data-theme-toggle]');
    if (btn) btn.textContent = theme === 'dark' ? '☾' : '☀';
  }

  function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme') || 'dark';
    applyTheme(current === 'dark' ? 'light' : 'dark');
  }

  function init() {
    applyTheme(getInitialTheme());
    const btn = document.querySelector('[data-theme-toggle]');
    if (btn) btn.addEventListener('click', toggleTheme);
  }

  return { getInitialTheme, applyTheme, toggleTheme, init };
})();

/* Bootstrap (runs early to prevent flash) */
(function bootstrapTheme() {
  try {
    const stored = localStorage.getItem('pg-theme');
    const initial = (stored === 'dark' || stored === 'light')
      ? stored
      : (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
    document.documentElement.setAttribute('data-theme', initial);
  } catch (_) {
    document.documentElement.setAttribute('data-theme', 'dark');
  }
})();

/* ---- Mobile nav ---- */
const PortfolioNav = (() => {
  function setDrawer(open, toggle, drawer) {
    drawer.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
    drawer.setAttribute('aria-hidden', String(!open));
    document.body.style.overflow = open ? 'hidden' : '';
  }

  function init() {
    const toggle = document.querySelector('[data-nav-toggle]');
    const drawer = document.querySelector('[data-mobile-drawer]');
    if (!toggle || !drawer) return;
    toggle.addEventListener('click', () => {
      const willOpen = !drawer.classList.contains('open');
      setDrawer(willOpen, toggle, drawer);
    });
    drawer.addEventListener('click', (e) => {
      if (e.target.closest('a')) {
        setDrawer(false, toggle, drawer);
      }
    });
  }
  return { init };
})();

/* ---- Contact form ---- */
const PortfolioContact = (() => {
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function validateContact({ name, email, message }) {
    const errors = {};
    if (!name || !name.trim()) errors.name = 'Required';
    if (!email || !email.trim()) errors.email = 'Required';
    else if (!EMAIL_RE.test(email)) errors.email = 'Invalid email';
    if (!message || !message.trim()) errors.message = 'Required';
    return { ok: Object.keys(errors).length === 0, errors };
  }

  function handleSubmit(form) {
    return async (e) => {
      e.preventDefault();
      const data = {
        name: form.elements.name.value,
        email: form.elements.email.value,
        message: form.elements.message.value,
      };
      const errorBox = form.querySelector('[data-error]');
      const successBox = form.querySelector('[data-success]');
      const submitBtn = form.querySelector('[data-submit-btn]');

      // Reset state
      errorBox.hidden = true;
      successBox.hidden = true;

      // Client-side validation
      const result = validateContact(data);
      if (!result.ok) {
        const first = Object.keys(result.errors)[0];
        errorBox.textContent = `${first}: ${result.errors[first]}`;
        errorBox.hidden = false;
        return;
      }

      // Refuse to submit if the form action still has the placeholder
      if (!form.action || form.action.includes('YOUR_FORMSPREE_ID')) {
        errorBox.textContent = 'Form not yet configured. Please email directly using the link below.';
        errorBox.hidden = false;
        return;
      }

      submitBtn.disabled = true;
      const originalLabel = submitBtn.textContent;
      submitBtn.textContent = 'Sending…';

      try {
        const response = await fetch(form.action, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify(data),
        });

        if (response.ok) {
          form.reset();
          successBox.textContent = "Thanks — message sent. I'll reply soon.";
          successBox.hidden = false;
        } else {
          const json = await response.json().catch(() => ({}));
          const msg = (json.errors && json.errors[0] && json.errors[0].message)
            || 'Submission failed. Please try emailing directly.';
          errorBox.textContent = msg;
          errorBox.hidden = false;
        }
      } catch (_) {
        errorBox.textContent = 'Network error. Please try emailing directly.';
        errorBox.hidden = false;
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = originalLabel;
      }
    };
  }

  function init() {
    const form = document.querySelector('[data-contact-form]');
    if (!form) return;
    form.addEventListener('submit', handleSubmit(form));
  }

  return { validateContact, init };
})();

document.addEventListener('DOMContentLoaded', () => {
  PortfolioTheme.init();
  PortfolioNav.init();
  PortfolioContact.init();
});
