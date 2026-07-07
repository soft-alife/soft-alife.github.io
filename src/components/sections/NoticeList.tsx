import { useState } from "react";

/**
 * Notice list with client-side search and pagination.
 *
 * Markup/styling mirrors the original NoticeIndexPage list rows and
 * pagination 1:1 — only the data flow moved into React so the list can be
 * filtered as the user types.
 */

interface NoticeItem {
  slug: string;
  title: string;
  date: string; // 이미 "YYYY.MM.DD"로 포맷된 문자열
  category: string;
  pinned: boolean;
}

interface Labels {
  pinnedTitle: string;
  pinnedTag: string; // 제목 앞 "[고정]" 표시
  empty: string;
  searchPlaceholder: string;
}

interface Props {
  notices: NoticeItem[]; // 고정 우선 + 최신순으로 정렬된 상태로 전달됨
  labels: Labels;
  prefix: string; // "" | "/en"
}

const ITEMS_PER_PAGE = 10;

const categoryColors: Record<string, { bg: string; text: string }> = {
  "모집": { bg: "bg-[#DBEAFE]", text: "text-[#1E40AF]" },
  "일반": { bg: "bg-[#F5F5F5]", text: "text-[#52525B]" },
  "학술": { bg: "bg-[#FEF3C7]", text: "text-[#92400E]" },
  "행사": { bg: "bg-[#D1FAE5]", text: "text-[#065F46]" },
};

export default function NoticeList({ notices, labels, prefix }: Props) {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const q = query.trim().toLowerCase();
  const filtered = notices.filter(
    (n) => !q || `${n.title} ${n.category} ${n.date}`.toLowerCase().includes(q),
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const safePage = Math.min(page, totalPages);
  const paginated = filtered.slice(
    (safePage - 1) * ITEMS_PER_PAGE,
    safePage * ITEMS_PER_PAGE,
  );

  return (
    <div>
      {/* Search */}
      <div className="flex mb-6">
        <input
          type="search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setPage(1);
          }}
          placeholder={labels.searchPlaceholder}
          className="w-full sm:w-[240px] sm:ml-auto px-4 py-2 text-[13px] border border-[#E4E4E7] rounded-lg bg-white text-[#0A0A0A] placeholder:text-[#A1A1AA] focus:outline-none focus:border-[#A1A1AA] transition-colors"
        />
      </div>

      {/* Notice List */}
      <div className="overflow-hidden">
        {paginated.map((notice) => {
          const colors = categoryColors[notice.category] ?? categoryColors["일반"];
          return (
            <a
              key={notice.slug}
              href={`${prefix}/notice/${notice.slug}`}
              className="flex items-center gap-4 py-5 border-b border-border hover:bg-[#FAFAFA] px-2 -mx-2 rounded transition-colors group"
            >
              <div className="w-[90px] flex-shrink-0 text-[13px] text-muted">
                {notice.date}
              </div>

              {notice.pinned && (
                <div className="flex-shrink-0" title={labels.pinnedTitle}>
                  <svg
                    className="w-4 h-4 text-sal-terracotta"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.828 3.414a2 2 0 012.828 0l1.93 1.93a2 2 0 010 2.828l-4.243 4.243a1 1 0 01-.707.293H7.414a1 1 0 01-.707-.293L5.293 11a1 1 0 010-1.414l4.243-4.243a1 1 0 01.293-.707V3.414z" />
                    <path
                      d="M6 15l-3 3"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      fill="none"
                    />
                  </svg>
                </div>
              )}

              <div className="flex-1 min-w-0">
                <p className="text-[14px] sm:text-[15px] font-semibold text-foreground group-hover:text-sal-terracotta transition-colors truncate">
                  {notice.pinned && (
                    <span className="text-sal-terracotta font-bold mr-1">
                      {labels.pinnedTag}
                    </span>
                  )}
                  {notice.title}
                </p>
              </div>

              <span
                className={`flex-shrink-0 px-2.5 py-[3px] text-[11px] rounded-full whitespace-nowrap ${colors.bg} ${colors.text}`}
              >
                {notice.category}
              </span>
            </a>
          );
        })}

        {filtered.length === 0 && (
          <p className="text-[13px] text-[#A1A1AA] py-8 text-center">
            {labels.empty}
          </p>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-1 mt-8">
          <button
            type="button"
            onClick={() => setPage(Math.max(1, safePage - 1))}
            disabled={safePage === 1}
            className={`w-8 h-8 flex items-center justify-center text-[14px] rounded-lg transition-colors ${
              safePage === 1
                ? "text-[#E4E4E7] pointer-events-none"
                : "text-[#71717A] hover:text-[#18181B]"
            }`}
          >
            &lt;
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPage(p)}
              className={`w-8 h-8 flex items-center justify-center text-[13px] rounded-lg transition-colors ${
                p === safePage
                  ? "bg-sal-terracotta text-white"
                  : "text-[#71717A] hover:text-[#18181B] hover:bg-[#F5F5F5]"
              }`}
            >
              {p}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setPage(Math.min(totalPages, safePage + 1))}
            disabled={safePage === totalPages}
            className={`w-8 h-8 flex items-center justify-center text-[14px] rounded-lg transition-colors ${
              safePage === totalPages
                ? "text-[#E4E4E7] pointer-events-none"
                : "text-[#71717A] hover:text-[#18181B]"
            }`}
          >
            &gt;
          </button>
        </div>
      )}
    </div>
  );
}
