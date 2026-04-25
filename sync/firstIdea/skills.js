// skills.js

//callback意義是 charge完之後 要做甚麼
function charge(seconds, callback) {
  console.log("Charge started...");

  setTimeout(() => {
    const chargedSeconds = seconds * 1000;

    console.log(`Charging for ${seconds} seconds...`);
    console.log("Charge completed!");

    callback(chargedSeconds);
  }, seconds * 1000);//蓄力需等待__秒
}

//callback意義是 attack完之後 要做甚麼
function attack(chargeSeconds, callback) {
  setTimeout(() => {
    const power = 1 * chargeSeconds;

    console.log("Attack launched!");
    console.log(`Attack power = ${power}`);

    callback(power);
  }, 2000);//攻擊需等待兩秒發動
}


function fetchData(callback) {
  setTimeout(() => { // setTimeout 模擬 response 回傳延遲
    callback(null, { id: 1, name: "Yoga" }); // 模擬 API 回傳
  }, 500);
}





// ⭐ 方法3：最終結果判斷
function finalResult(power, callback) {
  console.log("Calculating final result...");

  switch (true) {
    case power >= 5000:
      console.log("Ultimate Attack!!! (大招)");
      break;
    case power >= 3000:
      console.log("Medium Attack! (中招)");
      break;
    default:
      console.log("Small Attack (小招)");
  }

  //如果 callback 存在（不是 undefined / null），才執行它
  if (callback) {
    callback();
  }
}

export { charge, attack, finalResult,fetchData };