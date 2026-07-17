// ============================================================
// 絞り込みモーダル（フロア / ジャンル）
// - フロア: すべて / 1F / 3F（仕様書指定）
// - ジャンル: 実データ(games.json)に存在するジャンルを動的に一覧化
// - 「絞り込む」押下で適用して閉じる
// ============================================================
import { useState } from "react";
import { CloseIcon } from "./Icons.jsx";
import { ALL_GENRES } from "../constants.js";

export default function FilterModal({ floor, genre, onApply, onClose }) {
  // モーダル内では一時状態を編集し、「絞り込む」で確定する
  const [tempFloor, setTempFloor] = useState(floor);
  const [tempGenre, setTempGenre] = useState(genre);

  return (
    <div className="dialog-overlay" onClick={onClose}>
      <div className="filter-modal" onClick={e => e.stopPropagation()}>
        <button className="filter-close" onClick={onClose} aria-label="絞り込みを閉じる">
          <CloseIcon color="#333333" />
        </button>

        <div className="filter-label">フロア</div>
        <select
          className="filter-select"
          value={tempFloor}
          onChange={e => setTempFloor(e.target.value)}
          aria-label="フロアで絞り込む"
        >
          {["すべて", "1F", "3F"].map(f => <option key={f}>{f}</option>)}
        </select>

        <div className="filter-label">ジャンル</div>
        <select
          className="filter-select"
          value={tempGenre}
          onChange={e => setTempGenre(e.target.value)}
          aria-label="ジャンルで絞り込む"
        >
          <option>すべて</option>
          {ALL_GENRES.map(g => <option key={g}>{g}</option>)}
        </select>

        <button
          className="filter-apply"
          onClick={() => { onApply(tempFloor, tempGenre); onClose(); }}
        >
          絞り込む
        </button>
      </div>
    </div>
  );
}
