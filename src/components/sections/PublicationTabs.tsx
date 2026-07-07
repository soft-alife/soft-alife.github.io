import { useState } from "react";

/**
 * Publications page tabs: Journal Paper / News / Blog.
 *
 * Tab buttons reuse ProjectFilter's tab styling; cards reuse the site's
 * publication card markup. Journal Paper items come pre-built from
 * professor.yaml (SCI/SCIE + SCOPUS journals and top-tier conferences).
 * News/Blog items are external links (date badge + source line).
 */

interface Paper {
  date: string; // 날짜 배지 (예: "2024.11")
  badge: string; // "SCI/SCIE" | "SCOPUS" | 탑티어 라벨
  badgeClass: string; // 분류별 배지 색상 (페이지에서 지정)
  title: string;
  venue: string; // 학술지/학회명 + 권/호/쪽
  sub: string;
  subStrong?: string; // IF · 분위 — 굵게 표시
}

interface LinkItem {
  title: string;
  date: string;
  source: string; // 언론사(News) 또는 작성자(Blog)
  link: string;
  summary: string;
}

interface Labels {
  journal: string;
  news: string;
  blog: string;
  empty: string;
  visit: string;
}

interface Props {
  publications: Paper[];
  news: LinkItem[];
  blog: LinkItem[];
  labels: Labels;
}

type Tab = "journal" | "news" | "blog";

export default function PublicationTabs({ publications, news, blog, labels }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>("journal");

  const tabs: { key: Tab; label: string }[] = [
    { key: "journal", label: labels.journal },
    { key: "news", label: labels.news },
    { key: "blog", label: labels.blog },
  ];

  const linkItems = activeTab === "news" ? news : blog;

  return (
    <div>
      {/* Tab Filter */}
      <div className="flex gap-2 mb-8">
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
      </div>

      {/* Journal Paper Tab */}
      {activeTab === "journal" && (
        <div className="space-y-4">
          {publications.map((pub, index) => (
            <div key={index} className="border border-border rounded-lg p-5">
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
            </div>
          ))}

          {publications.length === 0 && (
            <p className="text-[13px] text-[#A1A1AA] py-8 text-center">{labels.empty}</p>
          )}
        </div>
      )}

      {/* News / Blog Tabs */}
      {activeTab !== "journal" && (
        <div className="space-y-4">
          {linkItems.map((item, index) => (
            <div key={index} className="border border-border rounded-lg p-5">
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
                <div className="flex items-center gap-3 mt-3">
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[13px] text-sal-terracotta hover:underline"
                  >
                    {labels.visit}
                  </a>
                </div>
              )}
            </div>
          ))}

          {linkItems.length === 0 && (
            <p className="text-[13px] text-[#A1A1AA] py-8 text-center">{labels.empty}</p>
          )}
        </div>
      )}
    </div>
  );
}
