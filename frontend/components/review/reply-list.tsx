'use client';

import { useQuery } from '@tanstack/react-query';
import { reviewService } from '@/services/review.service';
import { ReplyItem } from './reply-item';
import { ReplyForm } from './reply-form';
import { useAuth } from '@/contexts/auth-context';
import { Loader2 } from 'lucide-react';
import type { Reply } from '@/types/academic';

interface ReplyListProps {
  reviewId: string;
}

export function ReplyList({ reviewId }: ReplyListProps) {
  const { user } = useAuth();

  const { data, isLoading } = useQuery({
    queryKey: ['review-replies', reviewId],
    queryFn: () => reviewService.getReviewById(reviewId),
  });

  const replies: Reply[] = data?.data?.replies || [];

  if (isLoading) {
    return (
      <div className="flex justify-center p-4">
        <Loader2 className="w-5 h-5 animate-spin text-slate-400 dark:text-slate-500" />
      </div>
    );
  }

  return (
    <div className="mt-4 pl-4 md:pl-10 space-y-4 border-l-2 border-slate-100/50 dark:border-slate-700/50">
      {/* List Existing Replies */}
      {replies.length > 0 ? (
        <div className="space-y-4">
          {replies.map((reply) => (
            <ReplyItem key={reply.id} reply={reply} reviewId={reviewId} />
          ))}
        </div>
      ) : null}

      {/* Main Reply Input (Level 0) */}
      {user ? (
        <div className="mt-4 pt-4 border-t border-slate-50 dark:border-slate-700">
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-xs shrink-0">
              {user.fullName.charAt(0)}
            </div>
            <div className="flex-1">
              <p className="text-xs font-bold text-slate-600 dark:text-slate-400 mb-2">
                {user.fullName}
              </p>
              <ReplyForm reviewId={reviewId} onSuccess={() => {}} />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
