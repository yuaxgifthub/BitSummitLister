// ============================================================
// 固定ヘッダー（オレンジグラデーション・タイトル中央・右にアイコン）
// shared=true で閲覧専用モードの別トーンに切り替わる（フェーズ3で使用）
// ============================================================
export default function AppHeader({ title, right = null, shared = false }) {
  return (
    <header className={`app-header${shared ? " shared" : ""}`}>
      <div className="app-header-title">{title}</div>
      {right && <div className="app-header-right">{right}</div>}
    </header>
  );
}
