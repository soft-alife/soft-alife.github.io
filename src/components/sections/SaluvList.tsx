import { useState } from "react";

/**
 * SALuv 사진 게시판 목록 — 썸네일 카드 그리드 + 페이지네이션.
 *
 * 각 게시물의 첫 사진을 썸네일로 하는 카드 그리드(3열). 10개 단위
 * 페이지네이션은 항상 표시. 카드 클릭 시 상세에서 전체 사진을 볼 수 있다.
 */

interface SaluvItem {
  title: string;
  date: string; // "YYYY.MM.DD"
  href: string; // 상세 페이지 경로
  thumbnail: string; // 첫 사진 (없으면 "")
  count: number; // 사진 수
  summary: string;
}

interface Labels {
  empty: string;
  searchPlaceholder: string;
  photoCount: string; // "장" | " photos"
}

interface Props {
  posts: SaluvItem[]; // 최신순 정렬 상태로 전달됨
  labels: Labels;
}

const ITEMS_PER_PAGE = 10;

export default function SaluvList({ posts, labels }: Props) {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const q = query.trim().toLowerCase();
  const filtered = posts.filter(
    (p) => !q || [p.title, p.summary, p.date].join(" ").toLowerCase().includes(q),
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

      {/* Photo Card Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {paginated.map((item, index) => (
          <a
            key={index}
            href={item.href}
            className="border border-border rounded-lg overflow-hidden hover:bg-[#FAFAFA] transition-colors group"
          >
            {item.thumbnail && (
              <div className="aspect-[4/3] overflow-hidden bg-secondary">
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                />
              </div>
            )}
            <div className="p-4">
              <p className="text-[15px] font-semibold text-foreground group-hover:text-sal-terracotta transition-colors leading-snug truncate">
                {item.title}
              </p>
              <p className="text-[13px] text-muted-foreground mt-1">
                {item.date} · {item.count}
                {labels.photoCount}
              </p>
            </div>
          </a>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-[13px] text-[#A1A1AA] py-8 text-center">
          {labels.empty}
        </p>
      )}

      {/* Pagination (항상 표시) */}
      {filtered.length > 0 && (
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
