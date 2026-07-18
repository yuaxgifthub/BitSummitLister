// ============================================================
// ゲーム詳細ダイアログ（フェーズ2: 白基調の新デザイン。画像1,2参照）
// 要素: タイトル / 出展者名 / タグ(ブース番号・ジャンル) / 画像カルーセル /
//       出展情報(4行クランプ+「すべて読む」) / ストアリンク / メモ欄 /
//       チェックボタン / 会場マップを見るボタン / バツボタン(右上)
// 挙動（フェーズ1から維持）:
// - マスク #000000 Alpha40%、表示中は背後スクロール禁止
// - ESC・マスクタップ・×で閉じる
// - チェックボタンはトグルして閉じる
// - 「会場マップを見る」は source が checklist / map-drawer のとき表示
// フェーズ3で追加:
// - メモ欄: 鉛筆ボタンで編集モードに入り、入力は即時 onSaveNote で保存される
//   （"bitsummit-notes" への永続化は useNotes フック側が担当）
// - readOnly（共有リストの閲覧専用モード）: チェックボタン・メモ・マップ遷移を
//   一切表示しない（自分のリストには影響しない）
// ============================================================
import { useState, useEffect, useRef } from "react";
import ImageCarousel from "./ImageCarousel.jsx";
import { CloseIcon, PencilIcon } from "./Icons.jsx";
import { DESC_CLAMP_CHARS } from "../constants.js";

export default function GameDialog({
  game, source, isChecked, onToggleCheck, onClose, onShowOnMap,
  note = "", onSaveNote, readOnly = false,
}) {
  // 「会場マップを見る」ボタンの表示条件:
  // - "list": タイトル一覧 → 非表示（デザイン画像2）
  // - "checklist": リスト画面 → 表示（デザイン画像1）
  // - "map-drawer": 会場マップ画面のリストドロワー → 表示
  // - "map": マップ上のブース押下 → 非表示（既に同じ画面）
  const showMapButton =
    (source === "checklist" || source === "map-drawer") &&
    game.floor !== "未定";

  // 出展内容の全文ポップアップ開閉
  const [fullDescOpen, setFullDescOpen] = useState(false);

  // メモ入力欄への参照（鉛筆ボタンからフォーカスを当てるため）
  const memoRef = useRef(null);

  // 改善: 固定ボタンはスクロール中のみ Alpha40% に減光し押下無効化する。
  // dialog-body のスクロール検知。停止0.4秒後に通常表示へ戻す。
  const [bodyScrolling, setBodyScrolling] = useState(false);
  const scrollTimer = useRef(null);
  const handleBodyScroll = () => {
    setBodyScrolling(true);
    clearTimeout(scrollTimer.current);
    scrollTimer.current = setTimeout(() => setBodyScrolling(false), 400);
  };
  useEffect(() => () => clearTimeout(scrollTimer.current), []);

  // メモ編集モード（鉛筆で開始、iOSキーボードの「完了」= blur で解除）
  const [memoEditing, setMemoEditing] = useState(false);
  // 鉛筆を押した直後に発火する「意図しない blur」を無視するためのガード。
  // フォーカス確定前の割り込み blur で即解除されるのを防ぐ（iOS対策）。
  const memoJustOpened = useRef(false);

  const startMemoEdit = () => {
    setMemoEditing(true);
    memoJustOpened.current = true;
    // フォーカスを当ててキーボードを表示
    requestAnimationFrame(() => memoRef.current?.focus());
    // 開いた直後の短時間だけ blur を無視する
    setTimeout(() => { memoJustOpened.current = false; }, 400);
  };

  const handleMemoBlur = () => {
    // 開いた直後の意図しない blur は無視（ユーザーの「完了」ではない）
    if (memoJustOpened.current) return;
    // ユーザーがキーボードの「完了」を押した＝編集終了
    setMemoEditing(false);
  };

  // 背後スクロール禁止（表示中のみ）
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, []);

  // ESCで閉じる
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const images = Array.isArray(game.images) ? game.images : [];
  const description = game.description || "";
  // 27文字×4行=108文字を超える場合に「すべて読む」を出す（指示書5-5）
  const needsExpand = description.length > DESC_CLAMP_CHARS;

  return (
    <>
      {/* マスク + ダイアログ */}
      <div className="dialog-overlay" onClick={onClose}>
        {/* バツボタン（右上・ダイアログの外側。デザイン画像1,2参照） */}
        <button className="dialog-close" onClick={onClose} aria-label="閉じる">
          <CloseIcon />
        </button>

        <div className="dialog-card with-actions" onClick={(e) => e.stopPropagation()}>
          {/* 改善7: 中身を「スクロール領域(dialog-body)」と「固定フッター(dialog-actions)」に
              分離し、スクロールしてもチェック等のボタンが常に押せるようにする */}
          <div className={`dialog-body${showMapButton ? " two-actions" : ""}`} onScroll={handleBodyScroll}>
          {/* タイトル・出展者名 */}
          <div className="dialog-title">{game.title}</div>
          <div className="dialog-exhibitor">{game.exhibitor || "「」"}</div>

          {/* タグ: ブース番号 + ジャンル */}
          <div className="card-tags" style={{ marginTop: 12 }}>
            <span className="tag tag-booth">{game.booth}</span>
            <span className="tag tag-genre">{game.genre}</span>
          </div>

          {/* タイトル画像カルーセル（Max5枚 + ページャー） */}
          <ImageCarousel images={images} />

          {/* 出展情報 */}
          <div className="dialog-section-title">出展情報</div>
          <div className="dialog-desc">{description}</div>
          {needsExpand && (
            <div style={{ textAlign: "right", marginTop: 6 }}>
              <button className="read-all-btn" onClick={() => setFullDescOpen(true)}>
                すべて読む
              </button>
            </div>
          )}

          {/* ストアリンク */}
          <div className="dialog-section-title">ストアリンク</div>
          {game.storeUrl ? (
            <a
              className="store-link"
              href={game.storeUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              {game.storeUrl}
            </a>
          ) : (
            <span style={{ fontSize: 13, color: "#888888" }}>None</span>
          )}

          {/* メモ欄（フェーズ3: "bitsummit-notes" に保存。閲覧専用モードでは非表示）
              鉛筆ボタンで編集モードに入り入力可能になる。
              解除は iOSキーボードの「完了」(=blur) で行うが、鉛筆押下直後の
              意図しない blur は memoJustOpened ガードで無視し、即解除を防ぐ。 */}
          {!readOnly && (
            <>
              <div className="memo-head">
                <span className="dialog-section-title" style={{ margin: 0 }}>メモ</span>
                <button
                  type="button"
                  className={`memo-edit-btn${memoEditing ? " editing" : ""}`}
                  aria-label={memoEditing ? "メモの編集を終了" : "メモを編集"}
                  onClick={() => (memoEditing ? setMemoEditing(false) : startMemoEdit())}
                >
                  <PencilIcon color={memoEditing ? "#ffffff" : "#333333"} />
                </button>
                {memoEditing && <span className="memo-editing-label">編集中（自動保存）</span>}
              </div>
              <textarea
                ref={memoRef}
                className="memo-area"
                readOnly={!memoEditing}
                value={note}
                onChange={e => onSaveNote?.(game.id, e.target.value)}
                onBlur={handleMemoBlur}
                placeholder={memoEditing ? "メモを入力…" : "鉛筆ボタンを押すとメモを編集できます"}
                aria-label="メモ"
              />
            </>
          )}

          </div>{/* /dialog-body（ここまでがスクロール領域） */}

          {/* 固定フッター: スクロールしても常時表示されるボタン群（改善7） */}
          {!readOnly && (
            <div className={`dialog-actions${bodyScrolling ? " scrolling" : ""}`}>
              {/* チェックボタン（トグルして閉じる） */}
              <button className="dialog-btn" onClick={() => { onToggleCheck(); onClose(); }}>
                {isChecked ? "チェックを外す" : "チェックする"}
              </button>

              {/* 会場マップを見るボタン */}
              {showMapButton && (
                <button className="dialog-btn" onClick={onShowOnMap}>
                  会場マップを見る
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 出展内容 全文ポップアップ */}
      {fullDescOpen && (
        <div
          className="dialog-overlay"
          style={{ zIndex: 300 }}
          onClick={() => setFullDescOpen(false)}
        >
          <div className="dialog-card" onClick={(e) => e.stopPropagation()}>
            <div className="dialog-section-title" style={{ marginTop: 0 }}>出展情報</div>
            <div style={{
              fontSize: 13,
              lineHeight: 1.8,
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
              color: "#444444",
            }}>
              {description}
            </div>
            <button
              className="dialog-btn"
              style={{ marginTop: 22 }}
              onClick={() => setFullDescOpen(false)}
            >
              閉じる
            </button>
          </div>
        </div>
      )}
    </>
  );
}
