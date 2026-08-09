import { useEffect, useRef, useState } from "react";

/**
 * 홈 상단 배너 캐러셀.
 *
 * - site.yaml의 banners 슬라이드를 회색 배경 위에 표시
 * - 10초마다 옆으로 밀리는 애니메이션으로 자동 전환
 * - 마우스/터치로 좌우로 드래그(스와이프)해서 넘길 수 있음
 * - 하단 점을 눌러 원하는 슬라이드로 바로 이동
 */

interface Slide {
  label: string;
  title: string;
  body: string;
  button: string;
  link: string;
}

interface Props {
  slides: Slide[];
}

const INTERVAL_MS = 10000;
const SWIPE_THRESHOLD_PX = 60;

export default function HomeBanner({ slides }: Props) {
  const [index, setIndex] = useState(0);
  const [dragDelta, setDragDelta] = useState(0);
  const [dragging, setDragging] = useState(false);
  const dragStartX = useRef(0);
  const didDrag = useRef(false);
  const count = slides.length;

  // 10초마다 자동 전환 (수동 전환 시 타이머가 처음부터 다시 시작)
  useEffect(() => {
    if (count <= 1) return;
    const id = window.setTimeout(
      () => setIndex((i) => (i + 1) % count),
      INTERVAL_MS,
    );
    return () => window.clearTimeout(id);
  }, [index, count]);

  if (count === 0) return null;

  const goTo = (i: number) => setIndex(((i % count) + count) % count);

  const onPointerDown = (e: React.PointerEvent) => {
    if (count <= 1) return;
    dragStartX.current = e.clientX;
    didDrag.current = false;
    setDragging(true);
    setDragDelta(0);
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging) return;
    const delta = e.clientX - dragStartX.current;
    if (Math.abs(delta) > 5) didDrag.current = true;
    setDragDelta(delta);
  };

  const endDrag = () => {
    if (!dragging) return;
    const delta = dragDelta;
    setDragging(false);
    setDragDelta(0);
    if (delta <= -SWIPE_THRESHOLD_PX) goTo(index + 1);
    else if (delta >= SWIPE_THRESHOLD_PX) goTo(index - 1);
  };

  return (
    <section className="bg-[#F5F5F5] border-y border-[#E4E4E7] overflow-hidden">
      <div
        className={`flex select-none ${dragging ? "" : "transition-transform duration-700 ease-in-out"} ${count > 1 ? "cursor-grab active:cursor-grabbing" : ""}`}
        style={{
          transform: `translateX(calc(-${index * 100}% + ${dragDelta}px))`,
          touchAction: "pan-y",
        }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onClickCapture={(e) => {
          // 드래그 직후의 클릭은 링크 이동으로 처리하지 않음
          if (didDrag.current) {
            e.preventDefault();
            e.stopPropagation();
          }
        }}
      >
        {slides.map((slide, i) => (
          <div key={i} className="w-full flex-shrink-0">
            <div className="max-w-[1200px] mx-auto px-6 lg:px-[60px] py-5 md:py-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-8">
              <div className="flex flex-col gap-1.5 md:gap-2">
                <span className="text-[10px] md:text-xs text-muted-foreground uppercase tracking-[1.5px] font-medium">
                  {slide.label}
                </span>
                <h2 className="text-base md:text-xl font-semibold text-foreground">
                  {slide.title}
                </h2>
                <p className="text-sm md:text-base text-muted">{slide.body}</p>
              </div>
              <a
                href={slide.link}
                draggable={false}
                className="flex-shrink-0 inline-flex items-center justify-center bg-primary text-primary-foreground text-sm md:text-base font-medium px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
              >
                {slide.button}
              </a>
            </div>
          </div>
        ))}
      </div>

      {count > 1 && (
        <div className="flex justify-center gap-1.5 pb-3">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`배너 ${i + 1}`}
              onClick={() => goTo(i)}
              className={`w-2 h-2 rounded-full transition-colors ${
                i === index ? "bg-[#71717A]" : "bg-[#D4D4D8] hover:bg-[#A1A1AA]"
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
