(() => {
  const secrets = ["spacecats", "makeitrain", "makeitsnow"];
  const maxLen = Math.max(...secrets.map((s) => s.length));
  let buffer = "";
  const storageKey = "jl-theme";
  const systemQuery = window.matchMedia("(prefers-color-scheme: dark)");
  let themeMode = "system";

  const applyThemeLabel = () => {
    const menu = document.querySelector(".theme-menu");
    const panel = document.querySelector("[data-theme-panel]");
    const button = document.querySelector("[data-theme-toggle]");
    const isDark = document.body.classList.contains("theme-dark");

    if (button) {
      button.textContent = "Options";
      button.setAttribute("aria-expanded", menu?.classList.contains("is-open") ? "true" : "false");
    }

    if (panel) {
      panel.setAttribute("aria-hidden", menu?.classList.contains("is-open") ? "false" : "true");
    }

    document.querySelectorAll(".segment").forEach((segment) => {
      const option = segment.getAttribute("data-theme-option");
      const on = themeMode === option;
      segment.classList.toggle("is-selected", on);
      segment.setAttribute("aria-checked", on ? "true" : "false");
    });

    document.querySelectorAll(".panel-help").forEach((help) => {
      help.classList.toggle("is-visible", themeMode === "system");
    });

    document.querySelectorAll(".fun-row").forEach((row) => {
      const egg = row.getAttribute("data-egg");
      let on = false;
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
    document.documentElement.classList.toggle("theme-dark", mode === "dark");
    document.documentElement.classList.toggle("theme-light", mode === "light");
    if (persist) {
      localStorage.setItem(storageKey, mode);
    }
    applyThemeLabel();
  };

  const enforceEggsForTheme = (mode) => {
    if (mode === "light") {
      setSpaceTheme(false);
      setStormTheme(false);
      setSnowTheme(false);
    }
  };

  const applyThemeMode = (mode, persist = true) => {
    themeMode = mode;
    const next = mode === "system" ? (systemQuery.matches ? "dark" : "light") : mode;
    setTheme(next, persist);
    enforceEggsForTheme(next);
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

  const setLayerActive = (selector, on) => {
    const layer = document.querySelector(selector);
    if (!layer) {
      return;
    }
    layer.dataset.active = on ? "true" : "false";
  };

  const setSpaceTheme = (on) => {
    document.body.classList.toggle("theme-space", on);
    setLayerActive(".space-scene", on);
    setLayerActive(".space-cats", on);
  };

  const syncWeatherLayers = () => {
    const stormOn = document.body.classList.contains("theme-storm");
    const snowOn = document.body.classList.contains("theme-snow");
    setLayerActive(".storm-clouds", stormOn || snowOn);
    setLayerActive(".storm-rain", stormOn);
    setLayerActive(".snowfall", snowOn);
    setLayerActive(".snowbank", snowOn);
  };

  const setStormTheme = (on) => {
    document.body.classList.toggle("theme-storm", on);
    syncWeatherLayers();
  };

  const setSnowTheme = (on) => {
    document.body.classList.toggle("theme-snow", on);
    syncWeatherLayers();
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

  const toggleSpaceTheme = () => {
    const nextOn = !document.body.classList.contains("theme-space");
    setSpaceTheme(nextOn);
    return nextOn;
  };

  const toggleStormTheme = () => {
    ensureRain();
    const nextOn = !document.body.classList.contains("theme-storm");
    setStormTheme(nextOn);
    return nextOn;
  };

  const toggleSnowTheme = () => {
    ensureSnow();
    const nextOn = !document.body.classList.contains("theme-snow");
    setSnowTheme(nextOn);
    return nextOn;
  };

  const stored = localStorage.getItem(storageKey);
  if (stored === "dark" || stored === "light" || stored === "system") {
    applyThemeMode(stored, false);
  } else {
    applyThemeMode("system", true);
  }

  systemQuery.addEventListener("change", () => {
    if (themeMode === "system") {
      applyThemeMode("system", false);
    }
  });

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

    const segment = target.closest(".segment");
    if (segment) {
      const themeOption = segment.getAttribute("data-theme-option");
      if (themeOption === "system" || themeOption === "light" || themeOption === "dark") {
        applyThemeMode(themeOption);
        applyThemeLabel();
        return;
      }
    }

    const funRow = target.closest(".fun-row");
    if (funRow) {
      const egg = funRow.getAttribute("data-egg");
      if (egg === "spacecats") {
        const on = toggleSpaceTheme();
        if (on) {
          applyThemeMode("dark", false);
        }
      }
      if (egg === "makeitrain") {
        const on = toggleStormTheme();
        if (on) {
          applyThemeMode("dark", false);
        }
      }
      if (egg === "makeitsnow") {
        const on = toggleSnowTheme();
        if (on) {
          applyThemeMode("dark", false);
        }
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
      const on = toggleSpaceTheme();
      if (on) {
        applyThemeMode("dark", false);
      }
      applyThemeLabel();
      buffer = "";
    }
    if (buffer.endsWith("makeitrain")) {
      const on = toggleStormTheme();
      if (on) {
        applyThemeMode("dark", false);
      }
      applyThemeLabel();
      buffer = "";
    }
    if (buffer.endsWith("makeitsnow")) {
      const on = toggleSnowTheme();
      if (on) {
        applyThemeMode("dark", false);
      }
      applyThemeLabel();
      buffer = "";
    }
  });
})();
