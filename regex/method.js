


/**
 * JavaScript Regex Flags 綜合範例
 * 整合字串源：包含換行、大小寫差異、Unicode 字元與重複模式
 */

const fullText = `Loid is a spy.
loid is also Twilight.
Anya loves 🐶 and Peanuts.
Mission: Strix`;

// --- 第一部分：四種核心方法 ---

// 1. test(): 檢查模式是否存在
// 邏輯：執行檢索並回傳布林值。不回傳匹配內容。
const regexTest = /Strix/;
const hasMission = regexTest.test(sourceText); 
console.log('test() 結果:', hasMission); // true

// 2. exec(): 提取詳細資訊與捕獲組
// 邏輯：回傳一個數組。索引 [0] 為完整匹配，[1...n] 為捕獲組，並包含 index (匹配起始位置) 屬性。
const regexExec = /Mission: (\w+)/;
const execResult = regexExec.exec(sourceText);
if (execResult) {
    console.log('exec() 完整匹配:', execResult[0]); // "Mission: Strix"
    console.log('exec() 捕獲組 1:', execResult[1]); // "Strix"
    console.log('exec() 索引位置:', execResult.index); // 45 (視換行符長度而定)
}

// 3. match(): 字串檢索匹配
// 邏輯：若無 g 標記，行為同 exec()；若有 g 標記，則回傳包含所有匹配項的簡單數組，不含捕獲組資訊。
const regexMatch = /Anya/g;
const matchResult = sourceText.match(regexMatch);
console.log('match() 結果:', matchResult); // ["Anya", "Anya"]

// 4. search(): 尋找索引位址
// 邏輯：回傳第一個匹配項的起始索引數值，若無匹配則回傳 -1。不支援全域搜尋。
const regexSearch = /spy/;
const searchIndex = sourceText.search(regexSearch);
console.log('search() 索引:', searchIndex); // 17


// 1. i (Ignore case): 忽略大小寫匹配
// 邏輯：不區分字元的大寫 (U+0041-U+005A) 與小寫 (U+0061-U+007A) 偏移量。
const regexI = /Loid/i;
console.log(fullText.match(regexI)); // 匹配成功，回傳第一個 "Loid"

// 2. g (Global): 全域匹配
// 邏輯：在匹配到第一個結果後不停止，繼續搜尋直到字串結尾，並回傳所有匹配項。
const regexG = /is/g;
console.log(fullText.match(regexG)); // ["is", "is"]

// 3. m (Multiline): 多行匹配
// 邏輯：使邊界字元 ^ 與 $ 除了匹配字串起始與結尾外，也能匹配 \n (LF) 之後與之前的內容。
const regexM = /^loid/m; 
console.log(regexM.test(fullText)); // true (匹配第二行開頭的 "loid")

// 4. s (dotAll): 包含換行符匹配
// 邏輯：預設的點號 (.) 不匹配換行符 (\n, \r)。開啟 s 標記後，點號匹配範圍包含所有字元。
const regexS = /spy..loid/s;
console.log(regexS.test(fullText)); // true (點號成功跨越 "spy." 之後的換行符)

// 5. u (Unicode): 啟用 Unicode 模式
// 邏輯：將字串視為 UTF-16 編碼序列，能正確處理 4 位元組的代理對 (Surrogate Pairs) 字元。
const regexU = /\u{1F436}/u; // 🐶 的 Unicode 編碼
console.log(regexU.test(fullText)); // true

// 6. y (Sticky): 粘性匹配
// 邏輯：必須從 RegExp 對象的 lastIndex 屬性所指定的索引位置「精確」開始匹配，不跳過任何字元。
const stickyText = "AnyaAnyaAnya";
const regexY = /Anya/y;

console.log(regexY.exec(stickyText).index); // 0 (匹配成功，lastIndex 更新為 4)
console.log(regexY.lastIndex);               // 4
console.log(regexY.exec(stickyText).index); // 4 (從位置 4 精確開始匹配，成功)

/**
 * 組合用法範例 (gim)
 * 邏輯：同時套用全域、忽略大小寫與多行模式，搜尋每行開頭不分大小寫的 "loid"。
 */
const combinedRegex = /^loid/gim;
console.log(fullText.match(combinedRegex)); // ["Loid", "loid"]




/**
 * JavaScript Regex Pattern 綜合範例 (2026 修訂版)
 * 格式規範：邏輯註解與輸出結果均列於代碼後方
 * 主題：SPY×FAMILY
 */

// 統一字串源
const sourceText = `Loid is 1st.
Anya is 6 years old.
Mission: Strix-007
Status: [Success]
Phone: 0912-345-678
Email: anya@eden.edu`;

// --- 1. 點號 (.)：代表任一字元 (不含換行符) ---
const p1 = /.t./i; 
console.log("1. 點號測試:", sourceText.match(p1)); // ["Strix"] -> 搜尋「字元+t+字元」的片段

// --- 2. 星號 (*)：重複零個或多個前一個字元 ---
const p2 = /lo*/i; 
console.log("2. 星號測試:", sourceText.match(p2)); // ["Loid"] -> 匹配 "l" 後接 0 個或多個 "o"

// --- 3. 方括號 ([])：字元範圍與集合 ---
const p3 = /[Ee]ileen/;    
console.log("3.1 集合匹配:", "Eileen".match(p3)); // ["Eileen"] -> 匹配大寫 E 或小寫 e 開頭的名稱
const p4 = /[^A-Z]/;       
console.log("3.2 否定集合:", sourceText.match(p4)); // ["o"] -> 匹配第一個非大寫字母的字元 (Loid 中的 o)
const p5 = /[a-z]/;        
console.log("3.3 小寫範疇:", sourceText.match(p5)); // ["o"] -> 匹配第一個小寫字母
const p6 = /[1-9]/;        
console.log("3.4 數字範圍:", sourceText.match(p6)); // ["1"] -> 匹配第一個 1 到 9 的數字
console.log("3.5 全域集合:", sourceText.match(/[a-z]+/g)); // ["oid", "is", "st", "nya", "is", "years", "old", "ission", "trix", "tatus", "uccess", "hone", "mail", "anya", "eden", "edu"] -> 提取所有小寫單詞片段

// --- 4. 插入符 (^) 與 錢字號 ($)：開頭與結束 ---
const p7 = /^Loid/;        
console.log("4.1 邊界(開頭):", p7.test(sourceText)); // true -> 檢查字串是否以 "Loid" 開始
const p8 = /[a-z]$/;       
console.log("4.2 邊界(結束):", p8.test(sourceText)); // true -> 檢查字串是否以小寫字母結束 (edu 的 u)

// --- 5. 反斜線 (\)：跳脫字元 ---
const p9 = /\./;           
console.log("5. 跳脫點號:", sourceText.match(p9)); // ["."] -> 搜尋字面上的點號字元，而非任一字元功能

// --- 6. 花括號 ({n,m})：出現次數介於 n 到 m 之間 ---
const p10 = /[a-z]{3,5}/;  
console.log("6. 次數區間:", sourceText.match(p10)); // ["years"] -> 匹配連續 3 到 5 個小寫字母

// --- 7. 綜合實戰 ---
const phoneRegex = /09\d{2}-\d{3}-\d{3}/;
console.log("綜合 - 電話驗證:", phoneRegex.test(sourceText)); // true -> 驗證台灣手機格式 09XX-XXX-XXX

const bracketRegex = /\[(.*?)\]/;
console.log("綜合 - 括號內容:", sourceText.match(bracketRegex)[1]); // "Success" -> 提取中括號內的字串內容


/**
 * JavaScript Regex 深度應用範例
 * 複雜環境：跨行字串、具名捕獲組、多個匹配項
 */

const source = `Agent: Twilight (Loid)
Target: Anya Forger
Agent: Daybreak (Fake)
Status: [Mission-Strix]`;

// 1. test()：高頻率驗證
// 邏輯：判斷是否存在「以 Agent: 開頭」的行
const hasAgent = /^Agent:/m.test(source);
console.log('test() 結果:', hasAgent); 
// => true

// 2. exec()：深度擷取細節 (包含具名捕獲組)
// 邏輯：擷取 Agent 名稱與括號內的代號，使用具名捕獲組 (?<name>)
const agentRegex = /Agent: (?<name>\w+) \((?<alias>\w+)\)/g;

// 第一次執行 exec
const exec1 = agentRegex.exec(source);
console.log('exec() 第一次:', exec1);
// => [
//      "Agent: Twilight (Loid)",           // [0]: 完整匹配
//      "Twilight",                         // [1]: 第一個捕獲組
//      "Loid",                             // [2]: 第二個捕獲組
//      index: 0,                           // 匹配起始位置
//      input: "...",                       // 原始字串
//      groups: { name: "Twilight", alias: "Loid" } // 具名組
//    ]

// 第二次執行 exec (受 g 影響，lastIndex 已移動)
const exec2 = agentRegex.exec(source);
console.log('exec() 第二次:', exec2);
// => [
//      "Agent: Daybreak (Fake)", 
//      "Daybreak", 
//      "Fake", 
//      index: 43, 
//      groups: { name: "Daybreak", alias: "Fake" }
//    ]

// 3. match()：全域掃描 vs 詳細掃描
// A. 加上 g (Global)：僅回傳所有匹配內容的字串陣列
const names = source.match(/\w+ Forger/g);
console.log('match() 有 g:', names); 
// => ["Anya Forger"]

// B. 不加 g：回傳與 exec 第一輪相同的詳細陣列
const details = source.match(/Mission-(\w+)/);
console.log('match() 無 g:', details);
// => ["Mission-Strix", "Strix", index: 74, input: "..."]

// 4. matchAll()：(ES2020) 同時獲取全域匹配與所有捕獲組細節
// 邏輯：返回一個迭代器，必須展開為陣列
const allAgents = [...source.matchAll(agentRegex)];
console.log('matchAll() 總數:', allAgents.length); 
// => 2
console.log('matchAll() 第一項捕獲組:', allAgents[0][1]); 
// => "Twilight"

// 5. search()：純位置定位
// 邏輯：尋找中括號 "[" 的索引，忽略 g
const bracketPos = source.search(/\[/);
console.log('search() 索引:', bracketPos); 
// => 73

// 6. split()：正規表達式拆分
// 邏輯：以冒號或空白作為基準拆分字串
const parts = source.split(/[:\s\n]+/);
console.log('split() 結果:', parts);
// => ["Agent", "Twilight", "(Loid)", "Target", "Anya", "Forger", "Agent", "Daybreak", "(Fake)", "Status", "[Mission-Strix]"]