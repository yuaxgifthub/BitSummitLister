// ============================================================
// 会場マップ画面（フェーズ2新デザイン。画像「マップ画面.jpg」「マップ画面_リスト表示.jpg」参照）
// - マップ（1F/3F）。描画・ズームロジックは不可侵のFloorMap/MapZoomContainerに委譲
// - 画面下中央: フロア切り替えピル（1F / 3F）
// - 右下: リスト表示ボタン（丸）→ 右からドロワーでチェック済みタイトル表示
//   ドロワー表示中はボタンが「×」になり、オーバーレイタップでも閉じる
//   フロア切り替えはドロワー表示中も操作可能
// ============================================================
import { useState, useRef, useEffect } from "react";
import GAMES from "../data/games.json";
import MapZoomContainer from "./MapZoomContainer.jsx";
import FloorMap from "./FloorMap.jsx";
import GameCard from "./GameCard.jsx";
import { HamburgerIcon, CloseIcon } from "./Icons.jsx";

export default function MapScreen({
  mapFloor, setMapFloor,
  mapZoomTarget,
  checkedIds, checkedBooths,
  onBoothClick,
  onOpenGame,
}) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const checkedGames = GAMES.filter(g => checkedIds.has(g.id));

  // 改善11: マップ操作中（パン/ズーム/スクロール）はフロア切替・リストボタンを
  // Alpha40%に減光してマップの視認性を上げる。操作が止まって0.6秒後に戻す。
  const [mapBusy, setMapBusy] = useState(false);
  const busyTimer = useRef(null);
  const markBusy = () => {
    setMapBusy(true);
    clearTimeout(busyTimer.current);
    busyTimer.current = setTimeout(() => setMapBusy(false), 600);
  };
  useEffect(() => () => clearTimeout(busyTimer.current), []);

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
      {/* マップ本体（操作を検知して減光トリガーにする） */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          overflowY: "auto",
          overflowX: "hidden",
          WebkitOverflowScrolling: "touch",
        }}
        onTouchStart={markBusy}
        onTouchMove={markBusy}
        onPointerDown={markBusy}
        onWheel={markBusy}
        onScroll={markBusy}
      >
        <MapZoomContainer floor={mapFloor} zoomTarget={mapZoomTarget}>
          <FloorMap
            floor={mapFloor}
            checkedBooths={checkedBooths}
            onBoothClick={onBoothClick}
          />
        </MapZoomContainer>
      </div>

      {/* チェック済みリストのドロワー（右から） */}
      {drawerOpen && (
        <div className="map-drawer-overlay" onClick={() => setDrawerOpen(false)}>
          <div className="map-drawer" onClick={() => setDrawerOpen(false)}>
            {checkedGames.length === 0 ? (
              <div className="empty-state" style={{ color: "#ffffff" }}>
                <div style={{ fontSize: 26 }}>✓</div>
                <div>チェックしたタイトルが<br />ここに表示されます</div>
              </div>
            ) : (
              checkedGames.map(game => (
                <GameCard
                  key={game.id}
                  game={game}
                  variant="compact"
                  onClick={(e) => { e.stopPropagation(); onOpenGame(game, "map-drawer"); }}
                />
              ))
            )}
          </div>
        </div>
      )}

      {/* フロア切り替え（ドロワーより上に置き、表示中も操作可能にする） */}
      <div className={`floor-toggle${mapBusy ? " dimmed" : ""}`}>
        {["1F", "3F"].map(f => (
          <button
            key={f}
            className={mapFloor === f ? "active" : ""}
            onClick={() => setMapFloor(f)}
            aria-label={`${f}のマップを表示`}
            aria-pressed={mapFloor === f}
          >{f}</button>
        ))}
      </div>

      {/* リスト表示ボタン（右下・丸）。ドロワー表示中は×になる */}
      <button
        className={`map-fab${mapBusy ? " dimmed" : ""}`}
        onClick={() => setDrawerOpen(o => !o)}
        aria-label={drawerOpen ? "リストを閉じる" : "チェックしたリストを表示"}
      >
        {drawerOpen ? <CloseIcon color="#ffffff" size={26} /> : <HamburgerIcon size={26} />}
      </button>
    </div>
  );
}
