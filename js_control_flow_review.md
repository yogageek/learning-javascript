# JavaScript 程式結構控制 複習筆記

> **學這個的意義**：async/await、Promise、事件循環是前端面試最高頻考點。同步/非同步沒搞清楚，框架裡的 API 呼叫、錯誤處理都會出問題。

---

## 一、重點地圖

```
程式結構控制
├── 條件 / 迴圈（基礎，快速帶過）
├── 例外處理 try/catch
├── 事件循環 Event Loop ← 面試核心
│   ├── Call Stack
│   ├── Macro Task（setTimeout, setInterval）
│   └── Micro Task（Promise.then, queueMicrotask）
└── 非同步控制
    ├── Callback → Promise → async/await（演進史）
    └── Promise 組合技（all / allSettled / race / any）
```

---

## 二、條件 & 迴圈（快速複習）

### 容易搞混：`==` vs `===`

```js
// === 嚴格相等：型別 + 值都要一樣
0 === false   // false
0 == false    // true  ← 自動型別轉換，避免使用

// 特例：永遠用 === 但 null 判斷可以用 ==
null == undefined  // true  ← 唯一建議用 == 的場合
null === undefined // false

// 短路運算（Short-circuit）
const name = user?.name ?? "Guest"; // ?. 可選串連, ?? nullish coalescing
// ?? 只有 null / undefined 才取右側（不像 || 把 0、"" 也排除）
0 || "default"   // "default" ← 0 是 falsy
0 ?? "default"   // 0         ← 0 不是 null/undefined
```

### 迴圈選哪個

```js
// for...of → 遍歷值（Array、Set、Map、String）
for (const val of [1, 2, 3]) { }

// for...in → 遍歷 key（Object，但會含原型鏈，小心使用）
for (const key in obj) {
  if (!Object.hasOwn(obj, key)) continue; // 過濾原型鏈屬性
}

// forEach → 無法 break；for...of 可以 break / continue / return
[1,2,3].forEach(x => { if (x===2) return; }); // return 只是跳過這次，不是停止

// while → 不確定次數
// do...while → 至少執行一次
```

---

## 三、例外處理

```js
// ── 基本結構 ──────────────────────────────────────
try {
  riskyOperation();
} catch (err) {
  console.error(err.message); // err.name / err.stack
} finally {
  cleanup(); // 一定執行，常用於關閉連線、釋放資源
}

// ── finally 的特殊行為 ────────────────────────────
function test() {
  try {
    return "try";       // 準備回傳
  } finally {
    return "finally";   // 覆蓋 try 的 return！
  }
}
test(); // "finally" ← 坑：finally 的 return 會蓋掉 try 的 return

// ── 選擇性 catch（只要 finally）──────────────────
try {
  riskyOperation();
} finally {
  cleanup(); // catch 可省略，只留 finally
}

// ── 重新拋出（re-throw）──────────────────────────
try {
  parse(data);
} catch (err) {
  if (err instanceof SyntaxError) {
    handleSyntaxError(err);  // 只處理認識的錯誤
  } else {
    throw err;               // 其他錯誤往上拋，不要吞掉
  }
}
```

---

## 四、事件循環（Event Loop）← 面試最核心

> **結論**：JS 是單執行緒，靠事件循環模擬並發。執行順序：**同步 → Micro Task → Macro Task**。

### 三個區域

```
Call Stack        ← 目前執行的程式
Micro Task Queue  ← Promise.then / queueMicrotask / MutationObserver
Macro Task Queue  ← setTimeout / setInterval / I/O / UI render
```

### 執行規則

```
1. 執行 Call Stack 直到清空
2. 清空所有 Micro Task（包括 micro task 中新增的 micro task）
3. 執行一個 Macro Task
4. 回到步驟 2
```

### 面試必考：輸出順序題

```js
console.log("1");                          // 同步

setTimeout(() => console.log("2"), 0);     // Macro Task

Promise.resolve()
  .then(() => console.log("3"))            // Micro Task
  .then(() => console.log("4"));           // Micro Task（上一個 then 完成後加入）

console.log("5");                          // 同步

// 輸出順序：1 → 5 → 3 → 4 → 2
// 解析：
// Call Stack:  "1", "5" （同步先跑完）
// Micro Task:  "3", "4" （Promise.then 全部清空）
// Macro Task:  "2"      （setTimeout 最後）
```

### 進階：async/await 的事件循環

```js
async function foo() {
  console.log("A");              // 同步
  await Promise.resolve();       // await 讓出執行權，後面的變 Micro Task
  console.log("B");              // Micro Task
}

console.log("X");
foo();
console.log("Y");

// 輸出：X → A → Y → B
// 解析：
// "X" 同步
// foo() 呼叫 → 印 "A" → 遇到 await，後面排進 Micro Task Queue，foo 暫停
// 回到主程式 → 印 "Y"
// Call Stack 清空 → 執行 Micro Task → 印 "B"
```

---

## 五、非同步：Callback → Promise → async/await

### Callback（舊寫法，了解即可）

```js
// Callback Hell：巢狀越深越難維護
fetchUser(id, (err, user) => {
  if (err) return handleError(err);
  fetchOrders(user.id, (err, orders) => {
    if (err) return handleError(err);
    fetchDetails(orders[0], (err, detail) => {
      // 再深一層...
    });
  });
});
```

### Promise

```js
// 三種狀態：pending → fulfilled / rejected（狀態只轉一次，不可逆）

const p = new Promise((resolve, reject) => {
  // 非同步操作
  setTimeout(() => {
    Math.random() > 0.5
      ? resolve("成功資料")
      : reject(new Error("失敗"));
  }, 1000);
});

p.then(data => console.log(data))   // fulfilled
 .catch(err => console.error(err))  // rejected
 .finally(() => console.log("完成")); // 無論成功失敗都執行

// Promise Chain（解決 callback hell）
fetchUser(id)
  .then(user => fetchOrders(user.id))   // 回傳 Promise，繼續 chain
  .then(orders => fetchDetails(orders[0]))
  .then(detail => console.log(detail))
  .catch(err => console.error(err));    // 任一步驟出錯都在這裡攔截
```

### async/await（現代寫法）

```js
// async 函式永遠回傳 Promise
// await 只能在 async 函式內使用

async function loadUserData(id) {
  try {
    const user    = await fetchUser(id);         // 等待，暫停函式
    const orders  = await fetchOrders(user.id);
    const detail  = await fetchDetails(orders[0]);
    return detail;                               // 自動包成 fulfilled Promise
  } catch (err) {
    console.error(err);                          // 任一 await 失敗都在這裡
    throw err;                                   // 記得往上拋，讓呼叫端知道失敗
  }
}

// 呼叫端
loadUserData(1)
  .then(detail => console.log(detail))
  .catch(err => console.error(err));

// 或用 async IIFE
(async () => {
  const detail = await loadUserData(1);
})();
```

---

## 六、Promise 組合技（面試必考）

```js
const p1 = fetchUser(1);    // 1秒
const p2 = fetchUser(2);    // 2秒
const p3 = fetchUser(3);    // 3秒

// ── Promise.all ────────────────────────────────────
// 全部成功才 resolve，一個失敗就立即 reject
const [u1, u2, u3] = await Promise.all([p1, p2, p3]);
// 總耗時 3 秒（最慢的），不是 1+2+3=6 秒（並行！）

// ── Promise.allSettled ─────────────────────────────
// 全部完成（不管成功失敗），不會 reject
const results = await Promise.allSettled([p1, p2, p3]);
results.forEach(r => {
  if (r.status === "fulfilled") console.log(r.value);
  if (r.status === "rejected")  console.log(r.reason);
});
// 適合：「發出多個請求，有幾個成功算幾個」的場景

// ── Promise.race ───────────────────────────────────
// 第一個完成（不管成功失敗）就 resolve/reject
const fastest = await Promise.race([p1, p2, p3]);
// 適合：timeout 機制
const withTimeout = await Promise.race([
  fetch("/api/data"),
  new Promise((_, reject) =>
    setTimeout(() => reject(new Error("Timeout")), 5000)
  )
]);

// ── Promise.any ────────────────────────────────────
// 第一個成功就 resolve；全部失敗才 reject（AggregateError）
const firstSuccess = await Promise.any([p1, p2, p3]);
// 適合：多個備援來源，取第一個成功的
```

### 四種比較表

| 方法 | resolve 時機 | reject 時機 | 回傳 |
|---|---|---|---|
| `all` | 全部成功 | 任一失敗 | 結果陣列（同順序） |
| `allSettled` | 全部完成 | 永不 reject | `{status, value/reason}[]` |
| `race` | 第一個完成 | 第一個失敗 | 第一個的結果 |
| `any` | 第一個成功 | 全部失敗 | 第一個成功的結果 |

---

## 七、容易搞混的地方

### 坑 1：`await` 沒有並行，連續 await 是串行

```js
// ❌ 串行：總耗時 1+2+3 = 6 秒
const u1 = await fetchUser(1); // 等 1 秒
const u2 = await fetchUser(2); // 再等 2 秒
const u3 = await fetchUser(3); // 再等 3 秒

// ✓ 並行：總耗時 3 秒（最慢的）
const [u1, u2, u3] = await Promise.all([
  fetchUser(1),
  fetchUser(2),
  fetchUser(3)
]);
```

### 坑 2：`async` 函式永遠回傳 Promise

```js
async function getValue() { return 42; }

getValue();        // Promise { 42 }，不是 42
getValue() === 42; // false
await getValue();  // 42 ← 要加 await
```

### 坑 3：Promise catch 後繼續 then

```js
Promise.reject("error")
  .catch(err => {
    console.log("caught:", err); // 執行
    return "recovered";          // catch 也可以回傳值
  })
  .then(val => console.log(val)); // "recovered" ← catch 後繼續 chain
```

### 坑 4：`forEach` 裡用 `async/await` 無效

```js
// ❌ forEach 不等待 async callback
const results = [];
[1, 2, 3].forEach(async (id) => {
  const data = await fetchUser(id); // forEach 不管這個 Promise
  results.push(data);
});
console.log(results); // [] ← 空的，非同步還沒完成

// ✓ 改用 Promise.all + map
const results = await Promise.all(
  [1, 2, 3].map(id => fetchUser(id))
);

// ✓ 或用 for...of（需要串行時）
for (const id of [1, 2, 3]) {
  const data = await fetchUser(id);
  results.push(data);
}
```

### 坑 5：未處理的 Promise rejection

```js
// 沒有 .catch 或 try/catch → unhandledRejection，可能讓 Node.js crash
async function bad() {
  throw new Error("oops"); // 回傳 rejected Promise，但沒人處理
}
bad(); // ❌ UnhandledPromiseRejection

// ✓ 永遠處理 rejection
bad().catch(console.error);
// 或
try { await bad(); } catch(e) { console.error(e); }
```

### 坑 6：`setTimeout(fn, 0)` 不等於「立刻」

```js
// 0ms 只是「盡快，但在 Micro Task 之後」
setTimeout(() => console.log("macro"), 0);
Promise.resolve().then(() => console.log("micro"));
// 輸出：micro → macro
// setTimeout 最快也是在 Micro Task 清空後才執行
```

---

## 八、面試必考題

### Q1：輸出什麼？（Event Loop 核心）

```js
console.log("start");

setTimeout(() => console.log("timeout"), 0);

Promise.resolve()
  .then(() => {
    console.log("p1");
    return Promise.resolve(); // 多包一層 Promise
  })
  .then(() => console.log("p2"));

console.log("end");

// 答案：start → end → p1 → p2 → timeout
// 關鍵：return Promise.resolve() 讓 p2 多等一輪 micro task（v8 引擎行為）
```

### Q2：實作 `sleep(ms)`（async 版）

```js
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function demo() {
  console.log("start");
  await sleep(1000);        // 等 1 秒
  console.log("1秒後");
}
```

### Q3：實作 Promise 限流（面試進階）

```js
// 同時最多 limit 個 Promise 並行
async function asyncPool(limit, tasks) {
  const results = [];
  const running = [];

  for (const task of tasks) {
    const p = Promise.resolve().then(() => task()); // 建立 Promise
    results.push(p);

    if (limit <= tasks.length) {
      // 完成後從 running 移除
      const cleanup = p.then(() => running.splice(running.indexOf(cleanup), 1));
      running.push(cleanup);
      if (running.length >= limit) await Promise.race(running); // 等待最快完成的
    }
  }

  return Promise.all(results);
}
```

### Q4：Promise.all 如果其中一個失敗，其他的還會執行嗎？

> Promise 一旦發出就無法取消。`Promise.all` 在第一個 reject 時立刻 reject，但其他 Promise **仍然在執行**，只是結果被忽略。要取得所有結果（含失敗）用 `Promise.allSettled`。

### Q5：`async function` 的回傳值是什麼？

```js
async function fn() { return 1; }
// 等同於
function fn() { return Promise.resolve(1); }

// 如果 throw
async function fn2() { throw new Error("x"); }
// 等同於
function fn2() { return Promise.reject(new Error("x")); }
```

### Q6：以下程式碼有什麼問題？

```js
async function getAll() {
  const a = await fetchA(); // 等 fetchA 完
  const b = await fetchB(); // 再等 fetchB
  return [a, b];
}
```

> 串行，浪費時間。若 fetchA 和 fetchB 互不依賴，改為 `await Promise.all([fetchA(), fetchB()])`，並行執行。

### Q7：解釋 Micro Task 和 Macro Task 的差別，各舉兩個例子

> Micro Task（Promise.then、queueMicrotask）：Call Stack 清空後**立刻**、全部執行完才進入下一輪。  
> Macro Task（setTimeout、setInterval）：每次事件循環只執行**一個**，執行完後先處理所有 Micro Task，再取下一個 Macro Task。

---

## 九、關鍵思考點 & 回顧

| 概念 | 一句話記憶 |
|---|---|
| Event Loop 順序 | 同步 → Micro Task（全清）→ 一個 Macro Task → 重複 |
| Promise 狀態 | pending → fulfilled/rejected，一次性，不可逆 |
| async/await | 語法糖，await 把後面的變 Micro Task |
| 連續 await | 串行！要並行用 `Promise.all` |
| forEach + async | forEach 不等 async，改用 `Promise.all([].map(...))` |
| `Promise.all` | 全成功才成功，一失敗全失敗 |
| `Promise.allSettled` | 不管成敗，全部跑完才結束 |

**底層邏輯統一理解**：

async/await 不是真的多執行緒，是**協作式讓出（cooperative yielding）**。`await` 的本質是「我先讓出 Call Stack，等這個 Promise 結束再把我剩下的程式放回 Micro Task Queue」。Event Loop 只是不斷問：「Call Stack 空了嗎？有 Micro Task 嗎？有 Macro Task 嗎？」這個循環就是 JS 並發的全部秘密。
