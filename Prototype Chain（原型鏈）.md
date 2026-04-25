## 三、Prototype Chain（原型鏈）

> **結論**：物件找不到屬性時，會自動往上找 `__proto__`，直到 `null` 為止。這就是 JS 繼承的底層機制。

```
myObj → myObj.__proto__ (Constructor.prototype) → Object.prototype → null
```

```js
function Animal(name) {
  this.name = name;       // 實例自己的屬性
}

// 加在原型上，所有實例共享（不浪費記憶體）
Animal.prototype.speak = function() {
  console.log(`${this.name} makes a sound.`);
};

const cat = new Animal("Cat");
cat.speak();              // "Cat makes a sound."

// 查找路徑：cat.speak → cat 本身沒有 → 去找 cat.__proto__ (Animal.prototype) → 找到！
console.log(cat.hasOwnProperty("name"));   // true  ← 自己的
console.log(cat.hasOwnProperty("speak"));  // false ← 原型的
```