# JavaScript 基礎語法 & 語言觀念 複習筆記

> **學這個的意義**：這是所有 JS 知識的地基。型別系統、型別轉換、運算子行為——面試第一關就考這些，答不好直接被刷。

---

## 一、JS 語言本質

```
直譯式（Interpreted）      → 不用編譯，逐行執行
動態型別（Dynamic Typing） → 變數型別在執行期決定，可以改變
弱型別（Weak Typing）      → 運算時會自動做隱性型別轉換（坑的來源）
單執行緒（Single-threaded） → 靠 Event Loop 模擬並發
```

---

## 二、型別系統

### 八種型別

```
Primitive（原始型別）7 種   → 值本身，不可變，存在 Stack
├── number
├── string
├── boolean
├── null
├── undefined
├── symbol    (ES6)
└── bigint    (ES2020)

Reference（參考型別）1 大類 → 存地址，實體在 Heap
└── object（含 Array、Function、Date、RegExp...）
```

```js
// typeof 快速判斷
typeof 42;          // "number"
typeof "hi";        // "string"
typeof true;        // "boolean"
typeof undefined;   // "undefined"
typeof Symbol();    // "symbol"
typeof 9n;          // "bigint"
typeof null;        // "object" ← 歷史 bug，記下來
typeof [];          // "object" ← 陣列也是 object
typeof function(){}; // "function" ← 函式是特例，不回傳 object

// 判斷陣列
Array.isArray([]);   // true ← 唯一正確做法
[] instanceof Array; // true（但跨 iframe 失效）
```

---

## 三、`null` vs `undefined`

```js
// undefined → 「存在但沒有值」，JS 引擎賦予的預設狀態
let x;                    // undefined（宣告未賦值）
function foo() {}
foo();                    // undefined（函式沒有 return）
const obj = {};
obj.missing;              // undefined（屬性不存在）

// null → 「刻意設為空」，人為賦值
let user = null;          // 我知道現在沒有 user，這是刻意的

// 相等比較
null == undefined;        // true  ← 唯一可以用 == 的場合
null === undefined;       // false
typeof null;              // "object" ← 歷史遺留 bug

// 實務判斷「兩個都排除」
if (value != null) { }    // 同時排除 null 和 undefined
```

---

## 四、型別轉換（Type Coercion）

> **這是 JS 最大的坑來源**，面試最愛考輸出題。

### 顯性轉換（Explicit）

```js
Number("42");     // 42
Number("");       // 0
Number(null);     // 0
Number(undefined);// NaN
Number(false);    // 0
Number(true);     // 1
Number("abc");    // NaN

String(42);       // "42"
String(null);     // "null"
String(undefined);// "undefined"

Boolean(0);       // false
Boolean("");      // false
Boolean(null);    // false
Boolean(undefined);// false
Boolean(NaN);     // false
// 以上五個 + false 本身 = 六個 falsy 值，其餘全是 truthy
Boolean([]);      // true  ← 空陣列是 truthy！
Boolean({});      // true  ← 空物件是 truthy！
```

### 隱性轉換（Implicit）— 面試最高頻

```js
// + 號：有字串就做字串串接
1 + "2";          // "12"  ← number 被轉 string
1 + 2 + "3";      // "33"  ← 左到右：3 + "3" = "33"
"3" + 1 + 2;      // "312" ← "3"+1="31", "31"+2="312"

// - * / 號：強制轉 number
"5" - 2;          // 3
"5" * "2";        // 10
"5" - "x";        // NaN

// 比較運算子
"2" > "10";       // true  ← 字串比較，"2" > "1"（字典序）
2 > "1";          // true  ← 字串轉 number 再比
null > 0;         // false
null == 0;        // false ← null 只 == undefined，不 == 0
null >= 0;        // true  ← 坑！>= 轉 number，null → 0

// 物件轉基本型別（ToPrimitive）
[] + [];          // ""    ← [].toString() = ""
[] + {};          // "[object Object]"
{} + [];          // 0     ← {} 被當成空 block，+[] = 0（非物件相加）
```

### Falsy vs Truthy 總表

```js
// Falsy（只有這 6 個）
false, 0, -0, 0n, "", null, undefined, NaN

// 容易誤判的 Truthy
"0"    // truthy（非空字串）
"false"// truthy
[]     // truthy（空陣列）
{}     // truthy（空物件）
```

---

## 五、變數宣告：`var` / `let` / `const`

```js
// var → function scope，有 hoisting，可重複宣告
// let → block scope，有 TDZ，不可重複宣告
// const → block scope，有 TDZ，不可重新賦值（但物件內容可改）

// Hoisting
console.log(a); // undefined（var 提升，值還沒賦）
console.log(b); // ❌ ReferenceError（TDZ）
var a = 1;
let b = 2;

// const 的常見誤解
const arr = [1, 2, 3];
arr.push(4);      // ✓ 可以改內容
arr = [5];        // ❌ 不能重新賦值（改的是參考地址）

const obj = { x: 1 };
obj.x = 2;        // ✓ 可以改屬性
obj = {};         // ❌ 不能重新賦值
```

---

## 六、運算子容易搞混

### `==` vs `===`

```js
// === 嚴格相等：型別 + 值都要一樣，永遠用這個
// == 寬鬆相等：做型別轉換，行為難預測

0 == false;       // true  ← false → 0
"" == false;      // true  ← 都轉 0
null == undefined;// true  ← 唯一建議用 == 的場合
null == false;    // false ← null 只等於 undefined
NaN == NaN;       // false ← NaN 不等於任何東西
```

### `??` vs `||`

```js
// || 遇到 falsy 就取右側（0、""、false 也算）
const port = userPort || 3000;
// 問題：userPort = 0 是合法的，但 0 || 3000 → 3000（誤！）

// ?? 只有 null / undefined 才取右側
const port = userPort ?? 3000;
// userPort = 0 → 0 ✓
// userPort = null → 3000 ✓
```

### `?.` 可選串連

```js
const user = null;
user.name;          // ❌ TypeError
user?.name;         // undefined（安全存取）
user?.address?.city;// undefined（可以串連）
user?.getName?.();  // undefined（方法也能用）
arr?.[0];           // 陣列存取也能用
```

### 展開 vs 其餘（`...`）

```js
// 展開（Spread）：把可迭代物件展開
const a = [1, 2];
const b = [...a, 3, 4]; // [1,2,3,4]
Math.max(...a);          // 2

// 其餘（Rest）：收集剩餘參數
function sum(first, ...rest) { // rest 是陣列
  return rest.reduce((acc, n) => acc + n, first);
}
sum(1, 2, 3, 4); // 10

// 解構搭配 rest
const [head, ...tail] = [1, 2, 3]; // head=1, tail=[2,3]
const { a: x, ...remaining } = { a: 1, b: 2, c: 3 };
// x=1, remaining={b:2, c:3}
```

---

## 七、解構賦值

```js
// 陣列解構
const [x, y, z = 0] = [1, 2];   // x=1, y=2, z=0（預設值）
const [, second] = [1, 2, 3];   // 跳過第一個，second=2

// 物件解構
const { name, age = 18 } = { name: "Yoga" }; // age 用預設值
const { name: userName } = { name: "Yoga" };  // 重新命名為 userName

// 巢狀解構
const { address: { city } } = { address: { city: "Taipei" } };

// 函式參數解構（最常用場景）
function render({ title, color = "red", size = 16 }) {
  console.log(title, color, size);
}
render({ title: "Hello" }); // "Hello" "red" 16
```

---

## 八、Truthy/Falsy 與短路的實際應用

```js
// 條件渲染（React 常見）
const isLoggedIn = true;
const element = isLoggedIn && <Dashboard />; // true 時渲染，false 時回傳 false

// 預設值
function greet(name) {
  name = name || "Guest";   // 舊寫法，name=0 或 "" 也會被替換
  name = name ?? "Guest";   // 新寫法，只有 null/undefined 才替換
}

// 短路求值
const user = getUser();
user && user.init();         // user 存在才呼叫 init
user?.init();                // 現代寫法，等效且更簡潔
```

---

## 九、容易搞混的地方 — 快速清單

```js
typeof null          // "object"，不是 "null"
NaN === NaN          // false，要用 Number.isNaN()
[] == false          // true（隱性轉換）
[] == ![]            // true（超級反直覺）
0.1 + 0.2 === 0.3   // false（浮點精度）
"2" > "10"           // true（字串字典序比較）
null >= 0            // true，但 null == 0 是 false
const arr = []
arr = []             // ❌，const 不能重新賦值
arr.push(1)          // ✓，改內容沒問題
```

---

## 十、面試必考題

### Q1：`typeof null` 為什麼是 `"object"`？

> JS 最初用 32 bit 儲存值，000 開頭代表 object，null 的位元全是 0，被誤判為 object。這是歷史遺留 bug，無法修正（修正會破壞現有網站）。

### Q2：以下各輸出什麼？

```js
// 型別轉換綜合題
console.log(1 + "2" + 3);    // "123"
console.log(1 + 2 + "3");    // "33"
console.log(+"");             // 0
console.log(+null);           // 0
console.log(+undefined);      // NaN
console.log(+[]);             // 0   ← [].toString()="" → Number("")=0
console.log(+{});             // NaN ← {}.toString()="[object Object]" → NaN
console.log([] + {});         // "[object Object]"
console.log([] == false);     // true
console.log([] == ![]);       // true ← ![] = false，[] == false → true
```

### Q3：6 個 falsy 值是哪些？

> `false`、`0`（含 `-0`、`0n`）、`""`（空字串）、`null`、`undefined`、`NaN`。  
> 容易搞錯的：`[]` 和 `{}` 是 truthy，`"0"` 和 `"false"` 也是 truthy。

### Q4：`var` / `let` / `const` 三者差異？

|         | 作用域      | Hoisting     | TDZ | 重複宣告 | 重新賦值 |
| ------- | -------- | ------------ | --- | ---- | ---- |
| `var`   | function | ✓（undefined） | ❌   | ✓    | ✓    |
| `let`   | block    | ✓            | ✓   | ❌    | ✓    |
| `const` | block    | ✓            | ✓   | ❌    | ❌    |

### Q5：如何判斷一個值是陣列？

```js
Array.isArray([]);         // true  ← 最推薦
[] instanceof Array;       // true（跨 iframe 失效）
Object.prototype.toString.call([]); // "[object Array]" ← 通用但囉嗦
```

### Q6：解釋 `==` 的轉換規則

> 1. 兩側型別相同 → 直接 `===` 比較  
> 2. `null == undefined` → `true`，其他 `null/undefined` 與任何值 == 都是 `false`  
> 3. 有 boolean → 先轉 number  
> 4. string vs number → string 轉 number  
> 5. object vs primitive → 物件呼叫 `valueOf()` / `toString()` 轉 primitive

### Q7：`const` 宣告的物件可以修改嗎？

> 可以修改**屬性**，不能重新**賦值**（改變參考地址）。`const` 鎖的是「綁定」，不是「值」。要讓物件完全不可變，用 `Object.freeze()`（但只有 shallow freeze）。

### Q8：以下輸出什麼？（Hoisting 綜合）

```js
var x = 1;
function x() {}        // 函式宣告提升高於 var
console.log(typeof x); // "number"
// 解析：函式宣告先提升，但 var x = 1 的賦值後來執行，最終 x 是 1

console.log(foo());    // "foo" ← 函式宣告整個提升
console.log(bar());    // ❌ TypeError: bar is not a function
function foo() { return "foo"; }
var bar = function() { return "bar"; };
// bar 被提升為 undefined，呼叫 undefined() → TypeError
```

### Q9：`??=` / `||=` / `&&=` 是什麼？

```js
// 邏輯賦值運算子（ES2021）
let a = null;
a ??= "default"; // a 是 null/undefined 才賦值 → a = "default"

let b = 0;
b ||= 42;        // b 是 falsy 才賦值 → b = 42（0 被替換）

let c = 1;
c &&= 99;        // c 是 truthy 才賦值 → c = 99
```

---

## 十一、關鍵思考點 & 回顧

| 概念                    | 一句話記憶                                      |     |                          |     |           |
| --------------------- | ------------------------------------------ | --- | ------------------------ | --- | --------- |
| 型別判斷                  | `typeof` 判斷 primitive，`Array.isArray` 判斷陣列 |     |                          |     |           |
| `null` vs `undefined` | null 是刻意的空，undefined 是「還沒有」                |     |                          |     |           |
| 隱性轉換                  | `+` 有字串就串接；`- * /` 強制轉 number              |     |                          |     |           |
| falsy                 | 只有 6 個：`false 0 "" null undefined NaN`     |     |                          |     |           |
| `??` vs `             |                                            | `   | `??` 只看 null/undefined；` |     | ` 看 falsy |
| `const`               | 鎖的是綁定（參考），不是值本身                            |     |                          |     |           |
| Hoisting              | 函式宣告 > var > let/const（TDZ）                |     |                          |     |           |

**底層邏輯統一理解**：

JS 的很多「奇怪行為」（`[] == false`、`typeof null === "object"`）都是**隱性型別轉換 + 歷史包袱**的結果。理解 ToPrimitive、ToNumber、ToString 這三條轉換規則，就能推導出所有隱性轉換的結果，不需要死記每個奇怪案例。
