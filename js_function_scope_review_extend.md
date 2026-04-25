
---

## 3. Closure + IIFE 私有狀態

```js
const userModule = (function() {
  // 私有狀態，外部無法直接存取
  let _users = [];

  return {
    add(user) { _users.push(user); },
    remove(name) { _users = _users.filter(u => u !== name); },
    list() { return [..._users]; } // 回傳淺複製，防止外部直接改
  };
})(); // IIFE 立即執行，建立一次 closure
```

### 淺複製 `[..._users]`

回傳的是**複製品**，不是原本的 `_users`。

```js
const result = userModule.list();
result.push("Hacker");          // 改的是複製品
console.log(userModule.list()); // _users 不受影響 ✅
```

如果直接 `return _users` → 外部拿到原始陣列的參考 → 可以偷改內部狀態。

> 淺複製 = 只複製第一層。元素如果是物件，裡面的內容還是共享的。

### 底線 `_users`

純粹是**命名慣例**，沒有語法效果。意思是「這是私有變數，請不要從外部碰它」。

> 真正讓 `_users` 私有的不是底線，是 **closure**。底線只是給人看的提示。

---

## 4. Closure 坑：記住的是變數本身，不是值的快照

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

**類比：**

- 快照 = 拍照，照片永遠是當時的樣子
- 參考 = 記住房間號碼，每次去都看到房間現在的狀態

Closure 是後者。

### 經典踩坑：`var` + loop

```js
const fns = [];
for (var i = 0; i < 3; i++) {
  fns.push(() => i);  // 全部記住同一個 i
}
console.log(fns[0]()); // 3
console.log(fns[1]()); // 3
console.log(fns[2]()); // 3 ← 不是 0, 1, 2！
```

**修法：用 `let`**（每次 iteration 各自的 `i`）

```js
for (let i = 0; i < 3; i++) {
  fns.push(() => i);
}
// 0, 1, 2 ✅
```

---

## 5. Scope 鏈 vs 快照

**Closure = function + 它誕生時的 scope 鏈的參考，不是 scope 的快照。**

Scope 鏈 = 「往外找變數的路徑」。function 建立時，JS 引擎記住：「如果我這裡找不到變數，要去哪裡找。」

```js
let x = 10;
const fn = () => x;  // 記住「去外層找 x」這條路
x = 20;
fn(); // 沿著路找到 x → 現在是 20
```

### 「只要變數還活著」是什麼意思

正常情況變數會隨 function 執行完畢被 GC 回收。但如果 closure 還抓著它，GC 就不能回收。

```js
function make() {
  let x = 10;       // 正常應該執行完就消失
  return () => x;   // 但 closure 抓著 x → x 繼續活著
}
const fn = make();  // make() 執行完了，x 還在
fn(); // 10，x 沒死
```

---

## 6. 箭頭函式沒有自己的 `arguments`

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

### 對照表

||一般函式|箭頭函式|
|---|---|---|
|`this`|自己的|繼承外層|
|`arguments`|自己的|繼承外層（或報錯）|

底層同一個邏輯：箭頭函式不建立自己的執行環境，直接繼承外層的。

### `arguments` 是假陣列

```js
function fn() {
  console.log(arguments);   // { 0: 'a', 1: 'b', length: 2 }
  arguments.map(x => x);   // ❌ TypeError: arguments.map is not a function
}
fn('a', 'b');
```

`arguments` 有 index、有 length，但沒有 `.map` `.filter` `.reduce`。

`...args` 是真正的 `Array` 實例，完整繼承所有陣列方法。✅

---

## 7. 實作 `once(fn)`：只能執行一次的函式

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

### 這題考什麼

Closure 的實際應用——用閉包保存狀態（`called`、`result`）跨越多次呼叫。能寫出這題 = 證明你真的懂 closure，不只是背定義。

### 常見變體

```js
// 變體 1：最多執行 N 次
function atMost(fn, n) { ... }

// 變體 2：Lodash 的 _.once 就是這個
// 變體 3：加上 reset 功能
```

### 現實中用在哪

- 初始化只跑一次（DB 連線、SDK init）
- 防止按鈕重複送出
- Lodash `_.once` 底層就是這個實作

---

## 底層邏輯總結

這幾個主題背後都是同一件事：

**Closure = 用 scope 鏈把狀態「藏」起來，讓外部無法直接存取。**

- `_users` 私有狀態 → closure 藏狀態
- `once(fn)` → closure 藏 `called` 和 `result`
- 變數參考而非快照 → closure 抓的是「格子位置」，不是「格子裡的值」

JS 沒有 class private 之前，closure 是唯一的做法。現在 class 有 `#` 私有欄位，但 closure 的概念在面試和底層理解上依然核心。


函示裡面可用typeof判斷是否有值
一級函式特性：
宣告式
表達式
立即執行式(只使用一次 執行完畢被回收)
	兩種寫法皆可
	( fn(){} )()
	( fn(){}() )

箭頭式

作用域鍊：一職網上找 直到找到 找不到就拋錯

可使用自由變數的內部函示=閉包
閉包 有資料隱藏 與封裝 特性


函式的區域範圍就是變數的 作用域


箭頭函示沒影自己的this /argument /super/ new.target

了解釐清哪些會變成自由變數