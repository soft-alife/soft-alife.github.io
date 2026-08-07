import { useState } from "react";
import { ExternalLink } from "lucide-react";

/**
 * Publications 페이지 논문 목록 (검색 포함).
 *
 * professor.yaml의 SCI/SCIE·SCOPUS 학술지와 탑티어 컨퍼런스가 최신순으로
 * 표시된다. DOI/원문 링크가 있으면 카드 클릭 시 새 탭으로 이동하고
 * 우측 아래에 ↗ 아이콘이 붙는다. 텍스트 드래그 선택은 유지.
 */

interface Paper {
  date: string; // 날짜 배지 (예: "2024.11")
  badge: string; // "SCI/SCIE" | "SCOPUS" | 탑티어 라벨
  badgeClass: string; // 분류별 배지 색상 (페이지에서 지정)
  title: string;
  venue: string; // 학술지/학회명 + 권/호/쪽
  sub: string;
  subStrong?: string; // IF · 분위 — 굵게 표시
  link?: string; // 있으면 카드 클릭 시 새 탭으로 이동 (예: DOI 주소)
}

interface Labels {
  empty: string;
  searchPlaceholder: string;
}

interface Props {
  publications: Paper[];
  labels: Labels;
}

export default function PaperList({ publications, labels }: Props) {
  const [query, setQuery] = useState("");

  const q = query.trim().toLowerCase();
  const filtered = publications.filter(
    (p) =>
      !q ||
      [p.title, p.venue, p.badge, p.date, p.subStrong ?? ""]
        .join(" ")
        .toLowerCase()
        .includes(q),
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
        {filtered.map((pub, index) => {
          const content = (
            <>
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className="inline-flex items-center shrink-0 px-2 py-0.5 rounded-pill bg-secondary text-secondary-foreground text-xs font-medium">
                  {pub.date}
                </span>
                <span
                  className={`inline-flex items-center shrink-0 px-2 py-0.5 rounded-pill text-xs font-medium ${pub.badgeClass}`}
                >
                  {pub.badge}
                </span>
              </div>
              <h3 className="text-[15px] font-semibold text-foreground leading-snug mb-2">
                {pub.title}
              </h3>
              <p className="text-base text-muted mt-1">{pub.venue}</p>
              {(pub.sub || pub.subStrong) && (
                <p className="text-sm text-muted-foreground">
                  {pub.sub}
                  {pub.sub && pub.subStrong ? " · " : ""}
                  {pub.subStrong && (
                    <span className="font-semibold text-foreground">
                      {pub.subStrong}
                    </span>
                  )}
                </p>
              )}
              {pub.link && (
                <div className="flex justify-end mt-2">
                  <ExternalLink size={14} className="text-[#A1A1AA]" />
                </div>
              )}
            </>
          );

          return pub.link ? (
            <div
              key={index}
              role="link"
              tabIndex={0}
              onClick={() => {
                if (window.getSelection()?.toString()) return;
                window.open(pub.link, "_blank", "noopener,noreferrer");
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  window.open(pub.link, "_blank", "noopener,noreferrer");
                }
              }}
              className="border border-border rounded-lg p-5 hover:bg-[#FAFAFA] transition-colors cursor-pointer"
            >
              {content}
            </div>
          ) : (
            <div key={index} className="border border-border rounded-lg p-5">
              {content}
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
