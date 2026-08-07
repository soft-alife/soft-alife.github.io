import { useState } from "react";
import { ExternalLink } from "lucide-react";

/**
 * News/Blog 목록 (검색 포함).
 *
 * 카드 클릭 시: 외부 기사(link)는 새 탭으로 원문 이동, 직접 작성 글은
 * 사이트 내 상세 페이지로 이동. 텍스트 드래그 선택은 유지된다.
 * 카드/검색창 디자인은 Publications·Notice 목록과 동일.
 */

interface PostItem {
  title: string;
  date: string; // "YYYY.MM.DD"
  source: string; // 언론사(News) 또는 작성자(Blog)
  link: string; // 외부 원문 URL (있으면 새 탭)
  internalHref: string; // 직접 작성 글의 상세 페이지 경로
  summary: string;
}

interface Labels {
  empty: string;
  searchPlaceholder: string;
}

interface Props {
  posts: PostItem[]; // 최신순 정렬 상태로 전달됨
  labels: Labels;
}

export default function PostList({ posts, labels }: Props) {
  const [query, setQuery] = useState("");

  const q = query.trim().toLowerCase();
  const filtered = posts.filter(
    (p) =>
      !q ||
      [p.title, p.source, p.summary, p.date].join(" ").toLowerCase().includes(q),
  );

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

      <div className="space-y-4">
        {filtered.map((item, index) => {
          const clickable = item.link || item.internalHref;
          const navigate = () => {
            if (!clickable) return;
            if (window.getSelection()?.toString()) return;
            if (item.link) {
              window.open(item.link, "_blank", "noopener,noreferrer");
            } else {
              window.location.href = item.internalHref;
            }
          };

          return (
            <div
              key={index}
              {...(clickable
                ? {
                    role: "link" as const,
                    tabIndex: 0,
                    onClick: navigate,
                    onKeyDown: (e: React.KeyboardEvent) => {
                      if (e.key === "Enter") navigate();
                    },
                  }
                : {})}
              className={`border border-border rounded-lg p-5 ${
                clickable
                  ? "hover:bg-[#FAFAFA] transition-colors cursor-pointer"
                  : ""
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-flex items-center shrink-0 px-2 py-0.5 rounded-pill bg-secondary text-secondary-foreground text-xs font-medium">
                  {item.date}
                </span>
              </div>
              <h3 className="text-[15px] font-semibold text-foreground leading-snug mb-2">
                {item.title}
              </h3>
              {item.source && (
                <p className="text-base text-muted mt-1">{item.source}</p>
              )}
              {item.summary && (
                <p className="text-sm text-muted-foreground">{item.summary}</p>
              )}
              {item.link && (
                <div className="flex justify-end mt-2">
                  <ExternalLink size={14} className="text-[#A1A1AA]" />
                </div>
              )}
            </div>
          );
        })}

        {filtered.length === 0 && (
          <p className="text-[13px] text-[#A1A1AA] py-8 text-center">
            {labels.empty}
          </p>
        )}
      </div>
    </div>
  );
}
