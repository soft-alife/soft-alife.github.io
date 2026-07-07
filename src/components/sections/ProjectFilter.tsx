import { useState } from "react";

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
}

interface Props {
  projects: Project[];
}

export default function ProjectFilter({ projects }: Props) {
  const [activeTab, setActiveTab] = useState<"ongoing" | "completed">("ongoing");

  const filtered = projects.filter((p) => p.status === activeTab);

  return (
    <div>
      {/* Tab Filter */}
      <div className="flex gap-2 mb-8">
        <button
          onClick={() => setActiveTab("ongoing")}
          className={`px-4 py-2 text-[13px] rounded-lg transition-colors ${
            activeTab === "ongoing"
              ? "bg-[#18181B] text-white"
              : "border border-[#E4E4E7] text-[#0A0A0A] hover:bg-[#F5F5F5]"
          }`}
        >
          진행중인 과제
        </button>
        <button
          onClick={() => setActiveTab("completed")}
          className={`px-4 py-2 text-[13px] rounded-lg transition-colors ${
            activeTab === "completed"
              ? "bg-[#18181B] text-white"
              : "border border-[#E4E4E7] text-[#0A0A0A] hover:bg-[#F5F5F5]"
          }`}
        >
          완료된 과제
        </button>
      </div>

      {/* Project Cards */}
      <div className="flex flex-col gap-5">
        {filtered.map((project, index) => (
          <div
            key={index}
            className="border border-[#E4E4E7] rounded-lg bg-white p-5 md:p-6"
          >
            {/* Top row: badges */}
            <div className="flex items-center gap-2 mb-3">
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
            </div>

            {/* Title */}
            <h3 className="text-[16px] font-semibold text-[#0A0A0A] mb-2 leading-snug">
              {project.title}
            </h3>

            {/* Funding + Ministry + Role */}
            <p className="text-[13px] text-[#71717A] mb-2">
              {[
                project.funding ? `지원기관 : ${project.funding}` : "",
                project.ministry ? `주무부처 : ${project.ministry}` : "",
              ]
                .filter(Boolean)
                .join(", ")}
              {project.role ? ` · ${project.role}` : ""}
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
          </div>
        ))}

        {filtered.length === 0 && (
          <p className="text-[13px] text-[#A1A1AA] py-8 text-center">
            해당하는 과제가 없습니다.
          </p>
        )}
      </div>
    </div>
  );
}
