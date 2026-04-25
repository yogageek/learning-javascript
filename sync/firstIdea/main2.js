// ============================================================
// JS 同步 vs 非同步 - SPY×FAMILY 間諜行動版
// 核心：單執行緒靠 Event Loop 協調多個任務
// ============================================================

// 1995 Callback：解決「A 完成才做 B」
// 2015 Promise：解決「Callback 太醜」
// 2017 Async/Await：解決「Promise 不夠直覺」

// 2. 三種寫法如何傳遞 floorCode
// Callback：
hackDoor((err, floorCode) => {
  locate(floorCode, ...) // floorCode 在 callback 參數裡
})

// Callback 版（巢狀）
function rescueCallback() {
  console.log("【Callback】黃昏開始行動");
  infiltrateMission(1, (err, data) => {
    infiltrateMission(2, (err, data) => {
      infiltrateMission(3, (err, data) => {
        console.log("【Callback】安妮亞救出！（但程式碼很醜）");
      });
    });
  });
}

// Promise：
hackDoor()
  .then(floorCode => {     // floorCode 在 .then 參數裡
    return locate(floorCode)
  })
// Async/Await：
floorCode = await hackDoor(); // floorCode 就是普通變數
locate(floorCode)


// ── 1. 同步 vs 非同步：安妮亞的日常 ──────────────────────────

console.log("🎀 安妮亞：起床！");

setTimeout(() => {
  console.log("🥜 安妮亞：花生零食送達！（外送員跑腿中）");
}, 2000);

console.log("📚 安妮亞：先去上學，不等花生");

// 輸出：起床 → 上學 → 花生送達
// 關鍵：setTimeout 像「委託外送員」，不是「站在門口等 2 秒」


// ── 2. Event Loop 間諜行動示意圖 ──────────────────────────
//
//  【總部指揮室 Call Stack】正在執行的任務
//        ↓ 任務完成
//  【外勤探員 Web API】情報蒐集/監聽中（setTimeout/fetch/事件）
//        ↓ 情報到手
//  【情報待處理區 Queue】排隊等總部空閒
//        ↓ 總部清空，Event Loop 搬運
//  【總部指揮室 Call Stack】處理新情報


// ── 3. setInterval：約兒的定期任務 ────────────────────────

const assassinMission = setInterval(() => {
  console.log("🔪 約兒：每晚巡邏（500ms 一次）");
}, 500);

setTimeout(() => {
  clearInterval(assassinMission);
  console.log("🌙 約兒：今晚任務結束");
}, 2500);

// 輸出：巡邏 × 4 次 → 任務結束


// ── 4. Callback Hell：黃昏的多層偽裝 ───────────────────────

function infiltrateMission(depth, callback) {
  setTimeout(() => {
    console.log(`🕵️ 黃昏：突破第 ${depth} 層偽裝`);
    callback(null, `第 ${depth} 層情報`);
  }, 300);
}

console.log("\n--- Callback 地獄示範 ---");
infiltrateMission(1, (err, intel1) => {
  console.log(`📋 ${intel1}`);
  
  infiltrateMission(2, (err, intel2) => {
    console.log(`📋 ${intel2}`);
    
    infiltrateMission(3, (err, intel3) => {
      console.log(`📋 ${intel3} → 💀 縮排地獄開始`);
      // 再深入就完全看不懂了...
    });
  });
});


// ── 5. Promise：WISE 情報鏈式傳遞 ────────────────────────────

function gatherIntel(agent) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const success = Math.random() > 0.1; // 90% 成功率
      if (success) {
        resolve(`${agent} 的情報包`);
      } else {
        reject(new Error(`${agent} 任務失敗`));
      }
    }, 400);
  });
}

console.log("\n--- Promise 鏈式行動 ---");
gatherIntel("🕵️ 黃昏")
  .then(intel1 => {
    console.log(`✅ ${intel1}`);
    return gatherIntel("🔪 約兒"); // 不巢狀，往下鏈
  })
  .then(intel2 => {
    console.log(`✅ ${intel2}`);
    return gatherIntel("🎀 安妮亞（讀心）");
  })
  .then(intel3 => {
    console.log(`✅ ${intel3} → 任務成功！`);
  })
  .catch(err => {
    console.error(`❌ ${err.message}`);
  });


// ── 6. Async/Await：黃昏的任務報告（最直覺）───────────────────

async function executeOperation() {
  console.log("\n--- Async/Await 行動 ---");
  
  try {
    console.log("🕵️ 黃昏：開始執行 Operation Strix");
    
    // await 讓這個 function 內部「看起來同步」
    const intel1 = await gatherIntel("🕵️ 黃昏");
    console.log(`📥 ${intel1}`);
    
    const intel2 = await gatherIntel("🔪 約兒");
    console.log(`📥 ${intel2}`);
    
    const intel3 = await gatherIntel("🎀 安妮亞");
    console.log(`📥 ${intel3}`);
    
    console.log("🎯 Operation Strix 完成！");
    
  } catch (err) {
    console.error(`💥 行動失敗：${err.message}`);
  }
}

executeOperation();
// 其他程式碼照跑，不會被卡住


// ── 7. Promise.all：Forger 一家並行出動 ────────────────────────

async function familyMission() {
  console.log("\n--- 並行任務示範 ---");
  console.log("👨‍👩‍👧 Forger 一家同時出發！");
  
  const startTime = Date.now();
  
  // 錯誤示範（串行，慢）：
  // const a = await gatherIntel("🕵️ 黃昏");  // 等 400ms
  // const b = await gatherIntel("🔪 約兒");  // 再等 400ms  → 總共 800ms
  
  // 正確示範（並行，快）：
  const [loid, yor, anya] = await Promise.all([
    gatherIntel("🕵️ 黃昏"),
    gatherIntel("🔪 約兒"),
    gatherIntel("🎀 安妮亞"),
  ]);
  // 三個同時發出，只等最慢的那個 → 總共 400ms
  
  const elapsed = Date.now() - startTime;
  
  console.log(`✅ ${loid}`);
  console.log(`✅ ${yor}`);
  console.log(`✅ ${anya}`);
  console.log(`⏱️  總耗時：${elapsed}ms（並行比串行快 3 倍）`);
}

familyMission();


// ── 8. 終極對比：三種寫法處理同一任務 ────────────────────────

console.log("\n=== 三種寫法對比：救出安妮亞 ===\n");

// Callback 版（巢狀）
function rescueCallback() {
  console.log("【Callback】黃昏開始行動");
  infiltrateMission(1, (err, data) => {
    infiltrateMission(2, (err, data) => {
      infiltrateMission(3, (err, data) => {
        console.log("【Callback】安妮亞救出！（但程式碼很醜）");
      });
    });
  });
}

// Promise 版（鏈式）
function rescuePromise() {
  console.log("【Promise】黃昏開始行動");
  return gatherIntel("第 1 關")
    .then(() => gatherIntel("第 2 關"))
    .then(() => gatherIntel("第 3 關"))
    .then(() => console.log("【Promise】安妮亞救出！（清楚多了）"));
}

// Async/Await 版（最直覺）
async function rescueAsync() {
  console.log("【Async/Await】黃昏開始行動");
  await gatherIntel("第 1 關");
  await gatherIntel("第 2 關");
  await gatherIntel("第 3 關");
  console.log("【Async/Await】安妮亞救出！（像寫同步一樣簡單）");
}

// <!-- ---

// ## 改寫重點

// ### 結論先行
// **三個核心改動讓教學更明顯：**
// 1. **角色對應機制** - 黃昏(主線任務)、約兒(定期任務)、安妮亞(非同步等待)
// 2. **對比強化** - 第 8 節直接呈現三種寫法處理同一任務
// 3. **視覺化輸出** - emoji + 耗時數字，看到並行快 3 倍

// ### 細節拆解

// **1. 同步 vs 非同步（安妮亞日常）**
// - 原版抽象的 A/B/C → 改成「起床→上學→等花生」生活場景
// - `setTimeout` 從「計時器」變「外送員」，更好理解「委託他人」

// **2. Event Loop（間諜組織架構）**
// - Call Stack = 總部指揮室
// - Web API = 外勤探員
// - Queue = 情報待處理區
// - 對應到 SPY×FAMILY 的 WISE 情報網

// **3. setInterval（約兒的夜間任務）**
// - 原版無意義的 console.log → 約兒的定期巡邏
// - 輸出次數明確（4 次），展示 `clearInterval` 效果

// **4. Callback Hell（黃昏的多層偽裝）**
// - `depth` 參數視覺化「一層層深入」
// - 第 3 層直接標註「縮排地獄」，問題立刻可見

// **5. Promise 鏈（WISE 情報鏈）**
// - 三個探員依序回報，展示 `.then()` 鏈式結構
// - 加入 90% 成功率，`.catch()` 不再是擺設

// **6. Async/Await（任務報告）**
// - "Operation Strix" 呼應動畫主線
// - `try/catch` 對應真實任務失敗場景

// **7. Promise.all（一家出動）**
// - **關鍵改動**：註解對比「錯誤串行 800ms vs 正確並行 400ms」
// - `Date.now()` 實際測量時間，數字化呈現效能差異

// **8. 終極對比（新增）**
// - 三個 function 解決同一問題
// - 程式碼排在一起，優劣立刻可見

// ### 底層邏輯深化

// **Event Loop 的間諜隱喻為何有效？**
// - 間諜組織 = 分散式協作，不會「傻等」
// - 總部（主執行緒）派任務給外勤（Web API）
// - 外勤完成回報到待處理區（Queue）
// - 總部空了才處理回報（Event Loop 機制）

// **三種寫法本質：**
// ```
// Callback  → 嵌套函數，控制流靠縮排
// Promise   → 狀態機，控制流靠 .then 鏈
// Async/Await → Promise 的語法糖，控制流回歸線性
// ```

// ### 關鍵思考點回顧

// 1. **`await` 不卡全局** - 黃昏在等情報時，約兒照樣巡邏
// 2. **串行 vs 並行** - 依序 `await` 像「排隊進門」，`Promise.all` 像「三人同時破窗」
// 3. **async function 永遠回傳 Promise** - `executeOperation()` 本身可被外層 `await`
// 4. **錯誤處理** - Callback 要每層檢查 `err`，Promise 只需一個 `.catch()`，Async/Await 用 `try/catch`

// **最核心的頓悟：**
// 非同步不是「慢慢等」，是「交給別人做，我繼續幹別的」。 -->