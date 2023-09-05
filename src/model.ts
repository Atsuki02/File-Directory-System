import View from "./view.ts";
import { config } from "./Controller.ts";

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
    const children = this.curNode?.getChildren();
    if (!children) return "";

    let current = children.head;
    let result = "";
    while (current !== null) {
      result += `<p>${current.name}</p>`;
      current = current.next;
    }
    return result;
  }

  touch(fileName: string): void {
    if (!this.curNode.children) {
      View.appendError(config.CLIOutput, "File can't be created here");
      return;
    }
    const newFileNode = new Node(fileName, "file", this.curNode);
    this.curNode.children.add(newFileNode);
    View.appendResult(config.CLIOutput, "New file created");
  }

  mkdir(folderName: string): void {
    if (this.curNode?.children) {
      const newDirNode = new Node(folderName, "directory", this.curNode);
      this.curNode.children.add(newDirNode);
      View.appendResult(config.CLIOutput, "New directory created");
    } else {
      View.appendError(config.CLIOutput, "Directory can't be created here");
    }
  }

  cd(path: string): void {
    if (!path) return;

    if (path === "..") {
      this.curNode = this.curNode.parent || this.root;
      return;
    }
    if (!this.curNode.children) return;
    let current = this.curNode.children.head;
    while (current !== null) {
      if (path === current.name) {
        this.curNode = current;
        return;
      }
      current = current.next;
    }

    return View.appendError(
      config.CLIOutput,
      `Directory or file '${path}' not found.`
    );
  }

  pwd(): string {
    const pathComponents = [];
    let current = this.curNode;

    while (current.parent !== null) {
      pathComponents.unshift(current.name);
      current = current.parent;
    }

    const result = "/" + pathComponents.join("/");
    return result;
  }

  rm(name: string): void {
    if (!this.curNode.children) return;
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

    View.appendError(
      config.CLIOutput,
      "The speified file of directory can't be found"
    );
    return;
  }

  clear(): void {
    View.clearHistory(config.CLIOutput);
    return;
  }
}

class Tools {
  static commandLineParser(CLIInputString: string): string[] {
    return CLIInputString.trim().split(" ");
  }

  static executeCommand(
    argsArray: string[],
    rootDir: FileSystem
  ): string | null | void {
    const command = argsArray[0];
    const name = argsArray[1];

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
      case "clear":
        return rootDir.clear();
      default:
        return "Invalid command";
    }

    return null;
  }

  static inputArrayValidator(inputArr: string[]): ValidationResult {
    const validCommands = ["ls", "pwd", "touch", "mkdir", "cd", "rm", "clear"];
    const command = inputArr[0];

    if (!validCommands.includes(command)) {
      return {
        isValid: false,
        errorMessage: `Invalid command: ${command}. Supported commands are: ${validCommands.join(
          ", "
        )}`,
      };
    }

    const expectedArgsCount =
      command === "ls" || command === "pwd" || command === "clear" ? 1 : 2;

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

class Node {
  name: string;
  type: string;
  parent: Node | null;
  children: SinglyLinkedList | null;
  next: Node | null;

  constructor(name: string, type: string, parent: Node | null) {
    this.name = name;
    this.type = type;
    this.parent = parent;
    this.children = this.type === "directory" ? new SinglyLinkedList() : null;
    this.next = null;
  }

  getChildren(): SinglyLinkedList | null {
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
      if (!this.current) return;
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

export {
  FileSystem,
  Tools,
  Node,
  SinglyLinkedList,
  CommandHistory,
  CommandNode,
};
