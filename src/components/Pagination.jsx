// ============================================================
// ページネーション（< 1 2 3 … 5 > 形式）
// - 10件/ページ。10件以内なら「1」のみ表示（仕様書指定）
// - 末のカードから Y:40 離す（CSS .pagination の margin-top: 40px）
// ============================================================

// 表示するページ番号の並びを作る
// 改善5: 現在ページによって表示数が増減しないよう、常に安定した形式にする。
//   ・現在ページを含む連続3ページの窓 + 先頭(1) + 末尾(total) を表示
//   ・離れている場合のみ「…」を挟む
//   例) 34ページ中: 1頁目「1 2 3 … 34」/ 2頁目「1 2 3 … 34」/
//       4頁目「1 … 3 4 5 … 34」/ 34頁目「1 … 32 33 34」
function buildPages(current, total) {
  if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1);

  // 現在ページを中心とした連続3ページの窓（端では窓ごと寄せる）
  let start = current - 1;
  if (start < 1) start = 1;
  if (start > total - 2) start = total - 2;
  const windowPages = [start, start + 1, start + 2];

  // 先頭・末尾を加えて昇順に整列（重複は除去）
  const sorted = [...new Set([1, ...windowPages, total])].sort((a, b) => a - b);

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
