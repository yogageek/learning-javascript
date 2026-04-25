const line = "=".repeat(70);

// 印出分隔線和標題，讓每個練習區塊更容易閱讀
function section(title) {
  console.log(`\n${line}`);
  console.log(title);
  console.log(line);
}

// 統一顯示資料的格式
// 這樣每次觀察 original 和 copy 時，畫面會比較整齊
function show(label, value) {
  console.log(`${label}:`, value);
}

// 建立一份測試資料
// 這裡刻意混合:
// 1. 基本型別: user、score、isActive
// 2. 巢狀物件: profile、meta
// 3. 陣列: skills、tags
// 4. 特殊物件: Date
// 這樣才能一次觀察淺複製和深複製的差異
function createSampleData() {
  return {
    user: "Yoga",
    score: 88,
    profile: {
      city: "Taipei",
      skills: ["JavaScript", "HTML"],
    },
    tags: ["frontend", "practice"],
    createdAt: new Date("2026-04-26T10:00:00"),
    meta: {
      isActive: true,
    },
  };
}

// 自製深複製函式
// 這個版本不是最完整的萬用 deep clone，
// 但很適合學習「遞迴複製」的核心觀念
function deepCloneRecursive(value) {
  // 如果是基本型別或 null，就直接回傳
  // 因為它們本來就不是靠 reference 共用內部內容
  if (value === null || typeof value !== "object") return value;

  // Date 不能只當一般物件處理
  // 要建立新的 Date 實例，並把時間戳記複製過去
  if (value instanceof Date) return new Date(value.getTime());

  // 如果是陣列，就逐項遞迴複製
  // 每個元素都再次進入 deepCloneRecursive
  // 為什麼要判斷陣列？因為陣列在 JS 裡 typeof [] === "object"，不判斷的話會被當成一般物件處理
  if (Array.isArray(value)) return value.map(deepCloneRecursive);


  // 一般物件: 建立新物件，再逐個 key 遞迴複製
  // 為什麼建立新物件 {}？因為目標是「切斷 reference」，不能直接指向原物件：
  const result = {};
  for (const key of Object.keys(value)) {
    result[key] = deepCloneRecursive(value[key]);//
  }
  return result;
  
  // 下次撰寫這類函式的思路
  // 先處理「不需要做事」的情況（base case）→ 直接 return
  // 列出所有需要特殊處理的型別（Date、RegExp、Map…）
  // 剩下的走通用邏輯（建新容器 + 遞迴填入）
}

// 比較 original 和 copy 是否共用同一份 reference
// 這是判斷深複製 / 淺複製最核心的觀察點之一
function compareRefs(original, copy, label) {
  console.log(`\n[${label}] reference checks`);

  // 最外層物件是否為同一個
  // 只要是複製，通常這裡都會是 false
  console.log("original === copy:", original === copy);

  // 巢狀物件是否仍共用 reference
  // 如果這裡是 true，代表不是完整深複製
  console.log("original.profile === copy.profile:", original.profile === copy.profile);

  // 陣列是否仍共用 reference
  console.log("original.tags === copy.tags:", original.tags === copy.tags);
}

function runSpreadPractice() {
  section("1. Shallow copy with spread syntax");

  const original = createSampleData();

  // spread syntax 只會複製第一層
  // 也就是說:
  // - score 這種基本型別會被複製成新的值
  // - profile、tags 這種 reference type 仍指向原本的內部資料
  const copy = { ...original };

  compareRefs(original, copy, "spread");

  // 先看修改前的狀態
  show("before original.profile.city", original.profile.city);

  // 修改基本型別
  // 這一行只會改 copy.score，不會改 original.score
  // 因為 number 是值複製，不是共用內部 reference
  copy.score = 100;

  // 修改巢狀物件內部屬性
  // profile 仍然共用同一份物件，所以 original.profile.city 也會一起變
  copy.profile.city = "Kaohsiung";

  // 修改陣列內容
  // tags 也是共用同一份陣列，所以 push 會影響 original.tags
  copy.tags.push("changed-by-spread");

  console.log("\nAfter editing copy");

  // 觀察基本型別是否分離
  show("original.score", original.score);
  show("copy.score", copy.score);

  // 觀察巢狀物件是否連動
  show("original.profile.city", original.profile.city);
  show("copy.profile.city", copy.profile.city);

  // 觀察陣列是否連動
  show("original.tags", original.tags);
  show("copy.tags", copy.tags);

  console.log("\nQuestion:");
  console.log("Why did score stay separate, but profile.city and tags both change?");
}

function runAssignPractice() {
  section("2. Shallow copy with Object.assign");

  const original = createSampleData();

  // Object.assign({}, original) 和 { ...original } 的核心效果很接近
  // 兩者都只會做第一層的淺複製
  const copy = Object.assign({}, original);

  compareRefs(original, copy, "Object.assign");

  // 重新指定第一層基本型別
  // 不會影響 original.user
  copy.user = "New Name";

  console.log("\nAfter editing copy");
  show("original.user", original.user);
  show("copy.user", copy.user);

  // 修改更深層的陣列元素
  // 因為 profile 還是共用的，所以 profile.skills 也還是共用的  
  copy.profile.skills[0] = "TypeScript";
  show("original.profile.skills", original.profile.skills);
  show("copy.profile.skills", copy.profile.skills);

  copy.profile.city = "city is shared";
  show("original.profile.city", original.profile.city);
  show("copy.profile.city", copy.profile.city);
}

function runJsonDeepCopyPractice() {
  section("3. Deep copy with JSON.parse(JSON.stringify())");

  const original = createSampleData();

  // 這是一個很常見的深複製寫法
  // 它的原理是:
  // 1. 先把資料轉成 JSON 字串
  // 2. 再從字串解析回新的物件
  // 因為是「重建」出新物件，所以巢狀 reference 會被切開
  const copy = JSON.parse(JSON.stringify(original));

  compareRefs(original, copy, "JSON");

  // 這裡修改 copy 的巢狀內容，不會再影響 original
  copy.profile.city = "Tainan";
  copy.tags.push("json-copy");

  console.log("\nAfter editing copy");
  show("original.profile.city", original.profile.city);
  show("copy.profile.city", copy.profile.city);
  show("original.tags", original.tags);
  show("copy.tags", copy.tags);

  console.log("\nImportant limitation check");

  // 這裡是 JSON 方法的重要限制:
  // Date 會被轉成字串，而不是保留 Date 物件身分
  // 所以 copy.createdAt instanceof Date 會是 false
  show("original.createdAt instanceof Date", original.createdAt instanceof Date);
  show("copy.createdAt instanceof Date", copy.createdAt instanceof Date);
  show("original.createdAt", original.createdAt);
  show("copy.createdAt", copy.createdAt);
}

function runStructuredClonePractice() {
  section("4. Deep copy with structuredClone()");

  // 某些環境可能沒有這個 API
  // 先檢查可用性，避免直接報錯
  if (typeof structuredClone !== "function") {
    console.log("structuredClone is not available in this Node environment.");
    return;
  }

  const original = createSampleData();

  // structuredClone 會建立真正獨立的新資料結構
  // 它通常比 JSON 方法更安全，因為可以保留像 Date 這類型別
  const copy = structuredClone(original);

  compareRefs(original, copy, "structuredClone");

  // 修改 copy，不會影響 original
  copy.profile.city = "Taichung";
  copy.tags.push("structured-clone");

  console.log("\nAfter editing copy");
  show("original.profile.city", original.profile.city);
  show("copy.profile.city", copy.profile.city);
  show("original.tags", original.tags);
  show("copy.tags", copy.tags);

  // 和 JSON 方法相比，這裡的 Date 仍然保有 Date 身分
  show("original.createdAt instanceof Date", original.createdAt instanceof Date);
  show("copy.createdAt instanceof Date", copy.createdAt instanceof Date);
}

function runRecursiveDeepClonePractice() {
  section("5. Custom deep clone with recursion");

  const original = createSampleData();

  // 使用自己寫的遞迴版本來做深複製
  // 這一段的重點不是取代原生 API，
  // 而是幫你理解 deep clone 背後其實是在一層一層重建資料
  const copy = deepCloneRecursive(original);

  compareRefs(original, copy, "recursive deep clone");

  copy.profile.city = "Hsinchu";
  copy.tags.push("recursive-copy");

  console.log("\nAfter editing copy");
  show("original.profile.city", original.profile.city);
  show("copy.profile.city", copy.profile.city);
  show("original.tags", original.tags);
  show("copy.tags", copy.tags);

  // 因為我們有特別處理 Date，
  // 所以這裡 copy.createdAt 仍然是 Date
  show("original.createdAt instanceof Date", original.createdAt instanceof Date);
  show("copy.createdAt instanceof Date", copy.createdAt instanceof Date);
}

function runHandsOnChallenges() {
  section("6. Hands-on challenges");

  // 這一段是留給你自己動手改程式的
  // 建議做法:
  // 1. 先猜結果
  // 2. 再執行
  // 3. 最後比對 reference check 和實際輸出
  console.log("Try editing this file yourself:");
  console.log("1. Add a new nested object inside createSampleData().");
  console.log("2. Test whether spread/Object.assign still share that nested value.");
  console.log("3. Add undefined, function, Map, or Set and compare JSON vs structuredClone.");
  console.log("4. Predict the result before running node deep-copy-practice.js.");
  console.log("5. Add console.log(original === copy) for every method until the pattern feels obvious.");
}

function main() {
  section("Deep copy vs shallow copy practice");
  console.log("Run with: node deep-copy-practice.js");

  // 整份檔案最重要的觀察問題只有一個:
  // 「我改的是 copy，為什麼 original 有時候也會一起變？」
  // 答案通常就在 reference 是否共用
  console.log("Goal: edit the copy, then check whether the original changes.");

  // runSpreadPractice();
  // runAssignPractice();
  // runJsonDeepCopyPractice();
  // runStructuredClonePractice();
  // runRecursiveDeepClonePractice();
  // runHandsOnChallenges();
}

main();
