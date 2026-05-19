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

/* ---- Polish pass: spotlight, magnetic, tilt, letter reveal, scramble ---- */
const PortfolioPolish = (() => {
  const reduceMotion = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouch = window.matchMedia && window.matchMedia('(hover: none)').matches;

  function initSpotlight() {
    if (isTouch || reduceMotion) return;
    const hero = document.querySelector('.hero');
    if (!hero) return;
    hero.addEventListener('pointermove', (e) => {
      const r = hero.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width) * 100;
      const y = ((e.clientY - r.top) / r.height) * 100;
      hero.style.setProperty('--mx', `${x}%`);
      hero.style.setProperty('--my', `${y}%`);
    });
  }

  function initMagnetic() {
    if (isTouch || reduceMotion) return;
    const els = document.querySelectorAll('[data-magnetic]');
    const RANGE = 90;
    const PULL = 0.25;
    els.forEach((el) => {
      el.addEventListener('pointermove', (e) => {
        const r = el.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        const dx = e.clientX - cx;
        const dy = e.clientY - cy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < RANGE) {
          el.style.transform = `translate(${dx * PULL}px, ${dy * PULL}px)`;
        }
      });
      el.addEventListener('pointerleave', () => {
        el.style.transform = '';
      });
    });
  }

  function initTilt() {
    if (isTouch || reduceMotion) return;
    const els = document.querySelectorAll('[data-tilt]');
    const MAX = 6; // degrees
    els.forEach((el) => {
      el.addEventListener('pointermove', (e) => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width;
        const y = (e.clientY - r.top) / r.height;
        const rx = (0.5 - y) * MAX * 2;
        const ry = (x - 0.5) * MAX * 2;
        el.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-2px)`;
      });
      el.addEventListener('pointerleave', () => {
        el.style.transform = '';
      });
    });
  }

  function initLetterReveal() {
    const els = document.querySelectorAll('.letter-reveal');
    if (!els.length) return;
    // Split text into spans
    els.forEach((el) => {
      const text = el.textContent;
      el.textContent = '';
      [...text].forEach((ch, i) => {
        const span = document.createElement('span');
        span.className = 'ltr';
        span.textContent = ch;
        span.style.transitionDelay = `${Math.min(i * 28, 600)}ms`;
        el.appendChild(span);
      });
    });
    if (reduceMotion || !('IntersectionObserver' in window)) {
      els.forEach((el) => el.classList.add('is-revealed'));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('is-revealed');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.4 });
    els.forEach((el) => io.observe(el));
  }

  function initScramble() {
    const el = document.querySelector('[data-scramble]');
    if (!el) return;
    const target = el.dataset.scrambleText || el.textContent;
    if (reduceMotion) { el.textContent = target; return; }
    const chars = '!@#$%^&*<>[]{}/=+_-?abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const DURATION = 750;
    const start = performance.now();
    function tick(now) {
      const t = Math.min(1, (now - start) / DURATION);
      const settledCount = Math.floor(target.length * t);
      let out = '';
      for (let i = 0; i < target.length; i++) {
        if (i < settledCount) out += target[i];
        else if (target[i] === ' ') out += ' ';
        else out += chars[Math.floor(Math.random() * chars.length)];
      }
      el.textContent = out;
      if (t < 1) requestAnimationFrame(tick);
      else el.textContent = target;
    }
    requestAnimationFrame(tick);
  }

  function init() {
    initLetterReveal();
    initScramble();
    initSpotlight();
    initMagnetic();
    initTilt();
  }

  return { init };
})();

/* ---- Command palette (Cmd/Ctrl+K) ---- */
const PortfolioPalette = (() => {
  const COMMANDS = [
    { cmd: 'whoami',    desc: 'About Shulank',           action: () => scrollToId('about') },
    { cmd: 'ls projects', desc: 'Selected work',          action: () => scrollToId('projects') },
    { cmd: 'cat experience', desc: 'Career timeline',      action: () => scrollToId('experience') },
    { cmd: 'cat skills', desc: 'Toolkit',                 action: () => scrollToId('skills') },
    { cmd: 'cat education', desc: 'Education + certs',    action: () => scrollToId('education') },
    { cmd: 'cat writing', desc: 'Blog posts',             action: () => { window.location.href = '/blog/'; } },
    { cmd: 'phishguard', desc: 'PhishGuard Pro case study', action: () => { window.location.href = 'phishguard.html'; } },
    { cmd: 'mail',      desc: 'Open contact section',    action: () => scrollToId('contact') },
    { cmd: 'cat resume', desc: 'Download resume PDF',    action: () => triggerDownload() },
    { cmd: 'gh',        desc: 'Open LinkedIn',           action: () => window.open('https://www.linkedin.com/in/shulank-patel-772710204', '_blank', 'noopener') },
    { cmd: 'toggle theme', desc: 'Flip light/dark',      action: () => { if (window.PortfolioTheme) PortfolioTheme.toggleTheme(); } },
    { cmd: 'help',      desc: 'Show all commands',       action: () => { /* no-op, already showing */ } },
  ];

  let activeIndex = 0;
  let filtered = COMMANDS.slice();

  function scrollToId(id) {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function triggerDownload() {
    const a = document.createElement('a');
    a.href = 'assets/resume/Shulank_Patel_Resume.pdf';
    a.download = 'Shulank_Patel_Resume.pdf';
    a.click();
  }

  function open() {
    const overlay = document.querySelector('[data-palette-overlay]');
    const input = document.querySelector('[data-palette-input]');
    if (!overlay || !input) return;
    overlay.setAttribute('data-open', 'true');
    input.value = '';
    activeIndex = 0;
    filtered = COMMANDS.slice();
    render();
    setTimeout(() => input.focus(), 50);
  }

  function close() {
    const overlay = document.querySelector('[data-palette-overlay]');
    if (overlay) overlay.removeAttribute('data-open');
  }

  function render() {
    const list = document.querySelector('[data-palette-list]');
    if (!list) return;
    list.innerHTML = '';
    if (filtered.length === 0) {
      const empty = document.createElement('div');
      empty.className = 'palette-empty';
      empty.textContent = 'No commands match. Try "help".';
      list.appendChild(empty);
      return;
    }
    filtered.forEach((c, i) => {
      const row = document.createElement('div');
      row.className = 'palette-item';
      row.setAttribute('role', 'option');
      if (i === activeIndex) row.setAttribute('data-active', 'true');
      row.innerHTML = `<span class="cmd">${c.cmd}</span><span class="desc">${c.desc}</span><span class="key">↵</span>`;
      row.addEventListener('mouseenter', () => { activeIndex = i; render(); });
      row.addEventListener('click', () => execute(i));
      list.appendChild(row);
    });
  }

  function execute(i) {
    const c = filtered[i];
    if (!c) return;
    close();
    setTimeout(() => c.action(), 100);
  }

  function filter(query) {
    const q = query.trim().toLowerCase();
    if (!q) { filtered = COMMANDS.slice(); }
    else { filtered = COMMANDS.filter((c) => c.cmd.includes(q) || c.desc.toLowerCase().includes(q)); }
    activeIndex = 0;
    render();
  }

  function init() {
    const overlay = document.querySelector('[data-palette-overlay]');
    const input = document.querySelector('[data-palette-input]');
    if (!overlay || !input) return;

    document.addEventListener('keydown', (e) => {
      const isOpen = overlay.getAttribute('data-open') === 'true';
      const isPaletteShortcut = (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k';
      if (isPaletteShortcut) {
        e.preventDefault();
        if (isOpen) close(); else open();
        return;
      }
      if (!isOpen) return;
      if (e.key === 'Escape') { e.preventDefault(); close(); return; }
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        activeIndex = Math.min(filtered.length - 1, activeIndex + 1);
        render();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        activeIndex = Math.max(0, activeIndex - 1);
        render();
      } else if (e.key === 'Enter') {
        e.preventDefault();
        execute(activeIndex);
      }
    });

    input.addEventListener('input', (e) => filter(e.target.value));

    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) close();
    });

    const trigger = document.querySelector('[data-palette-trigger]');
    if (trigger) trigger.addEventListener('click', open);
  }

  return { init, open };
})();

/* ---- PhishGuard Pro demo widget ---- */
const PortfolioPhishDemo = (() => {
  const reduceMotion = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const PHASES = [
    'Core',
    'Enrichment',
    'Modern Threats',
    'MITRE + IOC',
    'External APIs',
    'Intelligence',
  ];

  // Per-sample finding scripts. Each entry: [phaseIndex, severity, message]
  const SAMPLES = [
    {
      // Microsoft credential phish (BitB)
      verdict: { level: 'crit', label: 'HIGH RISK · CREDENTIAL HARVEST', mitre: 'T1566.001 · T1656 · T1557' },
      findings: [
        [0, 'info', 'Header parsed · SPF: softfail · DKIM: none'],
        [0, 'warn', 'Sender domain `m1crosoftonline.com` is lookalike of microsoftonline.com'],
        [1, 'warn', 'WHOIS: domain registered 4d ago · privacy-protected'],
        [2, 'crit', 'BitB DOM fingerprint detected · score 0.87'],
        [2, 'warn', 'Redirect chain ends at credential-harvest URL'],
        [3, 'info', 'MITRE map: T1566.001, T1656, T1557'],
        [3, 'info', 'IOC bundle: 1 sender, 2 URLs, 1 IP'],
        [4, 'warn', 'urlscan.io: phishing-confidence 92%'],
        [5, 'info', 'STIX 2.1 bundle ready for SIEM export'],
      ],
    },
    {
      // OAuth consent phish
      verdict: { level: 'crit', label: 'HIGH RISK · OAUTH CONSENT ABUSE', mitre: 'T1528 · T1199' },
      findings: [
        [0, 'info', 'Header parsed · DocuSign branding cloned'],
        [0, 'warn', 'Sender domain `docusign-share.live` not a DocuSign property'],
        [1, 'info', 'WHOIS: domain registered 11d ago'],
        [2, 'crit', 'OAuth consent URL requests `Mail.ReadWrite Mail.Send`'],
        [2, 'warn', 'Scope exceeds legitimate DocuSign integration baseline'],
        [3, 'info', 'MITRE map: T1528 (OAuth consent), T1199 (trusted relationship)'],
        [4, 'warn', 'VirusTotal: 3/89 vendors flag the consent URL'],
        [5, 'info', 'STIX 2.1 bundle ready for SIEM export'],
      ],
    },
    {
      // BEC wire fraud
      verdict: { level: 'warn', label: 'MEDIUM RISK · BEC IMPERSONATION', mitre: 'T1656 · T1534' },
      findings: [
        [0, 'info', 'Header parsed · reply-to differs from from-address'],
        [0, 'warn', 'CEO impersonation pattern: "quick favor" + urgency'],
        [1, 'warn', 'Domain `acme-corp-finance.co` is 2d old'],
        [2, 'warn', 'No attached file / no link — pure social engineering'],
        [3, 'info', 'MITRE map: T1656 (impersonation), T1534 (internal spearphish)'],
        [4, 'info', 'urlscan.io: no URLs to scan'],
        [5, 'info', 'STIX 2.1 bundle: 1 sender, 1 domain'],
      ],
    },
  ];

  let selectedIdx = 0;
  let running = false;

  function el(query) { return document.querySelector(query); }

  function setSelected(idx) {
    selectedIdx = idx;
    document.querySelectorAll('.pg-sample').forEach((b, i) => {
      b.setAttribute('aria-pressed', String(i === idx));
    });
  }

  function reset() {
    const run = el('[data-pg-run]');
    if (run) run.innerHTML = '<div class="pg-demo-empty">Pick a sample on the left and hit Analyze.<br>The 6-phase pipeline will run live.</div>';
  }

  function buildSkeleton() {
    const run = el('[data-pg-run]');
    if (!run) return null;
    run.innerHTML = '';
    PHASES.forEach((name, i) => {
      const row = document.createElement('div');
      row.className = 'pg-phase';
      row.dataset.pgPhase = String(i);
      row.innerHTML =
        `<span class="pg-phase-tag">${String(i + 1).padStart(2, '0')}</span>` +
        `<span class="pg-phase-name">${name}</span>` +
        `<span class="pg-bar"><span class="pg-bar-fill"></span></span>` +
        `<span class="pg-check">…</span>`;
      run.appendChild(row);
    });
    const findings = document.createElement('div');
    findings.className = 'pg-findings';
    findings.setAttribute('data-pg-findings', '');
    run.appendChild(findings);
    return run;
  }

  function appendFinding(phaseIdx, sev, msg) {
    const box = el('[data-pg-findings]');
    if (!box) return;
    const row = document.createElement('div');
    row.className = 'pg-finding';
    row.innerHTML = `<span class="pg-finding-sev ${sev}">[P${String(phaseIdx + 1).padStart(2, '0')} ${sev.toUpperCase()}]</span><span class="pg-finding-msg">${msg}</span>`;
    box.appendChild(row);
  }

  function setPhaseDone(i) {
    const node = document.querySelector(`.pg-phase[data-pg-phase="${i}"]`);
    if (!node) return;
    node.setAttribute('data-done', 'true');
    node.querySelector('.pg-check').textContent = '✓';
  }

  function setPhaseProgress(i, pct) {
    const node = document.querySelector(`.pg-phase[data-pg-phase="${i}"]`);
    if (!node) return;
    const fill = node.querySelector('.pg-bar-fill');
    fill.style.width = `${pct}%`;
  }

  function appendVerdict(sample) {
    const run = el('[data-pg-run]');
    if (!run) return;
    const v = document.createElement('div');
    v.className = `pg-verdict ${sample.verdict.level}`;
    v.innerHTML =
      `<div class="pg-verdict-title">Verdict · ${sample.verdict.label}</div>` +
      `<div class="pg-verdict-mitre">MITRE: ${sample.verdict.mitre} · STIX 2.1 bundle exported (demo)</div>`;
    run.appendChild(v);
  }

  function sleep(ms) { return new Promise((r) => setTimeout(r, ms)); }

  async function run() {
    if (running) return;
    running = true;
    const btn = el('[data-pg-analyze]');
    btn.disabled = true;
    const originalText = btn.textContent;
    btn.textContent = 'Analyzing…';

    buildSkeleton();
    const sample = SAMPLES[selectedIdx];

    if (reduceMotion) {
      // Static fill — no animation
      PHASES.forEach((_, i) => setPhaseDone(i));
      sample.findings.forEach(([p, s, m]) => appendFinding(p, s, m));
      appendVerdict(sample);
    } else {
      const findingsByPhase = new Map();
      sample.findings.forEach(([p, s, m]) => {
        if (!findingsByPhase.has(p)) findingsByPhase.set(p, []);
        findingsByPhase.get(p).push([s, m]);
      });

      for (let i = 0; i < PHASES.length; i++) {
        // Animate bar fill in ~6 steps over ~450ms
        for (let s = 1; s <= 6; s++) {
          setPhaseProgress(i, (s / 6) * 100);
          await sleep(70);
        }
        // Emit findings for this phase
        const fs = findingsByPhase.get(i) || [];
        for (const [sev, msg] of fs) {
          appendFinding(i, sev, msg);
          await sleep(180);
        }
        setPhaseDone(i);
        await sleep(120);
      }
      appendVerdict(sample);
    }

    btn.disabled = false;
    btn.textContent = originalText;
    running = false;
  }

  function init() {
    const widget = el('.pg-demo');
    if (!widget) return;
    document.querySelectorAll('.pg-sample').forEach((b, i) => {
      b.addEventListener('click', () => { if (!running) { setSelected(i); reset(); } });
    });
    const analyze = el('[data-pg-analyze]');
    if (analyze) analyze.addEventListener('click', run);
  }

  return { init };
})();

document.addEventListener('DOMContentLoaded', () => {
  PortfolioTheme.init();
  PortfolioNav.init();
  PortfolioContact.init();
  PortfolioScroll.init();
  PortfolioPolish.init();
  PortfolioPalette.init();
  PortfolioPhishDemo.init();
});
