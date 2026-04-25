## 執行程式

# 執行預設檔案 src/main.js
npm start

## 檔案變更時自動重新執行

# 監看 src/main.js，檔案變更時自動重新執行
npm run watch -- src/main.js

## 建立並執行其他檔案

- 建立檔案，例如：src/arrays.js

# 直接執行 src/arrays.js
npm run run -- src/arrays.js

# 監看 src/arrays.js，檔案變更時自動重新執行
npm run watch -- src/arrays.js

## 預設進入檔案

- npm start 預設執行的檔案是 src/main.js。



node -e "直接放要執行的程式碼"

node 進入repl模式 然後直接貼程式碼

建立檔案
cat > test.js    # 執行後貼上複製的程式碼，Ctrl+D 結束
執行檔案
node test.js
查看檔案
cat test.js
查看檔案(有行數)
cat -n test.js