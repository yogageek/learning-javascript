# RegExp 旗標（Flags）

JavaScript 的正規表達式除了樣式本身，還可以搭配 `flag` 來改變比對行為。

常見寫法：

```js
/pattern/flags
```

例如：

```js
/you/gi
```

這表示：

- `g`：全域搜尋
- `i`：忽略大小寫

## 常用旗標整理

| 旗標 | 名稱 | 說明 |
| --- | --- | --- |
| `g` | `global` | 全域搜尋，找出所有符合結果 |
| `i` | `ignoreCase` | 忽略英文大小寫 |
| `m` | `multiline` | 多行模式，讓 `^` 和 `$` 以每一行為基準 |
| `s` | `dotAll` | 讓 `.` 也能匹配換行字元 |
| `y` | `sticky` | 從 `lastIndex` 指定位置開始，且必須緊接著匹配 |
| `u` | `unicode` | 以 Unicode 模式解析，處理特殊字元更安全 |

## 1. `g`：global

沒有 `g` 時，通常只會拿到第一個匹配結果；加上 `g` 之後，會找出所有符合的內容。

```js
const str = "cat bat cat";

console.log(str.match(/cat/));   // ["cat"]
console.log(str.match(/cat/g));  // ["cat", "cat"]
```

適合搭配：

- `match()`
- `replace()`
- `exec()`

## 2. `i`：ignoreCase

忽略大小寫，常用在英文字串搜尋。

```js
const str = "You and YOU and you";

console.log(str.match(/you/i));  // ["You"]
console.log(str.match(/you/gi)); // ["You", "YOU", "you"]
```

更準確的單獨例子：

```js
console.log("You".match(/you/));   // null
console.log("You".match(/you/i));  // ["You"]
```

## 3. `m`：multiline

`m` 會影響 `^` 與 `$` 的判斷方式。

- 沒有 `m`：`^` 只匹配整個字串開頭，`$` 只匹配整個字串結尾
- 有 `m`：`^` 和 `$` 會改成每一行都生效

```js
const str = `apple
banana
cat`;

console.log(str.match(/^banana/));   // null
console.log(str.match(/^banana/m));  // ["banana"]
```

## 4. `s`：dotAll

一般情況下，`.` 不會匹配換行字元；加上 `s` 之後，`.` 才能跨行匹配。

```js
const str = "hello\nworld";

console.log(/hello.world/.test(str));   // false
console.log(/hello.world/s.test(str));  // true
```

## 5. `y`：sticky

`y` 和 `g` 都會受到 `lastIndex` 影響，但 `y` 更嚴格。

- `g`：從 `lastIndex` 之後繼續找，後面找到也算成功
- `y`：必須剛好從 `lastIndex` 的位置開始匹配，不能跳過字元

```js
const reg = /\d/y;
const str = "1a2";

console.log(reg.exec(str)); // ["1"]
console.log(reg.exec(str)); // null，因為下一個位置是 "a"
```

這個旗標適合做依序掃描字串的情境。

### `lastIndex` 會怎麼變

`sticky` 的重點不是只看有沒有匹配到，而是要一起觀察 `lastIndex`。

```js
const reg = /\d/y;
const str = "1a2";

console.log(reg.lastIndex);      // 0
console.log(reg.exec(str));      // ["1"]
console.log(reg.lastIndex);      // 1

console.log(reg.exec(str));      // null
console.log(reg.lastIndex);      // 0
```

說明：

- 第一次從索引 `0` 開始，剛好是 `"1"`，所以匹配成功
- 成功後，`lastIndex` 會移到匹配結束的位置，也就是 `1`
- 第二次會要求從索引 `1` 開始匹配
- 但索引 `1` 的字元是 `"a"`，不是數字，所以失敗
- 失敗後，`lastIndex` 會重設回 `0`

這點很重要，因為 `y` 不會像 `g` 一樣自動往後找下一個可能位置。

### 和 `g` 對照看差異

同一段字串，如果改用 `g`，行為就不同：

```js
const reg = /\d/g;
const str = "1a2";

console.log(reg.exec(str)); // ["1"]
console.log(reg.exec(str)); // ["2"]
```

原因是：

- 第一次一樣先匹配到 `"1"`
- 第二次雖然 `lastIndex` 在索引 `1`
- `g` 會繼續往後找
- 所以它會跳過 `"a"`，最後在索引 `2` 找到 `"2"`

也就是說：

- `g` 比較像「往後搜尋下一個符合的內容」
- `y` 比較像「下一個位置必須立刻符合」

### 一個更明顯的例子

```js
const str = "cat,bat";

console.log(/\w+/g.exec(str)); // ["cat"]
console.log(/\w+/y.exec(str)); // ["cat"]
```

如果改成同一個 RegExp 物件連續執行：

```js
const regG = /\w+/g;
const regY = /\w+/y;
const str = "cat,bat";

console.log(regG.exec(str)); // ["cat"]
console.log(regG.exec(str)); // ["bat"]

console.log(regY.exec(str)); // ["cat"]
console.log(regY.exec(str)); // null
```

原因是：

- `regG` 第二次執行時，可以跳過逗號再找到 `"bat"`
- `regY` 第二次執行時，必須從逗號那個位置直接開始匹配
- 逗號不符合 `\w+`，所以直接失敗

### `y` 適合什麼情境

`y` 很適合拿來做「按順序解析」的工作，例如：

- 逐字掃描字串
- 自製簡單 tokenizer
- 解析固定格式資料
- 確保每一步都緊接著上一段內容

例如你想確認一段格式是不是完全照順序出現：

```js
const str = "123-456";
const reg = /\d+/y;

console.log(reg.exec(str)); // ["123"]
console.log(reg.lastIndex); // 3

reg.lastIndex = 4;
console.log(reg.exec(str)); // ["456"]
```

如果中間位置沒有對好，`y` 就會立刻失敗。這很適合拿來做格式驗證。

### 手動控制 `lastIndex`

`y` 常常會搭配手動設定 `lastIndex` 使用。

```js
const reg = /\d+/y;
const str = "abc123def";

reg.lastIndex = 3;
console.log(reg.exec(str)); // ["123"]

reg.lastIndex = 0;
console.log(reg.exec(str)); // null
```

這表示：

- 當起點設在 `3`，剛好遇到數字，所以成功
- 當起點設在 `0`，一開始是 `"a"`，不符合，所以失敗

### 使用 `y` 時的觀念

可以把 `y` 想成：

- 不是「幫你往後搜尋」
- 而是「我指定這裡開始，你只能從這裡匹配」

所以 `y` 的關鍵不是找得多，而是找得準。

## 6. `u`：unicode

`u` 會讓正規表達式用 Unicode 規則解析，對 emoji、代理對字元、Unicode escape 等情況更安全。

```js
console.log(/^.$/.test("😀"));   // false
console.log(/^.$/u.test("😀"));  // true
```

如果要處理非 ASCII 字元，通常建議加上 `u`。

## 旗標屬性

可以透過 RegExp 物件查看旗標資訊：

```js
const target = "Life was like a box of chocolates.\nYou never know...";
const reg = /\r\n|\n/g;

console.log(reg.flags);   // "g"
console.log(reg.global);  // true
```









常見屬性：

- `reg.flags`
- `reg.global`
- `reg.ignoreCase`
- `reg.multiline`
- `reg.dotAll`
- `reg.sticky`
- `reg.unicode`

## 常見搭配

```js
/keyword/gi
```

用途：

- 全域搜尋
- 忽略大小寫

```js
/^start/m
```

用途：

- 在多行文字中，找出每一行開頭是 `start` 的內容

```js
/.+/gs
```

用途：

- 全域搜尋
- `.` 可跨行匹配

## 小結

最常用的旗標通常是：

- `g`：找全部
- `i`：忽略大小寫
- `m`：多行開頭結尾判斷
- `s`：讓 `.` 跨行
- `u`：正確處理 Unicode

實務上最常看到的組合是 `gi`。
