// ============================================================
// ページネーション（< 1 2 3 … 5 > 形式）
// - 10件/ページ。10件以内なら「1」のみ表示（仕様書指定）
// - 末のカードから Y:40 離す（CSS .pagination の margin-top: 40px）
// ============================================================

// 表示するページ番号の並びを作る
// 改善: どのページでも表示形式を固定する。
//   現在ページを起点に連続3ページ + 「…」 + 最終ページ。
//   例) 3頁目「< 3 4 5 … 34 >」/ 1頁目「< 1 2 3 … 34 >」
//   末尾付近では最終ページと重複・逆転しないよう起点を寄せる。
function buildPages(current, total) {
  if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1);

  // 連続3ページの起点。末尾では最終ページの手前に収める
  let start = current;
  if (start > total - 2) start = total - 2; // 例: total34なら最大32起点(32,33,34)
  if (start < 1) start = 1;

  const seq = [start, start + 1, start + 2].filter(p => p <= total);
  const result = [...seq];

  // 最終ページを付ける（連続窓に既に含まれていなければ「…」を挟む）
  const last = seq[seq.length - 1];
  if (last < total) {
    if (total - last > 1) result.push("…");
    result.push(total);
  }
  return result;
}

export default function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 0) return null;
  const pages = buildPages(page, totalPages);
  return (
    <div className="pagination">
      <button
        className="page-btn"
        onClick={() => onChange(page - 1)}
        disabled={page <= 1}
        aria-label="前のページ"
      >&lt;</button>
      {pages.map((p, i) =>
        p === "…" ? (
          <span key={`e${i}`} className="page-ellipsis">…</span>
        ) : (
          <button
            key={p}
            className={`page-btn${p === page ? " current" : ""}`}
            onClick={() => onChange(p)}
            aria-label={`${p}ページ目`}
            aria-current={p === page ? "page" : undefined}
          >{p}</button>
        )
      )}
      <button
        className="page-btn"
        onClick={() => onChange(page + 1)}
        disabled={page >= totalPages}
        aria-label="次のページ"
      >&gt;</button>
    </div>
  );
}
