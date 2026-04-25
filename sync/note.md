## Event Loop 考試重點筆記

### 一、核心概念

> **Event Loop 是 JavaScript 的非同步機制**，讓 JS 能在單執行緒中處理非同步操作（計時器、網路請求、事件監聽等），避免阻塞主執行緒。

---

### 二、JavaScript 運作環境對照表

| 組件 | 說明 | 例如 |
|------|------|------|
| **Call Stack**（呼叫堆疊） | 存放正在執行的函式（LIFO 後進先出） | `function a() { b(); }` |
| **Web APIs** | 瀏覽器提供的非同步功能 | `setTimeout`、`fetch`、`addEventListener` |
| **Task Queue**（回調佇列／巨集任務佇列） | 存放待執行的回調函式 | `setTimeout`、`setInterval` 的回調 |
| **Microtask Queue**（微任務佇列） | 優先級更高的任務佇列 | `Promise.then`、`MutationObserver`、`queueMicrotask` |
| **Event Loop** | 不斷檢查 Call Stack 是否為空，然後從佇列拉任務執行 | 協調者角色 |

---

### 三、執行優先順序（必考！）

```
Call Stack 清空
    ↓
先清空 Microtask Queue（全部！）
    ↓
拿一個 Task Queue 的任務進 Call Stack
    ↓
重複以上步驟
```

| 任務類型 | 佇列 | 優先級 |
|----------|------|--------|
| `Promise.then()`、`catch()`、`finally()` | Microtask Queue | **最高** |
| `queueMicrotask()` | Microtask Queue | **最高** |
| `MutationObserver` | Microtask Queue | **最高** |
| `setTimeout`、`setInterval` | Task Queue | 中等 |
| `setImmediate`（Node.js） | Task Queue | 中等 |
| `I/O` 操作 | Task Queue | 中等 |
| `requestAnimationFrame` | 特殊（動畫幀） | 在重繪前執行 |
| `console.log`、同步程式碼 | Call Stack（立即執行） | 最高（當下） |

---

### 四、經典考題範例

#### 題型 1：基本順序

```javascript
console.log("1");

setTimeout(() => {
    console.log("2");
}, 0);

Promise.resolve().then(() => {
    console.log("3");
});

console.log("4");

// 輸出順序：1 → 4 → 3 → 2
```

**解題步驟：**
1. 同步：`console.log("1")` → 輸出 `1`
2. `setTimeout` → 進 Task Queue
3. `Promise.then` → 進 Microtask Queue
4. 同步：`console.log("4")` → 輸出 `4`
5. Call Stack 清空 → 先清 Microtask Queue → 輸出 `3`
6. 再從 Task Queue 拿 `setTimeout` 執行 → 輸出 `2`

---

#### 題型 2：巢狀 Promise

```javascript
Promise.resolve()
    .then(() => {
        console.log("A");
        setTimeout(() => console.log("B"), 0);
    })
    .then(() => {
        console.log("C");
    });

setTimeout(() => console.log("D"), 0);

console.log("E");

// 輸出順序：E → A → C → D → B
```

**流程圖解：**
- 同步：`E`
- Microtask：第一個 `.then()` → 輸出 `A`，再將 `setTimeout` 送進 Task Queue
- 同一輪 Microtask 繼續：第二個 `.then()` → 輸出 `C`
- Microtask 清空 → 從 Task Queue 拿 `D`（2ms 的計時器早到了）→ 輸出 `D`
- 再從 Task Queue 拿 `B` → 輸出 `B`

---

#### 題型 3：async/await 陷阱

```javascript
async function test() {
    console.log("1");
    await console.log("2");  // await 後面的程式碼會變成微任務
    console.log("3");
}

console.log("4");
test();
console.log("5");

// 輸出順序：4 → 1 → 2 → 5 → 3
```

> 💡 **關鍵記憶**：`await` 後面的程式碼（`console.log("3")`）會被包裝成微任務等待執行。

---

#### 題型 4：微任務中產生更多微任務

```javascript
Promise.resolve().then(() => {
    console.log("1");
    Promise.resolve().then(() => {
        console.log("2");
    });
}).then(() => {
    console.log("3");
});

// 輸出順序：1 → 2 → 3
```

> ⚠️ **考點**：微任務佇列會**全部清空**才結束，過程中新加的微任務也會在**同一輪**執行完。

---

#### 題型 5：setTimeout 與 Promise 混和

```javascript
setTimeout(() => console.log("A"), 100);
setTimeout(() => console.log("B"), 0);

Promise.resolve().then(() => console.log("C"));

console.log("D");

// 輸出順序：D → C → B → A
```

---

### 五、考題陷阱整理

| 陷阱 | 說明 | 正確理解 |
|------|------|----------|
| `setTimeout(fn, 0)` 不是立即執行 | 即使延遲 0ms，也要等 Call Stack 空 + Microtask 清完 | 至少等一個 Event Loop 迭代 |
| `await` 讓出執行權 | `await` 後的程式碼變成微任務 | 不是暫停整個程式，是重排順序 |
| 微任務可以產生更多微任務 | 會在同一輪全部執行完 | 可能導致 Task Queue 飢餓 |
| `Promise` 的 executor 是同步的 | `new Promise((resolve) => { console.log("hi"); })` | executor 立即執行，`.then()` 才是微任務 |

---

### 六、流程圖記憶版

```
┌─────────────────────────────────────────┐
│           開始執行同步程式碼              │
│         （Call Stack 逐一執行）           │
└─────────────────┬───────────────────────┘
                  ▼
        ┌─────────────────┐
        │ Call Stack 空了？│
        └────────┬────────┘
                 │ 是
                 ▼
        ┌─────────────────┐
        │ Microtask Queue │ ──→ 全部執行直到清空
        │   有任務嗎？     │
        └────────┬────────┘
                 │ 否
                 ▼
        ┌─────────────────┐
        │  Task Queue      │ ──→ 取「一個」任務
        │   有任務嗎？     │      放進 Call Stack
        └────────┬────────┘
                 │ 是
                 ▼
        ┌─────────────────┐
        │  執行該任務       │
        └─────────────────┘
                 │
                 └──→ 回到「Call Stack 空了？」繼續
```

---

### 七、口訣記憶

> **同步先跑，微任務清光，巨集再一個**  
> **await 後面變微任務，計時器再快也要排隊**  
> **Promise 本體立刻跑，then 才是微任務**  
> **微任務無限加，任務佇列等到哭**

---

### 八、考前快速檢查表

- [ ] 知道 Call Stack、Web API、Task Queue、Microtask Queue 的角色
- [ ] 面試考題的輸出順序：
  - 同步程式碼先輸出
  - `Promise.then` 比 `setTimeout(fn, 0)` 早
  - `await` 後面的程式碼是微任務
- [ ] 知道 `new Promise` 的 executor 是同步的
- [ ] 知道微任務可以一直產生微任務（可能導致畫面卡頓）
- [ ] 知道 `setTimeout(fn, 0)` 無法保證立即執行
- [ ] 知道 `requestAnimationFrame` 與 Event Loop 的關係（在重繪前執行，但不在 Microtask 之後立即執行）

---

### 九、實作題預測

```javascript
// 寫出以下程式碼的輸出順序
async function async1() {
    console.log("async1 start");
    await async2();
    console.log("async1 end");
}

async function async2() {
    console.log("async2");
}

console.log("script start");

setTimeout(() => {
    console.log("setTimeout");
}, 0);

async1();

new Promise((resolve) => {
    console.log("promise1");
    resolve();
}).then(() => {
    console.log("promise2");
});

console.log("script end");

// 答案：
// script start
// async1 start
// async2
// promise1
// script end
// async1 end
// promise2
// setTimeout
```

> 建議自己執行一遍驗證！