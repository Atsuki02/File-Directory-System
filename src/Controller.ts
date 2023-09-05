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

export {
  config,
  handleKeyDownEvent,
  submissionSearchEvent,
  getPrevCommand,
  getNextCommand,
};
