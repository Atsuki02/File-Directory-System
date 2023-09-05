class View {
  static appendEchoParagraph(parentDiv: HTMLElement, input: string): void {
    parentDiv.innerHTML += `<li>
      <p>
        <span style="color: green">user</span>
        <span style="color: magenta">@</span>
        <span style="color: blue">CLI</span>
        :${input}
      </p>
    </li>`;
  }

  static appendResult(
    parentDiv: HTMLElement,
    result: string | void | null
  ): void {
    if (!result) return;
    parentDiv.innerHTML += `<p>${result}</p>`;
  }

  static appendError(parentDiv: HTMLElement, messege: string) {
    parentDiv.innerHTML += `<p style="color: red">${messege}</p>`;
  }

  static clearHistory(parentDiv: HTMLElement): void {
    parentDiv.innerHTML = `<li>
    Atsuki's PowerShell Copyright (C) Atsuki Corporation. All
    rights reserved.</li>`;
  }
}

export default View;
