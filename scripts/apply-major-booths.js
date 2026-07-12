/**
 * 公式サイトの「SPONSOR GAMES」に載っていない大手企業ブースについて、
 * 各社のプレスリリース／ブログから収集した情報を games.json に反映するスクリプト
 *
 * 使い方:
 *   node scripts/apply-major-booths.js
 *
 * 対象:
 *   3F-A04 任天堂株式会社
 *   3F-A03 Sony Interactive Entertainment
 *   1F-A26 マーベラス
 *   1F-B14 ジー・モード
 *
 * 出典:
 *   任天堂       https://www.nintendo.com/jp/topics/article/fb819fac-8c9f-4d9d-a026-8e52071ba060
 *   PlayStation https://blog.ja.playstation.com/2026/05/22/20260522-bitsummit-punch-event-reveal-s/
 *   マーベラス   https://corp.marv.jp/pr/20260514-001780.html
 *
 * 注意:
 *   画像は各社サイトの URL を直リンクしています。
 *   将来リンク切れになる可能性があります。
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const GAMES_PATH = path.resolve(__dirname, "../src/data/games.json");

// booth をキーに、上書きする内容を定義する
const DATA = {
  // ------------------------------------------------------------------
  // 任天堂（3F 第3展示場）
  // 発売前のソフトと発売中のおすすめソフト、あわせて17タイトルを出展
  // ------------------------------------------------------------------
  "3F-A04": {
    genre: "その他",
    description:
      "発売前のソフトと発売中のおすすめソフト、あわせて17タイトルを出展。" +
      "17タイトルが入った Nintendo Switch 2 を試遊機とし、時間内であれば複数のタイトルを自由にプレイ可能。" +
      "出展タイトル: Heave Ho 2、Unrailed 2: バック・オン・トラック、スイカゲーム ぷらねっと、顔UFO、" +
      "Moonlighter 2: The Endless Vault、炎姫、Go-Go Town!、Ratatan、Denshattack!、My Little Puppy、" +
      "シュレディンガーズ・コール、夢物語の街、コーヒートーク トーキョー、" +
      "inKONBINI: One Store. Many Stories、Gecko Gods、にほんの田舎ぐらし、Öoo。" +
      "ゲームを体験した方限定で、会場限定の特製アクリルポーチのプレゼントあり（数量限定）。",
    images: [
      // 記事のメインビジュアル
      "https://assets.topics.apps-jp.nintendo.com/image/2026/04/14032033071750/0/abd8c3ae63864872858684aa91efb057.jpg",
      // 任天堂ブースの案内画像
      "https://assets.topics.apps-jp.nintendo.com/image/2026/04/27070556434194/0/1ca514e265344fdcb186405f3ec96b7e.jpg",
      // Heave Ho 2 のゲーム画面
      "https://assets.topics.apps-jp.nintendo.com/image/2026/04/27030230738040/400/c99b1fe7571841adb69506dcfcc46daa.jpg",
      // Unrailed 2 のゲーム画面
      "https://assets.topics.apps-jp.nintendo.com/image/2026/04/27030255735043/400/608789a6ec934597abb1a0fb8dfb73ba.jpg",
      // Moonlighter 2 のゲーム画面
      "https://assets.topics.apps-jp.nintendo.com/image/2026/04/27030405898355/400/c678e53f6de649b1b0e585bee2d1e995.jpg",
    ],
  },

  // ------------------------------------------------------------------
  // Sony Interactive Entertainment（PlayStation ブース）
  // 未発売作品を中心に14タイトルの試遊台を出展
  // ------------------------------------------------------------------
  "3F-A03": {
    genre: "その他",
    description:
      "SIE がプラチナスポンサーとして出展する PlayStation ブース。" +
      "未発売作品を中心に14タイトルの試遊台を出展。" +
      "出展タイトル: The Free Shepard、Screenbound、34EVERLAST、AKIBA LOST、" +
      "1998: The Toll Keeper Story、OPUS: Prism Peak、INTERSCAPE、CRYMELIGHT、The Florist、" +
      "Truckful /トラックフル、Depth Loop、Out of Words、Stretchmancer、" +
      "Janet DeMornay Is A Slumlord (and a witch)。" +
      "一般公開日には SIE のショーン・ベンソンによるステージコンテンツも実施。",
    images: [
      "https://blog.ja.playstation.com/tachyon/sites/7/2026/05/f165aca6310981c59c5a729f5b9d6808f8f39923.jpg",
      "https://blog.ja.playstation.com/tachyon/sites/7/2026/05/cc24aa5bd0502f6f0768e2048c79651f4ffc5907.jpg",
      "https://blog.ja.playstation.com/tachyon/sites/7/2026/05/a94e34c723845bf4b09f6563af48a8d63766d26b.jpg",
      "https://blog.ja.playstation.com/tachyon/sites/7/2026/05/f28c4e9fc7dd2d54041a990022979dc8018fc563.jpg",
      "https://blog.ja.playstation.com/tachyon/sites/7/2026/05/c1573a561b85ac61dcffddda8e8d2392b128e0fe.jpg",
    ],
  },

  // ------------------------------------------------------------------
  // マーベラス（マーベラス / XSEED Games / iGi 合同ブース）
  // 計10タイトルを試遊出展
  // ------------------------------------------------------------------
  "1F-A26": {
    genre: "その他",
    description:
      "マーベラス / XSEED Games / iGi indie Game incubator の合同ブース。計10タイトルを試遊出展。" +
      "出展タイトル: 黒くないカギで開かないドアはない、不可思議メメメは寝ていたい、Death the Guitar、" +
      "ムーンライト・ピークス -ヴァンパイアのゴシックライフ-、The Big Catch、" +
      "ディストピア VS ディストーション、レプリカクラブ ルートD、ナカノ人格移植研究所、" +
      "Voyage Router、Cross the C。",
    images: [
      "https://corp.marv.jp/assets_c/2026/05/e801ad00eea605b5091ba9d8d65f1c190696b974-thumb-300xauto-4536.jpg",
      "https://corp.marv.jp/assets_c/2026/05/bd14bbdb1a8437f119f8701497b9e3a9964e785d-thumb-300xauto-4538.jpg",
      "https://corp.marv.jp/assets_c/2026/05/Death-the-Guitar-thumb-230xauto-4540.jpg",
      "https://corp.marv.jp/assets_c/2026/05/274a7e1a4e2c6878aefdb1d8904fe85856df67be-thumb-300xauto-4542.jpg",
      "https://corp.marv.jp/assets_c/2026/05/The-Big-Catch-thumb-300xauto-4544.jpg",
    ],
  },

  // ------------------------------------------------------------------
  // ジー・モード（マーベラスのプレスリリースに情報あり）
  // 新作4タイトルを展示
  // ------------------------------------------------------------------
  "1F-B14": {
    genre: "アドベンチャー",
    description:
      "新作4タイトルを展示。" +
      "出展タイトル: 配信少女ノ裏垢迷宮（試遊展示なし）、" +
      "Nintendo Switch版『みんなで空気読み。ワールド タイVer.』、コメンテーター、けん玉100人シミュレーター。",
    images: [
      "https://corp.marv.jp/assets_c/2026/05/a1f28820efdd503cce53cb3a10e57c2d0ff3013b-thumb-300xauto-4556.jpg",
      "https://corp.marv.jp/assets_c/2026/05/841e05180ead7863ca88b2b621b2db6ad9e3bb2d-thumb-300xauto-4558.jpg",
      "https://corp.marv.jp/assets_c/2026/05/1ae47af31f982aebea4f93e3f2c1984f349af2e1-thumb-300xauto-4560.jpg",
      "https://corp.marv.jp/assets_c/2026/05/a53d8295f66713c6eb133d9a2e5d8348a87f6130-thumb-300xauto-4562.jpg",
    ],
  },
};

function main() {
  const games = JSON.parse(fs.readFileSync(GAMES_PATH, "utf8"));
  const byBooth = new Map(games.map((g) => [g.booth, g]));

  let applied = 0;
  const missing = [];

  for (const [booth, data] of Object.entries(DATA)) {
    const game = byBooth.get(booth);

    if (!game) {
      missing.push(booth);
      continue;
    }

    if (data.description) game.description = data.description;
    if (data.images && data.images.length > 0) game.images = data.images;
    if (data.genre) game.genre = data.genre;

    applied++;
    console.log(
      `  ${booth} ${game.exhibitor} … 反映しました（画像 ${data.images.length} 枚）`
    );
  }

  fs.writeFileSync(GAMES_PATH, JSON.stringify(games, null, 2), "utf8");

  console.log(`\n=== 完了 ===`);
  console.log(`反映: ${applied} 件`);

  if (missing.length > 0) {
    console.log(`\ngames.json に見つからなかったブース: ${missing.join(", ")}`);
  }

  console.log(`\n${GAMES_PATH} を更新しました。`);
}

main();
