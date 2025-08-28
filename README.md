# BlogAdminAngular · 部落格後台（Angular）

**Live Demo｜展示網站**  
https://hsuenchan.github.io/blog-admin-angular/

> English follows each Chinese section.（下方每節皆有中英對照）

---

## Overview｜專案簡介

**EN**  
BlogAdminAngular is an Angular (v20.1.4) demo admin app. It showcases basic CRUD UI for blog content using Angular Material, Reactive Forms, routing/guards, and simple state handling. **Data source uses Google Sheets API** as a lightweight “DB” for demo purposes.

**ZH**  
BlogAdminAngular 是以 Angular（v20.1.4）打造的示範後台，包含文章管理的基本介面（列表 / 新增 / 編輯 / 刪除）、Angular Material、Reactive Forms、路由與守衛與簡易狀態處理。**資料來源使用 Google Sheets API**，作為輕量示範的「資料庫」。

---

## Tech Stack｜技術堆疊

- Angular 20.1.4（CLI）
- Angular Material
- RxJS、Reactive Forms
- Routing & Guards
- **Google Sheets API（資料來源 / DB）**
- 部署：GitHub Pages

---

## Getting Started｜快速開始

### 1) Development server｜本機開發

```bash
ng serve
# open http://localhost:4200/
```

**EN** Save changes and the app reloads automatically.  
**ZH** 儲存檔案後頁面會自動重新載入。

---

### 2) Code scaffolding｜產生元件樣板

```bash
ng generate component component-name
# or list all schematics
ng generate --help
```

---

### 3) Building｜建置

```bash
ng build
# build artifacts are output to dist/
```

**EN** Production build is optimized.  
**ZH** Production 版本會自動優化效能與載入速度。

---

## Google Sheets as DB｜以 Google 試算表作為資料庫

> **EN**: For demo only. Don’t put secrets on client-side. For private sheets or write access, add a backend proxy (Cloud Functions/Cloud Run/etc.) and keep credentials server-side.  
> **ZH**：此作法僅供示範。**請勿**在前端放機密金鑰。若需讀寫私有試算表，請改由後端代理（如 Cloud Functions/Cloud Run）並在伺服器端保護憑證。

### A) Make your Sheet readable｜建立可讀的試算表
- **EN**
  1. Create a Google Sheet and add demo data (e.g., headers: `id`, `title`, `content`, `updated_at`).
  2. If using an **API key** approach (public read), set the sheet to **Anyone with the link: Viewer** or publish a specific range.
  3. Get `spreadsheetId` from the sheet URL.
- **ZH**
  1. 建立試算表並加入示範資料（如欄位：`id`, `title`, `content`, `updated_at`）。
  2. 若採 **API key** 的公開唯讀，將試算表設為「知道連結的使用者可檢視」，或發布指定範圍。
  3. 從網址取得 `spreadsheetId`。

### B) Enable API & get key｜啟用 API 與取得金鑰
- **EN**: In Google Cloud Console → enable **Google Sheets API** and create an **API key** (for public read) or set up **OAuth/Service Account** for private sheets.  
- **ZH**：在 Google Cloud Console 啟用 **Google Sheets API**，建立 **API key**（公開唯讀）或設定 **OAuth/Service Account**（讀寫私有表）。

---

## D) Service (no environment yet)｜服務呼叫範例（尚未使用 environment）

<picture>
  <source srcset="https://github.com/user-attachments/assets/e54cb608-68a0-4016-89c1-1c06dc42f92a" media="(prefers-color-scheme: dark)">
  <img src="https://github.com/user-attachments/assets/0ace5f4d-361f-4158-8e18-197c3ef728f0" alt="Architecture Diagram" width="820">
</picture>


**EN**  
Environment files are not set up yet. The current service uses **hard-coded values** (spreadsheetId, apiKey, Apps Script URL). After environment files are introduced (see “Roadmap / To-Do”), please move these sensitive values out of source code. See the current implementation in:  
`src/app/google-sheets.service.ts`

**ZH**  
目前尚未建立 environment 檔，服務暫以**硬編寫參數**（試算表 ID、API Key、Apps Script URL）運作。未來完成 environment 設定後（見「開發待辦」），請將這些敏感參數移出原始碼。現行實作請見：  
`src/app/google-sheets.service.ts`

> ⚠️ **Security note｜安全注意**：公開 repo 不建議硬編寫真實金鑰；若已提交，建議於 GCP 重新產生 API Key 並限制來源，或改走後端代理。

#### Angular setup｜Angular 設定

**EN**
- Ensure `HttpClient` is provided:
  - Standalone bootstrap:
    ```ts
    import { provideHttpClient } from '@angular/common/http'
    bootstrapApplication(AppComponent, { providers: [provideHttpClient()] })
    ```
  - Or in `AppModule`:
    ```ts
    import { HttpClientModule } from '@angular/common/http'
    @NgModule({ imports: [HttpClientModule] })
    export class AppModule {}
    ```
- For **write/delete** via Apps Script, deploy it as **Web app** with **Who has access: Anyone** and set CORS headers if needed.

**ZH**
- 確認已提供 `HttpClient`：
  - Standalone 啟動：
    ```ts
    import { provideHttpClient } from '@angular/common/http'
    bootstrapApplication(AppComponent, { providers: [provideHttpClient()] })
    ```
  - 或在 `AppModule`：
    ```ts
    import { HttpClientModule } from '@angular/common/http'
    @NgModule({ imports: [HttpClientModule] })
    export class AppModule {}
    ```
- 透過 Apps Script 進行寫入/刪除：請以 **Web app** 方式部署，存取權選 **任何人**；若遇 CORS，請在 Apps Script 回應中加入適當的 CORS 標頭。

---

## Routing notes on GitHub Pages｜GitHub Pages 路由注意

**EN**  
If deploying to `https://<user>.github.io/<repo>/`, build with `--base-href "/<repo>/"`. For SPA routes, copy `index.html` to `404.html` in the build output to avoid 404 on refresh (already handled in the sample GitHub Actions below).  
Alternative: use **hash routing** to avoid the 404 workaround.

**ZH**  
若部署到 `https://<user>.github.io/<repo>/`，建置時加上 `--base-href "/<repo>/"`。SPA 在重新整理或深連結可能 404，可在輸出目錄把 `index.html` 複製成 `404.html`（下方 Actions 範例已處理）。  
或採用 **hash 路由**，可避免 404 的額外設定。

---

## Deploy to GitHub Pages｜部署到 GitHub Pages（Actions）

**EN**
1. Create `.github/workflows/deploy.yml` (see below).  
2. Build with `--base-href "/blog-admin-angular/"`.  
3. Upload `dist/**/browser` (or `dist/**`) as artifact and deploy via `actions/deploy-pages`.  
4. In **Settings → Pages**, set **Source = GitHub Actions**.

**ZH**  
1. 建立 `.github/workflows/deploy.yml`（如下）。  
2. 建置時加入 `--base-href "/blog-admin-angular/"`。  
3. 上傳 `dist/**/browser`（或 `dist/**`）並用 `actions/deploy-pages` 部署。  
4. 於 **Settings → Pages** 將 **Source** 設為 **GitHub Actions**。

```yaml
# .github/workflows/deploy.yml
name: Deploy Angular to GitHub Pages

on:
  push:
    branches: [ main ]   # 若預設分支是 master，請改成 master
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run build -- --configuration=production --base-href "/blog-admin-angular/"

      - id: vars
        run: |
          if [ -d dist/*/browser ]; then
            echo "dir=$(ls -d dist/*/browser)" >> $GITHUB_OUTPUT
          else
            echo "dir=$(ls -d dist/*)" >> $GITHUB_OUTPUT
          fi

      # prevent SPA refresh/DEEPLINK 404 on GH Pages
      - run: cp "${{ steps.vars.outputs.dir }}/index.html" "${{ steps.vars.outputs.dir }}/404.html"

      - uses: actions/upload-pages-artifact@v3
        with:
          path: ${{ steps.vars.outputs.dir }}

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

---

## Roadmap / To-Do｜開發待辦

**EN**  
Testing and environment configuration are not implemented yet. Below is the current to-do list.

**ZH**  
測試與 environment 設定尚未完成；待辦如下。

- [ ] **Environment configuration（環境設定）**  
      Add `src/environments/environment.ts` & `environment.prod.ts`, and wire `fileReplacements` in `angular.json`.  
      Provide an `environment.example.ts` (do not commit real keys) with fields:
      ```ts
      // environment.example.ts
      export const environment = {
        production: false,
        googleSheets: {
          spreadsheetId: '<YOUR_SPREADSHEET_ID>',
          apiKey: '<YOUR_API_KEY>',
          range: 'Sheet1!A:D'
        }
      };
      ```
      Consumers copy it to `environment.ts` / `environment.prod.ts` and fill in values.

- [ ] **Secrets handling（金鑰管理）**  
      Don’t commit real API keys. For private sheets or write access, use a backend proxy (e.g., Cloud Functions/Run) and store credentials server-side. Optionally add a build script to generate `environment.*.ts` from a local `.env` (not checked in).

- [ ] **Unit tests（單元測試）**：set up Jest/Karma and add initial specs  
- [ ] **E2E tests（端到端測試）**：choose Cypress or Playwright and write basic flows  
- [ ] **CI before deploy（部署前自動化）**：run tests & lint in GitHub Actions  
- [ ] **Lint & format（程式風格）**：ESLint/Prettier；Husky + lint-staged pre-commit  
- [ ] **Mock data（資料模擬）**：stub Google Sheets API responses for tests

---

## Additional Resources｜延伸資源

- Angular CLI Overview & Command Reference  
  https://angular.dev/tools/cli
