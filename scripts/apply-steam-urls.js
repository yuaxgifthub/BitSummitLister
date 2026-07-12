/**
 * search-steam.js が出力した CSV を確認したあと、
 * ok 列に「OK」が入っている行の storeUrl を games.json に反映するスクリプト
 *
 * 使い方:
 *   node scripts/apply-steam-urls.js
 *
 * 前提:
 *   - steam-search-result.csv がリポジトリのルートにあること
 *   - ok 列に OK と入っている行だけが反映されます
 *
 * 反映後は fetch-steam.js を実行すると、
 * 画像・説明文・ジャンルが Steam から自動で取得されます。
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const GAMES_PATH = path.resolve(__dirname, "../src/data/games.json");
const CSV_PATH = path.resolve(__dirname, "../steam-search-result.csv");

/** ごく簡単な CSV パーサ（ダブルクォート対応） */
function parseCsv(text) {
  // BOM を除去
  text = text.replace(/^\uFEFF/, "");

  const rows = [];
  let row = [];
  let cell = "";
  let inQuote = false;

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];

    if (inQuote) {
      if (ch === '"') {
        if (text[i + 1] === '"') {
          cell += '"';
          i++;
        } else {
          inQuote = false;
        }
      } else {
        cell += ch;
      }
      continue;
    }

    if (ch === '"') {
      inQuote = true;
    } else if (ch === ",") {
      row.push(cell);
      cell = "";
    } else if (ch === "\n") {
      row.push(cell);
      rows.push(row);
      row = [];
      cell = "";
    } else if (ch === "\r") {
      // 無視
    } else {
      cell += ch;
    }
  }

  if (cell !== "" || row.length > 0) {
    row.push(cell);
    rows.push(row);
  }

  return rows;
}

function main() {
  if (!fs.existsSync(CSV_PATH)) {
    console.error(`${CSV_PATH} が見つかりません。`);
    console.error("先に node scripts/search-steam.js を実行してください。");
    process.exit(1);
  }

  const games = JSON.parse(fs.readFileSync(GAMES_PATH, "utf8"));
  const rows = parseCsv(fs.readFileSync(CSV_PATH, "utf8"));

  if (rows.length < 2) {
    console.error("CSV にデータ行がありません。");
    process.exit(1);
  }

  const header = rows[0].map((h) => h.trim());
  const idxId = header.indexOf("id");
  const idxUrl = header.indexOf("steamUrl");
  const idxOk = header.indexOf("ok");
  const idxTitle = header.indexOf("title");

  if (idxId < 0 || idxUrl < 0 || idxOk < 0) {
    console.error("CSV に必要な列 (id / steamUrl / ok) がありません。");
    process.exit(1);
  }

  const byId = new Map(games.map((g) => [g.id, g]));

  let applied = 0;
  let skipped = 0;

  for (let i = 1; i < rows.length; i++) {
    const r = rows[i];
    if (r.length <= idxOk) continue;

    const ok = (r[idxOk] || "").trim().toUpperCase();
    const url = (r[idxUrl] || "").trim();
    const id = parseInt(r[idxId], 10);

    if (ok !== "OK" || !url) {
      skipped++;
      continue;
    }

    const game = byId.get(id);
    if (!game) {
      console.log(`  id=${id} が games.json に見つかりません。スキップします。`);
      skipped++;
      continue;
    }

    game.storeUrl = url;
    applied++;
    console.log(`  ${game.booth} ${r[idxTitle]} → ${url}`);
  }

  fs.writeFileSync(GAMES_PATH, JSON.stringify(games, null, 2), "utf8");

  console.log(`\n=== 完了 ===`);
  console.log(`反映: ${applied} 件 / スキップ: ${skipped} 件`);
  console.log(`${GAMES_PATH} を更新しました。`);
  console.log(`\n続けて以下を実行すると、画像・説明文・ジャンルが取得できます:`);
  console.log(`  node scripts/fetch-steam.js`);
}

main();
