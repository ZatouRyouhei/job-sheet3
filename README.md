# 業務日誌クライアント3

業務で発生した問合せや対応事項を管理します。
業務日誌ウェブサービスとセットで使用してください。

ダウンロードファイルのjob-sheet3/src/constant.tsに
ウェブサービスの接続先が記載されているので、  
環境にあったIPアドレスとポート番号に変更してください。
```
const URL_BASE = 'http://localhost:8081/jobsheet/webresources/'
```

また、constant.tsにタイムアウト時間が記載されているので、動作要件にあった時間に設定してください。
一定時間キーボード操作、クリック、マウス移動がされない場合に、自動的にログアウトします。
```
const TIMEOUT_SEC = 8 * 60 * 60 * 1000
```

セットアップのためにはあらかじめ[Node.js](https://nodejs.org/ja/)をインストールしておいてください。  

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

## リリース方法
```
npm run build
```
実行後にjob-sheet3/distが生成されます。  
C:\inetpub\wwwrootに、job-sheet3フォルダを作成し、  
distフォルダの中身をコピーアンドペーストしてください。

