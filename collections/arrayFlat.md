1. `flat(n)` 用來把「巢狀陣列攤平」。
2. `2` 代表最多展平兩層巢狀。
3. 例如 `[1,[2,[3]]]` 會被攤平成 `[1,2,3]`（兩層內）。
4. 預設 `flat(1)` 只攤一層。
5. `flat` 不會改原陣列，會回傳新陣列。
6. `flatMap` = 先 `map` 再 `flat(1)`。
7. `x => [x, x * 2]` 會讓每個元素變成一個小陣列。
8. 所以結果會自動被攤平成一層。
9. `flatMap` 通常用在「展開 + 轉換資料」。
10. 差別：`flatMap` 只能展平一層，`flat(n)` 可自訂層數。
11. `flat(2)` 比 `flat(1)` 多處理一層巢狀結構。
12. 如果陣列很深（多層 array），要用更大的 n 或 `Infinity`。
13. `flat()` 主要解決「array 裡面還有 array」的問題。
14. `flatMap()` 等於「一次做轉換 + 攤平」。
15. 不能用 `flatMap` 做多層攤平，只能一層。
16. `map + flat(1)` 可以被 `flatMap` 取代（更簡潔）。
17. `flat` 會跳過空位（sparse array）。
18. 常見用法：資料整理、API 回傳結構扁平化。
19. `flatMap` 很常用在「一對多轉換」。
20. 核心：flat = 攤平，flatMap = 攤平 + 轉換。



# Array.flat / flatMap 筆記

---

## 1. flat(n)（攤平陣列）

### 作用
把「巢狀陣列」展平成一個平面陣列。

---

### 語法
```js
arr.flat(depth)
````

* `depth`：要攤平幾層（預設 1）

---

### 範例

```js
const arr = [1, [2, [3, 4]]];

const result = arr.flat(2);

console.log(result);
// [1, 2, 3, 4]
```

---

### 註解

* 第一層：[1, [2, [3,4]]]
* flat(1) → 變 [1, 2, [3,4]]
* flat(2) → 再往下一層 → [1, 2, 3, 4]

---

## 2. flatMap（map + flat(1)）

### 作用

先做 map，再自動攤平一層。

---

### 語法

```js
arr.flatMap(callback)
```

---

### 範例

```js
const arr = [1, 2, 3];

const result = arr.flatMap(x => [x, x * 2]);

console.log(result);
// [1, 2, 2, 4, 3, 6]
```

---

### 註解

每個元素流程：

* 1 → [1, 2]
* 2 → [2, 4]
* 3 → [3, 6]

最後自動 flat(1)：
→ [1,2,2,4,3,6]

---

## 3. map vs flatMap

### map（不攤平）

```js
[1, 2, 3].map(x => [x, x * 2]);
// [[1,2],[2,4],[3,6]]
```

---

### flatMap（攤平一層）

```js
[1, 2, 3].flatMap(x => [x, x * 2]);
// [1,2,2,4,3,6]
```

---

## 4. 重點整理

* flat(n) → 專門「攤平陣列」
* flatMap → 「map + 自動攤平一層」
* flatMap 不能控制多層，只固定 1 層
* 常用在資料轉換 / API 整理

---

## 一句話記憶

* flat = 壓平結構
* flatMap = 轉換 + 壓平一層

```
```
###### flat（攤平）

arr.flat(2);                  // 攤平成 2 層

---

###### flatMap（map + flat(1)）

arr.flatMap(x => [x, x * 2]); // 先 map 再自動攤平一層