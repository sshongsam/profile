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
