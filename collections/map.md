> **用 Map 而不是 Object 的時機**：鍵不是字串、需要保留插入順序、頻繁增刪、需要直接知道 size。

### Map 進階用法

#### 鏈式設定（因為 `set()` 回傳 Map 本身）

```js
const m = new Map()
  .set('a', 1)
  .set('b', 2)
  .set('c', 3);
```

#### 預設值處理（沒有 getDefault，但可用 `??` 或 `||`）

```js
//`??` = **Nullish Coalescing（空值合併運算子）**
//只有左邊是 `null` 或 `undefined` 時，才用右邊的值。
const value = map.get('key') ?? 'default';//
// 若想自動寫入預設值
if (!map.has('key')) map.set('key', 'default');
```

#### 過濾與轉換（轉成陣列再處理）

```js
const filtered = [...map].filter(([k, v]) => v > 1);
const newMap = new Map(filtered);
```

#### 合併兩個 Map

```js
const a = new Map([['x', 1], ['y', 2]]);
const b = new Map([['y', 3], ['z', 4]]);
const merged = new Map([...a, ...b]); // 後面的 'y' 會覆蓋前面的
```

#### Map 的序列化（轉 JSON）

```js
// Map 不能直接 JSON.stringify，要先轉成物件或陣列
const map = new Map([['a', 1], ['b', 2]]);
// 方法1：轉成物件（限鍵為字串）
const obj = Object.fromEntries(map);
JSON.stringify(obj); // '{"a":1,"b":2}'

// 方法2：轉成二維陣列（保留任意鍵型別）
JSON.stringify([...map]); // '[["a",1],["b",2]]'
// 還原：new Map(JSON.parse(str))
```

#### 效能提示

- **頻繁增刪**：Map 比 Object 快（V8 對 Map 的動態增刪有優化）
- **純讀取靜態結構**：Object 可能稍快（因為 shape 固定）
- **大數據量（數萬筆以上）**：Map 的 `has` / `get` / `set` 通常優於 Object

---

