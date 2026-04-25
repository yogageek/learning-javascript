# JavaScript 物件 / 方法 / 屬性 複習筆記

> **學這個的意義**：JS 幾乎一切皆物件。搞懂物件運作，才能真正理解 class、繼承、框架原理，甚至看懂別人的 code。

---

## 一、物件基礎 — 屬性 & 方法

```js
const person = {
  name: "Yoga",        // 屬性 (property)：儲存資料
  age: 30,
  greet() {            // 方法 (method)：物件裡的函式
    console.log(`Hi, I'm ${this.name}`);
  }
};

person.greet();        // Hi, I'm Yoga
person["name"];        // "Yoga"  ← 動態存取用這種
```

**底層邏輯**：屬性 = 鍵值對 (key-value)，方法 = 值為函式的屬性，本質沒差別。

---

## 二、`this` — 函式裡的主詞

> **結論**：`this` 不是定義時決定，是**呼叫時**決定的（箭頭函式除外）。

### 四種 this 情境

```js
// 1. 方法呼叫 → this = 呼叫那個物件
const obj = {
  name: "A",
  say() { console.log(this.name); }
};
obj.say(); // "A"

// 2. 普通函式呼叫 → this = undefined (strict mode) / window (非 strict)
function foo() { console.log(this); }
foo(); // undefined (嚴格模式)

// 3. 箭頭函式 → this = 定義當下的外層 this（lexical this）
const obj2 = {
  name: "B",
  say: () => { console.log(this); } // this 是外層，不是 obj2！
};
obj2.say(); // undefined 或 window（常見坑）

// 4. 顯式綁定 → call / apply / bind 手動指定
function greet(greeting) {
  console.log(`${greeting}, ${this.name}`);
}
const user = { name: "Yoga" };
greet.call(user, "Hello");          // Hello, Yoga
greet.apply(user, ["Hi"]);          // Hi, Yoga
const boundFn = greet.bind(user);
boundFn("Hey");                     // Hey, Yoga
```

### 最常見的 this 踩坑

```js
const timer = {
  name: "Timer",
  start() {
    // 坑：setTimeout 的 callback 是普通函式，this 丟失
    setTimeout(function() {
      console.log(this.name); // undefined！
    }, 1000);

    // 解法 1：箭頭函式繼承外層 this
    setTimeout(() => {
      console.log(this.name); // "Timer" ✓
    }, 1000);
  }
};
```
**`this` = 誰呼叫，就指向誰。**

```js
timer.start()  // start 裡面的 this = timer ✓

setTimeout(function() {
  // 這裡是 setTimeout 在呼叫，不是 timer
  // this = window，不是 timer
})
```
**判斷 `this` 的口訣**

| 呼叫方式                        | `this` 是誰              |
| --------------------------- | ---------------------- |
| `obj.fn()`                  | `obj`                  |
| `fn()` 直接呼叫                 | `window` / `undefined` |
| 箭頭函式                        | 繼承定義時的外層 `this`        |
| `fn.call(x)` / `fn.bind(x)` | `x`                    |
箭頭函式沒有自己的 `this`，所以往外找，找到 `timer`。✓**關鍵思考**
箭頭函式沒有自己的 `this`，所以它「繼承外層」這件事，正是解決 callback 丟失 `this` 的完美工具。`arguments` 也是同理——箭頭函式兩個都不自帶。

[[Prototype Chain（原型鏈）]]

### `new` 關鍵字背後做了什麼

```js
// new Animal("Cat") 等同於：
const obj = {};
obj.__proto__ = Animal.prototype;   // 1. 建立空物件並連結原型
Animal.call(obj, "Cat");            // 2. 執行建構函式，this = obj
// 3. 回傳 obj
```

---

## 四、繼承 — ES6 Class + extends

> **Class 只是語法糖**，底層還是 prototype chain。

```js
// 父類別
class Animal {
  constructor(name) {
    this.name = name;
  }

  speak() {
    console.log(`${this.name} makes a sound.`);
  }
}

// 子類別繼承
class Dog extends Animal {
  constructor(name, breed) {
    super(name);           // ← 必須先呼叫 super()，才能用 this
    this.breed = breed;
  }

  // 覆寫 (override) 父類方法
  speak() {
    console.log(`${this.name} barks.`);
  }

  // 子類自己的方法
  fetch() {
    super.speak();         // 呼叫父類的 speak
    console.log(`${this.name} fetches the ball!`);
  }
}

const d = new Dog("Rex", "Husky");
d.speak();   // "Rex barks."    ← 子類覆寫
d.fetch();   // "Rex makes a sound." + "Rex fetches the ball!"

// 原型鏈驗證
console.log(d instanceof Dog);    // true
console.log(d instanceof Animal); // true
```

### 靜態方法 (static)

```js
class MathHelper {
  static add(a, b) { return a + b; }  // 掛在類別上，不需要實例
}
MathHelper.add(1, 2); // 3
// new MathHelper().add(1, 2); // ❌ Error
```

---

[[深複製 vs 淺複製]]
---

## 六、面試必考題

### Q1：解釋 prototype chain
> 物件查找屬性時，先找自身，找不到就沿著 `__proto__` 往上找，直到 `Object.prototype`，再找不到回傳 `undefined`。

### Q2：`call` / `apply` / `bind` 的差別？
```js
fn.call(thisArg, arg1, arg2)      // 立即執行，參數逐個傳
fn.apply(thisArg, [arg1, arg2])   // 立即執行，參數用陣列
fn.bind(thisArg, arg1)            // 回傳新函式，不立即執行
```

### Q3：`new` 做了什麼？（4步驟）
1. 建立空物件 `{}`
2. 設定 `__proto__` 指向建構函式的 `prototype`
3. 執行建構函式，`this` 指向新物件
4. 回傳新物件（若建構函式沒有明確 return 物件）

### Q4：以下輸出什麼？（this 考題）
```js
const obj = {
  val: 1,
  getVal: function() { return this.val; },
  getValArrow: () => this.val
};
console.log(obj.getVal());      // 1
console.log(obj.getValArrow()); // undefined（箭頭函式 this 是外層）
```
const timer = {
  count: 0,
  start() {
    // ❌ 普通函式：EC 有自己的 this = window
    setInterval(function() {
      this.count++; // window.count → NaN
    }, 1000);

    // ✅ 箭頭函式：EC 沒有 this → 往外找到 timer
    setInterval(() => {
      this.count++; // timer.count → 1, 2, 3...
    }, 1000);
  }
};
### Q5：實作 deepClone
> 見上方手寫遞迴版本，面試重點：處理 null、Array、遞迴。

### Q6：`instanceof` 原理？
```js
// a instanceof B → 檢查 B.prototype 是否出現在 a 的原型鏈上
d instanceof Animal // → 去找 d.__proto__.__proto__ === Animal.prototype → true
```

### Q7：class 和 function 建構的差別？
- `class` 不能被普通呼叫（沒有 `new` 會報錯），`function` 可以
- `class` 裡的方法是 non-enumerable，`prototype` 直接加的方法是 enumerable
- 本質原型鏈結構相同

### Q8：Object.create() 的用途？
```js
const proto = { greet() { console.log("hi"); } };
const obj = Object.create(proto); // obj.__proto__ === proto
obj.greet(); // "hi"
// 用途：手動控制原型鏈，不透過建構函式
```

---

## 七、關鍵思考點 & 回顧

| 概念 | 一句話記憶 |
|---|---|
| `this` | 呼叫時決定，箭頭函式例外（定義時決定） |
| prototype chain | 找不到就往上找，直到 null |
| `extends` | 語法糖，底層是 prototype |
| 淺複製 | 只複製第一層，巢狀物件共用參考 |
| 深複製 | 全部複製，推薦 `structuredClone` |
| `new` | 建立物件 → 接原型 → 執行建構 → 回傳 |

**底層邏輯統一理解**：
JS 的繼承不是「複製」行為（不像靜態語言），而是「委派」(delegation)——找不到就委派給上層原型。這讓記憶體更有效率，也是 prototype chain 的本質。



| | 原生物件 | 宿主物件 | 使用者自定物件 |
|---|---|---|---|
| 誰定義 | JS 語言本身 | 執行環境 | 你 |
| 例子 | `Array` `Object` `Math` `Date` | `window` `document` `setTimeout` | `const user = {}` |
| 跨環境 | ✅ | ❌ | ✅ |
| 規範 | ECMAScript | 各平台自訂 | 無 |

# 建構子函式
**用來批量製造同類物件的函式。**

```js
function User(name, age) {
  this.name = name;
  this.age = age;
}

const u1 = new User("Yoga", 25);
const u2 = new User("Alice", 30);
```

---

**`new` 做了什麼**

```js
// new User("Yoga") 背後：
// 1. 建立空物件 {}
// 2. this 指向這個空物件
// 3. 執行函式內容
// 4. 回傳這個物件
```

---

**vs 工廠函式**

```js
// 工廠函式（不用 new）
function createUser(name) {
  return { name };
}

// 建構子（要用 new）
function User(name) {
  this.name = name;
}
```

||建構子|工廠函式|
|---|---|---|
|呼叫方式|`new User()`|`createUser()`|
|`instanceof`|✅ 可用|❌ 不行|
|現代寫法|改用 `class`|還是常見|


---

**現代等價寫法**

```js
class User {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }
}
```

`class` 底層還是建構子，只是語法更清楚。

# 物件實字(object literal)
**直接用 `{}` 寫出來的物件。**

```js
const user = {
  name: "Yoga",
  age: 25,
  greet() {
    console.log("hi " + this.name);
  }
};
```

就這樣，沒有 `new`，沒有 `class`。

---

**vs 建構子**

||物件實字|建構子／class|
|---|---|---|
|用途|一次性單一物件|批量製造同類物件|
|語法|`const x = {}`|`new User()`|
|何時用|設定檔、單一資料|需要多個相同結構|


---

**簡寫語法**

```js
const name = "Yoga";
const age = 25;

// 舊寫法
const user = { name: name, age: age };

// 簡寫（key 跟變數名一樣時）
const user = { name, age };
```

| 情境                    | `this` 指向              |
| --------------------- | ---------------------- |
| 全域（瀏覽器）               | `window`               |
| 全域（Node.js）           | `module.exports`（`{}`） |
| 一般函式（瀏覽器）             | `window`               |
| 一般函式（strict mode）     | `undefined`            |
| 物件方法                  | 該物件                    |
| 箭頭函式                  | 繼承外層                   |
| `new` 建構子             | 新建立的物件                 |
| `call / apply / bind` | 你指定的對象                 |

## 原型鏈

---

### 核心概念

**找不到屬性時，自動往上找。**

```js
const obj = { name: "Yoga" };
obj.toString(); // obj 自己沒有 toString，往上找到 Object.prototype
```

---

### 第一層：每個物件都有 `__proto__`

```js
const arr = [1, 2, 3];

arr.__proto__ === Array.prototype        // true
arr.__proto__.__proto__ === Object.prototype  // true
arr.__proto__.__proto__.__proto__ === null    // true，終點
```

```
arr
 └── Array.prototype  （有 .map .filter .push）
      └── Object.prototype  （有 .toString .hasOwnProperty）
           └── null  ← 終點
```

---

### 第二層：建構子怎麼建立原型鏈

```js
function Animal(name) {
  this.name = name;
}
Animal.prototype.speak = function() {
  console.log(this.name + " speaks");
};

const dog = new Animal("Rex");
dog.speak(); // "Rex speaks"
// dog 自己沒有 speak → 去 Animal.prototype 找 → 找到 ✓
```

```
dog
 └── Animal.prototype  （有 speak）
      └── Object.prototype
           └── null
```

---

### 第三層：class 只是語法糖

```js
class Animal {
  constructor(name) { this.name = name; }
  speak() { console.log(this.name); }
}

class Dog extends Animal {
  bark() { console.log("woof"); }
}

const d = new Dog("Rex");
d.speak(); // 自己沒有 → Dog.prototype 沒有 → Animal.prototype 找到 ✓
```

```
d
 └── Dog.prototype  （有 bark）
      └── Animal.prototype  （有 speak）
           └── Object.prototype
                └── null
```

> `extends` 底層就是把 `Dog.prototype.__proto__` 指向 `Animal.prototype`。

---

### 關鍵區分

```js
dog.hasOwnProperty('name')   // true，自己身上有
dog.hasOwnProperty('speak')  // false，是原型上的
```

---

### 底層邏輯

| 概念                           | 說明                      |
| ---------------------------- | ----------------------- |
| `prototype`                  | 建構子/class 的屬性，方法放這裡     |
| `__proto__`                  | 每個實例指向上層原型的連結           |
| `Object.getPrototypeOf(obj)` | 正式寫法，等同 `obj.__proto__` |

---

### 一句話

> 原型鏈 = 找不到就往上找，直到 `null` 為止。`class` 和 `extends` 只是讓這條鏈更好寫的語法。
這種原型連結的關係就稱為原型鍊 null是最後一個連結
extends也是用protoype的概念來達成

## `extends` 繼承

---

### 核心概念

**子 class 擁有父 class 的一切，還能加自己的東西。**

---

### 第一層：沒有 extends 的問題

```js
class Animal {
  constructor(name) { this.name = name; }
  speak() { console.log(this.name + " speaks"); }
}

class Dog {
  constructor(name) { this.name = name; } // 重複！
  speak() { console.log(this.name + " speaks"); } // 重複！
  bark() { console.log("woof"); }
}
```

重複程式碼 → 用 `extends` 解決。

---

### 第二層：基本用法

```js
class Animal {
  constructor(name) { this.name = name; }
  speak() { console.log(this.name + " speaks"); }
}

class Dog extends Animal {
  bark() { console.log("woof"); }
}

const d = new Dog("Rex");
d.speak(); // "Rex speaks" ✓ 從 Animal 繼承來的
d.bark();  // "woof" ✓ Dog 自己的
```

---

### 第三層：`super` 是什麼

子 class 有 `constructor` 時，**一定要先呼叫 `super()`**。

```js
class Dog extends Animal {
  constructor(name, breed) {
    super(name);       // 先執行 Animal 的 constructor
    this.breed = breed; // 再加自己的屬性
  }
}
```

> 沒呼叫 `super()` 直接用 `this` → ReferenceError。 原因：`this` 是由父 class 建立的，你得先讓父 class 初始化完。

---

### 第四層：覆寫父 class 方法

```js
class Dog extends Animal {
  speak() {
    super.speak();             // 保留父 class 的行為
    console.log("...and barks!"); // 再加自己的
  }
}

const d = new Dog("Rex");
d.speak();
// "Rex speaks"
// "...and barks!"
```

---

### 底層實際做了什麼

```js
// extends 等於：
Dog.prototype.__proto__ = Animal.prototype;

// 所以查找順序：
// d → Dog.prototype → Animal.prototype → Object.prototype → null
```

`extends` 只是幫你自動串好原型鏈，不是什麼魔法。

---

### 總結

|關鍵字|作用|
|---|---|
|`extends`|建立父子關係，串接原型鏈|
|`super()`|呼叫父 class 的 constructor|
|`super.method()`|呼叫父 class 的方法|

> **extends = 繼承屬性和方法　／　super = 存取父 class**

## `call` vs `Object.create`

---

### `call` — 借用函式，指定 `this`

```js
function greet(greeting) {
  console.log(greeting + " " + this.name);
}

const user = { name: "Yoga" };
greet.call(user, "Hello"); // "Hello Yoga"
//         ↑ this  ↑ 參數
```

**用途：借別人的函式，套在自己身上。**

```js
// 經典用法：繼承父 class 的屬性
function Animal(name) { this.name = name; }
function Dog(name, breed) {
  Animal.call(this, name); // 借 Animal 的 constructor 來初始化
  this.breed = breed;
}
```

---

### `Object.create` — 指定原型，建立物件

```js
const animal = {
  speak() { console.log(this.name + " speaks"); }
};

const dog = Object.create(animal); // dog 的原型 = animal
dog.name = "Rex";
dog.speak(); // "Rex speaks" ✓
```

```
dog
 └── animal（原型）
      └── Object.prototype
           └── null
```

**用途：手動指定原型鏈，不用 `class`。**

---

### 對比

||`call`|`Object.create`|
|---|---|---|
|目的|借函式執行|建立物件並指定原型|
|影響|只影響單次執行的 `this`|建立永久的原型關係|
|回傳|函式執行結果|新物件|
|常見場景|借 constructor、借陣列方法|手動建立原型鏈|

---

### 一句話

> `call` = 臨時借函式　／　`Object.create` = 永久繼承原型

## `apply`

---

### 核心概念

**跟 `call` 一樣，差在參數用陣列傳。**

```js
fn.call(this,   arg1, arg2, arg3)  // 一個一個傳
fn.apply(this, [arg1, arg2, arg3]) // 陣列傳
```

---

### 基本用法

```js
function greet(greeting, punctuation) {
  console.log(greeting + " " + this.name + punctuation);
}

const user = { name: "Yoga" };

greet.call(user, "Hello", "!");    // "Hello Yoga!"
greet.apply(user, ["Hello", "!"]); // "Hello Yoga!" 結果一樣
```

---

### 經典用途：展開陣列當參數

```js
const nums = [3, 1, 4, 1, 5, 9];

Math.max(3, 1, 4, 1, 5, 9);       // 9 ✓ 但要一個一個傳
Math.max.apply(null, nums);        // 9 ✓ 直接傳陣列
Math.max(...nums);                 // 9 ✓ 現代寫法，用展開語法取代
```

> `apply` 的這個用途現在幾乎被 `...` 取代了。

---

### 三兄弟對比

| | `call` | `apply` | `bind` |
|---|---|---|---|
| 參數格式 | 逐一傳 | 陣列傳 | 逐一傳 |
| 立即執行 | ✅ | ✅ | ❌ 回傳新函式 |
| 用途 | 借函式 | 借函式＋陣列參數 | 綁定後稍後執行 |

---

### 一句話

> `apply` = `call` 的陣列版，現代幾乎用 `...` 取代，但面試還是會考。


Q8：Object.create() 的用途？ const proto = { greet() { console.log("hi"); } }; const obj = Object.create(proto); // obj.__proto__ === proto obj.greet(); // "hi" // 用途：手動控制原型鏈，不透過建構函式
這段程式碼展示了 `Object.create()` 的核心用途：**手動指定一個物件的原型（`[[Prototype]]`），而不需要透過建構函式（constructor function）或 `class`**。

## 逐步解說

```javascript
const proto = { greet() { console.log("hi"); } };
```
- 建立一個普通物件 `proto`，裡面有一個方法 `greet`。

```javascript
const obj = Object.create(proto);
```
- `Object.create(proto)` 會建立一個**新的空物件** `obj`。
- 這個新物件的 `[[Prototype]]`（內部原型鏈）會直接指向 `proto`。
- 在瀏覽器環境或 Node.js 中，`obj.__proto__ === proto` 為 `true`（雖然 `__proto__` 不建議直接用於正式程式碼，但易於理解）。

```javascript
obj.greet(); // "hi"
```
- `obj` 本身沒有 `greet` 方法，但 JavaScript 沿著原型鏈往上找，在 `proto` 中找到並執行。

## `Object.create()` 的主要用途

| 用途                | 說明                                                                   |
| ----------------- | -------------------------------------------------------------------- |
| **直接設定原型（無建構函式）** | 不需要 `new`、不需要 `class`、不需要 `constructor`，就能讓物件繼承另一個物件                 |
| **建立「純粹」的委託關係**   | 適合以「物件委託（OLOO）」風格撰寫程式，而非「類別繼承」                                       |
| **避免建構函式的副作用**    | 不會執行任何建構函式邏輯（因為根本沒有建構函式）                                             |
| **實作繼承**          | 可以模擬繼承的效果，但不使用 `class Child extends Parent`                          |
| **建立非常乾淨的空物件**    | `Object.create(null)` 可建立完全無原型鏈的物件（沒有 `toString`、`hasOwnProperty` 等） |

## 對比傳統建構函式

```javascript
// 傳統：透過建構函式
function Animal() {}
Animal.prototype.greet = function() { console.log("hi"); };
const dog = new Animal();

// Object.create：直接指定原型
const proto = { greet() { console.log("hi"); } };
const cat = Object.create(proto);
```

## 重要觀念

- **原型鏈是動態的**：修改 `proto` 後，`obj` 的行為也會跟著變（除非 `obj` 自己覆蓋了該屬性）。
- **與 `class` 不衝突**：`Object.create` 是更底層的機制，`class` 的繼承底層也是用類似的方式操作原型鏈。

簡單一句總結：  
> `Object.create()` 讓你不必寫建構函式，就能直接決定一個物件的父親（原型）是誰。

## `Object.create()` 筆記

### 語法
```javascript
Object.create(proto, propertiesObject)
```

### 參數說明

| 參數 | 說明 | 必填 |
|------|------|------|
| `proto` | 新物件的原型 | ✅ |
| `propertiesObject` | 自有屬性的描述器 | ❌ |

### 屬性描述器可設定的鍵

| 鍵 | 說明 | 預設 |
|---|------|------|
| `value` | 屬性值 | `undefined` |
| `writable` | 可否修改 | `false` |
| `enumerable` | 可否列舉 | `false` |
| `configurable` | 可否刪除/修改描述器 | `false` |
| `get` | getter（與 value 互斥） | `undefined` |
| `set` | setter（與 value 互斥） | `undefined` |

### 常用範例

```javascript
const obj = Object.create(null, {
    name: { value: "Alice", writable: true, enumerable: true },
    age:  { value: 25, enumerable: true },          // 唯讀
    fullName: {                                      // getter/setter
        get() { return this.name; },
        set(v) { this.name = v; }
    }
});
```

### 用途對照表

| 需求 | 設定 |
|------|------|
| 唯讀常數 | `{ value: 100, writable: false }` |
| 隱藏屬性（不列舉） | `{ value: "secret", enumerable: false }` |
| 不可刪除 | `{ value: "x", configurable: false }` |
| 一般屬性 | `{ value: "x", writable: true, enumerable: true, configurable: true }` |
| getter/setter | `{ get() {...}, set(v) {...} }` |

### 重點對比

| 寫法 | 描述器預設值 |
|------|-------------|
| `obj.x = 1` | 全部 `true` |
| `Object.create(proto, { x: { value: 1 } })` | 全部 `false` |

### 實務建議

> 大多情況只使用第一個參數，第二參數用在需要嚴格控制屬性行為時（唯讀、列舉、getter/setter）。


| 方法                                | 類型     | 說明         | 注意                               |
| --------------------------------- | ------ | ---------- | -------------------------------- |
| `=` (直接賦值)                        | ❌ 不是複製 | 只是參考傳遞     | 修改會影響原物件                         |
| `{ ...obj }`                      | 🟡 淺複製 | 展開運算符      | 只複製第一層                           |
| `Object.assign({}, obj)`          | 🟡 淺複製 | 合併物件       | 只複製第一層                           |
| `[...arr]`                        | 🟡 淺複製 | 展開陣列       | 只複製第一層                           |
| `Array.from(arr)`                 | 🟡 淺複製 | 轉為新陣列      | 只複製第一層                           |
| `arr.slice()`                     | 🟡 淺複製 | 切割陣列       | 只複製第一層                           |
| `arr.concat()`                    | 🟡 淺複製 | 合併陣列       | 只複製第一層                           |
| `Object.create(obj)`              | 🟡 淺複製 | 原型繼承       | 屬性在原型鏈上                          |
| `JSON.parse(JSON.stringify(obj))` | 🟢 深複製 | 轉 JSON 再還原 | 無法處理函式、`undefined`、`Symbol`、循環參考 |
| `structuredClone(obj)`            | 🟢 深複製 | 原生深複製      | 現代瀏覽器/Node 17+，可處理多數型別           |
| Lodash `_.cloneDeep(obj)`         | 🟢 深複製 | 函式庫方法      | 完整解決各種邊界情況                       |