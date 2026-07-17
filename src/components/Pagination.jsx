// ============================================================
// ページネーション（< 1 2 3 … 5 > 形式）
// - 10件/ページ。10件以内なら「1」のみ表示（仕様書指定）
// - 末のカードから Y:40 離す（CSS .pagination の margin-top: 40px）
// ============================================================

// 表示するページ番号の並びを作る（多い場合は現在ページ周辺 + 先頭/末尾 + …）
function buildPages(current, total) {
  if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1);
  const pages = new Set([1, total, current - 1, current, current + 1]);
  const sorted = [...pages].filter(p => p >= 1 && p <= total).sort((a, b) => a - b);
  const result = [];
  let prev = 0;
  for (const p of sorted) {
    if (p - prev > 1) result.push("…");
    result.push(p);
    prev = p;
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
