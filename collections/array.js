const arr = [3, 1, 4, 1, 5, 9, 2, 6];

arr.values(); // Array Iterator
arr.keys();   // Array Iterator
let itr=arr[Symbol.iterator]();
//iterator 是有一個 next() 方法，每次呼叫 next() 都會回傳一個物件，包含 value 和 done 兩個屬性。
//value 是當前的值，done 是一個布林值，表示迭代是否完成。
arr.entries(); // 回傳一個新的Array Iterator物件，這個物件會回傳陣列的每一個元素的索引和值，格式為 [index, value]。
//values() 和 keys() 也是回傳 Array Iterator，但 values() 只回傳值，keys() 只回傳索引。


// ── 轉換 ──────────────────────────────────────────
arr.map(x => x * 2);          // [6,2,8,2,10,18,4,12] 回傳新陣列
arr.filter(x => x > 3);       // [4,5,9,6]            回傳新陣列
arr.reduce((acc, x) => acc + x, 0); // 31             累加成單一值

// ── 查找 ──────────────────────────────────────────
arr.find(x => x > 4);         // 5   ← 第一個符合的值
arr.findIndex(x => x > 4);    // 4   ← 第一個符合的 index
arr.includes(9);               // true
arr.indexOf(1);                // 1   ← 第一次出現的 index（找不到回 -1）

// ── 修改（會改原陣列！）──────────────────────────
arr.push(7);                   // 尾端加入，回傳新長度
arr.pop();                     // 移除尾端，回傳被移除的值
arr.unshift(0);                // 頭端加入，回傳新長度
arr.shift();                   // 移除頭端，回傳被移除的值

arr.splice(2, 1, 99);          // 從 index 2 刪 1 個，插入 99（改原陣列）
arr.sort()
arr.sort((a, b) => a - b);     // 升冪排序（改原陣列）
arr.reverse()


// 2️⃣ 回傳值規則（超重要🔥）
// (a, b) 是兩個拿來比較的值
// 你要告訴 JS：誰比較大
// a - b 是「數字比較規則」
// 結果 < 0 → a 放前面
// 結果 > 0 → b 放前面
// 所以小的會往前排
// 形成「升冪（小 → 大）」
// 想降冪就用 b - a

// ── 不改原陣列 ────────────────────────────────────
arr.slice(1, 3);               // [1, 4]  取 index 1~2
arr.concat([10, 11]);          // 合併，回傳新陣列
arr.flat(2);                   // 展平 2 層巢狀陣列
arr.flatMap(x => [x, x * 2]); // map + flat(1)

// ── 判斷 ──────────────────────────────────────────
arr.some(x => x > 8);         // true  ← 至少一個符合
arr.every(x => x > 0);        // true  ← 全部符合
Array.isArray(arr);            // true


let ary = new Array()
// ary.length = property



// 去重
const unique = [...new Set([1, 1, 2, 3])]; // [1, 2, 3]

// 展開 / 合併
const a = [1, 2], b = [3, 4];
const merged = [...a, ...b];               // [1, 2, 3, 4]

// 解構
const [first, second, ...rest] = [1, 2, 3, 4];
// first=1, second=2, rest=[3,4]

// 從類陣列轉 Array
Array.from("hello");          // ['h','e','l','l','o']
Array.from({length: 3}, (_, i) => i); // [0, 1, 2]
// (_, i) => i
// 👉 _ =「這個參數我刻意不用」👉 _ =「這格有資料，但我選擇忽略」
// 👉 i =「我要 index」


// (element, index) => index

// function(element, index) {
//   return index;
// }

/**
 * Array.from 重點整理
 *
 * 核心用途：
 * 1. 將「類陣列 / iterable」轉成真正的 Array
 * 2. 建立陣列時可同時做 mapping（類似 map）
 *
 * 語法：
 * Array.from(arrayLike, mapFn?)
 *
 * arrayLike：
 * - 字串（string）
 * - NodeList（querySelectorAll）
 * - arguments
 * - 類似 { length: n } 的物件
 *
 * mapFn：
 * - (element, index) => newValue
 */

// ==========================
// 基本用法
// ==========================

// 字串 → 陣列（因為 string 是 iterable）
const chars = Array.from("hello");
console.log(chars); // ['h','e','l','l','o']

// ==========================
// 建立序列（非常常用🔥）
// ==========================

// 建立 [0,1,2]
const arr1 = Array.from({ length: 3 }, (_, i) => i);
console.log(arr1);

// 建立 [1,2,3,4,5]
const arr2 = Array.from({ length: 5 }, (_, i) => i + 1);
console.log(arr2);
// [...Array(5)].map((_, i) => i + 1);
// ==========================
// mapping（建立時直接轉換）
// ==========================

const doubled = Array.from([1, 2, 3], x => x * 2);
console.log(doubled); // [2,4,6]

// 等價寫法（但 Array.from 是一次完成）
const doubled2 = [1, 2, 3].map(x => x * 2);

// ==========================
// NodeList → Array（前端常見）
// ==========================

// const divs = Array.from(document.querySelectorAll("div"));
// divs.map(...) // NodeList 原本不能直接 map

// ==========================
// 去重（搭配 Set）
// ==========================

const unique = Array.from(new Set([1, 1, 2, 3]));
console.log(unique); // [1,2,3]

// ==========================
// 核心觀念（重要）
// ==========================

/**
 * Array.from({ length: 3 }) 的本質：
 *
 * 類似建立：
 * [empty, empty, empty]
 *
 * 然後透過 mapFn 填值
 */

// 實際執行流程（概念）
const demo = Array.from({ length: 3 }, (_, i) => i);
// i = 0 → 回傳 0
// i = 1 → 回傳 1
// i = 2 → 回傳 2

// ==========================
// 常見錯誤（面試重點）
// ==========================

// ❌ 錯誤：map 不會處理 empty slots
const wrong = new Array(3).map((_, i) => i);
console.log(wrong); // [empty × 3]

// ✅ 正確：用 Array.from
const correct = Array.from({ length: 3 }, (_, i) => i);
console.log(correct); // [0,1,2]

// ==========================
// 與其他寫法比較
// ==========================

/**
 * [...iterable]
 * - 只能「轉換」
 * - 不能直接 mapping
 *
 * Array.from()
 * - 可以轉換 + mapping
 */

// 只轉換
const spread = [..."hello"]; // ['h','e','l','l','o']

// ==========================
// 一句話總結
// ==========================

/**
 * Array.from = 建立陣列 + 同時加工資料
 */

const arr = [1, 2, 3];

const result = arr.flatMap(x => [x, x * 2]);

console.log(result);



