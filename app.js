/**
 * Xperience Tech — Landing corporativa
 * Vanilla ES6+ | Sin dependencias externas
 */

(function () {
  "use strict";

  const STORAGE_THEME = "xperience-theme";
  const CONTACT_EMAIL = "generacionxperience@gmail.com";
  const WHATSAPP_URL =
    "https://wa.me/573022482933?text=" +
    encodeURIComponent(
      "Hola Xperience Tech, solicito una consultoría tecnológica sobre automatización, CRM o soluciones industriales para mi empresa."
    );

  const SELECTORS = {
    header: "#site-header",
    navToggle: "#nav-toggle",
    navMenu: "#nav-menu",
    navLinks: ".nav-link",
    sections: "section[id]",
    tabs: "[data-tab]",
    tabPanels: ".tab-panel",
    contactForm: "#contact-form",
    formStatus: "#form-status",
    whatsapp: "#whatsapp-float",
    year: "#year",
    reveal: "[data-reveal]",
    barFills: ".bar-fill",
    themeToggle: "#theme-toggle",
    themeLabel: "#theme-label",
    mensaje: "#mensaje",
    counters: "[data-counter]",
  };

  const dom = {
    header: document.querySelector(SELECTORS.header),
    navToggle: document.querySelector(SELECTORS.navToggle),
    navMenu: document.querySelector(SELECTORS.navMenu),
    navLinks: document.querySelectorAll(SELECTORS.navLinks),
    sections: document.querySelectorAll(SELECTORS.sections),
    contactForm: document.querySelector(SELECTORS.contactForm),
    formStatus: document.querySelector(SELECTORS.formStatus),
    whatsapp: document.querySelector(SELECTORS.whatsapp),
    year: document.querySelector(SELECTORS.year),
    themeToggle: document.querySelector(SELECTORS.themeToggle),
    themeLabel: document.querySelector(SELECTORS.themeLabel),
    mensaje: document.querySelector(SELECTORS.mensaje),
  };

  function init() {
    if (dom.year) dom.year.textContent = String(new Date().getFullYear());
    initTheme();
    initSmoothScroll();
    initMobileNav();
    initHeaderScroll();
    initActiveNav();
    initTabs();
    initReveal();
    initContactForm();
    initWhatsAppFloat();
    initPricingCTA();
    animateBarsOnVisible();
    initCounters();
  }

  /* ---------- Theme ---------- */
  function getStoredTheme() {
    try {
      const t = localStorage.getItem(STORAGE_THEME);
      if (t === "light" || t === "dark") return t;
    } catch (e) {
      /* ignore */
    }
    return "dark";
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    if (dom.themeLabel) {
      dom.themeLabel.textContent = theme === "light" ? "CLARO" : "OSCURO";
    }
    if (dom.themeToggle) {
      dom.themeToggle.setAttribute(
        "aria-label",
        theme === "light"
          ? "Activar modo oscuro"
          : "Activar modo claro"
      );
    }
  }

  function initTheme() {
    applyTheme(getStoredTheme());

    if (!dom.themeToggle) return;

    dom.themeToggle.addEventListener("click", () => {
      const current = document.documentElement.getAttribute("data-theme") || "dark";
      const next = current === "dark" ? "light" : "dark";
      applyTheme(next);
      try {
        localStorage.setItem(STORAGE_THEME, next);
      } catch (e) {
        /* ignore */
      }
    });
  }

  /* ---------- Navigation ---------- */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", (e) => {
        const id = anchor.getAttribute("href");
        if (!id || id === "#") return;
        const target = document.querySelector(id);
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
        closeMobileNav();
      });
    });
  }

  function initMobileNav() {
    if (!dom.navToggle || !dom.navMenu) return;

    dom.navToggle.addEventListener("click", () => {
      const isOpen = dom.navMenu.classList.toggle("is-open");
      dom.navToggle.classList.toggle("is-open", isOpen);
      dom.navToggle.setAttribute("aria-expanded", String(isOpen));
      dom.navToggle.setAttribute(
        "aria-label",
        isOpen ? "Cerrar menú" : "Abrir menú"
      );
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeMobileNav();
    });
  }

  function closeMobileNav() {
    if (!dom.navMenu || !dom.navToggle) return;
    dom.navMenu.classList.remove("is-open");
    dom.navToggle.classList.remove("is-open");
    dom.navToggle.setAttribute("aria-expanded", "false");
    dom.navToggle.setAttribute("aria-label", "Abrir menú");
  }

  function initHeaderScroll() {
    if (!dom.header) return;

    const onScroll = () => {
      dom.header.classList.toggle("is-scrolled", window.scrollY > 24);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  function initActiveNav() {
    if (!dom.sections.length || !dom.navLinks.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const id = entry.target.getAttribute("id");
          dom.navLinks.forEach((link) => {
            const href = link.getAttribute("href");
            link.classList.toggle("is-active", href === `#${id}`);
          });
        });
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: 0 }
    );

    dom.sections.forEach((section) => observer.observe(section));
  }

  /* ---------- Tabs ---------- */
  function initTabs() {
    const tabButtons = document.querySelectorAll(SELECTORS.tabs);
    if (!tabButtons.length) return;

    tabButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        setActiveTab(btn.getAttribute("data-tab"));
      });
    });

    setActiveTab("manual");
  }

  function setActiveTab(tabId) {
    const tabButtons = document.querySelectorAll(SELECTORS.tabs);
    const panels = document.querySelectorAll(SELECTORS.tabPanels);

    tabButtons.forEach((btn) => {
      btn.setAttribute(
        "aria-selected",
        String(btn.getAttribute("data-tab") === tabId)
      );
    });

    panels.forEach((panel) => {
      const isManual = panel.id === "panel-manual";
      const isXperience = panel.id === "panel-xperience";
      const show =
        (tabId === "manual" && isManual) ||
        (tabId === "xperience" && isXperience);

      panel.classList.toggle("is-active", show);
      panel.hidden = !show;

      if (show) {
        requestAnimationFrame(() => {
          panel.querySelectorAll(SELECTORS.barFills).forEach((bar) => {
            const value = bar.getAttribute("data-efficiency");
            if (value) bar.style.width = `${value}%`;
          });
        });
      }
    });
  }

  function animateBarsOnVisible() {
    const bars = document.querySelectorAll(SELECTORS.barFills);
    if (!bars.length) return;

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const bar = entry.target;
          const panel = bar.closest(".tab-panel");
          if (panel && panel.hidden) return;
          const value = bar.getAttribute("data-efficiency");
          if (value) bar.style.width = `${value}%`;
          obs.unobserve(bar);
        });
      },
      { threshold: 0.3 }
    );

    bars.forEach((bar) => observer.observe(bar));
  }

  /* ---------- Counters ---------- */
  function initCounters() {
    const nodes = document.querySelectorAll(SELECTORS.counters);
    if (!nodes.length) return;

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          animateCounter(entry.target);
          obs.unobserve(entry.target);
        });
      },
      { threshold: 0.4 }
    );

    nodes.forEach((node) => observer.observe(node));
  }

  function animateCounter(el) {
    const raw = el.getAttribute("data-counter");
    if (raw == null) return;

    const isNegative = String(raw).startsWith("-");
    const target = Math.abs(parseInt(raw, 10));
    if (Number.isNaN(target)) return;

    const hasPercent =
      el.classList.contains("terminal-metric-val") ||
      el.textContent.includes("%");
    const duration = 1400;
    const start = performance.now();
    const prefix = isNegative ? "-" : "";

    function frame(now) {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      const current = Math.round(target * eased);
      el.textContent = hasPercent
        ? `${prefix}${current}%`
        : String(isNegative ? -current : current);

      if (t < 1) requestAnimationFrame(frame);
      else {
        el.textContent = hasPercent
          ? `${prefix}${target}%`
          : String(isNegative ? -target : target);
      }
    }

    requestAnimationFrame(frame);
  }

  /* ---------- Reveal ---------- */
  function initReveal() {
    const items = document.querySelectorAll(SELECTORS.reveal);
    if (!items.length) return;

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    items.forEach((el) => observer.observe(el));
  }

  /* ---------- Pricing CTA ---------- */
  function initPricingCTA() {
    document.querySelectorAll(".pricing-cta").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const plan = btn.getAttribute("data-plan");
        if (!plan) return;

        if (btn.classList.contains("btn-orange")) {
          e.preventDefault();
          const msg = encodeURIComponent(
            `Hola Xperience Tech, me interesa el plan ${plan}. Quisiera hablar sobre escalamiento y cotización.`
          );
          window.open(
            `https://wa.me/573022482933?text=${msg}`,
            "_blank",
            "noopener,noreferrer"
          );
          closeMobileNav();
          return;
        }

        if (dom.mensaje) {
          dom.mensaje.value = `Plan de interés: ${plan}\n\n`;
          dom.mensaje.focus();
        }
        closeMobileNav();
      });
    });
  }

  /* ---------- Contact form ---------- */
  function initContactForm() {
    if (!dom.contactForm || !dom.formStatus) return;

    dom.contactForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const formData = new FormData(dom.contactForm);
      const nombre = String(formData.get("nombre") || "").trim();
      const email = String(formData.get("email") || "").trim();
      const telefono = String(formData.get("telefono") || "").trim();
      const mensaje = String(formData.get("mensaje") || "").trim();

      if (!nombre || !email || !mensaje) {
        setFormStatus("Completa los campos obligatorios.", "error");
        return;
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setFormStatus("Correo electrónico no válido.", "error");
        return;
      }

      const subject = encodeURIComponent(
        `[Xperience Tech] Cotización — ${nombre}`
      );
      const body = encodeURIComponent(
        `Empresa / Contacto: ${nombre}\n` +
          `Correo: ${email}\n` +
          `Teléfono: ${telefono || "No indicado"}\n\n` +
          `Mensaje:\n${mensaje}\n\n` +
          `— Enviado desde landing Xperience Tech`
      );

      window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
      setFormStatus(
        "Se abrió tu cliente de correo. Si no aparece, escríbenos directamente.",
        "ok"
      );
      dom.contactForm.reset();
    });
  }

  function setFormStatus(msg, type) {
    if (!dom.formStatus) return;
    dom.formStatus.textContent = msg;
    dom.formStatus.style.color =
      type === "error" ? "#ff6b8a" : "var(--accent-cyan)";
  }

  /* ---------- WhatsApp float ---------- */
  function initWhatsAppFloat() {
    const el = dom.whatsapp;
    if (!el) return;

    let ticking = false;
    const amplitude = 12;

    const updatePosition = () => {
      const scrollY = window.scrollY;
      const offset = Math.sin(scrollY * 0.008) * amplitude;
      const scale = 1 + Math.min(scrollY * 0.00005, 0.06);
      el.style.transform = `translateY(${-offset}px) scale(${scale})`;
      ticking = false;
    };

    window.addEventListener(
      "scroll",
      () => {
        if (!ticking) {
          requestAnimationFrame(updatePosition);
          ticking = true;
        }
      },
      { passive: true }
    );

    updatePosition();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
