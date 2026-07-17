// ============================================================
// リスト画面（フェーズ2新設。画像「リスト画面_リスト.jpg」「リスト画面_グリッド.jpg」参照）
// - チェックしたタイトルのみを表示
// - ヘッダー〜表示切替まではタイトル一覧画面と同様の仕様
// - カード押下でダイアログ（チェックを外す / 会場マップを見る）
// - 共有機能（ヘッダーの共有アイコン）はフェーズ3で実装
// ============================================================
import { useState, useMemo, useEffect, useRef } from "react";
import GAMES from "../data/games.json";
import { PAGE_SIZE } from "../constants.js";
import SearchControls from "./SearchControls.jsx";
import FilterModal from "./FilterModal.jsx";
import GameCard from "./GameCard.jsx";
import Pagination from "./Pagination.jsx";
import { useScrollFade } from "../hooks/useScrollFade.js";

export default function ListScreen({ checkedIds, viewMode, onViewModeChange, onOpenGame }) {
  const [searchText, setSearchText] = useState("");
  const [floor, setFloor] = useState("すべて");
  const [genre, setGenre] = useState("すべて");
  const [filterOpen, setFilterOpen] = useState(false);
  const [page, setPage] = useState(1);
  const scrollRef = useRef(null);
  const { hidden, onScroll, reset } = useScrollFade();

  // チェック済みタイトルを母集団として検索・絞り込み
  const filtered = useMemo(() => {
    const q = searchText.toLowerCase();
    return GAMES.filter(g => {
      if (!checkedIds.has(g.id)) return false;
      const matchText = searchText === "" ||
        g.title.toLowerCase().includes(q) ||
        g.exhibitor.toLowerCase().includes(q) ||
        g.booth.toLowerCase().includes(q) ||
        g.description.toLowerCase().includes(q);
      const matchGenre = genre === "すべて" || g.genre === genre;
      const matchFloor = floor === "すべて" || g.floor === floor;
      return matchText && matchGenre && matchFloor;
    });
  }, [checkedIds, searchText, genre, floor]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => { setPage(1); }, [searchText, genre, floor]);

  // チェック解除で現在ページが空になった場合は前のページへ戻す
  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const changePage = (p) => {
    setPage(p);
    if (scrollRef.current) scrollRef.current.scrollTo({ top: 0 });
    reset();
  };

  const isEmpty = checkedIds.size === 0;

  return (
    <div style={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column" }}>
      <SearchControls
        hidden={hidden}
        searchText={searchText}
        onSearchChange={setSearchText}
        viewMode={viewMode}
        onViewModeChange={onViewModeChange}
        onFilterClick={() => setFilterOpen(true)}
      />

      <div className="list-scroll" ref={scrollRef} onScroll={onScroll}>
        {isEmpty ? (
          <div className="empty-state">
            <div style={{ fontSize: 28 }}>✓</div>
            <div>チェックしたタイトルがここに表示されます</div>
          </div>
        ) : pageItems.length === 0 ? (
          <div className="empty-state">
            <div style={{ fontSize: 28 }}>🔍</div>
            <div>条件に一致するタイトルがありません</div>
          </div>
        ) : viewMode === "grid" ? (
          <div className="card-grid-wrap">
            {pageItems.map(game => (
              <GameCard key={game.id} game={game} variant="grid"
                onClick={() => onOpenGame(game, "checklist")} />
            ))}
          </div>
        ) : (
          pageItems.map(game => (
            <GameCard key={game.id} game={game} variant="list"
              onClick={() => onOpenGame(game, "checklist")} />
          ))
        )}

        {!isEmpty && filtered.length > 0 && (
          <Pagination page={page} totalPages={totalPages} onChange={changePage} />
        )}
      </div>

      {filterOpen && (
        <FilterModal
          floor={floor}
          genre={genre}
          onApply={(f, g) => { setFloor(f); setGenre(g); }}
          onClose={() => setFilterOpen(false)}
        />
      )}
    </div>
  );
}
