(function () {
  var toggleButton = document.getElementById("theme-toggle");
  var root = document.documentElement;

  if (!toggleButton) {
    return;
  }

  function getTheme() {
    return root.getAttribute("data-theme") === "dark" ? "dark" : "light";
  }

  function updateButton(theme) {
    if (theme === "dark") {
      toggleButton.textContent = "라이트 모드";
      toggleButton.setAttribute("aria-label", "라이트 모드로 전환");
    } else {
      toggleButton.textContent = "다크 모드";
      toggleButton.setAttribute("aria-label", "다크 모드로 전환");
    }
  }

  function setTheme(theme) {
    root.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
    updateButton(theme);
  }

  toggleButton.addEventListener("click", function () {
    setTheme(getTheme() === "dark" ? "light" : "dark");
  });

  updateButton(getTheme());
})();

(function () {
  var stage = document.querySelector(".scroll-stage");
  var card = document.querySelector(".business-card");
  var root = document.documentElement;
  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!stage || !card || reducedMotion) {
    root.style.setProperty("--resume-opacity", "1");
    root.style.setProperty("--resume-lift", "0px");
    return;
  }

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  function easeOutCubic(value) {
    return 1 - Math.pow(1 - clamp(value, 0, 1), 3);
  }

  function easeInOutCubic(value) {
    value = clamp(value, 0, 1);
    return value < 0.5
      ? 4 * value * value * value
      : 1 - Math.pow(-2 * value + 2, 3) / 2;
  }

  function setVar(name, value) {
    root.style.setProperty(name, value);
  }

  function update() {
    var rect = stage.getBoundingClientRect();
    var range = stage.offsetHeight - window.innerHeight;
    var progress = range > 0 ? clamp(-rect.top / range, 0, 1) : 0;

    var flip = easeInOutCubic(progress / 0.45);
    var zoom = easeOutCubic((progress - 0.45) / 0.35);
    var reveal = easeOutCubic((progress - 0.7) / 0.22);

    var rotateX = 12 - flip * 10 - zoom * 2;
    var rotateY = -22 + flip * 202;
    var rotateZ = -5 + flip * 5;
    var maxScale = 1.35;
    var scale = 1 + zoom * (maxScale - 1);
    var stageOpacity = 1 - easeOutCubic((progress - 0.86) / 0.14) * 0.18;
    var resumeLift = 32 - reveal * 32;

    setVar("--rx", rotateX.toFixed(2) + "deg");
    setVar("--ry", rotateY.toFixed(2) + "deg");
    setVar("--rz", rotateZ.toFixed(2) + "deg");
    setVar("--scale", scale.toFixed(3));
    setVar("--stage-opacity", stageOpacity.toFixed(3));
    setVar("--resume-opacity", reveal.toFixed(3));
    setVar("--resume-lift", resumeLift.toFixed(1) + "px");
  }

  var ticking = false;

  function requestUpdate() {
    if (ticking) {
      return;
    }

    ticking = true;
    window.requestAnimationFrame(function () {
      update();
      ticking = false;
    });
  }

  window.addEventListener("scroll", requestUpdate, { passive: true });
  window.addEventListener("resize", requestUpdate);
  update();
})();
