(() => {
  const secrets = ["spacecats", "makeitrain", "makeitsnow"];
  const maxLen = Math.max(...secrets.map((s) => s.length));
  let buffer = "";
  const storageKey = "jl-theme";
  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

  const applyThemeLabel = () => {
    const button = document.querySelector("[data-theme-toggle]");
    if (!button) {
      return;
    }
    const isDark = document.body.classList.contains("theme-dark");
    const compact = window.innerWidth <= 420;
    if (compact) {
      button.textContent = isDark ? "Light" : "Dark";
      return;
    }
    button.textContent = isDark ? "Light mode" : "Dark mode";
  };

  const setTheme = (mode, persist = true) => {
    document.body.classList.toggle("theme-dark", mode === "dark");
    document.body.classList.toggle("theme-light", mode === "light");
    if (persist) {
      localStorage.setItem(storageKey, mode);
    }
    applyThemeLabel();
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
    document.body.classList.toggle("theme-storm");
  };

  const toggleSnowTheme = () => {
    ensureSnow();
    document.body.classList.toggle("theme-snow");
  };

  const attachEggButtons = () => {
    document.querySelectorAll("[data-egg]").forEach((button) => {
      button.addEventListener("click", () => {
        const egg = button.getAttribute("data-egg");
        if (egg == "spacecats") {
          toggleSpaceTheme();
        }
        if (egg == "makeitrain") {
          toggleStormTheme();
        }
        if (egg == "makeitsnow") {
          toggleSnowTheme();
        }
      });
    });
  };

  const stored = localStorage.getItem(storageKey);
  if (stored === "dark" || stored === "light") {
    setTheme(stored, false);
  } else {
    setTheme(mediaQuery.matches ? "dark" : "light", false);
  }

  mediaQuery.addEventListener("change", (event) => {
    if (!localStorage.getItem(storageKey)) {
      setTheme(event.matches ? "dark" : "light", false);
    }
  });

  const button = document.querySelector("[data-theme-toggle]");
  if (button) {
    button.addEventListener("click", () => {
      const next = document.body.classList.contains("theme-dark") ? "light" : "dark";
      setTheme(next);
    });
  }

  window.addEventListener("resize", () => {
    applyThemeLabel();
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
