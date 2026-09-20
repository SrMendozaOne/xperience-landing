/**
 * Xperience Tech & Analytics - Main Application Logic
 * Includes Three.js Background, GSAP Animations, UI Interactions, and 3D Carousel
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Icons
  lucide.createIcons();

  // 2. Set Current Year in Footer
  document.getElementById('year').textContent = new Date().getFullYear();

  // 3. Theme Toggle Logic
  initThemeToggle();

  // 4. Mobile Navigation & ScrollSpy
  initMobileNav();

  // 5. Tabs Logic (Before/After)
  initTabs();

  // 6. GSAP Animations & Carousel
  initGSAP();
  initCarousel();

  // 7. Three.js Scene
  initThreeJS();

  // 8. Form Handling
  initForm();
});

/* ==========================================================================
   THEME TOGGLE
   ========================================================================== */
function initThemeToggle() {
  const toggleBtn = document.getElementById('theme-toggle');
  const root = document.documentElement;

  const savedTheme = localStorage.getItem('xperience-theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  if (savedTheme) {
    root.setAttribute('data-theme', savedTheme);
  } else if (prefersDark) {
    root.setAttribute('data-theme', 'dark');
  } else {
    root.setAttribute('data-theme', 'light');
  }

  toggleBtn.addEventListener('click', () => {
    const currentTheme = root.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', newTheme);
    localStorage.setItem('xperience-theme', newTheme);
  });
}

/* ==========================================================================
   MOBILE NAVIGATION & SCROLLSPY
   ========================================================================== */
function initMobileNav() {
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  const header = document.getElementById('site-header');
  const navLinks = document.querySelectorAll('.nav-link');

  navToggle.addEventListener('click', () => {
    const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', !isExpanded);
    navMenu.classList.toggle('is-active');
  });

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navToggle.setAttribute('aria-expanded', 'false');
      navMenu.classList.remove('is-active');
    });
  });

  // Header scroll effect and ScrollSpy
  const sections = document.querySelectorAll('section');
  
  window.addEventListener('scroll', () => {
    let current = '';
    
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (scrollY >= (sectionTop - 200)) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href').includes(current)) {
        link.classList.add('active');
      }
    });
  }, { passive: true });
}

/* ==========================================================================
   TABS LOGIC (BEFORE / AFTER)
   ========================================================================== */
function initTabs() {
  const tabBtns = document.querySelectorAll('.tab-btn');
  const panels = document.querySelectorAll('.panel');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const targetId = btn.getAttribute('data-target');
      document.getElementById(targetId).classList.add('active');
    });
  });
}

/* ==========================================================================
   GSAP ANIMATIONS & CAROUSEL
   ========================================================================== */
function initGSAP() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);

  // Hero Reveals
  gsap.fromTo(".gs-reveal", 
    { y: 30, opacity: 0 },
    { y: 0, opacity: 1, duration: 1, stagger: 0.2, ease: "power3.out", delay: 0.2 }
  );

  // Scroll Reveal Up
  const revealElements = document.querySelectorAll('.gs-reveal-up');
  revealElements.forEach((el) => {
    gsap.fromTo(el,
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
          toggleActions: "play none none reverse"
        }
      }
    );
  });

  // Triad Connections Path Drawing
  const paths = document.querySelectorAll('.triad-path');
  if (paths.length > 0) {
    paths.forEach(path => {
      const length = path.getTotalLength();
      gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
      gsap.to(path, {
        strokeDashoffset: 0,
        duration: 2,
        ease: "power2.inOut",
        scrollTrigger: {
          trigger: ".triad-container",
          start: "top 60%",
          end: "bottom 80%",
          scrub: 1
        }
      });
    });
  }

  // Magnetic Buttons
  const magneticBtns = document.querySelectorAll('.btn-magnetic');
  magneticBtns.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      
      gsap.to(btn, { x: x * 0.3, y: y * 0.3, duration: 0.3, ease: "power2.out" });
    });

    btn.addEventListener('mouseleave', () => {
      gsap.to(btn, { x: 0, y: 0, duration: 0.7, ease: "elastic.out(1, 0.3)" });
    });
  });

  // 3D Tilt Card Effect (Hero)
  const tiltCard = document.querySelector('[class~="3d-tilt-card"]');
  if (tiltCard) {
    document.addEventListener('mousemove', (e) => {
      const xAxis = (window.innerWidth / 2 - e.pageX) / 25;
      const yAxis = (window.innerHeight / 2 - e.pageY) / 25;
      gsap.to(tiltCard, { rotationY: xAxis, rotationX: yAxis, duration: 0.5, ease: "power1.out" });
    });
  }
}

function initCarousel() {
  if (typeof gsap === 'undefined' || typeof Draggable === 'undefined') return;
  gsap.registerPlugin(Draggable);

  const container = document.getElementById('software-carousel');
  const items = [...document.querySelectorAll('.carousel-item')];
  const prevBtn = document.getElementById('prev-slide');
  const nextBtn = document.getElementById('next-slide');
  const dotsContainer = document.getElementById('carousel-dots');
  
  if (!container || items.length === 0) return;

  const totalItems = items.length;

  const firstClone = items[0].cloneNode(true);
  const lastClone = items[totalItems - 1].cloneNode(true);
  firstClone.classList.add('carousel-clone');
  lastClone.classList.add('carousel-clone');
  container.appendChild(firstClone);
  container.insertBefore(lastClone, container.firstChild);
  const allItems = [...container.querySelectorAll('.carousel-item')];
  let currentIndex = 1;

  const getItemWidth = () => allItems[0].getBoundingClientRect().width + 14;

  // Create dots
  items.forEach((_, i) => {
    const dot = document.createElement('div');
    dot.classList.add('dot');
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goToSlide(i));
    dotsContainer.appendChild(dot);
  });
  const dots = document.querySelectorAll('.dot');

  // GSAP 3D Effect on scroll/drag
  function update3DEffects() {
    let closestItem = null;
    let closestDistance = Infinity;

    allItems.forEach((item) => {
      // Calculate distance from center of viewport
      const rect = item.getBoundingClientRect();
      const center = rect.left + rect.width / 2;
      const windowCenter = window.innerWidth / 2;
      const dist = center - windowCenter;
      const absoluteDist = Math.abs(dist);

      if (absoluteDist < closestDistance) {
        closestDistance = absoluteDist;
        closestItem = item;
      }
      
      const normalizedDist = Math.max(-1, Math.min(1, dist / windowCenter));
      
      gsap.to(item, {
        rotationY: normalizedDist * 15,
        z: Math.abs(normalizedDist) * -100,
        scale: 1 - Math.abs(normalizedDist) * 0.1,
        opacity: 1 - Math.abs(normalizedDist) * 0.3,
        duration: 0.5,
        ease: "power2.out"
      });
    });

    allItems.forEach(item => item.classList.toggle('active', item === closestItem));
  }

  function setDots(logicalIndex) {
    dots.forEach((dot, i) => dot.classList.toggle('active', i === logicalIndex));
  }

  function goToPhysicalSlide(index, animate = true) {
    currentIndex = index;
    const finish = () => {
      if (currentIndex === 0) {
        currentIndex = totalItems;
        gsap.set(container, { x: -(currentIndex * getItemWidth()) });
      } else if (currentIndex === totalItems + 1) {
        currentIndex = 1;
        gsap.set(container, { x: -getItemWidth() });
      }
      setDots((currentIndex - 1 + totalItems) % totalItems);
      update3DEffects();
    };

    gsap.to(container, {
      x: -currentIndex * getItemWidth(),
      duration: animate ? 0.65 : 0,
      ease: "power3.inOut",
      onUpdate: update3DEffects,
      onComplete: finish
    });
  }

  function goToSlide(index) {
    const logicalIndex = (index + totalItems) % totalItems;
    goToPhysicalSlide(logicalIndex + 1);
  }

  function getLogicalIndex() {
    return (currentIndex - 1 + totalItems) % totalItems;
  }

  // Draggable integration
  Draggable.create(container, {
    type: "x",
    inertia: true,
    onDrag: update3DEffects,
    onThrowUpdate: update3DEffects,
    onDragEnd: function() {
      const closest = Math.round(Math.abs(this.x) / getItemWidth());
      const logicalIndex = (closest - 1 + totalItems) % totalItems;
      goToPhysicalSlide(logicalIndex + 1);
    }
  });

  // Buttons
  prevBtn.addEventListener('click', () => goToSlide(getLogicalIndex() - 1));
  nextBtn.addEventListener('click', () => goToSlide(getLogicalIndex() + 1));

  // Initial call
  update3DEffects();

  // Handle Resize
  window.addEventListener('resize', () => {
    // Recalculate itemWidth on resize if needed (responsive CSS might change it)
    // Simplified for this scope, ideally debounced
    goToPhysicalSlide(currentIndex, false);
  });

  goToPhysicalSlide(currentIndex, false);
}

/* ==========================================================================
   THREE.JS SCENE (DATA NODES BACKGROUND)
   ========================================================================== */
function initThreeJS() {
  if (typeof THREE === 'undefined') return;

  const canvas = document.getElementById('webgl-canvas');
  if (!canvas) return;

  const hero = canvas.closest('.hero');
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(52, 1, 0.1, 100);
  camera.position.z = 24;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setClearColor(0x000000, 0);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const nodeCount = 100;
  const nodes = Array.from({ length: nodeCount }, () => new THREE.Vector3(
    (Math.random() - 0.5) * 35,
    (Math.random() - 0.5) * 17,
    (Math.random() - 0.5) * 13
  ));
  const positions = new Float32Array(nodeCount * 3);
  nodes.forEach((node, index) => node.toArray(positions, index * 3));

  const nodeGeometry = new THREE.BufferGeometry();
  nodeGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const nodeMaterial = new THREE.PointsMaterial({
    color: 0xffffff, size: 0.16, transparent: true, opacity: 0.24,
    blending: THREE.AdditiveBlending, depthWrite: false, sizeAttenuation: true
  });
  const nodeMesh = new THREE.Points(nodeGeometry, nodeMaterial);
  scene.add(nodeMesh);

  const edgePositions = [];
  nodes.forEach((node, index) => {
    nodes
      .map((candidate, candidateIndex) => ({ candidate, candidateIndex, distance: node.distanceTo(candidate) }))
      .filter(({ candidateIndex, distance }) => candidateIndex > index && distance < 6.5)
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 3)
      .forEach(({ candidate }) => edgePositions.push(node.x, node.y, node.z, candidate.x, candidate.y, candidate.z));
  });
  const edgeGeometry = new THREE.BufferGeometry();
  edgeGeometry.setAttribute('position', new THREE.Float32BufferAttribute(edgePositions, 3));
  scene.add(new THREE.LineSegments(edgeGeometry, new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.07 })));

  const pulseCount = 18;
  const pulses = Array.from({ length: pulseCount }, () => {
    const start = Math.floor(Math.random() * nodeCount);
    let end = Math.floor(Math.random() * nodeCount);
    while (end === start || nodes[start].distanceTo(nodes[end]) > 6.5) end = Math.floor(Math.random() * nodeCount);
    return { start, end, progress: Math.random(), speed: 0.08 + Math.random() * 0.12 };
  });
  const pulseGeometry = new THREE.BufferGeometry();
  const pulsePositions = new Float32Array(pulseCount * 3);
  pulseGeometry.setAttribute('position', new THREE.BufferAttribute(pulsePositions, 3));
  scene.add(new THREE.Points(pulseGeometry, new THREE.PointsMaterial({ color: 0xffffff, size: 0.28, transparent: true, opacity: 0.8, blending: THREE.AdditiveBlending, depthWrite: false })));

  let mouseX = 0;
  let mouseY = 0;

  window.addEventListener('pointermove', (e) => {
    mouseX = (e.clientX / window.innerWidth) - 0.5;
    mouseY = (e.clientY / window.innerHeight) - 0.5;
  });

  const clock = new THREE.Clock();

  function tick() {
    const elapsedTime = clock.getElapsedTime();

    nodeMesh.rotation.y = elapsedTime * 0.012;
    nodeMesh.rotation.x = elapsedTime * 0.006;
    nodeMesh.position.z = Math.sin(elapsedTime * 0.25) * 0.6;
    camera.position.x += (mouseX * 2.2 - camera.position.x) * 0.035;
    camera.position.y += (-mouseY * 1.3 - camera.position.y) * 0.035;
    camera.lookAt(scene.position);

    const pulseAttribute = pulseGeometry.attributes.position;
    pulses.forEach((pulse, index) => {
      pulse.progress = (pulse.progress + pulse.speed * 0.016) % 1;
      pulseAttribute.setXYZ(index, ...nodes[pulse.start].clone().lerp(nodes[pulse.end], pulse.progress).toArray());
    });
    pulseAttribute.needsUpdate = true;

    renderer.render(scene, camera);
    requestAnimationFrame(tick);
  }

  tick();

  window.addEventListener('resize', () => {
    const width = hero.clientWidth;
    const height = hero.clientHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height, false);
  });

  window.dispatchEvent(new Event('resize'));
}

/* ==========================================================================
   FORM HANDLING
   ========================================================================== */
function initForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const originalText = btn.textContent;
    
    btn.innerHTML = '<i data-lucide="loader" class="spin"></i> Enviando...';
    lucide.createIcons();
    btn.style.opacity = '0.8';
    btn.disabled = true;

    setTimeout(() => {
      btn.innerHTML = '<i data-lucide="check"></i> ¡Solicitud Enviada!';
      btn.classList.add('bg-success');
      lucide.createIcons();
      form.reset();

      setTimeout(() => {
        btn.innerHTML = originalText;
        btn.disabled = false;
        btn.style.opacity = '1';
        btn.classList.remove('bg-success');
      }, 3000);
    }, 1500);
  });
}
