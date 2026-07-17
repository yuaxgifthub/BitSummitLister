// ============================================================
// チェック状態 + localStorage 同期フック
// 現行 App.jsx の checkedIds / toggleCheck をそのまま抽出したもの。
// storageキー "bitsummit-checked" は既存データ互換のため変更禁止（指示書1）。
// ============================================================
import { useState } from "react";
import { STORAGE_KEYS } from "../constants.js";

/**
 * @param {object}   [options]
 * @param {function} [options.onRemove] チェック解除時に解除されたidで呼ばれる。
 *   現行実装で「解除したブースが現在のマップズームtargetならクリアする」処理を
 *   App側から注入するために使う（呼び出しタイミングは現行と同一: updater内）。
 */
export function useCheckedIds({ onRemove } = {}) {
  const [checkedIds, setCheckedIds] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.checked);
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch { return new Set(); }
  });

  const toggleCheck = (id) => {
    setCheckedIds(prev => {
      const next = new Set(prev);
      const willRemove = next.has(id);
      willRemove ? next.delete(id) : next.add(id);
      try { localStorage.setItem(STORAGE_KEYS.checked, JSON.stringify([...next])); } catch {}
      // チェック解除時のみ通知（現行のズームターゲット解除処理に対応）
      if (willRemove && onRemove) onRemove(id);
      return next;
    });
  };

  return { checkedIds, toggleCheck };
}
