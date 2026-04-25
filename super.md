## `super` 考試複習筆記

### 一、核心定義

> `super` 是一個關鍵字，用來**呼叫父類別（超類別）的建構函式或方法**。

---

### 二、使用規則（必考）

| 規則 | 說明 | 錯誤範例 |
|------|------|----------|
| 子類建構式中**必須**先呼叫 `super()` | 才能使用 `this` | `this.name = "x"` 在 `super()` 之前 |
| `super()` 只能在建構式中呼叫 | 不能在普通方法裡呼叫 `super()` | `method() { super(); }` |
| `super.method()` 可在任何方法中呼叫 | 包括實例方法和靜態方法 | ✅ 正確 |
| 箭頭函式中**不能**使用 `super` | 箭頭函式沒有自己的 `super` 綁定 | `() => super.method()` |
| 物件簡寫方法中可使用 `super` | `{ method() { super.xxx } }` | ✅ 正確 |

---

### 三、三種使用情境（考題重點）

| 情境 | 語法 | 用途 |
|------|------|------|
| 呼叫父類建構函式 | `super(參數)` | 繼承父類屬性，**只能在 `constructor` 中使用** |
| 呼叫父類實例方法 | `super.方法名()` | 擴充父類方法行為 |
| 呼叫父類靜態方法 | `super.靜態方法()` | 在子類靜態方法中重用父類邏輯 |

---

### 四、常見考題範例

#### 題型 1：忘記呼叫 `super()` ❌

```javascript
class Parent {
    constructor(name) {
        this.name = name;
    }
}

class Child extends Parent {
    constructor(name, age) {
        // 忘記呼叫 super(name)
        this.age = age;  // ❌ ReferenceError: Must call super constructor
    }
}
```

#### 題型 2：`super()` 呼叫順序 ❌

```javascript
class Parent {
    constructor() {
        this.value = 10;
    }
}

class Child extends Parent {
    constructor() {
        this.value = 20;   // ❌ 錯誤：先用了 this
        super();           // 應該先 super()
    }
}
```

#### 題型 3：方法覆蓋與 `super` ✅

```javascript
class Animal {
    speak() {
        return "動物叫";
    }
}

class Dog extends Animal {
    speak() {
        return super.speak() + "：汪汪";  // ✅ 擴充父類方法
    }
}

const dog = new Dog();
console.log(dog.speak());  // "動物叫：汪汪"
```

#### 題型 4：靜態方法繼承

```javascript
class Calculator {
    static add(a, b) {
        return a + b;
    }
}

class AdvancedCalculator extends Calculator {
    static addAndDouble(a, b) {
        return super.add(a, b) * 2;  // ✅ 呼叫父類靜態方法
    }
}

console.log(AdvancedCalculator.addAndDouble(3, 5));  // 16
```

#### 題型 5：物件字面量中使用 `super`（ES6 特性）

```javascript
const parent = {
    greet() {
        return "Hello";
    }
};

const child = {
    greet() {
        return super.greet() + " World";  // ✅ 物件簡寫方法可用 super
    }
};

Object.setPrototypeOf(child, parent);
console.log(child.greet());  // "Hello World"
```

#### 題型 6：箭頭函式無法使用 `super` ❌

```javascript
class Parent {
    method() {
        return "Parent";
    }
}

class Child extends Parent {
    method() {
        const arrow = () => super.method();  // ❌ 箭頭函式不能用 super
        return arrow();
    }
}
// ReferenceError: super is not defined
```

---

### 五、`super` vs `this` 對照表

| 比較 | `super` | `this` |
|------|---------|--------|
| 指向 | 父類別（原型鏈上的物件） | 當前實例 |
| 在建構式中使用順序 | 必須先呼叫 | 要在 `super()` 之後才能用 |
| 能否呼叫父類建構式 | ✅ `super()` | ❌ |
| 存取實例屬性 | ❌ `super.name` 會得到 `undefined` | ✅ `this.name` |
| 在靜態方法中使用 | ✅ 可呼叫父類靜態方法 | ✅ 指向類別本身 |
| 在箭頭函式中 | ❌ 不能用 | ✅ 可用（繼承外層） |

---

### 六、陷阱題整理

| 陷阱 | 錯誤寫法 | 正確寫法 |
|------|----------|----------|
| 用 `super` 取實例屬性 | `super.name` | `this.name` |
| 在一般物件用 `super`（沒有簡寫方法） | `{ greet: function() { super.xxx } }` | `{ greet() { super.xxx } }` |
| 在 `super()` 前用 `this` | `this.x = 1; super();` | `super(); this.x = 1;` |
| 在普通方法內呼叫 `super()` | `method() { super(); }` | 只能放在 `constructor` |
| 類別沒有 `extends` 卻用 `super` | `class A { constructor() { super(); } }` | 刪除 `super()` 或加上 `extends` |

---

### 七、記憶口訣

> **子類建構先 `super`，取父方法用 `super.方法`**
> **實例屬性用 `this`，靜態方法也能 `super`**
> **箭頭沒有 `super` 綁，物件方法要簡寫**

---

### 八、快速檢查表（考前看）

- [ ] 子類建構式第一行是不是 `super()`？
- [ ] `super()` 之前有沒有用到 `this`？
- [ ] 是否在非建構式中呼叫 `super()`？
- [ ] 是否用 `super.屬性` 取實例屬性？（應該用 `this.屬性`）
- [ ] 箭頭函式中是否用了 `super`？
- [ ] `extends` 是否真的有父類別？