import { config } from "./Controller";
import { FileSystem } from "./model";

export const rootDir = new FileSystem();
config.CLIInput.focus();

// タブを操作する関数
function initializeTabs() {
  const tabs = document.querySelector(".tabs");
  const openTabButton = document.querySelector(".open-tab");

  // クローズボタンのクリックイベントリスナーを追加
  tabs.addEventListener("click", function (event) {
    if (event.target.classList.contains("close-tab")) {
      // クリックされたクローズボタンの親タブを取得
      const tab = event.target.closest(".tab");

      tab.remove();

      if (tab.classList.contains("active")) {
        const lastTab = openTabButton.previousElementSibling;
        setActiveTab(lastTab);
      }
    }
  });

  // オープンボタンに対するクリックイベントリスナーを追加
  openTabButton.addEventListener("click", function () {
    // 新しいタブのHTMLを生成
    const newTabHTML = `
      <div class="tab opening" data-terminal="terminal-2">
        New Terminal
        <span class="close-tab" data-terminal="terminal-2">×</span>
      </div>
    `;

    // タブエリアに新しいタブを挿入

    openTabButton.insertAdjacentHTML("beforebegin", newTabHTML);

    openTabButton.addEventListener("animationend", function () {
      newTab.classList.remove("opening");
    });

    // 新しいタブをアクティブにする
    const newTab = openTabButton.previousElementSibling;
    setActiveTab(newTab);
  });

  // すべてのタブにクリックイベントリスナーを追加
  tabs.querySelectorAll(".tab").forEach(function (tab) {
    tab.addEventListener("click", function () {
      setActiveTab(tab);
    });
  });
}

// タブをアクティブにする関数
function setActiveTab(tab) {
  const tabs = document.querySelectorAll(".tab");
  tabs.forEach(function (t) {
    t.classList.remove("active");
  });

  tab.classList.add("active");
}

// ページ読み込み時にタブを初期化
document.addEventListener("DOMContentLoaded", function () {
  initializeTabs();
});
