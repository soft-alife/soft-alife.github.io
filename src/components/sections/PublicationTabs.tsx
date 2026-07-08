import { useState } from "react";
import { ExternalLink } from "lucide-react";

/**
 * Publications page tabs: 전체 / Journal Paper / News / Blog.
 *
 * Tab buttons reuse ProjectFilter's tab styling; cards reuse the site's
 * publication card markup (배지 → 제목 → 기타 순). Journal Paper items come
 * pre-built from professor.yaml (SCI/SCIE + SCOPUS journals and top-tier
 * conferences). News/Blog items are external links. The 전체 tab merges
 * everything newest-first. All tabs share the search box.
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

interface LinkItem {
  title: string;
  date: string;
  source: string; // 언론사(News) 또는 작성자(Blog)
  link: string; // 외부 기사/글 URL (있으면 새 탭으로 이동)
  internalHref: string; // 직접 작성 글의 사이트 내 상세 페이지 경로
  summary: string;
}

interface Labels {
  all: string;
  journal: string;
  news: string;
  blog: string;
  empty: string;
  visit: string;
  searchPlaceholder: string;
}

interface Props {
  publications: Paper[];
  news: LinkItem[];
  blog: LinkItem[];
  labels: Labels;
}

type Tab = "all" | "journal" | "news" | "blog";

export default function PublicationTabs({ publications, news, blog, labels }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>("all");
  const [query, setQuery] = useState("");

  const tabs: { key: Tab; label: string }[] = [
    { key: "all", label: labels.all },
    { key: "journal", label: labels.journal },
    { key: "news", label: labels.news },
    { key: "blog", label: labels.blog },
  ];

  const q = query.trim().toLowerCase();

  const filteredPublications = publications.filter(
    (p) =>
      !q ||
      [p.title, p.venue, p.badge, p.date, p.subStrong ?? ""]
        .join(" ")
        .toLowerCase()
        .includes(q),
  );

  const matchLink = (item: LinkItem) =>
    !q ||
    [item.title, item.source, item.summary, item.date]
      .join(" ")
      .toLowerCase()
      .includes(q);

  const filteredNews = news.filter(matchLink);
  const filteredBlog = blog.filter(matchLink);

  // 전체 탭: 논문 + 기사 + 블로그를 날짜 최신순으로 병합.
  const allItems: ({ kind: "paper"; date: string; paper: Paper } | { kind: "link"; date: string; item: LinkItem })[] = [
    ...filteredPublications.map((paper) => ({ kind: "paper" as const, date: paper.date, paper })),
    ...filteredNews.map((item) => ({ kind: "link" as const, date: item.date, item })),
    ...filteredBlog.map((item) => ({ kind: "link" as const, date: item.date, item })),
  ].sort((a, b) => b.date.localeCompare(a.date));

  const renderPaper = (pub: Paper, key: number | string) => {
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

    // 링크 카드는 <a> 대신 클릭 핸들러를 써서 텍스트 드래그 선택을 허용한다.
    return pub.link ? (
      <div
        key={key}
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
      <div key={key} className="border border-border rounded-lg p-5">
        {content}
      </div>
    );
  };

  // 외부 기사(link)는 새 탭으로, 직접 작성 글(internalHref)은 사이트 내
  // 상세 페이지로 이동한다. 텍스트 드래그 선택은 유지.
  const renderLink = (item: LinkItem, key: number | string) => {
    const clickable = item.link || item.internalHref;
    const navigate = () => {
      if (window.getSelection()?.toString()) return;
      if (item.link) {
        window.open(item.link, "_blank", "noopener,noreferrer");
      } else if (item.internalHref) {
        window.location.href = item.internalHref;
      }
    };

    return (
      <div
        key={key}
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
          clickable ? "hover:bg-[#FAFAFA] transition-colors cursor-pointer" : ""
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
        {item.source && <p className="text-base text-muted mt-1">{item.source}</p>}
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
  };

  const linkItems = activeTab === "news" ? filteredNews : filteredBlog;

  return (
    <div>
      {/* Tab Filter + Search */}
      <div className="flex gap-2 mb-8 flex-wrap items-center">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 text-[13px] rounded-lg transition-colors ${
              activeTab === tab.key
                ? "bg-[#18181B] text-white"
                : "border border-[#E4E4E7] text-[#0A0A0A] hover:bg-[#F5F5F5]"
            }`}
          >
            {tab.label}
          </button>
        ))}
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={labels.searchPlaceholder}
          className="w-full sm:w-[240px] sm:ml-auto px-4 py-2 text-[13px] border border-[#E4E4E7] rounded-lg bg-white text-[#0A0A0A] placeholder:text-[#A1A1AA] focus:outline-none focus:border-[#A1A1AA] transition-colors"
        />
      </div>

      {/* 전체 Tab */}
      {activeTab === "all" && (
        <div className="space-y-4">
          {allItems.map((entry, index) =>
            entry.kind === "paper"
              ? renderPaper(entry.paper, index)
              : renderLink(entry.item, index),
          )}

          {allItems.length === 0 && (
            <p className="text-[13px] text-[#A1A1AA] py-8 text-center">{labels.empty}</p>
          )}
        </div>
      )}

      {/* Journal Paper Tab */}
      {activeTab === "journal" && (
        <div className="space-y-4">
          {filteredPublications.map((pub, index) => renderPaper(pub, index))}

          {filteredPublications.length === 0 && (
            <p className="text-[13px] text-[#A1A1AA] py-8 text-center">{labels.empty}</p>
          )}
        </div>
      )}

      {/* News / Blog Tabs */}
      {(activeTab === "news" || activeTab === "blog") && (
        <div className="space-y-4">
          {linkItems.map((item, index) => renderLink(item, index))}

          {linkItems.length === 0 && (
            <p className="text-[13px] text-[#A1A1AA] py-8 text-center">{labels.empty}</p>
          )}
        </div>
      )}
    </div>
  );
}
