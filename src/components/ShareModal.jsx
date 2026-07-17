// ============================================================
// 共有モーダル（フェーズ3。仕様書「共有機能について」）
// - チェック済みIDを埋め込んだURLを生成: ?shared=1,5,23
// - コピー / SNSシェア（X・LINE・端末の共有シート）ができる
// リスト画面ヘッダー右上の共有アイコンから開く。
// ============================================================
import { useState, useMemo } from "react";
import { CloseIcon } from "./Icons.jsx";

/** チェック済みIDの集合から共有URLを生成する（昇順で安定させる） */
export function buildShareUrl(checkedIds) {
  const ids = [...checkedIds].sort((a, b) => a - b).join(",");
  return `${location.origin}${location.pathname}?shared=${ids}`;
}

export default function ShareModal({ checkedIds, onClose }) {
  const url = useMemo(() => buildShareUrl(checkedIds), [checkedIds]);
  const [copied, setCopied] = useState(false);

  // クリップボードへコピー（非対応環境は execCommand にフォールバック）
  const copyUrl = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
    } catch {
      try {
        const ta = document.createElement("textarea");
        ta.value = url;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
        setCopied(true);
      } catch {}
    }
  };

  const shareText = `BitSummitのチェックリストを共有します（${checkedIds.size}件）`;

  // 端末の共有シート（対応端末のみボタンを表示）
  const canNativeShare = typeof navigator.share === "function";
  const nativeShare = async () => {
    try { await navigator.share({ title: "BitSummit リスト共有", text: shareText, url }); } catch {}
  };

  const xUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(url)}`;
  const lineUrl = `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(url)}`;

  return (
    <div className="dialog-overlay" onClick={onClose}>
      <div className="share-modal" onClick={e => e.stopPropagation()}>
        <button className="filter-close" onClick={onClose} aria-label="共有を閉じる">
          <CloseIcon color="#333333" />
        </button>

        <div className="share-modal-title">リストを共有</div>
        <div className="share-modal-sub">
          チェック済み {checkedIds.size} 件を閲覧専用リンクとして共有します
        </div>

        {/* 生成されたURL + コピー */}
        <div className="share-url-row">
          <input className="share-url-input" readOnly value={url} onFocus={e => e.target.select()} aria-label="共有URL" />
          <button className="share-copy-btn" onClick={copyUrl}>
            {copied ? "コピー済み" : "コピー"}
          </button>
        </div>

        {/* SNSシェア */}
        <div className="share-sns-row">
          {canNativeShare && (
            <button className="share-sns-btn" onClick={nativeShare}>共有…</button>
          )}
          <a className="share-sns-btn" href={xUrl} target="_blank" rel="noopener noreferrer">Xでシェア</a>
          <a className="share-sns-btn" href={lineUrl} target="_blank" rel="noopener noreferrer">LINEで送る</a>
        </div>
      </div>
    </div>
  );
}
