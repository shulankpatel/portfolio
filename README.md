# Shulank Patel — Portfolio

Personal portfolio site for **Shulank Patel**, SOC Analyst at dayOneCyber.

Live site: _set this after deploy_

## Stack

Static HTML5 / CSS3 / vanilla JavaScript. No build step. No dependencies beyond Google Fonts (Inter + JetBrains Mono).

## Run locally

```
python3 -m http.server 8000
```

Then open <http://localhost:8000>. You can also open `index.html` directly in a browser (some asset paths use absolute `/blog/` style, so the local server is recommended).

## Run the test suite

The portfolio's JS modules are covered by an in-browser test runner — no npm, no framework. Start the local server (above), then open <http://localhost:8000/tests/test-runner.html>. Each test shows PASS or FAIL with a summary line at the bottom.

## Project structure

```
.
├── index.html                    # Long-scroll homepage
├── phishguard.html               # PhishGuard Pro case study
├── 404.html                      # Themed 404
├── blog/
│   ├── index.html                # Blog landing
│   ├── building-phishguard-pro.html
│   └── detecting-bitb-attacks.html
├── assets/
│   ├── css/styles.css            # Single shared stylesheet
│   ├── js/
│   │   ├── main.js               # Theme, mobile nav, contact form
│   │   └── network-bg.js         # Canvas network animation
│   ├── img/                      # (placeholder for screenshots, favicons)
│   └── resume/Shulank_Patel_Resume.pdf
├── tests/test-runner.html        # In-browser unit tests
├── docs/superpowers/             # Design spec + implementation plan
├── .nojekyll                     # Disable Jekyll on GitHub Pages
└── README.md
```

## Wire up the contact form (Formspree)

The contact form posts to [Formspree](https://formspree.io) — free tier handles 50 submissions/month, no backend needed. To activate it:

1. Sign up at <https://formspree.io> with `shulankpatel88@gmail.com`.
2. Create a new form. Formspree gives you an endpoint URL like `https://formspree.io/f/xpzgnqva`.
3. Copy the form ID (the part after `/f/` — e.g., `xpzgnqva`).
4. In `index.html`, find the line:
   ```
   <form class="contact-form" data-contact-form action="https://formspree.io/f/YOUR_FORMSPREE_ID" method="POST" novalidate>
   ```
   Replace `YOUR_FORMSPREE_ID` with your form ID.
5. Confirm your email through Formspree's verification link (one click).
6. Submit a test message from the live site. It should arrive at your inbox within seconds and the form should show an inline "Thanks — message sent." confirmation.

Until step 4 is done, the form will refuse to submit and show an inline note pointing visitors at the direct email link instead.

## Pre-deploy QA checklist

Run these manual checks before publishing. The site is small enough that 10 minutes is enough:

- [ ] Page renders cleanly in latest Chrome, Safari, and Firefox.
- [ ] Layout doesn't break at 320 px, 375 px, 768 px, 1024 px, and 1440 px wide.
- [ ] Lighthouse (Chrome DevTools → Lighthouse, Mobile) scores ≥ 95 on Performance, Accessibility, Best Practices, and SEO for both `index.html` and `phishguard.html`.
- [ ] Theme toggle (☾ / ☀) flips dark ↔ light and persists across page reloads and navigation between pages.
- [ ] Resume button downloads `Shulank_Patel_Resume.pdf` from both the nav and the hero.
- [ ] Contact form: submitting empty shows an inline error; submitting valid input (after wiring Formspree) shows an inline "Thanks — message sent." confirmation and arrives in your inbox.
- [ ] Mobile drawer (☰) opens/closes correctly under 1024 px and locks body scroll when open.
- [ ] Skip-to-content link appears as the first focusable element on Tab.
- [ ] All 11 in-browser tests at `/tests/test-runner.html` PASS.
- [ ] DevTools → Rendering → emulate `prefers-reduced-motion: reduce`: network background freezes, hover/blink animations stop.
- [ ] Tab order is logical end-to-end.
- [ ] No console errors on any page.

## Deploy to GitHub Pages

1. Push this repo to GitHub.
2. **Settings → Pages → Source:** Deploy from a branch → `main` / root.
3. Wait for the green check. The site goes live at `https://<your-username>.github.io/<repo-name>/`.
4. (Optional) Custom domain: write the hostname to `CNAME`, point DNS, enable HTTPS.

`.nojekyll` is committed at the root so GitHub Pages does not run Jekyll over the static files.

## Design system

**Tactical Midnight.** Ice blue (`#22d3ee`) + ember orange (`#f97316`) on deep navy (`#04080f`). Light variant available via the theme toggle. Full design tokens live in `docs/superpowers/specs/2026-05-18-portfolio-design.md`.

## Credits

- Inter and JetBrains Mono via Google Fonts.
- Resume content: real — pulled from Shulank's actual resume.
- Built with vanilla HTML/CSS/JS.
