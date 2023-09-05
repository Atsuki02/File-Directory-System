import { Tools } from "./model.ts";
import { rootDir } from "./main.ts";
import View from "./view.ts";

export interface Config {
  CLIInput: HTMLInputElement;
  CLIOutput: HTMLElement;
}

const config: Config = {
  CLIInput: document.getElementById("input") as HTMLInputElement,
  CLIOutput: document.querySelector(".terminal.list.active") as HTMLElement,
};

config.CLIInput.addEventListener("keydown", handleKeyDownEvent);

function handleKeyDownEvent(event: KeyboardEvent) {
  switch (event.key) {
    case "Enter":
      submissionSearchEvent(event);
      break;
    case "ArrowUp":
      getPrevCommand();
      break;
    case "ArrowDown":
      getNextCommand();
      break;
  }
}

function submissionSearchEvent(event: Event) {
  let userInput = config.CLIInput.value;
  rootDir.commandHistory.addCommand(userInput);
  event.preventDefault();
  config.CLIInput.value = "";

  if (!config.CLIOutput) return;

  const inputArr: string[] = Tools.commandLineParser(userInput);
  const validatorResponse = Tools.inputArrayValidator(inputArr);

  if (!validatorResponse.isValid) {
    View.appendError(config.CLIOutput, validatorResponse.errorMessage);
  } else {
    View.appendEchoParagraph(config.CLIOutput, userInput);
    const result = Tools.executeCommand(inputArr, rootDir);
    View.appendResult(config.CLIOutput, result);
  }
}

function getPrevCommand() {
  const previousCommand = rootDir.commandHistory.getPreviousCommand();
  if (previousCommand !== null) {
    config.CLIInput.value = previousCommand;
  }
}
function getNextCommand() {
  const nextCommand = rootDir.commandHistory.getNextCommand();
  if (nextCommand !== null) {
    config.CLIInput.value = nextCommand;
  }
}

function setActiveTab(tab: Element | null | undefined) {
  const tabs = document.querySelectorAll(".tab");
  tabs.forEach(function (t) {
    t.classList.remove("active");
  });

  tab?.classList.add("active");

  const terminalId = tab?.getAttribute("data-terminal-id");
  const terminals = document.querySelectorAll(".terminal");
  terminals.forEach(function (terminal) {
    const terminalDataId = terminal.getAttribute("data-terminal-id");
    if (terminalDataId === terminalId) {
      terminal.classList.add("active");
    } else {
      terminal.classList.remove("active");
    }
  });

  updateCLIOutputActiveElement();
}

function updateCLIOutputActiveElement() {
  const activeElement = document.querySelector(
    ".terminal.list.active"
  ) as HTMLElement;
  config.CLIOutput = activeElement || config.CLIOutput;
}

function initializeTabs() {
  const tabs = document.querySelector(".tabs");
  const openTabButton = document.querySelector(".open-tab");

  tabs?.addEventListener("click", function (event) {
    if (
      event.target instanceof Element &&
      event.target.classList.contains("close-tab")
    ) {
      const tab = event.target.closest(".tab");

      tab?.remove();

      if (tab?.classList.contains("active")) {
        const lastTab = openTabButton?.previousElementSibling;
        setActiveTab(lastTab);
      }
    } else if (
      event.target instanceof Element &&
      event.target.classList.contains("tab")
    ) {
      const tab = event.target;
      setActiveTab(tab);
    }
  });

  openTabButton?.addEventListener("click", function () {
    const tabCount = document.querySelectorAll(".tab").length;
    const newTabHTML = `
      <div class="tab opening" data-terminal-id="${tabCount + 1}" >
        Command Prompt
        <span class="close-tab">×</span>
      </div>
    `;
    openTabButton.insertAdjacentHTML("beforebegin", newTabHTML);

    const lastTerminal = document.querySelector(".terminals")?.lastElementChild;
    const newTerminalHTML = `
      <ul class="terminal list active" data-terminal-id="${tabCount + 1}">
        <li>
          Atsuki's PowerShell Copyright (C) Atsuki Corporation. All
          rights reserved.
        </li>
    </ul>
    `;
    lastTerminal?.insertAdjacentHTML("afterend", newTerminalHTML);

    const newTab = openTabButton?.previousElementSibling;
    setActiveTab(newTab);
  });
}

export {
  config,
  handleKeyDownEvent,
  submissionSearchEvent,
  getPrevCommand,
  getNextCommand,
  setActiveTab,
  updateCLIOutputActiveElement,
  initializeTabs,
};
