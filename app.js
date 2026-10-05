document.addEventListener("DOMContentLoaded", () => {
  if (window.lucide) lucide.createIcons();
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  initThemeToggle();
  initMobileNav();
  initTabs();
  initWhatsAppPlans();
  initForm();
  initHeroArrows();
  initAnimations();
});

function initThemeToggle() {
  const toggleBtn = document.getElementById("theme-toggle");
  const root = document.documentElement;
  if (!toggleBtn) return;

  toggleBtn.addEventListener("click", () => {
    const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    localStorage.setItem("xperience-theme", next);
  });
}

function initMobileNav() {
  const navToggle = document.getElementById("nav-toggle");
  const navMenu = document.getElementById("nav-menu");
  const header = document.getElementById("site-header");
  const navLinks = document.querySelectorAll(".nav-link");
  if (!navToggle || !navMenu) return;

  navToggle.addEventListener("click", () => {
    const open = navToggle.getAttribute("aria-expanded") === "true";
    navToggle.setAttribute("aria-expanded", String(!open));
    navMenu.classList.toggle("is-active");
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      navToggle.setAttribute("aria-expanded", "false");
      navMenu.classList.remove("is-active");
    });
  });

  const sections = document.querySelectorAll("section[id]");
  window.addEventListener("scroll", () => {
    if (header) header.classList.toggle("scrolled", window.scrollY > 40);

    let current = "home";
    sections.forEach((section) => {
      if (window.scrollY >= section.offsetTop - 180) current = section.id;
    });
    navLinks.forEach((link) => {
      link.classList.toggle("active", link.getAttribute("href") === `#${current}`);
    });
  }, { passive: true });
}

function initTabs() {
  const tabBtns = document.querySelectorAll(".tab-btn");
  const panels = document.querySelectorAll(".panel");
  tabBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      tabBtns.forEach((b) => b.classList.remove("active"));
      panels.forEach((p) => p.classList.remove("active"));
      btn.classList.add("active");
      document.getElementById(btn.dataset.target)?.classList.add("active");
    });
  });
}

function initWhatsAppPlans() {
  const phone = "573022482933";
  document.querySelectorAll(".wa-link").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const plan = link.dataset.plan || "";
      const text = encodeURIComponent(`Hola Xperience Tech, quiero información del plan ${plan}.`);
      window.open(`https://wa.me/${phone}?text=${text}`, "_blank", "noopener");
    });
  });
}

function initForm() {
  const form = document.getElementById("contactForm");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const originalText = btn.textContent;
    btn.disabled = true;
    btn.textContent = "Enviando...";
    setTimeout(() => {
      btn.textContent = "¡Solicitud enviada!";
      form.reset();
      setTimeout(() => {
        btn.textContent = originalText;
        btn.disabled = false;
      }, 2800);
    }, 900);
  });
}

function initHeroArrows() {
  const prev = document.getElementById("hero-prev");
  const next = document.getElementById("hero-next");
  const sections = ["#home", "#servicios", "#desarrollo", "#data", "#automatizaciones", "#planes", "#contacto"];
  let index = 0;
  const go = (dir) => {
    index = (index + dir + sections.length) % sections.length;
    document.querySelector(sections[index])?.scrollIntoView({ behavior: "smooth" });
  };
  prev?.addEventListener("click", () => go(-1));
  next?.addEventListener("click", () => go(1));
}

function initAnimations() {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const items = document.querySelectorAll(".reveal");

  if (reduce || typeof gsap === "undefined") {
    items.forEach((el) => { el.style.opacity = "1"; el.style.transform = "none"; });
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  gsap.from(".hero-copy > *", { y: 28, opacity: 0, duration: 0.9, stagger: 0.12, ease: "power3.out" });
  gsap.from(".hero-sculpture", { scale: 0.86, opacity: 0, duration: 1.2, ease: "power3.out", delay: 0.2 });
  gsap.from(".hero-footer > *", { y: 16, opacity: 0, duration: 0.8, delay: 0.45 });

  items.forEach((el) => {
    gsap.fromTo(el,
      { y: 40, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: { trigger: el, start: "top 86%", toggleActions: "play none none reverse" }
      }
    );
  });

  const banner = document.querySelector(".hero-banner-img");
  if (banner) {
    gsap.to(banner, {
      yPercent: 8,
      ease: "none",
      scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true }
    });
  }

  document.querySelectorAll(".btn-magnetic").forEach((btn) => {
    btn.addEventListener("mousemove", (e) => {
      const rect = btn.getBoundingClientRect();
      gsap.to(btn, {
        x: (e.clientX - rect.left - rect.width / 2) * 0.25,
        y: (e.clientY - rect.top - rect.height / 2) * 0.25,
        duration: 0.25
      });
    });
    btn.addEventListener("mouseleave", () => gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: "elastic.out(1, 0.4)" }));
  });
}
