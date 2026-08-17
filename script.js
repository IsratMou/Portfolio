/* ============== THEME TOGGLE ============== */
(function initTheme() {
  const saved = localStorage.getItem("theme");
  if (
    saved === "dark" ||
    (!saved && window.matchMedia("(prefers-color-scheme: dark)").matches)
  ) {
    document.documentElement.setAttribute("data-theme", "dark");
  }
})();

const themeToggle = document.getElementById("themeToggle");
themeToggle.addEventListener("click", () => {
  const isDark = document.documentElement.getAttribute("data-theme") === "dark";
  if (isDark) {
    document.documentElement.removeAttribute("data-theme");
    localStorage.setItem("theme", "light");
  } else {
    document.documentElement.setAttribute("data-theme", "dark");
    localStorage.setItem("theme", "dark");
  }
});

/* ============== NAVBAR ============== */
const navbar = document.getElementById("navbar");
const mobileMenuToggle = document.getElementById("menuToggle");
const mobileMenu = document.getElementById("mobileMenu");

window.addEventListener("scroll", () => {
  if (window.scrollY > 12) navbar.classList.add("scrolled");
  else navbar.classList.remove("scrolled");
});

mobileMenuToggle.addEventListener("click", () => {
  mobileMenuToggle.classList.toggle("is-open");
  mobileMenu.classList.toggle("is-open");
});

function scrollToSection(selector) {
  const el = document.querySelector(selector);
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    mobileMenuToggle.classList.remove("is-open");
    mobileMenu.classList.remove("is-open");
  }
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

/* ============== TYPING ANIMATION ============== */
(function initTyping() {
  const phrases = [
    "AI / ML Engineer",
    "Machine Learning Researcher",
    "Deep Learning Practitioner",
    "Computer Vision Engineer",
    "AI / ML Intern Candidate",
  ];
  const el = document.getElementById("typingText");
  if (!el) return;

  let phraseIndex = 0;
  let charIndex = 0;
  let phase = "typing";
  const typeSpeed = 70;
  const deleteSpeed = 35;
  const pauseTime = 1800;

  function tick() {
    const current = phrases[phraseIndex];

    if (phase === "typing") {
      if (charIndex < current.length) {
        charIndex++;
        el.textContent = current.slice(0, charIndex);
        setTimeout(tick, typeSpeed);
      } else {
        phase = "pausing";
        setTimeout(tick, pauseTime);
      }
    } else if (phase === "pausing") {
      phase = "deleting";
      setTimeout(tick, pauseTime / 2);
    } else {
      if (charIndex > 0) {
        charIndex--;
        el.textContent = current.slice(0, charIndex);
        setTimeout(tick, deleteSpeed);
      } else {
        phase = "typing";
        phraseIndex = (phraseIndex + 1) % phrases.length;
        setTimeout(tick, 50);
      }
    }
  }
  tick();
})();

/* ============== CURSOR-TRACKING GLOW ============== */
(function initCursorGlow() {
  const hero = document.getElementById("hero");
  const glow = document.getElementById("heroGlow");
  const avatarGlow = document.getElementById("avatarGlow");
  if (!hero || !glow) return;

  let targetX = 50,
    targetY = 50;
  let currentX = 50,
    currentY = 50;

  hero.addEventListener("mousemove", (e) => {
    const rect = hero.getBoundingClientRect();
    targetX = ((e.clientX - rect.left) / rect.width) * 100;
    targetY = ((e.clientY - rect.top) / rect.height) * 100;
  });

  function animate() {
    currentX += (targetX - currentX) * 0.08;
    currentY += (targetY - currentY) * 0.08;
    glow.style.background =
      `radial-gradient(700px circle at ${currentX}% ${currentY}%, rgba(255, 157, 77, 0.32), transparent 50%), ` +
      `radial-gradient(500px circle at ${currentX}% ${currentY}%, rgba(255, 124, 163, 0.26), transparent 60%)`;
    if (avatarGlow) {
      const ax = currentX * 0.6 + 15;
      const ay = currentY * 0.6 + 15;
      avatarGlow.style.background = `radial-gradient(280px circle at ${ax}% ${ay}%, rgba(255, 157, 77, 0.3), transparent 65%)`;
    }
    requestAnimationFrame(animate);
  }
  animate();
})();

/* ============== SCROLL REVEAL ==============
   Uses IntersectionObserver to add an entrance animation when elements
   scroll into view. Safety net: after 1.5s, re-query the LIVE DOM (not a
   stale snapshot) so dynamically-injected .reveal elements (skill cards,
   research cards, project cards, contact items) also get forced visible
   if IntersectionObserver never fires. */
(function initReveal() {
  // Force-reveal any element that's still hidden after 1.5s.
  // Re-query the DOM at fire time — many .reveal elements are injected
  // AFTER this IIFE runs (skills, research, projects, contact generators).
  setTimeout(() => {
    document
      .querySelectorAll(".reveal:not(.is-visible):not(.reveal-fallback)")
      .forEach((el) => el.classList.add("reveal-fallback", "is-visible"));
  }, 1500);

  // Also force-reveal elements already in the viewport on load.
  document.querySelectorAll(".reveal").forEach((el) => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      el.classList.add("is-visible");
    }
  });

  // Observe remaining elements.
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -60px 0px" },
  );

  document
    .querySelectorAll(".reveal:not(.is-visible)")
    .forEach((el) => observer.observe(el));
})();

/* ============== ANIMATED COUNTERS ============== */
function animateCounter(el) {
  if (el.dataset.counted === "1") return;
  el.dataset.counted = "1";
  const target = parseFloat(el.dataset.count);
  const decimals = parseInt(el.dataset.decimals || "0", 10);
  const duration = 1400;
  const start = performance.now();

  function step(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // easeOutCubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = target * eased;
    el.textContent = value.toFixed(decimals);
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target.toFixed(decimals);
  }
  requestAnimationFrame(step);
}

(function initCounters() {
  // Safety net: after 1.8s, force any counter that hasn't fired to its final value.
  setTimeout(() => {
    document
      .querySelectorAll('[data-count]:not([data-counted="1"])')
      .forEach((el) => {
        const target = parseFloat(el.dataset.count);
        const decimals = parseInt(el.dataset.decimals || "0", 10);
        el.textContent = target.toFixed(decimals);
        el.dataset.counted = "1";
      });
  }, 1800);

  // Also animate counters that are already in the viewport on load.
  document.querySelectorAll("[data-count]").forEach((el) => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      animateCounter(el);
    }
  });

  // Observe remaining counters.
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.4 },
  );

  document
    .querySelectorAll('[data-count]:not([data-counted="1"])')
    .forEach((el) => observer.observe(el));
})();

/* ============== PROGRESS BARS ============== */
function fillProgress(el) {
  if (el.dataset.filled === "1") return;
  el.dataset.filled = "1";
  const target = parseFloat(el.dataset.progress);
  setTimeout(() => {
    el.style.width = target + "%";
  }, 150);
}

(function initProgressBars() {
  // Safety net: after 1.8s, force any progress bar that hasn't fired to its final width.
  setTimeout(() => {
    document
      .querySelectorAll('.progress-fill[data-progress]:not([data-filled="1"])')
      .forEach((el) => {
        const target = parseFloat(el.dataset.progress);
        el.style.width = target + "%";
        el.dataset.filled = "1";
      });
  }, 1800);

  // Also fill bars that are already in the viewport on load.
  document.querySelectorAll(".progress-fill[data-progress]").forEach((el) => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      fillProgress(el);
    }
  });

  // Observe remaining bars.
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        fillProgress(entry.target);
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.3 },
  );

  document
    .querySelectorAll('.progress-fill[data-progress]:not([data-filled="1"])')
    .forEach((el) => observer.observe(el));
})();

/* ============== TECH MARQUEE ============== */
(function initMarquee() {
  const track = document.getElementById("marqueeTrack");
  if (!track) return;
  const tech = [
    "Python",
    "PyTorch",
    "Scikit-learn",
    "NumPy",
    "Pandas",
    "Linear Regression",
    "Logistic Regression",
    "KNN",
    "Naive Bayes",
    "Decision Trees",
    "Random Forest",
    "SVM",
    "SMOTE",
    "SHAP",
    "YOLOv11",
    "Video Swin Transformer",
    "Streamlit",
    "Gradio",
    "Hugging Face Spaces",
    "Git",
    "GitHub",
    "Django",
    "Django REST Framework",
    "React",
    "SQLite",
    "SQL",
  ];
  const looped = [...tech, ...tech];
  track.innerHTML = looped
    .map((t) => `<span class="marquee-item">${t}</span>`)
    .join("");
})();

/* ============== SKILLS ============== */
(function initSkills() {
  const grid = document.getElementById("skillsGrid");
  if (!grid) return;

  const iconCode =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>';
  const iconBrain =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2zM14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0-.34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2z"></path></svg>';
  const iconEye =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>';
  const iconShield =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>';

  const groups = [
    {
      icon: iconCode,
      title: "Programming & Data",
      flavor: "sky",
      items: [
        "Python",
        "Java",
        "SQL",
        "JavaScript",
        "HTML/CSS",
        "NumPy",
        "Pandas",
        "Matplotlib",
        "Seaborn",
        "Jupyter",
        "Google Colab",
        "Kaggle",
        "Git",
        "GitHub",
        "VS Code",
      ],
    },
    {
      icon: iconBrain,
      title: "Machine Learning",
      flavor: "mint",
      items: [
        "Scikit-learn",
        "Linear Regression",
        "Logistic Regression",
        "KNN",
        "Naive Bayes",
        "Decision Trees",
        "Random Forest",
        "SVM",
        "Ensemble Learning",
        "Classification",
        "Regression",
        "Clustering",
      ],
    },
    {
      icon: iconShield,
      title: "ML Engineering & XAI",
      flavor: "butter",
      items: [
        "Feature Engineering",
        "Feature Scaling",
        "Dimensionality Reduction",
        "SMOTE",
        "Cross-Validation",
        "Model Evaluation",
        "Hyperparameter Tuning",
        "Threshold Tuning",
        "SHAP",
        "Explainable ML",
        "FGSM Robustness",
        "Intrusion Detection",
      ],
    },
    {
      icon: iconEye,
      title: "Deep Learning, Vision & Deployment",
      flavor: "pink",
      items: [
        "PyTorch",
        "Neural Networks",
        "CNNs",
        "Transfer Learning",
        "YOLOv11",
        "Video Swin Transformer",
        "Object Detection",
        "Spatio-Temporal Modeling",
        "Streamlit",
        "Gradio",
        "Hugging Face Spaces",
        "Joblib",
        "Django",
        "Django REST Framework",
        "React",
        "SQLite",
      ],
    },
  ];

  grid.innerHTML = groups
    .map(
      (g, i) => `
    <article class="skill-card skill-card--${g.flavor} reveal" style="transition-delay: ${i * 0.05}s">
      <div class="skill-header">
        <span class="skill-icon chip-${g.flavor}-bg">${g.icon}</span>
        <h3 class="skill-title">${g.title}</h3>
      </div>
      <div class="skill-items skill-tags">
        ${g.items.map((item) => `<span class="skill-tag">${item}</span>`).join("")}
      </div>
    </article>
  `,
    )
    .join("");

  document.querySelectorAll(".skill-card.reveal").forEach((el) => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" },
    );
    obs.observe(el);
  });
})();

/* ============== RESEARCH ============== */
(function initResearch() {
  const list = document.getElementById("researchList");
  if (!list) return;

  const iconMicro =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 3h6v4H9zM10 8h4M7 20a3 3 0 0 0 3-3V8h4v9a3 3 0 0 0 3 3M10 14h4"></path></svg>';
  const iconBook =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>';
  const iconArrow =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>';

  const research = [
    {
      icon: iconMicro,
      tag: "Independent Research",
      title: "MOI-Lite + E-SATF: Lightweight Hierarchical IDS for IoT",
      subtitle: "Manuscript in preparation for IEEE submission",
      year: "2026",
      chip: "chip-mint-bg",
      tagColor: "text-mint",
      description:
        "Designed a lightweight two-stage intrusion detection architecture combining multi-scale dilated 1D-CNN blocks with lightweight self-attention for malicious IoT traffic classification across TON-IoT, UNSW-NB15, and CIC-IDS2017.",
      highlights: [
        "Achieved 99.79% binary F1 and 94.37% multiclass macro F1 in the reported benchmark.",
        "Reduced the model footprint to 65 KB through INT8 quantization for edge-oriented deployment.",
        "Evaluated SHAP explanation stability, FGSM robustness, cross-dataset generalization, statistical comparisons, and inference latency.",
      ],
      links: [
        { label: "GitHub", href: "https://github.com/IsratMou/IDS-moi" },
        { label: "Live Demo", href: "https://huggingface.co/spaces/MOUcat/iot-intrusion-detection-dashboard" },
      ],
    },
    {
      icon: iconBook,
      tag: "B.Sc. Thesis · Final-Year Project",
      title:
        "Multi-Stage Hybrid Architecture for Real-Time Surveillance Threat Detection",
      subtitle: "YOLOv11 + Video Swin Transformer + Risk Fusion",
      year: "2026",
      chip: "chip-pink-bg",
      tagColor: "text-pink",
      description:
        "Engineered a hybrid deep learning pipeline combining YOLOv11 for weapon/object detection with Video Swin Transformer for spatio-temporal abnormal-behavior recognition and a risk-fusion layer for graded threat assessment.",
      highlights: [
        "Combines spatial object detection with temporal behavior recognition for surveillance threat analysis.",
        "Uses risk fusion and graded threat assessment to support real-time triage rather than binary alerts.",
        "Defined a 9-failure-mode ablation protocol to stress-test the pipeline ahead of thesis defense.",
      ],
    },
  ];

  list.innerHTML = research
    .map(
      (r, i) => `
    <article class="research-card reveal" style="transition-delay: ${i * 0.1}s">
      <div class="research-header">
        <div class="research-title-wrap">
          <span class="research-icon ${r.chip}">${r.icon}</span>
          <div>
            <span class="research-tag ${r.tagColor}">${r.tag}</span>
            <h3>${r.title}</h3>
            <p class="research-subtitle">${r.subtitle}</p>
          </div>
        </div>
        <span class="research-year">${r.year}</span>
      </div>
      <p>${r.description}</p>
      <ul class="research-highlights">
        ${r.highlights
          .map(
            (h) => `
          <li><span class="${r.tagColor}">${iconArrow}</span><span>${h}</span></li>
        `,
          )
          .join("")}
      </ul>
      ${r.links ? `<div class="research-links">${r.links.map((l) => `<a href="${l.href}" target="_blank" rel="noopener noreferrer">${l.label} ${iconArrow}</a>`).join("")}</div>` : ""}
    </article>
  `,
    )
    .join("");

  document.querySelectorAll(".research-card.reveal").forEach((el) => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" },
    );
    obs.observe(el);
  });
})();

/* ============== PROJECTS ============== */
(function initProjects() {
  const aiContainer = document.getElementById("projectsAI");
  const seContainer = document.getElementById("projectsSE");
  if (!aiContainer || !seContainer) return;

  const iconBar =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="20" x2="12" y2="10"></line><line x1="18" y1="20" x2="18" y2="4"></line><line x1="6" y1="20" x2="6" y2="16"></line></svg>';
  const iconShield =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>';
  const iconSiren =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 18a5 5 0 0 1 10 0M12 2v3M5.6 5.6l2.1 2.1M2 13h3M19 13h3M16.4 5.6l-2.1 2.1M3 18h18"></path></svg>';
  const iconCart =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>';
  const iconSpark =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l1.9 5.8a2 2 0 0 0 1.3 1.3L21 12l-5.8 1.9a2 2 0 0 0-1.3 1.3L12 21l-1.9-5.8a2 2 0 0 0-1.3-1.3L3 12l5.8-1.9a2 2 0 0 0 1.3-1.3L12 3z"></path></svg>';
  const iconFile =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>';
  const iconExternal =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>';

  const aiProjects = [
    {
      icon: iconBar,
      title: "Employee Attrition Risk Predictor",
      category: "AI / ML",
      year: "2026",
      description:
        "End-to-end HR attrition prediction system using ColumnTransformer preprocessing, training-only SMOTE, Logistic Regression, stratified 5-fold cross-validation, precision-recall threshold tuning, SHAP LinearExplainer, and Streamlit deployment.",
      stack: ["Python", "Scikit-learn", "SMOTE", "SHAP", "Streamlit"],
      chip: "chip-mint-bg",
      links: [
        {
          label: "GitHub",
          href: "https://github.com/IsratMou/HR_Attrition_App",
        },
        {
          label: "Live Demo",
          href: "https://hr-attrition-app123.streamlit.app/",
        },
      ],
    },
    {
      icon: iconShield,
      title: "MOI-Lite + E-SATF IoT IDS",
      category: "Research / Security",
      year: "2026",
      description:
        "Lightweight hierarchical intrusion-detection research combining dilated 1D-CNN blocks and lightweight self-attention, with SHAP stability analysis, FGSM robustness, cross-dataset evaluation, statistical comparison, and INT8 quantization.",
      stack: ["PyTorch", "SHAP", "TON-IoT", "UNSW-NB15", "CIC-IDS2017"],
      chip: "chip-pink-bg",
      links: [{ label: "GitHub", href: "https://github.com/IsratMou/IDS-moi" }],
    },
    {
      icon: iconSiren,
      title: "Real-Time Surveillance Threat Detection",
      category: "Computer Vision / Thesis",
      year: "2026",
      description:
        "Multi-stage surveillance pipeline combining YOLOv11 weapon/object detection with Video Swin Transformer spatio-temporal abnormal-behavior recognition and risk fusion for graded threat assessment.",
      stack: [
        "PyTorch",
        "YOLOv11",
        "Video Swin Transformer",
        "Computer Vision",
      ],
      chip: "chip-butter-bg",
    },
  ];

  const seProjects = [
    {
      icon: iconCart,
      title: "Glam Girl",
      category: "Full-stack Web",
      year: "2025",
      description:
        "Full-stack eCommerce platform with a Django and Django REST Framework backend and React frontend, including product, cart, and order modules.",
      stack: ["Django", "Django REST Framework", "React", "SQLite"],
      chip: "chip-butter-bg",
      links: [
        { label: "GitHub", href: "https://github.com/IsratMou/GlamGirl" },
      ],
    },
    {
      icon: iconSpark,
      title: "AI Rasengan: Chakra Control System",
      category: "Computer Vision / Interactive Web",
      year: "2026",
      description:
        "Browser-based computer-vision interaction using webcam hand landmarks, gesture classification, and a Canvas particle engine with a lightweight mode for real-time interaction.",
      stack: ["JavaScript", "MediaPipe Hands", "HTML5 Canvas"],
      chip: "chip-mint-bg",
      links: [
        {
          label: "GitHub",
          href: "https://github.com/IsratMou/hand_particles_rasengun",
        },
        {
          label: "Live Demo",
          href: "https://6a1c76420f21ac57f8b21635--symphonious-pixie-46186a.netlify.app/",
        },
      ],
    },
    {
      icon: iconFile,
      title: "Text Analyzer Pro",
      category: "Python Utility",
      year: "2026",
      description:
        "Desktop and CLI text-analysis tool supporting word-frequency statistics, search, JSON/TXT export, and automated testing.",
      stack: ["Python", "Tkinter", "CLI", "Pytest"],
      chip: "chip-pink-bg",
      links: [],
    },
    {
      icon: iconFile,
      title: "SQL Practice",
      category: "Database",
      year: "2026",
      description:
        "MySQL practice covering relational schema design, DDL/DML, constraints, joins, filtering, sorting, aggregation, and string functions.",
      stack: ["MySQL", "SQL"],
      chip: "chip-sky-bg",
      links: [],
    },
  ];

  function renderProject(p, i, compact = false) {
    return `
      <article class="project-card ${compact ? "compact" : "ai"} reveal" style="transition-delay: ${i * 0.08}s">
        <div class="project-card-header">
          <span class="project-icon ${p.chip}">${p.icon}</span>
          <span class="project-category">${p.category}</span>
        </div>
        <div><h4>${p.title}</h4><span class="project-year">${p.year}</span></div>
        <p class="project-desc">${p.description}</p>
        <div class="project-stack">${p.stack.map((s) => `<span>${s}</span>`).join("")}</div>
        ${p.links ? `<div class="project-links">${p.links.map((l) => `<a href="${l.href}" target="_blank" rel="noopener noreferrer">${l.label} ${iconExternal}</a>`).join("")}</div>` : ""}
      </article>`;
  }

  aiContainer.innerHTML = aiProjects
    .map((p, i) => renderProject(p, i, false))
    .join("");
  seContainer.innerHTML = seProjects
    .map((p, i) => renderProject(p, i, true))
    .join("");

  document.querySelectorAll(".project-card.reveal").forEach((el) => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -50px 0px" },
    );
    obs.observe(el);
  });
})();

/* ============== CONTACT ITEMS ============== */
(function initContactItems() {
  const container = document.getElementById("contactItems");
  if (!container) return;

  const iconMail =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>';
  const iconPhone =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>';
  const iconPin =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>';
  const iconGithub =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>';
  const iconLinkedin =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>';
  const iconHf =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="9" y1="13" x2="15" y2="13"></line><line x1="9" y1="17" x2="15" y2="17"></line></svg>';
  const iconExternal =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>';

  const items = [
    {
      icon: iconMail,
      label: "Email",
      value: "israt.mou96@gmail.com",
      href: "mailto:israt.mou96@gmail.com",
      accent: "chip-sky-bg",
      external: false,
    },
    {
      icon: iconPhone,
      label: "Phone",
      value: "+880 1841-620292",
      href: "tel:+8801841620292",
      accent: "chip-butter-bg",
      external: false,
    },
    {
      icon: iconPin,
      label: "Location",
      value: "Dhaka, Bangladesh",
      sub: "Open to remote · willing to relocate",
      accent: "chip-pink-bg",
      external: false,
    },
    {
      icon: iconGithub,
      label: "GitHub",
      value: "@IsratMou",
      href: "https://github.com/IsratMou",
      accent: "chip-mint-bg",
      external: true,
    },
    {
      icon: iconLinkedin,
      label: "LinkedIn",
      value: "israt-jahan-mou",
      href: "https://www.linkedin.com/in/israt-jahan-mou-a80007366",
      accent: "chip-sky-bg",
      external: true,
    },
    {
      icon: iconHf,
      label: "Hugging Face",
      value: "MOUcat",
      href: "https://huggingface.co/MOUcat",
      accent: "chip-pink-bg",
      external: true,
    },
  ];

  container.innerHTML = items
    .map((item, i) => {
      const Tag = item.href ? "a" : "div";
      const extAttrs = item.href
        ? item.external
          ? ' target="_blank" rel="noopener noreferrer"'
          : ""
        : "";
      return `
      <${Tag} class="contact-item reveal" style="transition-delay: ${i * 0.05}s" ${item.href ? `href="${item.href}"` : ""}${extAttrs}>
        <span class="contact-item-icon ${item.accent}">${item.icon}</span>
        <div class="contact-item-info">
          <span class="contact-item-label">${item.label}</span>
          <span class="contact-item-value">${item.value}</span>
          ${item.sub ? `<span class="contact-item-sub">${item.sub}</span>` : ""}
        </div>
        ${item.external ? `<span class="contact-item-external">${iconExternal}</span>` : ""}
      </${Tag}>
    `;
    })
    .join("");

  document.querySelectorAll(".contact-item.reveal").forEach((el) => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -30px 0px" },
    );
    obs.observe(el);
  });
})();

/* ============== CONTACT FORM (mailto) ============== */
(function initContactForm() {
  const form = document.getElementById("contactForm");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const name = data.get("name") || "";
    const email = data.get("email") || "";
    const message = data.get("message") || "";
    const subject = encodeURIComponent(`Portfolio contact — ${name}`);
    const body = encodeURIComponent(
      `${message}\n\n— ${name}\nReply to: ${email}`,
    );
    window.location.href = `mailto:israt.mou96@gmail.com?subject=${subject}&body=${body}`;
  });
})();

/* ============== YEAR IN FOOTER ============== */
(function initYear() {
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
  document
    .querySelector(".footer")
    .setAttribute("data-year", new Date().getFullYear());

  // "Last updated" — uses the browser's lastModified string, which
  // GitHub Pages sets to the build time of index.html. Falls back to
  // the current month if lastModified is empty or epoch (some hosts).
  const updatedEl = document.getElementById("lastUpdated");
  if (updatedEl) {
    let lastMod;
    try {
      lastMod = new Date(document.lastModified);
    } catch (e) {
      lastMod = new Date();
    }
    const isValid =
      lastMod &&
      !isNaN(lastMod.getTime()) &&
      lastMod.getTime() > 0 &&
      lastMod.getFullYear() > 2000;
    const d = isValid ? lastMod : new Date();
    updatedEl.textContent = d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
    });
  }
})();
