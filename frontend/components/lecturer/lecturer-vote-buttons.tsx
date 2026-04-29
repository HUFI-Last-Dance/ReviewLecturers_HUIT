import { Button } from '@/components/ui/button';
import axios, { AxiosError } from 'axios';
import { academicService } from '@/services/academic.service';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/auth-context';

interface LecturerVoteButtonsProps {
  lecturerId: string;
  upvotes: number;
  downvotes: number;
  myVote?: 'UPVOTE' | 'DOWNVOTE' | null;
}

export function LecturerVoteButtons({
  lecturerId,
  upvotes,
  downvotes,
  myVote,
}: LecturerVoteButtonsProps) {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const mutation = useMutation({
    mutationFn: (voteType: 'UPVOTE' | 'DOWNVOTE') =>
      academicService.voteLecturer(lecturerId, voteType),
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ['lecturer', lecturerId] });
    },
    onError: (error: unknown) => {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<{ message: string }>;
        toast.error(axiosError.response?.data?.message || 'Lỗi khi vote');
      } else {
        toast.error('Lỗi khi vote');
      }
    },
  });

  const handleVote = (type: 'UPVOTE' | 'DOWNVOTE') => {
    if (!user) {
      toast.error('Vui lòng đăng nhập để vote');
      return;
    }
    mutation.mutate(type);
  };

  const isUpvoted = myVote === 'UPVOTE';
  const isDownvoted = myVote === 'DOWNVOTE';

  return (
    <div className="flex items-center gap-3">
      <Button
        variant="outline"
        size="sm"
        className={`flex items-center gap-2 transition-all ${
          isUpvoted
            ? 'bg-green-100 text-green-700 border-green-300 hover:bg-green-200 dark:bg-green-900/50 dark:text-green-400 dark:border-green-700'
            : 'hover:bg-green-50 hover:text-green-600 hover:border-green-200 dark:hover:bg-green-900/30'
        }`}
        onClick={() => handleVote('UPVOTE')}
        disabled={mutation.isPending}
      >
        <ThumbsUp className={`w-4 h-4 ${isUpvoted ? 'fill-current' : ''}`} />
        <span className="font-bold">{upvotes}</span>
      </Button>

      <Button
        variant="outline"
        size="sm"
        className={`flex items-center gap-2 transition-all ${
          isDownvoted
            ? 'bg-red-100 text-red-700 border-red-300 hover:bg-red-200 dark:bg-red-900/50 dark:text-red-400 dark:border-red-700'
            : 'hover:bg-red-50 hover:text-red-600 hover:border-red-200 dark:hover:bg-red-900/30'
        }`}
        onClick={() => handleVote('DOWNVOTE')}
        disabled={mutation.isPending}
      >
        <ThumbsDown className={`w-4 h-4 ${isDownvoted ? 'fill-current' : ''}`} />
        <span className="font-bold">{downvotes}</span>
      </Button>
    </div>
  );
}
