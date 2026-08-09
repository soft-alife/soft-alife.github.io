import { useState } from "react";
import { ChevronDown, ExternalLink } from "lucide-react";

/**
 * Publications 페이지 — 교수 페이지와 같은 접이식 그룹 + 검색.
 *
 * - 그룹(SCI/SCIE, SCOPUS, KCI, 국제/국내학술대회, 기술이전, 특허)별로
 *   접고 펼칠 수 있고, 펼치면 최근 5건 + "전체 보기" 버튼
 * - 검색어를 입력하면 모든 그룹이 펼쳐지고 일치 항목이 전부 표시되며,
 *   일치 항목이 없는 그룹은 숨겨진다
 * - 링크가 있는 카드는 클릭 시 새 탭 이동(우측 아래 ↗), 텍스트 드래그 유지
 */

interface Badge {
  label: string;
  className: string;
}

export interface BrowserItem {
  badges: Badge[];
  title: string;
  meta: string;
  sub: string;
  subStrong?: string;
  link?: string;
}

export interface BrowserGroup {
  key: string;
  title: string;
  defaultOpen: boolean;
  items: BrowserItem[];
}

interface Labels {
  searchPlaceholder: string;
  empty: string;
  showAll: string;
  collapse: string;
}

interface Props {
  groups: BrowserGroup[];
  labels: Labels;
}

const INITIAL_VISIBLE = 5;

function itemText(item: BrowserItem): string {
  return [
    item.title,
    item.meta,
    item.sub,
    item.subStrong ?? "",
    ...item.badges.map((b) => b.label),
  ]
    .join(" ")
    .toLowerCase();
}

export default function PublicationsBrowser({ groups, labels }: Props) {
  const [query, setQuery] = useState("");
  const [openMap, setOpenMap] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(groups.map((g) => [g.key, g.defaultOpen])),
  );
  const [showAllMap, setShowAllMap] = useState<Record<string, boolean>>({});

  const q = query.trim().toLowerCase();
  const searching = q.length > 0;

  const visibleGroups = groups
    .map((g) => ({
      ...g,
      matched: searching
        ? g.items.filter((item) => itemText(item).includes(q))
        : g.items,
    }))
    .filter((g) => g.matched.length > 0);

  const renderItem = (item: BrowserItem, key: number | string) => {
    const content = (
      <>
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
        {item.link && (
          <div className="flex justify-end mt-2">
            <ExternalLink size={14} className="text-[#A1A1AA]" />
          </div>
        )}
      </>
    );

    return item.link ? (
      <div
        key={key}
        role="link"
        tabIndex={0}
        onClick={() => {
          if (window.getSelection()?.toString()) return;
          window.open(item.link, "_blank", "noopener,noreferrer");
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            window.open(item.link, "_blank", "noopener,noreferrer");
          }
        }}
        className="border border-border rounded-lg p-5 hover:bg-[#FAFAFA] transition-colors cursor-pointer"
      >
        {content}
      </div>
    ) : (
      <div key={key} className="border border-border rounded-lg p-5">
        {content}
      </div>
    );
  };

  return (
    <div>
      {/* Search */}
      <div className="flex mb-6">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={labels.searchPlaceholder}
          className="w-full sm:w-[240px] sm:ml-auto px-4 py-2 text-[13px] border border-[#E4E4E7] rounded-lg bg-white text-[#0A0A0A] placeholder:text-[#A1A1AA] focus:outline-none focus:border-[#A1A1AA] transition-colors"
        />
      </div>

      {visibleGroups.length === 0 && (
        <p className="text-[13px] text-[#A1A1AA] py-8 text-center">
          {labels.empty}
        </p>
      )}

      {visibleGroups.map((group) => {
        const open = searching || openMap[group.key];
        const showAll = searching || showAllMap[group.key];
        const visible = showAll
          ? group.matched
          : group.matched.slice(0, INITIAL_VISIBLE);
        const hasMore = group.matched.length > INITIAL_VISIBLE;

        return (
          <div key={group.key} className="border-b border-[#E4E4E7]">
            <button
              type="button"
              onClick={() =>
                setOpenMap((m) => ({ ...m, [group.key]: !open }))
              }
              className="w-full flex items-center justify-between py-4 text-left cursor-pointer"
              aria-expanded={open}
            >
              <span className="text-[15px] font-semibold text-[#0A0A0A]">
                {group.title}{" "}
                <span className="text-[#A1A1AA] font-medium">
                  ({group.matched.length})
                </span>
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
                {visible.map((item, index) => renderItem(item, index))}

                {!searching && hasMore && (
                  <div className="flex justify-center pt-1">
                    <button
                      type="button"
                      onClick={() =>
                        setShowAllMap((m) => ({
                          ...m,
                          [group.key]: !showAllMap[group.key],
                        }))
                      }
                      className="px-4 py-2 text-[13px] rounded-lg border border-[#E4E4E7] text-[#0A0A0A] hover:bg-[#F5F5F5] transition-colors cursor-pointer"
                    >
                      {showAllMap[group.key]
                        ? labels.collapse
                        : `${labels.showAll} (${group.matched.length})`}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
