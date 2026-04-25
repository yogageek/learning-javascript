const arr1 = [1, 2, 3];

const result1 = arr1.flatMap(x => [x, x * 2]);

console.log(result1);


const arr2 = [1, [2, [3, 4]]];

const result2 = arr2.flat(2);

console.log(result2);

const arr = [3, 1, 4, 1, 5, 9, 2, 6];

arr.values(); // Array Iterator
arr.keys();   // Array Iterator
let itr=arr[Symbol.iterator]();
console.log(itr.next()); // { value: 3, done: false }


arr.entries(); // Array Iterator，回傳 [index, value] 的陣列


//大批處理
//arr.map() //對應
//arr.reduce() //歸納