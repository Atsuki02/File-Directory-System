interface Config {
  CLIInput: HTMLInputElement;
  CLIOutput: HTMLElement | null;
}

const config: Config = {
  CLIInput: document.getElementById("input") as HTMLInputElement,
  CLIOutput: document.getElementById("list"),
};

config.CLIInput.addEventListener("keydown", (event) =>
  submissionSearchEvent(event)
);

function submissionSearchEvent(event: KeyboardEvent) {
  if (event.key == "Enter" && config.CLIOutput) {
    const input = config.CLIInput.value;
    const inputArr: string[] = Tools.commandLineParser(input);
    const result = Tools.executeCommand(inputArr, rootDir);
    View.appendEchoParagraph(config.CLIOutput, input);
    View.appendResult(config.CLIOutput, result);
  }
}

class FileSystem {
  root: Node;
  curNode: Node;

  constructor() {
    this.root = new Node("/", "directory", null);
    this.curNode = this.root;
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
    console.log(this.curNode.children);
  }

  mkdir(folderName: string): void {
    const newDirNode = new Node(folderName, "directory", this.curNode);
    if (!this.curNode.children) {
      this.curNode.children = new SinglyLinkedList();
    }
    this.curNode.children.add(newDirNode);
    console.log(newDirNode);
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

    if (command == "ls") return rootDir.ls();
    else if (command == "touch") {
      rootDir.touch(name);
      return null;
    } else if (command == "mkdir") {
      rootDir.mkdir(name);
      return null;
    } else {
      console.log(
        "MTools.evaluatedResultsStringFromParsedCLIArray:: invalid command name"
      );
      return "Invalid command";
    }
  }
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

const rootDir = new FileSystem();
console.log(rootDir);