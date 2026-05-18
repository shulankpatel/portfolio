# Portfolio Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a static portfolio website for Shulank Patel (SOC Analyst at dayOneCyber) with a long-scroll homepage, a deep-dive PhishGuard Pro case study, and a scaffolded blog — all in vanilla HTML/CSS/JS, deployable to GitHub Pages.

**Architecture:** Static site, no build step. One shared stylesheet, two JS modules (`main.js` for behavior, `network-bg.js` for the canvas animation). Pages share an inlined `<head>`, `<nav>`, and `<footer>` (no templating — copy/paste across the 5 content pages plus 404). Light/dark theming via CSS custom properties swapped on a `data-theme` attribute. Contact form opens the user's mail client via `mailto:` — no backend.

**Tech Stack:** HTML5, CSS3 (custom properties + flex/grid), vanilla JavaScript (ES2020+). Inter + JetBrains Mono via Google Fonts. Deployment: GitHub Pages.

**Spec:** `docs/superpowers/specs/2026-05-18-portfolio-design.md`

**Test approach:** This is a static site, so most verification is **manual visual checks** in a browser. Pure JS functions (theme storage, mailto URL building) get **inline browser-based unit tests** via a small assertion runner at `tests/test-runner.html` — no npm, no framework, just `<script>` tags. Each task lists exact verification steps.

---

## File structure (created across all tasks)

```
portfolio/
├── index.html
├── phishguard.html
├── 404.html
├── blog/
│   ├── index.html
│   ├── building-phishguard-pro.html
│   └── detecting-bitb-attacks.html
├── assets/
│   ├── css/styles.css
│   ├── js/
│   │   ├── main.js
│   │   └── network-bg.js
│   ├── img/                            # screenshots, og-image, favicons (engineer adds)
│   └── resume/Shulank_Patel_Resume.pdf
├── tests/
│   └── test-runner.html
├── README.md
├── .nojekyll
├── .gitignore                          # already created during brainstorming
└── docs/                               # spec + this plan (already exist)
```

**Module responsibilities:**
- `styles.css` — All visual styling. Organized into labeled blocks: tokens, reset, typography, layout, components (button, card, stat, pill, timeline, form), sections (hero, projects, etc.), utilities, media queries.
- `main.js` — Theme toggle (`getInitialTheme`, `applyTheme`, `toggleTheme`), mobile-nav drawer toggle, contact-form mailto handler (`buildMailto`, `handleContactSubmit`), `IntersectionObserver` scroll-reveal.
- `network-bg.js` — Self-initializing canvas animation. Looks for `<canvas id="network-bg">`; if found, runs. Otherwise exits silently.

---

## Task 1: Project scaffolding

**Files:**
- Create: `index.html`, `phishguard.html`, `404.html`, `blog/index.html`, `blog/building-phishguard-pro.html`, `blog/detecting-bitb-attacks.html`, `assets/css/styles.css`, `assets/js/main.js`, `assets/js/network-bg.js`, `tests/test-runner.html`, `.nojekyll`, `README.md`
- Modify: none

- [ ] **Step 1: Create the folder structure**

Run from project root (`/Users/shulankpatel/Downloads/Claude/portfolio/`):

```bash
mkdir -p blog assets/css assets/js assets/img assets/resume tests
```

Expected: directories created with no error.

- [ ] **Step 2: Copy the resume PDF into the project**

```bash
cp ../Shulank_Patel_Resume.pdf assets/resume/Shulank_Patel_Resume.pdf
ls -la assets/resume/
```

Expected: `Shulank_Patel_Resume.pdf` appears with ~48KB size.

- [ ] **Step 3: Create placeholder files**

Write each file with this minimal content (so layout/links won't 404 during dev):

`index.html`, `phishguard.html`, `404.html`, `blog/index.html`, `blog/building-phishguard-pro.html`, `blog/detecting-bitb-attacks.html`:
```html
<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8"><title>Placeholder</title></head><body></body></html>
```

`assets/css/styles.css`: empty file.

`assets/js/main.js`:
```js
// main.js — placeholder
```

`assets/js/network-bg.js`:
```js
// network-bg.js — placeholder
```

`tests/test-runner.html`:
```html
<!DOCTYPE html>
<html><head><title>Tests</title></head><body><pre id="r">Tests not implemented yet.</pre></body></html>
```

`.nojekyll`: empty file (disables Jekyll on GitHub Pages so paths starting with `_` work if ever needed).

`README.md`:
```markdown
# Shulank Patel — Portfolio

Static portfolio site. Vanilla HTML/CSS/JS. No build step.

## Run locally
Open `index.html` in any browser. Or serve the directory:
```
python3 -m http.server 8000
```
Then visit http://localhost:8000

## Deploy
See deployment section in the design spec.
```

- [ ] **Step 4: Verify the structure**

```bash
find . -type f -not -path './.git/*' -not -path './.superpowers/*' -not -path './docs/*' | sort
```

Expected output (or similar):
```
./.gitignore
./.nojekyll
./404.html
./README.md
./assets/css/styles.css
./assets/js/main.js
./assets/js/network-bg.js
./assets/resume/Shulank_Patel_Resume.pdf
./blog/building-phishguard-pro.html
./blog/detecting-bitb-attacks.html
./blog/index.html
./index.html
./phishguard.html
./tests/test-runner.html
```

- [ ] **Step 5: Commit**

```bash
git add .
git commit -m "feat: scaffold portfolio site structure

Adds placeholder files for all 5 content pages plus 404,
asset directories, test runner stub, and README.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 2: Design tokens, reset, and base typography

**Files:**
- Modify: `assets/css/styles.css`
- Create: nothing new

- [ ] **Step 1: Write the full base stylesheet**

Replace the empty `assets/css/styles.css` with:

```css
/* ============================================================
   PORTFOLIO STYLESHEET — TACTICAL MIDNIGHT
   ============================================================
   1. Tokens (dark default, light variant)
   2. Reset & base
   3. Typography
   4. Layout primitives
   5. Components (added in later tasks)
   6. Sections (added in later tasks)
   7. Utilities
   8. Media queries (added in later tasks)
   ============================================================ */

/* ============ 1. TOKENS ============ */
:root {
  --bg-deep: #04080f;
  --bg-surface: #0a1628;
  --bg-card: #0f1e36;
  --border: #1e3a52;
  --text-primary: #e2e8f0;
  --text-muted: #94a3b8;
  --text-dim: #64748b;
  --primary: #22d3ee;
  --primary-deep: #0ea5e9;
  --accent: #f97316;
  --gradient: linear-gradient(135deg, #22d3ee 0%, #0ea5e9 50%, #0284c7 100%);

  --font-ui: 'Inter', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', 'SF Mono', Menlo, monospace;

  --radius-sm: 6px;
  --radius-md: 8px;
  --radius-lg: 12px;

  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.3);
  --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.4);
  --shadow-glow: 0 0 24px rgba(34, 211, 238, 0.15);

  --ease: cubic-bezier(0.4, 0, 0.2, 1);
  --max-width: 1200px;
}

[data-theme="light"] {
  --bg-deep: #f0f9ff;
  --bg-surface: #ffffff;
  --bg-card: #ffffff;
  --border: #cbd5e1;
  --text-primary: #0f172a;
  --text-muted: #475569;
  --text-dim: #64748b;
  --primary: #0284c7;
  --primary-deep: #0369a1;
  --accent: #ea580c;
  --gradient: linear-gradient(135deg, #0284c7 0%, #0369a1 50%, #075985 100%);
  --shadow-glow: 0 0 24px rgba(2, 132, 199, 0.15);
}

/* ============ 2. RESET ============ */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { scroll-behavior: smooth; }
body {
  font-family: var(--font-ui);
  background: var(--bg-deep);
  color: var(--text-primary);
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  min-height: 100vh;
  overflow-x: hidden;
}
img, svg { max-width: 100%; display: block; }
a { color: var(--primary); text-decoration: none; transition: color 0.2s var(--ease); }
a:hover { color: var(--accent); }
button { font: inherit; cursor: pointer; background: none; border: none; color: inherit; }
ul, ol { list-style: none; }
input, textarea { font: inherit; color: inherit; background: transparent; border: none; }
:focus-visible { outline: 2px solid var(--primary); outline-offset: 2px; border-radius: var(--radius-sm); }

/* ============ 3. TYPOGRAPHY ============ */
h1, h2, h3, h4 { font-weight: 700; line-height: 1.15; letter-spacing: -0.02em; }
h1 { font-size: clamp(48px, 7vw, 72px); font-weight: 800; }
h2 { font-size: clamp(32px, 4vw, 48px); }
h3 { font-size: clamp(20px, 2.5vw, 28px); }
h4 { font-size: 18px; }
p { color: var(--text-muted); }
code, .mono { font-family: var(--font-mono); }

.section-label {
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 2px;
  color: var(--primary);
  text-transform: uppercase;
  margin-bottom: 16px;
  display: inline-block;
}
.section-label::before { content: "// "; opacity: 0.6; }

.subtitle { font-size: 18px; color: var(--text-muted); }

/* ============ 4. LAYOUT ============ */
.container { width: 100%; max-width: var(--max-width); margin: 0 auto; padding: 0 24px; }
@media (min-width: 768px) { .container { padding: 0 48px; } }
@media (min-width: 1024px) { .container { padding: 0 72px; } }

section { padding: 96px 0; position: relative; }
section + section { border-top: 1px solid rgba(30, 58, 82, 0.4); }
[data-theme="light"] section + section { border-top-color: rgba(203, 213, 225, 0.5); }

/* Skip link */
.skip-link {
  position: absolute; top: -40px; left: 0;
  background: var(--primary); color: var(--bg-deep);
  padding: 8px 16px; font-weight: 600; z-index: 100;
  transition: top 0.2s var(--ease);
}
.skip-link:focus { top: 0; }

/* Utilities */
.sr-only {
  position: absolute; width: 1px; height: 1px;
  padding: 0; margin: -1px; overflow: hidden;
  clip: rect(0, 0, 0, 0); border: 0;
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

- [ ] **Step 2: Hook up the stylesheet from `index.html` for visual verification**

Replace the content of `index.html` with a temporary sandbox:

```html
<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Tokens sandbox</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="assets/css/styles.css">
</head>
<body>
  <main class="container" style="padding-top:48px;padding-bottom:48px">
    <span class="section-label">section 00 — tokens sandbox</span>
    <h1>Shulank Patel.</h1>
    <h2>Section heading</h2>
    <h3>Subsection</h3>
    <p class="subtitle">Tagline goes here. Detection &amp; response engineer.</p>
    <p>Body text. <a href="#">Hyperlink</a>. <code>const x = 42;</code></p>
    <p style="color:var(--text-dim);font-family:var(--font-mono);font-size:12px">Dim monospace label.</p>
  </main>
</body>
</html>
```

- [ ] **Step 3: Verify in the browser**

```bash
python3 -m http.server 8000
```

Open http://localhost:8000 — confirm:
- Background is deep navy `#04080f`
- "Shulank Patel." renders in Inter, ~64-72px
- "section 00 — tokens sandbox" appears in cyan JetBrains Mono with the leading "//"
- Hyperlink is cyan and turns ember orange on hover
- No console errors

Then in DevTools, run `document.documentElement.setAttribute('data-theme','light')` and confirm the page swaps to the light palette (sky-frost background, deep blue accents). Run `document.documentElement.setAttribute('data-theme','dark')` to revert.

- [ ] **Step 4: Commit**

```bash
git add assets/css/styles.css index.html
git commit -m "feat(css): add design tokens, reset, and typography base

Tokens for Tactical Midnight dark + light, full CSS reset,
Inter/JetBrains Mono setup, layout primitives, skip link,
and prefers-reduced-motion handling.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 3: Theme module (TDD)

**Files:**
- Modify: `assets/js/main.js`, `tests/test-runner.html`
- Reference: `index.html` (will use the theme on next task)

- [ ] **Step 1: Write the failing tests**

Replace `tests/test-runner.html` with:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Test Runner</title>
  <style>
    body { font-family: -apple-system, system-ui, monospace; padding: 24px; background: #0a1628; color: #e2e8f0; }
    h1 { color: #22d3ee; margin-bottom: 16px; }
    .pass { color: #22c55e; }
    .fail { color: #ef4444; }
    pre { white-space: pre-wrap; background: #04080f; padding: 16px; border-radius: 6px; border: 1px solid #1e3a52; }
    .summary { margin-top: 16px; font-weight: 600; }
  </style>
</head>
<body>
  <h1>Portfolio test runner</h1>
  <pre id="results"></pre>
  <div class="summary" id="summary"></div>

  <script src="../assets/js/main.js"></script>
  <script>
    const out = document.getElementById('results');
    const summary = document.getElementById('summary');
    let passed = 0, failed = 0;

    function test(name, fn) {
      try {
        fn();
        out.innerHTML += `<span class="pass">PASS</span>  ${name}\n`;
        passed++;
      } catch (e) {
        out.innerHTML += `<span class="fail">FAIL</span>  ${name}\n        ${e.message}\n`;
        failed++;
      }
    }
    function assertEq(a, b, label) {
      if (a !== b) throw new Error(`${label || ''} expected ${JSON.stringify(b)}, got ${JSON.stringify(a)}`);
    }
    function assertTrue(v, label) {
      if (!v) throw new Error(`${label || 'value'} expected truthy, got ${JSON.stringify(v)}`);
    }

    // === Theme module ===
    test('applyTheme sets data-theme on <html>', () => {
      PortfolioTheme.applyTheme('light');
      assertEq(document.documentElement.getAttribute('data-theme'), 'light');
      PortfolioTheme.applyTheme('dark');
      assertEq(document.documentElement.getAttribute('data-theme'), 'dark');
    });

    test('applyTheme persists to localStorage', () => {
      localStorage.removeItem('pg-theme');
      PortfolioTheme.applyTheme('light');
      assertEq(localStorage.getItem('pg-theme'), 'light');
      PortfolioTheme.applyTheme('dark');
      assertEq(localStorage.getItem('pg-theme'), 'dark');
    });

    test('toggleTheme flips between dark and light', () => {
      PortfolioTheme.applyTheme('dark');
      PortfolioTheme.toggleTheme();
      assertEq(document.documentElement.getAttribute('data-theme'), 'light');
      PortfolioTheme.toggleTheme();
      assertEq(document.documentElement.getAttribute('data-theme'), 'dark');
    });

    test('getInitialTheme prefers localStorage when set', () => {
      localStorage.setItem('pg-theme', 'light');
      assertEq(PortfolioTheme.getInitialTheme(), 'light');
      localStorage.setItem('pg-theme', 'dark');
      assertEq(PortfolioTheme.getInitialTheme(), 'dark');
      localStorage.removeItem('pg-theme');
    });

    test('getInitialTheme returns "dark" or "light" without stored value', () => {
      localStorage.removeItem('pg-theme');
      const t = PortfolioTheme.getInitialTheme();
      assertTrue(t === 'dark' || t === 'light', `getInitialTheme returned ${t}`);
    });

    summary.textContent = `Total: ${passed + failed}  •  Passed: ${passed}  •  Failed: ${failed}`;
    summary.className = 'summary ' + (failed === 0 ? 'pass' : 'fail');
  </script>
</body>
</html>
```

- [ ] **Step 2: Open the test runner and verify tests FAIL**

In the browser, navigate to http://localhost:8000/tests/test-runner.html

Expected: all 5 theme tests FAIL with "PortfolioTheme is not defined" (because `main.js` is still a placeholder).

- [ ] **Step 3: Implement the theme module**

Replace `assets/js/main.js` with:

```js
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

document.addEventListener('DOMContentLoaded', () => {
  PortfolioTheme.init();
});
```

- [ ] **Step 4: Re-run the tests and verify all PASS**

Refresh http://localhost:8000/tests/test-runner.html

Expected: all 5 tests show PASS. Summary line shows `Total: 5  •  Passed: 5  •  Failed: 0` in green.

- [ ] **Step 5: Commit**

```bash
git add assets/js/main.js tests/test-runner.html
git commit -m "feat(js): add theme module with persistence and prefers-color-scheme

PortfolioTheme exposes getInitialTheme, applyTheme, toggleTheme.
Bootstrap script applies theme before render to prevent flash.
Covered by 5 inline browser tests in tests/test-runner.html.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 4: Shared nav and footer

**Files:**
- Modify: `assets/css/styles.css`, `assets/js/main.js`, `index.html`

- [ ] **Step 1: Add nav and footer styles to `styles.css`**

Append to `assets/css/styles.css` (under the existing content):

```css
/* ============ 5. COMPONENTS ============ */

/* --- Nav --- */
.nav {
  position: sticky;
  top: 0;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 24px;
  background: color-mix(in srgb, var(--bg-deep) 70%, transparent);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid color-mix(in srgb, var(--primary) 15%, transparent);
}
@media (min-width: 768px) { .nav { padding: 16px 48px; } }

.nav-logo {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 700;
  font-size: 15px;
  letter-spacing: 0.5px;
  color: var(--text-primary);
}
.nav-logo svg { color: var(--primary); }
.nav-logo .dot { color: var(--primary); }

.nav-links {
  display: none;
  gap: 28px;
  font-size: 14px;
}
@media (min-width: 1024px) {
  .nav-links { display: flex; }
}
.nav-links a { color: var(--text-muted); }
.nav-links a:hover, .nav-links a[aria-current="page"] { color: var(--primary); }

.nav-cta {
  display: flex;
  gap: 10px;
  align-items: center;
}

.theme-toggle {
  width: 36px; height: 36px;
  border-radius: var(--radius-md);
  background: color-mix(in srgb, var(--primary) 8%, transparent);
  border: 1px solid color-mix(in srgb, var(--primary) 20%, transparent);
  color: var(--primary);
  display: flex; align-items: center; justify-content: center;
  font-size: 15px;
  transition: background 0.2s var(--ease);
}
.theme-toggle:hover { background: color-mix(in srgb, var(--primary) 18%, transparent); }

.btn {
  font-size: 13px;
  font-weight: 600;
  padding: 9px 16px;
  border-radius: var(--radius-md);
  display: inline-flex;
  align-items: center;
  gap: 6px;
  transition: transform 0.15s var(--ease), box-shadow 0.2s var(--ease);
  border: none;
  white-space: nowrap;
}
.btn:hover { transform: translateY(-1px); }
.btn-primary {
  background: var(--gradient);
  color: var(--bg-deep);
  font-weight: 700;
}
.btn-primary:hover { box-shadow: var(--shadow-glow); color: var(--bg-deep); }
.btn-secondary {
  background: transparent;
  border: 1px solid var(--primary);
  color: var(--primary);
}
.btn-secondary:hover { background: color-mix(in srgb, var(--primary) 10%, transparent); }
.btn-lg { padding: 13px 22px; font-size: 14px; }

/* Mobile nav drawer */
.nav-toggle {
  display: flex;
  width: 36px; height: 36px;
  align-items: center;
  justify-content: center;
  color: var(--text-primary);
  font-size: 20px;
}
@media (min-width: 1024px) { .nav-toggle { display: none; } }

.mobile-drawer {
  display: none;
  position: fixed;
  inset: 64px 0 0 0;
  background: var(--bg-deep);
  z-index: 40;
  padding: 32px 24px;
  flex-direction: column;
  gap: 24px;
}
.mobile-drawer.open { display: flex; }
.mobile-drawer a {
  color: var(--text-primary);
  font-size: 22px;
  font-weight: 600;
}

/* --- Footer --- */
.footer {
  padding: 48px 24px 32px;
  border-top: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  gap: 16px;
  font-size: 13px;
  color: var(--text-dim);
}
.footer-row {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 16px;
  max-width: var(--max-width);
  width: 100%;
  margin: 0 auto;
}
.footer-row a { color: var(--text-muted); }
.footer-row a:hover { color: var(--primary); }
.footer .mono { font-family: var(--font-mono); font-size: 11px; }
```

- [ ] **Step 2: Add mobile-drawer toggle to `main.js`**

Append below the theme block in `assets/js/main.js` (above the final `DOMContentLoaded` line — and update that listener to call the new init):

Replace the bottom of `main.js`:

```js
document.addEventListener('DOMContentLoaded', () => {
  PortfolioTheme.init();
});
```

with:

```js
/* ---- Mobile nav ---- */
const PortfolioNav = (() => {
  function init() {
    const toggle = document.querySelector('[data-nav-toggle]');
    const drawer = document.querySelector('[data-mobile-drawer]');
    if (!toggle || !drawer) return;
    toggle.addEventListener('click', () => {
      const open = drawer.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
      document.body.style.overflow = open ? 'hidden' : '';
    });
    drawer.addEventListener('click', (e) => {
      if (e.target.tagName === 'A') {
        drawer.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });
  }
  return { init };
})();

document.addEventListener('DOMContentLoaded', () => {
  PortfolioTheme.init();
  PortfolioNav.init();
});
```

- [ ] **Step 3: Replace `index.html` body with nav + sandbox + footer**

Replace the full content of `index.html`:

```html
<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Shulank Patel — SOC Analyst</title>
  <meta name="description" content="SOC Analyst at dayOneCyber. Detection engineering, incident response, and security automation.">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="assets/css/styles.css">
  <script src="assets/js/main.js" defer></script>
</head>
<body>
  <a class="skip-link" href="#main">Skip to content</a>

  <nav class="nav" aria-label="Primary">
    <a href="/" class="nav-logo" aria-label="Home">
      <svg width="22" height="22" viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <path d="M16 2 L28 7 V16 C28 22 22 28 16 30 C10 28 4 22 4 16 V7 Z" stroke="currentColor" stroke-width="2" fill="rgba(34,211,238,0.08)"/>
        <circle cx="16" cy="15" r="3" fill="currentColor"/>
        <path d="M16 18 V23" stroke="currentColor" stroke-width="2"/>
      </svg>
      <span>SHULANK<span class="dot">.</span>PATEL</span>
    </a>
    <ul class="nav-links">
      <li><a href="#home" aria-current="page">Home</a></li>
      <li><a href="#projects">Projects</a></li>
      <li><a href="#experience">Experience</a></li>
      <li><a href="/blog/">Writing</a></li>
      <li><a href="#contact">Contact</a></li>
    </ul>
    <div class="nav-cta">
      <button class="theme-toggle" data-theme-toggle aria-label="Toggle theme">☾</button>
      <a class="btn btn-primary" href="assets/resume/Shulank_Patel_Resume.pdf" download>Resume ↓</a>
      <button class="nav-toggle" data-nav-toggle aria-label="Open menu" aria-expanded="false">☰</button>
    </div>
  </nav>

  <div class="mobile-drawer" data-mobile-drawer aria-hidden="true">
    <a href="#home">Home</a>
    <a href="#projects">Projects</a>
    <a href="#experience">Experience</a>
    <a href="/blog/">Writing</a>
    <a href="#contact">Contact</a>
  </div>

  <main id="main">
    <section class="container">
      <span class="section-label">section 00 — nav + footer preview</span>
      <h2>Nav + footer scaffold</h2>
      <p>Replace this once hero is built.</p>
    </section>
  </main>

  <footer class="footer">
    <div class="footer-row">
      <div>© 2026 Shulank Patel. Built with vanilla HTML/CSS/JS.</div>
      <div class="mono">tactical_midnight v1</div>
    </div>
  </footer>
</body>
</html>
```

- [ ] **Step 4: Verify in the browser**

Reload http://localhost:8000 and check:
- Nav is sticky at top with the shield logo, links visible at desktop width
- Resume button has the cyan gradient and downloads the PDF when clicked
- Theme toggle (☾) flips dark ↔ light and persists across reload
- At 320px / 768px (DevTools responsive mode), nav links hide and ☰ appears; tap ☰, drawer opens full-screen, body scroll locks; tap a link, drawer closes
- Footer renders at bottom with copyright + mono tag
- Skip-to-content link appears on Tab from a fresh tab focus
- No console errors

- [ ] **Step 5: Commit**

```bash
git add assets/css/styles.css assets/js/main.js index.html
git commit -m "feat: shared nav, mobile drawer, footer

Sticky glassmorphism nav with logo, links, theme toggle,
resume download CTA, mobile drawer with body-scroll lock,
and footer scaffold. Buttons and theme toggle styles added.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 5: Network background animation

**Files:**
- Modify: `assets/js/network-bg.js`, `assets/css/styles.css`, `index.html`

- [ ] **Step 1: Implement the canvas animation**

Replace `assets/js/network-bg.js` with:

```js
/* ============================================================
   PORTFOLIO — network-bg.js
   Self-initializing canvas animation: drifting nodes with
   connections + occasional "threat detected" ember pulse.
   ============================================================ */
(function () {
  const canvas = document.getElementById('network-bg');
  if (!canvas || !canvas.getContext) return;

  const reduceMotion = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const ctx = canvas.getContext('2d');
  let dpr = Math.max(1, window.devicePixelRatio || 1);
  let width = 0, height = 0;
  const nodes = [];
  const NODE_COUNT = 40;
  const MAX_LINK_DIST = 180;
  let threatPulse = null;
  let threatTimer = 0;
  const THREAT_INTERVAL = 6000; // ms

  function resize() {
    const rect = canvas.getBoundingClientRect();
    width = rect.width;
    height = rect.height;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function rand(min, max) { return Math.random() * (max - min) + min; }

  function seed() {
    nodes.length = 0;
    for (let i = 0; i < NODE_COUNT; i++) {
      nodes.push({
        x: rand(0, width),
        y: rand(0, height),
        vx: rand(-0.3, 0.3),
        vy: rand(-0.3, 0.3),
        r: rand(1.5, 3.5),
      });
    }
  }

  function step(dt) {
    for (const n of nodes) {
      n.x += n.vx;
      n.y += n.vy;
      if (n.x < 0 || n.x > width) n.vx *= -1;
      if (n.y < 0 || n.y > height) n.vy *= -1;
    }
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);

    // Lines first (under nodes)
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i], b = nodes[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < MAX_LINK_DIST) {
          const alpha = (1 - d / MAX_LINK_DIST) * 0.25;
          ctx.strokeStyle = `rgba(34, 211, 238, ${alpha.toFixed(3)})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }

    // Nodes
    for (const n of nodes) {
      ctx.fillStyle = 'rgba(34, 211, 238, 0.7)';
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fill();
    }

    // Threat pulse
    if (threatPulse) {
      const p = threatPulse;
      const t = (performance.now() - p.start) / p.duration;
      if (t >= 1) {
        threatPulse = null;
      } else {
        const r = 6 + (28 - 6) * t;
        const alpha = (1 - t) * 0.85;
        ctx.strokeStyle = `rgba(249, 115, 22, ${alpha.toFixed(3)})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fillStyle = `rgba(249, 115, 22, ${(alpha * 0.5).toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  function maybeSpawnThreat(dt) {
    threatTimer += dt;
    if (threatTimer >= THREAT_INTERVAL && !threatPulse && nodes.length > 0) {
      threatTimer = 0;
      const n = nodes[Math.floor(Math.random() * nodes.length)];
      threatPulse = { x: n.x, y: n.y, start: performance.now(), duration: 2000 };
    }
  }

  let lastT = performance.now();
  let running = true;

  function loop(now) {
    const dt = now - lastT;
    lastT = now;
    if (running) {
      step(dt);
      maybeSpawnThreat(dt);
      draw();
    }
    requestAnimationFrame(loop);
  }

  // Static one-frame render for reduced motion
  function renderStatic() {
    draw();
  }

  // Pause when tab not visible
  document.addEventListener('visibilitychange', () => {
    running = !document.hidden;
    lastT = performance.now();
  });

  // Init
  window.addEventListener('resize', () => { resize(); seed(); });
  resize();
  seed();

  if (reduceMotion) {
    renderStatic();
  } else {
    requestAnimationFrame((t) => { lastT = t; loop(t); });
  }
})();
```

- [ ] **Step 2: Add hero background styles to `styles.css`**

Append to `assets/css/styles.css`:

```css
/* --- Hero --- */
.hero {
  position: relative;
  padding: 80px 0 64px;
  overflow: hidden;
  background:
    radial-gradient(circle at 80% 20%, color-mix(in srgb, var(--primary) 12%, transparent) 0%, transparent 50%),
    radial-gradient(circle at 20% 80%, color-mix(in srgb, var(--accent) 8%, transparent) 0%, transparent 50%),
    var(--bg-deep);
}
.hero canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}
.hero-inner {
  position: relative;
  z-index: 2;
  max-width: var(--max-width);
  margin: 0 auto;
  padding: 0 24px;
}
@media (min-width: 768px) { .hero-inner { padding: 0 48px; } }
@media (min-width: 1024px) { .hero-inner { padding: 0 72px; } }
```

- [ ] **Step 3: Add a canvas placeholder into `index.html` for visual verification**

In `index.html`, replace the existing `<main id="main">...</main>` block with:

```html
<main id="main">
  <section class="hero">
    <canvas id="network-bg" aria-hidden="true"></canvas>
    <div class="hero-inner" style="min-height:400px;display:flex;align-items:center">
      <h2>Network animation preview</h2>
    </div>
  </section>
</main>
```

And add `<script src="assets/js/network-bg.js" defer></script>` just before `</body>`:

```html
  <script src="assets/js/main.js" defer></script>
  <script src="assets/js/network-bg.js" defer></script>
</body>
```

(So the closing tags are in order: `</main>`, `<footer>...</footer>`, `<script>` tags, `</body>`.)

- [ ] **Step 4: Verify in the browser**

Reload http://localhost:8000 and check:
- ~40 cyan dots drift slowly across the hero area
- Lines fade in/out between nearby dots
- About every 6 seconds, an ember-orange ring expands out from one random node, fading as it grows
- Open DevTools → Rendering tab → set "Emulate CSS media feature prefers-reduced-motion: reduce" — confirm the animation stops moving (renders a static frame)
- Switch tabs and return — confirm animation pauses/resumes (no jump)
- No console errors

- [ ] **Step 5: Commit**

```bash
git add assets/js/network-bg.js assets/css/styles.css index.html
git commit -m "feat(animation): canvas network background with threat pulse

Self-initializing canvas: ~40 drifting nodes, fading line links,
periodic ember-orange threat-detected pulse every ~6s. Pauses
when tab is hidden. Renders a static frame when prefers-reduced-motion.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 6: Home — Hero section

**Files:**
- Modify: `assets/css/styles.css`, `index.html`

- [ ] **Step 1: Append hero content styles to `styles.css`**

Append:

```css
.status-pill {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 14px;
  background: color-mix(in srgb, var(--accent) 10%, transparent);
  border: 1px solid color-mix(in srgb, var(--accent) 30%, transparent);
  border-radius: 100px;
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 1.5px;
  color: var(--accent);
  text-transform: uppercase;
  margin-bottom: 28px;
}
.status-dot {
  width: 8px; height: 8px;
  background: var(--accent);
  border-radius: 50%;
  box-shadow: 0 0 8px var(--accent);
  animation: pulse 2s ease-in-out infinite;
}
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.hero-prompt {
  font-family: var(--font-mono);
  font-size: 13px;
  color: var(--primary);
  margin-bottom: 16px;
  opacity: 0.85;
}
.hero-prompt .caret { animation: blink 1.2s infinite; }
@keyframes blink { 0%, 49% { opacity: 1; } 50%, 100% { opacity: 0; } }

.hero h1 {
  margin-bottom: 20px;
  background: linear-gradient(180deg, var(--text-primary) 0%, var(--text-muted) 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}
.hero h1 .accent {
  background: var(--gradient);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.hero-tagline { font-size: clamp(18px, 2.2vw, 22px); color: var(--text-muted); margin-bottom: 16px; max-width: 720px; }
.hero-tagline strong { color: var(--text-primary); font-weight: 600; }

.hero-location {
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--text-dim);
  margin-bottom: 36px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.hero-cta { display: flex; flex-wrap: wrap; gap: 14px; margin-bottom: 56px; }

.stats {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 14px;
  max-width: 900px;
}
@media (min-width: 768px) { .stats { grid-template-columns: repeat(4, 1fr); } }

.stat {
  padding: 18px 16px;
  background: color-mix(in srgb, var(--bg-card) 60%, transparent);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid var(--border);
  border-left: 2px solid var(--primary);
  border-radius: var(--radius-sm);
}
.stat.accent { border-left-color: var(--accent); }
.stat-label {
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 1.5px;
  color: var(--text-dim);
  text-transform: uppercase;
  margin-bottom: 6px;
}
.stat-value {
  font-size: clamp(24px, 3vw, 32px);
  font-weight: 800;
  color: var(--primary);
  letter-spacing: -0.02em;
  line-height: 1;
  margin-bottom: 4px;
}
.stat.accent .stat-value { color: var(--accent); }
.stat-desc { font-size: 11px; color: var(--text-muted); }
```

- [ ] **Step 2: Replace the hero placeholder in `index.html` with the real hero**

In `index.html`, replace the entire `<section class="hero">...</section>` block (created in Task 5) with:

```html
<section class="hero" id="home">
  <canvas id="network-bg" aria-hidden="true"></canvas>
  <div class="hero-inner">
    <span class="status-pill">
      <span class="status-dot" aria-hidden="true"></span>
      <span>Available for opportunities</span>
    </span>

    <div class="hero-prompt">$ whoami<span class="caret">▊</span></div>

    <h1>Shulank Patel<span class="accent">.</span></h1>

    <p class="hero-tagline">
      <strong>SOC Analyst</strong> at dayOneCyber. I build automated detection &amp; response workflows that cut investigation time and surface real threats faster.
    </p>

    <div class="hero-location">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
      Ottawa, Canada · Open to remote
    </div>

    <div class="hero-cta">
      <a href="#projects" class="btn btn-primary btn-lg">View Work →</a>
      <a href="assets/resume/Shulank_Patel_Resume.pdf" class="btn btn-secondary btn-lg" download>Download Resume ↓</a>
    </div>

    <div class="stats" aria-label="Impact metrics">
      <div class="stat">
        <div class="stat-label">MTTD</div>
        <div class="stat-value">↓ 30%</div>
        <div class="stat-desc">Faster critical detection</div>
      </div>
      <div class="stat accent">
        <div class="stat-label">Resolution</div>
        <div class="stat-value">↓ 25%</div>
        <div class="stat-desc">Avg incident time saved</div>
      </div>
      <div class="stat">
        <div class="stat-label">Phish Triage</div>
        <div class="stat-value">↓ 40%</div>
        <div class="stat-desc">Investigation time cut</div>
      </div>
      <div class="stat accent">
        <div class="stat-label">Tickets</div>
        <div class="stat-value">1000+</div>
        <div class="stat-desc">Resolved cross-functionally</div>
      </div>
    </div>
  </div>
</section>
```

- [ ] **Step 3: Verify in the browser**

Reload http://localhost:8000 and check against the approved hero mockup:
- Status pill in ember orange at top, with pulsing dot
- `$ whoami▊` cyan prompt with blinking caret
- "Shulank Patel" big with cyan gradient on the period
- Tagline reads correctly with "SOC Analyst" bold
- Location row with pin icon
- Two CTAs (View Work → primary gradient, Download Resume ↓ secondary)
- 4 stat tiles: MTTD, Resolution (ember accent), Phish Triage, Tickets (ember accent)
- Network animation still runs behind hero
- At 320px wide: stats collapse to 2 columns; nav goes to mobile drawer; layout doesn't break
- At 768px: stats become 4 columns

- [ ] **Step 4: Commit**

```bash
git add assets/css/styles.css index.html
git commit -m "feat(home): build hero section with stats

Status pill, terminal prompt, gradient name, tagline, location,
CTAs (View Work + Download Resume), and 4 impact stat tiles
(MTTD, Resolution, Phish Triage, Tickets).

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 7: Home — About + Projects grid

**Files:**
- Modify: `assets/css/styles.css`, `index.html`
- Optional: add 4 project thumbnail SVGs/images later (engineer's choice — placeholder cards suffice for v1)

- [ ] **Step 1: Append about and project-card styles to `styles.css`**

Append:

```css
/* --- About --- */
.about p {
  font-size: clamp(18px, 2vw, 22px);
  color: var(--text-muted);
  max-width: 760px;
  line-height: 1.6;
}
.about p strong { color: var(--text-primary); }

/* --- Project grid --- */
.projects-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
}
@media (min-width: 768px) { .projects-grid { grid-template-columns: repeat(2, 1fr); } }
@media (min-width: 1024px) { .projects-grid { grid-template-columns: repeat(3, 1fr); } }

.project-card {
  display: flex;
  flex-direction: column;
  padding: 24px;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  transition: transform 0.2s var(--ease), border-color 0.2s var(--ease), box-shadow 0.2s var(--ease);
  position: relative;
  overflow: hidden;
}
.project-card:hover {
  transform: translateY(-2px);
  border-color: var(--primary);
  box-shadow: var(--shadow-glow);
}
.project-card.featured {
  grid-column: 1 / -1;
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;
  padding: 28px;
}
@media (min-width: 768px) { .project-card.featured { grid-template-columns: 1.2fr 1fr; } }
@media (min-width: 1024px) { .project-card.featured { grid-column: 1 / -1; } }

.project-thumb {
  background: linear-gradient(135deg, color-mix(in srgb, var(--primary) 15%, var(--bg-deep)) 0%, var(--bg-deep) 100%);
  border-radius: var(--radius-md);
  aspect-ratio: 16 / 9;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--primary);
  font-family: var(--font-mono);
  font-size: 13px;
  letter-spacing: 2px;
  margin-bottom: 16px;
  border: 1px solid var(--border);
}
.project-card.featured .project-thumb {
  margin-bottom: 0;
  aspect-ratio: auto;
  min-height: 200px;
}
.project-card h3 { margin-bottom: 8px; color: var(--text-primary); }
.project-card .project-desc {
  color: var(--text-muted);
  font-size: 14px;
  margin-bottom: 16px;
  line-height: 1.55;
  flex: 1;
}
.tag-row { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 16px; }
.tag {
  font-family: var(--font-mono);
  font-size: 11px;
  padding: 4px 10px;
  border: 1px solid color-mix(in srgb, var(--primary) 30%, transparent);
  border-radius: 100px;
  color: var(--primary);
  background: color-mix(in srgb, var(--primary) 5%, transparent);
}
.project-link {
  font-family: var(--font-mono);
  font-size: 13px;
  font-weight: 600;
  color: var(--primary);
  display: inline-flex;
  align-items: center;
  gap: 4px;
}
.project-link::after { content: "→"; transition: transform 0.2s var(--ease); }
.project-card:hover .project-link::after { transform: translateX(4px); }
```

- [ ] **Step 2: Add about + projects sections to `index.html`**

After the `</section>` that closes the hero, add (still inside `<main>`):

```html
<section class="about container" id="about">
  <span class="section-label">section 01 — about</span>
  <h2>Detection meets automation.</h2>
  <p>
    I'm a <strong>SOC Analyst at dayOneCyber</strong> with two years of hands-on experience in threat detection, incident response, and vulnerability management. I work mostly in Microsoft 365 Defender (XDR), and I lean heavily on automation — N8n workflows, Python pipelines, and SIEM/SOAR integrations — to cut response times and free up human attention for the things that actually need it.
  </p>
</section>

<section class="container" id="projects">
  <span class="section-label">section 02 — selected projects</span>
  <h2 style="margin-bottom:32px">Selected work.</h2>

  <div class="projects-grid">

    <article class="project-card featured">
      <div class="project-thumb">PHISHGUARD PRO · LIVE PREVIEW</div>
      <div>
        <h3>PhishGuard Pro</h3>
        <p class="project-desc">Automated phishing email analysis with <strong style="color:var(--text-primary)">25 modules</strong> across 6 phases — including modern-threat detection (BitB, AiTM, OAuth consent phishing, phishing kit fingerprinting), MITRE ATT&amp;CK mapping for 31 techniques, and STIX 2.1 export for SIEM/SOAR integration.</p>
        <div class="tag-row">
          <span class="tag">Python</span><span class="tag">Flask</span><span class="tag">SQLite</span>
          <span class="tag">Claude API</span><span class="tag">MITRE ATT&amp;CK</span><span class="tag">STIX 2.1</span>
        </div>
        <a class="project-link" href="phishguard.html">Read case study</a>
      </div>
    </article>

    <article class="project-card">
      <div class="project-thumb">N8N · OPENVAS · OPS</div>
      <h3>Vulnerability scan automation</h3>
      <p class="project-desc">N8n workflow orchestrating monthly OpenVAS scans, formatted reporting, and stakeholder alerts. Saved 15 hours of manual work per month at dayOneCyber while improving scan consistency.</p>
      <div class="tag-row">
        <span class="tag">N8n</span><span class="tag">OpenVAS</span><span class="tag">Automation</span>
      </div>
      <a class="project-link" href="#contact">Ask me about it</a>
    </article>

    <article class="project-card">
      <div class="project-thumb">PHISH · TRIAGE · IOC</div>
      <h3>Phishing email triage pipeline</h3>
      <p class="project-desc">Automated pipeline that triages suspicious emails, extracts IOCs, and generates threat-intelligence reports. Cut phishing investigation time by 40% and enabled faster organization-wide threat mitigation.</p>
      <div class="tag-row">
        <span class="tag">Python</span><span class="tag">IOC</span><span class="tag">Threat Intel</span>
      </div>
      <a class="project-link" href="#contact">Ask me about it</a>
    </article>

    <article class="project-card">
      <div class="project-thumb">CRYPTO · AES-256</div>
      <h3>Password tooling trio</h3>
      <p class="project-desc">Python password cracker (educational), strength checker, and AES-256 password manager. Built during a 2023 cybersecurity internship — early hands-on work in cryptography, credential storage, and authentication policy.</p>
      <div class="tag-row">
        <span class="tag">Python</span><span class="tag">AES-256</span><span class="tag">Crypto</span>
      </div>
      <a class="project-link" href="#contact">Ask me about it</a>
    </article>

  </div>
</section>
```

- [ ] **Step 3: Verify in the browser**

Reload http://localhost:8000 and check:
- About section has the section label, "Detection meets automation." heading, paragraph with bolded role
- Projects section has 4 cards; PhishGuard Pro is the wide featured card (spans full width at desktop; flips to 2-column featured layout at 768px+; single-column at 320px)
- Hover on any card: lifts 2px, border turns cyan, soft glow
- Featured card has tags and a "Read case study →" link
- Other cards have "Ask me about it →" anchor links to #contact (link will be wired in Task 11)
- Tag pills look correct (mono font, cyan border, transparent fill)

- [ ] **Step 4: Commit**

```bash
git add assets/css/styles.css index.html
git commit -m "feat(home): about section + 4-project grid

Adds about prose section and projects grid: PhishGuard Pro
featured (wide), plus N8n/OpenVAS, phishing triage, and
password tooling cards.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 8: Home — Experience timeline

**Files:**
- Modify: `assets/css/styles.css`, `index.html`

- [ ] **Step 1: Append timeline styles to `styles.css`**

Append:

```css
/* --- Experience timeline --- */
.timeline { position: relative; padding-left: 24px; }
.timeline::before {
  content: "";
  position: absolute;
  left: 8px; top: 6px; bottom: 6px;
  width: 1px;
  background: linear-gradient(180deg, var(--primary) 0%, transparent 100%);
}
.timeline-item { position: relative; padding-bottom: 36px; }
.timeline-item:last-child { padding-bottom: 0; }
.timeline-item::before {
  content: "";
  position: absolute;
  left: -20px; top: 8px;
  width: 9px; height: 9px;
  border-radius: 50%;
  background: var(--primary);
  box-shadow: 0 0 8px var(--primary);
}
.timeline-item h3 { font-size: 20px; margin-bottom: 4px; }
.timeline-item .role-meta {
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--text-dim);
  margin-bottom: 12px;
  display: flex; flex-wrap: wrap; gap: 12px;
}
.timeline-item .role-meta .company { color: var(--accent); font-weight: 500; }
.timeline-item ul { margin-top: 8px; }
.timeline-item li {
  font-size: 14px;
  color: var(--text-muted);
  padding: 4px 0 4px 18px;
  position: relative;
  line-height: 1.55;
}
.timeline-item li::before {
  content: "▸";
  position: absolute;
  left: 0;
  color: var(--primary);
}
```

- [ ] **Step 2: Add experience section to `index.html`**

After the projects section, add:

```html
<section class="container" id="experience">
  <span class="section-label">section 03 — experience</span>
  <h2 style="margin-bottom:32px">Where I've worked.</h2>

  <div class="timeline">

    <div class="timeline-item">
      <h3>Security Operations Center Analyst</h3>
      <div class="role-meta">
        <span class="company">dayOneCyber</span>
        <span>Jun 2024 – Present</span>
        <span>Remote · U.S., Texas</span>
      </div>
      <ul>
        <li>Performed alert triage and incident analysis in Microsoft 365 Defender (XDR), improving MTTD by escalating critical incidents 30% faster than baseline.</li>
        <li>Led containment and remediation actions and post-incident documentation, reducing average incident resolution time by 25%.</li>
        <li>Built an N8n + OpenVAS workflow that runs monthly scans, generates reports, and alerts stakeholders — saving 15 hours of manual work per month.</li>
        <li>Created an automated phishing email triage pipeline (IOC extraction → threat-intel reporting) that cut phishing investigation time by 40%.</li>
        <li>Increased Microsoft Secure Score by 12 points over 6 months by tracking metrics and implementing recommended controls.</li>
        <li>Verified admin-rights restrictions across 80+ endpoints (CIS Controls / least-privilege) and resolved 1000+ cross-functional security tickets.</li>
      </ul>
    </div>

    <div class="timeline-item">
      <h3>Security Operations Center Intern</h3>
      <div class="role-meta">
        <span class="company">dayOneCyber</span>
        <span>Dec 2023 – Jun 2024</span>
        <span>Remote · U.S., Texas</span>
      </div>
      <ul>
        <li>Monitored security alerts in Microsoft 365 Defender (XDR) across endpoint, identity, and cloud workloads.</li>
        <li>Analyzed endpoint and identity-based threats with Defender for Endpoint and Defender for Identity; learned to distinguish false positives from real incidents.</li>
        <li>Assisted with evidence collection and impact analysis during incident response under senior analyst guidance.</li>
        <li>Conducted external vulnerability scans and learned risk-based prioritization.</li>
      </ul>
    </div>

    <div class="timeline-item">
      <h3>Cybersecurity Intern</h3>
      <div class="role-meta">
        <span class="company">LEARNSMASHER</span>
        <span>Apr 2023 – May 2023</span>
        <span>Remote</span>
      </div>
      <ul>
        <li>Built a Python password cracking tool to demonstrate weak-password risk.</li>
        <li>Built a password strength checker to evaluate authentication policy.</li>
        <li>Built a secure password manager with AES-256 encryption.</li>
        <li>Conducted multi-engine malware analysis exercises (Jotti's) to understand signature-based detection.</li>
      </ul>
    </div>

  </div>
</section>
```

- [ ] **Step 3: Verify in the browser**

Reload and check:
- Timeline section appears with section label and "Where I've worked." heading
- Vertical gradient line on the left, three glowing cyan dots
- Each entry shows role title, "company · dates · location" in mono, then bulleted wins with cyan ▸ arrows
- Bullet content matches resume verbatim (no fabricated wins)

- [ ] **Step 4: Commit**

```bash
git add assets/css/styles.css index.html
git commit -m "feat(home): experience timeline section

Vertical timeline with 3 roles: dayOneCyber SOC Analyst,
SOC Intern, and LEARNSMASHER intern. Bullets pulled verbatim
from resume.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 9: Home — Skills, Education & Certifications

**Files:**
- Modify: `assets/css/styles.css`, `index.html`

- [ ] **Step 1: Append styles**

Append:

```css
/* --- Skills --- */
.skills-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;
}
@media (min-width: 640px) { .skills-grid { grid-template-columns: repeat(2, 1fr); } }
@media (min-width: 1024px) { .skills-grid { grid-template-columns: repeat(4, 1fr); } }
.skill-group h4 {
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: var(--primary);
  margin-bottom: 14px;
}
.skill-group .tag-row { gap: 6px; }

/* --- Edu/Cert --- */
.edu-cert {
  display: grid;
  grid-template-columns: 1fr;
  gap: 32px;
}
@media (min-width: 768px) { .edu-cert { grid-template-columns: 1fr 1fr; gap: 48px; } }
.edu-cert h3 { margin-bottom: 16px; font-size: 20px; }
.edu-item, .cert-item {
  padding: 16px 0;
  border-bottom: 1px solid var(--border);
}
.edu-item:last-child, .cert-item:last-child { border-bottom: none; }
.edu-item h4, .cert-item h4 { font-size: 16px; margin-bottom: 4px; color: var(--text-primary); }
.edu-item .school, .cert-item .issuer {
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--accent);
  margin-bottom: 4px;
}
.edu-item .dates, .cert-item .summary {
  font-size: 13px;
  color: var(--text-muted);
  line-height: 1.5;
}
```

- [ ] **Step 2: Add the section markup**

After the experience section, add:

```html
<section class="container" id="skills">
  <span class="section-label">section 04 — skills</span>
  <h2 style="margin-bottom:32px">Toolkit.</h2>

  <div class="skills-grid">
    <div class="skill-group">
      <h4>Security Operations</h4>
      <div class="tag-row">
        <span class="tag">Threat Detection</span>
        <span class="tag">Incident Response</span>
        <span class="tag">Alert Triage</span>
        <span class="tag">Security Monitoring</span>
        <span class="tag">Vulnerability Mgmt</span>
      </div>
    </div>
    <div class="skill-group">
      <h4>Tools &amp; Tech</h4>
      <div class="tag-row">
        <span class="tag">M365 Defender (XDR)</span>
        <span class="tag">Defender for Endpoint</span>
        <span class="tag">Defender for Identity</span>
        <span class="tag">OpenVAS</span>
        <span class="tag">N8n</span>
        <span class="tag">SentinelOne</span>
        <span class="tag">Zscaler</span>
      </div>
    </div>
    <div class="skill-group">
      <h4>Technical</h4>
      <div class="tag-row">
        <span class="tag">Malware Analysis</span>
        <span class="tag">Network Security</span>
        <span class="tag">Windows / AD</span>
        <span class="tag">Security Automation</span>
        <span class="tag">IoT Security</span>
        <span class="tag">Python</span>
      </div>
    </div>
    <div class="skill-group">
      <h4>Frameworks</h4>
      <div class="tag-row">
        <span class="tag">CIS Controls</span>
        <span class="tag">MITRE ATT&amp;CK</span>
        <span class="tag">Least Privilege</span>
        <span class="tag">Risk Prioritization</span>
        <span class="tag">STIX 2.1</span>
      </div>
    </div>
  </div>
</section>

<section class="container" id="education">
  <span class="section-label">section 05 — education &amp; certifications</span>
  <h2 style="margin-bottom:32px">Learning.</h2>

  <div class="edu-cert">
    <div>
      <h3>Education</h3>
      <div class="edu-item">
        <h4>Master of Networking Technology — Cybersecurity</h4>
        <div class="school">Carleton University · Ottawa, Canada</div>
        <div class="dates">Sep 2025 – Present · Advanced study in network security, threat intelligence, and security architecture.</div>
      </div>
      <div class="edu-item">
        <h4>Bachelor of Computer Engineering</h4>
        <div class="school">Charutar Vidya Mandal University · Anand, India</div>
        <div class="dates">Jan 2020 – Jan 2024</div>
      </div>
      <div class="edu-item">
        <h4>Minor — Internet of Things (IoT)</h4>
        <div class="school">Charutar Vidya Mandal University · Anand, India</div>
        <div class="dates">Jan 2022 – Jan 2024</div>
      </div>
    </div>

    <div>
      <h3>Certifications &amp; training</h3>
      <div class="cert-item">
        <h4>CompTIA Security+</h4>
        <div class="issuer">CompTIA</div>
        <div class="summary">Foundational network security, risk management, cryptography, IAM, and security operations.</div>
      </div>
      <div class="cert-item">
        <h4>Cyber Security 101</h4>
        <div class="issuer">TryHackMe</div>
        <div class="summary">Hands-on offensive and defensive security pathway covering threat analysis and core security principles.</div>
      </div>
    </div>
  </div>
</section>
```

- [ ] **Step 3: Verify in the browser**

Reload and check:
- Skills section: 4 column groups at desktop, 2 at tablet, 1 at mobile
- Each group has a cyan mono header and tag pills
- Education/Certs section: 2-column block (single column on mobile)
- Items separated by thin borders
- Ember accent on school/issuer mono text

- [ ] **Step 4: Commit**

```bash
git add assets/css/styles.css index.html
git commit -m "feat(home): skills + education & certifications

4-column skills grid with pill tags, plus 2-column education
and certifications block (Carleton, CVM, CompTIA Security+,
TryHackMe).

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 10: Home — Writing teaser + Contact form (with TDD)

**Files:**
- Modify: `assets/css/styles.css`, `assets/js/main.js`, `tests/test-runner.html`, `index.html`

- [ ] **Step 1: Add failing tests for the mailto builder**

Open `tests/test-runner.html`. Find the `// === Theme module ===` block and immediately after the last theme test, add:

```js
    // === Contact form ===
    test('buildMailto generates correct base URL', () => {
      const url = PortfolioContact.buildMailto('me@example.com', 'Hello', 'World');
      assertTrue(url.startsWith('mailto:me@example.com'), `got ${url}`);
    });

    test('buildMailto URL-encodes subject and body', () => {
      const url = PortfolioContact.buildMailto('me@example.com', 'Hi there!', 'Line 1\nLine 2 & friends');
      assertTrue(url.includes('subject=Hi%20there!'), 'subject should be encoded');
      assertTrue(url.includes('Line%201%0ALine%202%20%26%20friends'), 'body should be encoded');
    });

    test('buildMailto includes sender name in body', () => {
      const url = PortfolioContact.buildMailto('me@example.com', 'Subject', 'Message', 'Jane Doe');
      assertTrue(url.includes('Jane%20Doe'), 'sender name should appear in encoded body');
    });

    test('validateContact rejects empty fields', () => {
      assertEq(PortfolioContact.validateContact({ name: '', email: 'a@b.com', message: 'hi' }).ok, false);
      assertEq(PortfolioContact.validateContact({ name: 'x', email: '', message: 'hi' }).ok, false);
      assertEq(PortfolioContact.validateContact({ name: 'x', email: 'a@b.com', message: '' }).ok, false);
    });

    test('validateContact accepts complete input', () => {
      assertEq(PortfolioContact.validateContact({ name: 'Jane', email: 'jane@example.com', message: 'Hi' }).ok, true);
    });

    test('validateContact rejects malformed email', () => {
      assertEq(PortfolioContact.validateContact({ name: 'x', email: 'not-an-email', message: 'hi' }).ok, false);
    });
```

(Make sure these new tests are placed BEFORE the final `summary.textContent = ...` line that prints the totals.)

- [ ] **Step 2: Verify the new tests FAIL**

Refresh `tests/test-runner.html`. Theme tests still PASS. The 6 new contact tests should FAIL with "PortfolioContact is not defined".

- [ ] **Step 3: Implement the contact module in `main.js`**

In `assets/js/main.js`, insert the following block AFTER the `PortfolioNav` module and BEFORE the final `document.addEventListener('DOMContentLoaded', ...)` block:

```js
/* ---- Contact form ---- */
const PortfolioContact = (() => {
  const EMAIL = 'shulankpatel88@gmail.com';
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function buildMailto(to, subject, message, fromName) {
    const body = fromName ? `${message}\n\n— ${fromName}` : message;
    const params = new URLSearchParams({ subject, body });
    return `mailto:${to}?${params.toString().replace(/\+/g, '%20')}`;
  }

  function validateContact({ name, email, message }) {
    const errors = {};
    if (!name || !name.trim()) errors.name = 'Required';
    if (!email || !email.trim()) errors.email = 'Required';
    else if (!EMAIL_RE.test(email)) errors.email = 'Invalid email';
    if (!message || !message.trim()) errors.message = 'Required';
    return { ok: Object.keys(errors).length === 0, errors };
  }

  function handleSubmit(form) {
    return (e) => {
      e.preventDefault();
      const data = {
        name: form.elements.name.value,
        email: form.elements.email.value,
        message: form.elements.message.value,
      };
      const errorBox = form.querySelector('[data-error]');
      const result = validateContact(data);
      if (!result.ok) {
        const first = Object.keys(result.errors)[0];
        errorBox.textContent = `${first}: ${result.errors[first]}`;
        errorBox.hidden = false;
        return;
      }
      errorBox.hidden = true;
      const subject = `Portfolio contact — ${data.name}`;
      const url = buildMailto(EMAIL, subject, data.message, data.name);
      window.location.href = url;
    };
  }

  function init() {
    const form = document.querySelector('[data-contact-form]');
    if (!form) return;
    form.addEventListener('submit', handleSubmit(form));
  }

  return { buildMailto, validateContact, init };
})();
```

Update the final init block to call `PortfolioContact.init()`:

```js
document.addEventListener('DOMContentLoaded', () => {
  PortfolioTheme.init();
  PortfolioNav.init();
  PortfolioContact.init();
});
```

- [ ] **Step 4: Re-run the tests and verify all PASS**

Refresh `tests/test-runner.html`. Expected: 11 tests pass (5 theme + 6 contact), 0 fail.

- [ ] **Step 5: Append writing-teaser and contact-form styles to `styles.css`**

Append:

```css
/* --- Writing teaser --- */
.writing-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
}
@media (min-width: 768px) { .writing-grid { grid-template-columns: repeat(3, 1fr); } }
.post-card {
  padding: 20px;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  transition: transform 0.2s var(--ease), border-color 0.2s var(--ease);
  display: flex;
  flex-direction: column;
}
.post-card:hover { transform: translateY(-2px); border-color: var(--primary); }
.post-card .post-meta {
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 1px;
  color: var(--text-dim);
  text-transform: uppercase;
  margin-bottom: 8px;
}
.post-card h4 { font-size: 17px; margin-bottom: 8px; color: var(--text-primary); }
.post-card p { font-size: 13px; color: var(--text-muted); flex: 1; }
.post-card a { color: var(--primary); font-family: var(--font-mono); font-size: 12px; margin-top: 14px; }

/* --- Contact --- */
.contact-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 32px;
}
@media (min-width: 768px) { .contact-grid { grid-template-columns: 1.2fr 1fr; gap: 48px; } }

.contact-form { display: flex; flex-direction: column; gap: 14px; }
.contact-form label {
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: var(--text-dim);
}
.contact-form input,
.contact-form textarea {
  background: var(--bg-surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  padding: 12px 14px;
  font-size: 15px;
  color: var(--text-primary);
  transition: border-color 0.2s var(--ease);
  width: 100%;
}
.contact-form input:focus,
.contact-form textarea:focus {
  border-color: var(--primary);
  outline: none;
}
.contact-form textarea { min-height: 140px; resize: vertical; font-family: var(--font-ui); }
.contact-error {
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--accent);
}
.contact-direct h3 { font-size: 18px; margin-bottom: 16px; }
.contact-direct ul li {
  padding: 10px 0;
  border-bottom: 1px solid var(--border);
  display: flex;
  gap: 12px;
  align-items: center;
  font-size: 14px;
}
.contact-direct ul li:last-child { border-bottom: none; }
.contact-direct .icon {
  width: 32px; height: 32px;
  border-radius: var(--radius-sm);
  background: color-mix(in srgb, var(--primary) 10%, transparent);
  display: flex; align-items: center; justify-content: center;
  color: var(--primary);
  flex-shrink: 0;
}
```

- [ ] **Step 6: Add writing-teaser and contact sections to `index.html`**

After the education section, add:

```html
<section class="container" id="writing">
  <span class="section-label">section 06 — writing</span>
  <h2 style="margin-bottom:8px">Notes from the SOC.</h2>
  <p style="margin-bottom:32px;color:var(--text-muted)">Long-form notes on detection, automation, and modern phishing threats.</p>

  <div class="writing-grid">
    <article class="post-card">
      <div class="post-meta">Case Study · 12 min read</div>
      <h4>Building PhishGuard Pro</h4>
      <p>The motivation, module architecture, and modern-threat detection design behind a 25-module phishing analysis pipeline.</p>
      <a href="blog/building-phishguard-pro.html">Read →</a>
    </article>
    <article class="post-card">
      <div class="post-meta">Technical · 8 min read</div>
      <h4>Detecting Browser-in-the-Browser attacks</h4>
      <p>How BitB and AiTM kits weaponize fake login windows — and the heuristics PhishGuard Pro uses to catch them.</p>
      <a href="blog/detecting-bitb-attacks.html">Read →</a>
    </article>
    <article class="post-card">
      <div class="post-meta">Coming soon</div>
      <h4>More posts in progress</h4>
      <p>Working on write-ups about MITRE mapping, STIX integration, and lessons from running a SOC with automation as the default.</p>
      <a href="blog/">See all writing →</a>
    </article>
  </div>
</section>

<section class="container" id="contact">
  <span class="section-label">section 07 — contact</span>
  <h2 style="margin-bottom:8px">Get in touch.</h2>
  <p style="margin-bottom:32px;color:var(--text-muted)">Open to SOC Analyst, Detection Engineer, and Security Automation roles. The form opens your mail client — or skip it and reach me directly below.</p>

  <div class="contact-grid">
    <form class="contact-form" data-contact-form novalidate>
      <div>
        <label for="contact-name">Name</label>
        <input id="contact-name" name="name" type="text" required autocomplete="name">
      </div>
      <div>
        <label for="contact-email">Email</label>
        <input id="contact-email" name="email" type="email" required autocomplete="email">
      </div>
      <div>
        <label for="contact-message">Message</label>
        <textarea id="contact-message" name="message" required></textarea>
      </div>
      <p class="contact-error" data-error hidden></p>
      <button type="submit" class="btn btn-primary">Send via email →</button>
    </form>

    <div class="contact-direct">
      <h3>Direct lines</h3>
      <ul>
        <li>
          <div class="icon" aria-hidden="true">@</div>
          <a href="mailto:shulankpatel88@gmail.com">shulankpatel88@gmail.com</a>
        </li>
        <li>
          <div class="icon" aria-hidden="true">in</div>
          <a href="https://www.linkedin.com/in/shulank-patel-772710204" target="_blank" rel="noopener">linkedin.com/in/shulank-patel</a>
        </li>
        <li>
          <div class="icon" aria-hidden="true">☎</div>
          <a href="tel:+13435526679">+1 (343) 552-6679</a>
        </li>
      </ul>
    </div>
  </div>
</section>
```

- [ ] **Step 7: Verify in the browser**

Reload http://localhost:8000 and check:
- Writing section: 3 post cards in a row at desktop, stacked on mobile; first two link to blog posts (which are still placeholders — that's fine for now)
- Contact section: form on the left, direct contact list on the right
- Submit the form empty → red mono error appears below
- Submit with valid input → your mail client opens with `mailto:shulankpatel88@gmail.com?subject=Portfolio%20contact%20—%20{name}&body=...`
- All three direct-line links work (mailto, LinkedIn opens new tab, tel)

- [ ] **Step 8: Commit**

```bash
git add assets/css/styles.css assets/js/main.js tests/test-runner.html index.html
git commit -m "feat(home): writing teaser + contact form with mailto handler

PortfolioContact module: buildMailto, validateContact, handleSubmit.
Validates name/email/message, opens mail client with pre-filled
subject and body. Covered by 6 inline browser tests.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 11: PhishGuard Pro case study page

**Files:**
- Modify: `phishguard.html`, `assets/css/styles.css`

- [ ] **Step 1: Append case-study styles to `styles.css`**

Append:

```css
/* ============ 6. CASE STUDY ============ */
.case-header {
  padding: 64px 0 32px;
}
.case-back {
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--text-muted);
  margin-bottom: 24px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}
.case-back:hover { color: var(--primary); }
.case-tagline { font-size: clamp(18px, 2vw, 22px); color: var(--text-muted); margin-bottom: 20px; max-width: 720px; }

.pipeline {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-top: 24px;
}
@media (min-width: 768px) { .pipeline { grid-template-columns: repeat(3, 1fr); } }
@media (min-width: 1024px) { .pipeline { grid-template-columns: repeat(6, 1fr); } }
.phase {
  padding: 16px 14px;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-left: 2px solid var(--primary);
  border-radius: var(--radius-sm);
  position: relative;
}
.phase .phase-num {
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 1.5px;
  color: var(--primary);
  text-transform: uppercase;
  margin-bottom: 6px;
}
.phase h4 { font-size: 14px; margin-bottom: 6px; }
.phase ul {
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--text-dim);
}
.phase li { padding: 2px 0; }

.module-card {
  padding: 20px;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
}
.module-card .module-name {
  font-family: var(--font-mono);
  font-size: 13px;
  color: var(--primary);
  margin-bottom: 8px;
  font-weight: 500;
}
.module-card h4 { font-size: 17px; margin-bottom: 8px; }
.module-card p { font-size: 14px; color: var(--text-muted); line-height: 1.55; }

.module-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 14px;
}
@media (min-width: 768px) { .module-grid { grid-template-columns: repeat(2, 1fr); } }

.prose p { margin-bottom: 16px; font-size: 16px; line-height: 1.7; color: var(--text-muted); max-width: 760px; }
.prose p strong { color: var(--text-primary); }

.lessons {
  list-style: none;
  padding: 0;
  display: grid;
  gap: 12px;
}
.lessons li {
  padding: 14px 18px;
  background: var(--bg-card);
  border-left: 2px solid var(--accent);
  border-radius: var(--radius-sm);
  font-size: 14px;
  color: var(--text-muted);
  line-height: 1.55;
}
.lessons li strong { color: var(--text-primary); }
```

- [ ] **Step 2: Write the full case study page**

Replace `phishguard.html` with:

```html
<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>PhishGuard Pro — Case Study · Shulank Patel</title>
  <meta name="description" content="Behind the scenes of PhishGuard Pro: 25-module phishing analysis with MITRE ATT&CK mapping and STIX 2.1 export.">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="assets/css/styles.css">
  <script src="assets/js/main.js" defer></script>
</head>
<body>
  <a class="skip-link" href="#main">Skip to content</a>

  <nav class="nav" aria-label="Primary">
    <a href="/" class="nav-logo">
      <svg width="22" height="22" viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <path d="M16 2 L28 7 V16 C28 22 22 28 16 30 C10 28 4 22 4 16 V7 Z" stroke="currentColor" stroke-width="2" fill="rgba(34,211,238,0.08)"/>
        <circle cx="16" cy="15" r="3" fill="currentColor"/>
        <path d="M16 18 V23" stroke="currentColor" stroke-width="2"/>
      </svg>
      <span>SHULANK<span class="dot">.</span>PATEL</span>
    </a>
    <ul class="nav-links">
      <li><a href="/#projects">Projects</a></li>
      <li><a href="/#experience">Experience</a></li>
      <li><a href="/blog/">Writing</a></li>
      <li><a href="/#contact">Contact</a></li>
    </ul>
    <div class="nav-cta">
      <button class="theme-toggle" data-theme-toggle aria-label="Toggle theme">☾</button>
      <a class="btn btn-primary" href="assets/resume/Shulank_Patel_Resume.pdf" download>Resume ↓</a>
      <button class="nav-toggle" data-nav-toggle aria-label="Open menu" aria-expanded="false">☰</button>
    </div>
  </nav>

  <div class="mobile-drawer" data-mobile-drawer>
    <a href="/#projects">Projects</a>
    <a href="/#experience">Experience</a>
    <a href="/blog/">Writing</a>
    <a href="/#contact">Contact</a>
  </div>

  <main id="main">

    <section class="container case-header">
      <a class="case-back" href="/">← Back to portfolio</a>
      <span class="section-label">case study · 2026</span>
      <h1 style="margin-bottom:16px">PhishGuard Pro.</h1>
      <p class="case-tagline">Automated phishing email analysis with 25 modules, MITRE ATT&amp;CK mapping for 31 techniques, and STIX 2.1 export for SIEM/SOAR integration.</p>
      <div class="tag-row">
        <span class="tag">Python 3.9</span>
        <span class="tag">Flask</span>
        <span class="tag">SQLite</span>
        <span class="tag">Anthropic Claude</span>
        <span class="tag">MITRE ATT&amp;CK</span>
        <span class="tag">STIX 2.1</span>
        <span class="tag">VirusTotal API</span>
      </div>

      <div class="stats" style="margin-top:32px">
        <div class="stat"><div class="stat-label">Modules</div><div class="stat-value">25</div><div class="stat-desc">Across 6 phases</div></div>
        <div class="stat accent"><div class="stat-label">Phases</div><div class="stat-value">6</div><div class="stat-desc">Core → Intelligence</div></div>
        <div class="stat"><div class="stat-label">MITRE</div><div class="stat-value">31</div><div class="stat-desc">ATT&amp;CK techniques</div></div>
        <div class="stat accent"><div class="stat-label">Export</div><div class="stat-value">STIX 2.1</div><div class="stat-desc">SIEM / SOAR ready</div></div>
      </div>
    </section>

    <section class="container prose">
      <span class="section-label">the problem</span>
      <h2 style="margin-bottom:16px">Phishing triage is expensive.</h2>
      <p>In a SOC, suspicious-email tickets are one of the most common — and one of the most under-tooled — workflows. Analysts paste headers into a notepad, walk through URL extraction by hand, pivot through WHOIS lookups, scan attachments through one engine after another, and only then start writing up findings.</p>
      <p>At dayOneCyber, I built an internal triage pipeline that cut investigation time by <strong>40%</strong>. But it was bespoke to our environment. PhishGuard Pro is the open, more rigorous version: <strong>25 specialized analyzers</strong> that run in parallel, modern-threat detection built in (BitB, AiTM, OAuth consent phishing, phishing-kit fingerprinting), and a SIEM/SOAR-ready export so the analyst's work doesn't end at "yes it's phishing."</p>
    </section>

    <section class="container prose">
      <span class="section-label">the approach</span>
      <h2 style="margin-bottom:16px">Six phases, one report.</h2>
      <p>Every email runs through six pipeline phases. Each phase is independent — modules add findings to a shared report, the pipeline never blocks waiting for an external API, and any phase can be disabled at runtime.</p>

      <div class="pipeline" role="list">
        <div class="phase">
          <div class="phase-num">Phase 01</div>
          <h4>Core</h4>
          <ul><li>header</li><li>url</li><li>attachment</li><li>sender</li><li>content</li></ul>
        </div>
        <div class="phase">
          <div class="phase-num">Phase 02</div>
          <h4>Enrichment</h4>
          <ul><li>whois</li><li>ip</li><li>qr</li><li>pdf</li></ul>
        </div>
        <div class="phase">
          <div class="phase-num">Phase 03</div>
          <h4>Modern Threats</h4>
          <ul><li>redirect</li><li>oauth</li><li>bitb</li><li>dns_ssl</li><li>campaign</li><li>language</li></ul>
        </div>
        <div class="phase">
          <div class="phase-num">Phase 04</div>
          <h4>MITRE + IOC</h4>
          <ul><li>mitre_mapper</li><li>ioc_extractor</li></ul>
        </div>
        <div class="phase">
          <div class="phase-num">Phase 05</div>
          <h4>External APIs</h4>
          <ul><li>virustotal</li><li>urlscan</li><li>ai_analyzer</li></ul>
        </div>
        <div class="phase">
          <div class="phase-num">Phase 06</div>
          <h4>Intelligence</h4>
          <ul><li>sandbox</li><li>community_db</li><li>threat_actor</li></ul>
        </div>
      </div>
    </section>

    <section class="container">
      <span class="section-label">highlighted modules</span>
      <h2 style="margin-bottom:32px">Five that matter most.</h2>

      <div class="module-grid">
        <div class="module-card">
          <div class="module-name">bitb_analyzer.py</div>
          <h4>Browser-in-the-Browser &amp; AiTM detection</h4>
          <p>BitB kits render fake login windows inside the page DOM to harvest credentials. AiTM proxies (Tycoon 2FA, Evilginx2) sit between the user and the real site to steal session tokens. This module looks for the structural and behavioural fingerprints of both.</p>
        </div>
        <div class="module-card">
          <div class="module-name">campaign_analyzer.py</div>
          <h4>Phishing-kit fingerprinting</h4>
          <p>Identifies known kits (Tycoon 2FA, Evilginx2, W3LL) via template simhashing and asset signatures. Classifies the campaign theme, so an analyst sees "this is a 2024 Microsoft 365 credential-harvesting kit" instead of "suspicious page."</p>
        </div>
        <div class="module-card">
          <div class="module-name">ai_analyzer.py</div>
          <h4>Cross-signal LLM analysis</h4>
          <p>Anthropic Claude reads the whole report — header anomalies, URL patterns, content red flags — and produces a cross-signal narrative. Also flags AI-generated content (low perplexity, generic phrasing), now a major phishing tell.</p>
        </div>
        <div class="module-card">
          <div class="module-name">mitre_mapper.py</div>
          <h4>31 ATT&amp;CK technique mappings</h4>
          <p>Maps findings to specific ATT&amp;CK techniques — T1566.001 spearphishing attachment, T1528 OAuth consent abuse, T1557 AiTM, T1656 impersonation, T1598.004 spearphishing voice. SOC reports inherit ATT&amp;CK references for free.</p>
        </div>
        <div class="module-card">
          <div class="module-name">ioc_extractor.py</div>
          <h4>STIX 2.1 export</h4>
          <p>All extracted IOCs (URLs, IPs, domains, hashes, emails) bundle into a STIX 2.1 document. Drop it into a SIEM, SOAR, or threat-intel platform and you've turned a single email triage into reusable detection content.</p>
        </div>
      </div>
    </section>

    <section class="container prose">
      <span class="section-label">architecture</span>
      <h2 style="margin-bottom:16px">Stack.</h2>
      <p><strong>Flask</strong> serves the analyzer UI and orchestrates the pipeline. <strong>SQLite</strong> stores accounts and per-analysis history. The 25 analyzers live under <code>analyzers/</code>; each is a standalone module with a uniform <code>analyze(email)</code> interface so a new analyzer can be added by dropping in a file.</p>
      <p>External API calls (<strong>VirusTotal</strong>, <strong>urlscan.io</strong>, <strong>Anthropic Claude</strong>) are all <strong>optional</strong> — the pipeline gracefully skips a phase if an API key isn't configured. Auth uses Flask sessions with <code>pbkdf2:sha256</code> password hashing (a workaround for Python 3.9 + LibreSSL where <code>hashlib.scrypt</code> isn't available).</p>
    </section>

    <section class="container prose">
      <span class="section-label">lessons learned</span>
      <h2 style="margin-bottom:24px">What this project taught me.</h2>
      <ul class="lessons">
        <li><strong>Threading hides errors.</strong> The first version of <code>ai_analyzer</code> ran Claude calls in a thread and silently swallowed timeouts. Replacing the thread with a direct SDK call and explicit handlers for <code>AuthenticationError</code>, <code>RateLimitError</code>, <code>APITimeoutError</code>, and <code>APIConnectionError</code> made failures visible and actionable.</li>
        <li><strong>Design exports for the next system.</strong> Phishing triage doesn't end at "yes this is phishing." STIX 2.1 export turned single-email work into reusable SIEM/SOAR content — the highest-leverage feature I added.</li>
        <li><strong>Modern threats need their own modules.</strong> Generic content-rule engines miss BitB, AiTM, and OAuth consent attacks. Splitting them into <code>bitb_analyzer</code>, <code>oauth_analyzer</code>, etc. kept the logic legible and lets each detector evolve independently.</li>
        <li><strong>Cross-signal beats single-signal.</strong> No one indicator catches modern phishing reliably. The LLM-driven cross-signal layer (<code>ai_analyzer</code>) is what makes the system call something phishing with confidence — and explains <em>why</em> in plain English for the report.</li>
      </ul>
    </section>

    <section class="container" style="padding-top:32px;padding-bottom:96px">
      <div style="background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius-lg);padding:32px;text-align:center">
        <h3 style="margin-bottom:8px">Interested in the SOC work behind this?</h3>
        <p style="margin-bottom:20px">Detection engineering, automation, modern phishing defense — happy to talk.</p>
        <a class="btn btn-primary btn-lg" href="/#contact">Get in touch →</a>
      </div>
    </section>

  </main>

  <footer class="footer">
    <div class="footer-row">
      <div>© 2026 Shulank Patel. Built with vanilla HTML/CSS/JS.</div>
      <div class="mono">tactical_midnight v1</div>
    </div>
  </footer>
</body>
</html>
```

- [ ] **Step 3: Verify in the browser**

Open http://localhost:8000/phishguard.html and check:
- "← Back to portfolio" link returns to home
- Title, tagline, tech tags render
- 4 at-a-glance stats below
- "The Problem" prose reads coherently
- 6-phase pipeline renders as a grid of phases with module lists in mono
- 5 highlighted module cards (bitb, campaign, ai, mitre, ioc)
- Architecture prose reads correctly
- 4 lessons learned with ember-orange left borders
- Footer CTA card with "Get in touch →" link
- Theme toggle works on this page too
- No console errors

- [ ] **Step 4: Commit**

```bash
git add phishguard.html assets/css/styles.css
git commit -m "feat: PhishGuard Pro case study page

Deep-dive page with at-a-glance stats, problem statement,
6-phase pipeline diagram, 5 highlighted module cards,
architecture summary, lessons learned, and footer CTA.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 12: Blog index + two sample posts

**Files:**
- Modify: `blog/index.html`, `blog/building-phishguard-pro.html`, `blog/detecting-bitb-attacks.html`, `assets/css/styles.css`

- [ ] **Step 1: Append blog styles to `styles.css`**

Append:

```css
/* ============ 7. BLOG ============ */
.blog-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
  margin-top: 32px;
}
@media (min-width: 768px) { .blog-grid { grid-template-columns: repeat(2, 1fr); } }

.blog-card {
  padding: 24px;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  transition: transform 0.2s var(--ease), border-color 0.2s var(--ease);
}
.blog-card:hover { transform: translateY(-2px); border-color: var(--primary); }
.blog-card h3 { font-size: 22px; margin-bottom: 8px; }
.blog-card .post-meta { margin-bottom: 12px; }
.blog-card p { color: var(--text-muted); font-size: 15px; line-height: 1.55; margin-bottom: 14px; }

.post {
  max-width: 720px;
  margin: 0 auto;
  padding: 64px 24px;
}
.post .post-hero {
  margin-bottom: 48px;
  padding-bottom: 32px;
  border-bottom: 1px solid var(--border);
}
.post h1 { font-size: clamp(36px, 5vw, 56px); margin-bottom: 16px; }
.post .post-meta { font-family: var(--font-mono); font-size: 12px; color: var(--text-dim); }
.post-body p, .post-body ul, .post-body ol, .post-body pre {
  margin-bottom: 20px;
  font-size: 17px;
  line-height: 1.75;
  color: var(--text-muted);
}
.post-body h2 { font-size: 28px; margin: 40px 0 16px; color: var(--text-primary); }
.post-body h3 { font-size: 20px; margin: 28px 0 12px; color: var(--text-primary); }
.post-body strong { color: var(--text-primary); }
.post-body code {
  background: var(--bg-card);
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.92em;
  border: 1px solid var(--border);
}
.post-body pre {
  background: var(--bg-card);
  padding: 16px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--border);
  overflow-x: auto;
  font-size: 13px;
  line-height: 1.55;
}
.post-body pre code { background: none; padding: 0; border: none; }
.post-body ul li, .post-body ol li {
  padding-left: 24px;
  position: relative;
  margin-bottom: 8px;
}
.post-body ul li::before { content: "▸"; position: absolute; left: 0; color: var(--primary); }
.post-body ol { counter-reset: ol; }
.post-body ol li { counter-increment: ol; }
.post-body ol li::before { content: counter(ol) "."; position: absolute; left: 0; color: var(--primary); font-family: var(--font-mono); font-weight: 500; }
```

- [ ] **Step 2: Write the blog index page**

Replace `blog/index.html` with:

```html
<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Writing — Shulank Patel</title>
  <meta name="description" content="Long-form notes on detection, automation, and modern phishing threats.">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="../assets/css/styles.css">
  <script src="../assets/js/main.js" defer></script>
</head>
<body>
  <a class="skip-link" href="#main">Skip to content</a>

  <nav class="nav" aria-label="Primary">
    <a href="/" class="nav-logo">
      <svg width="22" height="22" viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <path d="M16 2 L28 7 V16 C28 22 22 28 16 30 C10 28 4 22 4 16 V7 Z" stroke="currentColor" stroke-width="2" fill="rgba(34,211,238,0.08)"/>
        <circle cx="16" cy="15" r="3" fill="currentColor"/>
        <path d="M16 18 V23" stroke="currentColor" stroke-width="2"/>
      </svg>
      <span>SHULANK<span class="dot">.</span>PATEL</span>
    </a>
    <ul class="nav-links">
      <li><a href="/#projects">Projects</a></li>
      <li><a href="/#experience">Experience</a></li>
      <li><a href="/blog/" aria-current="page">Writing</a></li>
      <li><a href="/#contact">Contact</a></li>
    </ul>
    <div class="nav-cta">
      <button class="theme-toggle" data-theme-toggle aria-label="Toggle theme">☾</button>
      <a class="btn btn-primary" href="../assets/resume/Shulank_Patel_Resume.pdf" download>Resume ↓</a>
      <button class="nav-toggle" data-nav-toggle aria-label="Open menu" aria-expanded="false">☰</button>
    </div>
  </nav>

  <div class="mobile-drawer" data-mobile-drawer>
    <a href="/#projects">Projects</a>
    <a href="/#experience">Experience</a>
    <a href="/blog/">Writing</a>
    <a href="/#contact">Contact</a>
  </div>

  <main id="main" class="container" style="padding-top:64px;padding-bottom:96px">
    <span class="section-label">notes from the soc</span>
    <h1 style="margin-bottom:16px">Writing.</h1>
    <p class="subtitle" style="max-width:640px">Long-form notes on detection engineering, security automation, and modern phishing threats. New posts land here as I write them.</p>

    <div class="blog-grid">
      <article class="blog-card">
        <div class="post-meta">Case Study · 12 min read · 2026-05</div>
        <h3>Building PhishGuard Pro</h3>
        <p>The motivation, module architecture, and modern-threat detection design behind a 25-module phishing analysis pipeline.</p>
        <a href="building-phishguard-pro.html" class="project-link">Read</a>
      </article>

      <article class="blog-card">
        <div class="post-meta">Technical · 8 min read · 2026-05</div>
        <h3>Detecting Browser-in-the-Browser attacks</h3>
        <p>How BitB and AiTM kits weaponize fake login windows — and the heuristics PhishGuard Pro uses to catch them.</p>
        <a href="detecting-bitb-attacks.html" class="project-link">Read</a>
      </article>
    </div>

    <p style="margin-top:48px;color:var(--text-dim);font-family:var(--font-mono);font-size:13px">
      $ ls -la /writing/ <span style="color:var(--primary)">→ 2 posts</span> · more coming soon.
    </p>
  </main>

  <footer class="footer">
    <div class="footer-row">
      <div>© 2026 Shulank Patel. Built with vanilla HTML/CSS/JS.</div>
      <div class="mono">tactical_midnight v1</div>
    </div>
  </footer>
</body>
</html>
```

- [ ] **Step 3: Write the first blog post**

Replace `blog/building-phishguard-pro.html` with:

```html
<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Building PhishGuard Pro — Shulank Patel</title>
  <meta name="description" content="Behind the scenes of PhishGuard Pro: a 25-module phishing analysis pipeline with MITRE mapping and STIX 2.1 export.">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="../assets/css/styles.css">
  <script src="../assets/js/main.js" defer></script>
</head>
<body>
  <a class="skip-link" href="#main">Skip to content</a>

  <nav class="nav" aria-label="Primary">
    <a href="/" class="nav-logo">
      <svg width="22" height="22" viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <path d="M16 2 L28 7 V16 C28 22 22 28 16 30 C10 28 4 22 4 16 V7 Z" stroke="currentColor" stroke-width="2" fill="rgba(34,211,238,0.08)"/>
        <circle cx="16" cy="15" r="3" fill="currentColor"/>
        <path d="M16 18 V23" stroke="currentColor" stroke-width="2"/>
      </svg>
      <span>SHULANK<span class="dot">.</span>PATEL</span>
    </a>
    <ul class="nav-links">
      <li><a href="/#projects">Projects</a></li>
      <li><a href="/#experience">Experience</a></li>
      <li><a href="/blog/" aria-current="page">Writing</a></li>
      <li><a href="/#contact">Contact</a></li>
    </ul>
    <div class="nav-cta">
      <button class="theme-toggle" data-theme-toggle aria-label="Toggle theme">☾</button>
      <a class="btn btn-primary" href="../assets/resume/Shulank_Patel_Resume.pdf" download>Resume ↓</a>
      <button class="nav-toggle" data-nav-toggle aria-label="Open menu" aria-expanded="false">☰</button>
    </div>
  </nav>

  <div class="mobile-drawer" data-mobile-drawer>
    <a href="/#projects">Projects</a>
    <a href="/#experience">Experience</a>
    <a href="/blog/">Writing</a>
    <a href="/#contact">Contact</a>
  </div>

  <main id="main">
    <article class="post">
      <header class="post-hero">
        <a class="case-back" href="./">← All writing</a>
        <h1>Building PhishGuard Pro</h1>
        <div class="post-meta">Case Study · 12 min read · May 2026</div>
      </header>

      <div class="post-body">
        <p>SOC tickets for "is this email phishing?" come in by the dozen. The work itself is repetitive — extract URLs, walk WHOIS, check reputation, scan the attachment, write up findings — but every triage is just different enough that automation feels hard. I wanted to find out how far I could push it.</p>

        <h2>The motivation</h2>
        <p>At dayOneCyber, I built an internal triage pipeline that cut phishing investigation time by <strong>40%</strong>. That pipeline was bespoke to our tooling, our M365 environment, and our SOC's reporting format. I wanted a more rigorous, open version that anyone running a SOC could pick up — and a place to push back on the limits of what "automated phishing analysis" usually means.</p>
        <p>Most open tools stop at the obvious indicators: links, attachments, WHOIS, basic SPF/DKIM/DMARC. PhishGuard Pro adds the modern-threat layer that most tooling still misses: <strong>Browser-in-the-Browser</strong>, <strong>AiTM proxies</strong> (Tycoon 2FA, Evilginx2), <strong>OAuth consent phishing</strong>, <strong>phishing-kit fingerprinting</strong>, and <strong>AI-generated content detection</strong>.</p>

        <h2>Six phases, one report</h2>
        <p>Every email runs through six pipeline phases. Modules within each phase are independent — they each append findings to a shared report object and never block each other.</p>
        <ol>
          <li><strong>Core</strong> — header parsing, URL extraction, attachment scan, sender reputation, content rules.</li>
          <li><strong>Enrichment</strong> — WHOIS, IP geolocation, QR-code decoding, PDF text + link extraction.</li>
          <li><strong>Modern Threats</strong> — redirect chain resolution, OAuth scope analysis, BitB and AiTM heuristics, DNS/SSL inspection, phishing-kit fingerprinting, language/locale mismatch.</li>
          <li><strong>MITRE + IOC</strong> — mapping findings to ATT&amp;CK techniques and bundling IOCs.</li>
          <li><strong>External APIs</strong> (optional) — VirusTotal, urlscan.io, Anthropic Claude for cross-signal analysis.</li>
          <li><strong>Intelligence</strong> — sandbox detonation hooks, community DB lookups, threat-actor attribution.</li>
        </ol>

        <h2>Why modern-threat modules deserve their own files</h2>
        <p>Generic content-rule engines miss the threats that actually matter in 2026. <code>bitb_analyzer.py</code> looks for the specific DOM and CSS fingerprints that BitB kits use to render fake login windows inside the page itself. <code>campaign_analyzer.py</code> simhashes the template against known phishing kit templates (Tycoon 2FA, Evilginx2, W3LL) so an analyst sees <em>which</em> kit they're up against, not just "suspicious page." <code>oauth_analyzer.py</code> reads the consent URL's requested scopes and flags anything beyond what's necessary — the high-leverage signal in OAuth consent abuse (<code>T1528</code>).</p>
        <p>Splitting these into named modules instead of bolting them onto <code>content_analyzer.py</code> keeps the logic legible and lets each detector evolve independently as the threat landscape shifts.</p>

        <h2>The LLM is a synthesizer, not the detector</h2>
        <p>The first version put Claude in front of every email and asked "is this phishing?" That works, but it's a single-signal model and you're paying per email. The better design — and the one I shipped — feeds the LLM the <strong>existing report</strong> after the deterministic modules have run, and asks it for a cross-signal narrative: which findings point in the same direction, which look contradictory, and what the most likely classification is.</p>
        <p>That role swap turned <code>ai_analyzer.py</code> from "the detector" into "the analyst who explains the report." Cost dropped, accuracy went up, and the output is something an SOC writer can drop directly into a ticket.</p>

        <h2>What the threading bug taught me</h2>
        <p>The first version of <code>ai_analyzer</code> ran Claude calls in a <code>threading.Thread</code> with a queue for results. It was silently swallowing timeouts — the report would come back without the AI analysis section and no error in the logs. I replaced the thread with a direct SDK call and explicit handlers for each Anthropic exception type:</p>
        <pre><code>from anthropic import (
    Anthropic, AuthenticationError, RateLimitError,
    APITimeoutError, APIConnectionError,
)

client = Anthropic(api_key=key, timeout=60.0)
try:
    resp = client.messages.create(...)
except AuthenticationError:
    return {"error": "invalid_api_key"}
except RateLimitError:
    return {"error": "rate_limited"}
except APITimeoutError:
    return {"error": "timeout"}
except APIConnectionError:
    return {"error": "connection"}</code></pre>
        <p>The lesson stuck: when you wrap something in a thread, you opt out of the framework's default error visibility. If you don't replace it with something explicit, you've built a silent-failure machine.</p>

        <h2>STIX export was the highest-leverage feature</h2>
        <p>The most useful thing PhishGuard Pro does isn't the analysis itself — it's making the analysis <strong>reusable downstream</strong>. The <code>ioc_extractor</code> bundles every IOC (URLs, IPs, domains, hashes, sender emails) into a STIX 2.1 document. Drop it into a SIEM, a SOAR playbook, or a threat-intel platform, and you've turned a single email triage into permanent detection content.</p>
        <p>One email becomes one investigation. With STIX export, one email becomes a set of detections that catch the next twenty.</p>

        <h2>What's next</h2>
        <p>I want to ship a streaming mode where modules emit findings to the UI as they finish, instead of waiting for the full report. I also want to formalize the analyzer interface as a proper plugin protocol so third parties can drop in their own modules. And I'm exploring whether the cross-signal layer can replay against historical reports to surface campaigns that span multiple emails — closer to a real campaign-tracking tool.</p>

        <p style="margin-top:48px"><a href="./" class="project-link">All writing</a></p>
      </div>
    </article>
  </main>

  <footer class="footer">
    <div class="footer-row">
      <div>© 2026 Shulank Patel. Built with vanilla HTML/CSS/JS.</div>
      <div class="mono">tactical_midnight v1</div>
    </div>
  </footer>
</body>
</html>
```

- [ ] **Step 4: Write the second blog post**

Replace `blog/detecting-bitb-attacks.html` with the same head/nav/footer structure and this body:

```html
<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Detecting Browser-in-the-Browser attacks — Shulank Patel</title>
  <meta name="description" content="How BitB and AiTM kits weaponize fake login windows — and the heuristics PhishGuard Pro uses to catch them.">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="../assets/css/styles.css">
  <script src="../assets/js/main.js" defer></script>
</head>
<body>
  <a class="skip-link" href="#main">Skip to content</a>

  <nav class="nav" aria-label="Primary">
    <a href="/" class="nav-logo">
      <svg width="22" height="22" viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <path d="M16 2 L28 7 V16 C28 22 22 28 16 30 C10 28 4 22 4 16 V7 Z" stroke="currentColor" stroke-width="2" fill="rgba(34,211,238,0.08)"/>
        <circle cx="16" cy="15" r="3" fill="currentColor"/>
        <path d="M16 18 V23" stroke="currentColor" stroke-width="2"/>
      </svg>
      <span>SHULANK<span class="dot">.</span>PATEL</span>
    </a>
    <ul class="nav-links">
      <li><a href="/#projects">Projects</a></li>
      <li><a href="/#experience">Experience</a></li>
      <li><a href="/blog/" aria-current="page">Writing</a></li>
      <li><a href="/#contact">Contact</a></li>
    </ul>
    <div class="nav-cta">
      <button class="theme-toggle" data-theme-toggle aria-label="Toggle theme">☾</button>
      <a class="btn btn-primary" href="../assets/resume/Shulank_Patel_Resume.pdf" download>Resume ↓</a>
      <button class="nav-toggle" data-nav-toggle aria-label="Open menu" aria-expanded="false">☰</button>
    </div>
  </nav>

  <div class="mobile-drawer" data-mobile-drawer>
    <a href="/#projects">Projects</a>
    <a href="/#experience">Experience</a>
    <a href="/blog/">Writing</a>
    <a href="/#contact">Contact</a>
  </div>

  <main id="main">
    <article class="post">
      <header class="post-hero">
        <a class="case-back" href="./">← All writing</a>
        <h1>Detecting Browser-in-the-Browser attacks</h1>
        <div class="post-meta">Technical · 8 min read · May 2026</div>
      </header>

      <div class="post-body">
        <p>A Browser-in-the-Browser (BitB) attack does something unsettlingly simple: it renders a <em>fake browser window</em> inside the phishing page. From the user's perspective, they clicked "Sign in with Microsoft," a Microsoft login popup appeared, they typed their credentials, and the page proceeded as expected. From the page's perspective, no popup ever opened. The "window" was a <code>&lt;div&gt;</code>.</p>

        <h2>Why BitB works</h2>
        <p>Users have been trained for two decades to trust the chrome around a window — the URL bar, the lock icon, the title bar. BitB kits draw all of that. They give you a pixel-perfect fake of the Microsoft, Google, or Okta sign-in popup, with a fake URL bar showing <code>login.microsoftonline.com</code>, a fake padlock, and a draggable header. It's all CSS and a few hundred lines of JavaScript. The credentials go to the attacker's server. The user never leaves the malicious page.</p>
        <p>AiTM (adversary-in-the-middle) is the closely-related cousin: instead of faking the login window, the attacker proxies the real login flow through their own server — Evilginx2 and Tycoon 2FA are the well-known kits. The user sees a legitimate-looking Microsoft login, types their password, completes MFA, and the attacker captures the resulting session cookie. From the user's perspective, login worked.</p>

        <h2>The detection problem</h2>
        <p>Traditional phishing detection looks at: the sender's reputation, the URL's age, the page's content (suspicious words, branding lifted from a real company), and credential-form heuristics. BitB and AiTM defeat most of those:</p>
        <ul>
          <li>The sender can be a legitimate compromised account.</li>
          <li>The URL might be new but not <em>obviously</em> bad.</li>
          <li>The page's content mostly looks normal — the malicious part is a popup that only renders on click.</li>
          <li>The credential form is real. AiTM passes it straight to the real site.</li>
        </ul>

        <h2>BitB fingerprints</h2>
        <p>Most BitB kits share structural fingerprints because they're all copies of a few well-known templates. <code>bitb_analyzer.py</code> walks the DOM looking for:</p>
        <ol>
          <li><strong>Window-chrome div</strong> — a parent container with a child element styled to look like a browser title bar (specific gradient backgrounds, height ~32px, draggable handlers, a fake close-X SVG).</li>
          <li><strong>Fake URL bar text</strong> — a text element styled in monospace that contains an exact-match string for a major login URL (<code>login.microsoftonline.com</code>, <code>accounts.google.com</code>, <code>login.okta.com</code>) but is <em>not</em> an <code>&lt;input&gt;</code> or part of the actual location bar.</li>
          <li><strong>Lock icon SVG inline</strong> — most kits inline the same lock SVG path. A simhash against known BitB SVG fingerprints catches this cheaply.</li>
          <li><strong>Drag handler bound to mousemove</strong> — the fake window is draggable. The JavaScript binds <code>mousedown</code> + <code>mousemove</code> handlers to a container that <em>also</em> contains a credential form.</li>
          <li><strong>Credential form inside the draggable container</strong> — this is the smoking gun. Real browser popups don't contain DOM-level credential forms because they <em>are</em> browser popups, not DOM elements.</li>
        </ol>

        <h2>AiTM fingerprints</h2>
        <p>AiTM doesn't have BitB's DOM tells because the page <em>is</em> the real login page, served through a reverse proxy. The fingerprints are at the network layer:</p>
        <ol>
          <li><strong>Hostname doesn't match the login flow's expected domain.</strong> Microsoft 365 login lives at <code>login.microsoftonline.com</code>. If the credential form is on <code>login-microsoft.example-vps.io</code>, that's the proxy hostname leaking.</li>
          <li><strong>TLS certificate is recently issued, often Let's Encrypt, often valid for only one hostname.</strong> Real login services use long-lived enterprise certs.</li>
          <li><strong>Page assets load from two different origins</strong> — most from the real Microsoft CDN, some (the proxy's injection script) from the attacker's domain.</li>
          <li><strong>WAF / bot-protection cloaking</strong> — many AiTM kits cloak the phishing page from automated scanners (Cloudflare CAPTCHA gate, IP-range blocks against research scanners). PhishGuard's <code>redirect_analyzer</code> catches this by detecting the cloaking response.</li>
        </ol>

        <h2>Why this matters for SOC tickets</h2>
        <p>When a user reports a suspicious email, the analyst's first move is usually to click the link in a sandboxed browser and look at the page. If the analyst doesn't know to look for BitB-specific tells, they'll write off the page as "suspicious but no credential harvest observed" — when in fact the kit was waiting for a user click to render the fake popup, and the page itself is innocuous.</p>
        <p>Automating this detection in the triage pipeline means the BitB / AiTM judgement happens before the analyst opens the email, with the fingerprints already cited in the report. The analyst's job becomes deciding what to do about it, not whether it's there.</p>

        <h2>What still goes wrong</h2>
        <p>Detection isn't free of false positives. Some legitimate apps render their own draggable windows for accessibility tooling. Some legitimate proxies (corporate SSO, identity-broker products) look statistically similar to AiTM at the TLS layer. The current heuristics are tuned for high recall and moderate precision — the analyst is still the final judge. The right next step is a labeled training corpus to push precision up without surrendering recall.</p>

        <p style="margin-top:48px"><a href="./" class="project-link">All writing</a></p>
      </div>
    </article>
  </main>

  <footer class="footer">
    <div class="footer-row">
      <div>© 2026 Shulank Patel. Built with vanilla HTML/CSS/JS.</div>
      <div class="mono">tactical_midnight v1</div>
    </div>
  </footer>
</body>
</html>
```

- [ ] **Step 5: Verify in the browser**

Open http://localhost:8000/blog/ and check:
- Blog index renders with 2 post cards in a 2-column grid (1-column on mobile)
- "$ ls -la" footer line shows "→ 2 posts"
- Click "Read" on each card → opens the post
- Each post has: ← All writing link, big title, mono meta line, long-form reading body
- `<code>` snippets render with bg-card background and border
- `<pre>` code block renders with proper scroll
- Theme toggle works on blog pages too
- "All writing" link at the bottom of each post returns to the index

- [ ] **Step 6: Commit**

```bash
git add blog/ assets/css/styles.css
git commit -m "feat(blog): index + two seed posts

Blog landing with 2-card grid plus two seed posts:
'Building PhishGuard Pro' (case study, ~12 min) and
'Detecting Browser-in-the-Browser attacks' (technical, ~8 min).

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 13: 404 page

**Files:**
- Modify: `404.html`

- [ ] **Step 1: Write the 404 page**

Replace `404.html` with:

```html
<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>404 — Shulank Patel</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="assets/css/styles.css">
  <script src="assets/js/main.js" defer></script>
  <script src="assets/js/network-bg.js" defer></script>
</head>
<body>
  <a class="skip-link" href="#main">Skip to content</a>

  <nav class="nav" aria-label="Primary">
    <a href="/" class="nav-logo">
      <svg width="22" height="22" viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <path d="M16 2 L28 7 V16 C28 22 22 28 16 30 C10 28 4 22 4 16 V7 Z" stroke="currentColor" stroke-width="2" fill="rgba(34,211,238,0.08)"/>
        <circle cx="16" cy="15" r="3" fill="currentColor"/>
        <path d="M16 18 V23" stroke="currentColor" stroke-width="2"/>
      </svg>
      <span>SHULANK<span class="dot">.</span>PATEL</span>
    </a>
    <ul class="nav-links">
      <li><a href="/">Home</a></li>
      <li><a href="/#projects">Projects</a></li>
      <li><a href="/#experience">Experience</a></li>
      <li><a href="/blog/">Writing</a></li>
      <li><a href="/#contact">Contact</a></li>
    </ul>
    <div class="nav-cta">
      <button class="theme-toggle" data-theme-toggle aria-label="Toggle theme">☾</button>
      <a class="btn btn-primary" href="assets/resume/Shulank_Patel_Resume.pdf" download>Resume ↓</a>
      <button class="nav-toggle" data-nav-toggle aria-label="Open menu" aria-expanded="false">☰</button>
    </div>
  </nav>

  <div class="mobile-drawer" data-mobile-drawer>
    <a href="/">Home</a>
    <a href="/#projects">Projects</a>
    <a href="/#experience">Experience</a>
    <a href="/blog/">Writing</a>
    <a href="/#contact">Contact</a>
  </div>

  <main id="main">
    <section class="hero" style="min-height:calc(100vh - 72px)">
      <canvas id="network-bg" aria-hidden="true"></canvas>
      <div class="hero-inner" style="display:flex;flex-direction:column;justify-content:center;min-height:480px">
        <div class="hero-prompt">$ cat /var/log/site.log | grep 404<span class="caret">▊</span></div>
        <h1 style="margin-bottom:16px">404<span class="accent">.</span></h1>
        <p class="hero-tagline">That path doesn't exist on this host. The page may have moved, or it was never here to begin with.</p>
        <div class="hero-cta">
          <a href="/" class="btn btn-primary btn-lg">Back to home →</a>
          <a href="/#projects" class="btn btn-secondary btn-lg">Projects</a>
        </div>
      </div>
    </section>
  </main>

  <footer class="footer">
    <div class="footer-row">
      <div>© 2026 Shulank Patel. Built with vanilla HTML/CSS/JS.</div>
      <div class="mono">tactical_midnight v1</div>
    </div>
  </footer>
</body>
</html>
```

- [ ] **Step 2: Verify in the browser**

Open http://localhost:8000/404.html and check:
- Page renders with the terminal prompt, big "404." gradient heading, message, and two CTAs
- Network background animation runs
- "Back to home →" returns to `/`
- Theme toggle works

- [ ] **Step 3: Commit**

```bash
git add 404.html
git commit -m "feat: themed 404 page

Terminal-prompt header, network animation, clear nav back
to home and projects.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 14: Final QA, Lighthouse, README, deploy prep

**Files:**
- Modify: `README.md`
- Possibly modify: `assets/css/styles.css`, `index.html` (if QA finds issues)

- [ ] **Step 1: Responsive sweep**

In Chrome DevTools, toggle device mode and walk through each viewport. Pages to check: `index.html`, `phishguard.html`, `blog/index.html`, `blog/building-phishguard-pro.html`, `blog/detecting-bitb-attacks.html`, `404.html`.

Viewports: 320px, 375px, 768px, 1024px, 1440px.

For each: confirm nothing overflows horizontally, no overlapping text, nav drawer works under 1024px, stat tiles wrap correctly, projects grid wraps correctly, timeline reads cleanly. Note any issues, fix in CSS, recheck.

- [ ] **Step 2: Keyboard a11y sweep**

On each page: press Tab from the URL bar repeatedly. Confirm:
- Skip-to-content appears as the first focusable element
- Tab order: skip-link → logo → nav links → theme toggle → resume button → mobile-nav button (if visible) → page content (CTAs, form fields, links)
- Focus rings visible (cyan 2px outline) on every focusable element
- Mobile drawer is reachable by keyboard when the ☰ button is focused + Enter

- [ ] **Step 3: Lighthouse audit**

In Chrome DevTools → Lighthouse panel:
- Run on `http://localhost:8000/` and `http://localhost:8000/phishguard.html`
- Mode: Navigation, Device: Mobile
- Confirm all 4 categories (Performance, Accessibility, Best Practices, SEO) ≥ 95
- If any score is below 95, address the specific suggestion (likely items: image alt text, color-contrast warnings — fix and retest)

- [ ] **Step 4: Reduced-motion verification**

DevTools → Rendering panel → Emulate CSS media feature `prefers-reduced-motion: reduce`. Confirm:
- Network background freezes (no node movement, no threat pulses)
- Section transitions / hover lifts are instantaneous
- Caret blink and status-dot pulse stop

- [ ] **Step 5: Cross-browser smoke test**

Open `http://localhost:8000/` in Safari and Firefox if available. Check:
- Layout looks identical
- `color-mix()` and `backdrop-filter` render correctly (these have wide support now; if Safari shows a degraded backdrop, that's acceptable)
- Theme toggle persists across reload

- [ ] **Step 6: Test runner final check**

Open `http://localhost:8000/tests/test-runner.html`. Confirm all 11 tests pass.

- [ ] **Step 7: Write the final README**

Replace `README.md` with:

```markdown
# Shulank Patel — Portfolio

Personal portfolio site for Shulank Patel, SOC Analyst at dayOneCyber.

Live site: <set after deploy>

## Stack

Static HTML/CSS/JS. No build step. No dependencies beyond Google Fonts.

## Run locally

```bash
python3 -m http.server 8000
```

Then open <http://localhost:8000>.

## Run the test suite

Open <http://localhost:8000/tests/test-runner.html>. All tests run in-browser and report pass/fail.

## Project structure

- `index.html` — long-scroll homepage
- `phishguard.html` — PhishGuard Pro case study
- `404.html` — themed 404
- `blog/` — blog index + posts
- `assets/css/styles.css` — all styles
- `assets/js/main.js` — theme, mobile nav, contact form
- `assets/js/network-bg.js` — hero canvas animation
- `assets/resume/Shulank_Patel_Resume.pdf` — downloadable resume
- `tests/test-runner.html` — in-browser unit tests
- `docs/superpowers/` — design spec and implementation plan

## Deploy to GitHub Pages

1. Push this repo to GitHub.
2. Settings → Pages → Source: Deploy from a branch → `main` / root.
3. Wait for the green check, site is live at `https://<your-username>.github.io/<repo-name>/`.
4. (Optional) Custom domain: write the hostname to `CNAME`, point DNS, enable HTTPS.

The repo includes `.nojekyll` so GitHub Pages does not run Jekyll.

## Design system

"Tactical Midnight." Ice blue (`#22d3ee`) + ember orange (`#f97316`) on deep navy (`#04080f`). Light variant available via theme toggle. See `docs/superpowers/specs/2026-05-18-portfolio-design.md` for full design tokens.
```

- [ ] **Step 8: Final commit**

```bash
git add README.md
git commit -m "docs: production README with run, test, and deploy instructions

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

- [ ] **Step 9: Verify clean git state**

```bash
git status
git log --oneline
```

Expected: clean working tree, ~14 commits matching the task list.

---

## Done

The site is ready to deploy. To push to GitHub Pages:

```bash
gh repo create portfolio --public --source=. --remote=origin --push
# then in the GitHub UI: Settings → Pages → Deploy from branch → main / root
```

Or follow the manual steps in `README.md`.
