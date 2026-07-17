// ============================================================
// メモ機能（フェーズ3）
// localStorage キー "bitsummit-notes" に {id: text} 形式で保存する。
// - 空文字を保存した場合はキーごと削除して肥大化を防ぐ
// - 閲覧専用モード（共有リスト）ではこのフックを使わない
// ============================================================
import { useState } from "react";
import { STORAGE_KEYS } from "../constants.js";

export function useNotes() {
  const [notes, setNotes] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.notes);
      const parsed = saved ? JSON.parse(saved) : {};
      // 想定外のデータ（配列等）が入っていた場合は空で初期化
      return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {};
    } catch { return {}; }
  });

  /** @param {number|string} id  @param {string} text */
  const saveNote = (id, text) => {
    setNotes(prev => {
      const next = { ...prev };
      if (text && text.trim() !== "") {
        next[id] = text;
      } else {
        delete next[id]; // 空メモは保存しない
      }
      try { localStorage.setItem(STORAGE_KEYS.notes, JSON.stringify(next)); } catch {}
      return next;
    });
  };

  return { notes, saveNote };
}
