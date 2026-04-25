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
