/* ============================================================
   PORTFOLIO — console-3d.js
   Progressive enhancement for the Nocturne hero visuals:
   a 2D canvas "threat-field" backdrop and a three.js
   "secure-globe". Both are optional — skipped entirely under
   prefers-reduced-motion, and the heavier globe is skipped on
   small screens to save bandwidth/battery. Static fallback
   markup already in the page covers every skipped case.
   ============================================================ */
(function () {
  var reduceMotion = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) return;

  var smallScreen = window.matchMedia && window.matchMedia('(max-width: 640px)').matches;

  function loadScript(src) {
    return new Promise(function (resolve, reject) {
      var s = document.createElement('script');
      s.src = src;
      s.onload = resolve;
      s.onerror = reject;
      document.head.appendChild(s);
    });
  }

  loadScript('assets/js/cyber-3d.js').then(function () {
    var bg = document.querySelector('[data-threat-bg]');
    if (bg && !bg.querySelector('threat-field')) {
      bg.appendChild(document.createElement('threat-field'));
    }

    if (smallScreen) return; // skip the heavier WebGL globe on small screens

    var host = document.querySelector('[data-globe-host], .panel-globe');
    if (!host) return;

    loadScript('https://unpkg.com/three@0.149.0/build/three.min.js').then(function () {
      var globe = document.createElement('secure-globe');
      host.appendChild(globe);
      var fallback = host.querySelector('[data-globe-fallback]');
      if (fallback) fallback.hidden = true;
    }).catch(function () { /* three.js failed to load — static fallback stays visible */ });
  }).catch(function () { /* custom elements failed to load — static fallback stays visible */ });
})();
