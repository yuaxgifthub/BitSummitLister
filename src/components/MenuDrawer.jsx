// ============================================================
// ハンバーガーメニューの右ドロワー（公式サイトへのリンク）
// タイトル一覧画面のヘッダー右上から開く。オーバーレイタップで閉じる。
// ============================================================
import { CloseIcon } from "./Icons.jsx";
import { OFFICIAL_SITE_URL } from "../constants.js";

export default function MenuDrawer({ onClose }) {
  return (
    <div className="drawer-overlay" onClick={onClose}>
      <div className="menu-drawer" onClick={e => e.stopPropagation()}>
        <div className="menu-drawer-header">
          <div className="menu-drawer-title">メニュー</div>
          <button className="header-icon-btn" onClick={onClose} aria-label="メニューを閉じる">
            <CloseIcon />
          </button>
        </div>
        <a
          className="menu-link"
          href={OFFICIAL_SITE_URL}
          target="_blank"
          rel="noopener noreferrer"
        >
          BitSummit 公式サイト
        </a>
      </div>
    </div>
  );
}
