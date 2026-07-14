/* ============================================================
   Annotations tour
   Walks through the spec annotations from
   resources/matter-story-annotated-v2.html, mapped onto the
   live sections of this page. Purely additive/overlay — creates
   its own DOM and reads layout via getBoundingClientRect, and
   never modifies existing elements' classes or styles.
   ============================================================ */
(function () {
  var STORAGE_KEY = "dpAnnotationsActive";

  var STEPS = [
    {
      id: "intro",
      eyebrow: "Annotations Tour Introduction",
      title: "Matter Case Study Template",
      body: "Deloitte and BCG share the same clients with the same confidentiality restrictions, but publish anonymized client stories that AI engines cite regularly. This page shows what the same approach looks like as a Davis Polk matter story. The numbered markers in this tour flag what each section still needs — they're a reference layer only and won't ship on the live page.",
      items: [],
      selector: null
    },
    {
      id: 1,
      eyebrow: "Element 1 — The matter headline",
      items: [
        "Deal Type + Sector + Key Challenge/Distinction, in that order",
        "12 words or fewer",
        "Must answer a question a GC would actually type into an AI engine"
      ],
      selector: ".headline"
    },
    {
      id: 2,
      eyebrow: "Element 2 — The matter summary (“first 30%”)",
      items: [
        "100–150 words, three sentences max",
        "Structure: Situation → Complexity → Significance",
        "Opens with deal type and sector — never “Davis Polk represented...”"
      ],
      selector: ".summary"
    },
    {
      id: 3,
      eyebrow: "Element 3 — Matter type tags",
      items: [
        "3–5 tags spanning Deal Type, Industry Sector, Jurisdiction/Regulator, and Complexity Signal",
        "Every tag linked to its practice or industry hub page — not a plain label"
      ],
      selector: ".tag-block"
    },
    {
      id: 4,
      eyebrow: "Element 4 (surfaced early) — The outcome",
      items: [
        "At least one specific, quantified fact stated as standalone data — not buried in a paragraph",
        "If no hard number exists, use a comparative claim (“faster than typical,” “fewer conditions than average”)"
      ],
      selector: ".stat-strip__heading"
    },
    {
      id: 5,
      eyebrow: "Element 5 — The situation",
      items: [
        "150–250 words, two to three paragraphs",
        "Client identified only by sector, size range, and general description (e.g., “a Nasdaq-listed pharmaceutical company with annual revenue exceeding $4 billion”)",
        "Named regulatory counterparties are fine — regulators are public entities"
      ],
      selector: "#situation .section-content"
    },
    {
      id: 6,
      eyebrow: "Element 6 — The Davis Polk approach",
      items: [
        "200–350 words, split into named sub-sections (Regulatory Strategy · Structuring · Coordination, etc.)",
        "If partner consents: “Led by [Partner Name], [Title], with support from [name/title]” — the attorney→matter→practice link AI engines need"
      ],
      selector: "#approach .section-content"
    },
    {
      id: 7,
      eyebrow: "Element 7 — The outcome (full)",
      items: [
        "100–150 words",
        "At least one specific, quantified fact — a closing timeline, approval duration, recovery percentage, or premium",
        "A durability signal where available — a citation, precedent, or model-for-future-deals claim"
      ],
      selector: "#outcome .section-content"
    },
    {
      id: 8,
      eyebrow: "Element 8 — Related resources",
      items: [
        "3–5 cross-links minimum, spanning Practice Areas, Industries, and related Insights",
        "Every link should be a real, live destination page — not a placeholder"
      ],
      selector: "#related .related-inner"
    }
  ];

  var state = {
    active: false,
    index: 0,
    markers: [],
    highlight: null,
    panel: null,
    toggle: null,
    ticking: false
  };

  function createToggle() {
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "annot-toggle";
    btn.setAttribute("aria-pressed", "false");
    btn.innerHTML =
      '<span class="annot-toggle__dot" aria-hidden="true"></span><span>Annotations</span>';
    btn.addEventListener("click", function () {
      setActive(!state.active);
    });
    document.body.appendChild(btn);
    state.toggle = btn;
  }

  function buildTour() {
    if (state.panel) return;

    var ring = document.createElement("div");
    ring.className = "annot-highlight";
    document.body.appendChild(ring);
    state.highlight = ring;

    STEPS.forEach(function (step) {
      if (!step.selector) {
        state.markers.push(null);
        return;
      }
      var target = document.querySelector(step.selector);
      if (!target) {
        state.markers.push(null);
        return;
      }
      var marker = document.createElement("button");
      marker.type = "button";
      marker.className = "annot-marker";
      marker.textContent = String(step.id);
      marker.setAttribute("aria-label", "Annotation " + step.id + ": " + step.eyebrow);
      marker.addEventListener("click", function () {
        setStep(STEPS.indexOf(step));
      });
      document.body.appendChild(marker);
      state.markers.push({ el: marker, target: target });
    });

    var panel = document.createElement("div");
    panel.className = "annot-panel";
    panel.setAttribute("role", "dialog");
    panel.setAttribute("aria-label", "Annotations tour");
    panel.innerHTML =
      '<div class="annot-panel__head">' +
        '<span class="n" data-role="badge"></span>' +
        '<span class="label" data-role="eyebrow"></span>' +
        '<span class="annot-panel__close" data-role="close" role="button" tabindex="0" aria-label="Close annotations">×</span>' +
      "</div>" +
      '<div class="annot-panel__body">' +
        '<div class="annot-panel__title" data-role="title"></div>' +
        '<p class="annot-panel__text" data-role="text"></p>' +
        '<ul class="annot-panel__list" data-role="list"></ul>' +
      "</div>" +
      '<div class="annot-panel__foot">' +
        '<button type="button" class="annot-panel__btn annot-panel__btn--restart" data-role="restart" aria-label="Restart tour" title="Restart tour">' +
          '<svg class="annot-panel__restart-icon" viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden="true"><path d="M17.65 6.35A7.958 7.958 0 0 0 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/></svg>' +
          "Restart" +
        "</button>" +
        '<span class="annot-panel__step" data-role="step"></span>' +
        '<div class="annot-panel__nav">' +
          '<button type="button" class="annot-panel__btn" data-role="prev">Back</button>' +
          '<button type="button" class="annot-panel__btn annot-panel__btn--primary" data-role="next">Next</button>' +
        "</div>" +
      "</div>";
    document.body.appendChild(panel);
    state.panel = panel;

    panel.querySelector('[data-role="close"]').addEventListener("click", function () {
      setActive(false);
    });
    panel.querySelector('[data-role="restart"]').addEventListener("click", function () {
      setStep(0);
    });
    panel.querySelector('[data-role="prev"]').addEventListener("click", function () {
      setStep(state.index - 1);
    });
    panel.querySelector('[data-role="next"]').addEventListener("click", function () {
      if (state.index >= STEPS.length - 1) {
        setActive(false);
      } else {
        setStep(state.index + 1);
      }
    });
  }

  function teardownTour() {
    state.markers.forEach(function (m) {
      if (m) m.el.remove();
    });
    state.markers = [];
    if (state.highlight) {
      state.highlight.remove();
      state.highlight = null;
    }
    if (state.panel) {
      state.panel.remove();
      state.panel = null;
    }
  }

  function renderPanel(step, i) {
    var panel = state.panel;
    var badgeEl = panel.querySelector('[data-role="badge"]');
    if (step.id === "intro") {
      badgeEl.style.display = "none";
    } else {
      badgeEl.style.display = "";
      badgeEl.textContent = String(step.id);
    }
    panel.querySelector('[data-role="eyebrow"]').textContent = step.eyebrow;

    var titleEl = panel.querySelector('[data-role="title"]');
    var textEl = panel.querySelector('[data-role="text"]');
    var listEl = panel.querySelector('[data-role="list"]');

    if (step.title) {
      titleEl.style.display = "";
      titleEl.textContent = step.title;
    } else {
      titleEl.style.display = "none";
      titleEl.textContent = "";
    }

    if (step.body) {
      textEl.style.display = "";
      textEl.textContent = step.body;
    } else {
      textEl.style.display = "none";
      textEl.textContent = "";
    }

    listEl.innerHTML = "";
    if (step.items && step.items.length) {
      listEl.style.display = "";
      step.items.forEach(function (text) {
        var li = document.createElement("li");
        li.textContent = text;
        listEl.appendChild(li);
      });
    } else {
      listEl.style.display = "none";
    }

    panel.querySelector('[data-role="step"]').textContent = (i + 1) + " / " + STEPS.length;
    panel.querySelector('[data-role="prev"]').disabled = i === 0;
    panel.querySelector('[data-role="restart"]').disabled = i === 0;
    panel.querySelector('[data-role="next"]').textContent = i === STEPS.length - 1 ? "Done" : "Next";
  }

  function positionAll() {
    state.markers.forEach(function (m) {
      if (!m) return;
      var rect = m.target.getBoundingClientRect();
      m.el.style.top = rect.top + window.scrollY + "px";
      m.el.style.left = rect.left + window.scrollX + "px";
    });

    var step = STEPS[state.index];
    if (step.selector) {
      var target = document.querySelector(step.selector);
      if (target) {
        var r = target.getBoundingClientRect();
        state.highlight.style.top = r.top + window.scrollY - 8 + "px";
        state.highlight.style.left = r.left + window.scrollX - 8 + "px";
        state.highlight.style.width = r.width + 16 + "px";
        state.highlight.style.height = r.height + 16 + "px";
        state.highlight.classList.add("is-visible");
      }
    } else {
      state.highlight.classList.remove("is-visible");
    }
  }

  function setStep(i) {
    if (i < 0) i = 0;
    if (i > STEPS.length - 1) i = STEPS.length - 1;
    state.index = i;
    var step = STEPS[i];

    state.markers.forEach(function (m) {
      if (!m) return;
      m.el.classList.remove("is-active");
    });
    var activeMarker = state.markers[i];
    if (activeMarker) activeMarker.el.classList.add("is-active");

    renderPanel(step, i);
    positionAll();

    if (step.selector) {
      var target = document.querySelector(step.selector);
      if (target) target.scrollIntoView({ behavior: "smooth", block: "center" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  function onScroll() {
    if (!state.ticking) {
      window.requestAnimationFrame(function () {
        positionAll();
        state.ticking = false;
      });
      state.ticking = true;
    }
  }

  function onResize() {
    positionAll();
  }

  function onKeydown(event) {
    if (event.key === "Escape") {
      setActive(false);
    } else if (event.key === "ArrowRight") {
      setStep(state.index + 1);
    } else if (event.key === "ArrowLeft") {
      setStep(state.index - 1);
    }
  }

  function setActive(active) {
    state.active = active;
    state.toggle.setAttribute("aria-pressed", String(active));
    try {
      localStorage.setItem(STORAGE_KEY, active ? "1" : "0");
    } catch (e) {}

    if (active) {
      buildTour();
      setStep(state.index);
      window.addEventListener("resize", onResize);
      window.addEventListener("scroll", onScroll, { passive: true });
      document.addEventListener("keydown", onKeydown);
    } else {
      teardownTour();
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("keydown", onKeydown);
    }
  }

  createToggle();

  var resume;
  try {
    resume = localStorage.getItem(STORAGE_KEY) === "1";
  } catch (e) {
    resume = false;
  }
  if (resume) setActive(true);
})();
