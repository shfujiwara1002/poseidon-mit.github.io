# v0 で直接編集するための「自分のリポジトリ」へのコピー手順

v0 から編集するには、**自分用の GitHub リポジトリ（フォーク）** にコードを置き、v0 でそのリポジトリを開く必要があります。

## 1. GitHub でフォークを作成する

1. ブラウザで https://github.com/poseidon-mit/poseidon-mit.github.io を開く
2. 右上の **Fork** をクリック
3. 「Owner」を自分のアカウント（例: `shfujiwara1002`）にし、リポジトリ名はそのまままたは任意で OK
4. **Create fork** をクリック

→ 自分のアカウントの下に `https://github.com/<あなたのユーザー名>/poseidon-mit.github.io` ができます。

## 2. ローカルに「自分のリポジトリ」をリモートとして追加する

フォークしたリポジトリの URL を `mine` という名前のリモートとして追加します（`<あなたのユーザー名>` は実際の GitHub ユーザー名に置き換えてください）。

```bash
cd /Users/shinjifujiwara/code/poseidon-mit.github.io

# 自分のフォークをリモート "mine" として追加（ユーザー名を実際の名前に変更）
git remote add mine https://github.com/shfujiwara1002/poseidon-mit.github.io.git
```

すでに同じ名前のリモートがある場合は:

```bash
git remote set-url mine https://github.com/shfujiwara1002/poseidon-mit.github.io.git
```

## 3. 現在の main を自分のリポジトリにプッシュする

```bash
git push -u mine main
```

必要なら、作業中の未コミット変更を先にコミットしてからプッシュしてください。

```bash
git add .
git commit -m "chore: work in progress for v0"
git push -u mine main
```

## 4. v0 で開く

- v0（Vercel v0）で「Import from GitHub」などから **自分のフォーク**  
  `https://github.com/shfujiwara1002/poseidon-mit.github.io` を指定して開く
- 編集は自分のリポジトリにだけ反映され、元の `poseidon-mit/poseidon-mit.github.io` には影響しません

## 補足

- **元リポジトリを追いかけたい場合**: 元を `upstream` として追加し、たまに `git fetch upstream && git merge upstream/main` で取り込めます。
- **このフォルダを「自分のリポジトリ専用」にしたい場合**:  
  `git remote set-url origin https://github.com/shfujiwara1002/poseidon-mit.github.io.git` で `origin` を自分のフォークに切り替えても構いません。
