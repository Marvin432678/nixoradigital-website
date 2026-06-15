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
const tiltItems = document.querySelectorAll(".service-card, .metric-card, .case-card, .about-copy, .about-visual, .contact-form");
const form = document.querySelector("[data-form]");
const formStatus = document.querySelector("[data-form-status]");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const supportsFinePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
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

document.querySelectorAll(".process-stream, .system-lines, .mockup-lines").forEach((graphic) => {
  graphic.pauseAnimations?.();
});

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

let emailJsLoader = null;

const loadEmailJs = () => {
  if (window.emailjs) return Promise.resolve(window.emailjs);
  if (emailJsLoader) return emailJsLoader;

  emailJsLoader = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js";
    script.async = true;
    script.onload = () => resolve(window.emailjs);
    script.onerror = reject;
    document.head.appendChild(script);
  });

  return emailJsLoader;
};

let headerFrame = 0;
let headerIsScrolled = null;

const setHeaderState = () => {
  headerFrame = 0;
  const nextState = window.scrollY > 18;
  if (nextState === headerIsScrolled) return;
  headerIsScrolled = nextState;
  header?.classList.toggle("is-scrolled", window.scrollY > 18);
};

const requestHeaderState = () => {
  if (headerFrame) return;
  headerFrame = requestAnimationFrame(setHeaderState);
};

const closeNavigation = () => {
  document.body.classList.remove("nav-open");
  navToggle?.setAttribute("aria-expanded", "false");
  navToggle?.setAttribute("aria-label", "Navigation öffnen");
};

setHeaderState();
window.addEventListener("scroll", requestHeaderState, { passive: true });

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

if (!prefersReducedMotion && supportsFinePointer) {
  const bindFrameLimitedPointer = (item, update) => {
    let frame = 0;
    let lastEvent = null;

    item.addEventListener(
      "pointermove",
      (event) => {
        lastEvent = event;
        if (frame) return;
        frame = requestAnimationFrame(() => {
          frame = 0;
          update(lastEvent);
        });
      },
      { passive: true }
    );
  };

  magneticItems.forEach((item) => {
    bindFrameLimitedPointer(item, (event) => {
      const rect = item.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      item.style.setProperty("--mx", `${x}px`);
      item.style.setProperty("--my", `${y}px`);
      item.style.transform = `translate3d(${(x - rect.width / 2) * 0.13}px, ${(y - rect.height / 2) * 0.13}px, 0)`;
    });

    item.addEventListener("pointerleave", () => {
      item.style.transform = "translate3d(0, 0, 0)";
    });
  });

  tiltItems.forEach((item) => {
    bindFrameLimitedPointer(item, (event) => {
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
}

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
    if (hasEmailJsConfig()) {
      await loadEmailJs();
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
      <span class="chatbot-toggle-icon" aria-hidden="true">
        <span class="chatbot-toggle-bubble"></span>
      </span>
      <span class="chatbot-toggle-copy">
        <span class="chatbot-toggle-text">Chat</span>
        <span class="chatbot-toggle-subtext">Wir sind online</span>
      </span>
      <span class="chatbot-toggle-online" aria-hidden="true"></span>
    </button>
    <div class="chatbot-panel" role="dialog" aria-modal="false" aria-labelledby="chatbot-title" data-chat-panel>
      <div class="chatbot-header">
        <div class="chatbot-identity">
          <span class="chatbot-logo" aria-hidden="true">
            <svg viewBox="0 0 56 56">
              <defs>
                <linearGradient id="nixoraChatLogo" x1="8" x2="48" y1="6" y2="50">
                  <stop offset="0" stop-color="#1f2937"></stop>
                  <stop offset="0.52" stop-color="#6b5a2a"></stop>
                  <stop offset="1" stop-color="#d4af37"></stop>
                </linearGradient>
              </defs>
              <path d="M28 4 49 16v24L28 52 7 40V16L28 4Z" fill="url(#nixoraChatLogo)"></path>
              <path d="M17 35.5 27.8 16l10.7 19.5" fill="none" stroke="#fff" stroke-width="4.2" stroke-linecap="round" stroke-linejoin="round"></path>
              <path d="M18.5 20.5 38.5 35.5" fill="none" stroke="rgba(255,255,255,.72)" stroke-width="4.2" stroke-linecap="round"></path>
              <circle cx="28" cy="16" r="3.1" fill="#fff"></circle>
              <circle cx="17" cy="35.5" r="3.1" fill="#fff"></circle>
              <circle cx="39" cy="35.5" r="3.1" fill="#f3d577"></circle>
            </svg>
          </span>
          <div class="chatbot-identity-copy">
            <span class="chatbot-brand">NIXORA DIGITAL</span>
            <strong id="chatbot-title">Digital Assistant</strong>
          </div>
        </div>
        <button class="chatbot-close" type="button" aria-label="Chat schließen" data-chat-close>
          <span aria-hidden="true"></span>
        </button>
      </div>
      <div class="chatbot-status">
        <span class="chatbot-status-dot" aria-hidden="true"></span>
        <span class="chatbot-status-text"><strong>Online für erste Fragen</strong><small>Antwortet meist schnell</small></span>
      </div>
      <div class="chatbot-messages" data-chat-messages aria-live="polite">
        <div class="chat-message bot">
          <p>Guten Tag. Ich bin der digitale Assistent von NIXORA DIGITAL. Wie kann ich Sie unterstützen?</p>
        </div>
      </div>
      <form class="chatbot-form" data-chat-form>
        <label class="sr-only" for="chatbot-input">Nachricht</label>
        <textarea id="chatbot-input" name="message" rows="1" placeholder="Ihre Frage an NIXORA..." autocomplete="off" required data-chat-input></textarea>
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

const SERVICE_MODAL_DATA = {
  websites: {
    eyebrow: "Webseiten",
    title: "Digitale Auftritte, die Vertrauen in Anfragen verwandeln.",
    intro: "Vier hochwertige Website-Konzepte für Unternehmen mit unterschiedlichen Zielen und Zielgruppen.",
    type: "website",
    items: [
      {
        title: "Heizungsfirma Hamburg",
        theme: "heating",
        label: "Nordwärme",
        metric: "24/7 Notdienst",
        image: "assets/heizung-preview.webp",
        alt: "Website-Mockup für eine Heizungsfirma in Hamburg",
        features: ["Modernes Unternehmensdesign", "Notdienst-Bereich", "Kontaktformular", "Google Bewertungen", "Terminbuchung"],
        result: "Ein klarer Service-Auftritt, der dringende Anfragen schnell zum richtigen Ansprechpartner führt."
      },
      {
        title: "Immobilienmakler",
        theme: "estate",
        label: "Maison & Co.",
        metric: "16 Objekte",
        image: "assets/immobilien-preview.webp",
        alt: "Website-Mockup für einen Immobilienmakler",
        features: ["Luxus-Immobilien", "Objektübersicht", "Exposé-Anfrage", "Hochwertige Bilder"],
        result: "Eine elegante Objektpräsentation, die hochwertige Immobilien erlebbar macht und qualifizierte Anfragen erzeugt."
      },
      {
        title: "Dachdeckerbetrieb",
        theme: "roofing",
        label: "Hanse Dach",
        metric: "48 Projekte",
        image: "assets/dachdecker-preview.webp",
        alt: "Website-Mockup für einen Dachdeckerbetrieb",
        features: ["Referenzen", "Vorher/Nachher Projekte", "Angebotsanfrage", "Mobile Optimierung"],
        result: "Referenzstarke Darstellung mit kurzen Wegen zur Angebotsanfrage auf jedem Endgerät."
      },
      {
        title: "Fitnessstudio",
        theme: "fitness",
        label: "Form Studio",
        metric: "12 Kurse",
        image: "assets/fitness-preview.webp",
        alt: "Website-Mockup für ein Fitnessstudio",
        features: ["Kursübersicht", "Mitgliedschaft", "Trainerprofil", "Online-Anmeldung"],
        result: "Ein dynamischer Markenauftritt, der Kurse, Trainer und Mitgliedschaften übersichtlich verbindet."
      }
    ]
  },
  chatbots: {
    eyebrow: "KI-Chatbots",
    title: "Digitale Assistenten für schnelle Antworten und bessere Leads.",
    intro: "Konkrete Dialoge zeigen, wie Interessenten rund um die Uhr qualifiziert und weitergeführt werden.",
    type: "chatbot",
    items: [
      {
        title: "Heizungsfirma",
        features: ["Terminvereinbarung", "Notdienst-Anfragen"],
        conversation: [
          ["user", "Unsere Heizung ist ausgefallen. Können Sie helfen?"],
          ["bot", "Ja. Ist die Anlage vollständig ausgefallen und in welchem Stadtteil befinden Sie sich?"],
          ["user", "Komplett ausgefallen, Hamburg-Nord."],
          ["bot", "Danke. Ich erfasse Ihre Kontaktdaten für eine schnelle Rückmeldung des Notdienstes."]
        ],
        lead: "Name · Telefon · Standort · Dringlichkeit"
      },
      {
        title: "Immobilienmakler",
        features: ["Objektanfragen", "Besichtigungstermine"],
        conversation: [
          ["user", "Ist die Stadtvilla noch verfügbar?"],
          ["bot", "Ja. Möchten Sie das Exposé erhalten oder direkt Interesse an einer Besichtigung vormerken?"],
          ["user", "Bitte das Exposé."],
          ["bot", "Gern. An welche E-Mail-Adresse darf es gesendet werden?"]
        ],
        lead: "Objekt · E-Mail · Budget · Terminwunsch"
      },
      {
        title: "Fitnessstudio",
        features: ["Mitgliedschaftsanfragen", "Kursinformationen"],
        conversation: [
          ["user", "Welche Kurse gibt es am Abend?"],
          ["bot", "Montags bis donnerstags stehen unter anderem Functional Training, Yoga und Cycling zur Auswahl."],
          ["user", "Kann ich ein Probetraining machen?"],
          ["bot", "Ja. Ich nehme Ihren bevorzugten Tag und Ihre Kontaktdaten auf."]
        ],
        lead: "Interesse · Trainingsziel · Wunschtermin"
      },
      {
        title: "Handwerksbetrieb",
        features: ["Angebotsanfragen", "Kundenservice"],
        conversation: [
          ["user", "Ich benötige ein Angebot für neue Fenster."],
          ["bot", "Wie viele Fenster sollen erneuert werden und handelt es sich um Neubau oder Sanierung?"],
          ["user", "Acht Fenster, Sanierung."],
          ["bot", "Perfekt. Ich strukturiere Ihre Anfrage für eine persönliche Angebotserstellung."]
        ],
        lead: "Leistung · Umfang · Projektart · Kontaktdaten"
      }
    ]
  },
  automations: {
    eyebrow: "Automatisierungen",
    title: "Prozesse, die Informationen automatisch an den richtigen Ort bringen.",
    intro: "Vier Workflows für weniger Handarbeit, schnellere Reaktionen und klare Übergaben.",
    type: "workflow",
    items: [
      {
        title: "Kontaktformular bis Termin",
        steps: ["Kontaktformular", "CRM", "E-Mail", "Termin"],
        result: "Neue Anfragen werden erfasst, zugeordnet, bestätigt und direkt zur Terminwahl weitergeführt."
      },
      {
        title: "Facebook Lead bis Angebot",
        steps: ["Facebook Lead", "CRM", "WhatsApp", "Angebot"],
        result: "Interessenten aus Kampagnen erhalten ohne Verzögerung eine persönliche Folgekommunikation."
      },
      {
        title: "KI-qualifizierte Website-Anfrage",
        steps: ["Website-Anfrage", "KI-Qualifizierung", "Priorisierung", "Kalender"],
        result: "Die wichtigsten Projektdaten stehen vor dem Erstgespräch bereits strukturiert zur Verfügung."
      },
      {
        title: "Automatisierter Rechnungsprozess",
        steps: ["Rechnung", "Fälligkeit prüfen", "Erinnerung", "Zahlung"],
        result: "Offene Rechnungen werden überwacht und Kunden zum passenden Zeitpunkt freundlich erinnert."
      }
    ]
  },
  crm: {
    eyebrow: "CRM-Systeme",
    title: "Alle Kunden, Aufgaben und Chancen in einer klaren Oberfläche.",
    intro: "Vier Dashboard-Konzepte zeigen, wie operative Daten übersichtlich und handlungsorientiert dargestellt werden.",
    type: "crm",
    items: [
      { title: "Heizungsfirma", areas: ["Kundenverwaltung", "Aufträge", "Termine"], kpis: [["Aktive Aufträge", "24"], ["Heute", "8 Termine"], ["Auslastung", "86%"]], bars: [62, 78, 48, 88, 72] },
      { title: "Immobilienmakler", areas: ["Leads", "Objekte", "Besichtigungen"], kpis: [["Neue Leads", "38"], ["Objekte", "16 aktiv"], ["Besichtigungen", "12"]], bars: [44, 68, 82, 58, 92] },
      { title: "Fitnessstudio", areas: ["Mitglieder", "Verträge", "Zahlungen"], kpis: [["Mitglieder", "1.248"], ["Verträge", "96% aktiv"], ["Monatsumsatz", "+12%"]], bars: [56, 64, 72, 78, 90] },
      { title: "B2B Vertrieb", areas: ["Pipeline", "Umsatzübersicht", "Follow-Ups"], kpis: [["Pipeline", "€ 184k"], ["Abschlussrate", "31%"], ["Follow-Ups", "18 offen"]], bars: [38, 52, 70, 84, 76] }
    ]
  },
  email: {
    eyebrow: "E-Mail-Prozesse",
    title: "Kommunikation, die automatisch den richtigen nächsten Schritt auslöst.",
    intro: "Strukturierte E-Mail-Abläufe verbinden Anfragen, Teams und Systeme ohne unnötige manuelle Übergaben.",
    type: "solution",
    items: [{
      title: "Intelligente Kontaktstrecken",
      label: "Kommunikation",
      visual: "email",
      description: "Wir entwickeln nachvollziehbare E-Mail-Prozesse vom ersten Kontakt bis zur persönlichen Übergabe.",
      benefits: ["Schnellere Reaktionszeiten", "Konsistente Kundenkommunikation", "Weniger manuelle Follow-ups"],
      cases: ["Anfragebestätigungen", "Angebotsnachverfolgung", "Termin- und Statusmeldungen"]
    }]
  },
  consulting: {
    eyebrow: "Strategieberatung",
    title: "Klare Entscheidungen vor komplexen Vorhaben.",
    intro: "Wir ordnen Ziele, Anforderungen und Abhängigkeiten und entwickeln daraus eine belastbare Priorisierung für die Umsetzung.",
    type: "solution",
    items: [{
      title: "Strategie mit Umsetzungsperspektive",
      label: "Beratung",
      visual: "strategy",
      description: "Statt einzelner Maßnahmen entsteht ein belastbarer Plan, der Beteiligte, Ressourcen, Aufwand und Nutzen sichtbar macht.",
      benefits: ["Klare Prioritäten", "Passende Lösungsbausteine", "Realistische Umsetzungsschritte"],
      cases: ["Projekt-Roadmaps", "Lösungs- und Partnerauswahl", "Prozess- und Potenzialanalyse"]
    }]
  },
  projects: {
    eyebrow: "Projektvermittlung",
    title: "Die richtigen Spezialisten für anspruchsvolle Vorhaben.",
    intro: "NIXORA DIGITAL bündelt Bedarf, Auswahl und Koordination über einen zentralen Ansprechpartner.",
    type: "solution",
    items: [{
      title: "Koordinierte Projektbesetzung",
      label: "Projektsteuerung",
      visual: "projects",
      description: "Wir strukturieren das Vorhaben, identifizieren passende Kompetenzen und halten die Beteiligten auf ein gemeinsames Ergebnis ausgerichtet.",
      benefits: ["Passende Expertise", "Weniger Abstimmungsaufwand", "Klare Verantwortlichkeiten"],
      cases: ["Digitale Projekte", "Technische Umsetzungen", "Interdisziplinäre Projektteams"]
    }]
  },
  procurement: {
    eyebrow: "Materialbeschaffung",
    title: "Ressourcen und Lieferwege passend zum Projekt organisiert.",
    intro: "Wir unterstützen bei Recherche, Auswahl und Koordination geeigneter Materialien und Bezugsquellen.",
    type: "solution",
    items: [{
      title: "Strukturierte Beschaffung",
      label: "Ressourcen",
      visual: "procurement",
      description: "Anforderungen, Anbieter und Lieferwege werden transparent zusammengeführt und auf das Projekt abgestimmt.",
      benefits: ["Vergleichbare Optionen", "Koordinierte Lieferketten", "Mehr Transparenz bei Verfügbarkeit"],
      cases: ["Projektmaterialien", "Technische Komponenten", "Spezialisierte Ressourcen"]
    }]
  },
  optimization: {
    eyebrow: "Prozessoptimierung",
    title: "Weniger Reibung. Klarere Abläufe. Bessere Wirtschaftlichkeit.",
    intro: "Bestehende Prozesse werden sichtbar gemacht, vereinfacht und sinnvoll mit Systemen oder Partnern verbunden.",
    type: "solution",
    items: [{
      title: "Vom Ist-Prozess zum klaren Ablauf",
      label: "Optimierung",
      visual: "optimization",
      description: "Wir identifizieren Medienbrüche, unnötige Schleifen und manuelle Engpässe und entwickeln eine praktikable Zielstruktur.",
      benefits: ["Kürzere Durchlaufzeiten", "Weniger Fehlerquellen", "Klare Zuständigkeiten"],
      cases: ["Anfrage- und Angebotsprozesse", "Interne Übergaben", "Wiederkehrende Verwaltungsabläufe"]
    }]
  },
  network: {
    eyebrow: "Partnernetzwerk",
    title: "Kompetenzen verbinden, ohne neue Komplexität zu schaffen.",
    intro: "Wir stellen für jedes Vorhaben ein passendes Netzwerk aus digitalen, technischen und operativen Partnern zusammen.",
    type: "solution",
    items: [{
      title: "Ein Netzwerk. Ein Ansprechpartner.",
      label: "Partnerschaften",
      visual: "network",
      description: "Unternehmen erhalten Zugang zu passenden Experten, während NIXORA DIGITAL Auswahl, Kommunikation und Zusammenspiel koordiniert.",
      benefits: ["Geprüfte Kompetenzen", "Flexible Projektteams", "Zentrale Koordination"],
      cases: ["Spezialistenvermittlung", "Umsetzungspartner", "Branchenübergreifende Kooperationen"]
    }]
  }
};

const initServiceModals = () => {
  const triggers = document.querySelectorAll("[data-service-modal]");
  if (!triggers.length) return;

  const modal = document.createElement("section");
  modal.className = "service-modal";
  modal.id = "service-details-modal";
  modal.setAttribute("aria-hidden", "true");
  modal.innerHTML = `
    <div class="service-modal-backdrop" data-service-modal-close></div>
    <div class="service-modal-dialog" role="dialog" aria-modal="true" aria-labelledby="service-modal-title">
      <header class="service-modal-header">
        <div>
          <span class="service-modal-eyebrow" data-service-modal-eyebrow></span>
          <h2 id="service-modal-title" data-service-modal-title></h2>
          <p data-service-modal-intro></p>
        </div>
        <button class="service-modal-close" type="button" aria-label="Ansicht schließen" data-service-modal-close></button>
      </header>
      <div class="service-modal-content" data-service-modal-content></div>
    </div>
  `;
  document.body.appendChild(modal);

  const dialog = modal.querySelector(".service-modal-dialog");
  const content = modal.querySelector("[data-service-modal-content]");
  const closeButton = modal.querySelector(".service-modal-close");
  let activeTrigger = null;

  const featureList = (features) => `<ul>${features.map((feature) => `<li>${feature}</li>`).join("")}</ul>`;

  const renderWebsite = (item) => `
    <article class="service-example website-example">
      <div class="website-mockups">
        <div class="desktop-mockup">
          <div class="mockup-browser"><i></i><i></i><i></i><span>${item.title}</span></div>
          <img src="${item.image}" alt="${item.alt}" width="1439" height="900" loading="lazy" decoding="async" />
        </div>
        <div class="mobile-mockup" aria-label="${item.title} auf einem Smartphone">
          <span class="mobile-mockup-speaker" aria-hidden="true"></span>
          <img src="${item.image}" alt="" width="1439" height="900" loading="lazy" decoding="async" />
          <span class="mobile-mockup-home" aria-hidden="true"></span>
        </div>
      </div>
      <div class="service-example-copy">
        <span class="service-example-index">Website-Konzept</span>
        <h3>${item.title}</h3>
        ${featureList(item.features)}
        <p>${item.result}</p>
      </div>
    </article>
  `;

  const renderChatbot = (item) => `
    <article class="service-example chatbot-example">
      <div class="example-chat-window">
        <header><span class="example-chat-avatar">AI</span><div><strong>${item.title} Assistant</strong><small>Automatische Kundenkommunikation</small></div><i></i></header>
        <div class="example-chat-messages">
          ${item.conversation.map(([role, text]) => `<p class="${role}">${text}</p>`).join("")}
        </div>
        <div class="example-lead"><span>Lead erfasst</span><strong>${item.lead}</strong></div>
      </div>
      <div class="service-example-copy">
        <span class="service-example-index">Chatbot-Anwendung</span>
        <h3>${item.title}</h3>
        ${featureList(item.features)}
        <p>Automatische Antworten führen die Anfrage strukturiert bis zur qualifizierten Übergabe.</p>
      </div>
    </article>
  `;

  const renderWorkflow = (item) => `
    <article class="service-example workflow-example">
      <div class="workflow-canvas">
        ${item.steps
          .map(
            (step, index) => `
              <div class="workflow-step">
                <span>${String(index + 1).padStart(2, "0")}</span>
                <strong>${step}</strong>
              </div>
              ${index < item.steps.length - 1 ? '<div class="workflow-link"><i></i></div>' : ""}
            `
          )
          .join("")}
      </div>
      <div class="service-example-copy">
        <span class="service-example-index">Workflow</span>
        <h3>${item.title}</h3>
        <p>${item.result}</p>
      </div>
    </article>
  `;

  const renderCrm = (item) => `
    <article class="service-example crm-example">
      <div class="crm-dashboard">
        <header><div><span>NIXORA CRM</span><strong>${item.title}</strong></div><i></i></header>
        <div class="crm-kpis">
          ${item.kpis.map(([label, value]) => `<div><span>${label}</span><strong>${value}</strong></div>`).join("")}
        </div>
        <div class="crm-main">
          <div class="crm-chart">
            <span>Entwicklung</span>
            <div class="crm-bars">${item.bars.map((bar) => `<i style="--bar:${bar}%"></i>`).join("")}</div>
          </div>
          <div class="crm-pipeline">
            ${item.areas.map((area, index) => `<div><i></i><span>${area}</span><strong>${index + 4}</strong></div>`).join("")}
          </div>
        </div>
      </div>
      <div class="service-example-copy">
        <span class="service-example-index">Dashboard-Konzept</span>
        <h3>${item.title}</h3>
        ${featureList(item.areas)}
        <p>Kennzahlen, Aufgaben und nächste Schritte werden in einer zentralen Ansicht zusammengeführt.</p>
      </div>
    </article>
  `;

  const renderSolution = (item) => `
    <article class="service-example solution-example">
      <div class="solution-visual solution-visual-${item.visual}" aria-hidden="true">
        <span class="solution-visual-label">${item.label}</span>
        <div class="solution-hub"><i></i><strong>NIXORA</strong><small>Zentrale Koordination</small></div>
        <div class="solution-node solution-node-a"><i></i><span>${item.cases[0]}</span></div>
        <div class="solution-node solution-node-b"><i></i><span>${item.cases[1]}</span></div>
        <div class="solution-node solution-node-c"><i></i><span>${item.cases[2]}</span></div>
        <svg viewBox="0 0 560 360" preserveAspectRatio="none">
          <path d="M280 180 L112 82" />
          <path d="M280 180 L448 82" />
          <path d="M280 180 L280 308" />
        </svg>
      </div>
      <div class="service-example-copy">
        <span class="service-example-index">${item.label}</span>
        <h3>${item.title}</h3>
        <p class="solution-description">${item.description}</p>
        <strong class="solution-list-title">Vorteile</strong>
        ${featureList(item.benefits)}
        <strong class="solution-list-title">Anwendungsfälle</strong>
        ${featureList(item.cases)}
      </div>
    </article>
  `;

  const renderModal = (key) => {
    const data = SERVICE_MODAL_DATA[key];
    if (!data) return;
    modal.querySelector("[data-service-modal-eyebrow]").textContent = data.eyebrow;
    modal.querySelector("[data-service-modal-title]").textContent = data.title;
    modal.querySelector("[data-service-modal-intro]").textContent = data.intro;

    const renderer = {
      website: renderWebsite,
      chatbot: renderChatbot,
      workflow: renderWorkflow,
      crm: renderCrm,
      solution: renderSolution
    }[data.type];

    content.className = `service-modal-content ${data.type}-modal-content`;
    content.innerHTML = data.items.map(renderer).join("");
  };

  const closeModal = () => {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("service-modal-open");
    activeTrigger?.setAttribute("aria-expanded", "false");
    activeTrigger?.focus();
  };

  const openModal = (trigger) => {
    if (modal.classList.contains("is-open")) return;
    activeTrigger = trigger;
    renderModal(trigger.dataset.serviceModal);
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("service-modal-open");
    trigger.setAttribute("aria-expanded", "true");
    dialog.scrollTop = 0;
    closeButton.focus();
  };

  triggers.forEach((trigger) => {
    trigger.setAttribute("aria-controls", modal.id);
    trigger.setAttribute("aria-expanded", "false");

    let touchStart = null;
    let handledTouchAt = 0;

    trigger.addEventListener(
      "pointerdown",
      (event) => {
        if (event.pointerType !== "touch") return;
        touchStart = {
          x: event.clientX,
          y: event.clientY,
          time: performance.now()
        };
      },
      { passive: true }
    );

    trigger.addEventListener(
      "pointerup",
      (event) => {
        if (event.pointerType !== "touch" || !touchStart) return;
        const distance = Math.hypot(event.clientX - touchStart.x, event.clientY - touchStart.y);
        const duration = performance.now() - touchStart.time;
        touchStart = null;
        if (distance > 12 || duration > 700) return;

        handledTouchAt = performance.now();
        openModal(trigger);
      },
      { passive: true }
    );

    trigger.addEventListener("pointercancel", () => {
      touchStart = null;
    });

    trigger.addEventListener("click", () => {
      if (performance.now() - handledTouchAt < 750) return;
      openModal(trigger);
    });
    trigger.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      openModal(trigger);
    });
  });

  modal.querySelectorAll("[data-service-modal-close]").forEach((button) => button.addEventListener("click", closeModal));
  document.addEventListener("keydown", (event) => {
    if (!modal.classList.contains("is-open")) return;
    if (event.key === "Escape") closeModal();
    if (event.key !== "Tab") return;

    const focusable = [...dialog.querySelectorAll("button, a, input, select, textarea, [tabindex]:not([tabindex='-1'])")].filter(
      (element) => !element.disabled
    );
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });
};

initServiceModals();

const initReviews = () => {
  const reviewForm = document.querySelector("[data-review-form]");
  const reviewList = document.querySelector("[data-review-list]");
  const reviewStatus = document.querySelector("[data-review-status]");
  if (!reviewForm || !reviewList || !reviewStatus) return;

  const storageKey = "nixora_local_reviews";

  const readReviews = () => {
    try {
      const stored = JSON.parse(localStorage.getItem(storageKey) || "[]");
      return Array.isArray(stored) ? stored : [];
    } catch (error) {
      return [];
    }
  };

  const saveReviews = (reviews) => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(reviews));
    } catch (error) {
      return false;
    }
    return true;
  };

  const setReviewStatus = (message, type) => {
    reviewStatus.textContent = message;
    reviewStatus.classList.toggle("is-success", type === "success");
    reviewStatus.classList.toggle("is-error", type === "error");
    reviewStatus.classList.add("is-visible");
  };

  const renderReview = (review, animate = false) => {
    const card = document.createElement("article");
    card.className = `review-card${animate ? " is-new" : ""}`;

    const top = document.createElement("div");
    top.className = "review-card-top";

    const stars = document.createElement("span");
    stars.className = "review-card-stars";
    stars.setAttribute("aria-label", `${review.rating} von 5 Sternen`);
    stars.textContent = `${"★".repeat(review.rating)}${"☆".repeat(5 - review.rating)}`;

    top.append(stars);

    const comment = document.createElement("p");
    comment.textContent = `„${review.comment}“`;

    const footer = document.createElement("footer");
    const name = document.createElement("strong");
    name.textContent = review.name;
    const company = document.createElement("span");
    company.textContent = review.company || "Kunde von NIXORA DIGITAL";
    footer.append(name, company);

    card.append(top, comment, footer);
    reviewList.prepend(card);
  };

  // Local preview only: permanent, shared reviews require a future API/backend.
  readReviews().slice(0, 5).reverse().forEach((review) => renderReview(review));

  reviewForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(reviewForm);
    const name = String(formData.get("reviewName") || "").trim();
    const company = String(formData.get("reviewCompany") || "").trim();
    const comment = String(formData.get("reviewComment") || "").trim();
    const rating = Number(formData.get("rating"));

    if (name.length < 2 || comment.length < 10 || rating < 1 || rating > 5) {
      setReviewStatus("Bitte geben Sie Name, Sternebewertung und einen kurzen Kommentar an.", "error");
      return;
    }

    const review = {
      id: Date.now(),
      name,
      company,
      comment,
      rating
    };

    const reviews = [review, ...readReviews()].slice(0, 5);
    const savedLocally = saveReviews(reviews);
    renderReview(review, true);
    reviewForm.reset();
    setReviewStatus(
      savedLocally
        ? "Vielen Dank. Ihre Bewertung wurde lokal in diesem Browser gespeichert."
        : "Vielen Dank für Ihre Bewertung. Die lokale Speicherung ist in diesem Browser nicht verfügbar.",
      "success"
    );
  });
};

initReviews();
