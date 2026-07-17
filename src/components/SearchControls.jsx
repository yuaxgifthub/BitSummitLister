// ============================================================
// 検索・絞り込み・表示切替の操作列（タイトル一覧 / リスト画面 共通）
// - 下→上スクロールでフェードアウト / 上→下でフェードイン（hidden prop）
// - 表示切替: 選択 #F96A2E / 非選択 #FFA783（仕様書指定）
// ============================================================
import { MagnifierIcon, ListIcon, GridIcon, FunnelIcon } from "./Icons.jsx";

export default function SearchControls({
  hidden,
  searchText, onSearchChange,
  viewMode, onViewModeChange,
  onFilterClick,
}) {
  return (
    <div className={`search-controls${hidden ? " hidden" : ""}`}>
      <button className="filter-btn" onClick={onFilterClick} aria-label="絞り込み">
        <FunnelIcon />
      </button>
      <div className="search-box">
        <MagnifierIcon color="#666666" size={18} />
        <input
          type="text"
          placeholder="検索"
          value={searchText}
          onChange={e => onSearchChange(e.target.value)}
          aria-label="ブース番号・出展者名・タイトル名・説明文で検索"
        />
      </div>
      <div className="view-toggle">
        <button
          className={`view-toggle-btn${viewMode === "list" ? " active" : ""}`}
          onClick={() => onViewModeChange("list")}
          aria-label="リスト表示"
        >
          <ListIcon color="#ffffff" size={22} />
        </button>
        <div className="view-toggle-divider" />
        <button
          className={`view-toggle-btn${viewMode === "grid" ? " active" : ""}`}
          onClick={() => onViewModeChange("grid")}
          aria-label="グリッド表示"
        >
          <GridIcon />
        </button>
      </div>
    </div>
  );
}
