// Set

// **用途**：去重、集合運算（聯集、交集、差集）。


const set = new Set([1, 2, 2, 3, 3]); // {1, 2, 3} ← 自動去重

// 基本操作
set.add(4);        // 加入值
set.has(2);        // true
set.delete(2);     // 刪除，回傳 boolean
set.size;          // 項目數量
set.clear();       // 清空

// 遍歷
for (const val of set) { console.log(val); }
[...set];          // 轉成陣列

// 集合運算
const A = new Set([1, 2, 3, 4]);
const B = new Set([3, 4, 5, 6]);

// 聯集 (Union)
const union = new Set([...A, ...B]);        // {1,2,3,4,5,6}

// 交集 (Intersection)
const intersection = new Set([...A].filter(x => B.has(x))); // {3,4}

// 差集 (Difference) A - B
const difference = new Set([...A].filter(x => !B.has(x)));  // {1,2}


new Set(iterable); // ()必須是可疊代物件，例如：陣列、字串、Map 的 keys() 等等
set.add(4).add(5); // set 的 add 方法會回傳 set 本身，所以可以連續呼叫 add() 來加入多個值
