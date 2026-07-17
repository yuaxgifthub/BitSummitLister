// ============================================================
// 共有されたリスト（閲覧専用モード。フェーズ3）
// URLに ?shared=1,5,23 がある場合にAppから表示される。
// 仕様書「共有される側」:
//   1. ヘッダーを別色にして区別（.app-header.shared）
//   2. ヘッダータイトルを「共有されたリスト（〇件）」に
//   3. ヘッダー下に「共有されたリストを見ています／閉じる」バナー
//   4. 共有アイコンは非表示（そもそも描画しない）
//   5. カードのデザインは流用（GameCardをそのまま使用）
// - localStorageには一切保存しない（自分のリストと切り離す）
// - ダイアログは表示するが「チェックする」ボタンは出さない（完全な閲覧専用）
// ============================================================
import { useState } from "react";
import GAMES from "../data/games.json";
import AppHeader from "./AppHeader.jsx";
import GameCard from "./GameCard.jsx";
import GameDialog from "./GameDialog.jsx";

/** URLの ?shared= からID配列を取り出す（存在しない場合は null） */
export function parseSharedIds(search = location.search) {
  const raw = new URLSearchParams(search).get("shared");
  if (raw === null) return null;
  return raw
    .split(",")
    .map(s => parseInt(s.trim(), 10))
    .filter(n => Number.isFinite(n));
}

export default function SharedListScreen({ sharedIds }) {
  const [selectedGame, setSelectedGame] = useState(null);

  // 実在するタイトルのみに絞る（不正なIDは無視）
  const idSet = new Set(sharedIds);
  const games = GAMES.filter(g => idSet.has(g.id));

  // 「閉じる」= クエリを外して自分のリスト（通常モード）へ戻る
  const closeSharedView = () => {
    location.href = location.pathname;
  };

  return (
    <div className="app-root">
      {/* 1,2: 別トーンのヘッダー + 件数入りタイトル */}
      <AppHeader shared title={`共有されたリスト（${games.length}件）`} />

      {/* 3: 閲覧専用バナー */}
      <div className="shared-banner">
        <span>共有されたリストを見ています</span>
        <button className="shared-banner-close" onClick={closeSharedView}>閉じる</button>
      </div>

      <main className="app-main">
        <div className="list-scroll">
          {games.length === 0 ? (
            <div className="empty-state">
              <div style={{ fontSize: 28 }}>🔗</div>
              <div>共有されたタイトルが見つかりませんでした</div>
            </div>
          ) : (
            games.map(game => (
              <GameCard
                key={game.id}
                game={game}
                variant="list"
                onClick={() => setSelectedGame(game)}
              />
            ))
          )}
        </div>
      </main>

      {/* 閲覧専用ダイアログ（チェックボタン・メモ・マップ遷移なし） */}
      {selectedGame && (
        <GameDialog
          game={selectedGame}
          source="shared"
          readOnly
          onClose={() => setSelectedGame(null)}
        />
      )}
    </div>
  );
}
