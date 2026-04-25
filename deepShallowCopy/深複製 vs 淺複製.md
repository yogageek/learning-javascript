## 五、深複製 vs 淺複製

> **關鍵差異**：物件是參考型別 (reference type)，複製的是「地址」，不是值本身。

```
淺複製：複製地址 → 改 B 會影響 A（巢狀物件）
深複製：複製全部值 → 完全獨立
```

### 淺複製（Shallow Copy）

```js
const original = { a: 1, nested: { b: 2 } };

// 方法 1：Object.assign
const shallow1 = Object.assign({}, original);

// 方法 2：展開運算子（最常用）
const shallow2 = { ...original };

shallow2.a = 99;             // ✓ 不影響 original.a
shallow2.nested.b = 99;     // ❌ original.nested.b 也變成 99！（共用同一個參考）
```

### 深複製（Deep Copy）

```js
const original = { a: 1, nested: { b: 2 }, arr: [1, 2, 3] };

// 方法 1：JSON（最常用，但有限制）
const deep1 = JSON.parse(JSON.stringify(original));
// ⚠️ 無法處理：undefined、Function、Date、RegExp、循環參考

// 方法 2：structuredClone（現代瀏覽器/Node 17+，推薦）
const deep2 = structuredClone(original);
// ✓ 支援 Date、RegExp、Map、Set、循環參考

// 方法 3：自己遞迴實作（面試愛考）
function deepClone(obj) {
  if (obj === null || typeof obj !== "object") return obj; // 基本型別直接回傳
  if (Array.isArray(obj)) return obj.map(deepClone);      // 陣列逐項遞迴
  return Object.fromEntries(
    Object.entries(obj).map(([k, v]) => [k, deepClone(v)])
  );
}

const deep3 = deepClone(original);
deep3.nested.b = 999;
console.log(original.nested.b); // 2 → 完全獨立 ✓
```

### 比較總表

| 方法                     | 類型  | 支援 Date/Fn | 循環參考 | 速度  |     |
| ---------------------- | --- | ---------- | ---- | --- | --- |
| `{ ...obj }`           | 淺   | -          | -    | 快   |     |
| `Object.assign`        | 淺   | -          | -    | 快   |     |
| `JSON.parse/stringify` | 深   | ❌          | ❌    | 中   |     |
| `structuredClone`      | 深   | ✓          | ✓    | 快   |     |
| 手寫遞迴                   | 深   | 視實作        | 視實作  | 視實作 |     |



# 深複製 vs 淺複製 - 實務筆記

## 一、風險：淺複製的坑

```
第一層: 深複製 ✓
第二層: 淺複製 → 共用 reference ← 這裡就是坑！
```

```javascript
const original = {
  user: "Yoga",
  profile: {          // ← 第一層拷貝，但 profile 仍是同一個物件
    skills: ["JS"]    // ← 第二層，完全沒拷貝
  }
};

const copy = { ...original };

copy.user = "new";     // ✓ original 不會變
copy.profile.skills.push("React");  // ❌ original 也變了！
```

---

## 二、實際處理方式

### 1. 統一用深複製（最保險）

```javascript
const copy = structuredClone(original);
// 或
const copy = JSON.parse(JSON.stringify(original));
```

### 2. 用 lodash

```javascript
import _ from "lodash";
const copy = _.cloneDeep(original);
```

### 3. 靠測試保護

```javascript
test("copy should be independent", () => {
  const original = { profile: { city: "Taipei" } };
  const copy = { ...original };
  
  copy.profile.city = "Kaohsiung";
  
  expect(original.profile.city).toBe("Taipei"); // 會失敗！← 及時發現
});
```

---

## 三、效能考量

### 各方法效能比較

| 方法 | 效能 | 適用場景 |
|------|------|----------|
| `spread {...}` | 最快 ⚡ | 確定只有一層 |
| `Object.assign()` | 快 | 同上 |
| `JSON.parse(JSON.stringify())` | 中等 | 一般物件，無函式/Map/Set |
| `structuredClone()` | 較慢 | 需要完整深複製 |
| 自製遞迴 | 取決於實作 | 特殊需求 |

### 權衡策略

```javascript
// 不要一律深複製，先用淺的
const copy = { ...original };

// 只有在確定要修改巢狀資料時，才做深複製
if (willModifyNested) {
  copy = structuredClone(original);
}
```

### 效能瓶頸時的選項

| 情境 | 建議 |
|------|------|
| 大資料數十萬筆 | 用 `structuredClone`，或考慮共享 |
| 高頻更新（每秒數十次） | 用淺複製 + 讀取時複製（copy-on-write） |
| 確定不改巢狀 | 用 spread，省下複製成本 |

---

## 四、簡單原則

```
效能優先 → 用淺複製
安全優先 → 用深複製
不確定 → 用淺複製 + 測試保護
```

---

## 五、常見深複製方法比較

| 方法 | 支援 Date | 支援 function | 效能 |
|------|-----------|---------------|------|
| `spread {...}` | ❌ | ❌ | 最快 |
| `Object.assign()` | ❌ | ❌ | 快 |
| `JSON.parse(JSON.stringify())` | ❌ 變字串 | ❌ 消失 | 中等 |
| `structuredClone()` | ✅ 保留 | ❌ 拋出錯誤 | 較慢 |
| 自製遞迴 | ✅ 可處理 | ✅ 可處理 | 取決於實作 |