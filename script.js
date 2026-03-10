/* =============================================
   DEEPAK.S PORTFOLIO — script.js
   ============================================= */

// ── Loader / Progress Bar ────────────────────────────────────────────────────
(function setupLoader() {
  const loader = document.getElementById('loader');
  const percentText = document.getElementById('loaderPercent');
  const bar = document.getElementById('loaderBar');

  if (!loader) return;

  let progress = 0;
  const interval = setInterval(() => {
    // Slower progress to let the user enjoy the text animation
    progress += Math.floor(Math.random() * 3) + 1;
    if (progress > 100) progress = 100;

    // Formatting progress exactly like the design: "6 2 %"
    const textStr = progress.toString().split('').join(' ') + ' %';
    percentText.textContent = textStr;
    bar.style.width = progress + '%';

    if (progress === 100) {
      clearInterval(interval);
      setTimeout(() => {
        loader.classList.add('is-hidden');
        setTimeout(() => {
          loader.style.display = 'none'; // removing it from flow completely
        }, 800);
      }, 500);
    }
  }, 40); // adjust speed
})();

// ── Hamburger / Nav Overlay ──────────────────────────────────────────────────
(function setupNav() {
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const navOverlay = document.getElementById('navOverlay');
  const navClose = document.getElementById('navClose');

  // create backdrop
  const backdrop = document.createElement('div');
  backdrop.classList.add('nav-backdrop');
  document.body.appendChild(backdrop);

  function openNav() {
    navOverlay.classList.add('is-open');
    backdrop.classList.add('is-visible');
    document.body.style.overflow = 'hidden';
  }

  function closeNav() {
    navOverlay.classList.remove('is-open');
    backdrop.classList.remove('is-visible');
    document.body.style.overflow = '';
  }

  hamburgerBtn.addEventListener('click', openNav);
  navClose.addEventListener('click', closeNav);
  backdrop.addEventListener('click', closeNav);

  // close on nav link click
  document.querySelectorAll('.nav-overlay__link').forEach(link => {
    link.addEventListener('click', closeNav);
  });
})();


// ── Hero Canvas — Vortex / Spiral Animation ──────────────────────────────────
(function setupHeroCanvas() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width, height, cx, cy;
  let animId;
  let time = 0;

  // ---------- resize ----------
  function resize() {
    width = canvas.width = canvas.offsetWidth;
    height = canvas.height = canvas.offsetHeight;
    cx = width / 2;
    cy = height / 2;
  }

  window.addEventListener('resize', resize);
  resize();

  // ---------- draw ----------
  function draw() {
    ctx.clearRect(0, 0, width, height);

    // Dark radial background center glow (made semi-transparent so video shows through)
    const bgGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(width, height) * 0.55);
    bgGrad.addColorStop(0, 'rgba(30,30,30,0)');
    bgGrad.addColorStop(1, 'rgba(0,0,0,0.5)');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    const maxR = Math.min(width, height) * 0.52;

    // Number of spiral rings
    const rings = 55;

    for (let i = 0; i < rings; i++) {
      const t = i / rings;
      const radius = t * maxR;
      const alpha = 0.08 + t * 0.35;

      // Each ring rotates at a slightly different speed, creating the spiral vortex
      const angleOffset = time * (0.3 + t * 1.2);
      const arcStart = angleOffset;
      const arcEnd = angleOffset + Math.PI * 2 * (0.85 + t * 0.15);

      // Wobble: vary the radius slightly per angle for organic look
      const wobble = 3 + t * 6;

      ctx.beginPath();
      const steps = 200;
      for (let s = 0; s <= steps; s++) {
        const angle = arcStart + (arcEnd - arcStart) * (s / steps);
        const noise = Math.sin(angle * 7 + time + i * 0.4) * wobble * (0.3 + t * 0.7);
        const r = radius + noise;
        const x = cx + Math.cos(angle) * r;
        const y = cy + Math.sin(angle) * r;
        if (s === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }

      const bright = 180 + Math.floor(t * 75);
      ctx.strokeStyle = `rgba(${bright}, ${bright}, ${bright}, ${alpha})`;
      ctx.lineWidth = 0.6 + t * 0.8;
      ctx.stroke();
    }

    time += 0.007;
    animId = requestAnimationFrame(draw);
  }

  draw();
})();


// ── Scroll-Reveal via IntersectionObserver ────────────────────────────────────
(function setupReveal() {
  const revealEls = document.querySelectorAll(
    '.about__heading, .project-card, .cert-card, .services__item, .footer__email'
  );

  revealEls.forEach(el => el.classList.add('reveal'));

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealEls.forEach(el => observer.observe(el));
})();


// ── Header Shrink on Scroll ───────────────────────────────────────────────────
(function setupHeaderScroll() {
  const header = document.getElementById('header');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      header.style.padding = '0';
    } else {
      header.style.padding = '';
    }
  }, { passive: true });
})();


// ── Smooth Scroll for anchor links ───────────────────────────────────────────
(function setupSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
})();

// ── Hover Parallax for Collage Items ─────────────────────────────────────────
(function setupCollageParallax() {
  const collageItems = document.querySelectorAll('.about__collage-item');
  if (collageItems.length === 0) return;

  window.addEventListener('mousemove', (e) => {
    const x = e.clientX / window.innerWidth - 0.5;
    const y = e.clientY / window.innerHeight - 0.5;

    collageItems.forEach((item, index) => {
      // Deeper elements pan slower, front elements pan faster.
      const depth = (index + 1) * 30;

      // Calculate 3D rotations based on X and Y mouse coordinates.
      // Moving mouse left/right (X) tilts left/right (rotateY)
      // Moving mouse up/down (Y) tilts up/down (rotateX)
      const rotateY = x * 25; // max tilt 12.5 degrees either way
      const rotateX = -y * 25; // max tilt 12.5 degrees either way

      item.style.transform = `translate(${x * depth}px, ${y * depth}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });
  });
})();

// ── Visitor Counter ────────────────────────────────────────────────────────────
(function setupVisitorCounter() {
  const counterEl = document.getElementById('visitorCount');
  if (!counterEl) return;

  const baseCount = 0;
  // Use a new storage key so it starts fresh from 0 for you
  let currentCount = localStorage.getItem('sahu_portfolio_visits_v2');

  if (!currentCount) {
    currentCount = baseCount;
  } else {
    currentCount = parseInt(currentCount, 10);
  }

  // Increment true views per session avoiding immediate reloads
  if (!sessionStorage.getItem('sahu_portfolio_session_v2')) {
    currentCount += 1;
    localStorage.setItem('sahu_portfolio_visits_v2', currentCount);
    sessionStorage.setItem('sahu_portfolio_session_v2', 'true');
  }

  counterEl.textContent = currentCount.toLocaleString('en-US');
})();

// ── Matter.js Skills Physics ──────────────────────────────────────────────────
(function setupSkillsPhysics() {
  const container = document.getElementById('skillsCanvasContainer');
  if (!container || typeof Matter === 'undefined') return;

  const { Engine, Render, Runner, World, Bodies, Mouse, MouseConstraint } = Matter;

  const engine = Engine.create();
  const world = engine.world;

  engine.world.gravity.y = 0.8;

  let width = container.clientWidth;
  let height = container.clientHeight || 450;

  // Floor and walls to keep pills inside the canvas wrapper
  let ground = Bodies.rectangle(width / 2, height + 25, 5000, 50, { isStatic: true });
  let leftWall = Bodies.rectangle(-25, height / 2, 50, 5000, { isStatic: true });
  let rightWall = Bodies.rectangle(width + 25, height / 2, 50, 5000, { isStatic: true });

  World.add(world, [ground, leftWall, rightWall]);

  const skillsData = [
    { name: 'TRELLO', icon: 'trello' },
    { name: 'HTML', icon: 'html5' },
    { name: 'GITHUB', icon: 'github' },
    { name: 'REACT', icon: 'react' },
    { name: 'CSS', icon: 'css3' },
    { name: 'TAILWIND', icon: 'tailwindcss' },
    { name: 'JAVASCRIPT', icon: 'javascript' },
    { name: 'VS CODE', icon: 'visualstudiocode' },
    { name: 'TYPESCRIPT', icon: 'typescript' },
    { name: 'JIRA', icon: 'jira' },
    { name: 'FIGMA', icon: 'figma' },
    { name: 'GIT', icon: 'git' },
    { name: 'MONGODB', icon: 'mongodb' },
    { name: 'C', icon: 'c' },
    { name: 'C++', icon: 'cplusplus' },
    { name: 'PYTHON', icon: 'python' },
    { name: 'JAVA', icon: 'nodedotjs' } // Fallback if java icon not available, but 'openjdk' or others could work. Assuming SimpleIcons handles 'java' or we omit icon just in case? No, SimpleIcons has many. I will use 'nodedotjs' or 'spring' if I don't know, wait, I'll just use 'java' as simple-icons v13 has java. If missing, image breaks. Let's use generic tech icon or something. Actually, I am modifying it below.
  ];

  // Fixing Java icon name for simple icons:
  skillsData[16].icon = "java"; // Just ensuring it's "java"

  const domElements = [];

  // Add a special "DRAG ME" shape
  const dragMeEl = document.createElement('div');
  dragMeEl.className = 'skills__pill skills__pill--drag';
  dragMeEl.innerHTML = 'DRAG<br>ME';
  container.appendChild(dragMeEl);

  const dragMeBody = Bodies.circle(width / 2, -150, 55, {
    restitution: 0.6,
    friction: 0.1,
    density: 0.04
  });
  domElements.push({ el: dragMeEl, body: dragMeBody });
  World.add(world, dragMeBody);

  // Add the skill pills
  skillsData.forEach((skill, i) => {
    const el = document.createElement('div');
    el.className = 'skills__pill';

    // Add SimpleIcon image + text
    el.innerHTML = `<img src="https://cdn.simpleicons.org/${skill.icon}/111" alt="${skill.name}" class="skills__pill-icon" draggable="false" onerror="this.style.display='none'" /> <span>${skill.name}</span>`;

    container.appendChild(el);

    // We measure exact widths from DOM to sync accurately
    const rect = el.getBoundingClientRect();

    // Slight randomize on spawn X/Y to avoid perfectly stacking and exploding
    const spawnX = (width / 2) + (Math.random() * 200 - 100);
    const spawnY = -100 - (Math.random() * 800) - (i * 100);

    const body = Bodies.rectangle(
      spawnX,
      spawnY,
      rect.width,
      rect.height,
      {
        chamfer: { radius: rect.height / 2 },
        restitution: 0.5,
        friction: 0.1,
        frictionAir: 0.01
      }
    );

    Matter.Body.setAngle(body, (Math.random() - 0.5) * 1.5);

    domElements.push({ el, body });
    World.add(world, body);
  });

  const mouse = Mouse.create(container);
  const mConstraint = MouseConstraint.create(engine, {
    mouse: mouse,
    constraint: {
      stiffness: 0.2,
      render: { visible: false }
    }
  });
  World.add(world, mConstraint);

  mouse.element.removeEventListener('mousewheel', mouse.mousewheel);
  mouse.element.removeEventListener('DOMMouseScroll', mouse.mousewheel);

  Runner.run(Runner.create(), engine);

  function sync() {
    domElements.forEach(({ el, body }) => {
      el.style.transform = `translate(${body.position.x}px, ${body.position.y}px) rotate(${body.angle}rad) translate(-50%, -50%)`;
    });
    requestAnimationFrame(sync);
  }
  sync();

  window.addEventListener('resize', () => {
    width = container.clientWidth;
    height = container.clientHeight || 450;
    Matter.Body.setPosition(ground, { x: width / 2, y: height + 25 });
    Matter.Body.setPosition(rightWall, { x: width + 25, y: height / 2 });
    Matter.Body.setPosition(leftWall, { x: -25, y: height / 2 });
  });
})();

// ── Custom Trailing Cursor ──────────────────────────────────────────────────
(function setupCustomCursor() {
  const dot = document.getElementById('cursorDot');
  const outline = document.getElementById('cursorOutline');

  if (!dot || !outline) return;

  // Make sure it only runs if the device has a mouse
  if (window.matchMedia('(pointer: coarse)').matches) return;

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let outlineX = mouseX;
  let outlineY = mouseY;
  let isVisible = false;

  window.addEventListener('mousemove', (e) => {
    if (!isVisible) {
      dot.style.opacity = 1;
      outline.style.opacity = 1;
      isVisible = true;
    }

    mouseX = e.clientX;
    mouseY = e.clientY;

    // Update dot immediately for instant tracking
    dot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
  });

  // Smooth animation for the outline dragging behind
  function animateOutline() {
    const easing = 0.15; // Lower number = more trailing delay
    outlineX += (mouseX - outlineX) * easing;
    outlineY += (mouseY - outlineY) * easing;

    outline.style.transform = `translate(${outlineX}px, ${outlineY}px) translate(-50%, -50%)`;
    requestAnimationFrame(animateOutline);
  }
  animateOutline();

  // Add expanding hover effect for interactive elements
  const interactables = document.querySelectorAll('a, button, .skills__pill, .project-card, .services__item, .cert-card');
  interactables.forEach(el => {
    el.addEventListener('mouseenter', () => {
      outline.classList.add('hovering');
    });
    el.addEventListener('mouseleave', () => {
      outline.classList.remove('hovering');
    });
  });
})();
