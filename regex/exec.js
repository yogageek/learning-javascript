const source = "Anya (Spy), Loid (Spy)";
const regex = /Anya \((\w+)\)/; // 尋找 Anya 以及括號內的單字

const result = regex.exec(source);

console.log(result);
// => [
//      "Anya (Spy)", // [0]: 完整匹配的字串
//      "Spy",        // [1]: 第一個括號 (捕獲組) 抓到的內容
//      index: 0,     // 匹配成功的起始位置
//      input: "Anya (Spy), Loid (Spy)", // 原始字串
//      groups: undefined // 本次無具名組
//    ]








/**
 * JavaScript Regex 語法拆解範例
 * 模式：/Anya \((\w+)\)/
 */

const source = "Anya (Spy)";

// 定義正規表達式並附上嚴謹註解
const regex = /Anya \((\w+)\)/; 
/* 解構說明：
  /       : 正則表達式的起始定界符。
  Anya    : 匹配字面上精確的 "Anya" 字串。
  \s      : (本例空格) 匹配一個空白字元。
  \(      : 將特殊符號 "(" 進行跳脫，使其僅代表字面上的左括號，而非捕獲組開頭。
  (       : 捕獲組的起始，用於提取括號內的內容。
  \w      : 字元類別，匹配任一單字字元，等同於 [A-Za-z0-9_]。
  +       : 量詞，代表前一個字元（即 \w）必須出現 1 次或多次。
  )       : 捕獲組的結束。
  \)      : 將特殊符號 ")" 進行跳脫，使其僅代表字面上的右括號。
  /       : 正則表達式的結束定界符。
*/

// 執行比對
const result = regex.exec(source);

// 輸出結果 =>
if (result) {
  console.log('完整匹配內容:', result[0]); // "Anya (Spy)"
  console.log('第一個捕獲組內容 (\\w+):', result[1]); // "Spy"
  console.log('匹配起始位置:', result.index); // 0
}









/**
 * JavaScript Regex: 捕獲組進階應用與 String 方法整合
 */

// ==========================================
// 3. 資訊提取 (Extraction)
// ==========================================
const dateSource = "Today is 2026-04-13";
const dateRegex = /(\d{4})-(\d{2})-(\d{2})/;
/* 解構說明：
   (      : 第一個捕獲組起始。
   \d{4}  : \d 匹配數字，{4} 代表精確重複 4 次。
   )      : 第一個捕獲組結束（擷取年份）。
   -      : 匹配字面上的橫線。
   (\d{2}): 第二個捕獲組，匹配 2 位數字（擷取月份）。
   -      : 匹配橫線。
   (\d{2}): 第三個捕獲組，匹配 2 位數字（擷取日期）。
*/
const dateParts = dateRegex.exec(dateSource);
console.log("--- 資訊提取範例 ---");
console.log("完整日期:", dateParts[0]); // "2026-04-13"
console.log("年份:", dateParts[1]);    // "2026"
console.log("月份:", dateParts[2]);    // "04"
console.log("日期:", dateParts[3]);    // "13"


// ==========================================
// 4. 反向引用 (Back-reference)
// ==========================================
const htmlSource = "<div>Mission Start</div>";
const backRefRegex = /<(.*?)>.*?<\/\1>/;
/* 解構說明：
   <      : 匹配左尖括號。
   (      : 捕獲組起始。
   .*?    : . 匹配任意字元，* 代表 0 次以上，? 代表「非貪婪模式」（匹配到第一個 > 就停止）。
   )      : 捕獲組結束。
   >      : 匹配右尖括號。
   .*?    : 匹配標籤內部的任意內容。
   <\/    : \/ 跳脫斜線，匹配 HTML 結束標籤的 「/」。
   \1     : 【反向引用】。指向上方第一個捕獲組 (.*?) 抓到的內容，確保開關標籤一致。
   >      : 匹配結束的右尖括號。
*/
console.log("--- 反向引用測試 ---");
console.log("標籤比對是否一致:", backRefRegex.test(htmlSource)); // true


// ==========================================
// 5. String.prototype.replace() 的強大應用
// ==========================================
const nameSource = "Loid Forger";
const replaceRegex = /(\w+) (\w+)/;
/* 解構說明：
   (\w+)  : 第一捕獲組。匹配一個或多個單字字元（名字）。
   \s     : (空格) 匹配名字與姓氏間的空白。
   (\w+)  : 第二捕獲組。匹配一個或多個單字字元（姓氏）。
*/
// 使用 $1, $2 引用捕獲組進行位置交換
const reversedName = nameSource.replace(replaceRegex, "$2 $1");
console.log("--- Replace 置換測試 ---");
console.log("原始名稱:", nameSource);   // "Loid Forger"
console.log("置換後名稱:", reversedName); // "Forger Loid"


// ==========================================
// 6. String.prototype.matchAll() (全域提取)
// ==========================================
const multiSource = "Spy: Loid, Spy: Anya";
const allRegex = /Spy: (\w+)/g;
/* 解構說明：
   Spy:   : 匹配字面文字 "Spy: "。
   \s     : 匹配一個空白。
   (\w+)  : 捕獲組。匹配間諜的代號。
   g      : Flag (修飾符)。全域搜尋，不因找到第一個就停止。
*/
const allMatches = [...multiSource.matchAll(allRegex)];
console.log("--- matchAll 全域提取 ---");
allMatches.forEach(m => {
  console.log(`找到間諜: ${m[1]}，位置於索引: ${m.index}`);
});
// 輸出: 找到間諜: Loid，位置於索引: 0
// 輸出: 找到間諜: Anya，位置於索引: 11




// A. 全捕獲（索引混亂）
// 我只想抓編號 007，但為了邏輯我把 Mission 也括起來
const reg = /(Mission): (\w+)-(\d+)/;
const res = reg.exec(source);
/* 結果陣列：
[0]: "Mission: Strix-007"
[1]: "Mission" (沒用的垃圾資訊)
[2]: "Strix"   (沒用的垃圾資訊)
[3]: "007"     (我真正要的)
*/
// B. 使用非捕獲組（結構清晰）
// 使用 ?: 忽略不需要提取的部分
const reg = /(?:Mission): (?:\w+)-(\d+)/;
const res = reg.exec(source);
/* 結果陣列：
[0]: "Mission: Strix-007"
[1]: "007" (直接就是我要的，不用去數索引是 1 還是 3)
*/
/**
 * 範例 A：使用捕獲組
 * 模式：/Anya \((\w+)\)/
 */
const source = "Anya (Spy)";
const regexWithGroup = /Anya \((\w+)\)/;
/* 解構說明：
  \(   : 跳脫符 + 左括號，匹配純文字 "("。
  (    : 捕獲組起始，開始記錄內部匹配的內容。
  \w   : 匹配任一單字字元 (字母、數字、底線)。
  +    : 量詞，匹配前一字元 (\w) 1 次或多次。
  )    : 捕獲組結束，將 (\w+) 匹配到的結果存入記憶體。
  \)   : 跳脫符 + 右括號，匹配純文字 ")"。
*/

const resultA = regexWithGroup.exec(source);

console.log(resultA[0]); // => "Anya (Spy)" (完整匹配)
console.log(resultA[1]); // => "Spy" (透過捕獲組提取出的內容)
/**
 * 範例 B：不使用捕獲組
 * 模式：/Anya \((?:\w+)\)/
 */
const source = "Anya (Spy)";
const regexNoGroup = /Anya \((?:\w+)\)/;
/* 解構說明：
  (?:  : 非捕獲組起始標記。這告訴正則引擎：匹配這組字元，但「不要」儲存結果到結果陣列中。
  \w+  : 匹配 1 次或多次單字字元。
  )    : 非捕獲組結束。
*/

const resultB = regexNoGroup.exec(source);

console.log(resultB[0]); // => "Anya (Spy)" (完整匹配)
console.log(resultB[1]); // => undefined (因為使用了 ?:，所以沒有捕獲內容)



// 第三階段：進階——具名捕獲組 (Named Groups)
// 為了讓程式碼更易讀，我們可以在括號內加上 ?<名稱>，這樣結果就會出現在 groups 物件裡。

// JavaScript
const source = "Agent: Twilight";
const regexNamed = /Agent: (?<name>\w+)/; // 幫括號取名叫 "name"

const result = regexNamed.exec(source);

console.log(result.groups.name); 
// => "Twilight" (直接透過名稱存取，不用數 [1], [2]...)

// 完整結果呈現 =>
// [
//   "Agent: Twilight", 
//   "Twilight", 
//   index: 0, 
//   groups: { name: "Twilight" } 
// ]


// 第二階段：連續匹配（加上 g 標記）
// 當加上 g (Global) 後，exec() 就像一個「指針」，每次執行都會往後移，直到找不到了為止。

// JavaScript
const source = "Anya, Loid, Yor";
const regexG = /\w+/g; // 匹配單字，全域搜尋

// 第一次執行：指針從 0 開始
const run1 = regexG.exec(source);
console.log('第一次結果:', run1[0]); // => "Anya"
console.log('下次開始位置:', regexG.lastIndex); // => 4

// 第二次執行：從位置 4 往後找
const run2 = regexG.exec(source);
console.log('第二次結果:', run2[0]); // => "Loid"
console.log('下次開始位置:', regexG.lastIndex); // => 10

// 第三次執行：從位置 10 往後找
const run3 = regexG.exec(source);
console.log('第三次結果:', run3[0]); // => "Yor"

// 第四次執行：找不到了
const run4 = regexG.exec(source);
console.log('最終結果:', run4); // => null

// 第一階段：單一匹配（不使用 g 標記）
// 這是最基礎的狀態，無論執行幾次，結果都一樣。

// JavaScript
const source = "Anya (Spy), Loid (Spy)";
const regex = /Anya \((\w+)\)/; // 尋找 Anya 以及括號內的單字

const result = regex.exec(source);

console.log(result);
// => [
//      "Anya (Spy)", // [0]: 完整匹配的字串
//      "Spy",        // [1]: 第一個括號 (捕獲組) 抓到的內容
//      index: 0,     // 匹配成功的起始位置
//      input: "Anya (Spy), Loid (Spy)", // 原始字串
//      groups: undefined // 本次無具名組
//    ]



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