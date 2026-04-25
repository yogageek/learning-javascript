# JavaScript 內建標準物件 複習筆記

> **學這個的意義**：這些是 JS 引擎內建的工具箱。不靠第三方套件，原生就能處理字串操作、數值計算、日期格式、正規表達式。面試常考「你會不會不用 lodash 手刻這些功能」。

---

## 一、全局總覽

| 物件 | 用途 |
|---|---|
| `String` | 字串操作：搜尋、切割、取代、格式化 |
| `Number` | 數值處理：精度、格式化、特殊值判斷 |
| `Math` | 數學運算：取整、亂數、最大最小值 |
| `Date` | 日期與時間：建立、格式化、計算差距 |
| `RegExp` | 正規表達式：pattern 比對、擷取、取代 |
| `JSON` | 序列化/反序列化：物件 ↔ 字串 |
| `Error` | 錯誤處理：自訂錯誤類型 |

---

## 二、String（字串）

> **底層**：字串是 primitive，但 JS 自動裝箱（auto-boxing）成 String 物件讓你可以呼叫方法。

### 基本操作

```js
const str = "  Hello, World!  ";

// ── 搜尋 ───────────────────────────────────────────
str.includes("World");       // true
str.startsWith("  Hello");   // true
str.endsWith("!  ");         // true
str.indexOf("o");            // 5   ← 第一次出現的 index，找不到回 -1
str.lastIndexOf("o");        // 8   ← 最後一次出現

// ── 取出 ───────────────────────────────────────────
str.slice(2, 7);             // "Hello"  ← 支援負數 index
str.slice(-6, -2);           // "rld!"   ← 負數從尾端算
str.substring(2, 7);         // "Hello"  ← 不支援負數

// ── 修改（回傳新字串，原字串不變）────────────────────
str.trim();                  // "Hello, World!"  ← 去首尾空白
str.trimStart();             // "Hello, World!  "
str.trimEnd();               // "  Hello, World!"
str.toUpperCase();           // "  HELLO, WORLD!  "
str.toLowerCase();           // "  hello, world!  "
str.replace("World", "JS");  // "  Hello, JS!  " ← 只換第一個
str.replaceAll("l", "L");    // "  HeLLo, WorLd!  "

// ── 分割 / 合併 ────────────────────────────────────
"a,b,c".split(",");          // ["a","b","c"]
["a","b","c"].join(" - ");   // "a - b - c"

// ── 填充 / 重複 ────────────────────────────────────
"5".padStart(3, "0");        // "005"  ← 常用於格式化數字
"hi".padEnd(5, ".");         // "hi..."
"ab".repeat(3);              // "ababab"

// ── 取單個字元 ─────────────────────────────────────
str[0];                      // " "
str.charAt(2);               // "H"
str.charCodeAt(2);           // 72   ← Unicode 碼點
String.fromCharCode(72);     // "H"  ← 碼點轉字元
```

### 模板字串（Template Literal）

```js
const name = "Yoga";
const score = 98;

// 基本插值
console.log(`Hello, ${name}! Score: ${score}`);

// 可以放表達式
console.log(`Result: ${score > 90 ? "A" : "B"}`);

// 多行字串（不用 \n）
const html = `
  <div>
    <p>${name}</p>
  </div>
`;

// Tagged Template Literal — 攔截並自訂插值處理
function highlight(strings, ...values) {
  // strings: ["Hello, ", "! Score: ", ""] ← 文字片段陣列
  // values:  ["Yoga", 98]                 ← 插值陣列
  return strings.reduce((result, str, i) =>
    result + str + (values[i] !== undefined ? `<b>${values[i]}</b>` : ""), ""
  );
}

highlight`Hello, ${name}! Score: ${score}`;
// "Hello, <b>Yoga</b>! Score: <b>98</b>"
```

## 五、Date（日期時間）

> **底層**：Date 儲存的是 UTC 毫秒數（Unix timestamp × 1000），顯示時依時區轉換。

```js
// ── 建立 ───────────────────────────────────────────
new Date();                         // 現在
new Date(0);                        // 1970-01-01T00:00:00.000Z (Unix epoch)
new Date("2024-01-15");             // 解析 ISO 字串
new Date(2024, 0, 15, 10, 30, 0);  // 年, 月(0-based!), 日, 時, 分, 秒
Date.now();                         // 現在的毫秒數（不需要 new）

// ── 取值 ───────────────────────────────────────────
const d = new Date("2024-03-15T10:30:00");
d.getFullYear();  // 2024
d.getMonth();     // 2   ← 0-based！3月 = 2
d.getDate();      // 15  ← 幾號
d.getDay();       // 5   ← 星期幾（0=週日, 6=週六）
d.getHours();     // 10
d.getMinutes();   // 30
d.getTime();      // 毫秒數（Unix timestamp * 1000）

// ── 格式化 ─────────────────────────────────────────
d.toISOString();          // "2024-03-15T02:30:00.000Z" ← UTC
d.toLocaleDateString();   // "2024/3/15" (依系統語系)
d.toLocaleTimeString();   // "上午10:30:00"
d.toLocaleString("zh-TW", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit"
});  // "2024/03/15 10:30"

// ── 計算時間差 ─────────────────────────────────────
const start = new Date("2024-01-01");
const end   = new Date("2024-03-15");
const diffMs   = end - start;              // 毫秒差（Date 相減自動轉 timestamp）
const diffDays = diffMs / (1000*60*60*24); // 74 天

// ── 效能計時 ───────────────────────────────────────
const t0 = performance.now();
// ... 要計時的程式碼 ...
const t1 = performance.now();
console.log(`耗時 ${t1 - t0} ms`);    // 比 Date.now() 精度更高
```

---

## 六、RegExp（正規表達式）

```js
// 兩種建立方式
const re1 = /hello/i;               // 字面量（推薦，效能好）
const re2 = new RegExp("hello", "i"); // 建構式（動態 pattern 時用）

// ── 常用 flag ──────────────────────────────────────
// i → 忽略大小寫
// g → 全域比對（找所有符合，不只第一個）
// m → 多行模式（^ $ 匹配每行的開頭結尾）

// ── 常用 pattern ───────────────────────────────────
// .   → 任意字元（除換行）
// \d  → 數字 [0-9]
// \w  → 字母數字底線 [a-zA-Z0-9_]
// \s  → 空白字元（空格、tab、換行）
// ^   → 開頭
// $   → 結尾
// *   → 0 或多次
// +   → 1 或多次
// ?   → 0 或 1 次
// {n} → 剛好 n 次

// ── 測試 & 取出 ────────────────────────────────────
/^\d{4}-\d{2}-\d{2}$/.test("2024-03-15"); // true  ← 只要 boolean
"Hello World".match(/\w+/g);              // ["Hello", "World"] ← 所有符合

// 捕捉群組（Capture Group）
const result = "2024-03-15".match(/(\d{4})-(\d{2})-(\d{2})/);
result[0]; // "2024-03-15"  ← 完整符合
result[1]; // "2024"        ← 第一個群組
result[2]; // "03"          ← 第二個群組
result[3]; // "15"          ← 第三個群組

// 具名捕捉群組（Named Group）
const { groups } = "2024-03-15".match(
  /(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})/
);
groups.year;  // "2024"
groups.month; // "03"

// ── 取代 ───────────────────────────────────────────
"foo bar foo".replace(/foo/g, "baz");      // "baz bar baz"
"hello world".replace(/(\w+)/g, "[$1]");  // "[hello] [world]" ← $1 引用群組

// ── 切割 ───────────────────────────────────────────
"one1two2three".split(/\d/);  // ["one","two","three"]
```

---

## 七、JSON

```js
// ── 序列化（Object → String）──────────────────────
const obj = { name: "Yoga", age: 30, scores: [90, 95] };

JSON.stringify(obj);
// '{"name":"Yoga","age":30,"scores":[90,95]}'

JSON.stringify(obj, null, 2);  // 第三參數縮排，方便閱讀
// {
//   "name": "Yoga",
//   ...
// }

// replacer function：自訂哪些 key 要序列化
JSON.stringify(obj, (key, val) => typeof val === "number" ? undefined : val);
// '{"name":"Yoga","scores":[]}' ← 數字被過濾掉

// ── 反序列化（String → Object）────────────────────
const str = '{"name":"Yoga","age":30}';
const parsed = JSON.parse(str);
parsed.name; // "Yoga"

// reviver function：取出時做轉換
const withDate = '{"date":"2024-03-15"}';
JSON.parse(withDate, (key, val) =>
  key === "date" ? new Date(val) : val
); // date 屬性自動轉成 Date 物件

// ── JSON 不支援的型別（序列化後消失或變形）────────────
JSON.stringify({
  fn: () => {},        // undefined → 整個 key 消失
  undef: undefined,    // undefined → 整個 key 消失
  sym: Symbol("x"),    // Symbol   → 整個 key 消失
  nan: NaN,            // NaN      → null
  inf: Infinity,       // Infinity → null
  date: new Date(),    // Date     → ISO 字串（變成字串，parse 後不會自動還原）
});
```

---

## 八、Error

```js
// ── 內建錯誤型別 ────────────────────────────────────
// Error         通用錯誤
// TypeError     型別錯誤（null.foo、not a function）
// RangeError    超出範圍（array length 負數）
// ReferenceError 未宣告的變數
// SyntaxError   語法錯誤（JSON.parse 失敗）

// ── 自訂錯誤類別 ────────────────────────────────────
class ValidationError extends Error {
  constructor(message, field) {
    super(message);          // 設定 message
    this.name = "ValidationError"; // 覆寫 name（預設是 "Error"）
    this.field = field;      // 自訂屬性
  }
}

// ── try / catch / finally ──────────────────────────
function parseAge(input) {
  const age = Number(input);
  if (isNaN(age)) throw new ValidationError("不是數字", "age");
  if (age < 0 || age > 150) throw new RangeError("年齡超出範圍");
  return age;
}

try {
  const age = parseAge("abc");
} catch (err) {
  if (err instanceof ValidationError) {
    console.log(`驗證失敗：${err.field} - ${err.message}`);
  } else if (err instanceof RangeError) {
    console.log(`範圍錯誤：${err.message}`);
  } else {
    throw err;  // 不認識的錯誤往上拋
  }
} finally {
  console.log("無論如何都會執行"); // 常用於清理資源
}
```

---

## 九、容易搞混的地方

### 坑 1：`typeof NaN` 是 `"number"`，但 `NaN !== NaN`

```js
typeof NaN;        // "number" ← 反直覺
NaN === NaN;       // false    ← NaN 不等於任何東西，包括自己

// 正確判斷 NaN
Number.isNaN(NaN);      // true  ← 推薦（不做型別轉換）
isNaN("hello");         // true  ← 全域 isNaN 會先轉型，結果難預測
Number.isNaN("hello");  // false ← 不是 Number 型別，直接回 false
```

### 坑 2：`getMonth()` 是 0-based，`getDate()` 是 1-based

```js
const d = new Date("2024-03-15");
d.getMonth();  // 2  ← 3月 = index 2，常見 bug 來源
d.getDate();   // 15 ← 幾號，正常 1-based
d.getDay();    // 5  ← 星期五（0=週日，1=週一...）
```

### 坑 3：`toFixed()` 回傳字串，不是數字

```js
(1.005).toFixed(2);       // "1.00" ← 字串！而且有浮點精度問題
typeof (1.5).toFixed(1);  // "string"

// 要比較數值記得轉換
Number((1.5).toFixed(1)) === 1.5; // true
+(1.5).toFixed(1) === 1.5;        // true
```

### 坑 4：`slice` 支援負數，`substring` 不支援

```js
"hello".slice(-3);       // "llo" ← 負數從尾端算
"hello".substring(-3);   // "hello" ← 負數當 0，行為不同！
"hello".substring(3, 1); // "el"  ← 自動交換 start/end（更奇特）
"hello".slice(3, 1);     // ""    ← start > end 回空字串
// 結論：優先用 slice，行為更一致
```

### 坑 5：`replace()` 預設只換第一個

```js
"aaa".replace("a", "b");    // "baa" ← 只換第一個！
"aaa".replace(/a/g, "b");   // "bbb" ← 用 regex + g flag
"aaa".replaceAll("a", "b"); // "bbb" ← ES2021 的方法
```

### 坑 6：`Date` 建構式的月份陷阱 + 字串解析差異

```js
new Date(2024, 2, 15); // 2024年3月15日（月份 0-based）

// 字串解析：ISO 格式（含時區）vs 無時區
new Date("2024-03-15");         // UTC 午夜（依時區顯示不同！）
new Date("2024/03/15");         // 當地時區午夜（更符合預期）
// 台灣 UTC+8：前者顯示 3/15 08:00，後者顯示 3/15 00:00
```

### 坑 7：`JSON.stringify` 遇到特殊值靜默略過

```js
// function、undefined、Symbol 會直接消失，不報錯
const obj = { a: 1, fn: () => {}, b: undefined };
JSON.stringify(obj); // '{"a":1}' ← fn 和 b 直接不見，沒有警告
```

### 坑 8：`parseInt` 的進制坑

```js
parseInt("08");      // 8  （現代引擎OK，但舊版本會當 8 進制）
parseInt("08", 10);  // 8  ← 永遠明確指定進制，避免歧義
parseInt("010");     // 10 （現代）或 8（舊版八進制）
parseInt("0x10");    // 16 ← 自動識別 hex
```

---

## 十、面試必考題

### Q1：`NaN` 的行為，怎麼正確判斷？

```js
NaN === NaN;            // false
typeof NaN;             // "number"
Number.isNaN(NaN);      // true  ← 正確做法
Number.isNaN("abc");    // false ← 不轉型
isNaN("abc");           // true  ← 全域版會轉型，容易誤判
```

### Q2：如何不用套件格式化日期為 `YYYY-MM-DD`？

```js
function formatDate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0"); // 月份 +1
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}
formatDate(new Date("2024-03-05")); // "2024-03-05"
```

### Q3：計算兩個日期相差幾天？

```js
function diffDays(date1, date2) {
  const ms = Math.abs(new Date(date2) - new Date(date1));
  return Math.floor(ms / (1000 * 60 * 60 * 24));
}
diffDays("2024-01-01", "2024-03-15"); // 74
```

### Q4：`0.1 + 0.2 === 0.3` 為什麼是 false？怎麼解決？

> IEEE 754 浮點數無法精確表示所有十進位小數。解法：用 `Number.EPSILON` 容差比較，或乘 100 轉整數計算。

### Q5：模板字串 Tagged Template 的使用場景？

> SQL 防注入、i18n 翻譯、HTML escaping、styled-components 的 CSS-in-JS 核心機制就是 Tagged Template。

### Q6：`JSON.parse` 後 Date 物件變字串，怎麼還原？

```js
const json = JSON.stringify({ created: new Date() });
// 序列化後 created 是 ISO 字串

// 用 reviver 還原
const obj = JSON.parse(json, (key, val) => {
  // ISO 日期字串的 pattern
  if (typeof val === "string" && /^\d{4}-\d{2}-\d{2}T/.test(val)) {
    return new Date(val);
  }
  return val;
});
obj.created instanceof Date; // true ✓
```

### Q7：如何產生 `[min, max]` 之間的隨機整數？

```js
// [min, max) 不含 max
function randInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

// [min, max] 含 max
function randIntInclusive(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
```

### Q8：字串反轉

```js
// 最簡潔
"hello".split("").reverse().join(""); // "olleh"

// 注意：含 emoji 或 Unicode 組合字元時會出錯
// "😊".split("") → ["\uD83D", "\uDE0A"] ← 拆成兩個 code unit
// 正確方法：
[..."😊abc"].reverse().join(""); // "cba😊" ✓  展開運算子按 code point 分割
```

### Q9：`Math.round` 的邊界行為

```js
Math.round(0.5);   // 1  ← 正數 .5 進位
Math.round(-0.5);  // 0  ← 負數 .5「向上」取整（不是 -1！）
Math.round(-1.5);  // -1
// 規則：捨去到最近的整數，相等時往 +∞ 方向
```

---

## 十一、關鍵思考點 & 回顧

| 物件 | 最常見的坑 |
|---|---|
| `String` | `slice` vs `substring`、`replace` 只換第一個 |
| `Number` | 浮點精度、`toFixed` 回字串、`isNaN` vs `Number.isNaN` |
| `Math` | `trunc` vs `floor` 在負數的差異 |
| `Date` | 月份 0-based、ISO 字串的時區問題 |
| `RegExp` | 忘記加 `g` flag、捕捉群組 |
| `JSON` | function/undefined/Symbol 靜默消失、Date 變字串 |

**底層邏輯統一理解**：

這些內建物件的設計有一個共同模式：**回傳新值，不修改原始資料**（String 的所有方法、Array 的 map/filter 等）。可變的操作往往是少數例外（Array 的 sort/splice）。理解「可變 vs 不可變」，就能預測一個方法的行為。
