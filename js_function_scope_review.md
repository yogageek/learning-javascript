# JavaScript 函式 & 作用域 複習筆記

> **學這個的意義**：JS 的 bug 有一半來自「變數在哪裡、活多久、誰看得到」。搞懂作用域與 closure，才能寫出不漏記憶體、不踩變數污染的程式，也是面試高頻考點。

---

## 一、函式的多重身份

> JS 函式是「一等公民 (first-class citizen)」— 可以當值傳、當參數、當回傳值。

```js
// 1. 函式宣告 (Function Declaration) — 有 hoisting，可在定義前呼叫
greet(); // ✓ 正常執行
function greet() { console.log("hello"); }

// 2. 函式表達式 (Function Expression) — 無 hoisting
// sayHi(); // ❌ TypeError: sayHi is not a function
const sayHi = function() { console.log("hi"); };

// 3. 箭頭函式 (Arrow Function) — 無自己的 this、arguments
const add = (a, b) => a + b;

// 4. 當參數傳入（callback）
[1, 2, 3].forEach(function(n) { console.log(n); });

// 5. 當回傳值（工廠函式 / closure 基礎）
function makeCounter() {
  let count = 0;
  return function() { return ++count; }; // 回傳函式
}

// 6. IIFE — 立即執行函式表達式，建立獨立作用域
(function() {
  const secret = "only here";
  console.log(secret);
})();
// console.log(secret); // ❌ 外部無法存取

// 7. 具名函式表達式（名字只在函式內部有效，方便遞迴除錯）
const factorial = function fact(n) {
  return n <= 1 ? 1 : n * fact(n - 1); // 內部可用 fact，外部只能用 factorial
};
```

---

## 二、作用域（Scope）基礎

> **結論**：JS 用的是**靜態作用域（Lexical Scope）**——作用域在**定義時**就決定了，不是呼叫時。

### 三種作用域

```js
// 1. Global Scope — 整個檔案都能存取
var globalVar = "global";

function outer() {
  // 2. Function Scope — 函式內部
  var funcVar = "func";

  if (true) {
    // 3. Block Scope — {} 區塊內（let / const 才有，var 沒有！）
    let blockLet = "block";
    var blockVar = "I leak out!"; // var 無視 block，提升到 function scope
  }

  console.log(blockVar);  // ✓ "I leak out!"
  // console.log(blockLet); // ❌ ReferenceError
}
```

### `var` vs `let` vs `const` 的作用域差異

|         | 作用域      | Hoisting         | 重複宣告 | 重新賦值 |
| ------- | -------- | ---------------- | ---- | ---- |
| `var`   | function | ✓（初始值 undefined） | ✓    | ✓    |
| `let`   | block    | ✓ 但 TDZ          | ❌    | ✓    |
| `const` | block    | ✓ 但 TDZ          | ❌    | ❌    |

> **TDZ (Temporal Dead Zone)**：`let`/`const` 宣告前存取 → ReferenceError（不是 undefined！）

```js
console.log(a); // undefined  ← var hoisting
console.log(b); // ❌ ReferenceError ← TDZ
var a = 1;
let b = 2;
```

---

## 三、Scope Chain（作用域鏈）

> **結論**：函式找變數時，先找自己，找不到就往外層找，直到 global，找不到就 ReferenceError。

```
inner → outer → global → ❌ ReferenceError
```

```js
const x = "global";

function outer() {
  const x = "outer";   // 遮蔽 (shadowing) global 的 x

  function inner() {
    const y = "inner";
    // 找 x：inner 自己沒有 → 往外找 outer → 找到 "outer"
    console.log(x); // "outer"
    console.log(y); // "inner"
  }

  inner();
  // console.log(y); // ❌ ReferenceError，y 只在 inner 裡
}

outer();
console.log(x); // "global"
```

**底層邏輯**：每個函式執行時建立「執行上下文 (Execution Context)」，其中有個 `[[Environment]]` 記錄外層作用域的參考 — 這就是 scope chain 的實作。

---

## 四、Hoisting（提升）

> **結論**：宣告會被提升，賦值不會。函式宣告整個提升，var 只提升宣告（初始值 undefined）。

```js
// 實際寫法
console.log(foo()); // ✓ "foo" ← 函式宣告整個提升
console.log(bar);   // undefined ← var 提升但還沒賦值
// console.log(baz);// ❌ TDZ

function foo() { return "foo"; }
var bar = "bar";
let baz = "baz";

// JS 引擎看到的順序（概念上）：
// function foo() { return "foo"; }  ← 整個提升
// var bar;                           ← 只提升宣告
// console.log(foo());  → "foo"
// console.log(bar);    → undefined
// bar = "bar";
```

---

## 五、Closure（閉包）

> **結論**：函式 + 它記住的外層作用域 = Closure。函式執行完畢，外層變數不會消失，只要內層函式還持有它的參考。

**用途**：資料私有化、工廠函式、記憶外部狀態。

### 基本範例

```js
function makeCounter() {
  let count = 0; // 外部看不到，但內層函式記住了

  return {
    increment() { return ++count; },
    decrement() { return --count; },
    getCount()  { return count; }
  };
}

const counter = makeCounter();
counter.increment(); // 1
counter.increment(); // 2
counter.decrement(); // 1
console.log(counter.getCount()); // 1
// count 從外部無法直接存取 → 模擬 private variable
```

### 工廠函式（Closure 實用模式）

```js
function makeMultiplier(factor) {
  // factor 被 closure 記住
  return (num) => num * factor;
}

const double = makeMultiplier(2);
const triple = makeMultiplier(3);

console.log(double(5)); // 10
console.log(triple(5)); // 15
// double 和 triple 各自有獨立的 factor
```

### Closure 模擬模組（Module Pattern）

```js
const userModule = (function() {
  // 私有狀態，外部無法直接存取
  let _users = [];

  return {
    add(user)    { _users.push(user); },
    remove(name) { _users = _users.filter(u => u !== name); },
    list()       { return [..._users]; } // 回傳淺複製，防止外部直接改
  };
})(); // IIFE 立即執行，建立一次 closure

userModule.add("Yoga");
userModule.add("Alice");
console.log(userModule.list()); // ["Yoga", "Alice"]
// _users 外部不可直接修改
```

如果直接 return users → 外部拿到原始陣列的參考 → 可以偷改內部狀態。
**淺複製 = 只複製第一層。元素如果是物件，裡面的內容還是共享的。**
底線 users
純粹是命名慣例，沒有語法效果。
意思是「這是私有變數，請不要從外部碰它」。
JavaScript 本身沒有 private 關鍵字（class 有 # ），所以早期用 _ 當警示標記。
真正讓 _users 私有的不是底線，是 closure——變數活在 IIFE 的 scope 裡，外部根本摸不到。底線只是給人看的提示。

## 六、容易搞混的地方

### 坑 1：迴圈裡的 closure（超高頻考題）

```js
// ❌ 錯誤：所有 callback 共用同一個 i（var 無 block scope）
for (var i = 0; i < 3; i++) {
  setTimeout(function() {
    console.log(i); // 3, 3, 3 ← 迴圈結束後 i 已經是 3
  }, 1000);
}

// ✓ 解法 1：改用 let（每次迴圈都是獨立的 block scope）
for (let i = 0; i < 3; i++) {
  setTimeout(function() {
    console.log(i); // 0, 1, 2 ✓
  }, 1000);
}

// ✓ 解法 2：IIFE 捕捉當下的 i
for (var i = 0; i < 3; i++) {
  (function(j) {
    setTimeout(function() {
      console.log(j); // 0, 1, 2 ✓
    }, 1000);
  })(i); // 立即把 i 傳進去，j 是自己的副本
}
```

### 坑 2：Closure 記住的是「變數本身」，不是值的快照

```js
function makeAdder() {
  let x = 10;
  const add = () => x;   // 記住的是 x 這個變數，不是 10 這個值
  x = 20;                // 修改 x
  return add;
}

const fn = makeAdder();
console.log(fn()); // 20，不是 10！
```

### 坑 3：函式宣告 vs 函式表達式 hoisting

```js
sayHello(); // ✓ "hello"
sayHi();    // ❌ TypeError: sayHi is not a function

function sayHello() { console.log("hello"); }  // 整個被 hoisting
var sayHi = function() { console.log("hi"); }; // 只有 var sayHi 被提升（值是 undefined）
```

### 坑 4：箭頭函式沒有自己的 `arguments`

```js
function normal() {
  console.log(arguments); // ✓ Arguments 物件
}

const arrow = () => {
  console.log(arguments); // ❌ ReferenceError（或拿到外層的 arguments）
};

// 箭頭函式用 rest 參數代替
const arrowFixed = (...args) => {
  console.log(args); // ✓ 陣列
};
```

---

## 七、面試必考題

### Q1：解釋 Closure，舉一個實際應用
> 函式加上它定義時的外層作用域快照。應用：計數器、資料私有化、柯里化、event handler 記憶狀態。

### Q2：以下輸出什麼？（var + closure 迴圈坑）
```js
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0);
}
// 輸出：3, 3, 3
// 原因：var 沒有 block scope，三個 callback 共用同一個 i，setTimeout 執行時迴圈已結束
```

### Q3：以下輸出什麼？（hoisting）
```js
console.log(typeof foo); // "function"  ← 函式宣告整個提升
console.log(typeof bar); // "undefined" ← var 只提升宣告
function foo() {}
var bar = function() {};
```

### Q4：實作一個只能執行一次的函式 `once(fn)`
```js
function once(fn) {
  let called = false;
  let result;
  return function(...args) {
    if (!called) {
      called = true;
      result = fn(...args); // 執行並快取結果
    }
    return result;
  };
}

const init = once(() => console.log("initialized!"));
init(); // "initialized!"
init(); // 無輸出，回傳第一次的結果
```

### Q5：實作 `memoize(fn)`（記憶化，Closure 應用）
```js
function memoize(fn) {
  const cache = {}; // closure 記住 cache
  return function(...args) {
    const key = JSON.stringify(args);
    if (key in cache) {
      console.log("from cache");
      return cache[key];
    }
    cache[key] = fn(...args);
    return cache[key];
  };
}

const expensiveAdd = memoize((a, b) => a + b);
expensiveAdd(1, 2); // 計算
expensiveAdd(1, 2); // from cache → 直接回傳
```

### Q6：解釋 TDZ（Temporal Dead Zone）
> `let`/`const` 宣告雖然也被 hoisting，但在宣告語句執行前存取會拋 `ReferenceError`，這段「存在但不可用」的區間叫 TDZ。目的是強迫開發者先宣告再使用。

### Q7：以下輸出什麼？（scope chain + shadowing）
```js
let val = "global";
function outer() {
  let val = "outer";
  function inner() {
    console.log(val); // "outer" ← 找到 outer 的 val，不繼續往上
  }
  inner();
}
outer();
```

### Q8：Closure 會造成記憶體洩漏嗎？
> 會，如果 closure 持有大型物件的參考，而 closure 本身又一直存活（如掛在 global 或 DOM 事件），那個物件就無法被 GC。解法：不用時將變數設 `null`，或移除事件監聽。

---

## 八、關鍵思考點 & 回顧

| 概念            | 一句話記憶                                   |
| ------------- | --------------------------------------- |
| Lexical Scope | 作用域定義時決定，不是執行時                          |
| Scope Chain   | 找不到就往外層找，直到 global                      |
| Hoisting      | 宣告提升，賦值不提升；函式宣告整個提升                     |
| TDZ           | `let`/`const` 也 hoist，但不能提前用            |
| Closure       | 函式記住自己定義時的外層作用域                         |
| var 迴圈坑       | `var` 無 block scope → 用 `let` 或 IIFE 解決 |

**底層邏輯統一理解**：

JS 採用**靜態作用域**，每個函式在建立時就帶著一個指向外層環境的參考（`[[Environment]]`）。Scope Chain 是在「找變數」，Closure 是在「保留外層環境不被回收」—— 兩者是同一個機制的不同觀察角度。







