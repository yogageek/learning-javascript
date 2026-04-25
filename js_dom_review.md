# JavaScript × HTML DOM 複習筆記

> **用一個 Side Project 貫穿**：一個「任務清單 App（Todo List）」，涵蓋 DOM 所有核心操作。
> **學這個的意義**：DOM 是 JS 控制畫面的唯一橋樑。框架（React/Vue）底層也是在操作 DOM，理解原生 DOM 才能真正搞懂框架的 Virtual DOM 為什麼存在。

---

## 一、全局概念地圖

```
DOM（Document Object Model）
├── 選取元素        → querySelector / getElementById / ...
├── 讀寫內容        → textContent / innerHTML / value
├── 讀寫屬性        → getAttribute / setAttribute / dataset
├── 操作 CSS        → classList / style
├── 建立 / 插入 / 刪除 節點
├── 事件系統        → addEventListener / 事件冒泡 / 委派
└── 效能考量        → reflow/repaint、DocumentFragment
```

---

## 二、Side Project：Todo List App

> 以下所有 DOM 知識點，都透過這個 App 的完整程式碼展示。

### HTML 結構

```html
<!DOCTYPE html>
<html lang="zh-TW">
<head>
  <meta charset="UTF-8">
  <title>Todo List — DOM 練習</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <div id="app">
    <h1>Task Board</h1>

    <!-- 新增任務區 -->
    <div class="input-group">
      <input
        id="task-input"
        type="text"
        placeholder="輸入新任務..."
        maxlength="50"
        data-testid="task-input"   <!-- data-* 屬性 -->
      />
      <select id="priority-select">
        <option value="low">低</option>
        <option value="medium" selected>中</option>
        <option value="high">高</option>
      </select>
      <button id="add-btn">新增</button>
    </div>

    <!-- 篩選區 -->
    <div class="filter-group" id="filter-group">
      <button class="filter-btn active" data-filter="all">全部</button>
      <button class="filter-btn" data-filter="active">未完成</button>
      <button class="filter-btn" data-filter="done">已完成</button>
    </div>

    <!-- 任務清單 -->
    <ul id="task-list"></ul>

    <!-- 狀態列 -->
    <div id="status-bar">
      <span id="count-display">0 項任務</span>
      <button id="clear-done-btn">清除已完成</button>
    </div>
  </div>

  <script src="app.js"></script>
</body>
</html>
```

---

### JavaScript 完整實作（app.js）

```js
// ════════════════════════════════════════════════
// 1. 選取元素
// ════════════════════════════════════════════════

// querySelector → 選第一個符合的（CSS selector 語法）
const input       = document.querySelector("#task-input");
const addBtn      = document.querySelector("#add-btn");
const taskList    = document.querySelector("#task-list");
const filterGroup = document.querySelector("#filter-group");
const countDisplay= document.querySelector("#count-display");
const clearDoneBtn= document.querySelector("#clear-done-btn");
const prioritySel = document.getElementById("priority-select"); // getElementById 稍快，但只能用 id

// querySelectorAll → 選所有符合的，回傳 NodeList（不是陣列！）
// const allBtns = document.querySelectorAll(".filter-btn");
// [...allBtns].forEach(...) ← 要展開成陣列才有 forEach 以外的陣列方法

// ════════════════════════════════════════════════
// 2. 狀態管理（資料和 UI 分離的基本概念）
// ════════════════════════════════════════════════

let tasks = [];          // 所有任務的資料陣列
let currentFilter = "all";
let nextId = 1;

// ════════════════════════════════════════════════
// 3. 建立 & 插入 DOM 節點
// ════════════════════════════════════════════════

function createTaskElement(task) {
  // createElement → 在記憶體建立新元素，還沒插入畫面
  const li = document.createElement("li");

  // className 一次設定多個 class
  li.className = `task-item priority-${task.priority}`;

  // dataset → 存自訂資料到 DOM（讀寫 data-* 屬性）
  li.dataset.id = task.id;           // 設定 data-id="1"
  li.dataset.priority = task.priority; // 設定 data-priority="high"

  // innerHTML → 一次設定完整 HTML 結構（注意 XSS 風險！）
  // textContent → 只設定純文字，自動 escape，更安全
  li.innerHTML = `
    <input
      type="checkbox"
      class="task-check"
      ${task.done ? "checked" : ""}
      aria-label="標記完成"
    />
    <span class="task-text ${task.done ? "done" : ""}">
      ${escapeHtml(task.text)}
    </span>
    <span class="priority-badge">${task.priority}</span>
    <button class="delete-btn" aria-label="刪除任務">✕</button>
  `;

  // 如果內容是使用者輸入，用 textContent 插入，避免 XSS
  // const span = li.querySelector(".task-text");
  // span.textContent = task.text; ← 更安全的做法

  return li;
}

// XSS 防護：escape 特殊字元
function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;   // textContent 自動 escape
  return div.innerHTML;    // 取出 escaped HTML 字串
}

// ════════════════════════════════════════════════
// 4. 渲染（重新產生 UI）
// ════════════════════════════════════════════════

function render() {
  // 依篩選條件過濾任務
  const filtered = tasks.filter(task => {
    if (currentFilter === "active") return !task.done;
    if (currentFilter === "done")   return task.done;
    return true; // "all"
  });

  // DocumentFragment → 批次 DOM 操作，只觸發一次 reflow
  // 直接 append 到 taskList 每次都會觸發 reflow，效能差
  const fragment = document.createDocumentFragment();

  filtered.forEach(task => {
    fragment.appendChild(createTaskElement(task));
  });

  // 清空舊的，一次插入新的
  taskList.innerHTML = "";            // 清空
  taskList.appendChild(fragment);    // 一次性插入，只觸發一次 reflow

  // 更新狀態列
  updateStatus();
}

function updateStatus() {
  const total = tasks.length;
  const doneCount = tasks.filter(t => t.done).length;

  // textContent → 設定純文字（不解析 HTML，比 innerHTML 安全且快）
  countDisplay.textContent = `${total} 項任務，已完成 ${doneCount} 項`;
}

// ════════════════════════════════════════════════
// 5. 新增任務
// ════════════════════════════════════════════════

function addTask() {
  // .value → 取得 input 的當前值
  const text = input.value.trim();  // trim() 去除前後空白

  if (!text) {
    // 操作 classList → 控制 class（比直接操作 style 好維護）
    input.classList.add("error");       // 加 class
    setTimeout(() => {
      input.classList.remove("error");  // 移除 class
    }, 800);
    return;
  }

  const task = {
    id: nextId++,
    text,
    priority: prioritySel.value,  // .value 取得 select 當前選項
    done: false,
    createdAt: Date.now()
  };

  tasks.push(task);

  input.value = "";         // 清空 input
  input.focus();            // 讓 input 重新取得焦點（UX 細節）

  render();
}

// ════════════════════════════════════════════════
// 6. 事件監聽 & 事件委派（Event Delegation）
// ════════════════════════════════════════════════

// 直接監聽按鈕
addBtn.addEventListener("click", addTask);

// Enter 鍵新增
input.addEventListener("keydown", (e) => {
  // e.key → 按下的按鍵名稱（推薦）
  // e.keyCode → 已廢棄，不要用
  if (e.key === "Enter") addTask();
});

// ── 事件委派（Event Delegation）────────────────────────
// ❌ 錯誤做法：對每個 li 分別加監聽器
// 問題：動態新增的 li 需要重新綁定，記憶體佔用高

// ✓ 正確做法：監聽父層 ul，利用事件冒泡
taskList.addEventListener("click", (e) => {
  // e.target → 實際被點擊的元素
  // e.currentTarget → 監聽器掛在的元素（這裡是 taskList）

  // closest() → 從 e.target 往上找最近符合 selector 的祖先（含自身）
  const li = e.target.closest(".task-item");
  if (!li) return; // 點到 li 以外的地方，忽略

  const id = Number(li.dataset.id);  // 從 dataset 取出 id

  // 判斷點擊的是哪個子元素
  if (e.target.classList.contains("task-check")) {
    // 勾選 checkbox → 切換完成狀態
    toggleTask(id);
  } else if (e.target.classList.contains("delete-btn")) {
    // 刪除按鈕
    deleteTask(id, li);
  }
});

// ── 篩選按鈕（也用事件委派）───────────────────────────
filterGroup.addEventListener("click", (e) => {
  const btn = e.target.closest(".filter-btn");
  if (!btn) return;

  // 切換 active class
  document.querySelectorAll(".filter-btn").forEach(b => {
    b.classList.remove("active");   // 移除所有的 active
  });
  btn.classList.add("active");      // 加到被點擊的

  // 讀取 data-filter 屬性
  currentFilter = btn.dataset.filter;  // dataset.filter 讀 data-filter
  render();
});

// ════════════════════════════════════════════════
// 7. 任務操作
// ════════════════════════════════════════════════

function toggleTask(id) {
  const task = tasks.find(t => t.id === id);
  if (!task) return;
  task.done = !task.done;
  render();
}

function deleteTask(id, li) {
  // 加刪除動畫（操作 style 做一次性動畫）
  li.style.transition = "opacity 0.2s, transform 0.2s";
  li.style.opacity = "0";
  li.style.transform = "translateX(20px)";

  // transitionend 事件：CSS transition 結束後觸發
  li.addEventListener("transitionend", () => {
    tasks = tasks.filter(t => t.id !== id);
    render(); // 動畫結束才更新 DOM
  }, { once: true }); // { once: true } → 監聽器觸發一次後自動移除
}

clearDoneBtn.addEventListener("click", () => {
  tasks = tasks.filter(t => !t.done);
  render();
});

// ════════════════════════════════════════════════
// 8. 屬性操作補充範例
// ════════════════════════════════════════════════

// getAttribute / setAttribute → 操作 HTML attribute（字串）
// input.getAttribute("placeholder");      // "輸入新任務..."
// input.setAttribute("disabled", "");     // 禁用 input
// input.removeAttribute("disabled");      // 解除禁用

// property vs attribute 的差異：
// input.setAttribute("value", "hello");   // 改 HTML attribute（初始值）
// input.value = "hello";                  // 改 DOM property（當前值）← 應該用這個

// ════════════════════════════════════════════════
// 9. 初始化
// ════════════════════════════════════════════════

// DOMContentLoaded → HTML 解析完成就觸發（不等圖片/CSS）
// load → 所有資源（圖片、CSS）都載入後才觸發
document.addEventListener("DOMContentLoaded", () => {
  // 加入幾筆預設資料
  tasks = [
    { id: nextId++, text: "學習 DOM 操作", priority: "high", done: false },
    { id: nextId++, text: "完成 Side Project", priority: "medium", done: false },
    { id: nextId++, text: "複習事件冒泡", priority: "low", done: true },
  ];
  render();
  input.focus(); // 頁面載入後自動 focus
});
```

---

## 三、容易搞混的地方

### 坑 1：`textContent` vs `innerHTML` vs `innerText`

```js
const el = document.querySelector("#demo");

// textContent → 讀寫純文字，不解析 HTML，效能最好，最安全
el.textContent = "<b>粗體</b>"; // 畫面顯示：<b>粗體</b>（原樣文字）

// innerHTML → 讀寫 HTML，瀏覽器會解析
el.innerHTML = "<b>粗體</b>";   // 畫面顯示：粗體（真的變粗體）
// ⚠️ 使用者輸入直接塞 innerHTML = XSS 風險！

// innerText → 類似 textContent，但會考慮 CSS（hidden 元素不讀取）
// 效能比 textContent 差（觸發 reflow），通常用 textContent 即可
```

### 坑 2：`NodeList` 不是陣列

```js
const items = document.querySelectorAll(".task-item"); // NodeList

items.forEach(el => {});   // ✓ NodeList 有 forEach
items.map(el => {});       // ❌ TypeError：NodeList 沒有 map

// 轉成真正的陣列
[...items].map(el => {});         // ✓ 展開
Array.from(items).map(el => {}); // ✓ Array.from
```

### 坑 3：`e.target` vs `e.currentTarget`

```js
// <ul id="list">
//   <li><button>刪除</button></li>
// </ul>
list.addEventListener("click", (e) => {
  e.target;        // 實際點擊的元素（可能是 button）
  e.currentTarget; // 監聽器掛在的元素（永遠是 list）
});
```

### 坑 4：`attribute` vs `property`

```js
// attribute → HTML 標籤上的原始字串，用 get/setAttribute
// property  → JS 物件上的屬性，反映當前狀態

const input = document.querySelector("input");
input.setAttribute("value", "初始值"); // HTML attribute
input.value = "使用者改的";            // DOM property（當前值）

input.getAttribute("value"); // "初始值"（不會變）
input.value;                 // "使用者改的"（當前值）

// checked 也是同理
input.setAttribute("checked", ""); // 設定 HTML attribute
input.checked;                     // 讀 DOM property（當前勾選狀態）
```

### 坑 5：`DOMContentLoaded` vs `load`

```js
// DOMContentLoaded：HTML 解析完，DOM 可操作，不等圖片
// → script 放在 </body> 前可不用這個，但放在 <head> 要加

// load：所有資源（圖片、CSS、iframe）都下載完
window.addEventListener("load", () => {}); // 比 DOMContentLoaded 慢

// defer vs async（script 標籤屬性）
// <script defer src="app.js">  → DOM 解析完再執行，順序保證
// <script async src="app.js">  → 下載完就執行，順序不保證
```

### 坑 6：直接操作 `style` vs `classList`

```js
// ❌ 直接操作 style：CSS 邏輯散落在 JS 中，難維護
el.style.color = "red";
el.style.display = "none";

// ✓ 透過 classList 切換 class：CSS 邏輯留在 CSS 檔
el.classList.add("hidden");      // 加 class
el.classList.remove("hidden");   // 移除 class
el.classList.toggle("active");   // 有就移除，沒有就加
el.classList.contains("active"); // 回傳 boolean
el.classList.replace("old", "new"); // 替換 class
```

---

## 四、面試必考題

### Q1：事件冒泡（Bubbling）和捕獲（Capturing）的差別？

```js
// 事件傳播三階段：捕獲 → 目標 → 冒泡
// 預設 addEventListener 在「冒泡階段」監聽

parent.addEventListener("click", handler);          // 冒泡（預設）
parent.addEventListener("click", handler, true);    // 捕獲階段
parent.addEventListener("click", handler, { capture: true });

// stopPropagation → 阻止繼續傳播
btn.addEventListener("click", (e) => {
  e.stopPropagation(); // 不繼續往父層冒泡
});

// preventDefault → 阻止瀏覽器預設行為（不阻止冒泡）
link.addEventListener("click", (e) => {
  e.preventDefault(); // 阻止連結跳頁
});
```

### Q2：什麼是事件委派？為什麼要用？

> 把事件監聽器掛在**父層**，利用冒泡機制攔截子層的事件。  
> 好處：(1) 動態新增的子元素不需要重新綁定；(2) 只需要一個監聽器，記憶體效率高。

```js
// 關鍵：用 e.target.closest() 找到目標元素
list.addEventListener("click", (e) => {
  const item = e.target.closest(".task-item");
  if (!item) return;
  // 處理點擊邏輯
});
```

### Q3：`innerHTML` 的 XSS 風險，怎麼防範？

```js
// ❌ 危險：使用者輸入直接塞進 innerHTML
el.innerHTML = userInput; // 若 userInput = "<script>偷資料</script>"

// ✓ 防範：用 textContent 插入文字
el.textContent = userInput; // 自動 escape，安全

// ✓ 或手動 escape（需要顯示 HTML 結構，但內容是使用者輸入時）
function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}
el.innerHTML = `<span>${escapeHtml(userInput)}</span>`;
```

### Q4：如何高效率地批次插入大量 DOM 節點？

```js
// ❌ 效能差：每次 append 都觸發一次 reflow
items.forEach(item => {
  list.appendChild(createEl(item)); // N 次 reflow
});

// ✓ 用 DocumentFragment：只有最後一次 append 觸發 reflow
const fragment = document.createDocumentFragment();
items.forEach(item => fragment.appendChild(createEl(item)));
list.appendChild(fragment); // 只觸發 1 次 reflow
```

### Q5：`reflow` 和 `repaint` 的差別？哪些操作會觸發？

```
repaint（重繪）：只改外觀（color、background、visibility）
→ 效能代價小

reflow（回流/重排）：影響佈局（width、height、margin、font-size、DOM 增刪）
→ 效能代價大，可能連鎖觸發祖先元素的 reflow
```

```js
// 避免在迴圈裡讀寫混合（強制同步 layout）
// ❌ 效能陷阱
items.forEach(item => {
  const height = item.offsetHeight; // 讀：強制 reflow
  item.style.height = height + 10 + "px"; // 寫：標記 dirty
  // 下一次迴圈讀 offsetHeight 又強制 reflow → 抖動！
});

// ✓ 先批次讀，再批次寫
const heights = items.map(item => item.offsetHeight); // 批次讀
items.forEach((item, i) => {
  item.style.height = heights[i] + 10 + "px"; // 批次寫
});
```

### Q6：移除事件監聽器的正確方式？

```js
// ❌ 匿名函式無法移除
el.addEventListener("click", () => doSomething());
el.removeEventListener("click", () => doSomething()); // 新的 function，移除失敗

// ✓ 具名函式才能移除
function handleClick() { doSomething(); }
el.addEventListener("click", handleClick);
el.removeEventListener("click", handleClick); // 同一個 function reference ✓

// ✓ 或用 { once: true }，觸發一次後自動移除
el.addEventListener("click", handleClick, { once: true });
```

---

## 五、關鍵思考點 & 回顧

| 概念 | 一句話記憶 |
|---|---|
| querySelector | CSS selector 語法，回傳第一個 |
| querySelectorAll | 回傳 NodeList，不是陣列，要展開 |
| textContent vs innerHTML | 使用者輸入用 textContent，安全 |
| 事件委派 | 掛父層，用 closest() 抓目標，省記憶體 |
| e.target vs e.currentTarget | target 是點到的，currentTarget 是掛監聽的 |
| classList | CSS 邏輯留在 CSS，JS 只切換 class |
| DocumentFragment | 批次 DOM 操作，只觸發一次 reflow |
| attribute vs property | attribute 是 HTML 初始值，property 是當前狀態 |

**底層邏輯統一理解**：

DOM 操作貴就貴在**觸發瀏覽器的 layout 計算（reflow）**。框架（React/Vue）的 Virtual DOM 本質上是「在 JS 層先 diff，算出最小變更集合，再一次性更新真實 DOM」。理解這個，就理解了為什麼框架要存在——不是魔法，是有節制的 DOM 操作策略。
