// ============================================================
// ブース関連ユーティリティ
// ※ロジックは不可侵（指示書3-3）。App.jsxからの移動のみで中身は無変更。
// ============================================================
import { MAP_1F, MAP_3F } from "../data/mapData.js";

// グリッドからブースの矩形領域をflood fillで抽出
export function extractBooths(grid) {
  const visited = new Set();
  const booths = [];
  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < (grid[r]?.length || 0); c++) {
      const val = grid[r][c];
      if (!val || visited.has(`${r},${c}`)) continue;
      let minR = r, maxR = r, minC = c, maxC = c;
      const queue = [[r, c]];
      visited.add(`${r},${c}`);
      while (queue.length) {
        const [cr, cc] = queue.shift();
        if (cr < minR) minR = cr; if (cr > maxR) maxR = cr;
        if (cc < minC) minC = cc; if (cc > maxC) maxC = cc;
        for (const [dr, dc] of [[0,1],[0,-1],[1,0],[-1,0]]) {
          const nr = cr+dr, nc = cc+dc;
          if (nr>=0 && nr<grid.length && nc>=0 && nc<(grid[nr]?.length||0)
              && grid[nr][nc]===val && !visited.has(`${nr},${nc}`)) {
            visited.add(`${nr},${nc}`);
            queue.push([nr, nc]);
          }
        }
      }
      booths.push({ id: val, minR, maxR, minC, maxC });
    }
  }
  return booths;
}

// グリッドからブースの中心座標を取得
export function findBoothCenter(boothId, floor) {
  const grid = floor === "1F" ? MAP_1F : MAP_3F;
  const CELL = 9, PAD = 10;
  let minR = Infinity, maxR = -Infinity, minC = Infinity, maxC = -Infinity;
  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < (grid[r]?.length || 0); c++) {
      if (grid[r][c] === boothId) {
        minR = Math.min(minR, r); maxR = Math.max(maxR, r);
        minC = Math.min(minC, c); maxC = Math.max(maxC, c);
      }
    }
  }
  if (minR === Infinity) return null;
  return {
    cx: PAD + (minC + (maxC - minC + 1) / 2) * CELL,
    cy: PAD + (minR + (maxR - minR + 1) / 2) * CELL,
  };
}
