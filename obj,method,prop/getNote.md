## 📘 函數與作用域核心概念總表

| 概念                                  | 定義 / 語法                     | Hoisting            | 可在定義前呼叫     | 有無自己的 `this`    | 有無 `arguments` | 能否作為建構函數 | 主要用途           | 一句話記憶              |
| ----------------------------------- | --------------------------- | ------------------- | ----------- | --------------- | -------------- | -------- | -------------- | ------------------ |
| **函式宣告式**<br>(Function Declaration) | `function foo() {}`         | ✅ 整個函數提升            | ✅           | ✅ (動態綁定)        | ✅              | ✅        | 一般功能函數         | 可在定義前呼叫，hoisting完整 |
| **函式表達式**<br>(Function Expression)  | `const foo = function() {}` | ❌ 變數提升為 `undefined` | ❌           | ✅ (動態綁定)        | ✅              | ✅        | 賦值、傳遞、callback | 不可在定義前呼叫，像變數一樣     |
| **IIFE**<br>(Immediately Invoked)   | `(function() {})()`         | ❌ 無提升               | ❌ (立即執行)    | ✅ (取決於函數類型)     | ✅              | ✅        | 隔離作用域、模擬區塊作用域  | 定義即執行，作用域隔離        |
| **箭頭函數**<br>(Arrow Function)        | `(a,b) => a+b`              | ❌ (視同表達式)           | ❌ (取決於宣告方式) | ❌ (繼承外層 `this`) | ❌              | ❌        | 簡短回呼、繼承 `this` | 無自己的 `this`，繼承外層   |
| **一級函式**<br>(First-class Function)  | 函數可賦值、傳參、回傳                 | —                   | —           | —               | —              | —        | 高階函數、閉包的基礎     | 函數 = 值，可傳遞、賦值、回傳   |


---

## 🔗 作用域鏈與閉包對照表
****

| 概念 | 核心機制 | 查找規則 | 典型程式碼範例 | 主要用途 | 記憶體風險 | 一句話記憶 |
|------|----------|----------|----------------|----------|------------|------------|
| **作用域鏈**<br>(Scope Chain) | 每個函數建立時記住外部詞法環境 (`[[Environment]]`) | 內 → 外 → 全域，找不到則 `ReferenceError` | `const x = 'global'; function outer() { const x = 'outer'; function inner() { console.log(x); } }` | 變數查找的規則 | 無 | 內層找不到 → 往外找 |
| **閉包**<br>(Closure) | 函數 + 定義時的作用域環境（外部函數執行完仍保留） | 閉包內的變數不被 GC 回收 | `function makeCounter() { let count = 0; return function() { count++; return count; }; }` | 資料封裝、工廠函數、回呼、React Hooks | ✅ 若持有大物件可能洩漏 | 函數記住它出生時的環境 |

---

## 📌 參數、引數與回傳值對照表

| 術語 | 說明 | 範例 | 備註 |
|------|------|------|------|
| **參數** (Parameter) | 函數定義時的佔位符 | `function add(a, b)` 中的 `a`, `b` | 形式參數 |
| **引數** (Argument) | 實際呼叫時傳入的值 | `add(1, 2)` 中的 `1`, `2` | 實際參數 |
| **回傳值** (Return) | 函數執行結果；無 `return` 則為 `undefined` | `return a + b` | 可中斷函數執行 |

---

## 🧩 閉包常見用途與範例對照表

| 用途 | 說明 | 程式碼範例 |
|------|------|------------|
| **資料封裝** | 模擬 private 變數，外部無法直接存取 | `function counter() { let c = 0; return { inc: () => ++c }; }` |
| **工廠函數** | 每次呼叫產生獨立狀態的函數 | `makeMultiplier(n) { return x => x * n; }` |
| **Callback / 事件處理** | 記住當時環境的變數 | `button.addEventListener('click', () => console.log(count));` |
| **React Hooks** | `useState` / `useEffect` 底層依賴閉包 | `const [state, setState] = useState(0);` |

---

## ⚡ 底層邏輯快速對照表

| 機制 | 原理 | 關鍵字 | 影響 |
|------|------|--------|------|
| **Hoisting** | 編譯階段：函式宣告整體提升；`var` 變數提升但值為 `undefined`；`let/const` 提升但進入 TDZ | 編譯階段、TDZ | 決定程式碼執行順序 |
| **作用域鏈** | 每個函數有 `[[Environment]]` 指向外部詞法環境 | 詞法環境、巢狀查找 | 變數查找與閉包形成基礎 |
| **閉包與 GC** | 閉包持有的外部變數若被內部函數引用，則不會被回收 | 記憶體洩漏、GC | 避免無意間保留大資料 |

---

## 🧪 練習題速查表（Level 1~3）

| 題號  | 類型      | 題目摘要                                                                                  | 答案 / 修正方式                                       |
| --- | ------- | ------------------------------------------------------------------------------------- | ----------------------------------------------- |
| 1   | Level 1 | `console.log(add(2,3)); function add(a,b){return a+b;}`                               | 輸出 `5` (函式宣告提升)                                 |
| 2   | Level 1 | `console.log(mul(2,3)); const mul = function(a,b){return a*b;};`                      | 報錯：`mul is not a function` (表達式未提升)             |
| 3   | Level 2 | 改寫箭頭函式，`setTimeout` 中 `this.name` 輸出？                                                 | 箭頭函數繼承外層 `this`，會輸出 `"Yoga"`；傳統函數輸出 `undefined` |
| 4   | Level 2 | IIFE 目的：`const result = (function(){ const secret=42; return {get:()=>secret}; })();` | 封裝 `secret`，外部無法存取 `result.secret`              |
| 5   | Level 3 | 實作 `makeMultiplier(n)`                                                                | `const makeMultiplier = n => x => x * n;`       |
| 6   | Level 3 | `for(var i=0;i<3;i++){ setTimeout(()=>console.log(i),0); }` 輸出？如何修正？                  | 輸出三個 `3`；修正：`var` 改 `let` 或用 IIFE 建立獨立作用域       |

---

以上表格涵蓋了教材中所有關鍵知識點，並以橫向欄位呈現，適合寬螢幕閱讀。您可以直接複製到 Markdown 編輯器中查看效果。如需調整欄位順序或增減內容，請隨時告知。