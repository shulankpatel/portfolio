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
