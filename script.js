(() => {
  const secrets = ["spacecats", "makeitrain", "makeitsnow"];
  const maxLen = Math.max(...secrets.map((s) => s.length));
  let buffer = "";
  const storageKey = "jl-theme";

  const applyThemeLabel = () => {
    const menu = document.querySelector(".theme-menu");
    const panel = document.querySelector("[data-theme-panel]");
    const button = document.querySelector("[data-theme-toggle]");
    const isDark = document.body.classList.contains("theme-dark");

    if (button) {
      button.textContent = "Theme";
      button.setAttribute("aria-expanded", menu?.classList.contains("is-open") ? "true" : "false");
    }

    if (panel) {
      panel.setAttribute("aria-hidden", menu?.classList.contains("is-open") ? "false" : "true");
    }

    document.querySelectorAll(".panel-row").forEach((row) => {
      const isDarkRow = row.getAttribute("data-theme-option") === "dark";
      const egg = row.getAttribute("data-egg");
      let on = false;
      if (isDarkRow) {
        on = isDark;
      }
      if (egg === "spacecats") {
        on = document.body.classList.contains("theme-space");
      }
      if (egg === "makeitrain") {
        on = document.body.classList.contains("theme-storm");
      }
      if (egg === "makeitsnow") {
        on = document.body.classList.contains("theme-snow");
      }
      row.classList.toggle("is-on", on);
    });
  };

  const setTheme = (mode, persist = true) => {
    document.body.classList.toggle("theme-dark", mode === "dark");
    document.body.classList.toggle("theme-light", mode === "light");
    if (persist) {
      localStorage.setItem(storageKey, mode);
    }
    applyThemeLabel();
  };

  const menu = document.querySelector(".theme-menu");
  const panel = document.querySelector("[data-theme-panel]");

  const toggleMenu = () => {
    if (!menu || !panel) {
      return;
    }
    const open = menu.classList.toggle("is-open");
    panel.setAttribute("aria-hidden", open ? "false" : "true");
    const button = document.querySelector("[data-theme-toggle]");
    if (button) {
      button.setAttribute("aria-expanded", open ? "true" : "false");
    }
  };

  const closeMenu = () => {
    if (!menu || !panel) {
      return;
    }
    menu.classList.remove("is-open");
    panel.setAttribute("aria-hidden", "true");
    const button = document.querySelector("[data-theme-toggle]");
    if (button) {
      button.setAttribute("aria-expanded", "false");
    }
  };

  const toggleSpaceTheme = () => {
    document.body.classList.toggle("theme-space");
  };

  const ensureRain = () => {
    const layer = document.querySelector(".storm-rain");
    if (!layer || layer.dataset.ready === "true") {
      return;
    }

    const emojis = ["💧"];
    const count = 42;

    for (let i = 0; i < count; i += 1) {
      const span = document.createElement("span");
      span.textContent = emojis[i % emojis.length];
      span.style.left = `${Math.random() * 100}%`;
      span.style.animationDuration = `${6 + Math.random() * 6}s`;
      span.style.animationDelay = `${Math.random() * 6}s`;
      span.style.fontSize = `${18 + Math.random() * 12}px`;
      layer.appendChild(span);
    }

    layer.dataset.ready = "true";
  };

  const ensureSnow = () => {
    const layer = document.querySelector(".snowfall");
    if (!layer || layer.dataset.ready === "true") {
      return;
    }

    const emojis = ["❄️"];
    const count = 50;

    for (let i = 0; i < count; i += 1) {
      const span = document.createElement("span");
      span.textContent = emojis[i % emojis.length];
      span.style.left = `${Math.random() * 100}%`;
      span.style.animationDuration = `${8 + Math.random() * 8}s`;
      span.style.animationDelay = `${Math.random() * 6}s`;
      span.style.fontSize = `${16 + Math.random() * 12}px`;
      layer.appendChild(span);
    }

    layer.dataset.ready = "true";
  };

  const toggleStormTheme = () => {
    ensureRain();
    const nextOn = !document.body.classList.contains("theme-storm");
    document.body.classList.toggle("theme-storm");
    if (nextOn) {
      setTheme("dark");
    }
  };

  const toggleSnowTheme = () => {
    ensureSnow();
    document.body.classList.toggle("theme-snow");
  };

  const stored = localStorage.getItem(storageKey);
  if (stored === "dark" || stored === "light") {
    setTheme(stored, false);
  } else {
    setTheme("light", true);
  }

  window.addEventListener("resize", () => {
    applyThemeLabel();
  });

  document.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) {
      return;
    }

    if (target.closest("[data-theme-toggle]")) {
      toggleMenu();
      applyThemeLabel();
      return;
    }

    const row = target.closest(".panel-row");
    if (row) {
      const themeOption = row.getAttribute("data-theme-option");
      if (themeOption === "dark") {
        const next = document.body.classList.contains("theme-dark") ? "light" : "dark";
        setTheme(next);
        return;
      }

      const egg = row.getAttribute("data-egg");
      if (egg === "spacecats") {
        toggleSpaceTheme();
      }
      if (egg === "makeitrain") {
        toggleStormTheme();
      }
      if (egg === "makeitsnow") {
        toggleSnowTheme();
      }
      applyThemeLabel();
      return;
    }

    if (!target.closest(".theme-menu")) {
      closeMenu();
      applyThemeLabel();
    }
  });

  window.addEventListener("keydown", (event) => {
    if (event.key.length !== 1) {
      return;
    }

    buffer = (buffer + event.key.toLowerCase()).slice(-maxLen);
    if (buffer.endsWith("spacecats")) {
      toggleSpaceTheme();
      buffer = "";
    }
    if (buffer.endsWith("makeitrain")) {
      toggleStormTheme();
      buffer = "";
    }
    if (buffer.endsWith("makeitsnow")) {
      toggleSnowTheme();
      buffer = "";
    }
  });
})();
