import { config } from "./Controller";
import { FileSystem } from "./model";

export const rootDir = new FileSystem();
config.CLIInput.focus();

function initializeTabs() {
  const tabs = document.querySelector(".tabs");
  const openTabButton = document.querySelector(".open-tab");

  tabs.addEventListener("click", function (event) {
    if (event.target.classList.contains("close-tab")) {
      const tab = event.target.closest(".tab");

      tab.remove();

      if (tab.classList.contains("active")) {
        const lastTab = openTabButton.previousElementSibling;
        setActiveTab(lastTab);
      }
    }
  });

  openTabButton.addEventListener("click", function () {
    const newTabHTML = `
      <div class="tab opening">
        Command Prompt
        <span class="close-tab">×</span>
      </div>
    `;

    openTabButton.insertAdjacentHTML("beforebegin", newTabHTML);

    openTabButton.addEventListener("animationend", function () {
      newTab.classList.remove("opening");
    });

    const newTab = openTabButton.previousElementSibling;
    setActiveTab(newTab);

    tabs.querySelectorAll(".tab").forEach(function (tab) {
      tab.addEventListener("click", function () {
        setActiveTab(tab);
      });
    });
  });
}

function setActiveTab(tab) {
  const tabs = document.querySelectorAll(".tab");
  tabs.forEach(function (t) {
    t.classList.remove("active");
  });

  tab?.classList.add("active");
}

document.addEventListener("DOMContentLoaded", function () {
  initializeTabs();
});
