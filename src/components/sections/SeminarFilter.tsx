import { useState, useMemo } from "react";

interface Seminar {
  slug: string;
  title: string;
  date: string;
  presenter: string;
  affiliation: string;
  category: string;
  tags: string[];
  summary: string;
}

interface Props {
  seminars: Seminar[];
  itemsPerPage?: number;
}

const CATEGORIES = ["전체", "지능시스템", "인공생명", "기계학습", "최적화 이론", "기타"] as const;

export default function SeminarFilter({ seminars, itemsPerPage = 5 }: Props) {
  const [activeCategory, setActiveCategory] = useState<string>("전체");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = useMemo(() => {
    let result = seminars;

    if (activeCategory !== "전체") {
      result = result.filter((s) => s.category === activeCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (s) =>
          s.title.toLowerCase().includes(q) ||
          s.presenter.toLowerCase().includes(q) ||
          s.tags.some((t) => t.toLowerCase().includes(q)) ||
          s.summary.toLowerCase().includes(q)
      );
    }

    return result;
  }, [seminars, activeCategory, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const paginatedItems = filtered.slice(
    (safeCurrentPage - 1) * itemsPerPage,
    safeCurrentPage * itemsPerPage
  );

  const handleCategoryChange = (cat: string) => {
    setActiveCategory(cat);
    setCurrentPage(1);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const year = d.getFullYear();
    return { month, day, year };
  };

  return (
    <div>
      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`px-4 py-[6px] text-[13px] rounded-lg transition-colors ${
                activeCategory === cat
                  ? "bg-[#18181B] text-white"
                  : "border border-[#E4E4E7] text-[#18181B] hover:bg-[#F5F5F5]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-[260px]">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-[14px] h-[14px] text-[#A1A1AA]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            placeholder="Search seminars..."
            value={searchQuery}
            onChange={handleSearch}
            className="w-full pl-9 pr-3 py-2 text-[13px] border border-[#E4E4E7] rounded-lg placeholder:text-[#A1A1AA] focus:outline-none focus:ring-1 focus:ring-[#D4735E] bg-white"
          />
        </div>
      </div>

      {/* Seminar List */}
      <div>
        {paginatedItems.length === 0 ? (
          <div className="text-center py-12 text-[#A1A1AA] text-[14px]">
            검색 결과가 없습니다.
          </div>
        ) : (
          paginatedItems.map((seminar) => {
            const { month, day, year } = formatDate(seminar.date);
            return (
              <a
                key={seminar.slug}
                href={`/seminar/${seminar.slug}`}
                className="flex items-start gap-5 py-5 border-b border-[#E4E4E7] hover:bg-[#FAFAFA] -mx-2 px-2 rounded transition-colors group overflow-hidden"
              >
                {/* Date */}
                <div className="w-[56px] flex-shrink-0 text-center pt-[2px]">
                  <div className="text-[18px] font-bold text-[#18181B] leading-tight">
                    {month}.{day}
                  </div>
                  <div className="text-[11px] text-[#A1A1AA]">{year}</div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-[15px] font-semibold text-[#18181B] group-hover:text-[#D4735E] transition-colors truncate">
                    {seminar.title}
                  </h3>
                  <p className="text-[12px] text-[#A1A1AA] mt-1">
                    {seminar.presenter}
                    {seminar.affiliation && (
                      <span> · {seminar.affiliation}</span>
                    )}
                  </p>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    <span className="inline-block px-2 py-[2px] text-[10px] bg-[#F5F5F5] text-[#52525B] rounded-full">
                      {seminar.category}
                    </span>
                    {seminar.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-block px-2 py-[2px] text-[10px] bg-[#F5F5F5] text-[#52525B] rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </a>
            );
          })
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-1 mt-8">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={safeCurrentPage === 1}
            className="w-8 h-8 flex items-center justify-center text-[14px] text-[#71717A] hover:text-[#18181B] disabled:opacity-30 disabled:cursor-not-allowed rounded-lg transition-colors"
          >
            &lt;
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`w-8 h-8 flex items-center justify-center text-[13px] rounded-lg transition-colors ${
                page === safeCurrentPage
                  ? "bg-[#D4735E] text-white"
                  : "text-[#71717A] hover:text-[#18181B] hover:bg-[#F5F5F5]"
              }`}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={safeCurrentPage === totalPages}
            className="w-8 h-8 flex items-center justify-center text-[14px] text-[#71717A] hover:text-[#18181B] disabled:opacity-30 disabled:cursor-not-allowed rounded-lg transition-colors"
          >
            &gt;
          </button>
        </div>
      )}
    </div>
  );
}
