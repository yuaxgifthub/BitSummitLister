/**
 * sponsor-match-result.csv を確認したあと、
 * ok 列に「OK」が入っている行について、
 * games.json の企業ブースに以下を反映するスクリプト
 *
 *   - images      : そのスポンサーの出展タイトルのキービジュアル（最大5枚）
 *   - description : 出展タイトル名を列挙した文章
 *   - genre       : 出展タイトルのジャンルから推定（既存値がある場合は維持）
 *
 * 使い方:
 *   node scripts/apply-sponsor.js
 *
 * 前提:
 *   - scripts/search-sponsor.js を実行済みであること
 *     （sponsor-match-result.csv と sponsor-games-extracted.json が必要）
 *
 * 注意:
 *   画像は BitSummit 公式サイトの URL を直リンクします。
 *   公式サイト側で画像が差し替わったり削除されるとリンク切れになります。
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const GAMES_PATH = path.resolve(__dirname, "../src/data/games.json");
const CSV_PATH = path.resolve(__dirname, "../sponsor-match-result.csv");
const SPONSOR_JSON_PATH = path.resolve(
  __dirname,
  "../sponsor-games-extracted.json"
);

const MAX_IMAGES = 5;

/** 簡易 CSV パーサ */
function parseCsv(text) {
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
    if (ch === '"') inQuote = true;
    else if (ch === ",") {
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

/** HTML エンティティを元の文字に戻す */
function decodeEntities(s) {
  return (s || "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/&nbsp;/g, " ");
}

/** ジャンル文字列を、このアプリの分類に寄せる */
const GENRE_KEYWORDS = [
  [/アクション|シューティング|格闘|ロボット/, "アクション"],
  [/アドベンチャー|ノベル|ストーリー|ホラー/, "アドベンチャー"],
  [/rpg|ロールプレイング/i, "RPG"],
  [/シューティング|stg/i, "シューティング"],
  [/パズル|puzzle/i, "パズル"],
  [/シミュレーション|ストラテジー|経営|育成/, "シミュレーション"],
  [/ローグライク|roguelike/i, "ローグライク"],
];

function guessGenre(genres, fallback) {
  const joined = (genres || []).join(" ");
  if (!joined) return fallback;
  for (const [re, g] of GENRE_KEYWORDS) {
    if (re.test(joined)) return g;
  }
  return fallback;
}

function main() {
  for (const p of [CSV_PATH, SPONSOR_JSON_PATH]) {
    if (!fs.existsSync(p)) {
      console.error(`${p} が見つかりません。`);
      console.error("先に node scripts/search-sponsor.js を実行してください。");
      process.exit(1);
    }
  }

  const games = JSON.parse(fs.readFileSync(GAMES_PATH, "utf8"));
  const sponsorGames = JSON.parse(fs.readFileSync(SPONSOR_JSON_PATH, "utf8"));
  const rows = parseCsv(fs.readFileSync(CSV_PATH, "utf8"));

  if (rows.length < 2) {
    console.error("CSV にデータ行がありません。");
    process.exit(1);
  }

  // スポンサーごとにタイトルをまとめる
  const bySponsor = new Map();
  for (const sg of sponsorGames) {
    if (!sg.sponsor) continue;
    if (!bySponsor.has(sg.sponsor)) bySponsor.set(sg.sponsor, []);
    bySponsor.get(sg.sponsor).push(sg);
  }

  const header = rows[0].map((h) => h.trim());
  const idx = {};
  header.forEach((h, i) => (idx[h] = i));

  for (const req of ["id", "sponsorName", "ok"]) {
    if (idx[req] === undefined) {
      console.error(`CSV に必要な列 (${req}) がありません。`);
      process.exit(1);
    }
  }

  const byId = new Map(games.map((g) => [g.id, g]));

  let applied = 0;
  let skipped = 0;
  const notFound = [];

  for (let i = 1; i < rows.length; i++) {
    const r = rows[i];
    if (r.length <= idx.ok) continue;

    const ok = (r[idx.ok] || "").trim().toUpperCase();
    const sponsorName = (r[idx.sponsorName] || "").trim();
    const id = parseInt(r[idx.id], 10);

    if (ok !== "OK" || !sponsorName) {
      skipped++;
      continue;
    }

    const game = byId.get(id);
    if (!game) {
      skipped++;
      continue;
    }

    // CSV 側で & と &amp; の表記が揺れても拾えるようにする
    let list = bySponsor.get(sponsorName);
    if (!list) {
      const decoded = decodeEntities(sponsorName);
      for (const [k, v] of bySponsor) {
        if (decodeEntities(k) === decoded) {
          list = v;
          break;
        }
      }
    }
    if (!list || list.length === 0) {
      notFound.push(`${game.booth} ${game.exhibitor} → "${sponsorName}"`);
      skipped++;
      continue;
    }

    // 画像: 各タイトルのキービジュアルを最大5枚
    const images = list
      .map((x) => x.image)
      .filter(Boolean)
      .slice(0, MAX_IMAGES);

    if (images.length > 0) {
      game.images = images;
    }

    // 説明文: 出展タイトル名を列挙する（HTML エンティティは元に戻す）
    const titles = list.map((x) => decodeEntities(x.title));
    const shown = titles.slice(0, 10);
    const rest = titles.length - shown.length;
    game.description =
      `出展タイトル: ${shown.join("、")}` +
      (rest > 0 ? ` ほか${rest}本` : "") +
      "。";

    // ジャンル: 出展タイトルのジャンル表記から推定（取れなければ既存値を維持）
    const allGenres = list.flatMap((x) => x.genres || []);
    game.genre = guessGenre(allGenres, game.genre);

    applied++;
    console.log(
      `  ${game.booth} ${game.exhibitor} → ${sponsorName} (${titles.length}本 / 画像${images.length}枚)`
    );
  }

  fs.writeFileSync(GAMES_PATH, JSON.stringify(games, null, 2), "utf8");

  console.log(`\n=== 完了 ===`);
  console.log(`反映: ${applied} 件 / スキップ: ${skipped} 件`);

  if (notFound.length > 0) {
    console.log(
      `\n--- sponsorName が公式サイトの社名と一致しませんでした（要修正） ---`
    );
    notFound.forEach((n) => console.log(`  ${n}`));
    console.log(
      "\nCSV の sponsorName 列に、公式サイトの社名を正確に入力してください。"
    );
  }

  console.log(`\n${GAMES_PATH} を更新しました。`);
}

main();
