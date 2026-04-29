'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { academicService } from '@/services/academic.service';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, BookOpen } from 'lucide-react';
import Link from 'next/link';
import { useDebounce } from '@/hooks/use-debounce';
import { useLanguage } from '@/contexts/language-context';
import { BookmarkButton } from './BookmarkButton';
import { useComparison } from '@/contexts/comparison-context';
import { useRouter, useSearchParams } from 'next/navigation';

interface LecturerListContentProps {
  initialSearch: string;
  initialPage: number;
  initialDegree: string;
}

export function LecturerList() {
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get('search') || '';
  const initialPage = Number(searchParams.get('page')) || 1;
  const initialDegree = searchParams.get('degreeCode') || '';

  return (
    <LecturerListContent
      key={`${initialSearch}:${initialPage}:${initialDegree}`}
      initialSearch={initialSearch}
      initialPage={initialPage}
      initialDegree={initialDegree}
    />
  );
}

function LecturerListContent({
  initialSearch,
  initialPage,
  initialDegree,
}: LecturerListContentProps) {
  const { t } = useLanguage();
  const router = useRouter();

  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const debouncedSearch = useDebounce(searchTerm, 500);
  const [page, setPage] = useState(initialPage);
  const [degreeFilter, setDegreeFilter] = useState(initialDegree);

  const { addToCompare, removeFromCompare, isInComparison } = useComparison();

  const degrees = [
    { code: '', name: 'Tất cả học vị' },
    { code: 'GV', name: 'Giảng viên' },
    { code: 'ThS', name: 'Thạc sĩ' },
    { code: 'TS', name: 'Tiến sĩ' },
    { code: 'PGS', name: 'Phó Giáo sư' },
    { code: 'GS', name: 'Giáo sư' },
  ];

  // Sync state with URL
  useEffect(() => {
    const params = new URLSearchParams();
    if (debouncedSearch) params.set('search', debouncedSearch);
    if (page > 1) params.set('page', page.toString());
    if (degreeFilter) params.set('degreeCode', degreeFilter);

    router.push(`/lecturers?${params.toString()}`, { scroll: false });
  }, [debouncedSearch, page, degreeFilter, router]);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['lecturers', page, debouncedSearch, degreeFilter],
    queryFn: () =>
      academicService.getLecturers({
        page,
        limit: 12,
        search: debouncedSearch,
        degreeCode: degreeFilter || undefined,
        sort: 'engagement',
      }),
  });

  return (
    <>
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
            {t('lecturers.title')}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">{t('lecturers.subtitle')}</p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          {/* Degree Filter */}
          <select
            value={degreeFilter}
            onChange={(e) => {
              setDegreeFilter(e.target.value);
              setPage(1);
            }}
            className="h-12 px-4 rounded-2xl border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all cursor-pointer appearance-none"
          >
            {degrees.map((d) => (
              <option key={d.code} value={d.code}>
                {d.name}
              </option>
            ))}
          </select>

          {/* Search */}
          <div className="relative flex-1 md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <Input
              placeholder={t('lecturers.search_placeholder')}
              className="pl-10 h-11 bg-white dark:bg-slate-800 shadow-sm"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1); // Reset page on search
              }}
            />
          </div>
        </div>
      </div>

      {/* List Section */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="clay-card p-6 h-48 border-none animate-pulse">
              <div className="w-16 h-16 bg-blue-100 dark:bg-slate-800 rounded-full mb-4" />
              <div className="h-4 bg-blue-100 dark:bg-slate-800 rounded-xl w-3/4 mb-2" />
              <div className="h-3 bg-blue-100 dark:bg-slate-800 rounded-xl w-1/2" />
            </div>
          ))}
        </div>
      ) : isError ? (
        <div className="text-center py-20">
          <p className="text-red-500">{t('lecturers.error_loading')}</p>
        </div>
      ) : (
        <>
          {data?.data.lecturers.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🔍</div>
              <p className="text-slate-500 dark:text-slate-400 text-lg">
                Không tìm thấy giảng viên nào
              </p>
              {searchTerm ? (
                <p className="text-slate-400 dark:text-slate-500 text-sm mt-2">
                  Thử tìm kiếm với từ khóa khác
                </p>
              ) : null}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data?.data.lecturers.map((lecturer) => (
                <Link
                  href={`/lecturers/${lecturer.id}`}
                  key={lecturer.id}
                  className="group clay-card p-6 border-none hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-4">
                    {/* Avatar and basic info would go here, simplified as per original code structure */}
                    <div className="flex flex-col items-end gap-2 w-full">
                      <div className="flex justify-between w-full">
                        {/* Placeholder for where Avatar would be if it was in original source explicitly */}
                        <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-xl border-2 border-white dark:border-slate-700 shadow-sm">
                          {lecturer.fullName.charAt(0)}
                        </div>

                        <div className="flex items-center gap-2">
                          <div
                            className="flex items-center gap-2 mr-2"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <input
                              type="checkbox"
                              id={`compare-${lecturer.id}`}
                              className="w-5 h-5 rounded-lg border-2 border-slate-300 text-primary focus:ring-primary/20 transition-all cursor-pointer"
                              checked={isInComparison(lecturer.id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  addToCompare(lecturer);
                                } else {
                                  removeFromCompare(lecturer.id);
                                }
                              }}
                              disabled={false}
                            />
                            <label
                              htmlFor={`compare-${lecturer.id}`}
                              className={`text-xs font-medium cursor-pointer ${
                                isInComparison(lecturer.id)
                                  ? 'text-indigo-600'
                                  : 'text-slate-500 hover:text-slate-700'
                              }`}
                            >
                              So sánh
                            </label>
                          </div>

                          <BookmarkButton
                            lecturerId={lecturer.id}
                            initialIsBookmarked={lecturer.isBookmarked}
                            className="bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-600 border border-slate-100 dark:border-slate-700"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {lecturer.fullName}
                  </h3>

                  <div className="flex items-center gap-4 text-xs font-medium text-slate-500 dark:text-slate-400 pt-4 border-t border-slate-100 dark:border-slate-700 mt-4">
                    <div className="flex items-center gap-1">
                      <BookOpen className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                      {lecturer.assignmentsCount || 0} {t('lecturers.classes')}
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600" />
                      {lecturer.reviewsCount || 0} {t('lecturers.reviews')}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Pagination */}
          <div className="flex justify-center mt-10 gap-2">
            <Button
              variant="outline"
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              {t('lecturers.prev_page')}
            </Button>
            <span className="flex items-center px-4 font-medium text-slate-600 dark:text-slate-300">
              {t('lecturers.page')} {page} / {data?.data.pagination.totalPages || 1}
            </span>
            <Button
              variant="outline"
              disabled={!data || page >= (data.data.pagination.totalPages || 1)}
              onClick={() => setPage((p) => p + 1)}
            >
              {t('lecturers.next_page')}
            </Button>
          </div>
        </>
      )}
    </>
  );
}
