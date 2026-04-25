// reduce 本質：
// 👉「把一個陣列 → 壓縮成一個結果」

// 常見用途（實務 80%）：

// 加總 / 統計
// 分組（group by）
// 轉換資料結構（array → object）
// 條件篩選 + 累積（filter + map 合體）
// 計算狀態（例如：購物車、權限）

// array.reduce((accumulator, current) => {
//   return 更新後的accumulator
// }, 初始值)

// 要「累積」
// 要「改資料結構」
// 要「統計」

// 👉 reduce = 「你自己寫一個 for loop，但更函數式」


//簡單來說就是 reduce 方法跟其他陣列方法（例如：map、filter）的差別是它會 return 一個值
// ，而不是一個新陣列，這會連帶使 reduce 的語法結構跟邏輯與其他方法不太相同。


/**
 * 💡 reduce 核心心法：
 * 1. 它是陣列的「瑞士刀」，能同時完成過濾 (Filter)、轉換 (Map) 與加總 (Sum)。
 * 2. 永遠記得給「初始值 (Initial Value)」，這能避免空陣列導致的 Crash。
 */

const characters = [
  { name: "Loid", role: "spy", power: 90, family: "Forger" },
  { name: "Yor", role: "assassin", power: 95, family: "Forger" },
  { name: "Anya", role: "esper", power: 60, family: "Forger" },
  { name: "Bond", role: "dog", power: 50, family: "Forger" },
  { name: "Franky", role: "informant", power: 40, family: "Other" }
];

// --- 階段 1：基礎累計 (Sum / Find Max) ---

// 1-1 加總戰鬥力 (初始值設為 0 是最合理的做法)
const totalPower = characters.reduce((acc, cur) => acc + cur.power, 0);
console.log("Total Power:", totalPower); // 335

// 1-2 找出戰鬥力最強的角色 (使用當前元素作為比較基準)
//   
const strongest = characters.reduce((acc, cur) => (cur.power > acc.power ? cur : acc), characters[0]);
console.log("Strongest Character:", strongest.name);

// --- 階段 2：資料格式轉換 (Mapping / Grouping) ---

// 2-1 轉換為名稱索引物件 (快速查找用：name -> power)
//
const powerMap = characters.reduce((acc, { name, power }) => {
  //
    acc[name] = power;//
  return acc;
}, {});
console.log("Power Map:", powerMap);

// 2-2 統計角色數量與分組 (實務上最常見的 reduce 用法)
const roleStats = characters.reduce((acc, { role }) => {//
  acc[role] = (acc[role] || 0) + 1;//
  return acc;
}, {});
console.log("Count by Role:", roleStats);

const groupedByRole = characters.reduce((acc, cur) => {
  acc[cur.role] ??= []; // 如果該分類還沒建立，先給空陣列
  acc[cur.role].push(cur);
  return acc;
}, {});
console.log("Grouped by Role:", groupedByRole);

// --- 階段 3：進階邏輯組合 (Filter + Map / Nested Logic) ---

// 3-1 Filter + Map 組合技：找出戰鬥力 > 50 的角色名並轉大寫
// 這比 .filter().map() 更有效率，因為只需要跑一遍迴圈
const highPowerNames = characters.reduce((acc, { power, name }) => {
  if (power > 50) acc.push(name.toUpperCase());
  return acc;
}, []);
console.log("High Power Names:", highPowerNames);

// 3-2 找出最強大的家庭 (結合兩層 reduce)
const familyPowerStats = characters.reduce((acc, { family, power }) => {
  acc[family] = (acc[family] || 0) + power;
  return acc;
}, {});

console.log("Family Power Stats:", familyPowerStats);

const strongestFamily = Object.entries(familyPowerStats).reduce((best, [familyName, total]) => {

  return total > best.power ? { familyName, power: total } : best; 
  //解釋：這裡我們用 Object.entries() 把 familyPowerStats 轉成 [familyName, total] 的陣列，
  //然後用 reduce 找出 power 最大的家庭。
  // 初始值是一個物件 { familyName: "", power: 0 }，
  // 每次比較當前家庭的總戰鬥力 (total) 與目前最佳的戰鬥力 (best.power)，
  // 如果更大就更新 best，否則保持不變。
  // 最後 strongestFamily 就會是戰鬥力最高的家庭名稱和其總戰鬥力。
}, { familyName: "", power: 0 });

console.log(`Strongest Family: ${strongestFamily.familyName} (${strongestFamily.power} power)`);


// 將物件轉成陣列格式：{ A: 100, B: 200 } → [["A",100], ["B",200]]
const familyEntries = Object.entries(familyPowerStats);

// 設定初始最佳值（預設為空 + 0）
// 用來當 reduce 的起點（第一次比較的基準）
const initialBest = {
  familyName: "",  // 目前最強的家族名稱（初始為空）
  power: 0         // 目前最大戰力（初始為0）
};

// 使用 reduce 逐一比較每個家族的總戰力
const strongestFamily = familyEntries.reduce((currentBest, entry) => {

  // 解構當前資料
  // entry = ["Forger", 295]
  const [familyName, totalPower] = entry;

  // 印出目前比較過程（方便 debug / 理解流程）
  console.log(
    `Comparing ${familyName} (${totalPower}) vs current best ${currentBest.familyName} (${currentBest.power})`
  );

  // 如果目前這個家族的戰力更高 → 更新最佳
  if (totalPower > currentBest.power) {
    return {
      familyName: familyName, // 更新為當前家族
      power: totalPower       // 更新為當前戰力
    };
  }

  // 否則維持原本的最佳結果
  return currentBest;

}, initialBest); // 傳入初始值（第一次 currentBest 就是它）

// 最終輸出結果
console.log(
  `Strongest Family: ${strongestFamily.familyName} (${strongestFamily.power})`
);