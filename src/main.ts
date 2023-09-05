import { config, initializeTabs, setActiveTab } from "./Controller";
import { FileSystem } from "./model";

export const rootDir = new FileSystem();

document.addEventListener("DOMContentLoaded", function () {
  initializeTabs();

  const firstTab = document.querySelector(".tab");
  setActiveTab(firstTab);

  config.CLIInput.focus();
});
