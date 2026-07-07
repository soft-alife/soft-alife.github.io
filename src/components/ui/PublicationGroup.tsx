import { useState } from "react";
import { ChevronDown } from "lucide-react";

/**
 * Collapsible publication group for the Professor page.
 *
 * Visual language is borrowed 1:1 from existing components:
 *   - group header = Accordion trigger (border-b, chevron)
 *   - item cards   = Professor page publication cards
 *   - "show all"   = ProjectFilter inactive tab button
 *
 * `defaultOpen` groups start expanded showing the first `initialVisible`
 * items (list is pre-sorted newest-first by the page); the rest are revealed
 * with the "show all" button.
 */

interface Badge {
  label: string;
  className: string;
}

export interface PublicationItem {
  badges: Badge[];
  title: string;
  meta: string; // venue · volume
  sub: string; // date
  subStrong?: string; // IF · quartile — 굵게 표시
}

interface Props {
  title: string;
  items: PublicationItem[];
  defaultOpen?: boolean;
  initialVisible?: number;
  showAllLabel: string; // e.g. "전체 보기"
  collapseLabel: string; // e.g. "접기"
}

export default function PublicationGroup({
  title,
  items,
  defaultOpen = false,
  initialVisible = 5,
  showAllLabel,
  collapseLabel,
}: Props) {
  const [open, setOpen] = useState(defaultOpen);
  const [showAll, setShowAll] = useState(false);

  const visible = showAll ? items : items.slice(0, initialVisible);
  const hasMore = items.length > initialVisible;

  return (
    <div className="border-b border-[#E4E4E7]">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-4 text-left cursor-pointer"
        aria-expanded={open}
      >
        <span className="text-[15px] font-semibold text-[#0A0A0A]">
          {title}{" "}
          <span className="text-[#A1A1AA] font-medium">({items.length})</span>
        </span>
        <ChevronDown
          size={16}
          className={`text-[#A1A1AA] shrink-0 ml-4 transition-transform duration-200 ${
            open ? "rotate-180" : "rotate-0"
          }`}
        />
      </button>

      {open && (
        <div className="pb-5 space-y-4">
          {visible.map((item, index) => (
            <div key={index} className="border border-border rounded-lg p-5">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                {item.badges.map((badge, i) => (
                  <span
                    key={i}
                    className={`inline-flex items-center shrink-0 px-2 py-0.5 rounded-pill text-xs font-medium ${badge.className}`}
                  >
                    {badge.label}
                  </span>
                ))}
              </div>
              <h3 className="text-lg font-semibold text-foreground leading-snug mb-2">
                {item.title}
              </h3>
              <p className="text-base text-muted mt-1">{item.meta}</p>
              {(item.sub || item.subStrong) && (
                <p className="text-sm text-muted-foreground">
                  {item.sub}
                  {item.sub && item.subStrong ? " · " : ""}
                  {item.subStrong && (
                    <span className="font-semibold text-foreground">
                      {item.subStrong}
                    </span>
                  )}
                </p>
              )}
            </div>
          ))}

          {hasMore && (
            <div className="flex justify-center pt-1">
              <button
                type="button"
                onClick={() => setShowAll(!showAll)}
                className="px-4 py-2 text-[13px] rounded-lg border border-[#E4E4E7] text-[#0A0A0A] hover:bg-[#F5F5F5] transition-colors cursor-pointer"
              >
                {showAll
                  ? collapseLabel
                  : `${showAllLabel} (${items.length})`}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
