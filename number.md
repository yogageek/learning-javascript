
> 主軸：數值是**原生型別（Primitive）**，但可透過 `Number` 建構子當物件使用。
> 本筆記涵蓋：原生值 vs 物件、重要靜態屬性、Number 方法。




```js
//原生值 vs Number 物件
//數值預設是原生型別（primitive），不是物件。若需要當物件操作，可用 Number() 建構子，但幾乎不需要這樣做。

//  原生數值（建議用這個）
const a = 42;
const b = 3.14;****
console.log(typeof a); // "number"

//  Number 物件（不建議）
const obj = new Number(42);
console.log(typeof obj); // "object"
console.log(a === obj);  // false ！原生值 ≠ 物件

// Number() 不加 new → 型別轉換（常用）
// Number() 當作函式呼叫時，會將傳入值強制轉換成數字型別
Number("123");   // 123
Number(true);    // 1
Number(false);   // 0
Number(null);    // 0
Number("");      // 0
Number("abc");   // NaN
Number(undefined); // NaN
//⚠️ 注意：用 new Number() 建立的物件在 === 比較時永遠不等於原生數值，容易造成 bug。
//日常只用 Number() 做型別轉換，或直接寫數字字面量。

//---自動裝箱（Autoboxing）---
//原生數值在呼叫方法時，JavaScript 引擎會自動暫時包裝成 Number 物件，方法呼叫完就丟棄，你不需要手動 new Number()
const n = 3.14159;
// 引擎自動裝箱：暫時轉成 new Number(3.14159) 來呼叫方法
n.toFixed(2);    // "3.14"
n.toString();    // "3.14159"


//---靜態屬性（Static Properties）---
//這些都掛在 Number 物件本身（不是實例），直接用 Number.XXX 存取。

// Number.MAX_VALUE: JavaScript 能表示的**最大正數**（約 1.8 × 10³⁰⁸）。
console.log(Number.MAX_VALUE); // 1.7976931348623157e+308
// ⚠️ 常見誤解：MAX_VALUE 不等於「整數最大值」，它是浮點數的上限（含小數）。

// 超過 MAX_VALUE → Infinity
console.log(Number.MAX_VALUE * 2); // Infinity

// Number.MIN_VALUE: 能表示的**最小正數**（最接近 0 的正數，約 5 × 10⁻³²⁴）。
console.log(Number.MIN_VALUE); // 5e-324
// ⚠️ 常見誤解：MIN_VALUE 不是最小的「負數」！

// 最小負數是 -Number.MAX_VALUE
console.log(-Number.MAX_VALUE); // -1.7976931348623157e+308

// Number.EPSILON
// 意義：1 與「比 1 大的最小浮點數」之間的差值（約 2.22 × 10⁻¹⁶）。
// 用途：浮點數比較時的 容差（tolerance），解決 0.1 + 0.2 !== 0.3 的問題。
console.log(Number.EPSILON); // 2.220446049250313e-16
console.log(0.1 + 0.2 === 0.3); // false
// ── EPSILON 解法：判斷兩數差距是否「小到可以忽略」──
function isEqual(a, b) {
  return Math.abs(a - b) < Number.EPSILON;
}
// EPSILON 適合比較「接近 1 的數值」
// 若比較的數字很大（如 1000000.1 + 0.2），誤差可能超過 EPSILON，需乘上數值大小做動態容差
console.log(isEqual(0.1 + 0.2, 0.3)); // true ✅



//Number.MAX_SAFE_INTEGER
//意義：能被精確表示的最大整數 = 2⁵³ − 1 = 9007199254740991。
//背景：IEEE 754 雙精度用 52 bits 儲存整數部分，超過這個範圍就無法保證整數精確。
console.log(Number.MAX_SAFE_INTEGER);// 9007199254740991


// 超過 MAX_SAFE_INTEGER，整數精度消失
console.log(Number.MAX_SAFE_INTEGER + 1); // 9007199254740992
console.log(Number.MAX_SAFE_INTEGER + 2); // 9007199254740992 ← 和 +1 一樣！

// 正確做法：超大整數用 BigInt
const big = 9007199254740991n + 2n;
console.log(big); // 9007199254740993n ✅

//Number.MIN_SAFE_INTEGER
//意義：能被精確表示的最小整數 = −(2⁵³ − 1) = −9007199254740991。
console.log(Number.MIN_SAFE_INTEGER);

//### 3-6. `Number.POSITIVE_INFINITY` / `Number.NEGATIVE_INFINITY`

console.log(Number.POSITIVE_INFINITY); // Infinity
console.log(Number.NEGATIVE_INFINITY); // -Infinity

// 產生 Infinity 的情況
console.log(1 / 0);              // Infinity
console.log(-1 / 0);             // -Infinity
console.log(Number.MAX_VALUE * 2); // Infinity

//Number.NaN
//意義：Not a Number，表示「無效的數值運算結果」。
console.log(Number.NaN);    // NaN
console.log(typeof NaN);    // "number" ← 型別是 number，很反直覺

// ⚠️ NaN 不等於任何值，包含自己
console.log(NaN === NaN);   // false

// 正確判斷 NaN
console.log(Number.isNaN(NaN));       // true
console.log(Number.isNaN("hello"));   // false（不會強制轉型）
console.log(isNaN("hello"));          // true（全域 isNaN 會先轉型，不可靠）


//---靜態方法（Static Methods）---
//Number.isInteger(value)
//判斷是否為整數，不做型別轉換。
Number.isInteger(42);     // true
Number.isInteger(42.0);   // true（42.0 在 JS 就是 42）
Number.isInteger(42.5);   // false
Number.isInteger("42");   // false（不轉型）

//Number.isFinite(value)
//判斷是否為有限數（非 Infinity、非 NaN）。
Number.isFinite(42);        // true
Number.isFinite(Infinity);  // false
Number.isFinite(NaN);       // false
Number.isFinite("42");      // false（不轉型，比全域 isFinite 更嚴格）

//Number.isNaN(value)
//判斷是否嚴格為 NaN（不做型別轉換）。
Number.isNaN(NaN);       // true
Number.isNaN("NaN");     // false ← 字串 "NaN" 不是數值 NaN
Number.isNaN(undefined); // false

// 對比：全域 isNaN() 會先轉型，結果不可預期
isNaN("hello");          // true（先轉成 NaN 再判斷）
Number.isNaN("hello");   // false（不轉型，更可靠）
//建議永遠用 Number.isNaN()，不要用全域的 isNaN()。

//Number.isSafeInteger(value)
//判斷是否在 MIN_SAFE_INTEGER ~ MAX_SAFE_INTEGER 範圍內的整數。
Number.isSafeInteger(9007199254740991);  // true
Number.isSafeInteger(9007199254740992);  // false（超出安全範圍）
Number.isSafeInteger(42.5);              // false（非整數）

//Number.parseInt(string, radix) / Number.parseFloat(string)
//與全域的 parseInt / parseFloat 功能相同，但掛在 Number 下，語意更清晰。
Number.parseInt("42px");     // 42（忽略後面的非數字）
Number.parseInt("0xFF", 16); // 255（十六進位）
Number.parseInt("111", 2);   // 7（二進位）

Number.parseFloat("3.14em"); // 3.14
Number.parseFloat("3.14.5"); // 3.14（只取到第一個小數點）

//---實例方法（Instance Methods）---
//原生數值可直接呼叫，JS 會自動裝箱，無需 new Number()

//.toFixed(digits)
//四捨五入到指定小數位數，**回傳字串**。
const n1 = 3.14159;
n1.toFixed(0); // "3"
n1.toFixed(2); // "3.14"
n1.toFixed(5); // "3.14159"
// ⚠️ 回傳的是字串，需要比較數值時記得轉型
parseFloat(n1.toFixed(2)) === 3.14; // true

//.toPrecision(digits)
//指定有效數字的總位數（含整數部分），回傳字串。

const n2 = 123.456;
n2.toPrecision(2); // "1.2e+2"（2 位有效數字）
n2.toPrecision(5); // "123.46"（5 位有效數字）
n2.toPrecision(8); // "123.45600"（補 0）

//.toString(radix)
//將數值轉成指定進位制的字串，radix 範圍 2–36。

const n3 = 255;
n3.toString();    // "255"（預設十進位）
n3.toString(2);   // "11111111"（二進位）
n3.toString(8);   // "377"（八進位）
n3.toString(16);  // "ff"（十六進位）

// ⚠️ 直接對 數字字面量 呼叫 要加括號或空格
(255).toString(16); // "ff" ✅
// 255.toString(16);  // SyntaxError ❌（. 被解析成小數點）

//.toLocaleString(locale, options)
//依據地區格式輸出數值字串（貨幣、千分位等）。

const n4 = 1234567.89;

n4.toLocaleString();           // "1,234,567.89"（依系統地區）
n4.toLocaleString("zh-TW");    // "1,234,567.89"

// 貨幣格式
n4.toLocaleString("zh-TW", {
  style: "currency",
  currency: "TWD"
});
// "NT$1,234,567.89"

n4.toLocaleString("en-US", {
  style: "currency",
  currency: "USD"
});
// "$1,234,567.89"


//.valueOf()
//回傳 Number 物件的原始數值（原生值）。手動呼叫的場景很少，通常由引擎自動處理。

const obj = new Number(42);
obj.valueOf(); // 42（原生 number）
```

## 6. 快速對照表

| 屬性 / 方法                   | 值 / 說明                     |
| ------------------------- | -------------------------- |
| `Number.MAX_VALUE`        | ≈ 1.8 × 10³⁰⁸，最大正浮點數       |
| `Number.MIN_VALUE`        | ≈ 5 × 10⁻³²⁴，最小正浮點數（最接近 0） |
| `Number.EPSILON`          | ≈ 2.22 × 10⁻¹⁶，浮點數比較容差     |
| `Number.MAX_SAFE_INTEGER` | 9007199254740991（2⁵³−1）    |
| `Number.MIN_SAFE_INTEGER` | −9007199254740991          |
| `Number.isNaN()`          | 嚴格判斷 NaN，不轉型               |
| `Number.isFinite()`       | 判斷有限數，不轉型                  |
| `Number.isInteger()`      | 判斷整數，不轉型                   |
| `Number.isSafeInteger()`  | 判斷安全整數範圍                   |
| `Number.parseInt()`       | 解析整數，支援進位制                 |
| `Number.parseFloat()`     | 解析浮點數                      |
| `.toFixed(n)`             | 固定小數位，回傳字串                 |
| `.toPrecision(n)`         | 固定有效數字，回傳字串                |
| `.toString(radix)`        | 轉指定進位制字串                   |
| `.toLocaleString()`       | 地區格式化輸出                    |

---

## 7. 常見陷阱整理

```js
// 1. MIN_VALUE 不是負數最小值
Number.MIN_VALUE > 0; // true！

// 2. typeof NaN 是 "number"
typeof NaN === "number"; // true（反直覺）

// 3. NaN !== NaN
NaN === NaN; // false，用 Number.isNaN() 判斷

// 4. 超過 MAX_SAFE_INTEGER，整數計算不可靠
9007199254740991 + 2 === 9007199254740991 + 1; // true（精度消失）

// 5. toFixed 回傳字串，不是數字
typeof (3.14).toFixed(1); // "string"

// 6. 整數字面量呼叫方法要加括號
(10).toString(2); // "1010" ✅
```

## 三、Number（數值）

```js
// ── 特殊值 ─────────────────────────────────────────
Number.isNaN(NaN);           // true  ← 比 isNaN() 更嚴格（不做型別轉換）
Number.isFinite(Infinity);   // false
Number.isInteger(3.0);       // true
Number.isInteger(3.1);       // false
Number.isSafeInteger(2**53); // false ← 超過安全整數範圍

Number.MAX_SAFE_INTEGER;     // 9007199254740991 (2^53 - 1)
Number.MIN_SAFE_INTEGER;     // -9007199254740991
Number.EPSILON;              // 2.22e-16 ← 浮點數最小精度差

// ── 格式化 ─────────────────────────────────────────
(3.14159).toFixed(2);        // "3.14"     ← 回傳字串！
(1234.5).toLocaleString();   // "1,234.5"  ← 依語系格式化
(0.000123).toExponential(2); // "1.23e-4"
(123.456).toPrecision(5);    // "123.46"

// ── 轉換 ───────────────────────────────────────────
Number("42");                // 42
Number("");                  // 0   ← 坑！
Number(null);                // 0   ← 坑！
Number(undefined);           // NaN
Number("abc");               // NaN
parseInt("42px");            // 42  ← 解析到非數字為止
parseInt("0xff", 16);        // 255 ← 第二參數是進制
parseFloat("3.14abc");       // 3.14
+"42";                       // 42  ← 一元 + 快速轉換
```

### 浮點數精度陷阱

```js
0.1 + 0.2;                   // 0.30000000000000004 ← 不等於 0.3！

// 判斷浮點數相等：用 epsilon 比較
Math.abs(0.1 + 0.2 - 0.3) < Number.EPSILON; // true ✓

// 或用 toFixed 轉字串比較（注意 toFixed 回傳字串）
(0.1 + 0.2).toFixed(1) === "0.3"; // true ✓

// 金融計算：乘以 100 變整數再算，最後除回來
(0.1 * 100 + 0.2 * 100) / 100;   // 0.3 ✓
```

---

## 四、Math

```js
// ── 取整 ───────────────────────────────────────────
Math.floor(4.9);    // 4   ← 無條件捨去（向下）
Math.ceil(4.1);     // 5   ← 無條件進位（向上）
Math.round(4.5);    // 5   ← 四捨五入
Math.trunc(4.9);    // 4   ← 直接去小數（負數時與 floor 不同！）
Math.trunc(-4.9);   // -4
Math.floor(-4.9);   // -5  ← 注意差異

// ── 數學運算 ───────────────────────────────────────
Math.abs(-5);       // 5
Math.pow(2, 10);    // 1024  ← 等同 2**10
Math.sqrt(16);      // 4
Math.cbrt(27);      // 3     ← 立方根
Math.log(Math.E);   // 1     ← 自然對數
Math.log2(8);       // 3
Math.log10(1000);   // 3

// ── 最大/最小 ──────────────────────────────────────
Math.max(1, 3, 2);           // 3
Math.min(1, 3, 2);           // 1
Math.max(...[1, 3, 2]);      // 3  ← 展開陣列

// ── 亂數 ───────────────────────────────────────────
Math.random();               // 0 ≤ n < 1 的浮點數

// 取 [min, max) 的整數
function randInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}
randInt(1, 7); // 骰子：1~6
```