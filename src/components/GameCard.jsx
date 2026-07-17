// ============================================================
// タイトルカード（リスト / グリッド / コンパクトの3バリアント）
// - カード画像は images[0]（申し送り: カード=1枚目）
//   読み込み失敗時は次の画像へフォールバックし、全滅なら「No Image...」
//   （URL直リンクはリンク切れの可能性があるため。申し送り4-5項）
// - タイトルは12文字まで、13文字目以降は「…」（仕様書指定）
// - タグ: ブース番号=パディング4 / ジャンル=パディング8（仕様書指定）
// - 緑（ティール）枠線は全カード共通の意図的な装飾（デザイン画像準拠）
// ============================================================
import { useState } from "react";
import { TITLE_MAX_CHARS } from "../constants.js";

// 12文字まで表示、それ以上は「…」で省略
export function truncateTitle(title) {
  return title.length > TITLE_MAX_CHARS
    ? title.slice(0, TITLE_MAX_CHARS) + "…"
    : title;
}

export default function GameCard({ game, variant = "list", onClick }) {
  // 読み込みに失敗した枚数 = 次に試すインデックス
  const [errorCount, setErrorCount] = useState(0);
  const images = Array.isArray(game.images) ? game.images : [];
  const src = errorCount < images.length ? images[errorCount] : null;

  return (
    <div
      className={`card card-${variant}`}
      onClick={onClick}
      role="button"
      aria-label={`${game.title} の詳細を開く`}
    >
      <div className="card-img">
        {src ? (
          <img
            key={src}
            src={src}
            alt=""
            loading="lazy"
            onError={() => setErrorCount(c => c + 1)}
          />
        ) : (
          <div className="card-noimg">No Image...</div>
        )}
      </div>
      <div className="card-body">
        <div className="card-title">{truncateTitle(game.title)}</div>
        <div className="card-tags">
          <span className="tag tag-booth">{game.booth}</span>
          <span className="tag tag-genre">{game.genre}</span>
        </div>
      </div>
    </div>
  );
}
