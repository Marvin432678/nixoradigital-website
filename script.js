// EmailJS configuration for direct website submissions.
// 1. Create an EmailJS account and connect the receiving inbox.
// 2. Create one template for the request to nixoradigital10@gmail.com.
// 3. Create one auto-reply template for the customer.
// 4. Paste the values below. The visitor will never see these labels.
const EMAILJS_CONFIG = {
  publicKey: "",
  serviceId: "",
  requestTemplateId: "",
  confirmationTemplateId: ""
};

const DIRECT_FORM_ENDPOINT = "https://formsubmit.co/ajax/nixoradigital10@gmail.com";
const NIXORA_CHAT_WEBHOOK = "https://jul1us.app.n8n.cloud/webhook/3e0e3b0a-d8b6-4c57-ae3a-412f0fe97b60";

const header = document.querySelector("[data-header]");
const nav = document.querySelector("[data-nav]");
const navToggle = document.querySelector("[data-nav-toggle]");
const navLinks = document.querySelectorAll(".site-nav a");
const sections = document.querySelectorAll("main section[id]");
const revealItems = document.querySelectorAll(".reveal");
const counters = document.querySelectorAll("[data-count]");
const magneticItems = document.querySelectorAll(".magnetic");
const parallaxItems = document.querySelectorAll("[data-parallax]");
const tiltItems = document.querySelectorAll(".service-card, .metric-card, .case-card, .about-copy, .about-visual, .contact-form");
const form = document.querySelector("[data-form]");
const formStatus = document.querySelector("[data-form-status]");
const particleCanvas = document.querySelector("[data-particles]");
const processStream = document.querySelector(".process-stream");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
let lastStreamImpulse = 0;
const COOKIE_STORAGE_KEY = "nixora_cookie_choice";
const CHAT_SESSION_KEY = "nixora_chat_session";
const CONTACT_FORM_REPLY =
  "Sehr gerne. Nutzen Sie einfach unser Kontaktformular und beschreiben Sie kurz Ihr Vorhaben. Wir melden uns anschließend persönlich bei Ihnen zurück.";
const CONTACT_INTENT_PATTERNS = [
  /\btermin(?:e|s)?\b/i,
  /\bangebot(?:e|s)?\b/i,
  /\b(?:preis(?:e|en)?|kosten|budget|kostet|kostenpunkt)\b/i,
  /\b(?:zusammenarbeit(?:en)?|zusammen\s+arbeiten|kooperation|beauftrag(?:en|ung)|auftrag|projekt\s+starten)\b/i,
  /\b(?:verfügbar(?:keit|e|en)?|freie[rn]?\s+(?:zeit|slot)|wann\s+(?:habt|hättet|könntet)\s+ihr)\b/i,
  /\b(?:montag|dienstag|mittwoch|donnerstag|freitag|samstag|sonntag|heute|morgen)\b.*\b(?:zeit|frei|passen|können)\b/i
];
const FORBIDDEN_SCHEDULING_REPLY_PATTERN =
  /\b(?:termin\s+(?:buchen|reservieren|vereinbaren|bestätigen)|kalender|freie[rn]?\s+(?:termin|zeit)|verfügbar(?:keit|e|en)?|zeitfenster|eingetragen|reserviert)\b/i;
const FORBIDDEN_TIME_COMMITMENT_PATTERN =
  /\b(?:(?:heute|morgen|montag|dienstag|mittwoch|donnerstag|freitag|samstag|sonntag).{0,40}(?:uhr|passt|frei|können)|\d{1,2}(?::\d{2})?\s*uhr.{0,24}(?:passt|frei|reserviert))\b/i;

const requestsPersonalContact = (message) =>
  CONTACT_INTENT_PATTERNS.some((pattern) => pattern.test(message));

const enforceChatbotRules = (reply) =>
  FORBIDDEN_SCHEDULING_REPLY_PATTERN.test(reply) || FORBIDDEN_TIME_COMMITMENT_PATTERN.test(reply)
    ? CONTACT_FORM_REPLY
    : reply;

if ("scrollRestoration" in window.history) {
  window.history.scrollRestoration = "manual";
}

const forceTopOnInitialLoad = () => {
  if (window.location.hash) {
    window.history.replaceState(null, document.title, `${window.location.pathname}${window.location.search}`);
  }

  window.scrollTo({
    top: 0,
    left: 0,
    behavior: "instant"
  });
};

const scheduleTopReset = () => {
  forceTopOnInitialLoad();
  requestAnimationFrame(forceTopOnInitialLoad);
  setTimeout(forceTopOnInitialLoad, 60);
  setTimeout(forceTopOnInitialLoad, 250);
};

forceTopOnInitialLoad();
document.addEventListener("DOMContentLoaded", scheduleTopReset);
window.addEventListener("pageshow", scheduleTopReset);
window.addEventListener("load", scheduleTopReset);

const hasEmailJsConfig = () =>
  Boolean(
    EMAILJS_CONFIG.publicKey &&
      EMAILJS_CONFIG.serviceId &&
      EMAILJS_CONFIG.requestTemplateId &&
      EMAILJS_CONFIG.confirmationTemplateId
  );

const setHeaderState = () => {
  header?.classList.toggle("is-scrolled", window.scrollY > 18);
};

const closeNavigation = () => {
  document.body.classList.remove("nav-open");
  navToggle?.setAttribute("aria-expanded", "false");
  navToggle?.setAttribute("aria-label", "Navigation öffnen");
};

setHeaderState();
window.addEventListener("scroll", setHeaderState, { passive: true });

navToggle?.addEventListener("click", () => {
  const isOpen = document.body.classList.toggle("nav-open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
  navToggle.setAttribute("aria-label", isOpen ? "Navigation schließen" : "Navigation öffnen");
});

nav?.addEventListener("click", (event) => {
  if (event.target.matches("a")) closeNavigation();
});

document.querySelectorAll(".brand").forEach((brandLink) => {
  brandLink.addEventListener("click", (event) => {
    const target = new URL(brandLink.href, window.location.href);
    const isSamePage = target.pathname === window.location.pathname;

    if (!isSamePage && !target.pathname.endsWith("/index.html")) return;

    event.preventDefault();
    closeNavigation();

    if (!isSamePage) {
      window.location.href = target.pathname;
      return;
    }

    if (window.location.hash) {
      window.history.replaceState(null, document.title, `${window.location.pathname}${window.location.search}`);
    }

    window.scrollTo({
      top: 0,
      left: 0,
      behavior: prefersReducedMotion ? "auto" : "smooth"
    });
  });
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      revealObserver.unobserve(entry.target);
    });
  },
  { threshold: 0.18, rootMargin: "0px 0px -8% 0px" }
);

revealItems.forEach((item, index) => {
  item.style.transitionDelay = `${Math.min(index % 5, 4) * 65}ms`;
  revealObserver.observe(item);
});

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((link) => {
        link.classList.toggle("is-active", link.getAttribute("href") === `#${entry.target.id}`);
      });
    });
  },
  { rootMargin: "-42% 0px -52% 0px" }
);

sections.forEach((section) => sectionObserver.observe(section));

const animateCounter = (counter) => {
  const target = Number(counter.dataset.count);
  const duration = 1300;
  const start = performance.now();

  const tick = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    counter.textContent = String(Math.round(target * eased));
    if (progress < 1) requestAnimationFrame(tick);
  };

  requestAnimationFrame(tick);
};

const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    });
  },
  { threshold: 0.7 }
);

counters.forEach((counter) => counterObserver.observe(counter));

const initGsapMotion = () => {
  if (prefersReducedMotion || !window.gsap) return;

  const gsap = window.gsap;

  if (window.ScrollTrigger) {
    gsap.registerPlugin(window.ScrollTrigger);
    gsap.utils.toArray(".section").forEach((section) => {
      gsap.fromTo(
        section,
        { y: 38, opacity: 0.92 },
        {
          y: 0,
          opacity: 1,
          ease: "power3.out",
          duration: 0.9,
          scrollTrigger: {
            trigger: section,
            start: "top 82%",
            once: true
          }
        }
      );
    });
  }

  gsap.to(".system-node", {
    y: -10,
    duration: 3.8,
    ease: "sine.inOut",
    repeat: -1,
    yoyo: true,
    stagger: 0.22
  });

  gsap.to(".process-stream", {
    y: -26,
    duration: 12,
    ease: "sine.inOut",
    repeat: -1,
    yoyo: true
  });

  gsap.to(".stream-path", {
    strokeDashoffset: -220,
    duration: 14,
    ease: "none",
    repeat: -1,
    stagger: 0.8
  });

  gsap.to(".metric-card", {
    y: -5,
    duration: 3.2,
    ease: "sine.inOut",
    repeat: -1,
    yoyo: true,
    stagger: 0.18
  });

  gsap.to(".module-card", {
    y: -6,
    duration: 3.8,
    ease: "sine.inOut",
    repeat: -1,
    yoyo: true,
    stagger: 0.16
  });

  gsap.to(".section-dataflow span", {
    xPercent: 8,
    duration: 8,
    ease: "sine.inOut",
    repeat: -1,
    yoyo: true,
    stagger: 0.6
  });
};

window.addEventListener("load", initGsapMotion);

window.addEventListener(
  "pointermove",
  (event) => {
    if (prefersReducedMotion) return;

    const now = performance.now();
    if (processStream && now - lastStreamImpulse > 420) {
      lastStreamImpulse = now;
      processStream.classList.add("has-impulse");
      setTimeout(() => processStream.classList.remove("has-impulse"), 520);
    }

    const x = (event.clientX / window.innerWidth - 0.5) * 2;
    const y = (event.clientY / window.innerHeight - 0.5) * 2;
    parallaxItems.forEach((item) => {
      item.style.transform = `translate3d(${x * 14}px, ${y * 10}px, 0)`;
    });
  },
  { passive: true }
);

magneticItems.forEach((item) => {
  item.addEventListener("pointermove", (event) => {
    if (prefersReducedMotion) return;
    const rect = item.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const moveX = (x - rect.width / 2) * 0.13;
    const moveY = (y - rect.height / 2) * 0.13;
    item.style.setProperty("--mx", `${x}px`);
    item.style.setProperty("--my", `${y}px`);
    item.style.transform = `translate3d(${moveX}px, ${moveY}px, 0)`;
  });

  item.addEventListener("pointerleave", () => {
    item.style.transform = "translate3d(0, 0, 0)";
  });
});

tiltItems.forEach((item) => {
  item.addEventListener("pointermove", (event) => {
    if (prefersReducedMotion || window.innerWidth < 860) return;

    const rect = item.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const tiltX = ((x / rect.width) - 0.5) * 7;
    const tiltY = ((y / rect.height) - 0.5) * -7;

    item.style.setProperty("--tilt-x", `${tiltX.toFixed(2)}deg`);
    item.style.setProperty("--tilt-y", `${tiltY.toFixed(2)}deg`);
    item.style.setProperty("--card-x", `${x}px`);
    item.style.setProperty("--card-y", `${y}px`);
  });

  item.addEventListener("pointerleave", () => {
    item.style.setProperty("--tilt-x", "0deg");
    item.style.setProperty("--tilt-y", "0deg");
    item.style.removeProperty("--card-x");
    item.style.removeProperty("--card-y");
  });
});

const setFormStatus = (message, type = "neutral") => {
  formStatus.textContent = message;
  formStatus.classList.toggle("is-error", type === "error");
  formStatus.classList.toggle("is-success", type === "success");
  formStatus.classList.add("is-visible");
};

const validateField = (field) => {
  const row = field.closest(".form-row");
  if (!row) return true;

  const invalid = field.required && !field.checkValidity();
  row.classList.toggle("is-invalid", invalid && field.dataset.touched === "true");
  return !invalid;
};

form?.querySelectorAll("input, select, textarea").forEach((field) => {
  field.addEventListener("blur", () => {
    field.dataset.touched = "true";
    validateField(field);
  });

  field.addEventListener("input", () => {
    if (field.dataset.touched === "true") validateField(field);
  });
});

const createSuccessBurst = () => {
  if (prefersReducedMotion) return;
  const burst = document.createElement("div");
  burst.className = "success-burst";
  burst.setAttribute("aria-hidden", "true");
  form.appendChild(burst);
  setTimeout(() => burst.remove(), 1300);
};

form?.addEventListener("submit", async (event) => {
  event.preventDefault();

  const fields = [...form.querySelectorAll("input, select, textarea")];
  fields.forEach((field) => {
    field.dataset.touched = "true";
    validateField(field);
  });

  if (!form.checkValidity()) {
    setFormStatus("Bitte prüfen Sie die markierten Felder.", "error");
    return;
  }

  const submitButton = form.querySelector("button[type='submit']");
  const originalText = submitButton.querySelector("span").textContent;
  const formData = new FormData(form);
  const payload = Object.fromEntries(formData.entries());

  submitButton.disabled = true;
  submitButton.querySelector("span").textContent = "Wird gesendet...";

  try {
    if (window.emailjs && hasEmailJsConfig()) {
      emailjs.init({ publicKey: EMAILJS_CONFIG.publicKey });
      await emailjs.send(EMAILJS_CONFIG.serviceId, EMAILJS_CONFIG.requestTemplateId, payload);
      await emailjs.send(EMAILJS_CONFIG.serviceId, EMAILJS_CONFIG.confirmationTemplateId, payload);
    } else {
      const response = await fetch(DIRECT_FORM_ENDPOINT, {
        method: "POST",
        body: formData,
        headers: { Accept: "application/json" }
      });

      if (!response.ok) throw new Error("Direct form endpoint failed");
    }

    setFormStatus("Vielen Dank. Ihre Anfrage wurde erfolgreich gesendet.", "success");
    createSuccessBurst();
    form.reset();
    fields.forEach((field) => {
      field.dataset.touched = "false";
      field.closest(".form-row")?.classList.remove("is-invalid");
    });
  } catch (error) {
    setFormStatus("Ihre Anfrage konnte gerade nicht direkt gesendet werden. Bitte versuchen Sie es später erneut oder nutzen Sie WhatsApp.");
  } finally {
    submitButton.disabled = false;
    submitButton.querySelector("span").textContent = originalText;
  }
});

const initCookieBanner = () => {
  const storage = {
    get: () => {
      try {
        return localStorage.getItem(COOKIE_STORAGE_KEY);
      } catch (error) {
        return null;
      }
    },
    set: (value) => {
      try {
        localStorage.setItem(COOKIE_STORAGE_KEY, value);
      } catch (error) {
        return null;
      }
      return value;
    }
  };

  if (storage.get()) return;

  const banner = document.createElement("section");
  banner.className = "cookie-banner";
  banner.setAttribute("aria-label", "Cookie-Hinweis");
  banner.innerHTML = `
    <div class="cookie-inner">
      <div class="cookie-copy">
        <strong>Cookie-Einstellungen</strong>
        <p>Wir nutzen notwendige Speicherfunktionen für den Betrieb der Website. Optionale Analyse- oder Marketing-Cookies werden erst nach Ihrer Zustimmung aktiviert.</p>
      </div>
      <div class="cookie-actions">
        <button class="cookie-button primary" type="button" data-cookie-accept>Alle akzeptieren</button>
        <button class="cookie-button" type="button" data-cookie-necessary>Nur notwendige Cookies</button>
        <button class="cookie-button" type="button" data-cookie-settings aria-expanded="false">Einstellungen</button>
      </div>
    </div>
    <div class="cookie-settings">
      <div class="cookie-option">
        <div>
          <strong>Notwendig</strong>
          <span>Speichert Ihre Cookie-Auswahl und stellt Basisfunktionen bereit.</span>
        </div>
        <button class="cookie-switch is-active" type="button" disabled aria-label="Notwendige Cookies aktiv"></button>
      </div>
      <div class="cookie-option">
        <div>
          <strong>Analyse optional</strong>
          <span>Derzeit nicht aktiv. Zukünftige Analyse-Tools werden nur nach Zustimmung geladen.</span>
        </div>
        <button class="cookie-switch" type="button" data-cookie-toggle aria-pressed="false" aria-label="Optionale Analyse Cookies"></button>
      </div>
      <div class="cookie-actions">
        <button class="cookie-button primary" type="button" data-cookie-save>Auswahl speichern</button>
      </div>
    </div>
  `;

  document.body.appendChild(banner);
  requestAnimationFrame(() => banner.classList.add("is-visible"));

  const saveChoice = (choice) => {
    storage.set(JSON.stringify({ ...choice, savedAt: new Date().toISOString() }));
    banner.classList.remove("is-visible");
    setTimeout(() => banner.remove(), 260);
  };

  const settingsButton = banner.querySelector("[data-cookie-settings]");
  const optionalToggle = banner.querySelector("[data-cookie-toggle]");

  banner.querySelector("[data-cookie-accept]")?.addEventListener("click", () => {
    optionalToggle?.classList.add("is-active");
    optionalToggle?.setAttribute("aria-pressed", "true");
    saveChoice({ necessary: true, analytics: true });
  });

  banner.querySelector("[data-cookie-necessary]")?.addEventListener("click", () => {
    saveChoice({ necessary: true, analytics: false });
  });

  settingsButton?.addEventListener("click", () => {
    const isOpen = banner.classList.toggle("show-settings");
    settingsButton.setAttribute("aria-expanded", String(isOpen));
  });

  optionalToggle?.addEventListener("click", () => {
    const isActive = optionalToggle.classList.toggle("is-active");
    optionalToggle.setAttribute("aria-pressed", String(isActive));
  });

  banner.querySelector("[data-cookie-save]")?.addEventListener("click", () => {
    saveChoice({ necessary: true, analytics: optionalToggle?.classList.contains("is-active") || false });
  });
};

initCookieBanner();

const getChatSessionId = () => {
  try {
    const existing = sessionStorage.getItem(CHAT_SESSION_KEY);
    if (existing) return existing;
    const id = `nixora-${Date.now()}-${Math.random().toString(16).slice(2)}`;
    sessionStorage.setItem(CHAT_SESSION_KEY, id);
    return id;
  } catch (error) {
    return `nixora-${Date.now()}`;
  }
};

const extractBotReply = async (response) => {
  const contentType = response.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    const data = await response.json();
    if (typeof data === "string") return data;
    if (Array.isArray(data)) {
      const first = data[0] || {};
      return first.reply || first.answer || first.output || first.text || first.message || JSON.stringify(first);
    }
    return data.reply || data.answer || data.output || data.text || data.message || JSON.stringify(data);
  }

  return response.text();
};

const initChatbot = () => {
  if (document.querySelector("[data-chatbot]")) return;

  const chatbot = document.createElement("section");
  chatbot.className = "chatbot";
  chatbot.setAttribute("data-chatbot", "");
  chatbot.setAttribute("aria-label", "NIXORA DIGITAL Chatbot");
  chatbot.innerHTML = `
    <button class="chatbot-toggle magnetic" type="button" aria-expanded="false" aria-label="Chat öffnen" data-chat-toggle>
      <span class="chatbot-toggle-icon" aria-hidden="true"></span>
      <span class="chatbot-toggle-text">Chat</span>
    </button>
    <div class="chatbot-panel" role="dialog" aria-modal="false" aria-labelledby="chatbot-title" data-chat-panel>
      <div class="chatbot-header">
        <div>
          <span>NIXORA DIGITAL</span>
          <strong id="chatbot-title">Digital Assistant</strong>
        </div>
        <button class="chatbot-close" type="button" aria-label="Chat schließen" data-chat-close></button>
      </div>
      <div class="chatbot-status">
        <span></span>
        Online für erste Fragen
      </div>
      <div class="chatbot-messages" data-chat-messages aria-live="polite">
        <div class="chat-message bot">
          <p>Hallo, ich bin der digitale Assistent von NIXORA DIGITAL. Wobei darf ich helfen?</p>
        </div>
      </div>
      <form class="chatbot-form" data-chat-form>
        <label class="sr-only" for="chatbot-input">Nachricht</label>
        <textarea id="chatbot-input" name="message" rows="1" placeholder="Nachricht schreiben..." autocomplete="off" required data-chat-input></textarea>
        <button class="chatbot-send" type="submit" aria-label="Nachricht senden">
          <span></span>
        </button>
      </form>
      <p class="chatbot-note">Keine vertraulichen Daten eingeben. Für Projekte nutzen Sie bitte das Kontaktformular.</p>
    </div>
  `;

  const chatbotHost = document.querySelector("[data-chatbot-host]");
  (chatbotHost || document.body).appendChild(chatbot);

  const toggle = chatbot.querySelector("[data-chat-toggle]");
  const closeButton = chatbot.querySelector("[data-chat-close]");
  const formElement = chatbot.querySelector("[data-chat-form]");
  const input = chatbot.querySelector("[data-chat-input]");
  const messages = chatbot.querySelector("[data-chat-messages]");
  const sendButton = chatbot.querySelector(".chatbot-send");
  const sessionId = getChatSessionId();

  const setOpen = (isOpen) => {
    chatbot.classList.toggle("is-open", isOpen);
    toggle.setAttribute("aria-expanded", String(isOpen));
    toggle.setAttribute("aria-label", isOpen ? "Chat schließen" : "Chat öffnen");
    if (isOpen) setTimeout(() => input.focus(), 180);
  };

  const scrollMessages = () => {
    messages.scrollTop = messages.scrollHeight;
  };

  const addMessage = (text, type = "bot", options = {}) => {
    const message = document.createElement("div");
    message.className = `chat-message ${type}`;
    const paragraph = document.createElement("p");
    paragraph.textContent = text;
    message.appendChild(paragraph);

    if (options.contactLink) {
      const contactLink = document.createElement("a");
      contactLink.className = "chat-contact-link";
      contactLink.href = "#kontakt";
      contactLink.textContent = "Zum Kontaktformular";
      contactLink.addEventListener("click", () => setOpen(false));
      message.appendChild(contactLink);
    }

    messages.appendChild(message);
    scrollMessages();
    return message;
  };

  const addTyping = () => {
    const typing = document.createElement("div");
    typing.className = "chat-message bot typing";
    typing.innerHTML = "<span></span><span></span><span></span>";
    messages.appendChild(typing);
    scrollMessages();
    return typing;
  };

  const resizeInput = () => {
    input.style.height = "auto";
    input.style.height = `${Math.min(input.scrollHeight, 118)}px`;
  };

  toggle.addEventListener("click", () => setOpen(!chatbot.classList.contains("is-open")));
  closeButton.addEventListener("click", () => setOpen(false));

  input.addEventListener("input", resizeInput);
  input.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" || event.shiftKey) return;
    event.preventDefault();
    formElement.requestSubmit();
  });

  formElement.addEventListener("submit", async (event) => {
    event.preventDefault();
    const text = input.value.trim();
    if (!text) return;

    addMessage(text, "user");
    input.value = "";
    resizeInput();
    input.disabled = true;
    sendButton.disabled = true;
    const typing = addTyping();

    if (requestsPersonalContact(text)) {
      window.setTimeout(() => {
        typing.remove();
        addMessage(CONTACT_FORM_REPLY, "bot", { contactLink: true });
        input.disabled = false;
        sendButton.disabled = false;
        input.focus();
      }, 350);
      return;
    }

    try {
      const response = await fetch(NIXORA_CHAT_WEBHOOK, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json, text/plain;q=0.9, */*;q=0.8"
        },
        body: JSON.stringify({
          message: text,
          sessionId,
          source: "nixora-website",
          page: window.location.href,
          language: "de"
        })
      });

      if (!response.ok) throw new Error("Chat request failed");

      const reply = (await extractBotReply(response)).trim();
      typing.remove();
      const safeReply = enforceChatbotRules(reply);
      const redirectsToContact = safeReply === CONTACT_FORM_REPLY;
      addMessage(safeReply || "Danke für Ihre Nachricht. Ich habe Ihre Anfrage erhalten.", "bot", {
        contactLink: redirectsToContact
      });
    } catch (error) {
      typing.remove();
      addMessage(
        "Danke, Ihre Nachricht wurde aufgenommen. Eine direkte Live-Antwort ist gerade nicht verfügbar. Für eine schnelle Rückmeldung nutzen Sie gern das Kontaktformular oder schreiben Sie an nixoradigital10@gmail.com.",
        "bot error"
      );
    } finally {
      input.disabled = false;
      sendButton.disabled = false;
      input.focus();
    }
  });
};

initChatbot();

const initParticles = () => {
  if (!particleCanvas || prefersReducedMotion) return;

  const context = particleCanvas.getContext("2d");
  const particles = [];
  const particleCount = Math.min(78, Math.max(34, Math.floor(window.innerWidth / 21)));
  let width = 0;
  let height = 0;
  let pixelRatio = 1;

  const resize = () => {
    pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    particleCanvas.width = width * pixelRatio;
    particleCanvas.height = height * pixelRatio;
    particleCanvas.style.width = `${width}px`;
    particleCanvas.style.height = `${height}px`;
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
  };

  const createParticle = () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    vx: (Math.random() - 0.5) * 0.22,
    vy: (Math.random() - 0.5) * 0.22,
    r: Math.random() * 1.7 + 0.8
  });

  resize();
  for (let index = 0; index < particleCount; index += 1) particles.push(createParticle());

  const draw = () => {
    context.clearRect(0, 0, width, height);

    particles.forEach((particle, index) => {
      particle.x += particle.vx;
      particle.y += particle.vy;

      if (particle.x < 0 || particle.x > width) particle.vx *= -1;
      if (particle.y < 0 || particle.y > height) particle.vy *= -1;

      context.beginPath();
      context.arc(particle.x, particle.y, particle.r, 0, Math.PI * 2);
      context.fillStyle = "rgba(91, 127, 255, 0.32)";
      context.fill();

      for (let nextIndex = index + 1; nextIndex < particles.length; nextIndex += 1) {
        const next = particles[nextIndex];
        const distance = Math.hypot(particle.x - next.x, particle.y - next.y);
        if (distance > 130) continue;

        context.beginPath();
        context.moveTo(particle.x, particle.y);
        context.lineTo(next.x, next.y);
        context.strokeStyle = `rgba(212, 175, 55, ${0.12 * (1 - distance / 130)})`;
        context.lineWidth = 1;
        context.stroke();
      }
    });

    requestAnimationFrame(draw);
  };

  window.addEventListener("resize", resize, { passive: true });
  draw();
};

initParticles();
