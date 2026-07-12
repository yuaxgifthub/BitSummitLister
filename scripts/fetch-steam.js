/**
 * Steam API からタイトル情報・画像を取得して games.json を更新するスクリプト
 *
 * 使い方:
 *   node scripts/fetch-steam.js
 *
 * 動作:
 *   - src/data/games.json を読み込む
 *   - storeUrl が Steam ストアの URL のものについて Steam API を叩く
 *   - 説明文(description) / ジャンル(genre) / 画像(images) を Steam の情報で上書き
 *   - 画像は Steam CDN の URL 直リンク（最大5枚）
 *   - Steam に無いタイトルは既存の値をそのまま維持
 *   - 結果を src/data/games.json に書き戻す
 *
 * 注意:
 *   - レート制限があるため 1 件ごとに待機を入れています（全件で数分かかります）
 *   - 取得に失敗したタイトルは既存の値を維持し、最後にまとめて報告します
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const GAMES_PATH = path.resolve(__dirname, "../src/data/games.json");

// リクエスト間の待機時間(ms)。短すぎると429で弾かれます
const WAIT_MS = 1500;
// カルーセルに使う画像の最大枚数
const MAX_IMAGES = 5;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** storeUrl から Steam の appid を抽出する。Steam 以外なら null */
function extractAppId(storeUrl) {
  if (!storeUrl) return null;
  const m = storeUrl.match(/store\.steampowered\.com\/app\/(\d+)/);
  return m ? m[1] : null;
}

/** HTML タグとエンティティを除去してプレーンテキストにする */
function stripHtml(html) {
  if (!html) return "";
  return html
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<\/p>/gi, " ")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

/** Steam のジャンル名を、このアプリで使っているジャンルに寄せる */
const GENRE_MAP = {
  Action: "アクション",
  Adventure: "アドベンチャー",
  RPG: "RPG",
  "Role-Playing": "RPG",
  Strategy: "シミュレーション",
  Simulation: "シミュレーション",
  Casual: "パズル",
  Indie: "その他",
  Racing: "その他",
  Sports: "その他",
  アクション: "アクション",
  アドベンチャー: "アドベンチャー",
  ストラテジー: "シミュレーション",
  シミュレーション: "シミュレーション",
  カジュアル: "パズル",
  インディー: "その他",
  レース: "その他",
  スポーツ: "その他",
};

function mapGenre(steamGenres, fallback) {
  if (!Array.isArray(steamGenres)) return fallback;
  for (const g of steamGenres) {
    const name = g?.description;
    if (name && GENRE_MAP[name] && GENRE_MAP[name] !== "その他") {
      return GENRE_MAP[name];
    }
  }
  // 「その他」しか無い場合はそれを返す
  for (const g of steamGenres) {
    const name = g?.description;
    if (name && GENRE_MAP[name]) return GENRE_MAP[name];
  }
  return fallback;
}

/** Steam API から 1 件分のデータを取得 */
async function fetchSteamData(appid) {
  const url = `https://store.steampowered.com/api/appdetails?appids=${appid}&l=japanese&cc=jp`;
  const res = await fetch(url, {
    headers: {
      // ブラウザっぽい UA を付けないと弾かれることがある
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36",
      "Accept-Language": "ja,en;q=0.9",
    },
  });

  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }

  const json = await res.json();
  const entry = json?.[appid];

  if (!entry || entry.success !== true || !entry.data) {
    throw new Error("Steam API returned success=false (非公開/未発売の可能性)");
  }

  const d = entry.data;

  // 画像: スクリーンショットを優先し、足りなければヘッダー画像で補う
  const shots = Array.isArray(d.screenshots)
    ? d.screenshots
        .map((s) => s.path_full || s.path_thumbnail)
        .filter(Boolean)
        .slice(0, MAX_IMAGES)
    : [];

  const images = shots.length > 0 ? shots : d.header_image ? [d.header_image] : [];

  // 説明文: 短い説明を優先。無ければ詳細説明の冒頭を使う
  const short = stripHtml(d.short_description);
  const detailed = stripHtml(d.detailed_description);
  const description = short || detailed;

  return {
    title: d.name || null,
    description: description || null,
    genre: d.genres,
    exhibitor:
      Array.isArray(d.developers) && d.developers.length > 0
        ? d.developers[0]
        : null,
    images,
  };
}

async function main() {
  const raw = fs.readFileSync(GAMES_PATH, "utf8");
  const games = JSON.parse(raw);

  const targets = games.filter((g) => extractAppId(g.storeUrl));
  console.log(`全 ${games.length} 件中、Steam URL があるのは ${targets.length} 件です`);
  console.log(`推定所要時間: 約 ${Math.ceil((targets.length * WAIT_MS) / 60000)} 分\n`);

  const failed = [];
  let done = 0;

  for (const game of games) {
    const appid = extractAppId(game.storeUrl);
    if (!appid) continue;

    done++;
    const label = `[${done}/${targets.length}] ${game.booth} ${game.title}`;

    try {
      const data = await fetchSteamData(appid);

      // 説明文は Steam 優先（取得できた場合のみ上書き）
      if (data.description) {
        game.description = data.description;
      }

      // 画像は Steam CDN の URL 直リンクで上書き（取得できた場合のみ）
      if (data.images.length > 0) {
        game.images = data.images;
      }

      // ジャンルは Steam の情報からマッピング（既存値をフォールバックに）
      game.genre = mapGenre(data.genre, game.genre);

      console.log(`${label} … OK (画像 ${data.images.length} 枚)`);
    } catch (e) {
      failed.push({ booth: game.booth, title: game.title, reason: e.message });
      console.log(`${label} … 失敗 (${e.message}) → 既存の値を維持します`);
    }

    await sleep(WAIT_MS);
  }

  fs.writeFileSync(GAMES_PATH, JSON.stringify(games, null, 2), "utf8");

  console.log(`\n完了しました。${GAMES_PATH} を更新しました。`);
  console.log(`成功: ${targets.length - failed.length} 件 / 失敗: ${failed.length} 件`);

  if (failed.length > 0) {
    console.log("\n--- 取得に失敗したタイトル（手動対応が必要な可能性があります） ---");
    for (const f of failed) {
      console.log(`  ${f.booth} ${f.title} : ${f.reason}`);
    }
  }
}

main().catch((e) => {
  console.error("エラーが発生しました:", e);
  process.exit(1);
});
