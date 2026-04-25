屬性分類,屬性名稱,資料型別,說明
結構組成,source,字串,正規表達式的文本內容（不含斜線與旗標）。
結構組成,flags,字串,"目前啟用的所有旗標，依字母順序排列（如 ""giu""）。"
掃描狀態,lastIndex,數字,唯一可修改。設定下一次比對的起始索引位置（須搭配 g 或 y）。

### 程式碼整合範例
```javascript
const regex = /apple/giu;

// 旗標屬性檢查
console.log(regex.global);     // true
console.log(regex.ignoreCase); // true
console.log(regex.unicode);    // true

// 結構屬性檢查
console.log(regex.source);     // "apple"
console.log(regex.flags);      // "giu"

// 狀態屬性操作
const str = "apple apple";
regex.test(str); 
console.log(regex.lastIndex);  // 5 (下一次從索引 5 開始比對)
```


這是一份優化後的內容，採用了表格與結構化的方式來提升閱讀體驗，並補充了相關開發知識。

---

# JavaScript 正則表達式 (RegExp) 核心屬性解析

在 JavaScript 中，`RegExp` 物件包含了描述正則表達式行為與狀態的屬性。理解這些屬性能夠幫助開發者更精確地控制比對邏輯。

## 屬性一覽表

這些屬性主要分為「結構組成」與「掃描狀態」兩大類：

| 分類 | 屬性名稱 | 資料型別 | 說明 |
| :--- | :--- | :--- | :--- |
| **結構組成** | `source` | `string` | 正規表達式的核心文本（不包含邊界符 `/` 與旗標）。 |
| **結構組成** | `flags` | `string` | 目前啟用的所有旗標，會自動依照字母順序排列（如 `"giu"`）。 |
| **掃描狀態** | `lastIndex` | `number` | 下一次比對的起始索引位置。**唯有此屬性可寫入**。 |

---

## 關鍵補充知識

1.  **關於 `lastIndex` 的限制**：
    *   `lastIndex` 屬性僅在啟用了 **全域旗標 (`g`)** 或 **黏性旗標 (`y`)** 時才會產生作用。
    *   若未啟用上述旗標，`lastIndex` 的值會被忽略（或維持為 `0`）。
2.  **旗標檢測屬性**：
    除了 `flags` 字串屬性外，JavaScript 也提供了布林值屬性（如 `global`, `ignoreCase`, `multiline`, `unicode`, `sticky` 等）供開發者快速判斷特定旗標是否啟用。
3.  **不可變性 (Immutability)**：
    除了 `lastIndex` 之外，`source` 與 `flags` 等結構屬性皆為**唯讀 (Read-only)**，無法在初始化後修改。若需變更，必須重新建立一個新的 `RegExp` 物件。

---

## 程式碼整合範例

以下展示如何存取這些屬性以及 `lastIndex` 的實際運作機制：

```javascript
const regex = /apple/giu;

// 1. 旗標屬性檢查 (布林值形式)
console.log(regex.global);     // true
console.log(regex.ignoreCase); // true
console.log(regex.unicode);    // true

// 2. 結構屬性檢查
console.log(regex.source);     // "apple"
console.log(regex.flags);      // "giu"

// 3. 狀態屬性操作 (lastIndex)
const str = "apple apple";

// 第一次執行匹配
regex.test(str); 
console.log(regex.lastIndex);  // 5，表示指標已移至第一個 "apple" 之後

// 第二次執行匹配
regex.test(str);
console.log(regex.lastIndex);  // 11，匹配結束
```

### 最佳實踐建議
*   若需動態產生正則表達式，建議使用 `new RegExp(pattern, flags)` 建構子。
*   在處理大型字串的多次比對時，妥善利用 `lastIndex` 可以有效提升效能並避免無窮迴圈（尤其是在使用 `exec()` 方法時）。



好的，我將這兩點核心概念整合進之前的內容，並加入了具體的程式碼範例供您參考：

---

### 1. 旗標檢測屬性 (Flag Boolean Properties)
除了使用 `flags` 屬性取得字串結果外，JavaScript 還提供了專屬的布林值屬性，讓您可以更直觀地進行邏輯判斷。

**程式碼範例：**
```javascript
const regex = /apple/gim;

// 直接判斷是否包含特定旗標
console.log(regex.global);     // true
console.log(regex.ignoreCase); // true
console.log(regex.multiline);  // true
console.log(regex.unicode);    // false (未設定)
console.log(regex.sticky);     // false (未設定)
```

---

### 2. 不可變性 (Immutability)
`RegExp` 物件的核心屬性（`source`、`flags` 以及各類旗標布林屬性）在建立後均為**唯讀 (Read-only)**。若您嘗試直接修改這些屬性，JavaScript 不會報錯，但該值將不會改變。

**程式碼範例：**
```javascript
const regex = /abc/g;

// 嘗試修改唯讀屬性（無效操作）
regex.source = "xyz"; 
console.log(regex.source); // 依然輸出 "abc"，修改失敗

regex.flags = "i";         
console.log(regex.flags);  // 依然輸出 "g"，修改失敗

// 若需要更改規則，必須重新實例化
const newRegex = new RegExp("xyz", "i");
console.log(newRegex.source); // "xyz"
console.log(newRegex.flags);  // "i"
```

---

### 💡 核心重點總結
*   **讀取性 (Read-only)**：所有的結構組成屬性在實例化後即鎖定。
*   **動態性 (Mutable)**：唯獨 `lastIndex` 是唯一可以被手動修改的狀態屬性，這也是在全域匹配（Global）時進行流程控制的核心關鍵。