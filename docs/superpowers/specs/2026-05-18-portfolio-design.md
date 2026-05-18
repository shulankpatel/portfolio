# Portfolio Website — Design Spec

**Owner:** Shulank Patel
**Date:** 2026-05-18
**Project location:** `/Users/shulankpatel/Downloads/Claude/portfolio/`

---

## 1. Purpose

A personal portfolio website for Shulank Patel, SOC Analyst at dayOneCyber. The site serves three audiences in priority order:

1. **Recruiters and hiring managers** evaluating Shulank for SOC Analyst / Security Engineer / Detection Engineer roles.
2. **Technical hiring managers** who want to verify hands-on depth by reading a real project case study.
3. **Peers and future readers** of write-ups on detection, automation, and modern phishing threats.

The site is hybrid: a long-scroll homepage that recruiters can skim in 30 seconds, plus a deep-dive case study for the flagship project (PhishGuard Pro), plus a scaffolded blog with two sample posts.

## 2. Success criteria

- Recruiter on the home page can identify role fit and quantified impact within 30 seconds.
- Technical reader can drill into PhishGuard Pro and understand architecture, modules, and design decisions.
- Site is fully static (no backend), loads in under 1 second, scores ≥ 95 on Lighthouse for Performance, Accessibility, Best Practices, and SEO.
- Site is deployable to GitHub Pages as-is (no build step).
- Resume PDF is one click away from any page.
- Site looks intentional in both dark and light themes.
- No layout regressions at 320px (small mobile), 768px (tablet), and 1440px (desktop).

## 3. Non-goals

- No CMS, no database, no auth, no backend.
- No JavaScript framework (no React, Vue, Astro, Next.js).
- No analytics/tracking in v1.
- No contact form backend — the form opens the user's mail client via `mailto:` with pre-filled subject and body.
- No multi-page-per-project deep dives in v1 beyond PhishGuard Pro. Other projects stay as homepage cards.
- No real blog posts beyond the two seeded samples in v1.

## 4. Tech stack

- **HTML5** — semantic markup throughout.
- **CSS3** — single shared stylesheet at `assets/css/styles.css`. CSS custom properties for theme tokens. No preprocessor.
- **Vanilla JavaScript (ES2020+)** — `assets/js/main.js` for theme toggle, mobile nav, contact form, scroll reveal; `assets/js/network-bg.js` for the canvas animation.
- **Fonts** — Inter (UI) and JetBrains Mono (code, terminal accents), both via Google Fonts with `preconnect`.
- **No build step.** Open `index.html` in a browser to test. Deployable as static files.

## 5. Site map

```
portfolio/
├── index.html                                  # Long-scroll home page
├── phishguard.html                             # PhishGuard Pro case study
├── blog/
│   ├── index.html                              # Blog landing (card grid)
│   ├── building-phishguard-pro.html            # Sample post #1
│   └── detecting-bitb-attacks.html             # Sample post #2
├── 404.html                                    # Themed 404 page
├── assets/
│   ├── css/styles.css                          # Shared stylesheet
│   ├── js/
│   │   ├── main.js                             # Theme, nav, form, scroll
│   │   └── network-bg.js                       # Canvas network animation
│   ├── img/                                    # Screenshots, og-image, favicons
│   └── resume/Shulank_Patel_Resume.pdf         # Copied from parent folder
├── CNAME                                       # Optional custom domain
├── README.md                                   # Deploy notes
└── .nojekyll                                   # Disable Jekyll on GitHub Pages
```

Four content pages total: home, PhishGuard case study, blog index, two sample blog posts.

## 6. Homepage sections (top → bottom)

| # | Section          | Content                                                                                                                                                                                                                          |
| - | ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1 | Hero             | Sticky nav. Animated network background. Status pill ("● Available for opportunities"). `$ whoami` terminal accent. H1 name + gradient period. Tagline from resume summary. Location ("Ottawa, Canada · Open to remote"). 2 CTAs: **View Work** → scroll to projects; **Download Resume** → PDF. |
| 2 | About / Impact   | 2-3 sentence pitch derived from resume summary. Four stat tiles: `MTTD ↓ 30%`, `Resolution ↓ 25%`, `Phish Triage ↓ 40%`, `1000+ Tickets`. Each tile has a small uppercase label, large number, and 1-line description.            |
| 3 | Selected Projects| Grid: PhishGuard Pro as a **wide hero card** spanning two columns (links to `phishguard.html`), plus three smaller cards for N8n+OpenVAS pipeline, Phishing email triage pipeline, Password tooling trio. Each card has thumbnail/diagram, name, 1-line description, tech tags, "View →" link or "Case study →" for PhishGuard. |
| 4 | Experience       | Vertical timeline. Three entries: dayOneCyber SOC Analyst (Jun 2024 – Present), dayOneCyber SOC Intern (Dec 2023 – Jun 2024), LEARNSMASHER Cybersecurity Intern (Apr 2023 – May 2023). Each item shows role, company, dates, and 3-5 bullet wins. Lifted verbatim from resume.                                                                  |
| 5 | Skills           | Four-column block (collapses to 2 then 1 on smaller screens). Categories: **Security Operations**, **Tools & Technologies**, **Technical Expertise**, **Frameworks & Best Practices**. Pill tags only — no skill bars.                              |
| 6 | Education & Certs| Two-column block. Left: Master of Networking Tech (Cybersecurity), Carleton University, Sep 2025–Present; Bachelor of Computer Engineering, CVM University, Jan 2020–Jan 2024; IoT Minor. Right: CompTIA Security+; TryHackMe Cyber Security 101.    |
| 7 | Writing          | 3-card teaser of latest posts → "Read all writing →" links to `blog/index.html`. Each card: post title, 1-line excerpt, read time, tag.                                                                                                                |
| 8 | Contact          | Mailto contact form (Name · Email · Message → opens email client with pre-filled `mailto:shulankpatel88@gmail.com`). Direct contact links: email, LinkedIn (`/in/shulank-patel-772710204`), phone (`+1 343 552 6679`). Footer below with © year, theme toggle reminder, "Built with vanilla HTML/CSS/JS" note. |

## 7. PhishGuard Pro case study page

Single deep-dive page at `phishguard.html`:

1. **Header** — Back-to-home arrow link, project title, tagline, tech-tag pills (Python · Flask · SQLite · Anthropic Claude · MITRE ATT&CK · STIX 2.1), optional GitHub button.
2. **At-a-glance stats** — Four tiles: `25 modules`, `6 phases`, `31 MITRE techniques`, `STIX 2.1 export`.
3. **The Problem** — 2-3 paragraphs on phishing triage cost in a SOC, motivation lifted from real dayOneCyber experience (40% time reduction work).
4. **The Approach** — Visual SVG diagram of the 6-phase pipeline: Core → Enrichment → Modern Threats → MITRE + IOC → External APIs → Intelligence. Each phase is clickable to reveal its modules.
5. **Highlighted modules** — Cards for `bitb_analyzer`, `campaign_analyzer`, `ai_analyzer`, `mitre_mapper`, `ioc_extractor`. Each card has 2-3 sentences of "what it does + why it matters."
6. **Architecture** — Stack diagram (HTML/CSS, no image): Flask + SQLite + 25 analyzer modules + optional VT/urlscan/Anthropic APIs. Auth note (Flask sessions, pbkdf2:sha256 due to LibreSSL constraint).
7. **UI gallery** — 2-3 screenshots of the actual PhishGuard Pro app showing the Tactical Midnight theme. Note the visual continuity with this portfolio.
8. **Lessons learned** — 3-4 short bullets. Examples: Python 3.9 LibreSSL gotcha, why direct Anthropic SDK beat the threading approach, designing IOC export for SIEM/SOAR integration.
9. **Footer CTA** — "Interested in the SOC work behind this? Get in touch →" linking back to homepage contact section.

## 8. Blog

- `blog/index.html` — landing page with a card grid of posts. Each card: title, excerpt, date, read time, tag.
- Two seed posts:
  - `building-phishguard-pro.html` — A behind-the-scenes write-up of PhishGuard Pro: motivation, module design, modern-threat detection, lessons learned.
  - `detecting-bitb-attacks.html` — Technical explainer of Browser-in-the-Browser attacks and detection heuristics, framed around the `bitb_analyzer` module.
- Each post uses the same single-column reading layout: title, byline, date/read time, body with typographic spacing, related-posts strip at the bottom.
- Empty-state messaging on the blog index makes it clear that more posts are coming.

## 9. Visual design system ("Tactical Midnight")

### Color tokens

**Dark mode (default):**
| Token              | Value      | Use                                             |
| ------------------ | ---------- | ----------------------------------------------- |
| `--bg-deep`        | `#04080f`  | Page background                                 |
| `--bg-surface`     | `#0a1628`  | Section backgrounds                             |
| `--bg-card`        | `#0f1e36`  | Card surfaces                                   |
| `--border`         | `#1e3a52`  | Card borders, dividers                          |
| `--text-primary`   | `#e2e8f0`  | Body text                                       |
| `--text-muted`     | `#94a3b8`  | Secondary text                                  |
| `--text-dim`       | `#64748b`  | Labels, captions                                |
| `--primary` (cyan) | `#22d3ee`  | Links, highlights, focus ring, primary accents  |
| `--accent` (ember) | `#f97316`  | CTAs, status, alerts, secondary highlights      |
| `--gradient`       | `linear-gradient(135deg, #22d3ee 0%, #0ea5e9 50%, #0284c7 100%)` | Buttons, hero name accent |

**Light mode:**
| Token              | Value      |
| ------------------ | ---------- |
| `--bg-deep`        | `#f0f9ff`  |
| `--bg-surface`     | `#ffffff`  |
| `--bg-card`        | `#ffffff`  |
| `--border`         | `#cbd5e1`  |
| `--text-primary`   | `#0f172a`  |
| `--text-muted`     | `#475569`  |
| `--text-dim`       | `#64748b`  |
| `--primary`        | `#0284c7`  |
| `--accent`         | `#ea580c`  |

### Typography

- **UI font:** Inter (400 / 500 / 600 / 700 / 800), loaded via Google Fonts with `preconnect`.
- **Mono font:** JetBrains Mono (400 / 500). Used for code, tech tags, terminal prompts, section labels.
- **Scale (px):** `12 · 14 · 16 · 18 · 24 · 32 · 48 · 64 · 72`. H1 at 72 (desktop) / 48 (mobile).
- **Line height:** 1.5 for body, 1.1 for display headings.

### Spacing & layout

- **Grid:** 4-pt grid — `4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96`.
- **Max content width:** 1200px. Inner sections respect a 72px horizontal padding on desktop, 24px on mobile.
- **Breakpoints:** `≤ 640px` mobile, `641–1024px` tablet, `> 1024px` desktop.

### Components

- **Glass cards** — `backdrop-filter: blur(12px)` over `rgba(15, 30, 54, 0.6)`, 1px border in `--border`, optional 2px left border in `--primary` or `--accent`. Hover: subtle scale (1.01) + cyan border glow.
- **Stat tiles** — uppercase label (10px JetBrains Mono, dim), 30-40px number in `--primary` or `--accent`, 11px description in `--text-muted`.
- **Tech tag pills** — JetBrains Mono 11px, 1px border in `--primary` at 30% opacity, transparent fill, 4px / 10px padding.
- **Buttons:**
  - Primary — gradient fill (`--gradient`), dark text (`--bg-deep`), 8px radius, 8/16 padding.
  - Secondary — transparent fill, 1px border in `--primary`, `--primary` text.
- **Section dividers** — thin 1px line in `--primary` + uppercase JetBrains Mono section label ("SECTION 02 — SELECTED PROJECTS").

### Motion

- Sections fade in (opacity 0 → 1, translateY 20px → 0) when scrolled into view via `IntersectionObserver`. Duration 400ms, ease-out.
- Network background: canvas with ~40 drifting nodes connected by lines. Occasional "threat detected" pulse on a random node every ~6 seconds (ember-orange expanding circle).
- Theme toggle: instant swap (no animation).
- Hover states: 150ms ease-out.
- All animations respect `prefers-reduced-motion: reduce` — the network background freezes, fades become instant, the threat-detected pulse stops.

### Accessibility

- WCAG AA contrast across all text/background combinations. Light blue `#22d3ee` on dark `#04080f` is ≥ 11:1; ember orange `#f97316` on dark is ≥ 6:1 (passes for large text and UI components).
- Visible 2px outline focus ring in `--primary` on all interactive elements; never `outline: none` without a replacement.
- Semantic HTML — `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`, single `<h1>` per page, logical heading order.
- Skip-to-content link as the first focusable element.
- All decorative SVGs marked `aria-hidden="true"`; meaningful icons have accessible labels.
- All interactive elements reachable via keyboard with logical tab order.
- Theme preference persisted in `localStorage` and respects `prefers-color-scheme` on first visit.
- Reduced-motion preference respected throughout.

## 10. Feature details

### Resume download
- Hero CTA "Download Resume ↓" links to `assets/resume/Shulank_Patel_Resume.pdf`.
- Nav also includes a smaller "Resume ↓" button. Both use `download` attribute so the file downloads rather than opens inline.

### Theme toggle
- Icon button (☾ / ☀) in nav. Stores selection in `localStorage` under `pg-theme`. On first visit, reads `prefers-color-scheme: dark` to set initial value. Toggling rewrites the `data-theme` attribute on `<html>`, which CSS uses to swap variable values.

### Contact form (mailto)
- Three fields: Name, Email, Message. JavaScript intercepts submit, validates non-empty, constructs `mailto:shulankpatel88@gmail.com?subject=...&body=...` with the form data, and triggers `window.location.href = mailtoUrl`. No backend.
- Direct contact alternatives shown alongside: clickable email, LinkedIn, phone.

### Animated network background
- Canvas-based, written in vanilla JS at `assets/js/network-bg.js`.
- ~40 nodes drifting slowly (velocity 0.2–0.5 px/frame). Lines drawn between nodes within ~180px distance, with opacity scaling by distance.
- Every ~6 seconds, picks a random node and renders an expanding ember-orange "threat detected" ring (radius grows from 6 to 28 over 2s, opacity fades).
- Pauses when the tab is not visible (`document.hidden`). Stops entirely on `prefers-reduced-motion: reduce`.
- Renders only behind the hero (height matches hero); other sections do not have the animation.

## 11. Component & module boundaries

For maintainability:

- **`styles.css`** is organized into clearly labeled blocks: tokens (`:root` / `[data-theme="light"]`), reset, layout, typography, components (button, card, stat, pill, timeline, form), sections (hero, projects, experience, skills, etc.), utilities, media queries. No file split — it's a portfolio, not an app.
- **`main.js`** is a small module with a single `init()` that registers handlers for: theme toggle, mobile nav, contact form, scroll-reveal. Each handler is a named function.
- **`network-bg.js`** is self-contained. Exports nothing — auto-initializes when the canvas element exists on the page.
- HTML pages share the same `<head>` block (fonts, viewport, theme bootstrap script that reads `localStorage` before render to prevent FOUC), the same `<nav>`, and the same `<footer>`. These blocks are copy-pasted across files (no templating, since vanilla static).

## 12. Error handling

- 404 page styled in the Tactical Midnight theme with a terminal-style "command not found" header, a recap of where to go (Home, Projects, Writing, Contact), and the network animation.
- Contact form: if any field is empty, show inline 1-line validation message and prevent submit.
- Theme bootstrap script wrapped in try/catch so a `localStorage` exception (private mode, sandboxed iframe) does not block render — falls back to dark mode.
- Canvas animation wrapped in a feature check (`canvas.getContext` available, `requestAnimationFrame` available); otherwise silently skipped.

## 13. Testing approach

Manual checks before declaring v1 done:

- Pages render correctly in latest Chrome, Safari, Firefox on macOS.
- Pages render correctly at 320px, 768px, 1440px widths.
- Keyboard tab order is logical across each page; skip-to-content works.
- Lighthouse (Chrome DevTools) scores ≥ 95 across all four categories on `index.html` and `phishguard.html`.
- Light/dark toggle persists across navigation between pages.
- Contact form opens the user's mail client with the expected pre-filled values.
- Resume PDF downloads from both hero CTA and nav button.
- 404 page is served by GitHub Pages for unknown paths.
- Network animation pauses with `prefers-reduced-motion: reduce` (DevTools rendering panel).

## 14. Deployment

- **Target:** GitHub Pages from a public repo named `portfolio` (or `shulank.github.io` for the user-page form).
- **Steps:**
  1. `git init`, commit the project root.
  2. Push to GitHub.
  3. Repo Settings → Pages → Deploy from branch → `main` / root.
  4. Wait for the green check; site is live at `https://<username>.github.io/portfolio/`.
  5. (Optional) Configure custom domain — write the hostname to `CNAME`, point DNS, enable HTTPS.
- `.nojekyll` is committed at the root to disable Jekyll processing.
- `README.md` documents these deploy steps for future reference.

## 15. Open items (deferred to future iterations)

- Real blog posts beyond the two seeded samples.
- Analytics (privacy-respecting, if desired later).
- Per-project deep dives for the non-PhishGuard projects.
- GitHub repo links on project cards (depends on which projects are public).
- A `feed.xml` / RSS for the blog.
- Custom domain (decision deferred — buy a domain when ready).
