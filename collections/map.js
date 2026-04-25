const map = new Map();

// 基本操作
map.set("name", "Yoga");      // 設值
map.set(42, "number key");    // 鍵可以是任意型別
map.set({id: 1}, "obj key");  // 鍵可以是物件
map.get("name");              // "Yoga"
map.has("name");              // true
map.delete("name");           // 刪除，回傳 boolean
map.size;                     // 項目數量（Object 沒有直接的 .size）
map.clear();                  // 清空


// forEach 遍歷：參數順序是 (value, key)，注意跟直覺相反 重點是 Map 會照你加入的順序吐出資料。
map.forEach((value, key) => console.log(key, value));
// for...of 遍歷：用解構 [key, value] 直接拆開每一筆
for (const [key, value] of map) { console.log(key, value); }
// 只要全部的 key，展開成陣列
[...map.keys()];
// 只要全部的 value，展開成陣列
[...map.values()];
// 把所有資料都取出來，轉成這種格式的陣列： [[key,value], ...]
[...map.entries()];

// Object 轉 Map
const obj = { a: 1, b: 2 };
const mapFromObj = new Map(Object.entries(obj));

// Map 轉 Object
const objFromMap = Object.fromEntries(map); 

const heroMap = new Map();
const profileKey = { id: 1 };


//set在方法會傳回相同的map物件 可以把set方法連接在一起
map.set('x','y').set('a','b');

//map就是二維度陣列

//new Map([iterable])  //iterable必須是可疊代物件 像是陣列或其他具件質對的可疊代物件


