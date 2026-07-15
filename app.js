/* ═══════════════════════════════════════════════
   SENSER Homepage — Modern Interactive JS
   ═══════════════════════════════════════════════ */

(function () {
  'use strict';

  // ─── Nav scroll behavior ───
  var nav = document.getElementById('nav');
  var navToggle = document.getElementById('navToggle');
  var navLinks = document.getElementById('navLinks');

  function updateNav() {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  }

  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav();

  navToggle.addEventListener('click', function () {
    navToggle.classList.toggle('open');
    navLinks.classList.toggle('open');
  });

  navLinks.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      navToggle.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });

  // ─── Badge typing animation ───
  var badgeTyped = document.querySelector('.badge-typed');
  if (badgeTyped) {
    var badgeText = 'KI-Beratung & Automatisierung in der Region Schwaben';
    var charIndex = 0;
    function typeNext() {
      if (charIndex <= badgeText.length) {
        badgeTyped.textContent = badgeText.slice(0, charIndex);
        charIndex++;
        setTimeout(typeNext, 55);
      }
    }
    setTimeout(typeNext, 600);
  }

  // ─── Scroll reveal with IntersectionObserver ───
  var revealEls = document.querySelectorAll('[data-reveal]');

  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var el = entry.target;
          var delay = parseInt(el.getAttribute('data-delay') || '0', 10);
          setTimeout(function () {
            el.classList.add('revealed');
          }, delay);
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add('revealed');
    });
  }

  // ─── Hero Canvas — Converging Flow-Linien ───
  var canvas = document.getElementById('heroCanvas');
  if (canvas) {
    var ctx = canvas.getContext('2d');
    var dpr = window.devicePixelRatio || 1;
    var GOLD = '217, 138, 43';
    var CREAM = '251, 250, 246';
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var w = 0, h = 0, traces = [];
    var convergeX, convergeY;
    var glowPhase = 0;

    function polyLen(p) {
      var L = 0;
      for (var i = 1; i < p.length; i++) {
        L += Math.hypot(p[i].x - p[i - 1].x, p[i].y - p[i - 1].y);
      }
      return L;
    }

    function pointAt(p, t) {
      var target = polyLen(p) * t, acc = 0;
      for (var i = 1; i < p.length; i++) {
        var seg = Math.hypot(p[i].x - p[i - 1].x, p[i].y - p[i - 1].y);
        if (acc + seg >= target) {
          var f = seg ? (target - acc) / seg : 0;
          return {
            x: p[i - 1].x + (p[i].x - p[i - 1].x) * f,
            y: p[i - 1].y + (p[i].y - p[i - 1].y) * f
          };
        }
        acc += seg;
      }
      return p[p.length - 1];
    }

    function buildTraces() {
      var rect = canvas.parentElement.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Convergence point — right side, vertically centered
      convergeX = w * 0.82;
      convergeY = h * 0.5;

      // Disable on mobile
      if (w < 768) {
        traces = [];
        return;
      }

      // Fixed trace definitions (relative to w/h)
      var traceDefs = [
        { y: 0.18, bendX: 0.68, jogs: [{ atX: 0.18, size: -30 }, { atX: 0.38, size: 22 }], alpha: 0.22,
          dots: [{ pos: 0.1, size: 2.0, alpha: 0.55, speedMul: 0.7 }, { pos: 0.5, size: 3.5, alpha: 0.65, speedMul: 0.9 }, { pos: 0.8, size: 1.8, alpha: 0.5, speedMul: 1.1 }] },
        { y: 0.25, bendX: 0.60, jogs: [{ atX: 0.30, size: 25 }], alpha: 0.18,
          dots: [{ pos: 0.2, size: 3.0, alpha: 0.6, speedMul: 0.8 }, { pos: 0.6, size: 1.5, alpha: 0.45, speedMul: 1.3 }, { pos: 0.9, size: 2.5, alpha: 0.55, speedMul: 0.6 }] },
        { y: 0.45, bendX: 0.56, jogs: [{ atX: 0.14, size: -20 }, { atX: 0.32, size: 35 }, { atX: 0.48, size: -15 }], alpha: 0.25,
          dots: [{ pos: 0.0, size: 2.5, alpha: 0.6, speedMul: 1.0 }, { pos: 0.4, size: 4.0, alpha: 0.7, speedMul: 0.7 }, { pos: 0.7, size: 1.8, alpha: 0.45, speedMul: 1.2 }] },
        { y: 0.58, bendX: 0.62, jogs: [{ atX: 0.25, size: 28 }], alpha: 0.20,
          dots: [{ pos: 0.15, size: 3.0, alpha: 0.55, speedMul: 1.1 }, { pos: 0.55, size: 2.0, alpha: 0.5, speedMul: 0.65 }, { pos: 0.85, size: 3.5, alpha: 0.65, speedMul: 0.9 }] },
        { y: 0.75, bendX: 0.57, jogs: [{ atX: 0.20, size: -35 }, { atX: 0.42, size: 18 }], alpha: 0.23,
          dots: [{ pos: 0.3, size: 1.8, alpha: 0.45, speedMul: 1.4 }, { pos: 0.6, size: 3.5, alpha: 0.65, speedMul: 0.75 }, { pos: 0.9, size: 2.2, alpha: 0.5, speedMul: 1.0 }] },
        { y: 0.88, bendX: 0.59, jogs: [{ atX: 0.15, size: 20 }, { atX: 0.35, size: -28 }], alpha: 0.17,
          dots: [{ pos: 0.05, size: 3.5, alpha: 0.65, speedMul: 0.8 }, { pos: 0.45, size: 2.0, alpha: 0.5, speedMul: 1.2 }, { pos: 0.75, size: 2.8, alpha: 0.55, speedMul: 0.65 }] }
      ];

      traces = [];
      for (var i = 0; i < traceDefs.length; i++) {
        var def = traceDefs[i];
        var startY = h * def.y;
        var bx = w * def.bendX;
        var pts = [{ x: -20, y: startY }];
        var curY = startY;
        for (var j = 0; j < def.jogs.length; j++) {
          var jog = def.jogs[j];
          var jogAtX = w * jog.atX;
          pts.push({ x: jogAtX, y: curY });
          curY += jog.size;
          pts.push({ x: jogAtX + 25, y: curY });
        }
        pts.push({ x: bx, y: curY });
        pts.push({ x: convergeX, y: convergeY });

        var dots = [];
        for (var d = 0; d < def.dots.length; d++) {
          dots.push({
            pos: def.dots[d].pos,
            size: def.dots[d].size,
            alpha: def.dots[d].alpha,
            speedMul: def.dots[d].speedMul
          });
        }
        traces.push({
          pts: pts,
          speed: 0.001,
          alpha: def.alpha,
          dots: dots
        });
      }
    }

    function drawTraces() {
      ctx.clearRect(0, 0, w, h);
      glowPhase += 0.015;

      // Draw traces
      for (var i = 0; i < traces.length; i++) {
        var tr = traces[i], p = tr.pts;

        // Leiterbahn
        ctx.beginPath();
        ctx.moveTo(p[0].x, p[0].y);
        for (var k = 1; k < p.length; k++) ctx.lineTo(p[k].x, p[k].y);
        ctx.strokeStyle = 'rgba(' + GOLD + ',' + tr.alpha + ')';
        ctx.lineWidth = 1.8;
        ctx.stroke();

        // Start-Knoten (kleine Punkte links)
        ctx.beginPath();
        ctx.arc(p[0].x + 20, p[0].y, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(' + GOLD + ',0.4)';
        ctx.fill();

        // Wandernde Punkte — unabhängig voneinander
        if (!reduce) {
          for (var d = 0; d < tr.dots.length; d++) {
            var dot = tr.dots[d];
            dot.pos += tr.speed * dot.speedMul;
            if (dot.pos > 1) dot.pos -= 1;
            var pt = pointAt(p, dot.pos);
            ctx.beginPath();
            ctx.arc(pt.x, pt.y, dot.size, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(' + GOLD + ',' + dot.alpha + ')';
            ctx.fill();
          }
        }
      }

      // Convergence point — large pulsating glow
      var glowSize = 0.75 + Math.sin(glowPhase) * 0.25;
      var glowSize2 = 0.8 + Math.sin(glowPhase * 1.3 + 1) * 0.2;

      // Far outer halo
      var farGlow = ctx.createRadialGradient(
        convergeX, convergeY, 0,
        convergeX, convergeY, 90 * glowSize
      );
      farGlow.addColorStop(0, 'rgba(' + GOLD + ',0.15)');
      farGlow.addColorStop(0.4, 'rgba(' + GOLD + ',0.06)');
      farGlow.addColorStop(1, 'rgba(' + GOLD + ',0)');
      ctx.beginPath();
      ctx.arc(convergeX, convergeY, 90 * glowSize, 0, Math.PI * 2);
      ctx.fillStyle = farGlow;
      ctx.fill();

      // Mid glow ring
      var midGlow = ctx.createRadialGradient(
        convergeX, convergeY, 0,
        convergeX, convergeY, 45 * glowSize2
      );
      midGlow.addColorStop(0, 'rgba(' + GOLD + ',0.35)');
      midGlow.addColorStop(0.5, 'rgba(' + GOLD + ',0.12)');
      midGlow.addColorStop(1, 'rgba(' + GOLD + ',0)');
      ctx.beginPath();
      ctx.arc(convergeX, convergeY, 45 * glowSize2, 0, Math.PI * 2);
      ctx.fillStyle = midGlow;
      ctx.fill();

      // Inner bright core
      var innerGlow = ctx.createRadialGradient(
        convergeX, convergeY, 0,
        convergeX, convergeY, 14
      );
      innerGlow.addColorStop(0, 'rgba(' + CREAM + ',0.95)');
      innerGlow.addColorStop(0.3, 'rgba(' + GOLD + ',0.9)');
      innerGlow.addColorStop(0.7, 'rgba(' + GOLD + ',0.3)');
      innerGlow.addColorStop(1, 'rgba(' + GOLD + ',0)');
      ctx.beginPath();
      ctx.arc(convergeX, convergeY, 14, 0, Math.PI * 2);
      ctx.fillStyle = innerGlow;
      ctx.fill();

      // Bright core dot
      ctx.beginPath();
      ctx.arc(convergeX, convergeY, 5, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(' + CREAM + ',1)';
      ctx.fill();

      requestAnimationFrame(drawTraces);
    }

    buildTraces();
    window.addEventListener('resize', buildTraces);
    drawTraces();
  }

  // ─── Flow Process Animation ───
  var flow = document.getElementById('flow');
  if (flow) {
    var steps  = Array.from(flow.querySelectorAll('.step'));
    var fnodes = steps.map(function(s) { return s.querySelector('.node'); });
    var fill   = flow.querySelector('.rail-fill');
    var pulse  = flow.querySelector('.rail-pulse');
    var rbase  = flow.querySelector('.rail-base');
    var replayBtn = document.getElementById('replay');
    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var D = 3200;
    var flowTimers = [];
    var centers = [];

    function measureFlow() {
      var fr = flow.getBoundingClientRect();
      centers = fnodes.map(function(n) {
        var r = n.getBoundingClientRect();
        return (r.top - fr.top) + r.height / 2;
      });
      var top = centers[0];
      var h = centers[centers.length - 1] - centers[0];
      rbase.style.top = top + 'px';
      rbase.style.height = h + 'px';
      fill.style.top = top + 'px';
      pulse.style.top = top + 'px';
      return { top: top, h: h };
    }

    function resetFlow() {
      flowTimers.forEach(clearTimeout);
      flowTimers = [];
      steps.forEach(function(s) { s.classList.remove('is-active'); });
      fill.style.transition = 'none';
      pulse.style.transition = 'none';
      var m = measureFlow();
      fill.style.height = '0px';
      pulse.style.top = m.top + 'px';
      pulse.style.opacity = '0';
      void flow.offsetWidth;
      return m;
    }

    function playFlow() {
      if (reduceMotion) {
        var m = measureFlow();
        fill.style.transition = 'none';
        fill.style.height = m.h + 'px';
        steps.forEach(function(s) { s.classList.add('is-active'); });
        return;
      }
      var m = resetFlow();
      fill.style.transition = '';
      pulse.style.transition = '';
      requestAnimationFrame(function() {
        fill.style.height = m.h + 'px';
        pulse.style.top = (m.top + m.h) + 'px';
        pulse.style.opacity = '1';
      });
      steps.forEach(function(s, i) {
        var f = m.h ? (centers[i] - centers[0]) / m.h : 0;
        flowTimers.push(setTimeout(function() { s.classList.add('is-active'); }, Math.round(f * D)));
      });
      flowTimers.push(setTimeout(function() { pulse.style.opacity = '0'; }, D + 200));
    }

    var flowPlayed = false;
    var flowObserver = new IntersectionObserver(function(entries) {
      entries.forEach(function(e) {
        if (e.isIntersecting && !flowPlayed) {
          flowPlayed = true;
          playFlow();
        }
      });
    }, { threshold: 0.4 });
    flowObserver.observe(flow);

    if (replayBtn) {
      replayBtn.addEventListener('click', playFlow);
    }

    var flowResizeTimer;
    window.addEventListener('resize', function() {
      clearTimeout(flowResizeTimer);
      flowResizeTimer = setTimeout(function() { if (flowPlayed) measureFlow(); }, 150);
    });
  }

  // ─── Smooth scroll for anchor links ───
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var href = this.getAttribute('href');
      if (href === '#') return;
      var target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

})();
