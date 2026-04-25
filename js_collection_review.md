# JavaScript 集合物件 複習筆記

> **學這個的意義**：Array、Object、Map、Set 是日常最高頻的資料容器。選錯資料結構會讓程式又慢又難維護。搞清楚「誰適合做什麼」才能寫出高效、易讀的程式。

---

## 一、全局總覽 — 選哪個？

| 需求 | 用這個 |
|---|---|
| 有序、可重複的清單 | `Array` |
| 鍵值對，鍵是字串/Symbol | `Object` |
| 鍵值對，鍵是任意型別 / 需要頻繁增刪 | `Map` |
| 不重複的值的集合 | `Set` |
| 弱參考（不阻止 GC） | `WeakMap` / `WeakSet` |

---




---

## 三、Object

```js
const obj = { a: 1, b: 2, c: 3 };

// ── 存取 ──────────────────────────────────────────
Object.keys(obj);    // ['a', 'b', 'c']   ← 只有 key
Object.values(obj);  // [1, 2, 3]         ← 只有 value
Object.entries(obj); // [['a',1],['b',2],['c',3]]

// ── 建立 / 合併 ───────────────────────────────────
Object.fromEntries([['a', 1], ['b', 2]]); // {a:1, b:2}
Object.assign({}, obj, { d: 4 });         // 淺合併，回傳目標物件
const merged = { ...obj, d: 4 };          // 展開合併（更常用）

// ── 保護 ──────────────────────────────────────────
Object.freeze(obj);  // 凍結：不能新增/修改/刪除屬性（shallow）
Object.seal(obj);    // 密封：不能新增/刪除，但可以修改

// ── 查詢 ──────────────────────────────────────────
"a" in obj;                         // true（包含原型鏈）
obj.hasOwnProperty("a");            // true（只查自身）
Object.hasOwn(obj, "a");            // true（推薦新寫法）
```

---

## 四、Map

> **用 Map 而不是 Object 的時機**：鍵不是字串、需要保留插入順序、頻繁增刪、需要直接知道 size。

```js
const map = new Map();

// 基本操作
map.set("name", "Yoga");      // 設值
map.set(42, "number key");    // 鍵可以是任意型別
map.set({id: 1}, "obj key");  // 鍵可以是物件

map.get("name");              // "Yoga"
map.has("name");              // true
map.delete("name");           // 刪除，回傳 boolean
map.size;                     // 項目數量（Object 沒有直接的 .size）
map.clear();                  // 清空

// 遍歷（保證插入順序）
map.forEach((value, key) => console.log(key, value));
for (const [key, value] of map) { console.log(key, value); }
[...map.keys()];              // 所有 key
[...map.values()];            // 所有 value
[...map.entries()];           // [[key,value], ...]

// Object 轉 Map
const obj = { a: 1, b: 2 };
const mapFromObj = new Map(Object.entries(obj));

// Map 轉 Object
const objFromMap = Object.fromEntries(map);
```

---

## 五、Set

> **用途**：去重、集合運算（聯集、交集、差集）。

```js
const set = new Set([1, 2, 2, 3, 3]); // {1, 2, 3} ← 自動去重

// 基本操作
set.add(4);        // 加入值
set.has(2);        // true
set.delete(2);     // 刪除，回傳 boolean
set.size;          // 項目數量
set.clear();       // 清空

// 遍歷
for (const val of set) { console.log(val); }
[...set];          // 轉成陣列

// 集合運算
const A = new Set([1, 2, 3, 4]);
const B = new Set([3, 4, 5, 6]);

// 聯集 (Union)
const union = new Set([...A, ...B]);        // {1,2,3,4,5,6}

// 交集 (Intersection)
const intersection = new Set([...A].filter(x => B.has(x))); // {3,4}

// 差集 (Difference) A - B
const difference = new Set([...A].filter(x => !B.has(x)));  // {1,2}
```

---

## 六、WeakMap & WeakSet

> **用途**：持有物件的「弱參考」，物件沒有其他參考時可被 GC 回收，不造成記憶體洩漏。

```js
// WeakMap：鍵只能是物件，不能遍歷，沒有 size
const cache = new WeakMap();

let domNode = document.querySelector("#app"); // 假設存在
cache.set(domNode, { clicks: 0 });            // 關聯額外資料到 DOM 節點

domNode = null; // DOM 節點沒有其他參考
// cache 裡的資料會自動被 GC，不用手動清除

// WeakSet：值只能是物件，常用來標記「已處理」
const processed = new WeakSet();
function process(obj) {
  if (processed.has(obj)) return; // 避免重複處理
  processed.add(obj);
  // ... 處理邏輯
}
```

| | Map | WeakMap |
|---|---|---|
| 鍵的型別 | 任意 | 只能物件 |
| 可遍歷 | ✓ | ❌ |
| `.size` | ✓ | ❌ |
| GC 行為 | 阻止回收 | 不阻止回收 |

---

## 七、容易搞混的地方

### 坑 1：`sort()` 預設是字串排序

```js
[10, 9, 2, 1, 100].sort();          // [1, 10, 100, 2, 9] ❌ 字串排序！
[10, 9, 2, 1, 100].sort((a,b) => a - b); // [1, 2, 9, 10, 100] ✓
```

### 坑 2：`forEach` 不能中途 break

```js
// forEach 無法 break，要中止遍歷用 for...of 或 some / every
[1, 2, 3].forEach(x => {
  if (x === 2) break; // ❌ SyntaxError
});

// ✓ 用 for...of
for (const x of [1, 2, 3]) {
  if (x === 2) break; // ✓
}

// ✓ 或用 some（回傳 true 即停止）
[1, 2, 3].some(x => {
  if (x === 2) return true; // 停止遍歷
  console.log(x);           // 只印 1
});
```

### 坑 3：`map` / `filter` vs `forEach` 的選擇

```js
// map → 需要轉換後的新陣列
// filter → 需要篩選後的新陣列
// forEach → 只需要副作用（console.log、更新外部變數），不需要回傳值
// reduce → 需要累算成單一值（加總、建物件等）

// 常見誤用：用 forEach 建新陣列
const result = [];
[1,2,3].forEach(x => result.push(x * 2)); // ❌ 不必要的副作用寫法
const result2 = [1,2,3].map(x => x * 2);  // ✓ 語意更清晰
```

### 坑 4：`in` vs `hasOwnProperty` vs `hasOwn`

```js
const parent = { inherited: true };
const child = Object.create(parent);
child.own = true;

"inherited" in child;              // true  ← 包含原型鏈
child.hasOwnProperty("inherited"); // false ← 只查自身
child.hasOwnProperty("own");       // true
Object.hasOwn(child, "own");       // true  ← 推薦，不怕 hasOwnProperty 被覆寫
```

### 坑 5：Map 和 Object 效能差異

```js
// 頻繁增刪 key → Map 比 Object 快
// 原因：Map 底層針對動態增刪優化；Object 每次修改可能觸發 V8 的 hidden class 改變

// 純讀取靜態結構 → Object 稍快（V8 針對靜態 shape 最佳化）

// JSON 序列化 → Object 直接用，Map 需要轉換
JSON.stringify(new Map([["a", 1]])); // "{}" ← Map 無法直接序列化！
JSON.stringify(Object.fromEntries(new Map([["a", 1]]))); // '{"a":1}' ✓
```

### 坑 6：`Array.from` vs 展開運算子

```js
// 兩者都能轉可迭代物件為陣列
// Array.from 多了 mapping function，轉類陣列（沒有 Symbol.iterator 的）也能用

const nodeList = document.querySelectorAll("div"); // NodeList（類陣列）
[...nodeList];                  // ✓ NodeList 有 Symbol.iterator
Array.from(nodeList);           // ✓ 也可以

const likeArray = { 0: "a", 1: "b", length: 2 }; // 純類陣列，沒有 iterator
[...likeArray];                 // ❌ TypeError
Array.from(likeArray);          // ✓ ['a', 'b']
```

### 坑 7：`splice` vs `slice`

```js
const arr = [1, 2, 3, 4, 5];

// slice(start, end) → 不改原陣列，取出片段
arr.slice(1, 3);    // [2, 3]，arr 不變

// splice(start, deleteCount, ...items) → 改原陣列，可刪可插
arr.splice(1, 2);       // 回傳 [2, 3]，arr 變成 [1, 4, 5]
arr.splice(1, 0, 9, 8); // 在 index 1 插入 9, 8，不刪除
```

---

## 八、面試必考題

### Q1：Array 去重有幾種方法？

```js
const arr = [1, 1, 2, 2, 3];

// 方法 1：Set（最簡潔）
[...new Set(arr)]; // [1, 2, 3]

// 方法 2：filter + indexOf
arr.filter((x, i) => arr.indexOf(x) === i); // [1, 2, 3]

// 方法 3：reduce
arr.reduce((acc, x) => acc.includes(x) ? acc : [...acc, x], []);
```

### Q2：`map()` / `filter()` / `reduce()` 各解釋並舉例

```js
// map：一對一轉換，回傳同長度新陣列
[1,2,3].map(x => x * 2);            // [2,4,6]

// filter：篩選，回傳符合條件的新陣列
[1,2,3,4].filter(x => x % 2 === 0); // [2,4]

// reduce：累算，回傳單一值
[1,2,3,4].reduce((sum, x) => sum + x, 0); // 10
```

### Q3：`for...in` vs `for...of` 的差別

```js
const arr = [10, 20, 30];

for (const i in arr) { console.log(i); }   // "0" "1" "2" ← 遍歷 key（字串！）
for (const v of arr) { console.log(v); }   // 10 20 30   ← 遍歷 value

// for...in 用於 Object，for...of 用於可迭代物件（Array、Map、Set、String）
// ⚠️ 不要用 for...in 遍歷 Array，會遍歷到原型鏈上的屬性
```

### Q4：Object vs Map 怎麼選？

> 鍵是字串且結構固定 → Object；鍵是非字串型別、需要 size、頻繁增刪 → Map；需要 JSON 序列化 → Object。

### Q5：`flat` + `flatMap` 的用法

```js
[[1,2],[3,[4,5]]].flat();    // [1,2,3,[4,5]]  ← 展平 1 層（預設）
[[1,2],[3,[4,5]]].flat(2);   // [1,2,3,4,5]    ← 展平 2 層
[[1,2],[3,[4,5]]].flat(Infinity); // 全部展平

// flatMap = map + flat(1)，常用於一對多的轉換
["hello world", "foo bar"].flatMap(s => s.split(" "));
// ["hello", "world", "foo", "bar"]
```

### Q6：實作 `groupBy`（reduce 綜合應用）

```js
// 依條件把陣列分組成物件
function groupBy(arr, keyFn) {
  return arr.reduce((acc, item) => {
    const key = keyFn(item);
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});
}

const people = [
  { name: "Alice", dept: "eng" },
  { name: "Bob",   dept: "eng" },
  { name: "Carol", dept: "design" }
];

groupBy(people, p => p.dept);
// { eng: [{Alice}, {Bob}], design: [{Carol}] }
```

### Q7：Set 的交集、聯集、差集怎麼做？

> 見第五節 Set 範例，面試直接寫出三個 `new Set([...].filter(...))` 即可。

### Q8：WeakMap 和 Map 的差別，什麼情況用 WeakMap？

> WeakMap 鍵是弱參考，鍵物件被 GC 回收時 entry 自動消失，避免記憶體洩漏。適用：為 DOM 節點或外部物件附加私有資料，不想干涉它的生命週期。

---

## 九、關鍵思考點 & 回顧

| 集合 | 一句話定位 |
|---|---|
| Array | 有序清單，大量內建方法 |
| Object | 字串鍵的靜態鍵值對，JSON 友好 |
| Map | 任意鍵的動態鍵值對，有 size |
| Set | 不重複值的集合 |
| WeakMap/WeakSet | 弱參考版，配合 GC 不洩漏記憶體 |

**底層邏輯統一理解**：

選資料結構的核心問題只有三個：
1. **鍵的型別** — 字串？任意型別？不需要鍵？
2. **是否需要唯一性** — 需要去重 → Set
3. **生命週期** — 要跟著物件消失 → Weak 系列

方法選擇的核心：**需不需要回傳值**。`map`/`filter`/`reduce` 有回傳值、表達式風格；`forEach` 只做副作用、不回傳。
