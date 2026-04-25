### Q3：`for...in` vs `for...of` 的差別

```js
const arr = [10, 20, 30];

for (const i in arr) { console.log(i); }   // "0" "1" "2" ← 遍歷 key（字串！）
for (const v of arr) { console.log(v); }   // 10 20 30   ← 遍歷 value

// for...in 用於 Object，for...of 用於可迭代物件（Array、Map、Set、String）
// ⚠️ 不要用 for...in 遍歷 Array，會遍歷到原型鏈上的屬性
```



物件的prototype如果具有iterator屬性 稱為可疊代物件 表示可以透過疊代氣循環拜訪  下一個元素