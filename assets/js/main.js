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

/* ---- Scroll behaviors (reveal, counters, scroll-spy) ---- */
const PortfolioScroll = (() => {
  const reduceMotion = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function initReveal() {
    const els = document.querySelectorAll('[data-reveal]');
    if (!els.length) return;
    if (reduceMotion || !('IntersectionObserver' in window)) {
      els.forEach((el) => el.classList.add('is-visible'));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('is-visible');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -10% 0px' });
    els.forEach((el) => io.observe(el));
  }

  function animateCount(el) {
    const target = Number(el.dataset.count);
    const prefix = el.dataset.prefix || '';
    const suffix = el.dataset.suffix || '';
    const duration = Number(el.dataset.duration) || 1400;
    if (!Number.isFinite(target)) return;
    if (reduceMotion) {
      el.textContent = `${prefix}${target}${suffix}`;
      return;
    }
    const start = performance.now();
    function tick(now) {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3); // ease-out cubic
      const value = Math.round(target * eased);
      el.textContent = `${prefix}${value}${suffix}`;
      if (t < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  function initCounters() {
    const els = document.querySelectorAll('[data-count]');
    if (!els.length) return;
    if (!('IntersectionObserver' in window)) {
      els.forEach(animateCount);
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          animateCount(e.target);
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.4 });
    els.forEach((el) => io.observe(el));
  }

  function initSpy() {
    const sections = Array.from(document.querySelectorAll('section[id]'));
    const links = Array.from(document.querySelectorAll('.nav-links a[href^="#"]'));
    if (!sections.length || !links.length || !('IntersectionObserver' in window)) return;

    const linkByHash = new Map(links.map((a) => [a.getAttribute('href').replace('#', ''), a]));

    function setActive(id) {
      links.forEach((a) => a.removeAttribute('aria-current'));
      const match = linkByHash.get(id);
      if (match) match.setAttribute('aria-current', 'true');
    }

    const visible = new Map();
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) visible.set(e.target.id, e.intersectionRatio);
        else visible.delete(e.target.id);
      });
      let bestId = null, bestRatio = 0;
      for (const [id, ratio] of visible) {
        if (ratio > bestRatio) { bestRatio = ratio; bestId = id; }
      }
      if (bestId) setActive(bestId);
    }, { threshold: [0.25, 0.5, 0.75], rootMargin: '-80px 0px -40% 0px' });

    sections.forEach((s) => io.observe(s));
  }

  function init() {
    initReveal();
    initCounters();
    initSpy();
  }

  return { init };
})();

/* ---- SOC live feed (hero) ---- */
const PortfolioFeed = (() => {
  const reduceMotion = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // (severity, message)
  const POOL = [
    ['info', 'Inbound mail processed · 2,341 messages'],
    ['warn', 'T1566.001 attachment hash matched IoC DB'],
    ['crit', 'BitB DOM fingerprint detected · score 0.87'],
    ['info', 'Auto-quarantine: 3 messages'],
    ['warn', 'OAuth consent scope mismatch · flagged for review'],
    ['crit', 'AiTM TLS pattern matched · kit: Evilginx2 v3.2'],
    ['info', 'STIX 2.1 bundle pushed → SIEM'],
    ['info', 'MITRE map: T1528, T1557, T1566.001'],
    ['warn', 'urlscan.io phishing-confidence: 92%'],
    ['crit', 'Sender impersonation · T1656 · domain age 4d'],
    ['info', 'Analyst notification dispatched'],
    ['info', 'Pipeline runtime 1.4s · 25/25 modules ok'],
    ['warn', 'QR redirect resolves to credential-harvest URL'],
    ['crit', 'Tycoon 2FA kit fingerprint · campaign_v2'],
    ['info', 'Defender for Endpoint: alert acknowledged'],
    ['warn', 'WHOIS · registrant privacy + 2d-old domain'],
    ['info', 'Secure Score Δ +0.4 over rolling 7d'],
    ['crit', 'AI-generated body detected · perplexity 13.2'],
    ['info', 'IOC enrichment complete · 14 indicators'],
    ['warn', 'CAPTCHA cloaking detected on redirect chain'],
  ];

  const MAX_LINES = 7;
  const INTERVAL = 1600;

  function fmtTs(d) {
    const pad = (n) => String(n).padStart(2, '0');
    return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
  }

  function lineNode(sev, msg, ts) {
    const row = document.createElement('div');
    row.className = 'soc-feed-line';
    row.innerHTML =
      `<span class="ts">${ts}</span>` +
      `<span class="sev ${sev}">[${sev.toUpperCase()}]</span>` +
      `<span class="msg">${msg}</span>`;
    return row;
  }

  function init() {
    const body = document.querySelector('[data-soc-feed]');
    if (!body) return;

    // Seed time slightly in the past so the feed feels "already running".
    const base = new Date();
    base.setMinutes(base.getMinutes() - 1);

    // Pre-fill with a few lines.
    for (let i = 0; i < 4; i++) {
      const [sev, msg] = POOL[i % POOL.length];
      base.setSeconds(base.getSeconds() + 3);
      body.appendChild(lineNode(sev, msg, fmtTs(base)));
    }

    if (reduceMotion) {
      // Static fill for reduced motion: add a few more lines and stop.
      for (let i = 4; i < MAX_LINES; i++) {
        const [sev, msg] = POOL[i % POOL.length];
        base.setSeconds(base.getSeconds() + 3);
        body.appendChild(lineNode(sev, msg, fmtTs(base)));
      }
      return;
    }

    let idx = 4;
    function tick() {
      if (document.hidden) return; // pause when tab hidden
      const [sev, msg] = POOL[idx % POOL.length];
      idx++;
      const now = new Date();
      body.appendChild(lineNode(sev, msg, fmtTs(now)));
      while (body.children.length > MAX_LINES) body.removeChild(body.firstElementChild);
    }
    setInterval(tick, INTERVAL);
  }

  return { init };
})();

document.addEventListener('DOMContentLoaded', () => {
  PortfolioTheme.init();
  PortfolioNav.init();
  PortfolioContact.init();
  PortfolioScroll.init();
  PortfolioFeed.init();
});
