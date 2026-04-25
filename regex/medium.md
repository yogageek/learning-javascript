

# 來點正規表達式 (RegExp)

> 作者：Ben  
> 發佈於：生活的各種可能性  
> 日期：2022-06-30

## 基本宣告與修飾符

```javascript
//---宣告方式---//
// 接受動態內容插入
const regexp = new RegExp()
// 一開始就必須定義好
const slashRegexp = /pattern/

//---修飾符種類---//
const exampleReg = /1234/g
// i：不區分大小寫
// g：搜尋所有匹配項，沒有g的狀況下只會找到第一個匹配的
// m：多行匹配模式
// s：允許dotall模式，允許.匹配換行符\n
// u：完整的unicode支持
```

首先宣告正規表達式的方式有兩種，就依當下的情境選擇什麼樣的宣告方式。特別要注意的地方，內容的範圍是在兩條斜線之間 (`/your pattern/`)，且在匹配條件的內容中很多符號都有自己的意思，而如果我們要單純抓取那個符號的話還必須使用轉義的方式去抓取他。

修飾符的部分會跟在宣告 pattern 的後面 (`/your pattern/修飾符`)，就像上面的範例一樣，`/1234/g`，這個匹配模式會幫助我們找到所有匹配 1234 的選項，也就是 `g` 這個修飾符所代表的意思。

## 常用、轉義、特殊字符

```javascript
// 常用字符：
// . ：用來匹配除了換行符號之外所有字符
// \d：匹配任意1個數字
// \w：代表任意英文字母或數字或 '_'
// \s：匹配空白字元

// 轉義字符：反斜線用來轉義特殊字符為常規字符（\ ^ $ . | ? * + ( )）
let regStr = /\d\.\d/g
let tnsStr = "Chapter 5.1"
console.log(tnsStr.match(regStr)) // 匹配任意數字（\d）接著轉義（\.）再任意數字

let regStr2 = /\//g
console.log("/".match(regStr2)) // 匹配任何斜線（/），需轉義
```

這邊介紹常用的字符，像 `.`、`\d`、`\w`、`\s`，這些都是常使用的搜索條件。接著是特別的反斜線，反斜線通常我們會用來當作搜索條件的前綴，但如果不是搭配搜索條件的狀況下，會是用來轉義特殊字符為一般字符的，如 `( \ ^ $ . | ? * + ( ) )`，這邊要特別注意的是連括號本身都是有特殊意義的，所以必須特別注意。

## 錨點匹配符

```javascript
//--- 錨點匹配符（^ 和 $）---//
// 常用來是否完全匹配一個 pattern
// ^ => 開頭
// $ => 結尾
// ^...$ => 完全匹配
let anchorRegexp = /^\d\d:\d\d$/
let anchorStr1 = "12:34"
let anchorStr2 = "12:345"
console.log('anchor1', anchorRegexp.test(anchorStr1)) // true
console.log('anchor2', anchorRegexp.test(anchorStr2)) // false
```

錨點符幫助我們鎖定匹配特定開頭、結尾或是全部符合的模式。上方的例子中我們要尋找一個完全匹配 `anchorRegexp` 的 String，`anchorStr1` 是 `true`，因為他完全符合我們的模式（兩個任意數字 `\d\d` 開頭且後面接著 `:` 而後再接著兩個任意數字結尾），`anchorStr2` 就沒有符合該條件，因為結尾的部分並不符合兩個任意數字（他有三個）。

## 修飾符 m、u、y

```javascript
// 修飾符 u（開啟完整的 unicode 支持）
// 抓取中文字符
let chRegexp = /\p{sc=Han}/gu
let chStr = 'Hello 32323 你好啊 Welcome'
console.log(chStr.match(chRegexp))

// 抓取貨幣字符
let currencyRegexp = /\p{Sc}\d/gu
let currencyStr = 'Prices: $2, €1, ¥9'
console.log(currencyStr.match(currencyRegexp))

// 修飾符 m（開啟多行模式）
let mStr = '12 apple banana\n34 coffee cake\n56 milk drink'
let startMRegexp = /^\d+/gm      // 抓取行開頭為數字且字數至少為1的內容
let endMRegexp = /\w+$/gmi       // 抓取結尾匹配任意英文字母或數字或 '_'
console.log('start m mode', mStr.match(startMRegexp))
console.log('end m mode', mStr.match(endMRegexp))

// 修飾符 y（指定位置的搜尋模式）
// 修飾符可以在我們指定的位置上開始執行搜尋（在有 y 或 g 的修飾符下）
// exec：搜索匹配結果，返回一個 array 或是 null
let yStr = "yString"
let yRegexp = /\w+/y
yRegexp.lastIndex = 4
console.log('modefiler y', yRegexp.exec(yStr))
```

- **修飾符 u**：開啟完整的 Unicode 支持，讓模式可以支持更完整的搜尋類別。上述兩個範例一個是抓取中文字符和貨幣符號的範例，`p{pattern}`，括弧裡是種類的代號，中文為 `sc=Han`，貨幣字符為 `Sc`。
- **修飾符 m**：多行模式，幫助我們可以在多行模式下抓取到我們要的結果（以換行為分界點）。
- **修飾符 y**：在有修飾符 `y` 的狀況下，我們可以用 `regexp.lastIndex` 來指定搜尋的位置，沒有 `y` 的狀況下則 `lastIndex` 沒有作用。

## 詞邊界與集合範圍

詞邊界 `\b` 用來判斷該詞是否已經結束，分別有三種情境（此處原文未完整列出，但常見為：`\w` 與非 `\w` 之間的位置）。

集合範圍 `[ ]` 有三個地方要特別注意：

1. 特殊字符都不用轉義就能直接以字符去搜索。
2. 另一個地方則是 `[^]`，這樣的表達形式後面接著內容是**排除**這些搜索的範圍。
3. 破折號有特殊含義，但只在他位於兩個字符中間才會產生作用，否則就只會是單純的搜索範圍。

## 量詞

```javascript
//--- 量詞：{n}、?、*、+ ---//
// {n}：數量
console.log("i m 246810 years old".match(/\d{6}/g))   // 6位數字
console.log("123 4567 12 1 234654".match(/\d{3,}/g))  // 3位數字以上
console.log("123 4567 12 1 234654".match(/\d{3,4}/g)) // 3-4位數字

// ?：可選 => ou?r，查找 o 後面有 0 個或 1 個 u 再來是 r
console.log("colo color colou colour".match(/colou?r/g))

// +：一個或多個，相當於 {1,}
console.log("+886 0912-987322".match(/\d+/g))   // 所有數字
console.log("+100 10 1".match(/\d0+/g))         // 100, 10

// *：零個或多個，相當於 {0,}
console.log("*100 10 1".match(/\d0*/g))         // 100, 10, 1

// more example
// 找出有小數點的數字內容
console.log("0 1 12.33445 1.3 1004".match(/\d+\.\d+/g))
// \d+：匹配至少1個以上的任意數字
// \.：轉義 .
// \d+：再匹配至少1個任意數字的結尾的內容

// 找出符合 ... 或 ....
console.log("Hello!... How goes?....".match(/\.{3,}/g))
// \.：反斜線轉義 .
// {3,}：找符合3個或3個以上的對象

// 找尋色碼
console.log(
  'color:#121212; background-color:#AA00ef; bad-colors:#fddee #fd2 #12345678'.match(/#[a-f0-9]{6}\b/gi)
)
// #：開頭
// [a-f0-9]：條件範圍
// {6}：位數範圍
// \b：找出符合邊界條件，排除沒有邊界的對象
// 修飾符 i：不分大小寫
```

量詞的部分為 4 個，依情境使用：

- `{n}`：可以決定範圍，例如 `{1,4}` 抓取最少 1 個最多 4 個，或是 `{1,}` 最少抓取 1 個以上。
- `?`：可選項，前方的內容為可選項，可有可無。
- `+`：至少抓取 1 個或 1 個以上，等同於 `{1,}`。
- `*`：至少抓取 0 個或 0 個以上，等同於 `{0,}`。


## 貪婪量詞（Greedy）與惰性量詞（Lazy）

### 基本概念

常見量詞：
- `+`   => 1 次以上
- `*`   => 0 次以上
- `{n,m}` => n 到 m 次

**這些量詞預設都是「貪婪量詞」**  
也就是：在整體規則仍然成立的前提下，會盡可能多匹配字元。

**如果在量詞後面加上 `?`**，例如 `+?`、`*?`、`{n,m}?`，就會變成「惰性量詞」  
意思是：在整體規則成立的前提下，盡可能少匹配字元。

---

### 錯誤範例：找出被 `""` 包住的內容

```javascript
console.log(
  'Hello world "Welcome" and "have fun"'.match(/".+"/g)
)
// 結果：['"Welcome" and "have fun"']
```

**為什麼？**

1. 先匹配第一個 `"`
2. `.+` 會貪婪地吃掉後面盡可能多的字元
3. 它會一路吃到最後一個 `"` 前面才停
4. 因此整段 `"Welcome" and "have fun"` 被當成一次匹配

這就是貪婪量詞的典型行為：**能多吃就多吃**。

---

### 修正範例：加上 `?` 變成惰性量詞

```javascript
console.log(
  'Hello world "Welcome" and "have fun"'.match(/".+?"/g)
)
// 結果：['"Welcome"', '"have fun"']
```

**為什麼？**

1. 先匹配第一個 `"`
2. `.+?` 改成「盡量少吃」
3. 只要後面已經可以接上結尾的 `"`，就立刻停止
4. 所以先得到 `"Welcome"`，再繼續往後找出 `"have fun"`

---

### 範例 1：理解惰性量詞的極限

```javascript
console.log("123456".match(/\d+?\d+?/g)) // ['123456']
```

- `\d` => 任意數字
- `\d+?` => 惰性地匹配 1 個以上數字

這個 pattern 其實等於把字串拆成兩段數字：
- 第一段：`\d+?`
- 第二段：`\d+?`

雖然第一段是惰性的，會先少吃一點，但整個 pattern 還是必須連續匹配成功。  
對 `"123456"` 來說，最佳整體匹配仍然是整串 `"123456"`。

可以理解成：
- 第一個 `\d+?` 先拿最少，例如 `"1"`
- 第二個 `\d+?` 再往後吃，最後整體仍匹配整串

> **注意**：惰性不代表「只取最短最小的一小段結果」  
> 它只是表示「這一段量詞會先嘗試少吃，再看後續條件能不能成立」。

---

### 範例 2：找出註解內容

```javascript
console.log(
  '<!--My--comment test--><!--->'.match(/<!--[\s\S]*?-->/g)
)
// 結果：['<!--My--comment test-->', '<!--->']
```

pattern 拆解：
- `<!--`      => 註解開頭
- `[\s\S]`    => 任意字元（包含空白與非空白，等於幾乎所有字元）
- `*?`        => 惰性地匹配 0 次以上
- `-->`       => 註解結尾

**為什麼這裡要用 `*?` 而不是 `*`？**  
因為如果用貪婪量詞，可能會從第一個 `<!--` 一路吃到最後一個 `-->`，變成把多個註解合併成一次匹配。  
用 `*?` 才會在遇到第一個合法的 `-->` 時就停下。

---

### 範例 3：找出 HTML 標籤

```javascript
console.log(
  '<><a href="/"><input type="radio" checked><b></b>'.match(/<[^<>]+>/g)
)
// 結果：['<a href="/">', '<input type="radio" checked>', '<b>', '</b>']
```

pattern 拆解：
- `<`         => 標籤開頭
- `[^<>]+`    => 匹配 1 個以上「不是 `<` 或 `>` 的字元」
- `>`         => 標籤結尾

`[^<>]` 的意思：  
`^` 放在中括號裡面時表示「排除」，所以 `[^<>]` = 除了 `<` 和 `>` 以外的任意字元。

**這樣做的好處**：  
一旦遇到 `>` 就會停止，不會跨到下一個標籤。這比單純用 `.+?` 更適合這個例子，因為限制更明確。


## 捕獲組

```javascript
// --- 捕獲組 --- //
const macReg = /^[0-9a-f]{2}(:[0-9a-f]{2}){5}$/i
console.log('01:32:54:67:89:AB', macReg.test('01:32:54:67:89:AB')) // true
console.log('0132546789AB', macReg.test('0132546789AB'))           // false
console.log('01:32:54:67:89', macReg.test('01:32:54:67:89'))       // false
console.log('01:32:54:67:89:ZZ', macReg.test('01:32:54:67:89:ZZ')) // false

// more example
// example1：找出色碼
console.log(
  'color: #3f3; background-color: #AA00ef; and: #abcd'.match(/#([a-f0-9]{3}){1,2}/gi)
)
// #開頭 => 捕獲範圍為集合範圍並且抓3個：([a-f0-9]{3})
// 重複以上行為最少一次或兩次：{1,2}

// example2：找出所有數字（包含負號及小數點）
console.log(
  '-1.5 0 2 -123.4'.match(/-?\d+(\.\d+)?/g)
)
// -?\d+：開頭為可選的 -，接著多個數字
// (\.\d+)?：捕獲範圍為轉義的 . 加上多個數字，整個為可選

// --- 命名組與 matchAll ---
// matchAll 與 match 差別：
// 1. 返回的不是陣列而是一個可迭代對象
// 2. 如果修飾符 g 存在則返回一個陣列
// 3. 如果沒有匹配內容則返回一個空的可迭代對象而不是 null

// example1：替每個內容命名且使用 matchAll 解構出 key
let dateReg = /(?<year>[0-9]{4})-(?<month>[0-9]{2})-(?<day>[0-9]{2})/g
let dateStr = "2019-08-11 2022-06-23"
let results = dateStr.matchAll(dateReg)
const printDate = () => {
  for (let item of results) {
    const { year, month, day } = item.groups
    console.log(`${year}-${month}-${day}`)
  }
}
printDate()

// example2：日期反向編排
console.log(dateStr.replace(dateReg, "$<day>-$<month>-$<year>"))

// 替換捕獲組
// example：替換內容
let repStr = "Ben John"
let repReg = /(\w+) (\w+)/
console.log(repStr.replace(repReg, "$2, $1")) // John, Ben
```

捕獲組可以幫助我們將諸多內容封裝成一個條件。以 MAC 位址為例，表達式設定的條件是必須找到一個完全符合該 pattern 的內容。首先看到開頭 `^` 和結尾 `$`，表示完全匹配。接下來 `[0-9a-f]{2}` 需要找到在 0-9 和 a-f 範圍之中且找兩個，再來我們必須找到一個符合捕獲組的條件內容且找 5 個 `(:[0-9a-f]{2}){5}`，於是就能找到由 `[0-9a-f]` 組成且中間有冒號分隔的內容。

`matchAll` 方法與 `match` 不同的是，它返回的是一個可迭代對象。

**命名組**：我們也可以替定義的捕獲內容賦予一個 key 來方便編排或使用，語法為 `?<your key name>`。如上範例我們可以用 `for...of` 解構並且重新編排順序。

## 命名的反向引用以及或

```javascript
// --- 命名的反向引用 \n 和 \k<name> --- //
let revStr = 'He said: "She\'s the one."'
// 這個例子中我們想要找出帶有 "" 或是 '' 的對象
// 直覺的正規表達式會是 /["'](.*?)["']/，但結果會是 "She'，因為 . 也代表著 '
// 這時候我們可以應用反向引用，將第一個捕獲結果記住

let revReg1 = /(?<quote>["'])(.*?)\k<quote>/g
let revReg2 = /(["'])(.*?)\1/g
console.log(revStr.match(revReg1)) // ["\"She's the one.\""]
console.log(revStr.match(revReg2)) // ["\"She's the one.\""]

// --- 或 | --- //
// example1：更精準的時間正則表達式
let timeRegexp = /([01]\d|2[0-3]):[0-5]\d/g
console.log("20:00 08:10 23:59 25:99 1:2".match(timeRegexp))
// ([01]\d|2[0-3])：開頭捕獲範圍為 [01]\d 或者 2[0-3]
// :[0-5]\d：接著為 [0-5] 搭配任意數字 \d

// example2：找出 style 標籤
console.log(
  '<style><style style="...">'.match(/<style(>|\s.*?>)/g)
)
// <style：開頭
// (>|\s.*?>)：捕獲範圍滿足其一條件皆可
// 條件1：>
// 條件2：\s.*?>，接受除了換行符其他所有符號，結尾為 >
```

**反向引用**：在一些搜尋內容中，我們必須對應前後的開頭與結尾的一致性，就能應用命名以及反向引用的方式來幫助我們達到要的結果。如上例，我們期待能夠找到雙引號或是單引號包住的結果，反向引用的方式幫助我們解決這樣的問題，同時也能使用 `\n` 的方式去達成。

**或**：使用 `|` 幫助我們能夠定義和接受其他的捕捉範圍和內容。如第一個例子，我們能夠用更精準的定義去捕捉正確的時間格式；第二個例子能找出 `style` 的標籤。

## 前斷言與後斷言

```javascript
//--- 前斷言與後斷言 ---//
// pattern：
// 1. x(?=y)  : 前肯定斷言 => x 且後面跟著 y
// 2. x(?!y)  : 前否定斷言 => x 且後面不跟著 y
// 3. (?<=y)x : 後肯定斷言 => x 且在 y 後面
// 4. (?<!y)x : 後否定斷言 => x 且不跟在 y 後面

// example1：符號數字
// 前肯定斷言（找出帶有符號的數字）
console.log('1 turkey costs 30€'.match(/\d+(?=€)/)) // ["30"]
// 前否定斷言（找出沒有帶有符號的數字）
console.log('2 turkey costs 60€'.match(/\d+(?!€)/)) // ["2", "6"]（注意 60 的 6 也會匹配）

// example2：正數與負數
// 後肯定斷言（找出負數）
console.log("0 12 -5 123 -18".match(/(?<=-)\d+/g)) // ["5", "18"]
// 後否定斷言（找出非負數）
console.log("0 12 -5 123 -18".match(/(?<![-\d])\d+/g)) // ["0", "12", "123"]
```

前斷言與後斷言可以幫助我們在一些情境下確保必須有 A 且有 B，或是有 A 且沒有 B，反之亦然。如第二個例子我們要找出正數與負數，在負數的狀況下我們可以用後肯定斷言的方式確保是負號開頭且跟著任意數字，就能排除掉一些意料之外的狀況和漏洞。

## RegExp 方法整理

```javascript
// --- 正規表達式的各種方法 --- //

// 1. str.match(regexp)
let matchStr = "JavaScript is wonderful"
// 不帶 g 修飾符
let notResult = matchStr.match(/Java(Script)/)
console.log(notResult)      // 陣列形式，包含匹配項、分組、index、input、groups
console.log(notResult[0])   // JavaScript（完全匹配）
console.log(notResult[1])   // Script（第一個捕獲組）
console.log(notResult.index)// 0（匹配位置）
// 帶 g 修飾符
let gResult = matchStr.match(/JavaScript/g)
console.log(gResult)        // 返回一個帶有匹配項的陣列
// 沒有匹配項時返回 null
let emptyResult = matchStr.match(/CSS/)
console.log(emptyResult)    // null

// 2. str.matchAll(regexp)
let matchAllStr = "<div>Hello World!!!</div>"
let matchAllRegexp = /<(.*?)>/g
let matchAll = matchAllStr.matchAll(matchAllRegexp)
console.log(matchAll)       // 可迭代對象
matchAll = Array.from(matchAll)
console.log(matchAll[0][0]) // <div>
console.log(matchAll[0][1]) // div

// 3. str.split(regexp | substr, limit)
let splitStr = "2022-01-25"
console.log(splitStr.split('-'))   // ['2022', '01', '25']
console.log(splitStr.split(/-/))   // ['2022', '01', '25']

// 4. str.search(regexp)
let searchStr = "search all content is have name key"
console.log(searchStr.search(/content/i))   // 11
console.log(searchStr.search(/contents/i))  // -1

// 5. str.replace(regexp | string, string | function)
console.log("12-34-56".replace("-", ":"))          // 12:34-56（只替換第一個）
console.log("12-34-56".replace(/-/g, ":"))         // 12:34:56

// 特殊字符替換：$&, $`, $', $n, $<name>, $$
// 應用 function 形式
let ex1Str = "html and css and javascript"
let ex1Result = ex1Str.replace(/html|css|javascript/g, str => str.toUpperCase())
console.log(ex1Result) // HTML and CSS and JAVASCRIPT

let ex2Str = "Ben Ken"
let ex2Result = ex2Str.replace(/(\w+) (\w+)/, (...match) => `${match[2]} ${match[1]}`)
console.log(ex2Result) // Ken Ben

// 使用命名組
let ex3Str = "Joe Sam"
let ex3Result = ex3Str.replace(/(?<name>\w+) (?<surname>\w+)/, (...match) => {
  let groups = match.pop()
  return `${groups.surname} ${groups.name}`
})
console.log(ex3Result) // Sam Joe

// 6. regexp.exec(string)
let execStr = "More about HTML at document"
let execRegexp = /html/ig
let execResult
while ((execResult = execRegexp.exec(execStr)) !== null) {
  console.log(`Found ${execResult[0]} at position ${execResult.index} and next index is ${execRegexp.lastIndex}`)
}
// Found HTML at position 11 and next index is 15

// 7. regexp.test(string)
let testStr = "HTML CSS"
console.log(/html/i.test(testStr))     // true
console.log(testStr.search(/html/i) !== -1) // true

let testRegexp = /css/gi
let testStr3 = "HTML CSS JavaScript"
testRegexp.lastIndex = 5
console.log(testRegexp.test(testStr3)) // true
testRegexp.lastIndex = 6
console.log(testRegexp.test(testStr3)) // false
// 注意：帶有 g 修飾符時，連續呼叫 test 可能會因為 lastIndex 未歸零而失敗
```

最後這邊整理了正規表達式的用法，包括：

1. **string.match(regexp)**：依據修飾符 `g` 返回的內容有所不同。沒有 `g` 返回一個帶有匹配項、分組（捕獲項內容）、index、input、groups 的陣列；有 `g` 返回一個帶有匹配項的陣列。不管有沒有 `g`，在沒有找到匹配對象時都返回 `null`。

2. **string.matchAll(regexp)**：返回一個可迭代對象，內容與不帶 `g` 的 `match` 相同。如果沒有找到匹配項則返回一個空的可迭代對象。

3. **string.split(regexp | substr, limit)**：返回指定條件分割的結果。

4. **string.search(regexp)**：返回匹配項位置，沒有則返回 `-1`。

5. **string.replace(regexp | string, string | function)**：依據條件找到匹配項並且替換結果。

6. **regexp.exec(string)**：依據修飾符 `g` 返回的內容有所不同。沒有 `g` 時行為與 `match` 一樣；有 `g` 時將返回第一個匹配項且將下一個搜索位置記錄在 `regexp.lastIndex` 中，下一次調用將會從 `lastIndex` 出發，以此類推。如果沒有找到匹配項則返回 `null` 且將 `lastIndex` 重置為 `0`。

7. **regexp.test(string)**：尋找是否有匹配項，回傳一個布林值。帶有修飾符 `g` 的狀況下能夠使用 `regexp.lastIndex = position` 指定搜尋位置。

---