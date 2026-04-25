// // main.js

import { fetchData, charge, attack, finalResult } from "./skills.js";


function fetchUser(callback) {
    setTimeout(() => {
        const error = null; // 假設成功
        if (error) {
            return callback(error, null);
        }
        const data = { id: 1, name: "anya" };//假設api回傳資料

        console.log("fetchUser todo") //執行順序:1
        callback(null, data);
        console.log("fetchUser ok")
    }, 1000);
}

function fetchAct(userId, callback) {
    setTimeout(() => {
        const error = null;// 假設成功
        if (error) {
            return callback(error, null);
        }

        //假設帶入userId處理後查回來的資料
        const data2 = [
            { id: 1, speak: "waku" },
        ];

        console.log("fetchAct todo")   //執行順序:4
        callback(null, data2);
        console.log("fetchAct ok")
    }, 2000);
}

//先做fetchUser本身
fetchUser((err, data) => {
    //這裡就是callback函式 
    //執行順序:2
    if (err) {
        return console.error("User error:", err);
    }
    console.log("data:", data);

    //執行順序:3
    fetchAct(data.id, (err2, data2) => {
        //這裡就是callback函式 
        //執行順序:5
        if (err2) {
            return console.error("fetchAct error:", err2);
        }
        console.log("data2:", data2);
    });
});







function fetchUser() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const error = null;

            if (error) {
                return reject(error);
            }

            const data = { id: 1, name: "anya" };

            console.log("fetchUser todo"); // 1
            resolve(data);
            console.log("fetchUser ok");
        }, 1000);
    });
}

function fetchAct(userId) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const error = null;

            if (error) {
                return reject(error);
            }

            const data2 = [
                { id: 1, speak: "waku" },
            ];

            console.log("fetchAct todo"); // 4
            resolve(data2);
            console.log("fetchAct ok");
        }, 2000);
    });
}


fetchUser()
    .then((data) => {
        console.log("data:", data); // 2
        return fetchAct(data.id);
    })
    .then((data2) => {
        console.log("data2:", data2); // 3
    })
    .catch((err) => {
        console.error("error:", err);
    });



Promise.all([
    fetchUser(),
    fetchAct(1)
])
.then(([user, act]) => {
    console.log("user:", user);
    console.log("act:", act);
})
.catch(err => {
    console.error("error:", err);
});


async function main() {
    try {
        // Step 1
        const data = await fetchUser();
        console.log("data:", data); // 2

        // Step 2
        const data2 = await fetchAct(data.id);
        console.log("data2:", data2); // 5

    } catch (err) {
        console.error("error:", err);
    }
}

main();


async function main() {
    try {
        const [user, act] = await Promise.all([
            fetchUser(),
            fetchAct(1)
        ]);

        console.log("user:", user);
        console.log("act:", act);

    } catch (err) {
        console.error(err);
    }
}

main();


//等事情做完後要執行的函式：fetchuser做完後 執行以下
// (err, user) => {
//     if (err) {
//         return console.error("User error:", err);
//     }

//     console.log("user:", user);

//     fetchUserAct(user.id, (err2, posts) => {
//         if (err2) {
//             return console.error("Posts error:", err2);
//         }

//         console.log(user, ":", posts);
//     });
// }

// // import skills from "./skills.js";
// // JavaScript 用 callback + event loop，讓長時間任務不阻塞 main thread
// // callback 的目的不是讓流程有順序，而是讓「耗時工作不阻塞主執行緒」
// charge(3, (seconds) => {
//   attack(seconds, (power) => {
//     finalResult(power, () => {
//       console.log("Mission complete!");
//     });
//   });
// });

// console.log("Main end - UI still responsive");

// //最裡面的先做 裡面做完外面才會開始做 這樣對?
// fetchData((err, data) => {
//   if (err) return console.error(err);//錯誤處理
//   console.log("Callback 拿到資料：", data);
//     //data2需要data
//   // 若需要再發一次請求 → 往內縮排 → Callback Hell
//   fetchData((err2, data2) => {
//     console.log("Callback Hell2 開始...", data2);
//     if (err2) return console.error(err2);//錯誤處理

//     fetchData((err3, data3) => {
//       console.log("Callback Hell3 開始...", data3);
//       if (err3) return console.error(err3);//錯誤處理
//     }
//     )
//   });
// });




// // 模擬吃東西（每次吃都會回傳飽足感）
// function eatFood(food, callback) {
//   setTimeout(() => {
//     const fullness = Math.random(); // 0~1 隨機飽度

//     console.log(`吃了 ${food}，飽足感：${fullness.toFixed(2)}`);

//     const isFull = fullness > 0.7; // >0.7 覺得飽

//     callback(null, { food, isFull });
//   }, 500);
// }

// eatFood("漢堡", (err, result1) => {
//   if (err) return console.error(err);

//   if (result1.isFull) {
//     console.log("吃漢堡就飽了，不吃下一餐");
//     return;
//   }

//   console.log("漢堡沒吃飽 → 吃拉麵");

//   eatFood("拉麵", (err2, result2) => {
//     if (err2) return console.error(err2);

//     if (result2.isFull) {
//       console.log("吃拉麵就飽了，不吃飯");
//       return;
//     }

//     console.log("拉麵沒吃飽 → 吃飯");

//     eatFood("白飯", (err3, result3) => {
//       if (err3) return console.error(err3);

//       if (result3.isFull) {
//         console.log("吃飯才終於飽了");
//       } else {
//         console.log("三餐都吃了還是沒飽（怪物胃）");
//       }
//     });
//   });
// });