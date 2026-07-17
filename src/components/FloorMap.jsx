// ============================================================
// フロアマップのSVG描画
// ※ロジックは不可侵（指示書3-3）。App.jsxからの移動のみで中身は無変更。
//   ・グリッドデータ(MAP_1F/MAP_3F)からブース矩形を抽出して描画
//   ・チェック済みブースをハイライト
//   ・ゲームが紐づくブースはタップでダイアログを開ける
// ============================================================
import { useMemo } from "react";
import { MAP_1F, MAP_3F } from "../data/mapData.js";
import { extractBooths } from "../utils/booth.js";
import GAMES from "../data/games.json";

export default function FloorMap({ floor, checkedBooths, onBoothClick }) {
  const grid = floor === "1F" ? MAP_1F : MAP_3F;
  const ROWS = grid.length;
  const COLS = Math.max(...grid.map(r => r.length));
  const CELL = 9;
  const PAD = 10;

  const booths = useMemo(() => extractBooths(grid), [grid]);
  const highlightedBooths = new Set(checkedBooths);

  return (
    <div style={{ overflowX: "auto", overflowY: "auto", WebkitOverflowScrolling: "touch" }}>
      <svg width={COLS * CELL + PAD * 2} height={ROWS * CELL + PAD * 2} style={{ display: "block" }}>
        <rect x={0} y={0} width={COLS * CELL + PAD * 2} height={ROWS * CELL + PAD * 2} fill="#f8f8f8" />

        {/* 軽量グリッド（SVGパターン1要素のみ） */}
        <defs>
          <pattern id={`grid-${floor}`} width={CELL} height={CELL} patternUnits="userSpaceOnUse" x={PAD} y={PAD}>
            <path d={`M ${CELL} 0 L 0 0 0 ${CELL}`} fill="none" stroke="#e0e0e0" strokeWidth={0.3} />
          </pattern>
        </defs>
        <rect x={PAD} y={PAD} width={COLS * CELL} height={ROWS * CELL} fill={`url(#grid-${floor})`} />

        {/* ブース・ステージ・入退場口 */}
        {booths.map(({ id, minR, maxR, minC, maxC }) => {
          const x = PAD + minC * CELL;
          const y = PAD + minR * CELL;
          const w = (maxC - minC + 1) * CELL;
          const h = (maxR - minR + 1) * CELL;
          const isStage = id === "stage";
          const isEntrance = id === "Entrance";
          const isExit = id === "Exit";
          const isPillar = id === "pillar";
          const isBF = id === "BF";
          const isBSGJ = id === "3F-BSGJ";
          const isGCG = id === "3F-GCG";
          const isSpecial = isStage || isEntrance || isExit || isPillar || isBF || isBSGJ || isGCG;
          const isHighlighted = highlightedBooths.has(id);
          const hasGames = GAMES.some(g => g.booth === id);

          const fill = isHighlighted ? "#ff9e00"
            : isStage ? "#ddeeff"
            : isEntrance ? "#d4f5e2"
            : isExit ? "#eeeeee"
            : isPillar ? "#cccccc"
            : isBF ? "#ffeedd"
                        : isBSGJ ? "#e8e0ff"
            : isGCG ? "#ffe8e8"
            : hasGames ? "#fff8ee"
            : "#f8f8f8";

          const stroke = isHighlighted ? "#e07000"
            : isStage ? "#6ab0e0"
            : isEntrance ? "#40bb70"
            : isExit ? "#aaaaaa"
            : isPillar ? "#999999"
            : isBF ? "#ffaa66"
                        : isBSGJ ? "#8866cc"
            : isGCG ? "#cc6677"
            : hasGames ? "#ff9e00"
            : "#e0e0e0";

          const textColor = isHighlighted ? "#fff"
            : isStage ? "#3a7aaa"
            : isEntrance ? "#207040"
            : isExit ? "#888888"
            : isPillar ? "#666666"
            : isBF ? "#cc5500"
                        : isBSGJ ? "#553388"
            : isGCG ? "#993344"
            : hasGames ? "#cc6600"
            : "#bbbbbb";

          const label = isStage ? `${floor} Stage`
            : isEntrance ? "入場"
            : isExit ? "出口"
            : isPillar ? ""
            : isBF ? "休憩エリア"
                        : isBSGJ ? "BitSummit Game Jam"
            : isGCG ? "ゲームクリエイター甲子園"
            : id;

          const fs = w < 18 || h < 12 ? 5 : w < 30 ? 6 : 7;

          return (
            <g key={`${id}-${minR}-${minC}`}
              style={{ cursor: hasGames ? "pointer" : "default" }}
              onClick={() => hasGames && onBoothClick(id)}>
              <rect x={x+1} y={y+1} width={w-2} height={h-2}
                fill={fill} stroke={stroke}
                strokeWidth={isHighlighted ? 1.5 : 0.8} rx={2} />
              {isHighlighted && (
                <rect x={x+1} y={y+1} width={w-2} height={h-2}
                  fill="#ff9e0033" stroke="#ff9e00" strokeWidth={2} rx={2} />
              )}
              {(w >= 10 || h >= 20) && (() => {
                const isVertical = h > w * 1.5;
                const cx = x + w / 2;
                const cy = y + h / 2;
                const fs2 = Math.min(fs, Math.floor(isVertical ? w * 0.85 : h * 0.85));
                return (
                  <text
                    x={cx} y={cy}
                    fill={textColor}
                    fontSize={Math.max(4, fs2)}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontFamily="monospace"
                    transform={isVertical ? `rotate(-90, ${cx}, ${cy})` : undefined}
                    style={{ userSelect:"none", pointerEvents:"none" }}>
                    {label}
                  </text>
                );
              })()}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
