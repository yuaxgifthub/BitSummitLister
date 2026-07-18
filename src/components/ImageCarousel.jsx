// ============================================================
// 画像カルーセル（フェーズ2: ライトテーマ + 左右矢印）
// - 1〜5枚対応、0枚は「No Image...」表示
// - 4秒で自動切替（指示書5-5）・左右スワイプ・矢印タップで手動切替
// - ページャー: 現在 #E09706 / 非現在はグレー（CSS変数参照）
// - 読み込み失敗した画像は onError で除外（電波が弱くても崩れない）
// ロジック（自動切替・スワイプ・onError除外）はフェーズ1から無変更。
// ============================================================
import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { CAROUSEL_INTERVAL_MS } from "../constants.js";

export default function ImageCarousel({ images }) {
  const [index, setIndex] = useState(0);
  const [loadErrors, setLoadErrors] = useState({});
  const touchStartX = useRef(null);
  const touchEndX = useRef(null);

  // 最大5枚に制限（申し送り: ダイアログのカルーセルはMax5枚）
  const validImages = useMemo(
    () => (images || []).slice(0, 5).filter((p) => !loadErrors[p]),
    [images, loadErrors]
  );

  // index安全化
  useEffect(() => {
    if (validImages.length === 0) {
      if (index !== 0) setIndex(0);
    } else if (index >= validImages.length) {
      setIndex(0);
    }
  }, [validImages.length, index]);

  // 4秒で自動切替
  useEffect(() => {
    if (validImages.length <= 1) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % validImages.length);
    }, CAROUSEL_INTERVAL_MS);
    return () => clearInterval(timer);
  }, [validImages.length, index]);

  const goNext = useCallback(() => {
    if (validImages.length === 0) return;
    setIndex((prev) => (prev + 1) % validImages.length);
  }, [validImages.length]);

  const goPrev = useCallback(() => {
    if (validImages.length === 0) return;
    setIndex((prev) => (prev - 1 + validImages.length) % validImages.length);
  }, [validImages.length]);

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    touchEndX.current = null;
  };
  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = () => {
    if (touchStartX.current == null || touchEndX.current == null) return;
    const dx = touchEndX.current - touchStartX.current;
    const THRESHOLD = 40;
    if (dx < -THRESHOLD) goNext();      // 右→左フリックで次へ
    else if (dx > THRESHOLD) goPrev();  // 左→右フリックで前へ
    touchStartX.current = null;
    touchEndX.current = null;
  };

  // 画像が1枚も無い場合
  if (validImages.length === 0) {
    return (
      <div className="carousel-wrap">
        <div className="carousel-noimg">No Image...</div>
      </div>
    );
  }

  const multi = validImages.length > 1;

  return (
    <div className="carousel-wrap">
      <div
        className="carousel-frame"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* 画像レイヤー: 全画像を重ねてopacityでフェード */}
        {validImages.map((src, i) => (
          <img
            key={src}
            src={src}
            alt=""
            onError={() => setLoadErrors((prev) => ({ ...prev, [src]: true }))}
            style={{
              opacity: i === index ? 1 : 0,
              pointerEvents: i === index ? "auto" : "none",
            }}
          />
        ))}
      </div>

      {/* 左右矢印（Figma仕様: 16×16・画像の外側。画像とは4px、ダイアログ縁とは8px） */}
      {multi && (
        <>
          <button className="carousel-arrow prev" onClick={goPrev} aria-label="前の画像" />
          <button className="carousel-arrow next" onClick={goNext} aria-label="次の画像" />
        </>
      )}

      {/* ページャー（設定されている画像分を表示） */}
      {multi && (
        <div className="carousel-pager">
          {validImages.map((_, i) => (
            <button
              key={i}
              className={`carousel-dot${i === index ? " active" : ""}`}
              onClick={() => setIndex(i)}
              aria-label={`画像 ${i + 1} を表示`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
