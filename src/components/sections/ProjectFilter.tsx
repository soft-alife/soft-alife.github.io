import { useState } from "react";
import { ExternalLink } from "lucide-react";

interface Project {
  title: string;
  titleEn?: string;
  status: "ongoing" | "completed";
  period: string;
  funding: string;
  ministry: string;
  role: string;
  pi: string;
  keywords: string[];
  description: string;
  national: boolean; // 국가연구과제 (노란 배지 + NTIS 링크)
  url: string; // 지정 시 NTIS 검색 링크보다 우선
}

interface Props {
  projects: Project[];
}

export default function ProjectFilter({ projects }: Props) {
  const [activeTab, setActiveTab] = useState<"all" | "ongoing" | "completed">("all");
  const [query, setQuery] = useState("");

  const q = query.trim().toLowerCase();
  const filtered = projects
    .filter((p) => activeTab === "all" || p.status === activeTab)
    .filter(
      (p) =>
        !q ||
        [p.title, p.titleEn ?? "", p.funding, p.ministry, p.role, p.description, ...p.keywords]
          .join(" ")
          .toLowerCase()
          .includes(q),
    );

  const tabs = [
    { key: "all" as const, label: "전체" },
    { key: "ongoing" as const, label: "진행중인 과제" },
    { key: "completed" as const, label: "완료된 과제" },
  ];

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
          placeholder="검색"
          className="w-full sm:w-[240px] sm:ml-auto px-4 py-2 text-[13px] border border-[#E4E4E7] rounded-lg bg-white text-[#0A0A0A] placeholder:text-[#A1A1AA] focus:outline-none focus:border-[#A1A1AA] transition-colors"
        />
      </div>

      {/* Project Cards */}
      <div className="flex flex-col gap-5">
        {filtered.map((project, index) => {
          // 국가연구과제는 NTIS 검색 결과로 연결 (텍스트 드래그 선택 유지)
          const link =
            project.url ||
            (project.national
              ? `https://www.ntis.go.kr/ThSearchTotalList.do?searchWord=${encodeURIComponent(project.title)}`
              : "");
          const navigate = () => {
            if (!link) return;
            if (window.getSelection()?.toString()) return;
            window.open(link, "_blank", "noopener,noreferrer");
          };

          return (
          <div
            key={index}
            {...(link
              ? {
                  role: "link" as const,
                  tabIndex: 0,
                  onClick: navigate,
                  onKeyDown: (e: React.KeyboardEvent) => {
                    if (e.key === "Enter") navigate();
                  },
                }
              : {})}
            className={`border border-[#E4E4E7] rounded-lg bg-white p-5 md:p-6 ${
              link ? "hover:bg-[#FAFAFA] transition-colors cursor-pointer" : ""
            }`}
          >
            {/* Top row: badges */}
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              <span className="inline-block bg-[#D4735E]/10 text-[#D4735E] text-[11px] font-medium rounded-full px-2.5 py-[2px]">
                {project.period}
              </span>
              {project.status === "ongoing" ? (
                <span className="inline-block bg-emerald-50 text-emerald-600 text-[11px] font-medium rounded-full px-2.5 py-[2px]">
                  진행중
                </span>
              ) : (
                <span className="inline-block bg-[#F5F5F5] text-[#71717A] text-[11px] font-medium rounded-full px-2.5 py-[2px]">
                  완료
                </span>
              )}
              {project.national && (
                <span className="inline-block bg-[#FEF3C7] text-[#92400E] text-[11px] font-medium rounded-full px-2.5 py-[2px]">
                  국가연구과제
                </span>
              )}
              {project.role && (
                <span className="inline-block bg-[#FEF3C7] text-[#92400E] text-[11px] font-medium rounded-full px-2.5 py-[2px]">
                  {project.role}
                </span>
              )}
            </div>

            {/* Title */}
            <h3 className="text-[16px] font-semibold text-[#0A0A0A] mb-2 leading-snug">
              {project.title}
            </h3>

            {/* Funding + Ministry */}
            <p className="text-[13px] text-[#71717A] mb-2">
              {[
                project.funding ? `지원기관 : ${project.funding}` : "",
                project.ministry ? `주무부처 : ${project.ministry}` : "",
              ]
                .filter(Boolean)
                .join(", ")}
            </p>

            {/* Description */}
            <p className="text-[13px] text-[#71717A] leading-[1.7] mb-4">
              {project.description}
            </p>

            {/* Keywords */}
            {project.keywords.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {project.keywords.map((kw, i) => (
                  <span
                    key={i}
                    className="bg-[#F5F5F5] text-[#52525B] text-[11px] rounded-full px-2 py-[3px]"
                  >
                    {kw}
                  </span>
                ))}
              </div>
            )}

            {link && (
              <div className="flex justify-end mt-2">
                <ExternalLink size={14} className="text-[#A1A1AA]" />
              </div>
            )}
          </div>
          );
        })}

        {filtered.length === 0 && (
          <p className="text-[13px] text-[#A1A1AA] py-8 text-center">
            해당하는 과제가 없습니다.
          </p>
        )}
      </div>
    </div>
  );
}
