
## 5. `y` 旗標（sticky mode）核心解析

### 一句話總結

> **`y` 旗標要求正規表示式必須從 `lastIndex` 的位置「精確且連續」匹配，不能跳過任何字元。**

---

### `y` vs `g` 行為對照表

| 特性 | `g`（global） | `y`（sticky） |
|------|--------------|---------------|
| 匹配起始點 | 從 `lastIndex` 開始 | 從 `lastIndex` 開始 |
| 允許跳過字元 | ✅ 會跳過不匹配的字元，繼續往後找 | ❌ 必須剛好在 `lastIndex` 位置匹配成功 |
| 匹配失敗時的行為 | 移動 `lastIndex` 繼續嘗試 | 立即返回 `null`，且 `lastIndex` 歸零 |
| 嚴格程度 | 較寬鬆 | 嚴格（黏著） |

---

### 範例：`y` 要求精確位置匹配

```javascript
const reg = /\d/y;   // 數字，黏著模式
const str = "1a2";

// 第一次匹配：從索引 0 開始
console.log(reg.exec(str));  // ["1"]，索引 0 是數字，成功
// 此時 lastIndex 移動到 1

// 第二次匹配：從索引 1 開始
console.log(reg.exec(str));  // null，索引 1 是 "a"，不是數字，失敗
// 失敗後 lastIndex 歸零
```

**圖解說明：**

| 步驟 | `lastIndex` | 字元 | 是否匹配 `/\d/` | 結果 |
|------|-------------|------|----------------|------|
| 第 1 次 | 0 | `"1"` | ✅ 是數字 | 成功，`lastIndex` → 1 |
| 第 2 次 | 1 | `"a"` | ❌ 不是數字 | 失敗，回傳 `null`，`lastIndex` → 0 |

---

### `g` vs `y` 對比範例

```javascript
const str = "a1b2c3";
const gReg = /\d/g;
const yReg = /\d/y;

// === g 模式：可以跳過非數字 ===
console.log(gReg.exec(str));  // ["1"]，跳過 "a"，從索引 1 找到
// lastIndex 變成 2

console.log(gReg.exec(str));  // ["2"]，跳過 "b"，從索引 3 找到
// lastIndex 變成 4

console.log(gReg.exec(str));  // ["3"]，跳過 "c"，從索引 5 找到
// lastIndex 變成 6

// === y 模式：不能跳過任何字元 ===
yReg.lastIndex = 0;
console.log(yReg.exec(str));  // null，索引 0 是 "a"，不是數字，直接失敗
```

| 模式 | 執行過程 | 結果 |
|------|----------|------|
| `g` | `"a"`(跳過) → `"1"`✅ → `"b"`(跳過) → `"2"`✅ → `"c"`(跳過) → `"3"`✅ | 成功找到全部數字 |
| `y` | `"a"`❌（必須從索引 0 匹配數字） | 第一次就失敗 |

---

### `lastIndex` 行為對照表

| 情境 | `g` 模式 | `y` 模式 |
|------|----------|----------|
| 匹配成功 | `lastIndex` 移到下一個位置 | `lastIndex` 移到下一個位置 |
| 匹配失敗 | 自動移動到下一位置繼續嘗試 | 立即失敗，`lastIndex` 歸零 |
| 是否會跳過字元 | ✅ 會 | ❌ 不會 |

---

### 實用場景對照表

| 使用情境 | 建議旗標 | 原因 |
|----------|----------|------|
| 詞法分析（Tokenizer） | `y` | 需要嚴格依序解析，不能跳過字元 |
| 從字串中提取所有數字 | `g` | 允許跳過非目標字元 |
| 驗證特定位置的格式 | `y` | 例如：字串開頭必須是特定模式 |
| 一般搜尋 / 取代 | `g` | 較寬鬆，常用 |

---

### 總結表

| 重點 | 說明 |
|------|------|
| `y` 的核心 | 必須從 `lastIndex` 的位置**精確匹配**，不能跳過任何字元 |
| 與 `g` 的關鍵差異 | `g` 失敗後會繼續往後找；`y` 失敗就結束 |
| 常見誤解 | `y` 不是「從 `lastIndex` 開始往後找」，而是「必須在 `lastIndex` 這個位置匹配成功」 |
| 最佳實務 | 需要嚴格依序解析時使用 `y`；一般搜尋使用 `g` |

---

### 快速測試（可直接貼到瀏覽器主控台）

```javascript
// 測試 y 的嚴格性
const yReg = /\d/y;
const str = "1a2";

console.log(yReg.exec(str));  // ["1"]，成功
console.log(yReg.exec(str));  // null，因為位置 1 是 "a"

// 對比 g 的寬鬆性
const gReg = /\d/g;
console.log(gReg.exec(str));  // ["1"]
console.log(gReg.exec(str));  // ["2"]，跳過了 "a"
```

---

## `y` 旗標的實戰意義：為什麼「失敗就停止」有用？

你問到重點了！表面上看 `y` 好像很「笨」，但這個特性在特定場景下**非常實用**。

---

## 核心價值：確保「連續性」

| 場景 | `g` 模式（跳過字元） | `y` 模式（嚴格連續） |
|------|---------------------|---------------------|
| 解析 `"123abc456"` | 會抓出 123 和 456 | 抓到 123 後，遇到 `a` 就停 |
| 你想知道的是 | 「裡面有哪些數字」 | 「從開頭連續的數字有多長」 |

> **白話解釋**：`y` 不是用來「找東西」，而是用來「確認格式是否從某個位置開始連續符合規則」。

---

## 實戰案例 1：解析「嚴格格式」的字串

### 情境：解析用戶輸入的「年齡 + 備註」

```javascript
// 規則：開頭必須是數字（年齡），後面接任意文字
// 用 y 確保「第一個字元就必須是數字」

const agePattern = /\d+/y;
const input1 = "25歲，住在台北";
const input2 = "二十五歲，住在台北";  // 中文數字，不符合

agePattern.lastIndex = 0;
console.log(agePattern.exec(input1));  // ["25"] ✅ 成功

agePattern.lastIndex = 0;
console.log(agePattern.exec(input2));  // null ❌ 第一個字就不是數字，直接拒絕
```

> 如果只用 `g`，它會跳過「二」繼續往後找，可能誤判。

---

## 實戰案例 2：詞法分析（Tokenizer）

### 情境：解析程式碼或數學表達式

```javascript
// 要解析的字串：數字必須連續出現，不能混雜其他字元
const tokens = ["123", "45a6", "789"];
const numberPattern = /^\d+/y;  // 必須從字串開頭就是數字

tokens.forEach(token => {
    numberPattern.lastIndex = 0;
    const match = numberPattern.exec(token);
    if (match && match[0].length === token.length) {
        console.log(`✅ 純數字：${token}`);
    } else {
        console.log(`❌ 不是純數字：${token}`);
    }
});

// 輸出：
// ✅ 純數字：123
// ❌ 不是純數字：45a6（因為 a 中斷了連續性）
// ✅ 純數字：789
```

---

## 實戰案例 3：驗證「無間斷」的資料格式

### 情境：信用卡號輸入（每 4 位一組）

```javascript
// 規則：輸入必須是「數字 + 空格 + 數字 + 空格...」嚴格格式
const cardPattern = /^\d{4} \d{4} \d{4} \d{4}$/y;

const validCard = "1234 5678 9012 3456";
const invalidCard = "1234 5678 90AB 3456";  // 出現字母

cardPattern.lastIndex = 0;
console.log(cardPattern.test(validCard));    // true

cardPattern.lastIndex = 0;
console.log(cardPattern.test(invalidCard));  // false（AB 不是數字）
```

> 如果用 `g`，它可能會跳過 `AB` 繼續找，導致錯誤判斷為有效。

---

## 對照總結：什麼時候用 `y`？

| 使用情境 | 為什麼適合用 `y` | 用 `g` 會怎樣 |
|----------|-----------------|---------------|
| 驗證密碼格式（開頭必須是字母） | 確保第一個字元符合規則 | 可能跳過錯誤字元，誤判為有效 |
| 解析 CSV 中的純數字欄位 | 確保整欄都是數字，沒有混雜文字 | 會取出部分數字，忽略後面的錯誤 |
| 編寫編譯器 / 直譯器 | 需要嚴格的「当前位置」解析 | 會跳過錯誤，導致解析錯亂 |
| 分段解析（如解析 HTTP 標頭） | 每一段都必須從特定位置開始 | 可能跳過換行或空格，解析錯誤 |

---

## 一句話記憶

> **`g` 是「在字串裡找東西」，`y` 是「確認從這裡開始符不符合規則」。**

當你需要的是「嚴格檢查格式是否連續正確」，而不是「從字串裡撈出符合條件的片段」時，就用 `y`。