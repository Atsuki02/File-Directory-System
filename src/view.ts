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

  static appendResult(parentDiv: HTMLElement, result: string | null): void {
    if (!result) return;
    parentDiv.innerHTML += `<p>${result}</p>`;
  }

  static appendResultParagraph(parentDiv: HTMLElement, messege: string) {
    parentDiv.innerHTML += `<p style="red">${messege}</p>`;
  }
}

export default View;
