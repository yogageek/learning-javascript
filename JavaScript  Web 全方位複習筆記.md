閱讀指引 每個主題遵循固定結構：意義與背景 → 用法 + 程式範例 → 注意事項 文末附有「面試必考題」與「自我思考題」幫助鞏固理解。

目錄
Part 1｜Web 技術基礎

CSS + JS → RWD
WebGL API
Node.js
REPL 環境
PCRE 正規表達式
BOM（Byte Order Mark）
console.group / groupEnd
VBScript
document.write
快取緩存 Cache Busting
Part 2｜JavaScript 核心觀念 11. IEEE 754 浮點數精度 12. 原生型別自動裝箱 13. Boolean 轉換 Truthy & Falsy 14. typeof 運算子 15. Symbol（ES6） 16. 全域變數注意事項 17. forEach / for...of 18. do...while 19. instanceof 運算子 20. 標籤模板字串

Part 3｜集合物件 Collection 21. Array 22. Object 23. Map 24. Set 25. WeakMap & WeakSet

Part 4｜綜合練習

面試必考題
自我思考題
常見陷阱總整理
Part 1｜Web 技術基礎
1. CSS + JS → RWD
意義與背景
RWD（Responsive Web Design）由 Ethan Marcotte 於 2010 年提出。核心概念是讓同一份 HTML 在不同螢幕尺寸（手機、平板、桌機）都能自動調整排版，取代過去為手機獨立維護一套網站的做法。

CSS 本身就能做到大部分響應式需求，JS 則用於 CSS 無法處理的動態行為（例如偵測裝置方向改變後重新計算版面）。

用法說明
三大技術支柱：

支柱	說明
流動格線（Fluid Grid）	使用 % 或 fr 取代固定 px
彈性媒體（Flexible Media）	圖片加上 max-width: 100%
媒體查詢（Media Query）	依視窗寬度套用不同 CSS
/* 預設（手機優先 mobile-first） */
.container { padding: 16px; }

/* 平板以上（≥ 768px） */
@media (min-width: 768px) {
  .container { max-width: 960px; margin: 0 auto; }
}

/* 桌機以上（≥ 1200px） */
@media (min-width: 1200px) {
  .container { max-width: 1140px; }
}
// JS 輔助：監聽視窗大小變化
window.addEventListener("resize", () => {
  if (window.innerWidth < 768) {
    // 手機版特定行為
  }
});
注意事項
⚠️ 盡量以 CSS 解決，減少 JS 介入，可提升效能並降低複雜度。

⚠️ 記得在 <head> 加入 viewport meta tag，否則行動裝置會縮放頁面：

<meta name="viewport" content="width=device-width, initial-scale=1.0">
2. WebGL API
意義與背景
WebGL（Web Graphics Library）是瀏覽器原生支援的 3D 繪圖 API，基於 OpenGL ES 2.0/3.0 標準，讓 JavaScript 能直接操控 GPU 繪製高效能 2D/3D 圖形，無需任何插件。

實務上通常不直接寫原生 WebGL，而是透過 Three.js、Babylon.js 等高階封裝函式庫。

用法說明
// 1. 取得 canvas 元素
const canvas = document.getElementById("myCanvas");

// 2. 取得 WebGL Context（繪圖上下文）
const gl = canvas.getContext("webgl");

// 3. 清除畫布（設定背景色）
gl.clearColor(0.0, 0.0, 0.0, 1.0); // RGBA，黑色
gl.clear(gl.COLOR_BUFFER_BIT);

// 後續需要撰寫 Shader（著色器）才能繪製圖形
// 建議改用 Three.js 封裝
注意事項
⚠️ 直接操作 WebGL 程式碼繁瑣，正式專案建議使用 Three.js 等高階封裝。

⚠️ 部分舊裝置不支援 WebGL，記得做降級處理：

if (!gl) alert("您的瀏覽器不支援 WebGL");
3. Node.js
意義與背景
Node.js 是基於 Chrome V8 引擎的 JavaScript 執行環境，讓 JS 能在瀏覽器以外（伺服器端、命令列）執行。

傳統上執行 JS 只能在瀏覽器內，Node.js 打破了這個限制——可以直接用 JS 寫 HTTP 伺服器，不再需要 Apache / Nginx 才能提供網頁服務。

用法說明
// server.js — 最簡單的 HTTP 伺服器
const http = require('http'); // 載入內建 http 模組

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end('Hello, World!');
});

server.listen(3000, () => {
  console.log('伺服器啟動於 http://localhost:3000');
});

// 執行：node server.js
注意事項
⚠️ Node.js 是單執行緒，使用非阻塞 I/O。CPU 密集型任務會阻塞事件迴圈，需改用 Worker Threads。

⚠️ Node.js 沒有 window、document 等瀏覽器物件，全域物件是 global、process、__dirname 等。

4. REPL 環境
意義與背景
REPL 全名 Read-Eval-Print Loop（讀取-求值-輸出 循環），是一種互動式程式執行環境。輸入程式碼後立即執行並顯示結果，適合快速測試與學習。

瀏覽器開發者工具的 Console 也是一種 REPL。

用法說明
# 進入 Node.js REPL
$ node

> 1 + 2
3
> "hello".toUpperCase()
'HELLO'
> const arr = [1, 2, 3]
undefined
> arr.map(x => x * 2)
[ 2, 4, 6 ]
> .help     # 查看所有指令
> .exit     # 離開 REPL
注意事項
⚠️ REPL 中的變數只存在於當次 Session，重啟後消失。

💡 .help 可查看所有指令：.exit、.clear、.load、.save 等。

5. PCRE（正規表達式）
意義與背景
PCRE（Perl Compatible Regular Expressions）是由 Perl 程式語言發展出的正規表達式標準。許多現代語言（PHP、Python、Ruby、JavaScript）的正規表達式都受 Perl 影響。

JavaScript 的 RegExp 並非完整的 PCRE，但 ES2018 後逐步補齊（如 Lookbehind、具名捕獲群組）。

用法說明
// 字面量語法（推薦）
const regex = /hello/i;         // i = 忽略大小寫

// 建構子語法（適合動態產生 pattern）
const pattern = new RegExp("hello", "i");

// 常用方法
const str = "Hello, World!";
regex.test(str);                 // true — 測試是否符合
str.match(/\w+/g);               // ["Hello", "World"] — 取所有符合
str.replace(/world/i, "JS");     // "Hello, JS!"
str.split(/,\s*/);               // ["Hello", "World!"]

// ES2018 具名捕獲群組
const dateStr = "2024-05-01";
const { year, month, day } = dateStr.match(
  /(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})/
).groups;
// year="2024", month="05", day="01"

// 常用語法速查
// \d 數字  \w 字母數字底線  \s 空白  . 任意字元
// ^  開頭  $  結尾
// +  一個以上  *  零個以上  ?  零或一個
// {n,m} n 到 m 個
// ()  分組  |  或  []  字符集合
// (?:) 非捕獲群組  (?=) 正向前瞻  (?!) 負向前瞻
注意事項
⚠️ 反斜線 \ 在字串中需要跳脫（\\d），建議優先使用字面量語法 /\d/。

⚠️ 貪婪匹配預設盡可能多匹配，加上 ? 變為惰性匹配：/.*?/。

6. BOM（Byte Order Mark）
意義與背景
BOM 是文字檔案最開頭的特殊位元組序列，用來標記編碼格式。UTF-8 的 BOM 是 3 個位元組：EF BB BF（十六進位）。Windows 記事本儲存 UTF-8 時預設會加入 BOM。

編碼	BOM 位元組
UTF-8	EF BB BF
UTF-16 LE	FF FE
UTF-16 BE	FE FF
用法說明
// 偵測字串開頭是否有 BOM（Unicode 碼點 U+FEFF）
const hasBOM = str => str.charCodeAt(0) === 0xFEFF;

// 移除 BOM
const removeBOM = str =>
  str.charCodeAt(0) === 0xFEFF ? str.slice(1) : str;

// 實際應用：讀取 CSV 前先移除 BOM
fetch("data.csv")
  .then(r => r.text())
  .then(text => {
    const clean = removeBOM(text);
    const rows = clean.split("\n");
    // ...
  });
注意事項
⚠️ 讀取外部 CSV / TXT 檔案時，若開頭有 BOM，split 或 parse 的第一欄可能包含不可見字元，導致比對失敗。

⚠️ HTML 檔案含 BOM 可能在某些瀏覽器造成解析問題。建議儲存為「UTF-8 無 BOM」。

7. console.group / console.groupEnd
意義與背景
瀏覽器 DevTools Console 提供的分組功能，可將多個 log 訊息折疊成一組，讓複雜的除錯輸出更易閱讀。

用法說明
// console.group(label)：開始可折疊的群組
console.group("使用者資訊");
  console.log("姓名：小明");
  console.log("年齡：18");

  // 支援巢狀
  console.group("地址");
    console.log("城市：台北");
  console.groupEnd(); // 結束內層

console.groupEnd(); // 結束外層

// console.groupCollapsed()：預設折疊（適合大量輸出）
console.groupCollapsed("HTTP 請求詳情");
  console.log("URL:", url);
  console.log("Headers:", headers);
console.groupEnd();

// 實用範例：在迴圈中分組
data.forEach((item, i) => {
  console.group(`Item #${i}`);
  console.log(item);
  console.groupEnd();
});
注意事項
⚠️ group 和 groupEnd 必須成對出現，否則後續 log 會一直縮排。

⚠️ 這些方法只在 DevTools 有視覺效果，不影響程式邏輯，正式環境建議移除。

8. VBScript
意義與背景
VBScript（Visual Basic Scripting Edition）是微軟開發的腳本語言，語法來自 Visual Basic。1990 年代用於 Internet Explorer 的客戶端腳本，是 JavaScript 在 IE 中的替代品。

現已廢棄（Deprecated）。 現代瀏覽器（Chrome、Firefox、新版 Edge）均不支援，只有舊版 IE 支援。

注意事項
⚠️ 若維護舊系統看到 <script type="text/vbscript">，需評估遷移成本，改寫為 JavaScript。

⚠️ 絕對不要在新專案中使用 VBScript。

9. document.write
意義與背景
document.write() 是最早期的 DOM 操作方式，可將 HTML 字串直接寫入文件串流。在網頁載入期間呼叫有效，但載入完成後呼叫會摧毀整個頁面。

用法說明
// ⚠️ 在頁面載入期間呼叫（勉強可運作，但不推薦）
document.write("<p>Hello</p>");

// ❌ 頁面載入完成後呼叫——清除整個頁面！
window.onload = function() {
  document.write("<p>這會清除所有現有內容！</p>");
  // 等同於觸發 document.open() → 重新開啟文件串流
};

// ✅ 現代替代方式 1：innerHTML
document.getElementById("app").innerHTML = "<p>Hello</p>";

// ✅ 現代替代方式 2：DOM API（更安全，避免 XSS）
const p = document.createElement("p");
p.textContent = "Hello"; // 不解析 HTML，防 XSS
document.body.appendChild(p);

// ✅ 現代替代方式 3：insertAdjacentHTML（效能好，位置靈活）
document.body.insertAdjacentHTML("beforeend", "<p>Hello</p>");
注意事項
⚠️ 頁面載入完成後呼叫 document.write()，會清除整個頁面所有內容！

⚠️ Google PageSpeed 等工具會警告 document.write() 阻塞 HTML Parser，影響效能。

✅ 新專案一律改用 DOM API，並注意 innerHTML 存在 XSS 風險，若插入使用者輸入的字串需先做 escape。

10. 快取緩存 Cache Busting
意義與背景
瀏覽器為加速載入，會將 CSS、JS、圖片等靜態資源緩存在本地。當你更新了檔案內容，使用者可能仍讀取舊的緩存版本。Cache Busting 讓瀏覽器「認為」資源網址改變，強制重新下載最新版本。

用法說明
方法一：URL 加上查詢字串（手動維護，不推薦）

<!-- 修改前 -->
<script src="app.js"></script>

<!-- 修改後，加版本號讓瀏覽器視為不同網址 -->
<script src="app.js?v=2.0.1"></script>
<script src="app.js?t=20240501120000"></script>
方法二：Content Hash 寫入檔名（推薦）

<!-- Webpack / Vite 自動產生 content hash -->
<script src="app.b3f2e1a9.js"></script>
<!-- 檔案內容改變 → hash 改變 → 瀏覽器自動下載新版 -->
// Vite 設定（vite.config.js）
export default {
  build: {
    rollupOptions: {
      output: {
        entryFileNames: 'assets/[name].[hash].js',
        chunkFileNames: 'assets/[name].[hash].js',
        assetFileNames: 'assets/[name].[hash][extname]'
      }
    }
  }
}
注意事項
⚠️ 純加查詢字串的方法在某些 CDN 可能無效（部分 CDN 忽略 query string 做緩存 key）。

✅ 使用打包工具（Vite、Webpack）時，content hash 是最可靠的方式，強烈建議採用。

Part 2｜JavaScript 核心觀念
11. IEEE 754 浮點數精度
意義與背景
JavaScript 的所有數字都以 IEEE 754 雙精度（64-bit）浮點數格式儲存。問題根源：大多數十進位小數（如 0.1）無法被精確轉換成有限的二進位小數，就像 1/3 在十進位是無限小數 0.333...。

這不是 JavaScript 的 bug，幾乎所有語言（C、Java、Python）在底層都有相同問題。

十進位 0.1 → 二進位 0.000110011001100...（循環，永遠無法精確表示）
用法說明
// 問題示範
console.log(0.1 + 0.2);           // 0.30000000000000004
console.log(0.1 + 0.2 === 0.3);   // false

// ── 解法 1：toFixed 四捨五入（顯示用）──
(0.1 + 0.2).toFixed(1);           // "0.3"（字串）

// ── 解法 2：Number.EPSILON 容差比較 ──
const isEqual = (a, b) => Math.abs(a - b) < Number.EPSILON;
isEqual(0.1 + 0.2, 0.3);          // true

// ── 解法 3：整數運算（金融場景推薦）──
const add = (a, b, precision = 100) =>
  (Math.round(a * precision) + Math.round(b * precision)) / precision;
add(0.1, 0.2);                    // 0.3

// ── 解法 4：第三方函式庫 ──
// npm install decimal.js
const { Decimal } = require('decimal.js');
new Decimal(0.1).plus(0.2).toString(); // "0.3"
注意事項
⚠️ 金融、計費等場景不能依賴原生浮點數，必須使用 Decimal.js / Big.js 或整數運算。

⚠️ toFixed 回傳的是字串，需要數值時記得 parseFloat()。

12. 原生型別自動裝箱（Autoboxing）
意義與背景
JavaScript 的原生型別（Primitive Types）：string、number、boolean、null、undefined、symbol、bigint，本身不是物件，沒有屬性或方法。

但我們可以直接對字串呼叫方法，這是因為 JS 引擎在存取屬性時會自動暫時包裝成對應的物件型別（裝箱），呼叫完後立即丟棄。

用法說明
// 看起來像物件操作，實際上引擎自動裝箱
"hello".toUpperCase();   // "HELLO"  → 暫時 new String("hello")
(42).toString();         // "42"     → 暫時 new Number(42)
true.toString();         // "true"   → 暫時 new Boolean(true)

// 原生型別 vs 包裝物件
const a = "hello";             // 原生字串
const b = new String("hello"); // String 物件
console.log(typeof a);         // "string"
console.log(typeof b);         // "object"
console.log(a === b);          // false！型別不同

// null 和 undefined 沒有包裝物件
null.toString();      // ❌ TypeError
undefined.toString(); // ❌ TypeError
注意事項
⚠️ 不要用 new String()、new Number()、new Boolean() 建立包裝物件，=== 比較時物件 ≠ 原生值，非常容易踩雷。

⚠️ null 和 undefined 存取任何屬性都會拋出 TypeError，使用前記得做防衛性檢查（Optional Chaining ?.）。

13. Boolean 轉換 Truthy & Falsy
意義與背景
JavaScript 在需要布林值的地方（if、while、&&、||、?? 等）會自動進行隱式型別轉換。只有少數值是 falsy，其餘皆為 truthy。

用法說明
六個 Falsy 值（全部背起來！）：

// 以下六個是 falsy，其餘全是 truthy
false
0          // 也包含 -0 和 0n（BigInt 零）
""         // 空字串（'' 和 `` 也一樣）
null
undefined
NaN
// 常見 truthy 陷阱
if ([])  console.log("truthy"); // ✅ 空陣列是 truthy！
if ({})  console.log("truthy"); // ✅ 空物件是 truthy！
if ("0") console.log("truthy"); // ✅ 字串 "0" 是 truthy！
if (-1)  console.log("truthy"); // ✅ 負數是 truthy！

// Boolean() 明確轉換（少用，通常是不必要的）
Boolean(0);    // false
Boolean("hi"); // true

// 雙驚嘆號（慣用轉換寫法）
!!0;           // false
!!"hello";     // true
!!null;        // false
!![];          // true

// 短路求值（Short-circuit Evaluation）
const name = user && user.name;   // user 為 falsy 時直接回傳 user
const val  = input || "default";  // input 為 falsy 時回傳 "default"
const num  = value ?? 0;          // 只有 null / undefined 才回傳右側（更精確）
注意事項
⚠️ 空陣列 [] 和空物件 {} 都是 truthy！要判斷空陣列用 arr.length === 0。

⚠️ || 短路會把 0、"" 也視為 falsy。若只想排除 null / undefined，改用 ??（Nullish Coalescing）。

14. typeof 運算子
意義與背景
typeof 是單元運算子，回傳字串表示運算元的型別，是最基本的型別檢查工具。

用法說明
typeof "hello"       // "string"
typeof 42            // "number"
typeof true          // "boolean"
typeof undefined     // "undefined"
typeof Symbol()      // "symbol"
typeof 42n           // "bigint"
typeof function(){}  // "function"

// ── 歷史遺留問題 ──
typeof null          // "object" ← JS 的 bug，null 不是 object
typeof []            // "object" ← 陣列也是 object
typeof {}            // "object"

// ── 正確的判斷方式 ──
value === null             // 判斷 null
Array.isArray([])          // 判斷陣列
Object.prototype.toString.call(value) // 精確判斷任意型別
// 例：Object.prototype.toString.call([]) → "[object Array]"
//      Object.prototype.toString.call(null) → "[object Null]"
注意事項
⚠️ typeof null === "object" 是 JavaScript 規格設計錯誤遺留至今，永遠不要用 typeof 判斷 null。

⚠️ typeof 無法區分 Array 和 Object，判斷陣列用 Array.isArray()。

15. Symbol（ES6）
意義與背景
Symbol 是 ES6 引入的第七種原生型別。每個 Symbol 都是唯一且不可變的，主要用途是作為物件屬性的「唯一 key」，避免命名衝突。

用法說明
// 建立 Symbol（每個都唯一）
const s1 = Symbol("description");
const s2 = Symbol("description");
console.log(s1 === s2); // false！描述相同也不相等

// 作為物件屬性 key
const PRIVATE_KEY = Symbol("key");
const obj = {};
obj[PRIVATE_KEY] = "只有知道這個 Symbol 的人才能存取";

Object.keys(obj);           // [] — Symbol key 不被列舉
JSON.stringify(obj);        // "{}" — Symbol 屬性不被序列化
obj[PRIVATE_KEY];           // "只有知道這個 Symbol 的人才能存取"

// 全域共用 Symbol（跨模組/iframe 共享）
const id1 = Symbol.for("app.id");
const id2 = Symbol.for("app.id");
console.log(id1 === id2);  // true！Symbol.for 有全域 registry

Symbol.keyFor(id1);        // "app.id"

// Well-known Symbols（改變語言行為）
class Range {
  constructor(start, end) { this.start = start; this.end = end; }
  [Symbol.iterator]() {    // 讓 Range 可被 for...of 遍歷
    let current = this.start;
    const end = this.end;
    return {
      next() {
        return current <= end
          ? { value: current++, done: false }
          : { done: true };
      }
    };
  }
}

for (const n of new Range(1, 5)) {
  console.log(n); // 1 2 3 4 5
}
注意事項
⚠️ Symbol 屬性不被 for...in、Object.keys()、JSON.stringify() 列舉，但可用 Object.getOwnPropertySymbols() 取得。

⚠️ Symbol() 不能用 new：new Symbol() 會拋出 TypeError。

16. 全域變數（Global Variable）
意義與背景
在函式外部宣告，或使用 var 在任何地方宣告的變數，都會成為全域變數，掛在 window（瀏覽器）或 global（Node.js）物件上，任何程式碼都可以存取和修改。

用法說明
// ❌ 常見污染全域的方式
x = 10;          // 沒有宣告關鍵字，自動變全域（嚴格模式下會 ReferenceError）
var y = 20;      // var 在函式外 = 全域，掛在 window.y

// ✅ 使用 let / const，限制在區塊作用域
let z = 30;      // 不掛在 window

// ── 命名衝突示範 ──
// 引入第三方函式庫時，若都用全域變數，很容易互相覆蓋
var $ = "my $";  // 被 jQuery 的 $ 覆蓋了！

// ── 封裝方案 1：IIFE（立即執行函式）──
(function() {
  let count = 0; // 只在 IIFE 內部存在
  window.myLib = { increment: () => ++count };
})();

// ── 封裝方案 2：ES Module（現代方式）──
// 每個檔案有自己的作用域，不污染全域
export function add(a, b) { return a + b; }
import { add } from './math.js';
注意事項
⚠️ 嚴格模式（"use strict"）下，對未宣告的變數賦值會直接拋出 ReferenceError。

⚠️ 盡量以 ES Module 或模組化架構取代全域變數，提升可維護性。

17. forEach / for...of
意義與背景
forEach 是陣列方法；for...of 是語法，可用於任何可迭代物件（Iterable）（Array、String、Map、Set、NodeList...）。普通物件 {} 兩者都不能直接使用。

用法說明
// ── forEach ────────────────────────────────────
// 只能用於陣列，無法 break / continue
[1, 2, 3].forEach((item, index, arr) => {
  console.log(index, item);
});
// ❌ return 只是跳過當次 callback，不會中止整個迴圈

// ── for...of ────────────────────────────────────
// 可用於任何 Iterable，支援 break / continue
for (const item of [1, 2, 3]) {
  if (item === 2) break; // ✅ 可以中斷
  console.log(item);     // 只輸出 1
}

// String 是 Iterable（按字元走訪）
for (const char of "hello") {
  console.log(char); // h e l l o
}

// Map 和 Set 也是 Iterable
const map = new Map([["a", 1], ["b", 2]]);
for (const [key, val] of map) {
  console.log(key, val);
}

// ❌ 一般物件 {} 不是 Iterable
const obj = { a: 1, b: 2 };
// for (const x of obj) {} // TypeError

// ✅ 物件的遍歷方式
for (const key in obj) {           // for...in：遍歷 key（含原型鏈）
  if (Object.hasOwn(obj, key)) {   // 建議加上 hasOwn 過濾
    console.log(key, obj[key]);
  }
}
for (const [key, val] of Object.entries(obj)) { // 推薦
  console.log(key, val);
}
迭代方式選擇指南：

需求	方式
純走訪，做副作用	forEach
需要中斷	for...of
遍歷物件 key	for...in（加 hasOwn）或 Object.entries
轉換成新陣列	map
篩選	filter
累算	reduce
注意事項
⚠️ forEach 無法 break，需要提前結束請用 for...of 或 some() / every()。

⚠️ for...in 會遍歷原型鏈上的屬性，遍歷一般物件時務必搭配 Object.hasOwn()。

18. do...while
意義與背景
「先執行後判斷」的迴圈，保證迴圈本體至少執行一次。與 while 的差異在於條件判斷的時機。

用法說明
// ── while（先判斷）──
let i = 0;
while (i > 0) {
  console.log(i); // 永遠不執行
}

// ── do...while（後判斷，至少執行一次）──
let j = 0;
do {
  console.log(j); // 輸出 0（即使條件一開始就是 false）
  j++;
} while (j > 0 && j < 3);
// 輸出：0, 1, 2

// ── 典型用途：輸入驗證 ──
let input;
do {
  input = prompt("請輸入 1-10 的數字：");
  input = Number(input);
} while (isNaN(input) || input < 1 || input > 10); // 不合法就重問
注意事項
⚠️ 最容易忘記：結尾的分號不可省略：} while (condition);

⚠️ 確認迴圈內有讓條件變 false 的邏輯，否則無限迴圈！

19. instanceof 運算子
意義與背景
instanceof 用來判斷一個物件的**原型鏈（prototype chain）**中，是否存在某個建構子的 prototype，符合則回傳 true。

📝 原文中的「instead of 運算值」應為 instanceof（筆誤）。

用法說明
// 基本用法
const arr = [1, 2, 3];
console.log(arr instanceof Array);   // true
console.log(arr instanceof Object);  // true（原型鏈：arr → Array.prototype → Object.prototype）

// 搭配 try...catch 判斷錯誤類型（最常見實際用途）
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

// 自訂類別繼承
class Animal {}
class Dog extends Animal {}
const d = new Dog();
console.log(d instanceof Dog);    // true
console.log(d instanceof Animal); // true（繼承關係）
注意事項
⚠️ 原生型別（string、number）不能用 instanceof，因為它們不是物件：

"hello" instanceof String  // false
typeof "hello" === "string" // true（應用 typeof 判斷原生型別）
⚠️ 跨 iframe 或不同執行環境的物件可能失效（各自有不同的 Array、Object 建構子）。

20. 標籤模板字串（Tagged Template Literals）
意義與背景
模板字串（ES6）用反引號（`）包住，支援多行字串和 ${} 插值。

標籤模板字串（Tagged Template） 是進階用法：在模板字串前加上「標籤函式（tag function）」，讓你完全控制字串的組合方式。

知名應用：styled-components（CSS-in-JS）、GraphQL（gql 標籤）、SQL 防注入。

用法說明
// ── 一般模板字串 ──
const name = "小明", age = 18;
const msg = `我是 ${name}，今年 ${age} 歲`;
// "我是 小明，今年 18 歲"

// ── 標籤模板字串 ──
// 語法：tagFn`string ${expr} string`
// tagFn 收到：
//   strings → 靜態字串陣列（["我是 ", "，今年 ", " 歲"]）
//   ...values → 插值陣列（["小明", 18]）
// ⚠️ strings.length === values.length + 1

function highlight(strings, ...values) {
  return strings.reduce((result, str, i) => {
    const val = values[i] !== undefined
      ? `<b>${values[i]}</b>`
      : "";
    return result + str + val;
  }, "");
}

const output = highlight`我是 ${name}，今年 ${age} 歲`;
// "我是 <b>小明</b>，今年 <b>18</b> 歲"

// ── 實務：SQL 防注入 ──
function safeSQL(strings, ...values) {
  const escaped = values.map(v => String(v).replace(/'/g, "''"));
  return strings.reduce((q, s, i) => q + s + (escaped[i] ?? ""), "");
}

const userId = "1' OR '1'='1"; // 惡意輸入
const query = safeSQL`SELECT * FROM users WHERE id = ${userId}`;
// SELECT * FROM users WHERE id = 1'' OR ''1''=''1

// ── 實務：styled-components 風格 ──
function css(strings, ...values) {
  return strings.reduce((result, str, i) =>
    result + str + (values[i] ?? ""), "");
}
const color = "red";
const style = css`color: ${color}; font-size: 16px;`;
注意事項
⚠️ strings 陣列比 values 多一個元素，記得處理最後一段靜態字串（沒有對應 value）。

💡 String.raw 是內建標籤函式，讓反斜線不被解析（常用於 Windows 路徑或 RegExp）：

String.raw`C:\Users\name\file` // "C:\\Users\\name\\file"
Part 3｜集合物件 Collection
選哪個資料結構？一張表搞定：

需求	用這個
有序、可重複的清單	Array
字串鍵的鍵值對，JSON 友好	Object
任意型別鍵，需要 size / 頻繁增刪	Map
不重複的值的集合	Set
弱參考，不阻止 GC	WeakMap / WeakSet
21. Array
核心方法速查
const arr = [3, 1, 4, 1, 5, 9, 2, 6];

// ── 轉換（回傳新陣列）────────────────────────────
arr.map(x => x * 2);           // [6,2,8,2,10,18,4,12]
arr.filter(x => x > 3);        // [4,5,9,6]
arr.reduce((acc, x) => acc + x, 0); // 31（累算成單一值）
arr.flat(2);                   // 展平 2 層巢狀陣列
arr.flatMap(x => [x, x * 2]); // map + flat(1)

// ── 查找 ──────────────────────────────────────────
arr.find(x => x > 4);          // 5（第一個符合的值）
arr.findIndex(x => x > 4);     // 4（第一個符合的 index）
arr.includes(9);                // true
arr.indexOf(1);                 // 1（第一次出現，找不到回 -1）

// ── 判斷 ──────────────────────────────────────────
arr.some(x => x > 8);          // true（至少一個符合）
arr.every(x => x > 0);         // true（全部符合）
Array.isArray(arr);             // true

// ── 修改（會改原陣列！）────────────────────────────
arr.push(7);                   // 尾端加入
arr.pop();                     // 移除尾端
arr.unshift(0);                // 頭端加入
arr.shift();                   // 移除頭端
arr.splice(2, 1, 99);          // 從 index 2 刪 1 個，插入 99
arr.sort((a, b) => a - b);     // 升冪排序（⚠️ 改原陣列）
arr.reverse();                 // 反轉（⚠️ 改原陣列）

// ── 不改原陣列 ────────────────────────────────────
arr.slice(1, 3);               // 取 index 1~2（不含 3）
arr.concat([10, 11]);          // 合併
[...arr].sort((a, b) => a - b); // ✅ 不改原陣列的排序方式
arr.toSorted((a, b) => a - b); // ES2023，不改原陣列
arr.toReversed();              // ES2023，不改原陣列
迭代方法完整對照表
方法	用途	回傳值	可中斷
forEach(cb)	走訪，做副作用	undefined	❌
map(cb)	一對一轉換	新陣列（同長度）	❌
filter(cb)	篩選	新陣列（較短）	❌
reduce(cb, init)	累算成單一值	任意值	❌
every(cb)	全部符合？	boolean（短路）	✅
some(cb)	至少一個符合？	boolean（短路）	✅
find(cb)	第一個符合的值	值 / undefined	✅
findIndex(cb)	第一個符合的索引	index / -1	✅
findLast(cb)	從右找第一個符合的值	值（ES2023）	✅
flatMap(cb)	map 後 flat(1)	新陣列	❌
💡 選擇原則：需要回傳值 → map/filter/reduce；只做副作用 → forEach；需要中斷 → for...of 或 some/every。

常用技巧
// 去重
const unique = [...new Set([1, 1, 2, 3])]; // [1, 2, 3]

// 展開合併
const merged = [...[1, 2], ...[3, 4]]; // [1, 2, 3, 4]

// 解構
const [first, , third, ...rest] = [1, 2, 3, 4, 5];
// first=1, third=3, rest=[4,5]

// 從類陣列或 Iterable 建立陣列
Array.from("hello");               // ['h','e','l','l','o']
Array.from({length: 3}, (_, i) => i); // [0, 1, 2]

// 建立數字序列
Array.from({length: 5}, (_, i) => i + 1); // [1, 2, 3, 4, 5]
22. Object
const obj = { a: 1, b: 2, c: 3 };

// ── 存取 ──────────────────────────────────────────
Object.keys(obj);     // ['a', 'b', 'c']
Object.values(obj);   // [1, 2, 3]
Object.entries(obj);  // [['a',1], ['b',2], ['c',3]]

// ── 建立與合併 ────────────────────────────────────
Object.fromEntries([['a', 1], ['b', 2]]); // {a:1, b:2}
const merged = { ...obj, d: 4 };          // 展開合併（淺拷貝）
Object.assign({}, obj, { d: 4 });         // 同上，但 assign 會改第一個參數

// ── 保護 ──────────────────────────────────────────
Object.freeze(obj);  // 凍結：不能新增/修改/刪除（shallow）
Object.seal(obj);    // 密封：不能新增/刪除，但可以修改

// ── 查詢 ──────────────────────────────────────────
"a" in obj;                  // true（包含原型鏈）
Object.hasOwn(obj, "a");     // true（只查自身，推薦新寫法）
obj.hasOwnProperty("a");     // true（舊寫法，但 hasOwnProperty 可能被覆寫）

// ── 深拷貝 ────────────────────────────────────────
const deep = structuredClone(obj);          // ES2022，推薦
const deep2 = JSON.parse(JSON.stringify(obj)); // 舊方法（不支援 undefined/function/Date）
23. Map
用 Map 而不是 Object 的時機：鍵不是字串、需要保留插入順序、頻繁增刪、需要直接知道數量（.size）。

const map = new Map();

// 基本操作
map.set("name", "Yoga");        // 設值（支援鏈式呼叫，因為回傳 map 本身）
map.set(42, "number key");      // 鍵可以是任意型別
map.set({id: 1}, "obj key");    // 鍵可以是物件

map.get("name");                // "Yoga"
map.has("name");                // true
map.delete("name");             // 回傳 boolean
map.size;                       // 項目數量
map.clear();                    // 清空

// 遍歷（保證插入順序）
for (const [key, value] of map) { console.log(key, value); }
map.forEach((value, key) => console.log(key, value));
[...map.keys()];                // 所有 key
[...map.values()];              // 所有 value
[...map.entries()];             // [[key,value], ...]

// ── Object ↔ Map 互轉 ────────────────────────────
const mapFromObj = new Map(Object.entries({ a: 1, b: 2 }));
const objFromMap = Object.fromEntries(map); // 限鍵為字串時可用
Map 進階技巧
// 鏈式設定
const m = new Map()
  .set('a', 1)
  .set('b', 2)
  .set('c', 3);

// 預設值模式
const value = map.get('key') ?? 'default';
if (!map.has('key')) map.set('key', 'default');

// 過濾與轉換
const filtered = new Map(
  [...map].filter(([k, v]) => v > 1)
);

// 合併兩個 Map（後者覆蓋前者）
const a = new Map([['x', 1], ['y', 2]]);
const b = new Map([['y', 3], ['z', 4]]);
const merged = new Map([...a, ...b]); // {x:1, y:3, z:4}

// 序列化（Map 不能直接 JSON.stringify！）
const json = JSON.stringify([...map]);          // 轉二維陣列
const restored = new Map(JSON.parse(json));     // 還原
24. Set
const set = new Set([1, 2, 2, 3, 3]); // {1, 2, 3} — 自動去重

// 基本操作
set.add(4);     // 加入
set.has(2);     // true
set.delete(2);  // 回傳 boolean
set.size;       // 數量
set.clear();    // 清空

// 遍歷
for (const val of set) { console.log(val); }
[...set];       // 轉成陣列

// ── 集合運算 ──────────────────────────────────────
const A = new Set([1, 2, 3, 4]);
const B = new Set([3, 4, 5, 6]);

const union        = new Set([...A, ...B]);                       // {1,2,3,4,5,6}
const intersection = new Set([...A].filter(x => B.has(x)));       // {3,4}
const difference   = new Set([...A].filter(x => !B.has(x)));      // {1,2}
const symDiff      = new Set([...A, ...B].filter(              // {1,2,5,6}
  x => !A.has(x) || !B.has(x)
));
25. WeakMap & WeakSet
用途：持有物件的「弱參考」，物件沒有其他參考時可被 GC 回收，不造成記憶體洩漏。

// WeakMap：鍵只能是物件，不可遍歷，沒有 size
const cache = new WeakMap();
let domNode = document.querySelector("#app");
cache.set(domNode, { clicks: 0 }); // 附加私有資料到 DOM 節點
domNode = null; // DOM 節點沒有其他參考 → cache 裡的資料自動被 GC

// WeakSet：值只能是物件，常用於標記「已處理」
const processed = new WeakSet();
function process(obj) {
  if (processed.has(obj)) return; // 避免重複處理
  processed.add(obj);
  // ... 處理邏輯
}
Map	WeakMap
鍵的型別	任意	只能物件 / 非原生物件
可遍歷	✓	❌
.size	✓	❌
阻止 GC	✓	❌（弱參考）
Part 4｜綜合練習
面試必考題
Q1：0.1 + 0.2 !== 0.3，請解釋原因與解法
原因：JavaScript 使用 IEEE 754 雙精度浮點數，0.1 和 0.2 在二進位中都是無限循環小數，相加後有精度誤差。

解法：

// 1. toFixed 顯示用
(0.1 + 0.2).toFixed(1); // "0.3"

// 2. Number.EPSILON 比較
Math.abs(0.1 + 0.2 - 0.3) < Number.EPSILON; // true

// 3. 整數運算（精確）
(Math.round(0.1 * 10) + Math.round(0.2 * 10)) / 10; // 0.3

// 4. Decimal.js（金融場景）
new Decimal(0.1).plus(0.2).toNumber(); // 0.3
Q2：typeof null === "object" 是 bug 嗎？如何正確判斷 null？
是 JS 規格設計錯誤，第一版就存在，至今無法修正以免破壞現有程式碼。

typeof null === "object"; // true — 歷史遺留 bug
null === null;            // ✅ 正確判斷 null 的方式
Q3：for...in vs for...of 有何差別？
const arr = [10, 20, 30];
for (const i in arr)  console.log(i); // "0" "1" "2" — 遍歷 key（字串）
for (const v of arr)  console.log(v); // 10 20 30    — 遍歷 value

// for...in 用於 Object；for...of 用於 Iterable（Array, Map, Set, String）
// ⚠️ 不要用 for...in 遍歷 Array，會遍歷原型鏈上的屬性
Q4：請實作 Array 去重的三種方法
const arr = [1, 1, 2, 2, 3];

// 方法 1：Set（最簡潔）
[...new Set(arr)];

// 方法 2：filter + indexOf
arr.filter((x, i) => arr.indexOf(x) === i);

// 方法 3：reduce
arr.reduce((acc, x) => acc.includes(x) ? acc : [...acc, x], []);
Q5：reduce 的七種實戰用法
// 1. 累加 / 累乘
[1,2,3,4].reduce((sum, x) => sum + x, 0);  // 10
[1,2,3,4].reduce((p, x) => p * x, 1);      // 24

// 2. 求極值
[7,2,9,4].reduce((max, x) => Math.max(max, x), -Infinity); // 9

// 3. 展平陣列
[[1,2],[3,4]].reduce((acc, v) => acc.concat(v), []); // [1,2,3,4]

// 4. 計數
['a','b','a','c','b','a'].reduce((acc, x) => {
  acc[x] = (acc[x] || 0) + 1;
  return acc;
}, {}); // {a:3, b:2, c:1}

// 5. 陣列轉 Map（快速查找）
const users = [{ id: 1, name: 'Alice' }, { id: 2, name: 'Bob' }];
users.reduce((map, u) => map.set(u.id, u), new Map());

// 6. 同時 filter + map（一次走訪）
[1,2,3,4,5].reduce((acc, x) => {
  if (x % 2 === 0) acc.push(x * 2);
  return acc;
}, []); // [4, 8]

// 7. 串接 Promise（依序執行非同步）
const tasks = [() => fetch('/api/1'), () => fetch('/api/2')];
tasks.reduce((chain, task) => chain.then(task), Promise.resolve());
Q6：Map vs Object，怎麼選？
Object	Map
鍵的型別	字串 / Symbol	任意型別
鍵的預設值	有（原型屬性）	無
插入順序	不完全保證	保證
.size	需 Object.keys().length	直接 .size
效能（頻繁增刪）	較慢	較快
JSON 序列化	直接支援	需轉換
簡單記法：鍵是字串且結構固定、需要 JSON → Object；其他情況考慮 Map。

Q7：WeakMap 和 Map 的差別？什麼時候用 WeakMap？
WeakMap 的鍵是「弱參考」，鍵物件被 GC 回收時 entry 自動消失，避免記憶體洩漏。

適用場景：為 DOM 節點或外部物件附加私有資料，不想干涉它的生命週期。

Q8：請說明 Tagged Template Literal 的應用場景
防 XSS / SQL Injection：對插值做 escape 處理
styled-components：在 JS 中撰寫 CSS
GraphQL gql：解析 query 字串並驗證語法
i18n：多語言翻譯，插值前做格式化
Q9：Array.from 和展開運算子 [...] 的差別？
// 兩者都能轉 Iterable 為陣列
[...new Set([1,2,3])];        // [1, 2, 3] ✅
Array.from(new Set([1,2,3])); // [1, 2, 3] ✅

// 差異：Array.from 可以處理類陣列（無 Symbol.iterator）
const likeArr = { 0: "a", 1: "b", length: 2 };
[...likeArr];         // ❌ TypeError（沒有 iterator）
Array.from(likeArr);  // ✅ ["a", "b"]

// Array.from 還有第二個參數（map function）
Array.from({length: 5}, (_, i) => i * 2); // [0, 2, 4, 6, 8]
Q10：instanceof 的局限性？如何更精確判斷型別？
// instanceof 的問題
"hello" instanceof String    // false（原生字串不是物件）
[] instanceof Array          // true，但跨 iframe 可能失效

// 更精確：Object.prototype.toString.call()
Object.prototype.toString.call([]);        // "[object Array]"
Object.prototype.toString.call(null);      // "[object Null]"
Object.prototype.toString.call(undefined); // "[object Undefined]"
Object.prototype.toString.call(new Date()); // "[object Date]"

// 封裝成工具函式
const typeOf = v =>
  Object.prototype.toString.call(v).slice(8, -1).toLowerCase();

typeOf([]);        // "array"
typeOf(null);      // "null"
typeOf(new Date()); // "date"
自我思考題
以下問題沒有標準答案，目的是培養深層理解。

1. var、let、const 三者的作用域、提升（hoisting）行為有何不同？在什麼情況下你會選擇 var？

2. 如果 typeof null === "object" 是 bug，為什麼 TC39 不修正它？這反映了什麼工程決策？

3. 為什麼說「JavaScript 的數字都是浮點數」？整數 1 和 1.0 在記憶體中有差異嗎？

4. 自動裝箱（Autoboxing）看起來很方便，有沒有可能造成效能問題？什麼情況下要特別注意？

5. Symbol.for() 建立的全域 Symbol 和直接 Symbol() 有何根本差異？試設計一個用 Symbol 解決命名衝突的場景。

6. forEach 內部用 return 和在 for...of 中用 continue 的效果一樣嗎？有什麼差異？

7. WeakMap 不可遍歷、沒有 size，這些「限制」的設計原因是什麼？

8. Cache Busting 的 query string 方法在某些 CDN 無效，這是 CDN 的 bug 還是設計上的取捨？

9. document.write 是很糟的 API，但它當年為什麼會存在？這個歷史說明了什麼？

10. Tagged Template Literal 讓標籤函式掌控字串的組合——這和 Vue / React 的 JSX 在哲學上有何共同點？

常見陷阱總整理
// ── 型別 ──────────────────────────────────────────
typeof null === "object"              // ⚠️ null 的 typeof 是 bug
NaN === NaN                           // false，用 Number.isNaN()
new String("a") === "a"               // false，包裝物件 ≠ 原生值
[] == false                           // true（隱式轉型地獄）
[] == ![]                             // true（更詭異）

// ── 陣列 ──────────────────────────────────────────
[10,9,2,100].sort()                   // [10,100,2,9] ⚠️ 字串排序！
[10,9,2,100].sort((a,b) => a - b)     // [2,9,10,100] ✅

arr.splice(1, 2)                      // ⚠️ 改原陣列！
arr.slice(1, 3)                       // ✅ 不改原陣列

// ── 物件 ──────────────────────────────────────────
"inherited" in child                  // ⚠️ 包含原型鏈
Object.hasOwn(child, "key")           // ✅ 只查自身

// ── 集合 ──────────────────────────────────────────
JSON.stringify(new Map([["a",1]]))     // "{}" ⚠️ Map 無法直接序列化
JSON.stringify(Object.fromEntries(map)) // ✅

// ── 迴圈 ──────────────────────────────────────────
[1,2,3].forEach(x => { if(x===2) break; }) // ❌ SyntaxError
for (const x of [1,2,3]) { if(x===2) break; } // ✅

} while (condition)                   // ⚠️ 結尾分號不可少！
} while (condition);                  // ✅

// ── 快取 ──────────────────────────────────────────
<script src="app.js?v=1">             // ⚠️ CDN 可能忽略 query string
<script src="app.b3f2.js">            // ✅ content hash 最可靠
— 完 —