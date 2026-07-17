// ============================================================
// スクロール方向に応じた操作列のフェード制御フック
// - 下→上へスクロール（コンテンツが上に流れる＝scrollTop増加）でフェードアウト
// - 上→下へスクロール（scrollTop減少）でフェードイン
// 検索ウィンドウ・絞り込みボタン・表示切り替えボタンで共用（仕様書指定）
// ============================================================
import { useState, useRef, useCallback } from "react";

export function useScrollFade() {
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);

  const onScroll = useCallback((e) => {
    const y = e.currentTarget.scrollTop;
    const delta = y - lastY.current;
    // 小さな揺れでチラつかないよう6pxの遊びを持たせる
    if (delta > 6 && y > 30) setHidden(true);
    else if (delta < -6) setHidden(false);
    lastY.current = y;
  }, []);

  // ページ切替などでスクロール位置をリセットした際に表示状態も戻す
  const reset = useCallback(() => {
    lastY.current = 0;
    setHidden(false);
  }, []);

  return { hidden, onScroll, reset };
}
