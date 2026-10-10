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
  initDashboardCarousel();
  initDiagnosticQuiz();
  initAnimations();
});

const diagnosticQuestions = [
  {
    title: "¿Cómo gestionan los contactos, clientes y oportunidades comerciales?",
    options: [
      "Con un CRM, responsables definidos y seguimiento centralizado.",
      "En varias herramientas o archivos; hay duplicados y seguimiento irregular.",
      "Sin registro central; depende de chats, correos o memoria del equipo."
    ]
  },
  {
    title: "¿Qué herramientas sostienen la operación diaria de tu negocio?",
    options: [
      "Herramientas estándar y procesos sencillos cubren la mayoría de necesidades.",
      "Usamos varias plataformas, pero dependemos de pasos manuales para conectarlas.",
      "Las herramientas actuales no soportan procesos críticos o reglas propias del negocio."
    ]
  },
  {
    title: "¿Cómo consolidan datos e informes para tomar decisiones?",
    options: [
      "Los datos están disponibles en reportes claros y fáciles de consultar.",
      "El equipo reúne información de distintas fuentes durante varias horas.",
      "Toma días o no logramos obtener una cifra completa y confiable."
    ]
  },
  {
    title: "¿Qué tan conectados están tus sistemas y tareas repetitivas?",
    options: [
      "Algunas integraciones estándar bastarían para reducir el trabajo manual.",
      "Hay automatizaciones aisladas, pero persiste mucho copy-paste entre sistemas.",
      "Las conexiones faltantes afectan procesos críticos y requieren lógica a medida."
    ]
  },
  {
    title: "¿Cuál es el principal reto que quieres resolver en los próximos meses?",
    options: [
      "Automatizar una tarea o tener un dashboard práctico para el equipo.",
      "Ordenar varias áreas con un CRM/ERP y datos conectados.",
      "Desarrollar una solución propia para procesos críticos y escalar sin límites."
    ]
  }
];

const PRICING_CONFIG = window.PRICING_CONFIG = (() => {
  const cards = Array.from(document.querySelectorAll(".pricing-card[data-plan-key]"));
  const config = Object.fromEntries(cards.map((card) => {
    const setup = card.dataset.planSetup;
    const saas = card.dataset.planSaas;
    const timeline = card.dataset.planTimeline;
    const setupValue = setup.replace(/^Setup\s*/i, "");
    const saasValue = saas.replace(/^\+?\s*SaaS mensual\s*/i, "");
    const priceFields = card.querySelectorAll(".pricing-price strong, .pricing-price em");
    const priceLabels = card.querySelectorAll(".pricing-price .mono");
    if (priceLabels[0]) priceLabels[0].textContent = "Setup";
    if (priceLabels[1]) priceLabels[1].textContent = saas.startsWith("+") ? "+ SaaS mensual" : "SaaS mensual";
    if (priceFields[0]) priceFields[0].textContent = setupValue;
    if (priceFields[1]) priceFields[1].textContent = saasValue;
    const timelineFeature = Array.from(card.querySelectorAll(".pricing-features li"))
      .find((item) => /^Entrega en\b/i.test(item.textContent.trim()));
    if (timelineFeature) timelineFeature.textContent = `Entrega en ${timeline}`;

    const deliverables = Array.from(card.querySelectorAll(".pricing-features li"))
      .map((item) => item.textContent.trim())
      .filter((item) => !/^Entrega en\b/i.test(item));
    return [card.dataset.planKey, {
      name: card.querySelector(".pricing-header h3")?.textContent.trim() || card.dataset.planKey,
      setup,
      saas,
      timeline,
      deliverables,
      minPoints: Number(card.dataset.planMin),
      maxPoints: Number(card.dataset.planMax),
      profile: card.dataset.planProfile
    }];
  }));

  ["piloto", "crecimiento", "enterprise"].forEach((key) => {
    const plan = config[key];
    if (!plan || !plan.setup || !plan.saas || !plan.timeline || !plan.deliverables.length ||
      !Number.isFinite(plan.minPoints) || !Number.isFinite(plan.maxPoints)) {
      throw new Error(`Pricing configuration is incomplete for "${key}".`);
    }
  });

  return config;
})();

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
  const sections = ["#home", "#servicios", "#desarrollo", "#data", "#automatizaciones", "#dashboards", "#diagnostico", "#planes", "#contacto"];
  let index = 0;
  const go = (dir) => {
    index = (index + dir + sections.length) % sections.length;
    document.querySelector(sections[index])?.scrollIntoView({ behavior: "smooth" });
  };
  prev?.addEventListener("click", () => go(-1));
  next?.addEventListener("click", () => go(1));
}

function initDiagnosticQuiz() {
  const modal = document.getElementById("diagnostic-modal");
  const step = document.getElementById("diagnostic-step");
  const fill = modal?.querySelector(".diagnostic-progress-fill");
  const progress = modal?.querySelector(".diagnostic-progress");
  const progressLabel = modal?.querySelector(".diagnostic-progress-label");
  if (!modal || !step || !fill || !progress || !progressLabel) return;

  const quizState = {
    company: "",
    contact: "",
    role: "",
    answers: Array(diagnosticQuestions.length).fill(null)
  };
  let currentStep = 0;

  const updateProgress = (index) => {
    const labels = ["Perfil y operación", "Herramientas", "Datos", "Integraciones", "Objetivo"];
    fill.style.width = `${((index + 1) / diagnosticQuestions.length) * 100}%`;
    progress.setAttribute("aria-valuenow", String(index + 1));
    progressLabel.innerHTML = `Paso ${index + 1} / ${diagnosticQuestions.length} <span>${labels[index]}</span>`;
  };

  const replaceStep = (markup) => {
    step.classList.add("is-transitioning");
    step.innerHTML = markup;
    step.offsetWidth;
    requestAnimationFrame(() => step.classList.remove("is-transitioning"));
  };

  const renderStep = (index, error = "", focusSelection = false) => {
    currentStep = index;
    const question = diagnosticQuestions[index];
    const selected = quizState.answers[index];
    updateProgress(index);
    const contactFields = index === 0 ? `
      <div class="diagnostic-fields">
        <div class="diagnostic-field">
          <label for="diagnostic-company">Nombre de la empresa o negocio</label>
          <input id="diagnostic-company" name="company" autocomplete="organization" required value="${escapeAttribute(quizState.company)}" placeholder="Ej. Xperience Tech">
        </div>
        <div class="diagnostic-field">
          <label for="diagnostic-contact">Nombre del contacto</label>
          <input id="diagnostic-contact" name="contact" autocomplete="name" required value="${escapeAttribute(quizState.contact)}" placeholder="Tu nombre">
        </div>
        <div class="diagnostic-field">
          <label for="diagnostic-role">Cargo o rol</label>
          <input id="diagnostic-role" name="role" autocomplete="organization-title" required value="${escapeAttribute(quizState.role)}" placeholder="Ej. Gerencia de operaciones">
        </div>
      </div>
      <p class="diagnostic-contact-hint">Usaremos estos datos para personalizar tu resumen y mensaje de WhatsApp.</p>
    ` : "";
    replaceStep(`
      <div class="diagnostic-question">
        ${contactFields}
        <span class="eyebrow">${index === 0 ? "Empecemos por tu negocio" : `Diagnóstico operativo · ${index + 1} de ${diagnosticQuestions.length}`}</span>
        <h3 id="diagnostic-question-title" tabindex="-1">${question.title}</h3>
        <div class="diagnostic-options" role="group" aria-labelledby="diagnostic-question-title">
          ${question.options.map((option, optionIndex) => `
            <button type="button" class="diagnostic-option" data-choice="${optionIndex + 1}" aria-pressed="${selected === optionIndex + 1}">
              <span class="diagnostic-option-mark">${String.fromCharCode(65 + optionIndex)}</span>
              <span>${option}</span>
            </button>
          `).join("")}
        </div>
        <p class="diagnostic-error" role="alert">${error}</p>
        <div class="diagnostic-actions">
          <button type="button" class="btn btn-outline" data-action="back" ${index === 0 ? "disabled" : ""}>Anterior</button>
          <button type="button" class="btn btn-primary" data-action="next" ${selected ? "" : "disabled"}>${index === diagnosticQuestions.length - 1 ? "Ver mi recomendación" : "Continuar"} <i data-lucide="arrow-right"></i></button>
        </div>
      </div>
    `);
    if (window.lucide) lucide.createIcons({ root: step });
    const focusTarget = focusSelection
      ? step.querySelector(`.diagnostic-option[data-choice="${selected}"]`)
      : step.querySelector("#diagnostic-question-title");
    focusTarget?.focus({ preventScroll: true });
  };

  const getPlan = () => {
    const total = quizState.answers.reduce((sum, answer) => sum + answer, 0);
    const entry = Object.entries(PRICING_CONFIG).find(([, plan]) =>
      total >= plan.minPoints && total <= plan.maxPoints
    );
    if (!entry) throw new Error(`No pricing tier is configured for diagnostic score ${total}.`);
    return { key: entry[0], plan: entry[1], total };
  };

  const renderResult = () => {
    const { key, plan, total } = getPlan();
    const deliverablesText = plan.deliverables.join(", ");
    const message = [
      `Hola Xperience Tech, realizamos el diagnóstico en su sitio web para la empresa *${quizState.company}* (Contacto: *${quizState.contact}*, Cargo: *${quizState.role}*).`,
      "",
      "📊 *Resultado del diagnóstico:*",
      `• Plan recomendado: *${plan.name}*`,
      `• Inversión: *${plan.setup} · ${plan.saas}*`,
      `• Tiempo estimado: *${plan.timeline}*`,
      "",
      "🚀 *Requerimiento:*",
      `Solicitamos asesoría para implementar el plan *${plan.name}* (${deliverablesText}). ¿Podemos agendar una revisión técnica?`
    ].join("\n");
    const whatsappUrl = `https://wa.me/573022482933?text=${encodeURIComponent(message)}`;

    updateProgress(diagnosticQuestions.length - 1);
    replaceStep(`
      <div class="diagnostic-result">
        <header class="diagnostic-result-header">
          <span class="eyebrow">Recomendación · ${total} puntos · ${key}</span>
          <h3>Tu plan recomendado es <span class="text-gradient">${plan.name}</span></h3>
          <p>${plan.profile}</p>
        </header>
        <div class="diagnostic-result-meta">
          <div class="diagnostic-result-stat"><span>Inversión inicial</span><strong>${plan.setup}</strong></div>
          <div class="diagnostic-result-stat"><span>Servicio mensual</span><strong>${plan.saas}</strong></div>
          <div class="diagnostic-result-stat"><span>Tiempo estimado</span><strong>${plan.timeline}</strong></div>
          <div class="diagnostic-result-stat"><span>Puntaje del diagnóstico</span><strong>${total} / 15</strong></div>
        </div>
        <h4>Soluciones incluidas en este nivel</h4>
        <ul class="diagnostic-deliverables">
          ${plan.deliverables.map((deliverable) => `<li><i data-lucide="check"></i><span>${deliverable}</span></li>`).join("")}
        </ul>
        <h4>Tu ruta de implementación</h4>
        <ol class="diagnostic-roadmap">
          <li><span>PASO 01</span>Levantamiento de requerimientos y arquitectura de datos.</li>
          <li><span>PASO 02</span>Desarrollo o configuración del prototipo e integraciones clave.</li>
          <li><span>PASO 03</span>Pruebas en entorno real, capacitación del equipo y despliegue final.</li>
        </ol>
        <a class="btn btn-primary btn-full" href="${whatsappUrl}" target="_blank" rel="noopener noreferrer">Solicitar propuesta por WhatsApp <i data-lucide="arrow-up-right"></i></a>
        <button type="button" class="diagnostic-restart" data-action="restart">Volver a realizar el diagnóstico</button>
      </div>
    `);
    if (window.lucide) lucide.createIcons({ root: step });
  };

  step.addEventListener("input", (event) => {
    const input = event.target;
    if (!(input instanceof HTMLInputElement)) return;
    if (input.name === "company" || input.name === "contact" || input.name === "role") {
      quizState[input.name] = input.value;
    }
  });

  step.addEventListener("click", (event) => {
    const option = event.target.closest(".diagnostic-option");
    if (option) {
      quizState.answers[currentStep] = Number(option.dataset.choice);
      renderStep(currentStep, "", true);
      return;
    }

    const action = event.target.closest("[data-action]")?.dataset.action;
    if (action === "back") {
      if (currentStep > 0) renderStep(currentStep - 1);
    } else if (action === "next") {
      if (currentStep === 0) {
        quizState.company = step.querySelector('[name="company"]').value.trim();
        quizState.contact = step.querySelector('[name="contact"]').value.trim();
        quizState.role = step.querySelector('[name="role"]').value.trim();
        if (!quizState.company || !quizState.contact || !quizState.role) {
          renderStep(0, "Completa los datos de contacto para continuar.");
          return;
        }
      }

      if (!quizState.answers[currentStep]) {
        renderStep(currentStep, "Selecciona una opción para continuar.");
      } else if (currentStep === diagnosticQuestions.length - 1) renderResult();
      else renderStep(currentStep + 1);
    } else if (action === "restart") {
      quizState.company = "";
      quizState.contact = "";
      quizState.role = "";
      quizState.answers = Array(diagnosticQuestions.length).fill(null);
      renderStep(0);
    }
  });

  document.querySelectorAll("[data-open-diagnostic]").forEach((button) => {
    button.addEventListener("click", () => {
      renderStep(currentStep);
      modal.showModal();
      step.querySelector("#diagnostic-question-title")?.focus({ preventScroll: true });
    });
  });
  modal.querySelector(".diagnostic-modal-close")?.addEventListener("click", () => modal.close());
  modal.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      event.preventDefault();
      modal.close();
    }
  });
  modal.addEventListener("click", (event) => {
    if (event.target === modal) modal.close();
  });
  renderStep(0);
}

function escapeAttribute(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;",
    "'": "&#39;"
  })[character]);
}

function initDashboardCarousel() {
  const carousel = document.querySelector(".dashboard-carousel");
  if (!carousel) return;

  const cards = Array.from(carousel.querySelectorAll(".dashboard-card"));
  const counter = carousel.querySelector(".dashboard-counter");
  const previous = carousel.querySelector(".dashboard-prev");
  const next = carousel.querySelector(".dashboard-next");
  const arc = carousel.querySelector(".dashboard-arc");
  let selectedIndex = window.matchMedia("(max-width: 767px)").matches ? 0 : 1;

  const render = (activeIndex) => {
    cards.forEach((card, index) => {
      const position = index === activeIndex
        ? "center"
        : index === (activeIndex + cards.length - 1) % cards.length
          ? "left"
          : "right";
      card.dataset.position = position;
    });
    if (counter) {
      counter.innerHTML = `${String(activeIndex + 1).padStart(2, "0")} <span>/ ${String(cards.length).padStart(2, "0")}</span>`;
    }
  };

  const activate = (index, select = false, scroll = false) => {
    const activeIndex = (index + cards.length) % cards.length;
    if (select) selectedIndex = activeIndex;
    render(activeIndex);
    if (scroll && window.matchMedia("(max-width: 767px)").matches) {
      cards[activeIndex].scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    }
  };

  cards.forEach((card, index) => {
    card.addEventListener("pointerenter", () => activate(index));
    card.addEventListener("focus", () => activate(index, true));
    card.addEventListener("click", () => activate(index, true, true));
    card.addEventListener("keydown", (event) => {
      if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
        event.preventDefault();
        const direction = event.key === "ArrowRight" ? 1 : -1;
        const nextIndex = (index + direction + cards.length) % cards.length;
        activate(nextIndex, true, true);
        cards[nextIndex].focus();
      }
    });
  });

  carousel.addEventListener("pointerleave", () => activate(selectedIndex));
  carousel.addEventListener("focusout", (event) => {
    if (!carousel.contains(event.relatedTarget)) activate(selectedIndex);
  });
  previous?.addEventListener("click", () => activate(selectedIndex - 1, true, true));
  next?.addEventListener("click", () => activate(selectedIndex + 1, true, true));
  render(selectedIndex);

  if (arc && window.matchMedia("(max-width: 767px)").matches && "IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.65) {
          const index = cards.indexOf(entry.target);
          if (index !== -1) {
            selectedIndex = index;
            render(index);
          }
        }
      });
    }, { root: arc, threshold: 0.65 });
    cards.forEach((card) => observer.observe(card));
  }
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
