interface Config {
  CLIInput: HTMLInputElement;
  CLIOutput: HTMLElement | null;
}

const config: Config = {
  CLIInput: document.getElementById("input") as HTMLInputElement,
  CLIOutput: document.getElementById("list"),
};

config.CLIInput.addEventListener("keydown", (event) => {
  if (event.key == "Enter") submissionSearchEvent();
  if (event.key === "ArrowUp") getPrevCommand();
  if (event.key === "ArrowDown") getNextCommand();
});

function submissionSearchEvent() {
  rootDir.commandHistory.addCommand(config.CLIInput.value);
  if (config.CLIOutput) {
    let input = config.CLIInput.value;
    const inputArr: string[] = Tools.commandLineParser(input);
    let validatorResponse = Tools.inputArrayValidator(inputArr);
    if (validatorResponse["isValid"] == false) {
      View.appendResultParagraph(
        config.CLIOutput,
        validatorResponse["errorMessage"]
      );
    } else {
      View.appendEchoParagraph(config.CLIOutput, input);
      const result = Tools.executeCommand(inputArr, rootDir);
      View.appendResult(config.CLIOutput, result);
    }
  }
}

function getPrevCommand() {
  const previousCommand = rootDir.commandHistory.getPreviousCommand();
  console.log(previousCommand);
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

class FileSystem {
  root: Node;
  curNode: Node;
  commandHistory: CommandHistory;

  constructor() {
    this.root = new Node("/", "directory", null);
    this.curNode = this.root;
    this.commandHistory = new CommandHistory();
  }

  getCommandHistory() {
    return this.commandHistory;
  }

  ls(): string {
    const children = this.curNode.getChildren();
    let current = children.head;
    let result = "";
    while (current !== null) {
      result += `<p>${current.name}</p>`;
      current = current.next;
    }
    return result;
  }

  touch(fileName: string): void {
    const newFileNode = new Node(fileName, "file", this.curNode);
    if (!this.curNode.children) {
      this.curNode.children = new SinglyLinkedList();
    }
    this.curNode.children.add(newFileNode);
    console.log(newFileNode);
  }

  mkdir(folderName: string): void {
    const newDirNode = new Node(folderName, "directory", this.curNode);
    if (!this.curNode.children) {
      this.curNode.children = new SinglyLinkedList();
    }
    this.curNode.children.add(newDirNode);
    console.log(newDirNode);
  }

  cd(path: string): void {
    if (!path) return;

    if (path === "..") {
      this.curNode = this.curNode.parent || this.root;
      console.log(this.curNode);
      return;
    }

    let current = this.curNode.children.head;
    while (current !== null) {
      if (path === current.name) {
        this.curNode = current;
        console.log(this.curNode);
        return;
      }
      current = current.next;
    }

    return View.appendResult(
      config.CLIOutput,
      `Directory or file '${path}' not found.`
    );
  }

  pwd(): string {
    let result = "";
    result += `<p>${this.curNode.name}</p>`;
    return result;
  }

  rm(name: string): void {
    let current = this.curNode.children.head;
    let prev = null;

    while (current !== null) {
      if (name === current.name) {
        if (prev === null) {
          this.curNode.children.head = current.next;
        } else {
          prev.next = current.next;
        }
        return;
      }

      prev = current;
      current = current.next;
    }
  }
}

class Tools {
  static commandLineParser(CLIInputString: string): string[] {
    let parsedStringInputArray = CLIInputString.trim().split(" ");
    return parsedStringInputArray;
  }

  static executeCommand(
    argsArray: string[],
    rootDir: FileSystem
  ): string | null {
    let command = argsArray[0];
    let name = argsArray[1];

    switch (command) {
      case "ls":
        return rootDir.ls();
      case "touch":
        rootDir.touch(name);
        break;
      case "mkdir":
        rootDir.mkdir(name);
        break;
      case "cd":
        rootDir.cd(name);
        break;
      case "pwd":
        return rootDir.pwd();
      case "rm":
        rootDir.rm(name);
        break;
      default:
        console.log(
          "MTools.evaluatedResultsStringFromParsedCLIArray:: invalid command name"
        );
        return "Invalid command";
    }

    return null;
  }

  static inputArrayValidator(inputArr: string[]): ValidationResult {
    const validCommands = ["ls", "pwd", "touch", "mkdir", "cd", "rm"];
    const command = inputArr[0];

    if (!validCommands.includes(command)) {
      return {
        isValid: false,
        errorMessage: `Invalid command: ${command}. Supported commands are: ${validCommands.join(
          ", "
        )}`,
      };
    }

    const expectedArgsCount = command === "ls" || command === "pwd" ? 1 : 2;

    if (inputArr.length !== expectedArgsCount) {
      return {
        isValid: false,
        errorMessage: `Command line input must contain exactly ${expectedArgsCount} elements: 'commandName arguments'`,
      };
    }

    return { isValid: true, errorMessage: "" };
  }
}

interface ValidationResult {
  isValid: boolean;
  errorMessage: string;
}

class View {
  static appendEchoParagraph(parentDiv: HTMLElement, input: string): void {
    parentDiv.innerHTML += `<li>
    <p>
      <span style="color: green">user</span>
      <span style="color: magenta">@</span>
      <span style="color: blue">recursionist</span>
      :${input}
    </p>
  </li>`;
  }

  static appendResult(parentDiv: HTMLElement, result: string | null): void {
    if (!result) return;
    parentDiv.innerHTML += `<p>${result}</p>`;
  }

  static appendResultParagraph(parentDiv: HTMLElement, messege: string) {
    parentDiv.innerHTML += `<p style="red">${messege}</p>`;
  }
}

class Node {
  name: string;
  type: string;
  parent: Node | null;
  children: SinglyLinkedList | null;
  time: string;
  next: Node | null;

  constructor(name: string, type: string, parent: Node | null) {
    this.name = name;
    this.type = type;
    this.parent = parent;
    this.children = this.type === "directory" ? new SinglyLinkedList() : null;
    this.time = new Date().toString();
    this.next = null;
  }

  getChildren(): SinglyLinkedList {
    return this.children;
  }
}

class SinglyLinkedList {
  head: Node | null;
  next: Node | null;

  constructor() {
    this.head = null;
    this.next = null;
  }

  add(node: Node): void {
    if (!this.head) {
      this.head = node;
    } else {
      let current = this.head;
      while (current.next !== null) {
        current = current.next;
      }
      current.next = node;
    }
  }
}

class CommandHistory {
  head: CommandNode | null;
  current: CommandNode | null;

  constructor() {
    this.head = null;
    this.current = null;
  }

  addCommand(commandName: string): void {
    const newCommand = new CommandNode(commandName);

    if (!this.head) {
      this.head = newCommand;
      this.current = newCommand;
      this.current.prev = newCommand;
    } else {
      this.current.next = newCommand;
      newCommand.prev = this.current;
      this.current = newCommand;
    }
  }

  getPreviousCommand(): string | null {
    if (this.current && this.current.prev) {
      this.current = this.current.prev;
      return this.current.value;
    }
    return null;
  }

  getNextCommand(): string | null {
    if (this.current && this.current.next) {
      this.current = this.current.next;
      return this.current.value;
    }
    return null;
  }
}

class CommandNode {
  value: string;
  prev: CommandNode | null;
  next: CommandNode | null;

  constructor(value: string) {
    this.value = value;
    this.prev = null;
    this.next = null;
  }
}

const rootDir = new FileSystem();
