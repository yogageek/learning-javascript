# you asked

[文件: JS_Web_複習筆記.docx]

幫我把這篇筆記轉md格式
重新優化排版 也可以斟酌補充修正內容

以下是原本的意圖供你參考：
幫我寫面式複習筆記(md檔案)
以下這篇內容包含了一些書中關鍵字 請你針對關鍵字做講解
(先解釋意義和背景 再說明用法並包含程式範例註解 最後再說到注意事項)
(原文可能包含一些錯別字)
css+js=>rwd
webgl api

nodejs no more需要單獨架設網頁伺服器
repl env 

pcre perl

bom - ef bb bf


group groupend

vbscript
document.write attention


快取緩存js

為了避免使用者瀏覽舊資料 建議在修改檔案之後 將連接的外部檔名後方加上？ 和隨意字串 如此一來瀏覽器就會認為網址不同 而向伺服器要求重新載入

特別留意JavaScript數字是採用IEEE 754雙雀精度格式來儲存這樣的話標準的浮點數並不能精確的表示小數因此在進行數學運算時可能會出現精度問題，例如0.1 + 0.2的結果可能不等於0.3。為了避免這種情況，可以使用一些第三方庫來處理精確的數字運算，例如Decimal.js或Big.js。

這是因為使用這個標準實作浮點數 再進行計算時都會有福點數精確度的問題 因為我電腦只認識零跟一 袋將十進位制轉成二進位制計算時才承認精確度誤差 大多數程式語言都已經針對精確度問題做處理 必須手動排除這個問題

原生型別不是object所以沒有任何屬性 為了方便使用我們可以把原生型別當作物件來使用 JavaScript引擎會自動轉型成對應的物件type 這樣就可以使用物件的屬性

通常js遇到需要接受boolean value的時候會無聲無息進行boolean轉換很少需要用到Boolean函數來做轉換

typeof

symbol es6 

global variable attentions

for each / for of(cant use on object)

do while attentions

如果想要針對不同不同的錯誤類型進行處理 可以利用instead of運算值來判斷 當檢測的物件符合指定的類型時回傳true

模板字串進階用法標籤模板字串說明是解釋說明

---

# deepseek response

以下是將您提供的複習筆記轉換為 Markdown 格式並優化排版後的版本，已根據原始意圖補充與修正部分內容。

```markdown
# JavaScript / Web 複習筆記

涵蓋：RWD、WebGL、Node.js、REPL、PCRE、BOM、console.group、document.write、快取清除、浮點數精度、原生型別自動裝箱、型別轉換、typeof、Symbol、全域變數、迭代器、do-while、instanceof、模板字串標籤。

---

## 1. CSS + JS → RWD（響應式網頁設計）

### 意義與背景

RWD (Responsive Web Design) 由 Ethan Marcotte 於 2010 年提出。核心概念是讓同一份 HTML 在不同螢幕尺寸（手機、平板、桌機）都能自動調整排版，取代過去為手機獨立維護一套網站的做法。

CSS 本身就能做到大部分響應式需求，而 JS 則用於 CSS 無法處理的動態行為（例如偵測裝置方向改變後重新計算）。

### 用法說明

**三大技術支柱：**
- 流動格線（Fluid Grid）：使用 `%` 或 `fr` 取代固定 `px`
- 彈性媒體（Flexible Media）：圖片 `max-width: 100%`
- 媒體查詢（Media Query）：依視窗寬度套用不同 CSS

**CSS 媒體查詢範例：**
```css
/* 預設（手機優先 mobile-first） */
.container { padding: 16px; }

/* 平板以上（≥ 768px） */
@media (min-width: 768px) {
  .container { max-width: 960px; margin: 0 auto; }
}
```

**JS 輔助響應式範例：**
```javascript
// 監聽視窗大小變化，執行對應邏輯
window.addEventListener("resize", () => {
  if (window.innerWidth < 768) {
    // 手機版特定行為
  }
});
```

### 注意事項

> **⚠️ 注意：** 盡量以 CSS 解決，減少 JS 介入，可提升效能並降低複雜度。
> **⚠️ 注意：** 記得在 `<head>` 加入 viewport meta tag，否則行動裝置會縮放頁面：
> `<meta name="viewport" content="width=device-width, initial-scale=1.0">`

---

## 2. WebGL API

### 意義與背景

WebGL（Web Graphics Library）是瀏覽器原生支援的 3D 繪圖 API，基於 OpenGL ES 2.0/3.0 標準。讓 JavaScript 能直接操控 GPU 繪製高效能 2D/3D 圖形，無需任何插件。

實務上通常不直接寫 WebGL，而是使用 Three.js、Babylon.js 等封裝好的函式庫。

### 用法說明

```javascript
// 1. 取得 canvas 元素
const canvas = document.getElementById("myCanvas");

// 2. 取得 WebGL Context（繪圖上下文）
const gl = canvas.getContext("webgl");

// 3. 清除畫布（設定背景色）
gl.clearColor(0.0, 0.0, 0.0, 1.0); // RGBA，黑色
gl.clear(gl.COLOR_BUFFER_BIT);

// 後續需要撰寫 Shader（著色器）程式才能繪製圖形
```

### 注意事項

> **⚠️ 注意：** WebGL 程式碼繁瑣，直接操作困難。正式專案建議使用 Three.js 等高階封裝。
> **⚠️ 注意：** 部分舊裝置或瀏覽器不支援 WebGL，記得做降級處理（fallback）：
> ```javascript
> if (!gl) {
>   alert("您的瀏覽器不支援 WebGL");
> }
> ```

---

## 3. Node.js —— 不再需要單獨架設網頁伺服器

### 意義與背景

Node.js 是基於 Chrome V8 引擎的 JavaScript 執行環境，讓 JS 能在瀏覽器以外（伺服器端、命令列）執行。

傳統上執行 JS 只能在瀏覽器內，Node.js 打破了這個限制——你可以用 JS 直接寫 HTTP 伺服器，不再需要 Apache / Nginx 才能提供網頁服務。

### 用法說明

**建立一個最簡單的 HTTP 伺服器：**
```javascript
// server.js
const http = require('http'); // 載入內建 http 模組

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end('Hello, World!'); // 回應內容
});

server.listen(3000, () => {
  console.log('伺服器啟動於 http://localhost:3000');
});

// 執行：node server.js
```

### 注意事項

> **⚠️ 注意：** Node.js 是單執行緒（Single Thread），使用非阻塞 I/O（Non-blocking I/O）。CPU 密集型任務（如影像處理）會阻塞事件迴圈，需改用 Worker Threads。
> **⚠️ 注意：** Node.js 沒有 window、document 等瀏覽器物件，只有 Node.js 專屬的全域物件（global、process、__dirname 等）。

---

## 4. REPL 環境

### 意義與背景

REPL 全名 Read-Eval-Print Loop（讀取-求值-輸出循環），是一種互動式程式執行環境。在終端機輸入程式碼後，立即執行並顯示結果，適合快速測試與學習。

Node.js、Python、Ruby 都內建 REPL 環境。瀏覽器的開發者工具 Console 也是一種 REPL。

### 用法說明

```bash
# 在終端機輸入以下指令進入 Node.js REPL
$ node
> 1 + 2
3
> "hello".toUpperCase()
'HELLO'
> .exit   # 離開 REPL
```

### 注意事項

> **⚠️ 注意：** REPL 中的變數只存在於當次 Session，重啟後消失。
> **💡 提示：** 在 REPL 中輸入 `.help` 可查看所有指令（.exit, .clear, .load, .save 等）。

---

## 5. PCRE（Perl Compatible Regular Expressions）

### 意義與背景

PCRE 是由 Perl 程式語言發展出的正規表達式標準，功能強大且語法豐富。許多現代語言（PHP、Python、Ruby、JavaScript）的正規表達式都受 Perl 影響或與其相容。

JavaScript 本身的 RegExp 並非完整的 PCRE（例如早期不支援 Lookbehind），但 ES2018 開始逐步補齊。

### 用法說明

```javascript
// JavaScript 中的正規表達式
// 字面量語法
const regex = /hello/i; // i = 忽略大小寫

// 建構子語法（適合動態產生）
const pattern = new RegExp("hello", "i");

// 常用方法
const str = "Hello, World!";
console.log(regex.test(str)); // true（測試是否符合）
console.log(str.match(/\w+/g)); // ["Hello", "World"]（取得所有符合）
console.log(str.replace(/world/i, "JS")); // "Hello, JS!"

// 常用 PCRE 語法
// \d 數字 \w 字母數字底線 \s 空白
// ^ 開頭 $ 結尾 + 一個以上 * 零個以上 ? 零或一個
// () 分組 | 或 [] 字符集合
```

### 注意事項

> **⚠️ 注意：** 反斜線 `\` 在字串中需要跳脫（`\\d`），建議使用字面量語法 `/\d/` 避免混淆。
> **⚠️ 注意：** 貪婪（Greedy）匹配預設盡可能多匹配，加上 `?` 變為惰性（Lazy）匹配：`/.*?/`。

---

## 6. BOM（Byte Order Mark）—— EF BB BF

### 意義與背景

BOM 是文字檔案最開頭的特殊位元組序列，用來標記編碼格式與位元組順序。

UTF-8 的 BOM 是 3 個位元組：`EF BB BF`（十六進位）。Windows 記事本儲存 UTF-8 檔案時預設會加入 BOM。

雖然 BOM 在 UTF-8 中並無技術必要性，但仍被廣泛使用，尤其在 Windows 環境。

### 用法說明

```javascript
// 若 JS 檔案含有 BOM，某些舊版解析器可能報錯
// 現代瀏覽器與 Node.js 通常能自動忽略 UTF-8 BOM

// 偵測字串開頭是否有 BOM
const hasBOM = str => str.charCodeAt(0) === 0xFEFF;

// 移除 BOM
const removeBOM = str => str.charCodeAt(0) === 0xFEFF ? str.slice(1) : str;
```

### 注意事項

> **⚠️ 注意：** 讀取外部 CSV / TXT 檔案時，若開頭有 BOM（EF BB BF），split 或 parse 的第一欄可能包含不可見字元，導致比對失敗。記得先用 `removeBOM` 處理。
> **⚠️ 注意：** HTML 檔案如果包含 BOM，可能在某些瀏覽器造成解析問題。建議 HTML 儲存為「UTF-8 無 BOM」。

---

## 7. console.group / console.groupEnd

### 意義與背景

這兩個方法是瀏覽器開發者工具 Console 提供的分組功能，可將多個 log 訊息折疊成一組，方便閱讀複雜的除錯輸出。

### 用法說明

```javascript
// console.group(label)：開始一個可折疊的群組
console.group("使用者資訊");
console.log("姓名：小明");
console.log("年齡：18");

// 支援巢狀
console.group("地址");
console.log("城市：台北");
console.groupEnd(); // 結束內層群組

console.groupEnd(); // 結束外層群組

// console.groupCollapsed()：預設折疊（不展開）
console.groupCollapsed("預設折疊的群組");
console.log("這段預設看不到，需手動展開");
console.groupEnd();
```

### 注意事項

> **⚠️ 注意：** `group` 和 `groupEnd` 必須成對出現，否則後續 log 會一直縮排。
> **⚠️ 注意：** 這些方法只在瀏覽器 DevTools / Node.js 終端機有視覺效果，不影響程式邏輯。

---

## 8. VBScript

### 意義與背景

VBScript（Visual Basic Scripting Edition）是微軟開發的腳本語言，語法來自 Visual Basic。1990 年代用於 Internet Explorer 的客戶端腳本，是 JavaScript 在 IE 中的替代品。

**現已廢棄（Deprecated）。** 現代瀏覽器（Chrome、Firefox、新版 Edge）均不支援。只有舊版 IE 支援，在企業內部系統中偶爾仍可見到。

### 注意事項

> **⚠️ 注意：** 若維護舊系統時看到 `<script type="text/vbscript">`，需評估遷移成本，將其改寫為 JavaScript。
> **⚠️ 注意：** 絕對不要在新專案中使用 VBScript。

---

## 9. document.write —— 注意事項

### 意義與背景

`document.write()` 是最早期的 DOM 操作方式，可將 HTML 字串直接插入文件中。在網頁載入過程中呼叫時，內容會被寫入目前的串流（stream）位置。

### 用法說明

```javascript
// 在頁面載入期間呼叫（可運作，但不推薦）
document.write("<p>Hello</p>");

// ❌ 在頁面載入完成後呼叫——會清除整個頁面！
window.onload = function() {
  document.write("<p>這會清除所有現有內容！</p>");
};

// ✅ 現代替代方式
document.getElementById("app").innerHTML = "<p>Hello</p>";
// 或使用 DOM API
const p = document.createElement("p");
p.textContent = "Hello";
document.body.appendChild(p);
```

### 注意事項

> **⚠️ 注意：** 頁面載入完成後呼叫 `document.write()`，會觸發 `document.open()`，清除整個頁面所有內容！
> **⚠️ 注意：** Google PageSpeed 等工具會警告 `document.write()` 影響效能，因為它會阻塞 HTML Parser。
> **✅ 建議：** 所有新專案都改用 DOM API（`createElement`、`appendChild`、`innerHTML` 等）。

---

## 10. JS 快取緩存（Cache Busting）

### 意義與背景

瀏覽器為了加速載入，會將 CSS、JS、圖片等靜態資源緩存（cache）在本地。當你更新了檔案內容，使用者的瀏覽器可能仍讀取舊的緩存版本。

**Cache Busting（快取破壞）** 是一種技術，讓瀏覽器「認為」資源網址改變，強制重新下載最新版本。

### 用法說明

**方法一：在 URL 後面加上查詢字串（Query String）**
```html
<!-- 修改前 -->
<script src="app.js"></script>

<!-- 修改後，加上版本號或隨機字串，瀏覽器視為不同網址 -->
<script src="app.js?v=2.0.1"></script>
<script src="app.js?t=20240501"></script>
<script src="app.js?hash=abc123"></script>
```

**方法二（推薦）：將 hash 加入檔名**
```html
<!-- Webpack / Vite 等打包工具可自動產生 content hash -->
<script src="app.b3f2e1a9.js"></script>
<!-- 檔案內容改變 → hash 改變 → 瀏覽器自動下載新版 -->
```

### 注意事項

> **⚠️ 注意：** 純加查詢字串的方法在某些 CDN 或代理伺服器可能無效（有些 CDN 會忽略 query string 做緩存 key）。
> **⚠️ 注意：** 使用打包工具（Vite、Webpack）時，content hash 是最可靠的快取破壞方式，強烈建議採用。

---

## 11. IEEE 754 雙精度浮點數與精度問題

### 意義與背景

JavaScript 的所有數字都以 **IEEE 754 雙精度（64-bit）浮點數格式**儲存，這是一個二進位的浮點數標準。

問題根源：大多數十進位小數（如 `0.1`）無法被精確轉換成有限的二進位小數，就像 `1/3` 在十進位是無限小數 `0.333...`。因此 `0.1 + 0.2` 的二進位計算結果不是精確的 `0.3`。

**這不是 JavaScript 的 bug**，幾乎所有程式語言（C、Java、Python）在底層都有相同問題。

### 用法說明

```javascript
// 問題示範
console.log(0.1 + 0.2); // 0.30000000000000004（不是 0.3！）
console.log(0.1 + 0.2 === 0.3); // false

// ── 解法 1：使用 toFixed 四捨五入顯示 ──
console.log((0.1 + 0.2).toFixed(1)); // "0.3"（字串）

// ── 解法 2：使用 Number.EPSILON 容差比較 ──
const isEqual = (a, b) => Math.abs(a - b) < Number.EPSILON;
console.log(isEqual(0.1 + 0.2, 0.3)); // true

// ── 解法 3：轉成整數計算（金融場景常用）──
const add = (a, b) => (Math.round(a * 100) + Math.round(b * 100)) / 100;
console.log(add(0.1, 0.2)); // 0.3

// ── 解法 4：使用第三方函式庫 ──
// Decimal.js 或 Big.js（需 npm install）
const Decimal = require('decimal.js');
console.log(new Decimal(0.1).plus(0.2).toString()); // "0.3"
```

### 注意事項

> **⚠️ 注意：** 金融、計費、精確科學計算等場景，不能依賴原生浮點數，必須使用 Decimal.js / Big.js 或整數運算。
> **⚠️ 注意：** `parseInt` / `Math.round` 可以處理四捨五入顯示，但根本上無法解決二進位表示的精度限制。

---

## 12. 原生型別自動裝箱（Primitive Autoboxing）

### 意義與背景

JavaScript 的原生型別（Primitive Types）包括：`string`、`number`、`boolean`、`null`、`undefined`、`symbol`、`bigint`。它們本身不是物件（object），沒有屬性或方法。

但在實務中，我們可以直接對字串呼叫方法，例如 `"hello".toUpperCase()`，這是因為 JavaScript 引擎在存取屬性時會自動進行 **「裝箱（Autoboxing）」**——暫時將原生值包裝成對應的物件型別（String 物件），呼叫方法後再丟棄。

### 用法說明

```javascript
// 表面上看起來像物件操作
"hello".toUpperCase(); // "HELLO" → 引擎暫時建立 new String("hello")
(42).toString();       // "42"   → 引擎暫時建立 new Number(42)
true.toString();       // "true" → 引擎暫時建立 new Boolean(true)

// 原生型別 vs 物件型別
const a = "hello";          // 原生字串
const b = new String("hello"); // String 物件
console.log(typeof a);      // "string"
console.log(typeof b);      // "object"
console.log(a === b);       // false！

// null 和 undefined 沒有對應的包裝物件
// null.toString(); // ❌ TypeError: Cannot read properties of null
```

### 注意事項

> **⚠️ 注意：** 不要使用 `new String()`、`new Number()`、`new Boolean()` 建立包裝物件，這會讓型別比較產生非預期的結果（`===` 比較時物件 ≠ 原生值）。
> **⚠️ 注意：** `null` 和 `undefined` 沒有自動裝箱機制，直接存取其屬性會拋出 `TypeError`。

---

## 13. Boolean 轉換（Truthy & Falsy）

### 意義與背景

JavaScript 在需要布林值的地方（`if`、`while`、三元運算子、`&&`、`||` 等）會自動將值轉換成 `true` 或 `false`。大多數值都是 **truthy**（轉換後為 `true`），只有少數值是 **falsy**（轉換後為 `false`）。

### 用法說明

**六個 Falsy 值（背起來！）：**
- `false`
- `0`
- `""`（空字串）
- `null`
- `undefined`
- `NaN`

> 以上六個之外的所有值都是 truthy，包含：`[]`（空陣列）、`{}`（空物件）、`"0"`（字串 "0"）。

```javascript
// 自動轉換範例
if ("hello") console.log("truthy"); // 輸出（非空字串 = truthy）
if (0) console.log("truthy");       // 不輸出（0 = falsy）
if ([]) console.log("truthy");      // 輸出（空陣列 = truthy！）

// Boolean() 函式可以明確轉換
Boolean(0);   // false
Boolean("hi"); // true

// 慣用的雙驚嘆號寫法
!!0;        // false
!!"hello";  // true
```

### 注意事項

> **⚠️ 注意：** 空陣列 `[]` 和空物件 `{}` 都是 truthy，初學者常犯錯！檢查陣列是否為空要用 `arr.length === 0`。

---

## 14. typeof 運算子

### 意義與背景

`typeof` 是一個單元運算子，回傳字串，表示運算元的型別。是 JavaScript 最基本的型別檢查工具。

### 用法說明

```javascript
typeof "hello"      // "string"
typeof 42           // "number"
typeof true         // "boolean"
typeof undefined    // "undefined"
typeof Symbol()     // "symbol"
typeof 42n          // "bigint"
typeof function(){} // "function"

// ⚠️ 歷史遺留問題
typeof null         // "object"（這是 JS 的 bug，null 不是 object）
typeof []           // "object"（陣列也是 object）
typeof {}           // "object"

// 正確判斷 null
value === null

// 正確判斷陣列
Array.isArray([])
```

### 注意事項

> **⚠️ 注意：** `typeof null === "object"` 是 JavaScript 歷史遺留的 bug（規格設計錯誤），千萬不要用 `typeof` 判斷 `null`。
> **⚠️ 注意：** `typeof` 無法區分 array 和 object，判斷陣列要用 `Array.isArray()`。

---

## 15. Symbol（ES6）

### 意義與背景

`Symbol` 是 ES6（ES2015）引入的第七種原生型別。每個 Symbol 值都是**唯一且不可變**的，主要用途是作為物件屬性的「唯一識別子（key）」，避免命名衝突。

### 用法說明

```javascript
// 建立 Symbol（每個都是唯一的）
const s1 = Symbol("description");
const s2 = Symbol("description");
console.log(s1 === s2); // false！即使描述相同也不相等

// 作為物件屬性 key，避免命名衝突
const KEY = Symbol("key");
const obj = {};
obj[KEY] = "秘密值";
console.log(obj[KEY]); // "秘密值"
console.log(Object.keys(obj)); // []（Symbol key 不會出現在一般列舉中）

// 全域共用 Symbol
const shared = Symbol.for('app.id'); // 若已存在則回傳相同 Symbol
Symbol.keyFor(shared); // 'app.id'

// 內建 Well-known Symbol（改變語言行為）
// Symbol.iterator、Symbol.toPrimitive、Symbol.hasInstance 等
```

### 注意事項

> **⚠️ 注意：** Symbol 屬性不會被 `for...in`、`Object.keys()`、`JSON.stringify()` 列舉到，適合存放「私有」或「不應被外部干擾」的屬性。
> **⚠️ 注意：** `Symbol()` 不能用 `new`，否則會 TypeError：`const s = new Symbol()` // 錯誤

---

## 16. 全域變數（Global Variable）注意事項

### 意義與背景

在函式外部宣告的變數，或使用 `var` 在任何地方宣告的變數，都會成為全域變數，掛在 `window`（瀏覽器）或 `global`（Node.js）物件上。

### 用法說明

```javascript
// ❌ 污染全域的常見方式
x = 10;          // 沒有用 var/let/const，自動變全域
var y = 20;      // var 在函式外 = 全域

// ✅ 正確方式：使用 let / const，限制在區塊/模組作用域
let z = 30;      // 區塊作用域，不掛在 window

// 全域變數的問題示範
function setCount() { count = 0; } // count 變全域！
function inc() { count++; }

// ✅ 封裝成模組或使用 IIFE
(function() {
  let count = 0;   // 只在 IIFE 內部可見
  // ...
})();
```

### 注意事項

> **⚠️ 注意：** 多個 script 標籤共用全域空間，全域變數容易造成「命名衝突」，尤其在引入第三方函式庫時。
> **⚠️ 注意：** 嚴格模式（`"use strict"`）下，對未宣告的變數賦值會直接拋出 `ReferenceError`，可有效防止意外建立全域變數。

---

## 17. forEach / for...of（不能用在一般物件）

### 意義與背景

JavaScript 有多種迭代方式，最常見的是 `forEach` 和 `for...of`。兩者都能遍歷陣列，但 `for...of` 更通用（可用於任何可迭代物件 Iterable），而普通物件（`{}`）兩者都不能直接使用。 

### 用法說明

```javascript
// ── forEach ──────────────────────────────────────
// Array 的方法，無法 break 或 continue
[1, 2, 3].forEach((item, index) => {
  console.log(index, item);
});

// ── for...of ──────────────────────────────────────
// 可用於任何 Iterable：Array, String, Map, Set, NodeList...
// 可以使用 break / continue
for (const item of [1, 2, 3]) {
  if (item === 2) break; // ✅ 可以中斷
  console.log(item);
}

// String 也是 Iterable
for (const char of "hello") {
  console.log(char); // h e l l o
}

// ❌ 一般物件 {} 不是 Iterable，不能用 for...of
const obj = { a: 1, b: 2 };
// for (const x of obj) {} // TypeError: obj is not iterable

// ✅ 物件改用 for...in（遍歷 key）或 Object.entries()
for (const key in obj) {
  console.log(key, obj[key]);
}
for (const [key, val] of Object.entries(obj)) {
  console.log(key, val);
}
```

### 注意事項

> **⚠️ 注意：** `forEach` 無法中途 `break`，若需要提前結束迴圈，改用 `for...of` 或 `some()` / `every()`。
> **⚠️ 注意：** `for...in` 遍歷的是「所有可列舉的屬性（包含原型鏈上的）」，用於物件時加上 `hasOwnProperty` 判斷更安全。

---

## 18. do...while 注意事項

### 意義與背景

`do...while` 是一種「先執行後判斷」的迴圈，保證迴圈本體至少執行一次。與 `while` 的差異在於條件判斷的位置：`while` 是先判斷，`do...while` 是後判斷。

### 用法說明

```javascript
// ── while（先判斷）──────────────────────────────
let i = 0;
while (i > 0) {
  console.log(i); // 永遠不執行
}

// ── do...while（後判斷，至少執行一次）─────────────
let j = 0;
do {
  console.log(j); // 輸出 0（即使條件一開始就是 false）
  j++;
} while (j > 0 && j < 3);
// 輸出：0, 1, 2

// 典型用途：輸入驗證
let input;
do {
  input = prompt('請輸入 1-10 的數字：');
} while (input < 1 || input > 10); // 不合法就重問
```

### 注意事項

> **⚠️ 注意：** `do...while` 最容易忘記的是結尾的分號：`} while (condition);` —— 分號不可省略！
> **⚠️ 注意：** 若條件永遠為 `true`，會形成無限迴圈，務必確認迴圈內有能讓條件變 `false` 的邏輯。

---

## 19. instanceof 運算子

### 意義與背景

`instanceof` 是 JavaScript 的運算子，用來判斷一個物件的原型鏈（prototype chain）中，是否存在某個建構子的 `prototype`，若符合則回傳 `true`。

### 用法說明

```javascript
// 基本用法
const arr = [1, 2, 3];
console.log(arr instanceof Array);  // true
console.log(arr instanceof Object); // true（陣列的原型鏈包含 Object）

// 搭配 try...catch 做錯誤類型判斷
class NetworkError extends Error {}
class ValidationError extends Error {}

try {
  throw new NetworkError("連線失敗");
} catch (err) {
  if (err instanceof NetworkError) {
    console.log("網路錯誤：重試中...");
  } else if (err instanceof ValidationError) {
    console.log("驗證錯誤：請重新輸入");
  } else {
    throw err; // 未知錯誤繼續往上拋
  }
}
```

### 注意事項

> **⚠️ 注意：** `instanceof` 檢查原型鏈，跨 iframe 或不同執行環境的物件可能失效（因為各自有不同的 Array、Object 建構子）。
> **⚠️ 注意：** 原生型別（string、number）不能用 `instanceof`，因為它們不是物件：
> ```javascript
> "hello" instanceof String // false（原生字串不是 String 物件）
> typeof "hello" === "string" // true（應用 typeof 判斷原生型別）
> ```

---

## 20. 模板字串進階：標籤模板字串（Tagged Template Literals）

### 意義與背景

模板字串（Template Literals，ES6）用反引號（`` ` ``）包住，支援多行字串和 `${}` 插值。

**「標籤模板字串（Tagged Template）」** 是更進階的用法：在模板字串前面加上一個「標籤函式（tag function）」，讓你完全控制字串的組合方式，不只是簡單的字串拼接。

知名使用案例：`styled-components`（CSS-in-JS 函式庫）、GraphQL（`gql` 標籤）、SQL 防注入等。

### 用法說明

```javascript
// ── 一般模板字串 ──────────────────────────────────
const name = "小明";
const age = 18;
const msg = `我是 ${name}，今年 ${age} 歲`;
// "我是 小明，今年 18 歲"

// ── 標籤模板字串 ──────────────────────────────────
// tag`string ${expr} string`
// tag 是一個函式，JS 引擎會把字串和插值分開傳入

function highlight(strings, ...values) {
  // strings：靜態字串陣列 ["我是 ", "，今年 ", " 歲"]
  // values： 插值陣列 ["小明", 18]
  return strings.reduce((result, str, i) => {
    const val = values[i] !== undefined
      ? `<b>${values[i]}</b>` // 讓插值加粗
      : "";
    return result + str + val;
  }, "");
}

const output = highlight`我是 ${name}，今年 ${age} 歲`;
// "我是 <b>小明</b>，今年 <b>18</b> 歲"

// ── 實務範例：SQL 防注入 ──────────────────────────
function safeSQL(strings, ...values) {
  // 對 values 做 escape 處理，防止 SQL injection
  const escaped = values.map(v => String(v).replace(/'/g, "''"));
  return strings.reduce((q, s, i) => q + s + (escaped[i] ?? ''), '');
}

const userId = "1' OR '1'='1"; // 惡意輸入
const query = safeSQL`SELECT * FROM users WHERE id = ${userId}`;
```

### 注意事項

> **⚠️ 注意：** 標籤函式的第一個參數 `strings` 陣列比 `values` 多一個元素，記得處理最後一個 `strings[n]` 沒有對應 `values` 的情況。
> **💡 實務：** `styled-components` 使用標籤模板字串讓你在 JS 中寫 CSS：`const Box = styled.div`color: red;``

---

**— 完 —**
```