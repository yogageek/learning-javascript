// ## 概念對照表

// | 概念 | Spy Family 範例 |
// |------|----------------|
// | `class` 父類 | `Spy` 基礎間諜 |
// | `extends` | `SecretAgent extends Spy` — 特工繼承間諜能力 |
// | `super()` | `super(codeName)` — 叫用父類構造函數 |
// | 覆寫 | `introduce()` 被子類改寫成不一樣的內容 |
// | `super.方法()` | 子類呼叫父類的原有方法 |
// | `instanceof` | 驗證原型鏈關係 |
// | `static` | `createTeam()` 掛在類別上，不需 new |



// 父類別 — 基礎間諜
class Spy {
  constructor(codeName) {
    this.codeName = codeName;
    this.missionCount = 0;
  }

  report() {
    console.log(`[${this.codeName}] 任務報告：目前執行 ${this.missionCount} 次任務`);
  }

  introduce() {
    console.log(`我是間諜 ${this.codeName}，擅長情報收集`);
  }
}

// 子類別 — 特工繼承間諜
class SecretAgent extends Spy {
  constructor(codeName, specialty) {
    super(codeName);        // ← 必須先呼叫 super()，才能用 this
    this.specialty = specialty; //  子類自己新增的屬性 (特技)
    this.equipment = [];
  }

  // 覆寫 (override) 父類方法
  introduce() {
    console.log(`我是特工 ${this.codeName}，專長是 ${this.specialty}`);
  }

  // 子類自己的方法
  addEquipment(item) {
    super.report();         // 呼叫父類的 report
    console.log(`配備了新道具：${item}`);
  }

  // 靜態方法 — 掛在類別上，不需要實例
  static createTeam(agents) {
    console.log(`組建了 ${agents.length} 人特工團隊`);
    return agents.map(a => a.codeName);
  }
}

// this.specialty = specialty	屬性賦值	從外部傳入的值（建構時給）
// this.equipment = []	屬性初始化	給預設值（空陣列）
// addEquipment(item)	方法	之後可以呼叫的函數
// ① + ② = 定義這個物件有哪些「資料」
// ③ = 定義這個物件有哪些「功能」

// ====== 使用範例 ======

// 建立特工
const agent007 = new SecretAgent("007", "偽裝");
const agent009 = new SecretAgent("009", "駭客");

// 方法覆寫
agent007.introduce();  // "我是特工 007，專長是 偽裝" ← 子類覆寫
agent007.report();     // "[007] 任務報告：目前執行 0 次任務" ← 繼承父類

// 使用 super 呼叫父類
agent009.addEquipment("隱形耳機");
// 輸出：[009] 任務報告：目前執行 0 次任務
//       配備了新道具：隱形耳機

// 原型鏈驗證
console.log(agent007 instanceof SecretAgent); // true
console.log(agent007 instanceof Spy);         // true ← 繼承關係

// 靜態方法
const team = SecretAgent.createTeam([agent007, agent009]);
// 輸出：組建了 2 人特工團隊
console.log(team); // ["007", "009"]


/**
// ## 四、繼承 — ES6 Class + extends

// > **Class 只是語法糖**，底層還是 prototype chain。


// 父類別
class Animal {
  constructor(name) {
    this.name = name;
  }

  speak() {
    console.log(`${this.name} makes a sound.`);
  }
}

// 子類別繼承
class Dog extends Animal {
  constructor(name, breed) {
    super(name);           // ← 必須先呼叫 super()，才能用 this
    this.breed = breed;
  }

  // 覆寫 (override) 父類方法
  speak() {
    console.log(`${this.name} barks.`);
  }

  // 子類自己的方法
  fetch() {
    super.speak();         // 呼叫父類的 speak
    console.log(`${this.name} fetches the ball!`);
  }
}

const d = new Dog("Rex", "Husky");
d.speak();   // "Rex barks."    ← 子類覆寫
d.fetch();   // "Rex makes a sound." + "Rex fetches the ball!"

// 原型鏈驗證
console.log(d instanceof Dog);    // true
console.log(d instanceof Animal); // true
```

// ### 靜態方法 (static)


class MathHelper {
  static add(a, b) { return a + b; }  // 掛在類別上，不需要實例
}
MathHelper.add(1, 2); // 3
// new MathHelper().add(1, 2); // ❌ Error

 */