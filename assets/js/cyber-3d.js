/* Two custom elements for the security portfolio:
   <threat-field>  — animated background: orthogonal circuit traces with signal pulses
                     racing along them, pads flaring as each pulse passes, and the
                     occasional blocked route flashing at a junction.
   <secure-globe>  — three.js wireframe globe with orbiting satellites and orbit rings.
                     Requires window.THREE (classic build loaded in <helmet>). */

if (!customElements.get('threat-field')) {
  customElements.define('threat-field', class extends HTMLElement {
    connectedCallback() {
      this.style.display = 'block';
      this.style.width = '100%';
      this.style.height = '100%';
      const c = document.createElement('canvas');
      c.style.cssText = 'display:block;width:100%;height:100%';
      this.appendChild(c);
      const ctx = c.getContext('2d');
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      let w = 1, h = 1, routes = [];
      const CELL = 58;

      const buildRoutes = () => {
        routes = [];
        const cols = Math.max(4, Math.floor(w / CELL));
        const rows = Math.max(4, Math.floor(h / CELL));
        const count = Math.max(7, Math.min(16, Math.round((cols * rows) / 26)));
        for (let r = 0; r < count; r++) {
          // start on a random edge, head inward
          const fromLeft = Math.random() < 0.55;
          let cx, cy, dir;
          if (fromLeft) { cx = 0; cy = 1 + Math.floor(Math.random() * (rows - 2)); dir = [1, 0]; }
          else { cx = 1 + Math.floor(Math.random() * (cols - 2)); cy = 0; dir = [0, 1]; }
          const pts = [[cx, cy]];
          const legs = 4 + Math.floor(Math.random() * 5);
          for (let l = 0; l < legs; l++) {
            const len = 2 + Math.floor(Math.random() * 5);
            cx = Math.max(0, Math.min(cols, cx + dir[0] * len));
            cy = Math.max(0, Math.min(rows, cy + dir[1] * len));
            pts.push([cx, cy]);
            // turn 90°, biased to keep drifting down/right so routes cross the page
            dir = dir[0] !== 0
              ? [0, Math.random() < 0.62 ? 1 : -1]
              : [Math.random() < 0.62 ? 1 : -1, 0];
          }
          const abs = pts.map(([x, y]) => [x * CELL, y * CELL]);
          const segs = [];
          let total = 0;
          for (let i = 1; i < abs.length; i++) {
            const len = Math.hypot(abs[i][0] - abs[i - 1][0], abs[i][1] - abs[i - 1][1]);
            segs.push({ a: abs[i - 1], b: abs[i], len, start: total });
            total += len;
          }
          if (total < 40) continue;
          routes.push({
            pts: abs, segs, total,
            speed: 46 + Math.random() * 78,
            offset: Math.random() * total,
            blocked: Math.random() < 0.22,
            gate: 0.45 + Math.random() * 0.35,
          });
        }
      };

      const at = (route, d) => {
        let dist = ((d % route.total) + route.total) % route.total;
        for (const s of route.segs) {
          if (dist <= s.len) {
            const t = s.len === 0 ? 0 : dist / s.len;
            return [s.a[0] + (s.b[0] - s.a[0]) * t, s.a[1] + (s.b[1] - s.a[1]) * t];
          }
          dist -= s.len;
        }
        const last = route.segs[route.segs.length - 1];
        return last ? last.b : [0, 0];
      };

      const resize = () => {
        const r = this.getBoundingClientRect();
        w = Math.max(1, r.width); h = Math.max(1, r.height);
        c.width = w * dpr; c.height = h * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        buildRoutes();
      };
      resize();
      this._ro = new ResizeObserver(() => {
        cancelAnimationFrame(this._rz);
        this._rz = requestAnimationFrame(resize);
      });
      this._ro.observe(this);

      let t0 = performance.now(), raf = 0;
      const draw = (now) => {
        const t = (now - t0) / 1000;
        ctx.clearRect(0, 0, w, h);
        ctx.lineCap = 'square';
        ctx.lineJoin = 'miter';

        for (const route of routes) {
          // the trace itself
          ctx.strokeStyle = 'rgba(145,132,217,0.13)';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(route.pts[0][0], route.pts[0][1]);
          for (let i = 1; i < route.pts.length; i++) ctx.lineTo(route.pts[i][0], route.pts[i][1]);
          ctx.stroke();

          // pads at each corner
          for (let i = 0; i < route.pts.length; i++) {
            const p = route.pts[i];
            ctx.fillStyle = 'rgba(145,132,217,0.3)';
            ctx.fillRect(p[0] - 2, p[1] - 2, 4, 4);
          }

          const head = route.offset + t * route.speed;
          const gateDist = route.total * route.gate;
          const cyclePos = ((head % route.total) + route.total) % route.total;
          const stopped = route.blocked && cyclePos > gateDist;
          const shown = stopped ? gateDist : cyclePos;

          // pulse tail
          const TAIL = 108, STEP = 7;
          for (let d = TAIL; d > 0; d -= STEP) {
            const from = at(route, shown - d);
            const to = at(route, shown - d + STEP);
            const a = 0.5 * (1 - d / TAIL);
            ctx.strokeStyle = 'rgba(181,171,252,' + a.toFixed(3) + ')';
            ctx.lineWidth = 1.6;
            ctx.beginPath();
            ctx.moveTo(from[0], from[1]);
            ctx.lineTo(to[0], to[1]);
            ctx.stroke();
          }

          const p = at(route, shown);
          if (stopped) {
            // blocked at the gate: a red-free accent flare that breathes
            const pulse = 0.35 + 0.35 * Math.abs(Math.sin(t * 3.1));
            ctx.strokeStyle = 'rgba(210,206,253,' + pulse.toFixed(3) + ')';
            ctx.lineWidth = 1.2;
            ctx.beginPath();
            ctx.arc(p[0], p[1], 6 + pulse * 5, 0, Math.PI * 2);
            ctx.stroke();
            ctx.fillStyle = 'rgba(210,206,253,0.75)';
            ctx.fillRect(p[0] - 3, p[1] - 3, 6, 6);
          } else {
            ctx.fillStyle = 'rgba(233,233,237,0.9)';
            ctx.beginPath();
            ctx.arc(p[0], p[1], 2.1, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = 'rgba(145,132,217,0.16)';
            ctx.beginPath();
            ctx.arc(p[0], p[1], 7, 0, Math.PI * 2);
            ctx.fill();
          }

          // pads flare as the pulse crosses them
          let acc = 0;
          for (let i = 0; i < route.segs.length; i++) {
            acc += route.segs[i].len;
            const near = Math.abs(shown - acc);
            if (near < 26) {
              const a = 0.55 * (1 - near / 26);
              const v = route.segs[i].b;
              ctx.fillStyle = 'rgba(210,206,253,' + a.toFixed(3) + ')';
              ctx.fillRect(v[0] - 4, v[1] - 4, 8, 8);
            }
          }
        }
        raf = requestAnimationFrame(draw);
      };
      raf = requestAnimationFrame(draw);
      this._stop = () => cancelAnimationFrame(raf);
    }
    disconnectedCallback() {
      if (this._stop) this._stop();
      if (this._ro) this._ro.disconnect();
      cancelAnimationFrame(this._rz);
    }
  });
}

if (!customElements.get('secure-globe')) {
  customElements.define('secure-globe', class extends HTMLElement {
    async connectedCallback() {
      this.style.display = 'block';
      this.style.width = '100%';
      this.style.height = '100%';
      for (let i = 0; i < 120 && !window.THREE; i++) await new Promise((r) => setTimeout(r, 50));
      const THREE = window.THREE;
      if (!THREE) return;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
      camera.position.set(0, 1.1, 6.4);
      camera.lookAt(0, 0, 0);

      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setClearColor(0x000000, 0);
      this.appendChild(renderer.domElement);
      renderer.domElement.style.cssText = 'display:block;width:100%;height:100%';

      const root = new THREE.Group();
      scene.add(root);

      const core = new THREE.Mesh(
        new THREE.SphereGeometry(1.62, 48, 48),
        new THREE.MeshStandardMaterial({ color: 0x1c1e2c, roughness: 0.72, metalness: 0.22 })
      );
      root.add(core);

      const shell = new THREE.LineSegments(
        new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(1.78, 3), 1),
        new THREE.LineBasicMaterial({ color: 0x9184d9, transparent: true, opacity: 0.5 })
      );
      root.add(shell);

      const cage = new THREE.LineSegments(
        new THREE.WireframeGeometry(new THREE.SphereGeometry(1.72, 20, 12)),
        new THREE.LineBasicMaterial({ color: 0x5d5294, transparent: true, opacity: 0.4 })
      );
      root.add(cage);

      const ringMat = new THREE.MeshBasicMaterial({ color: 0x796cbf, transparent: true, opacity: 0.55 });
      const ringA = new THREE.Mesh(new THREE.TorusGeometry(2.5, 0.008, 8, 160), ringMat);
      ringA.rotation.x = Math.PI / 2.15;
      root.add(ringA);
      const ringB = new THREE.Mesh(new THREE.TorusGeometry(2.9, 0.006, 8, 160), ringMat);
      ringB.rotation.set(Math.PI / 1.7, 0.4, 0.6);
      root.add(ringB);

      const sats = [];
      const satMat = new THREE.MeshStandardMaterial({ color: 0xd2cefd, emissive: 0x9184d9, emissiveIntensity: 0.7, roughness: 0.4 });
      for (let i = 0; i < 5; i++) {
        const s = new THREE.Mesh(new THREE.SphereGeometry(0.062, 16, 16), satMat);
        const holder = new THREE.Group();
        holder.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
        s.position.x = 2.5 + Math.random() * 0.42;
        holder.add(s);
        root.add(holder);
        sats.push({ holder, speed: 0.14 + Math.random() * 0.22 });
      }

      scene.add(new THREE.AmbientLight(0xb5abfc, 0.7));
      const key = new THREE.DirectionalLight(0xd2cefd, 1.5);
      key.position.set(3, 4, 5);
      scene.add(key);
      const rim = new THREE.DirectionalLight(0x796cbf, 1.1);
      rim.position.set(-4, -2, -3);
      scene.add(rim);

      const resize = () => {
        const r = this.getBoundingClientRect();
        const rw = Math.max(1, r.width), rh = Math.max(1, r.height);
        renderer.setSize(rw, rh, false);
        camera.aspect = rw / rh;
        camera.updateProjectionMatrix();
      };
      resize();
      this._ro = new ResizeObserver(() => {
        cancelAnimationFrame(this._rz);
        this._rz = requestAnimationFrame(resize);
      });
      this._ro.observe(this);

      let mx = 0, my = 0;
      this._move = (e) => {
        const r = this.getBoundingClientRect();
        mx = ((e.clientX - r.left) / r.width - 0.5) * 0.5;
        my = ((e.clientY - r.top) / r.height - 0.5) * 0.32;
      };
      this.addEventListener('pointermove', this._move);

      const clock = new THREE.Clock();
      let raf = 0;
      const tick = () => {
        const t = clock.getElapsedTime();
        root.rotation.y = t * 0.16 + mx;
        root.rotation.x = Math.sin(t * 0.22) * 0.09 + my;
        ringA.rotation.z = t * 0.1;
        ringB.rotation.z = -t * 0.07;
        sats.forEach((s, i) => { s.holder.rotation.y = t * s.speed + i; });
        renderer.render(scene, camera);
        raf = requestAnimationFrame(tick);
      };
      tick();
      this._stop = () => { cancelAnimationFrame(raf); renderer.dispose(); };
    }
    disconnectedCallback() {
      if (this._stop) this._stop();
      if (this._ro) this._ro.disconnect();
      cancelAnimationFrame(this._rz);
      if (this._move) this.removeEventListener('pointermove', this._move);
    }
  });
}
