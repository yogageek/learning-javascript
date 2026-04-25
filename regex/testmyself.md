以下結合《SPY×FAMILY 間諜家家酒》角色與設定，提供 100 個 JavaScript 正則表達式 (Regex) 代碼範例。為符合**邏輯嚴謹、言簡意賅**且**不使用比喻**的要求，所有註解均直接描述匹配邏輯。

---

## 1. 基礎字面匹配 (1-10)
```javascript
const r1 = /Loid/; // 匹配字串中的 "Loid"
const r2 = /Anya/i; // 匹配 "Anya"，不區分大小寫
const r3 = /Yor/; // 匹配字串中的 "Yor"
const r4 = /Bond/; // 匹配字串中的 "Bond"
const r5 = /Forger/g; // 全域匹配字串中所有的 "Forger"
const r6 = /Eden/; // 匹配 "Eden"
const r7 = /Starlight/; // 匹配 "Starlight"
const r8 = /Stella/; // 匹配 "Stella"
const r9 = /Tonitrus/; // 匹配 "Tonitrus"
const r10 = /WISE/; // 匹配 "WISE"
```

## 2. 邊界與錨點 (11-20)
```javascript
const r11 = /^Loid/; // 匹配以 "Loid" 開頭的字串
const r12 = /Anya$/; // 匹配以 "Anya" 結尾的字串
const r13 = /^Yor$/; // 僅匹配精確為 "Yor" 的字串
const r14 = /\bBond\b/; // 匹配獨立單詞 "Bond"（單詞邊界）
const r15 = /\BForger/; // 匹配非單詞邊界開始的 "Forger"
const r16 = /^Starlight Anya$/; // 精確匹配完整句子
const r17 = /^[^Anya]/; // 匹配開頭不是 "Anya" 的字串
const r18 = /[^Bond]$/; // 匹配結尾不是 "Bond" 的字串
const r19 = /^/; // 匹配字串起始位置（寬度為 0）
const r20 = /$/; // 匹配字串末尾位置（寬度為 0）
```

## 3. 字元類別與集合 (21-35)
```javascript
const r21 = /[LAY]/; // 匹配 "L", "A" 或 "Y" 任一字元
const r22 = /[a-z]nya/; // 匹配小寫字母後接 "nya"（如 anya, bnya）
const r23 = /[0-9]stella/; // 匹配數字後接 "stella"
const r24 = /[^0-9]/; // 匹配任何非數字字元
const r25 = /\d/; // 匹配任一數字，等同 [0-9]
const r26 = /\D/; // 匹配任一非數字，等同 [^0-9]
const r27 = /\w/; // 匹配字母、數字、底線，等同 [A-Za-z0-9_]
const r28 = /\W/; // 匹配非單字字元，等同 [^A-Za-z0-9_]
const r29 = /\s/; // 匹配空白字元（空格、Tab、換行）
const r30 = /\S/; // 匹配非空白字元
const r31 = /ID-\d\d\d/; // 匹配 ID- 後接三位數字
const r32 = /[A-Z]{3}/; // 匹配連續三個大寫字母
const r33 = /[a-zA-Z]/; // 匹配任一英文字母
const r34 = /[.?!]/; // 匹配句尾標點符號
const r35 = /[\s\d]/; // 匹配空白或數字
```

## 4. 量詞應用 (36-50)
```javascript
const r36 = /Anya+/; // 匹配 "Any" 後接 1 個以上 "a"
const r37 = /Anya*/; // 匹配 "Any" 後接 0 個以上 "a"
const r38 = /Anya?/; // 匹配 "Any" 後接 0 或 1 個 "a"
const r39 = /stella{2}/; // 匹配 "stell" 後接 2 個 "a"
const r40 = /stella{2,}/; // 匹配 "stell" 後接至少 2 個 "a"
const r41 = /stella{2,5}/; // 匹配 "stell" 後接 2 到 5 個 "a"
const r42 = /(Waku){2}/; // 匹配連續兩次 "Waku"
const r43 = /\d+/; // 匹配連續數字
const r44 = /\w{5,}/; // 匹配至少 5 個單字字元
const r45 = /Spy?/; // 匹配 "Sp" 後接可選的 "y"
const r46 = /Peanuts*/; // 匹配 "Peanut" 後接 0 到多個 "s"
const r47 = /.+/; // 匹配至少一個非換行字元
const r48 = /\d{1,}/; // 匹配至少一位數字（等同 +）
const r49 = /ID-\d{0,}/; // 匹配 ID- 後接 0 到多個數字（等同 *）
const r50 = /Agent(00)?/; // 匹配 "Agent" 後接 0 或 1 個 "00"
```

## 5. 分組與選擇 (51-65)
```javascript
const r51 = /Loid|Yor|Anya/; // 匹配 "Loid" 或 "Yor" 或 "Anya"
const r52 = /(Loid|Yor) Forger/; // 匹配 "Loid Forger" 或 "Yor Forger"
const r53 = /(?:Anya|Bond)/; // 非捕獲分組，匹配但不用於 exec 回傳
const r54 = /(Starlight) \1/; // 反向引用，匹配 "Starlight Starlight"
const r55 = /(A)(n)(y)(a)/; // 捕獲四個字母分組
const r56 = /Operation (Strix|Owl)/; // 匹配 "Operation Strix" 或 "Operation Owl"
const r57 = /Westalis|Ostania/; // 匹配兩個地區名稱
const r58 = /(Loid|Yor) (Anya|Bond)/; // 匹配成員組合
```

```javascript
const r59 = /Agent (Twilight|Daybreak)/; // 匹配不同代號
const r60 = /Grade [ABC]/; // 匹配 Grade A, Grade B 或 Grade C
const r61 = /(...)-\1/; // 匹配三個字元並重複一次（如 ABC-ABC）
const r62 = /Mission (?:Incomplete|Complete)/; // 非捕獲組選取任務狀態
```

## 6. 斷言與進階匹配 (66-80)
```javascript
const r66 = /Loid(?= Forger)/; // 正向先行斷言，Loid 後必須是 " Forger"
const r67 = /Loid(?! Forger)/; // 負向先行斷言，Loid 後不能是 " Forger"
const r68 = /(?<=Mr. )Loid/; // 正向後行斷言，Loid 前必須是 "Mr. "
const r69 = /(?<!Mrs. )Yor/; // 負向後行斷言，Yor 前不能是 "Mrs. "
const r70 = /\d+(?=%)/; // 匹配百分比前的數字
const r71 = /Loid|Yor/g; // 全域選擇
const r72 = /[a-z]/m; // 多行匹配小寫字母
const r73 = /./s; // dotAll 模式，使 . 匹配換行符
const r74 = /\d+y/y; // 粘性匹配數字後接 y
const r75 = /Anya/u; // Unicode 模式匹配
const r76 = /(?<firstName>\w+) Forger/; // 具名捕獲組
const r77 = /Loid(?=\s\w+)/; // 匹配後方有空白與單字的 Loid
const r78 = /[\u4e00-\u9fa5]/; // 匹配中文字元（若有中文翻譯）
const r79 = /\x41/; // 匹配十六進位字元 "A"
const r80 = /\u0041/; // 匹配 Unicode 字元 "A"
```

## 7. 綜合實戰範例 (81-100)
```javascript
const r81 = /^ID-\d{6}$/; // 驗證 ID 為 "ID-" 加 6 位數字
const r82 = /^\+?\d{10,15}$/; // 驗證國際電話號碼格式
const r83 = /\s+/g; // 匹配並用於移除多餘空格
const r84 = /^[a-zA-Z0-9._%+-]+@wise\.gov$/; // 驗證內部郵箱後綴
const r85 = /<spy>(.*?)<\/spy>/; // 匹配並獲取標籤內內容（非貪婪）
const r86 = /^\s*$/; // 匹配空字串或僅含空白的字串
const r87 = /\d{4}-\d{2}-\d{2}/; // 匹配日期格式 YYYY-MM-DD
const r88 = /https?:\/\/[^\s]+/; // 匹配 URL
const r89 = /#[a-fA-F0-9]{6}/; // 匹配十六進位顏色代碼
const r90 = /^.{8,16}$/; // 驗證字串長度在 8 到 16 之間
const r91 = /\b(Anya|Bond)\b/g; // 提取句子中所有 Anya 或 Bond 單詞
const r92 = /([a-z])\1+/; // 匹配重複出現的字元（如 "ss"）
const r93 = /"([^"]*)"/; // 提取雙引號內的內容
const r94 = /^[A-Z][a-z]*$/; // 驗證首字母大寫的單詞
const r95 = /(?:\d{1,3}\.){3}\d{1,3}/; // 匹配 IP 位址
const r96 = /forger/gi; // 全域、不分大小寫匹配 forger
const r97 = /\n/g; // 匹配所有換行符
const r98 = /\r?\n/; // 匹配 Windows 或 Unix 換行符
const r99 = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // 基礎 Email 格式驗證
const r100 = /^(?=.*[A-Z])(?=.*\d).{8,}$/; // 驗證包含至少一大寫及一數字，長度 8 以上
```