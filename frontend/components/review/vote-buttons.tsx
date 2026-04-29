'use client';

import { useState } from 'react';
import axios from 'axios';
import { ArrowBigUp, ArrowBigDown } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { reviewService } from '@/services/review.service';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/auth-context';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

interface VoteButtonsProps {
  id: string;
  type: 'REVIEW' | 'REPLY';
  initialUp: number;
  initialDown: number;
  initialUserVote?: 'UPVOTE' | 'DOWNVOTE' | null;
}

export function VoteButtons({
  id,
  type,
  initialUp,
  initialDown,
  initialUserVote,
}: VoteButtonsProps) {
  const [votes, setVotes] = useState({ up: initialUp, down: initialDown });
  const [userVote, setUserVote] = useState<'UPVOTE' | 'DOWNVOTE' | null>(initialUserVote || null);
  const { user } = useAuth();
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: (voteType: 'UPVOTE' | 'DOWNVOTE') =>
      type === 'REVIEW'
        ? reviewService.voteReview(id, voteType)
        : reviewService.voteReply(id, voteType),
    onSuccess: (data) => {
      setVotes({
        up: data.data.upvoteCount,
        down: data.data.downvoteCount,
      });

      const { action } = data.data;
      if (action === 'deleted') {
        setUserVote(null);
      }
    },
    onError: (err: unknown) => {
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        toast.error('Vui lòng đăng nhập để vote');
        router.push('/login');
      }
    },
  });

  const handleVote = (voteType: 'UPVOTE' | 'DOWNVOTE') => {
    if (!user) {
      toast.error('Vui lòng đăng nhập để vote');
      router.push('/login');
      return;
    }

    mutation.mutate(voteType);

    if (userVote === voteType) {
      setUserVote(null);
    } else {
      setUserVote(voteType);
    }
  };

  return (
    <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 rounded-lg p-1 border-2 border-slate-200 dark:border-slate-700">
      <button
        onClick={() => handleVote('UPVOTE')}
        className={cn(
          'flex items-center gap-1 px-2 py-1 rounded text-xs font-bold transition-colors hover:bg-slate-100 dark:hover:bg-slate-700',
          userVote === 'UPVOTE'
            ? 'text-orange-600 dark:text-orange-400 bg-slate-100 dark:bg-slate-700'
            : 'text-slate-500 dark:text-slate-400',
        )}
      >
        <ArrowBigUp className={cn('w-5 h-5', userVote === 'UPVOTE' && 'fill-current')} />
        {votes.up}
      </button>

      <div className="w-px h-4 bg-slate-200 dark:bg-slate-600" />

      <button
        onClick={() => handleVote('DOWNVOTE')}
        className={cn(
          'flex items-center gap-1 px-2 py-1 rounded text-xs font-bold transition-colors hover:bg-slate-100 dark:hover:bg-slate-700',
          userVote === 'DOWNVOTE'
            ? 'text-blue-600 dark:text-blue-400 bg-slate-100 dark:bg-slate-700'
            : 'text-slate-500 dark:text-slate-400',
        )}
      >
        <ArrowBigDown className={cn('w-5 h-5', userVote === 'DOWNVOTE' && 'fill-current')} />
        {votes.down}
      </button>
    </div>
  );
}
