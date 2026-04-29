'use client';

import { useState } from 'react';
import { Review } from '@/types/academic';
import { VoteButtons } from './vote-buttons';
import { MessageSquare, UserCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ReplyList } from './reply-list';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/language-context';

import { RoleBadge } from '@/components/ui/RoleBadge';

interface ReviewItemProps {
  review: Review;
}

export function ReviewItem({ review }: ReviewItemProps) {
  const { t } = useLanguage();
  const [isExpanded, setIsExpanded] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('vi-VN', {
      dateStyle: 'long',
      timeStyle: 'short',
    });
  };

  return (
    <div
      id={`review-${review.id}`}
      className="bg-white dark:bg-slate-800 p-6 rounded-2xl border-2 border-slate-200 dark:border-slate-700 shadow-md hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-lg transition-all duration-300 scroll-mt-24 target:ring-2 target:ring-blue-500 target:shadow-xl"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-400 dark:text-slate-500">
          {review.isAnonymous || !review.author ? (
            <UserCircle className="w-6 h-6" />
          ) : (
            <span className="font-bold text-slate-600 dark:text-slate-300">
              {review.author.fullName.charAt(0)}
            </span>
          )}
        </div>

        <div>
          <div className="flex items-center gap-2">
            <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
              {review.isAnonymous || !review.author
                ? t('review.anonymous_student')
                : review.author.fullName}
            </h4>
            {!review.isAnonymous && review.author ? (
              <RoleBadge roles={review.author.roles} />
            ) : null}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {formatDate(review.createdAt)}
          </p>
        </div>
      </div>

      {/* Feedback Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {review.feedbackCommunication ? (
          <div className="bg-slate-50 dark:bg-slate-700/50 p-3 rounded-lg border border-slate-100 dark:border-slate-700">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1">
              {t('review.feedback_communication')}
            </span>
            <p className="text-sm text-slate-800 dark:text-slate-200">
              {review.feedbackCommunication}
            </p>
          </div>
        ) : null}
        {review.feedbackKnowledge ? (
          <div className="bg-slate-50 dark:bg-slate-700/50 p-3 rounded-lg border border-slate-100 dark:border-slate-700">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1">
              {t('review.feedback_knowledge')}
            </span>
            <p className="text-sm text-slate-800 dark:text-slate-200">{review.feedbackKnowledge}</p>
          </div>
        ) : null}
        {review.feedbackExpertise ? (
          <div className="bg-slate-50 dark:bg-slate-700/50 p-3 rounded-lg border border-slate-100 dark:border-slate-700">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1">
              {t('review.feedback_expertise')}
            </span>
            <p className="text-sm text-slate-800 dark:text-slate-200">{review.feedbackExpertise}</p>
          </div>
        ) : null}
        {review.feedbackAttitude ? (
          <div className="bg-slate-50 dark:bg-slate-700/50 p-3 rounded-lg border border-slate-100 dark:border-slate-700">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1">
              {t('review.feedback_attitude')}
            </span>
            <p className="text-sm text-slate-800 dark:text-slate-200">{review.feedbackAttitude}</p>
          </div>
        ) : null}
      </div>

      {/* Content */}
      <div className="text-slate-700 dark:text-slate-300 leading-relaxed mb-6 whitespace-pre-wrap">
        {review.content}
      </div>

      {/* Footer Actions */}
      <div className="flex flex-col">
        <div className="flex items-center gap-4 border-t border-slate-50 dark:border-slate-700 pt-4">
          <VoteButtons
            id={review.id}
            type="REVIEW"
            initialUp={review.upvoteCount}
            initialDown={review.downvoteCount}
            initialUserVote={review.userVote}
          />

          <Button
            variant="ghost"
            size="sm"
            className={cn(
              'text-slate-500 dark:text-slate-400 h-8 text-xs hover:bg-slate-100 dark:hover:bg-slate-700',
              isExpanded && 'bg-slate-50 dark:bg-slate-700 text-blue-600 dark:text-blue-400',
            )}
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <MessageSquare className="w-3.5 h-3.5 mr-1.5" />
            {review.repliesCount} {t('review.replies_count')}
            {isExpanded ? (
              <ChevronUp className="w-3 h-3 ml-1" />
            ) : (
              <ChevronDown className="w-3 h-3 ml-1" />
            )}
          </Button>
        </div>

        {/* Reply Section */}
        {isExpanded ? (
          <div className="mt-2 animate-in slide-in-from-top-2 fade-in duration-200">
            <ReplyList reviewId={review.id} />
          </div>
        ) : null}
      </div>
    </div>
  );
}
