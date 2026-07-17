// ============================================================
// タイトル一覧画面（フェーズ2新デザイン。画像「タイトル一覧画面.jpg」参照）
// - 検索（ブース番号・出展者名・タイトル名・説明文）
// - 絞り込み（フロア / ジャンル）モーダル
// - リスト / グリッド表示切替
// - 10件/ページのページネーション
// - スクロールで操作列がフェードイン/アウト
// ============================================================
import { useState, useMemo, useEffect, useRef } from "react";
import GAMES from "../data/games.json";
import { PAGE_SIZE } from "../constants.js";
import SearchControls from "./SearchControls.jsx";
import FilterModal from "./FilterModal.jsx";
import GameCard from "./GameCard.jsx";
import Pagination from "./Pagination.jsx";
import { useScrollFade } from "../hooks/useScrollFade.js";

export default function TitleListScreen({ viewMode, onViewModeChange, onOpenGame }) {
  const [searchText, setSearchText] = useState("");
  const [floor, setFloor] = useState("すべて");
  const [genre, setGenre] = useState("すべて");
  const [filterOpen, setFilterOpen] = useState(false);
  const [page, setPage] = useState(1);
  const scrollRef = useRef(null);
  const { hidden, onScroll, reset } = useScrollFade();

  // 検索・絞り込みの複合フィルタ（検索範囲は既存仕様を流用）
  const filtered = useMemo(() => {
    const q = searchText.toLowerCase();
    return GAMES.filter(g => {
      const matchText = searchText === "" ||
        g.title.toLowerCase().includes(q) ||
        g.exhibitor.toLowerCase().includes(q) ||
        g.booth.toLowerCase().includes(q) ||
        g.description.toLowerCase().includes(q);
      const matchGenre = genre === "すべて" || g.genre === genre;
      const matchFloor = floor === "すべて" || g.floor === floor;
      return matchText && matchGenre && matchFloor;
    });
  }, [searchText, genre, floor]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // 検索・絞り込みが変わったら1ページ目に戻す
  useEffect(() => { setPage(1); }, [searchText, genre, floor]);

  // ページが変わったらリストの先頭へ
  const changePage = (p) => {
    setPage(p);
    if (scrollRef.current) scrollRef.current.scrollTo({ top: 0 });
    reset();
  };

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
        {pageItems.length === 0 ? (
          <div className="empty-state">
            <div style={{ fontSize: 28 }}>🔍</div>
            <div>条件に一致するタイトルがありません</div>
          </div>
        ) : viewMode === "grid" ? (
          <div className="card-grid-wrap">
            {pageItems.map(game => (
              <GameCard key={game.id} game={game} variant="grid"
                onClick={() => onOpenGame(game, "list")} />
            ))}
          </div>
        ) : (
          pageItems.map(game => (
            <GameCard key={game.id} game={game} variant="list"
              onClick={() => onOpenGame(game, "list")} />
          ))
        )}

        {filtered.length > 0 && (
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
