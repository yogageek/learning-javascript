# JavaScript Web Storage 複習筆記

> **學這個的意義**：Web Storage 是前端「持久化狀態」的基礎。不靠後端，讓資料在頁面重整、關閉分頁後還能保留。實務上登入狀態、使用者設定、購物車草稿全靠這些。

---

## 一、全局總覽

| | localStorage | sessionStorage | Cookie | IndexedDB |
|---|---|---|---|---|
| 容量 | ~5MB | ~5MB | ~4KB | 數百MB+ |
| 生命週期 | 永久（手動清除） | 分頁關閉即消失 | 可設過期時間 | 永久 |
| 跨分頁 | ✓ 同源共享 | ❌ 分頁獨立 | ✓ | ✓ |
| 隨 HTTP 請求發送 | ❌ | ❌ | ✓（自動） | ❌ |
| 可儲存型別 | 字串 | 字串 | 字串 | 任意（含 Blob） |
| JS 存取 | ✓ | ✓ | ✓（非 httpOnly） | ✓ |
| 適用場景 | 使用者設定、主題 | 單次流程狀態 | 認證 Token | 大量結構化資料 |

---

## 二、localStorage

### 基本 API

```js
// ── 寫入 ────────────────────────────────────────────
localStorage.setItem("theme", "dark");
localStorage.setItem("count", "42");          // 只能存字串！

// ── 讀取 ────────────────────────────────────────────
localStorage.getItem("theme");                // "dark"
localStorage.getItem("nonExist");             // null（不是 undefined）

// ── 刪除 ────────────────────────────────────────────
localStorage.removeItem("theme");             // 刪單一 key
localStorage.clear();                         // 清空全部（小心用）

// ── 查詢 ────────────────────────────────────────────
localStorage.length;                          // key 的總數
localStorage.key(0);                          // 第 0 個 key 的名稱（順序不保證）

// ── 儲存物件（必須序列化）───────────────────────────
const user = { name: "Yoga", age: 30 };
localStorage.setItem("user", JSON.stringify(user));  // 物件轉字串

const saved = JSON.parse(localStorage.getItem("user")); // 字串轉回物件
saved.name; // "Yoga"

// ── 安全讀取（避免 JSON.parse 爆炸）─────────────────
function getStorage(key) {
  try {
    return JSON.parse(localStorage.getItem(key));
  } catch {
    return null; // 解析失敗（資料損毀）回傳 null
  }
}
```

---

## 三、sessionStorage

```js
// API 和 localStorage 完全一樣，行為不同

sessionStorage.setItem("step", "2");          // 分頁關閉後消失
sessionStorage.getItem("step");               // "2"
sessionStorage.removeItem("step");
sessionStorage.clear();

// 同一個網站開兩個分頁 → 各自獨立的 sessionStorage
// 用途：多步驟表單、一次性的流程狀態
```

---

## 四、Cookie

```js
// ── 基本讀寫（原生 API 很難用）───────────────────────
document.cookie = "name=Yoga";                         // 寫入
document.cookie = "theme=dark; max-age=86400";         // 一天後過期（秒）
document.cookie = "lang=zh; expires=Fri, 31 Dec 2025 23:59:59 GMT";
document.cookie = "token=abc; path=/; secure; samesite=strict";

document.cookie; // 讀出所有 cookie（整串字串，需要自己解析）
// "name=Yoga; theme=dark; lang=zh"

// ── 手寫解析 helper ─────────────────────────────────
function getCookie(name) {
  return document.cookie
    .split("; ")
    .find(row => row.startsWith(name + "="))
    ?.split("=")[1] ?? null;
}

function setCookie(name, value, days = 7) {
  const expires = new Date(Date.now() + days * 86400000).toUTCString();
  document.cookie = `${name}=${value}; expires=${expires}; path=/`;
}

function deleteCookie(name) {
  document.cookie = `${name}=; max-age=0; path=/`; // max-age=0 立即刪除
}

// ── Cookie 屬性說明 ─────────────────────────────────
// HttpOnly  → JS 無法讀取（防 XSS），只能後端設定
// Secure    → 只在 HTTPS 傳送
// SameSite  → strict（只本站）/ lax（含頂層導航）/ none（跨站，要 Secure）
// max-age   → 秒數，優先於 expires
// path      → 哪個路徑可存取（預設當前路徑）
```

---

## 五、IndexedDB（了解概念即可）

```js
// 適合：離線 App、大量資料、需要索引查詢
// 直接用 API 很繁瑣，實務上用 idb 或 Dexie.js 封裝

const request = indexedDB.open("MyDB", 1);

request.onupgradeneeded = (e) => {
  const db = e.target.result;
  db.createObjectStore("tasks", { keyPath: "id" }); // 建立 store
};

request.onsuccess = (e) => {
  const db = e.target.result;
  const tx = db.transaction("tasks", "readwrite");
  tx.objectStore("tasks").add({ id: 1, text: "學 IndexedDB" });
};
```

---

## 六、實際使用場景

| 場景 | 推薦方案 | 原因 |
|---|---|---|
| 深色/淺色主題 | `localStorage` | 永久保留，跨分頁同步 |
| 語言設定 | `localStorage` | 跨分頁，長期保留 |
| 購物車草稿 | `localStorage` | 關閉後還在，下次繼續 |
| 多步驟表單進度 | `sessionStorage` | 流程完成後自動清除 |
| 分頁間隔離狀態 | `sessionStorage` | 刻意要隔離 |
| 認證 Token | `Cookie（HttpOnly）` | JS 無法讀，防 XSS；自動附在請求 |
| 記住登入（Remember me）| `Cookie + 過期時間` | 可控制生命週期 |
| 離線資料/大量資料 | `IndexedDB` | 容量大、支援查詢 |

---

## 七、使用注意事項

### 安全

```js
// ❌ 不要把 JWT / Access Token 存 localStorage
// 原因：XSS 攻擊可以用 JS 讀走 localStorage，Token 被偷 = 帳號被劫持
// ✓  Access Token 存記憶體（JS 變數），Refresh Token 存 HttpOnly Cookie

// ❌ 不要存敏感資料（密碼、信用卡號）
// localStorage 是明文，DevTools 一眼看穿

// ✓ 存使用者偏好（主題、語系、UI 狀態）— 偷走也無所謂
```

### 容量與例外

```js
// ── 容量限制：大約 5MB，超過會拋 QuotaExceededError ──
function safeSetItem(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (e) {
    if (e.name === "QuotaExceededError") {
      console.warn("Storage 已滿");
    }
    return false;
  }
}

// ── 無痕模式：不同瀏覽器行為不一，可能拋錯 ──────────
function isStorageAvailable() {
  try {
    const key = "__test__";
    localStorage.setItem(key, "1");
    localStorage.removeItem(key);
    return true;
  } catch {
    return false;
  }
}
```

### storage 事件（跨分頁同步）

```js
// 同一網站另一個分頁修改 localStorage 時觸發（本分頁不觸發）
window.addEventListener("storage", (e) => {
  console.log(e.key);      // 被修改的 key
  console.log(e.oldValue); // 舊值
  console.log(e.newValue); // 新值
  console.log(e.url);      // 哪個頁面修改的

  if (e.key === "theme") {
    applyTheme(e.newValue); // 其他分頁改主題，同步更新
  }
});
```

---

## 八、Side Project：使用者設定面板

> 涵蓋：localStorage 讀寫、JSON 序列化、QuotaExceeded 處理、storage 事件、無痕模式偵測、sessionStorage 多步驟表單狀態

```html
<!DOCTYPE html>
<html lang="zh-TW">
<head>
  <meta charset="UTF-8">
  <title>Settings Panel</title>
</head>
<body data-theme="light">
  <!-- 設定面板 -->
  <div id="settings-panel">
    <h2>使用者設定</h2>

    <!-- 主題切換 -->
    <div class="setting-row">
      <label>主題</label>
      <select id="theme-select">
        <option value="light">淺色</option>
        <option value="dark">深色</option>
        <option value="system">跟隨系統</option>
      </select>
    </div>

    <!-- 語言 -->
    <div class="setting-row">
      <label>語言</label>
      <select id="lang-select">
        <option value="zh-TW">繁體中文</option>
        <option value="en">English</option>
      </select>
    </div>

    <!-- 字體大小 -->
    <div class="setting-row">
      <label>字體大小</label>
      <input type="range" id="font-size" min="12" max="24" step="2" />
      <span id="font-size-display">16px</span>
    </div>

    <button id="save-btn">儲存設定</button>
    <button id="reset-btn">恢復預設</button>
    <div id="status-msg"></div>
  </div>

  <!-- 多步驟表單（sessionStorage） -->
  <div id="wizard">
    <h2>多步驟表單（session 暫存）</h2>
    <div id="step-1" class="step">
      <input id="w-name" placeholder="姓名" />
      <button onclick="saveStep(1)">下一步</button>
    </div>
    <div id="step-2" class="step" style="display:none">
      <input id="w-email" placeholder="Email" />
      <button onclick="saveStep(2)">送出</button>
    </div>
  </div>

  <script src="settings.js"></script>
</body>
</html>
```

```js
// settings.js

// ════════════════════════════════════════════════
// 工具函式：安全的 localStorage 讀寫
// ════════════════════════════════════════════════

// 偵測 storage 是否可用（無痕模式可能不支援）
function isStorageAvailable(type = "localStorage") {
  try {
    const storage = window[type];
    const key = "__storage_test__";
    storage.setItem(key, "1");
    storage.removeItem(key);
    return true;
  } catch {
    return false; // 無痕模式或使用者停用 storage
  }
}

// 安全讀取（自動 JSON.parse + 錯誤處理）
function getItem(key, fallback = null) {
  if (!isStorageAvailable()) return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw !== null ? JSON.parse(raw) : fallback; // null 代表 key 不存在
  } catch {
    return fallback; // JSON 解析失敗（資料損毀）
  }
}

// 安全寫入（自動 JSON.stringify + QuotaExceededError 處理）
function setItem(key, value) {
  if (!isStorageAvailable()) return false;
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (e) {
    if (e.name === "QuotaExceededError") {
      showStatus("儲存空間已滿，請清除部分資料", "error");
    }
    return false;
  }
}

// ════════════════════════════════════════════════
// 設定管理
// ════════════════════════════════════════════════

// 預設設定（localStorage 沒有時使用）
const DEFAULTS = {
  theme: "light",
  lang: "zh-TW",
  fontSize: 16
};

const STORAGE_KEY = "app_settings"; // 所有設定合為一個 key，減少 I/O

// 讀取設定（合併預設值，防止舊版缺少新欄位）
function loadSettings() {
  const saved = getItem(STORAGE_KEY, {});
  return { ...DEFAULTS, ...saved }; // saved 覆蓋 DEFAULTS
}

// 儲存設定（整包存入）
function saveSettings(settings) {
  return setItem(STORAGE_KEY, settings);
}

// 套用設定到 UI
function applySettings(settings) {
  // 主題：設定 data-theme 屬性，CSS 靠它切換樣式
  document.body.dataset.theme = settings.theme;

  // 字體大小：直接操作 CSS 變數
  document.documentElement.style.setProperty(
    "--base-font-size", settings.fontSize + "px"
  );

  // 把設定值反映到表單元件
  document.getElementById("theme-select").value = settings.theme;
  document.getElementById("lang-select").value = settings.lang;
  document.getElementById("font-size").value = settings.fontSize;
  document.getElementById("font-size-display").textContent = settings.fontSize + "px";
}

// ════════════════════════════════════════════════
// 事件綁定
// ════════════════════════════════════════════════

// 字體大小：即時預覽（不儲存，只改畫面）
document.getElementById("font-size").addEventListener("input", (e) => {
  const size = e.target.value;
  document.getElementById("font-size-display").textContent = size + "px";
  document.documentElement.style.setProperty("--base-font-size", size + "px");
  // 此時還沒存 localStorage，只是 UI 預覽
});

// 儲存按鈕
document.getElementById("save-btn").addEventListener("click", () => {
  const settings = {
    theme:    document.getElementById("theme-select").value,
    lang:     document.getElementById("lang-select").value,
    fontSize: Number(document.getElementById("font-size").value)
  };

  if (saveSettings(settings)) {
    applySettings(settings);
    showStatus("設定已儲存 ✓", "success");
  }
});

// 重置按鈕
document.getElementById("reset-btn").addEventListener("click", () => {
  localStorage.removeItem(STORAGE_KEY); // 刪除整包設定
  applySettings(DEFAULTS);              // 套用預設值
  showStatus("已恢復預設設定", "info");
});

// ════════════════════════════════════════════════
// storage 事件：其他分頁修改設定時同步
// ════════════════════════════════════════════════

window.addEventListener("storage", (e) => {
  if (e.key !== STORAGE_KEY) return; // 只關心我們的 key

  if (e.newValue === null) {
    // 其他分頁呼叫了 removeItem → 回到預設
    applySettings(DEFAULTS);
    return;
  }

  try {
    const newSettings = JSON.parse(e.newValue);
    applySettings(newSettings);
    showStatus("設定已從其他分頁同步", "info");
  } catch {
    // JSON 解析失敗，忽略
  }
});

// ════════════════════════════════════════════════
// 多步驟表單：用 sessionStorage 暫存進度
// 分頁關閉或完成流程後自動消失，不污染 localStorage
// ════════════════════════════════════════════════

const SESSION_KEY = "wizard_data";

function saveStep(step) {
  const current = JSON.parse(sessionStorage.getItem(SESSION_KEY) || "{}");

  if (step === 1) {
    const name = document.getElementById("w-name").value.trim();
    if (!name) return alert("請輸入姓名");

    // 存入 sessionStorage（分頁關閉後自動清除）
    sessionStorage.setItem(SESSION_KEY, JSON.stringify({ ...current, name }));

    // 切換到第 2 步
    document.getElementById("step-1").style.display = "none";
    document.getElementById("step-2").style.display = "block";
  }

  if (step === 2) {
    const email = document.getElementById("w-email").value.trim();
    if (!email) return alert("請輸入 Email");

    const data = JSON.parse(sessionStorage.getItem(SESSION_KEY));
    console.log("送出資料：", { ...data, email });

    // 流程結束，清除 session 資料
    sessionStorage.removeItem(SESSION_KEY);
    showStatus(`表單送出！姓名：${data.name}，Email：${email}`, "success");
  }
}

// 頁面重整後恢復多步驟表單進度
function restoreWizard() {
  const data = sessionStorage.getItem(SESSION_KEY);
  if (!data) return;

  const parsed = JSON.parse(data);
  if (parsed.name) {
    // 已填完第 1 步，直接顯示第 2 步
    document.getElementById("step-1").style.display = "none";
    document.getElementById("step-2").style.display = "block";
  }
}

// ════════════════════════════════════════════════
// 工具：顯示狀態訊息
// ════════════════════════════════════════════════

function showStatus(msg, type = "info") {
  const el = document.getElementById("status-msg");
  el.textContent = msg;
  el.className = `status-${type}`;

  clearTimeout(el._timer);
  el._timer = setTimeout(() => { el.textContent = ""; }, 3000);
}

// ════════════════════════════════════════════════
// 初始化
// ════════════════════════════════════════════════

const settings = loadSettings(); // 從 localStorage 讀取（或使用預設值）
applySettings(settings);         // 套用到 UI
restoreWizard();                 // 恢復多步驟表單進度（如果有的話）
```

---

## 九、容易搞混的地方

### 坑 1：只能存字串

```js
localStorage.setItem("count", 42);           // 存進去會變 "42"（字串）
localStorage.getItem("count") === 42;        // false！（字串 vs 數字）
localStorage.getItem("count") === "42";      // true

// 讀出來記得轉型
Number(localStorage.getItem("count"));       // 42
JSON.parse(localStorage.getItem("count"));   // 42
```

### 坑 2：`getItem` 不存在回傳 `null`，不是 `undefined`

```js
localStorage.getItem("nonExist");            // null
// 注意不是 undefined，條件判斷要用 !== null
if (localStorage.getItem("token") !== null) { }
```

### 坑 3：`storage` 事件只在**其他分頁**觸發，本頁不觸發

```js
// 同一個分頁修改 localStorage → storage 事件不觸發
// 只有其他分頁的修改才觸發本分頁的 storage 事件
// 所以不要靠 storage 事件監聽自己頁面的修改
```

### 坑 4：`sessionStorage` 重新整理後還在，但開新分頁不會共享

```js
// 重新整理（F5）→ sessionStorage 還在 ✓
// 新分頁輸入同樣 URL → 空的 sessionStorage（獨立）
// Ctrl+T 複製分頁（有些瀏覽器）→ 複製一份 sessionStorage
```

### 坑 5：`localStorage.clear()` 清掉同源所有資料

```js
// ❌ 清空整個 localStorage，影響所有功能
localStorage.clear();

// ✓ 只清自己的 key，不影響其他功能的資料
localStorage.removeItem("app_settings");
// 更好：用 key 前綴統一管理，清除時用 prefix 過濾
Object.keys(localStorage)
  .filter(k => k.startsWith("myapp_"))
  .forEach(k => localStorage.removeItem(k));
```

---

## 十、面試必考題

### Q1：localStorage vs sessionStorage vs Cookie 差異？

> localStorage：永久，跨分頁共享，5MB，JS 存取。  
> sessionStorage：分頁關閉消失，各分頁獨立，5MB，JS 存取。  
> Cookie：可設過期、隨 HTTP 自動發送，4KB，可設 HttpOnly 防 JS 讀取。

### Q2：為什麼不應該把 JWT 存在 localStorage？

> localStorage 可以被 JS 讀取，若網站有 XSS 漏洞，攻擊者注入的腳本可直接竊取 Token。  
> 推薦：Access Token 存 JS 記憶體（頁面關閉即消失），Refresh Token 存 `HttpOnly` Cookie（JS 無法讀取）。

### Q3：如何安全地讀寫 localStorage？

```js
// 必須處理三個問題：
// 1. JSON 解析失敗（資料損毀）
// 2. QuotaExceededError（空間不足）
// 3. 無痕模式（storage 被停用）
function safeGet(key, fallback = null) {
  try {
    const v = localStorage.getItem(key);
    return v !== null ? JSON.parse(v) : fallback;
  } catch { return fallback; }
}
```

### Q4：`storage` 事件的使用場景？

> 跨分頁通訊。同一網站在多個分頁開啟時，其中一個分頁修改 localStorage，其他分頁可以透過 `storage` 事件即時知道並同步 UI（如主題切換、登出同步）。

### Q5：如何實作「頁面重整後恢復表單進度」？

> 用 `sessionStorage`：使用者每次輸入都存一次（`input` 事件），頁面載入時讀取並填回表單。流程完成送出後呼叫 `sessionStorage.removeItem(key)` 清除。

### Q6：如何讓多個功能共用 localStorage 而不互相污染？

```js
// 方法：key 加前綴（namespace）
const KEY = "myapp_v1_settings"; // 前綴 + 版本 + 功能

// 或封裝成 namespace 物件
const storage = {
  get: (key) => JSON.parse(localStorage.getItem(`myapp_${key}`) ?? "null"),
  set: (key, val) => localStorage.setItem(`myapp_${key}`, JSON.stringify(val)),
  remove: (key) => localStorage.removeItem(`myapp_${key}`)
};
```

---

## 十一、關鍵思考點 & 回顧

| 選擇 | 判斷依據 |
|---|---|
| localStorage | 需要長期保留、跨分頁共享 → 主題、語言設定 |
| sessionStorage | 只需要本次流程 → 多步驟表單、一次性狀態 |
| Cookie（HttpOnly） | 需要隨 HTTP 發送、或防 XSS → 認證 Token |
| IndexedDB | 資料量大、需要查詢 → 離線 App、快取 |

**底層邏輯統一理解**：

Web Storage 的本質是「把瀏覽器當作微型資料庫」。選擇哪種儲存方案，核心問題只有三個：
1. **生命週期**：資料要活多久？（關分頁消失 → session；永久 → local）
2. **能見度**：要讓 server 看到嗎？（要 → Cookie；不要 → localStorage）
3. **資料量**：超過 5MB？（超過 → IndexedDB）
