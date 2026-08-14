# TiBOOST 創新大步計畫 2026 — 活動網站

純靜態網站，沒有建置流程：clone 下來用任何靜態伺服器打開就是完整的站。

**預覽網址**：https://bill-mruixin.github.io/tiboost-forum-site/

## 頁面

| 路徑 | 內容 |
| --- | --- |
| `index.html` | 競賽官網（中） |
| `en/index.html` | 競賽官網（英） |
| `forum.html` | TiBOOST 論壇暨決賽頒獎典禮（中） |
| `en/forum.html` | 同上（英） |

## 本機預覽

```bash
python3 -m http.server 8899
# http://localhost:8899/forum.html
```

## 目錄

```
css/    style.css（design token 與競賽官網）／forum.css（論壇頁）／qa-widget.css
js/     main.js（競賽官網）／forum.js（論壇頁）／qa-widget.js（QA 小幫手）
images/ 主視覺、合作單位 logo、場地地圖
files/  中英文簡章 PDF
```

`forum.css` 必須最後載入 —— 它要覆蓋 `style.css` 與 `qa-widget.css` 的 `.qa-fab` 規則。

## 調參

論壇頁 Banner 的構圖集中在 `css/forum.css` 開頭的 `--kv-*`（位置、大小、亮度、暗場範圍），
兩隻手的指尖錨定參數在 `js/forum.js` 的 `KV` 物件（`gapX` / `gapY` / `offR` / `offL` / `contactOff`）。
手的座標不是寫死的：以標準字上的 `.oo-spark`（OO 交疊處）為錨點反推，標準字改大小手會自己跟著跑。

## 上線前待辦

- [x] ~~**論壇報名表單網址**~~：已接上 Luma（https://luma.com/o38mqwey），選單鈕、右下角浮動鈕、首頁 CTA 皆已指向
- [ ] **講師簡介**：8 位裡有 7 位是版面用的假資料，搜尋 `js/forum.js` 的「範例文字」可全部找出；英文簡介 8 位全是 placeholder
- [ ] **英文翻譯**：`en/forum.html` 內以 `TRANSLATION-TODO` 標註的段落
- [ ] **獲獎名單**：目前是「決賽後揭曉」的待定狀態，2026.11.10 決賽後補上
- [ ] **地點寫法**：Banner 是「台北漢來大飯店3F」，議程區塊是「台北漢來大飯店 3F（台北市南港區經貿一路168號）」，待統一
- [ ] **活動時間寫法**：Banner 與議程標題都寫 09:30–18:00，但 0722 版議程表已延伸到 08:30 報到與 21:30 晚宴結束，待確認對外要用哪一組
- [ ] **robots.txt**：這份是預覽站版本（`Disallow: /`），上正式網域要改回 `Allow: /`，檔案裡有註記

## QA 小幫手

`js/qa-widget.js` 打的是後端 `/api/session` 與 `/api/chat`。GitHub Pages 沒有後端，
所以在預覽站上會走降級的關鍵字比對，不會有 LLM 回覆。
