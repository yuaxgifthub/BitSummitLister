/**
 * BitSummit 公式サイトの「SPONSOR GAMES」ページから
 * スポンサー企業の出展タイトル・画像・ジャンルを抽出し、
 * games.json の企業ブースと突き合わせて確認用 CSV を出力するスクリプト
 *
 * 準備:
 *   1. https://bitsummit.org/sponsor-games/ をブラウザで開く
 *   2. ⌘+S でフォーマット「ページのソース」を選んで保存
 *   3. 保存した html をリポジトリのルートに sponsor-games.html という名前で置く
 *
 * 使い方:
 *   node scripts/search-sponsor.js
 *
 * 動作:
 *   - sponsor-games.html からタイトル・スポンサー名・画像 URL・ジャンルを抽出
 *   - games.json のうち storeUrl が未設定のもの（＝企業ブース等）と突き合わせ
 *   - スポンサー名の一致度で high / medium / none に分類
 *   - sponsor-match-result.csv を出力
 *
 * 重要:
 *   このスクリプトは games.json を書き換えません。
 *   出力された CSV を目視で確認して ok 列を編集し、
 *   apply-sponsor.js で反映してください。
 *
 *   表記ゆれ（例: アコードセブン株式会社 / Accord Seven Inc.）があるため、
 *   自動マッチだけでは誤りが混じります。必ず目視で確認してください。
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const GAMES_PATH = path.resolve(__dirname, "../src/data/games.json");
const HTML_PATH = path.resolve(__dirname, "../sponsor-games.html");
const OUT_PATH = path.resolve(__dirname, "../sponsor-match-result.csv");
const SPONSOR_JSON_PATH = path.resolve(__dirname, "../sponsor-games-extracted.json");

/** すでに Steam URL が入っているか */
function hasSteamUrl(g) {
  return !!(g.storeUrl && /store\.steampowered\.com\/app\/\d+/.test(g.storeUrl));
}

/** 公式サイトの HTML から出展タイトルを抽出する */
function extractSponsorGames(html) {
  const items = html.split('<div class="games-list-item');
  const games = [];

  for (const item of items.slice(1)) {
    const titleM = item.match(
      /<h2 class="game-card-title">\s*<a[^>]*>\s*([\s\S]*?)\s*<\/a>/
    );
    const devM = item.match(
      /game-card-dev-name[^>]*>\s*<span>Sponsor&nbsp;<\/span>\s*([\s\S]*?)\s*<\/p>/
    );
    const imgM = item.match(/class="game-box-art"\s+src="([^"]+)"/);
    const genreM = item.match(/<div class="game-card-genre">([\s\S]*?)<\/div>/);

    if (!titleM) continue;

    const genreRaw = genreM ? genreM[1] : "";
    const genres = [...genreRaw.matchAll(/>([^<>]+)</g)]
      .map((m) => m[1].trim())
      .filter(Boolean);

    games.push({
      title: titleM[1].replace(/\s+/g, " ").trim(),
      sponsor: devM ? devM[1].replace(/\s+/g, " ").trim() : "",
      // http のままだと混在コンテンツ扱いになるので https に寄せる
      image: imgM ? imgM[1].replace(/^http:\/\//, "https://") : "",
      genres,
    });
  }

  return games;
}

/**
 * 社名比較用の正規化。
 * 法人格や汎用語を落として比較しやすくする。
 * ただし落としすぎると誤マッチの原因になるので控えめにする。
 */
function normalize(s) {
  return (s || "")
    .toLowerCase()
    .replace(
      /株式会社|有限会社|合同会社|inc\.?|corp\.?|corporation|co\.?,?\s*ltd\.?|ltd\.?|llc|ブース/gi,
      ""
    )
    .replace(/[^\p{L}\p{N}]/gu, "")
    .trim();
}

/** 文字列の類似度（0〜1） */
function similarity(a, b) {
  a = normalize(a);
  b = normalize(b);
  if (!a || !b) return 0;
  if (a === b) return 1;

  // 短すぎる文字列の部分一致は誤マッチしやすいので、
  // 一定の長さがある場合のみ包含を高スコアにする
  if (a.length >= 4 && b.length >= 4 && (a.includes(b) || b.includes(a))) {
    return 0.9;
  }

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

function csvCell(v) {
  const s = String(v ?? "");
  return `"${s.replace(/"/g, '""')}"`;
}

function main() {
  if (!fs.existsSync(HTML_PATH)) {
    console.error(`${HTML_PATH} が見つかりません。`);
    console.error(
      "https://bitsummit.org/sponsor-games/ を「ページのソース」で保存し、"
    );
    console.error("sponsor-games.html という名前でリポジトリのルートに置いてください。");
    process.exit(1);
  }

  const html = fs.readFileSync(HTML_PATH, "utf8");
  const sponsorGames = extractSponsorGames(html);

  if (sponsorGames.length === 0) {
    console.error("HTML からタイトルを抽出できませんでした。");
    console.error("保存形式が「ページのソース」になっているか確認してください。");
    process.exit(1);
  }

  // 抽出結果を JSON でも残しておく（後段の apply-sponsor.js が使う）
  fs.writeFileSync(
    SPONSOR_JSON_PATH,
    JSON.stringify(sponsorGames, null, 2),
    "utf8"
  );

  // スポンサーごとにタイトルをまとめる
  const bySponsor = new Map();
  for (const sg of sponsorGames) {
    if (!sg.sponsor) continue;
    if (!bySponsor.has(sg.sponsor)) bySponsor.set(sg.sponsor, []);
    bySponsor.get(sg.sponsor).push(sg);
  }

  const sponsorNames = [...bySponsor.keys()];

  console.log(`公式サイトから ${sponsorGames.length} 本のタイトルを抽出しました`);
  console.log(`スポンサー企業: ${sponsorNames.length} 社\n`);

  const games = JSON.parse(fs.readFileSync(GAMES_PATH, "utf8"));
  const targets = games.filter((g) => !hasSteamUrl(g));

  const rows = [];
  const counts = { high: 0, medium: 0, none: 0 };

  for (const g of targets) {
    let best = null;
    let bestScore = 0;

    for (const sn of sponsorNames) {
      const s = similarity(g.exhibitor, sn);
      if (s > bestScore) {
        bestScore = s;
        best = sn;
      }
    }

    let confidence;
    if (!best || bestScore < 0.5) confidence = "none";
    else if (bestScore >= 0.8) confidence = "high";
    else confidence = "medium";

    counts[confidence]++;

    const list = best ? bySponsor.get(best) : [];

    rows.push({
      id: g.id,
      booth: g.booth,
      exhibitor: g.exhibitor,
      sponsorName: best || "",
      titleCount: list.length,
      titles: list.map((x) => x.title).join(" / "),
      score: bestScore.toFixed(2),
      confidence,
      // high でも誤マッチはありうるので、必ず目視確認してもらう
      ok: confidence === "high" ? "OK" : "",
    });
  }

  const header = [
    "id",
    "booth",
    "exhibitor",
    "sponsorName",
    "titleCount",
    "titles",
    "score",
    "confidence",
    "ok",
  ];

  const csv =
    "\uFEFF" +
    header.join(",") +
    "\n" +
    rows.map((r) => header.map((h) => csvCell(r[h])).join(",")).join("\n");

  fs.writeFileSync(OUT_PATH, csv, "utf8");

  console.log("=== マッチ結果 ===");
  console.log(`high   (ほぼ確実): ${counts.high} 件`);
  console.log(`medium (要確認)  : ${counts.medium} 件`);
  console.log(`none   (該当なし): ${counts.none} 件`);
  console.log(`\n${OUT_PATH} を出力しました。\n`);

  console.log("--- 次にやること ---");
  console.log("1. sponsor-match-result.csv をスプレッドシートで開く");
  console.log("2. sponsorName 列が exhibitor と本当に対応しているか確認する");
  console.log("   （表記ゆれがあるため誤マッチが混じります）");
  console.log("3. 正しい行の ok 列に OK と入れる。誤っている行は ok を空にする");
  console.log("4. none の行は、公式サイトの社名を手で sponsorName 列に入れれば拾えます");
  console.log("5. node scripts/apply-sponsor.js で games.json に反映する");

  // 参考として、公式サイト側のスポンサー名一覧も出しておく
  console.log("\n--- 公式サイトのスポンサー名一覧（手動で紐づける際の参考） ---");
  sponsorNames.sort().forEach((n) => {
    console.log(`  ${n} (${bySponsor.get(n).length}本)`);
  });
}

main();
