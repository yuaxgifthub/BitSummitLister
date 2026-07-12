/**
 * タイトル名から Steam ストアの URL を自動検索して、確認用の CSV を出力するスクリプト
 *
 * 使い方:
 *   node scripts/search-steam.js
 *
 * 動作:
 *   - src/data/games.json のうち storeUrl が未設定のものを対象にする
 *   - Steam のストア検索 API でタイトル名を検索
 *   - タイトルの一致度を計算して 3 段階に分類
 *       high   : ほぼ確実（そのまま採用してよい）
 *       medium : 要確認（目視でチェックしてほしい）
 *       none   : ヒットなし（Steam 未掲載の可能性）
 *   - 結果を steam-search-result.csv に出力する
 *
 * 重要:
 *   このスクリプトは games.json を書き換えません。
 *   出力された CSV を目視で確認し、OK 列を編集してから
 *   apply-steam-urls.js で games.json に反映します。
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const GAMES_PATH = path.resolve(__dirname, "../src/data/games.json");
const OUT_PATH = path.resolve(__dirname, "../steam-search-result.csv");

const WAIT_MS = 1200;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** 既に Steam URL が入っているか */
function hasSteamUrl(g) {
  return !!(g.storeUrl && /store\.steampowered\.com\/app\/\d+/.test(g.storeUrl));
}

/**
 * 検索用にタイトルを正規化する。
 * 日本語タイトルの後ろに英語名が括弧書きされている場合が多いので、
 * 「日本語部分」と「括弧内の英語部分」の両方を検索候補として返す。
 */
function buildQueries(title) {
  const queries = [];

  // 括弧内（英語名）を抜き出す: 例「代償少女 (Compensated Girl)」→「Compensated Girl」
  const paren = title.match(/[（(]([^）)]+)[）)]/);
  if (paren && /[A-Za-z]/.test(paren[1])) {
    queries.push(paren[1].trim());
  }

  // 括弧を除いた本体
  const base = title.replace(/[（(][^）)]*[）)]/g, "").trim();
  if (base) queries.push(base);

  // 元のタイトルそのもの
  queries.push(title.trim());

  // 重複除去
  return [...new Set(queries)].filter(Boolean);
}

/** 比較用にゆるく正規化（記号・空白・大小文字を無視。括弧の中身は残す） */
function normalize(s) {
  return (s || "")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]/gu, "")
    .trim();
}

/** 2 つの文字列の類似度を 0〜1 で返す（レーベンシュタイン距離ベース） */
function similarity(a, b) {
  a = normalize(a);
  b = normalize(b);
  if (!a || !b) return 0;
  if (a === b) return 1;
  if (a.includes(b) || b.includes(a)) return 0.9;

  const m = a.length;
  const n = b.length;
  const dp = Array.from({ length: m + 1 }, (_, i) => [i, ...Array(n).fill(0)]);
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)
      );
    }
  }
  return 1 - dp[m][n] / Math.max(m, n);
}

/** Steam のストア検索 API を叩く */
async function searchSteam(term) {
  const url = `https://store.steampowered.com/api/storesearch/?term=${encodeURIComponent(
    term
  )}&cc=jp&l=japanese`;

  const res = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36",
      "Accept-Language": "ja,en;q=0.9",
    },
  });

  if (!res.ok) throw new Error(`HTTP ${res.status}`);

  const json = await res.json();
  return Array.isArray(json?.items) ? json.items : [];
}

/** CSV の 1 セルをエスケープ */
function csvCell(v) {
  const s = String(v ?? "");
  return `"${s.replace(/"/g, '""')}"`;
}

async function main() {
  const games = JSON.parse(fs.readFileSync(GAMES_PATH, "utf8"));
  const targets = games.filter((g) => !hasSteamUrl(g));

  console.log(`storeUrl 未設定のタイトル: ${targets.length} 件`);
  console.log(`推定所要時間: 約 ${Math.ceil((targets.length * WAIT_MS) / 60000)} 分\n`);

  const rows = [];
  const counts = { high: 0, medium: 0, none: 0 };

  for (let i = 0; i < targets.length; i++) {
    const game = targets[i];
    const label = `[${i + 1}/${targets.length}] ${game.booth} ${game.title}`;

    let best = null;
    let bestScore = 0;

    // 日本語名・英語名など複数の表記でそれぞれ検索する
    const queries = buildQueries(game.title);

    for (const q of queries) {
      let items = [];
      try {
        items = await searchSteam(q);
      } catch (e) {
        // 検索失敗は次のクエリで再挑戦
        await sleep(WAIT_MS);
        continue;
      }

      for (const item of items) {
        // どの表記と比べても良いので、最も高いスコアを採用する
        const score = Math.max(
          ...queries.map((qq) => similarity(qq, item.name))
        );
        if (score > bestScore) {
          bestScore = score;
          best = item;
        }
      }

      await sleep(WAIT_MS);

      // 十分に高いスコアが出たら以降のクエリは省略
      if (bestScore >= 0.9) break;
    }

    let confidence;
    if (!best || bestScore < 0.45) confidence = "none";
    else if (bestScore >= 0.8) confidence = "high";
    else confidence = "medium";

    counts[confidence]++;

    const url = best
      ? `https://store.steampowered.com/app/${best.id}/`
      : "";

    rows.push({
      id: game.id,
      booth: game.booth,
      title: game.title,
      exhibitor: game.exhibitor,
      steamName: best ? best.name : "",
      steamUrl: url,
      score: bestScore.toFixed(2),
      confidence,
      // high は最初から OK、それ以外は空にして目視で入れてもらう
      ok: confidence === "high" ? "OK" : "",
    });

    console.log(
      `${label}\n    → ${confidence.toUpperCase()} (${bestScore.toFixed(2)}) ${
        best ? best.name : "ヒットなし"
      }`
    );
  }

  const header = [
    "id",
    "booth",
    "title",
    "exhibitor",
    "steamName",
    "steamUrl",
    "score",
    "confidence",
    "ok",
  ];

  const csv =
    "\uFEFF" + // Excel で文字化けしないように BOM を付ける
    header.join(",") +
    "\n" +
    rows
      .map((r) => header.map((h) => csvCell(r[h])).join(","))
      .join("\n");

  fs.writeFileSync(OUT_PATH, csv, "utf8");

  console.log(`\n=== 完了 ===`);
  console.log(`high   (ほぼ確実): ${counts.high} 件`);
  console.log(`medium (要確認)  : ${counts.medium} 件`);
  console.log(`none   (ヒットなし): ${counts.none} 件`);
  console.log(`\n${OUT_PATH} を出力しました。`);
  console.log(`スプレッドシートで開いて、medium の行を確認し、`);
  console.log(`採用してよいものは ok 列に「OK」と入力してください。`);
  console.log(`（high は最初から OK が入っています。誤りがあれば消してください）`);
}

main().catch((e) => {
  console.error("エラー:", e);
  process.exit(1);
});
