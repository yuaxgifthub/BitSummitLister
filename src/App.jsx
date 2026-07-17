// ============================================================
// アプリのルート（フェーズ2）
// 画面構成: タイトル一覧 / リスト / 会場マップ（フッタータブで切替）
// 各画面共通: 固定ヘッダー + 固定フッタータブ
// App が持つのは画面間で共有される状態のみ:
//   チェック状態・表示モード(リスト/グリッド)・マップのフロア/ズーム対象・ダイアログ
// ============================================================
import { useState, useMemo, useEffect } from "react";
import GAMES from "./data/games.json";
import { STORAGE_KEYS } from "./constants.js";
import { useCheckedIds } from "./hooks/useCheckedIds.js";
import { useNotes } from "./hooks/useNotes.js";
import SharedListScreen, { parseSharedIds } from "./components/SharedListScreen.jsx";
import ShareModal from "./components/ShareModal.jsx";
import AppHeader from "./components/AppHeader.jsx";
import FooterTabs from "./components/FooterTabs.jsx";
import TitleListScreen from "./components/TitleListScreen.jsx";
import ListScreen from "./components/ListScreen.jsx";
import MapScreen from "./components/MapScreen.jsx";
import GameDialog from "./components/GameDialog.jsx";
import MenuDrawer from "./components/MenuDrawer.jsx";
import { HamburgerIcon, ShareIcon } from "./components/Icons.jsx";

const HEADER_TITLES = {
  titles: "タイトル一覧",
  checklist: "リスト",
  map: "会場マップ",
};

// ?shared=1,5,23 がURLにあるか（起動時に一度だけ判定。フェーズ3: 共有機能）
const SHARED_IDS = parseSharedIds();

export default function App() {
  // 閲覧専用モード: 共有されたリストだけを表示し、localStorageには一切触れない
  if (SHARED_IDS !== null) {
    return <SharedListScreen sharedIds={SHARED_IDS} />;
  }
  return <MainApp />;
}

function MainApp() {
  // ページ全体のピンチズームを無効化（フェーズ1から維持）
  useEffect(() => {
    let meta = document.querySelector('meta[name="viewport"]');
    const original = meta ? meta.getAttribute("content") : null;
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "viewport";
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no");
    return () => {
      if (original !== null) meta.setAttribute("content", original);
    };
  }, []);

  const [activeTab, setActiveTab] = useState("titles"); // 'titles' | 'checklist' | 'map'
  const [mapFloor, setMapFloor] = useState("1F");       // '1F' | '3F'
  const [mapZoomTarget, setMapZoomTarget] = useState(null);
  const [selectedGame, setSelectedGame] = useState(null);
  const [modalSource, setModalSource] = useState("list"); // 'list' | 'checklist' | 'map-drawer' | 'map'
  const [menuOpen, setMenuOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false); // 共有モーダル（フェーズ3）

  // メモ（localStorage "bitsummit-notes" と同期。フェーズ3）
  const { notes, saveNote } = useNotes();

  // リスト / グリッド表示（localStorageに保持。指示書5-6）
  const [viewMode, setViewMode] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.viewMode);
      return saved === "grid" ? "grid" : "list";
    } catch { return "list"; }
  });
  const changeViewMode = (mode) => {
    setViewMode(mode);
    try { localStorage.setItem(STORAGE_KEYS.viewMode, mode); } catch {}
  };

  // チェック状態（localStorage "bitsummit-checked" と同期。キー変更禁止）
  // チェック解除したブースが現在のマップズームtargetなら解除する（フェーズ1から維持）
  const { checkedIds, toggleCheck } = useCheckedIds({
    onRemove: (id) => {
      const game = GAMES.find(g => g.id === id);
      if (game && mapZoomTarget && mapZoomTarget.boothId === game.booth) {
        setMapZoomTarget(null);
      }
    },
  });

  // チェック済みIDからブース番号の集合を作る（マップの色付け用）
  const checkedBooths = useMemo(() => {
    return new Set(
      GAMES.filter(g => checkedIds.has(g.id)).map(g => g.booth)
    );
  }, [checkedIds]);

  // マップ上のブース押下 → 該当ブースの先頭タイトルをダイアログ表示
  const handleBoothClick = (boothId) => {
    const games = GAMES.filter(g => g.booth === boothId);
    if (games.length > 0) { setSelectedGame(games[0]); setModalSource("map"); }
  };

  // カード押下 → ダイアログを開く（source は表示元によって変わる）
  const openGame = (game, source) => {
    setSelectedGame(game);
    setModalSource(source);
  };

  // ヘッダー右のアイコン（画面ごとに異なる）
  const headerRight =
    activeTab === "titles" ? (
      <button className="header-icon-btn" onClick={() => setMenuOpen(true)} aria-label="メニュー">
        <HamburgerIcon />
      </button>
    ) : activeTab === "checklist" ? (
      // 共有機能（フェーズ3）: チェックが1件もない場合は押せない
      <button
        type="button"
        className="header-icon-btn"
        aria-label="リストを共有"
        disabled={checkedIds.size === 0}
        style={checkedIds.size === 0 ? { opacity: 0.45 } : undefined}
        onClick={() => setShareOpen(true)}
      >
        <ShareIcon />
      </button>
    ) : null;

  return (
    <div className="app-root">
      <AppHeader title={HEADER_TITLES[activeTab]} right={headerRight} />

      <main className="app-main">
        {activeTab === "titles" && (
          <TitleListScreen
            viewMode={viewMode}
            onViewModeChange={changeViewMode}
            onOpenGame={openGame}
          />
        )}
        {activeTab === "checklist" && (
          <ListScreen
            checkedIds={checkedIds}
            viewMode={viewMode}
            onViewModeChange={changeViewMode}
            onOpenGame={openGame}
          />
        )}
        {activeTab === "map" && (
          <MapScreen
            mapFloor={mapFloor} setMapFloor={setMapFloor}
            mapZoomTarget={mapZoomTarget}
            checkedIds={checkedIds}
            checkedBooths={checkedBooths}
            onBoothClick={handleBoothClick}
            onOpenGame={openGame}
          />
        )}
      </main>

      <FooterTabs active={activeTab} onChange={setActiveTab} />

      {/* ハンバーガーメニューのドロワー */}
      {menuOpen && <MenuDrawer onClose={() => setMenuOpen(false)} />}

      {/* 共有モーダル（リスト画面ヘッダーの共有アイコンから） */}
      {shareOpen && (
        <ShareModal checkedIds={checkedIds} onClose={() => setShareOpen(false)} />
      )}

      {/* ゲーム詳細ダイアログ */}
      {selectedGame && (
        <GameDialog
          game={selectedGame}
          source={modalSource}
          note={notes[selectedGame.id] || ""}
          onSaveNote={saveNote}
          isChecked={checkedIds.has(selectedGame.id)}
          onToggleCheck={() => {
            toggleCheck(selectedGame.id);
            setSelectedGame(null);
          }}
          onClose={() => setSelectedGame(null)}
          onShowOnMap={() => {
            setActiveTab("map");
            setMapFloor(selectedGame.floor);
            setMapZoomTarget({ boothId: selectedGame.booth, floor: selectedGame.floor });
            setSelectedGame(null);
          }}
        />
      )}
    </div>
  );
}
