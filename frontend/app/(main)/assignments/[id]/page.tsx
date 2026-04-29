'use client';

import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { academicService } from '@/services/academic.service';
import { Button } from '@/components/ui/button';
import { ArrowLeft, School, Users } from 'lucide-react';
import { ReviewForm } from '@/components/review/review-form';
import { ReviewItem } from '@/components/review/review-item';
import Link from 'next/link';
import { useLanguage } from '@/contexts/language-context';

export default function AssignmentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { t } = useLanguage();
  const id = params.id as string;

  const { data, isLoading, isError } = useQuery({
    queryKey: ['assignment', id],
    queryFn: () => academicService.getAssignmentById(id),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 animate-pulse">
        <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-1/4 mb-8" />
        <div className="h-40 bg-slate-200 dark:bg-slate-700 rounded-2xl mb-8" />
        <div className="space-y-4">
          <div className="h-32 bg-slate-200 dark:bg-slate-700 rounded-2xl" />
          <div className="h-32 bg-slate-200 dark:bg-slate-700 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (isError || !data?.data) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-xl font-bold text-red-500">{t('assignment.not_found')}</h2>
        <Button onClick={() => router.back()} className="mt-4" variant="outline">
          {t('common.back')}
        </Button>
      </div>
    );
  }

  const assignment = data.data;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-6 flex items-center justify-between">
        <Button
          variant="ghost"
          className="pl-0 hover:bg-transparent hover:text-blue-600 dark:hover:text-blue-400 dark:text-slate-300"
          onClick={() => router.back()}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {t('common.back')}
        </Button>

        <Link
          href={`/lecturers/${assignment.lecturer.id}`}
          className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
        >
          {t('assignment.view_lecturer_profile')}
        </Link>
      </div>

      {/* Assignment Info Header */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 dark:from-slate-800 dark:to-slate-900 rounded-3xl p-8 shadow-xl text-white mb-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2 opacity-80">
            <span className="bg-white/10 px-2 py-0.5 rounded text-sm font-mono border border-white/20">
              {assignment.subject.code}
            </span>
            <span>•</span>
            <span className="text-sm font-medium">{assignment.term.name}</span>
          </div>

          <h1 className="text-3xl font-bold mb-6">{assignment.subject.name}</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-300" />
              </div>
              <div>
                <div className="text-xs text-white/60">{t('assignment.lecturer')}</div>
                <div className="font-bold text-lg">{assignment.lecturer.fullName}</div>
              </div>
            </div>

            {assignment.campus ? (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                  <School className="w-5 h-5 text-emerald-300" />
                </div>
                <div>
                  <div className="text-xs text-white/60">{t('assignment.campus')}</div>
                  <div className="font-bold text-lg">{assignment.campus.name}</div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {/* Review Form */}
      <ReviewForm assignmentId={id} />

      {/* Review List */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
          {assignment.reviews.length > 0
            ? `${assignment.reviews.length} ${t('review.reviews')}`
            : t('assignment.no_reviews')}
        </h2>

        {assignment.reviews.length === 0 ? (
          <div className="text-center py-10 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 border-dashed">
            <p className="text-slate-500 dark:text-slate-400">{t('assignment.be_first')}</p>
          </div>
        ) : (
          assignment.reviews.map((review) => <ReviewItem key={review.id} review={review} />)
        )}
      </div>
    </div>
  );
}
