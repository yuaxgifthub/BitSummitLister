// ============================================================
// 定数の集約（指示書 4-2-4 / 2）
// カラーはここを差し替えるだけでリブランドできる構造にする。
// ============================================================

// ジャンルの固定一覧（旧UIの名残。新UIは実データから動的生成するため参照は補助的）
export const GENRES = [
  "アクション", "アドベンチャー", "RPG", "シューティング",
  "パズル", "シミュレーション", "ローグライク", "その他",
];

// localStorage キー
// checked は既存ユーザーのデータ互換のため【絶対に変更禁止】（指示書1）
export const STORAGE_KEYS = {
  checked: "bitsummit-checked",     // チェック済みID配列(JSON) — 変更禁止
  notes: "bitsummit-notes",         // メモ {id: text}（フェーズ3で使用）
  viewMode: "bitsummit-view-mode",  // "list" | "grid"
};

// 1ページあたりの表示件数（指示書5-2）
export const PAGE_SIZE = 10;

// タイトルの最大表示文字数（超過分は「…」に省略。指示書5-2）
export const TITLE_MAX_CHARS = 12;

// 出展内容のクランプ: 27文字×4行（指示書5-5。超過時「すべて読む」）
export const DESC_CLAMP_CHARS = 27 * 4;

// カルーセルの自動切替間隔（指示書5-5: 4秒）
export const CAROUSEL_INTERVAL_MS = 4000;

// 公式サイト（ハンバーガーメニューの遷移先）
export const OFFICIAL_SITE_URL = "https://bitsummit.org";

// デザイントークン（デザイン画像・仕様書の指定値）
export const COLORS = {
  // メインアクセント（仕様書指定 #F96A2E）
  accent: "#F96A2E",
  // 表示切替 非選択状態のアイコンベース（仕様書指定）
  accentMuted: "#FFA783",
  // ヘッダーのオレンジグラデーション（デザイン画像実測）
  headerGradient: "linear-gradient(90deg, #E04A0E 0%, #F97A2E 100%)",
  // フッタータブ 選択 / 非選択（仕様書指定）
  footerTabActive: "#000000",
  footerTabInactive: "#4b4b4b",
  // カードの枠線（緑=ティール。意図的な装飾。デザイン画像準拠）
  cardBorder: "#0E7A6D",
  // カード右側の地色（クリーム/薄オレンジ。デザイン画像実測）
  cardBg: "#FDEEE6",
  // 検索窓・絞り込みボタン等の地色
  controlBg: "#D9D9D9",
  // 画像プレースホルダ（読み込み前・失敗時の黒地）
  imagePlaceholder: "#12161A",
  // ダイアログのマスク（#000000 Alpha40%）
  mask: "rgba(0, 0, 0, 0.4)",
  // カルーセルのページャー（現在 / 非現在。デザイン画像準拠）
  pagerActive: "#F96A2E",
  pagerInactive: "#C9C9C9",
  // 本文系
  textMain: "#333333",
  textSub: "#666666",
};

// 実データ(games.json)に存在するジャンルの動的一覧（指示書7）
// 固定のGENRESに含まれないジャンルも絞り込み対象にできるようにする。
import GAMES from "./data/games.json";
export const ALL_GENRES = [...new Set(GAMES.map(g => g.genre).filter(Boolean))];
