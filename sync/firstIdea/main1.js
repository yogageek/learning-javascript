



// ============================================================
// JS 同步 vs 非同步 最小學習範例
// 核心概念：JS 是單執行緒，靠 Event Loop 處理非同步
// ============================================================


// ── 1. 同步 vs 非同步 基本對比 ──────────────────────────────

console.log("A - 同步，馬上執行");

setTimeout(() => {
  console.log("B - 非同步，丟給瀏覽器計時，時間到才進 Queue");
}, 1000);

console.log("C - 同步，不等 B");

// 輸出順序：A → C → B
// 關鍵：setTimeout 不是「等 1 秒」，是「1 秒後把 callback 放入 Queue」


// ── 2. Event Loop 示意 ────────────────────────────────────────
//
//  Call Stack（執行中）
//      ↓ 執行完畢
//  Web API（setTimeout / fetch / DOM event 在這裡等）
//      ↓ 完成後
//  Callback Queue（排隊等）
//      ↓ Call Stack 空了，Event Loop 才搬過來執行
//  Call Stack（再次執行）


// ── 3. setInterval ───────────────────────────────────────────

const timer = setInterval(() => {
  console.log("每 500ms 執行一次");
}, 500);

setTimeout(() => {
  clearInterval(timer); // 2 秒後停止，否則永遠跑
  console.log("interval 停止");
}, 2000);


// ── 4. Callback 寫法（地獄版警示）───────────────────────────

function fetchData(callback) {
  setTimeout(() => {
    callback(null, { id: 1, name: "Yoga" }); // 模擬 API 回傳
  }, 500);
}

fetchData((err, data) => {
  if (err) return console.error(err);
  console.log("Callback 拿到資料：", data);

  // 若需要再發一次請求 → 往內縮排 → Callback Hell
  fetchData((err2, data2) => {
    console.log("Callback Hell 開始...", data2);
  });
});


// ── 5. Promise 寫法（解決 Callback Hell）────────────────────

function fetchDataPromise() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const success = true;
      if (success) {
        resolve({ id: 1, name: "Yoga" }); // 成功 → .then()
      } else {
        reject(new Error("失敗了"));      // 失敗 → .catch()
      }
    }, 500);
  });
}

fetchDataPromise()
  .then(data => {
    console.log("Promise 拿到：", data);
    return fetchDataPromise(); // 鏈式，不再巢狀縮排
  })
  .then(data2 => {
    console.log("Promise 第二次：", data2);
  })
  .catch(err => {
    console.error("Promise 錯誤：", err);
  });


// ── 6. Async/Await 寫法（Promise 的語法糖）──────────────────

async function main() {
  try {
    // await 會「暫停這個 async function」等 Promise resolve
    // 但不會卡住 Call Stack，其他程式照跑
    const data = await fetchDataPromise();
    console.log("Async/Await 拿到：", data);

    const data2 = await fetchDataPromise(); // 像同步一樣直覺
    console.log("Async/Await 第二次：", data2);

  } catch (err) {
    console.error("Async/Await 錯誤：", err); // 對應 .catch()
  }
}

main();


// ── 7. 並行執行（Promise.all）────────────────────────────────

async function parallel() {
  // 同時發出，等全部完成（不是依序等）
  const [a, b] = await Promise.all([
    fetchDataPromise(),
    fetchDataPromise(),
  ]);
  console.log("並行結果：", a, b);
  // 比依序 await 快一倍
}

parallel();