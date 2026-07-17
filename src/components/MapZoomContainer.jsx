// ============================================================
// マップのズーム/パン制御コンテナ
// ※ロジックは不可侵（指示書3-3）。App.jsxからの移動のみで中身は無変更。
//   ・スマホ: 1本指パン（タップと閾値8pxで判別）/ 2本指ピンチズーム
//   ・PC: Ctrl+ホイールでズーム / 左ドラッグでパン
//   ・zoomTarget が与えられたら該当ブースへフォーカス拡大
// ============================================================
import { useState, useRef, useEffect, useCallback } from "react";
import { findBoothCenter } from "../utils/booth.js";

export default function MapZoomContainer({ children, floor, zoomTarget }) {
  const [scale, setScale] = useState(1);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const gestureRef = useRef(null);
  const containerRef = useRef(null);

  const minScaleRef = useRef(0.1);

  const calcFitScale = useCallback(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const inner = container.firstChild;
    if (!inner) return;
    const containerW = container.clientWidth;
    const containerH = container.clientHeight;
    const mapW = inner.scrollWidth;
    const mapH = inner.scrollHeight;
    if (mapW === 0 || mapH === 0) return;
    const fitScale = Math.min(containerW / mapW, containerH / mapH, 1);
    minScaleRef.current = fitScale; // 全体表示スケールを最小値として保存
    setScale(fitScale);
    setTranslate({ x: 0, y: 0 });
  }, []);

  // パン範囲をマップの境界内に制限
  const clampTranslate = useCallback((tx, ty, currentScale) => {
    if (!containerRef.current) return { x: tx, y: ty };
    const container = containerRef.current;
    const inner = container.firstChild;
    if (!inner) return { x: tx, y: ty };
    const containerW = container.clientWidth;
    const containerH = container.clientHeight;
    const mapW = inner.scrollWidth;
    const mapH = inner.scrollHeight;
    const scaledW = mapW * currentScale;
    const scaledH = mapH * currentScale;
    const minX = Math.min(0, containerW - scaledW);
    const minY = Math.min(0, containerH - scaledH);
    return {
      x: Math.min(0, Math.max(minX, tx)),
      y: Math.min(0, Math.max(minY, ty)),
    };
  }, []);

  // マウント時・フロア切替時にマップ全体が収まるスケールを自動計算
  useEffect(() => {
    const timer = setTimeout(calcFitScale, 50);
    return () => clearTimeout(timer);
  }, [floor, calcFitScale]);

  // zoomTargetが変わったら該当ブースにズームイン
  useEffect(() => {
    if (!zoomTarget || !containerRef.current) return;
    const pos = findBoothCenter(zoomTarget.boothId, zoomTarget.floor);
    if (!pos) return;
    const timer = setTimeout(() => {
      const container = containerRef.current;
      if (!container) return;
      const containerW = container.clientWidth;
      const containerH = container.clientHeight;
      const targetScale = Math.min(4, Math.max(minScaleRef.current * 2, 2.5));
      const tx = containerW / 2 - pos.cx * targetScale;
      const ty = containerH / 2 - pos.cy * targetScale;
      setScale(targetScale);
      setTranslate(clampTranslate(tx, ty, targetScale));
    }, 100);
    return () => clearTimeout(timer);
  }, [zoomTarget, clampTranslate]);

  const getDist = (t1, t2) =>
    Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY);

  // ===== タッチ操作（スマホ）=====
  // ネイティブのaddEventListenerを使用（SVG内でも確実に動作させるため）
  const scaleRef = useRef(scale);
  const translateRef = useRef(translate);
  scaleRef.current = scale;
  translateRef.current = translate;

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const TAP_THRESHOLD = 8; // この距離以内ならタップと判定（px）

    const handleTouchStart = (e) => {
      const rect = el.getBoundingClientRect();

      if (e.touches.length === 1) {
        // 1本指：まずタップ候補として記録（preventDefaultしない）
        gestureRef.current = {
          type: "pan1",
          startX: e.touches[0].clientX,
          startY: e.touches[0].clientY,
          startTranslate: { ...translateRef.current },
          isPanning: false, // まだパン開始していない
        };
      } else if (e.touches.length === 2) {
        // 2本指：ピンチズーム
        e.preventDefault();
        const midX = (e.touches[0].clientX + e.touches[1].clientX) / 2 - rect.left;
        const midY = (e.touches[0].clientY + e.touches[1].clientY) / 2 - rect.top;
        gestureRef.current = {
          type: "pinch",
          dist: getDist(e.touches[0], e.touches[1]),
          startMidX: midX,
          startMidY: midY,
          startScale: scaleRef.current,
          startTranslate: { ...translateRef.current },
        };
      }
    };

    const handleTouchMove = (e) => {
      if (!gestureRef.current) return;

      if (gestureRef.current.type === "pan1" && e.touches.length === 1) {
        const dx = e.touches[0].clientX - gestureRef.current.startX;
        const dy = e.touches[0].clientY - gestureRef.current.startY;
        const dist = Math.hypot(dx, dy);

        if (!gestureRef.current.isPanning && dist < TAP_THRESHOLD) return; // まだタップ範囲内

        // 閾値を超えたらパン開始
        e.preventDefault();
        gestureRef.current.isPanning = true;
        const tx = gestureRef.current.startTranslate.x + dx;
        const ty = gestureRef.current.startTranslate.y + dy;
        setTranslate(clampTranslate(tx, ty, scaleRef.current));

      } else if (gestureRef.current.type === "pinch" && e.touches.length === 2) {
        e.preventDefault();
        const rect = el.getBoundingClientRect();
        const newDist = getDist(e.touches[0], e.touches[1]);
        const ratio = newDist / gestureRef.current.dist;
        const newScale = Math.min(4, Math.max(minScaleRef.current, gestureRef.current.startScale * ratio));
        const scaleChange = newScale / gestureRef.current.startScale;
        const { startMidX, startMidY, startTranslate } = gestureRef.current;
        const tx = startTranslate.x * scaleChange + startMidX * (1 - scaleChange);
        const ty = startTranslate.y * scaleChange + startMidY * (1 - scaleChange);
        setScale(newScale);
        setTranslate(clampTranslate(tx, ty, newScale));
      }
    };

    const handleTouchEnd = () => { gestureRef.current = null; };

    el.addEventListener("touchstart", handleTouchStart, { passive: false });
    el.addEventListener("touchmove", handleTouchMove, { passive: false });
    el.addEventListener("touchend", handleTouchEnd);
    return () => {
      el.removeEventListener("touchstart", handleTouchStart);
      el.removeEventListener("touchmove", handleTouchMove);
      el.removeEventListener("touchend", handleTouchEnd);
    };
  }, [clampTranslate]);

  // ===== PC操作 =====
  // Ctrl+ホイール：ズーム、左クリックドラッグ：移動
  const onWheel = (e) => {
    if (!e.ctrlKey) return; // Ctrlなしは無視
    e.preventDefault();
    const rect = containerRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    const newScale = Math.min(4, Math.max(minScaleRef.current, scale * delta));
    const scaleChange = newScale / scale;
    setScale(newScale);
    setTranslate(prev => {
      const rawTx = mouseX - scaleChange * (mouseX - prev.x);
      const rawTy = mouseY - scaleChange * (mouseY - prev.y);
      return clampTranslate(rawTx, rawTy, newScale);
    });
  };

  const onMouseDown = (e) => {
    if (e.button !== 0) return; // 左クリックのみ
    e.preventDefault();
    gestureRef.current = {
      type: "mousepan",
      startX: e.clientX,
      startY: e.clientY,
      startTranslate: { ...translate },
    };
  };

  const onMouseMove = (e) => {
    if (!gestureRef.current || gestureRef.current.type !== "mousepan") return;
    const rawTx = gestureRef.current.startTranslate.x + (e.clientX - gestureRef.current.startX);
    const rawTy = gestureRef.current.startTranslate.y + (e.clientY - gestureRef.current.startY);
    setTranslate(clampTranslate(rawTx, rawTy, scale));
  };

  const onMouseUp = () => { gestureRef.current = null; };

  const resetZoom = () => calcFitScale();

  return (
    <div style={{ position: "relative", overflow: "hidden" }}>
      <div
        ref={containerRef}
        onWheel={onWheel}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        style={{
          overflow: "hidden",
          touchAction: "none",
          cursor: gestureRef.current?.type === "mousepan" ? "grabbing" : scale > 1 ? "grab" : "default",
          userSelect: "none",
          width: "100%",
          height: "100%",
        }}
      >
        <div style={{
          transform: `translate(${translate.x}px, ${translate.y}px) scale(${scale})`,
          transformOrigin: "0 0",
          display: "inline-block",
          willChange: "transform",
        }}>
          {children}
        </div>
      </div>
      {scale !== 1 && (
        <button onClick={resetZoom} style={{
          position: "absolute",
          top: 8, right: 8,
          background: "#ffffff",
          border: "1px solid #ff9e00",
          borderRadius: 6,
          padding: "6px 10px",
          color: "#ff9e00",
          fontFamily: "monospace",
          fontSize: 11,
          fontWeight: "bold",
          cursor: "pointer",
          boxShadow: "0 1px 4px rgba(0,0,0,0.15)",
          zIndex: 10,
        }}>⟲ リセット</button>
      )}
    </div>
  );
}
