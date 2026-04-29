'use client';

import { useForm } from 'react-hook-form';
import axios from 'axios';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { reviewService } from '@/services/review.service';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { SendHorizontal } from 'lucide-react';

const replySchema = z.object({
  content: z.string().min(1, 'Nội dung không được để trống'),
});

type ReplyFormType = z.infer<typeof replySchema>;

interface ReplyFormProps {
  reviewId: string;
  parentId?: string;
  onSuccess: () => void;
}

export function ReplyForm({ reviewId, parentId, onSuccess }: ReplyFormProps) {
  const queryClient = useQueryClient();

  const { register, handleSubmit, reset } = useForm<ReplyFormType>({
    resolver: zodResolver(replySchema),
  });

  const mutation = useMutation({
    mutationFn: (data: ReplyFormType) =>
      reviewService.createReply({
        reviewId,
        parentId,
        content: data.content,
      }),
    onSuccess: () => {
      toast.success('Đã gửi phản hồi');
      reset();
      // Invalidate review query to reload replies
      // Note: We need to properly target the query key for the review detail.
      // Or assignment detail if reply count matters.
      // Ideally we invalidate ['review-replies', reviewId]
      queryClient.invalidateQueries({ queryKey: ['review-replies', reviewId] });
      // Also assignment detail to update reply count
      // queryClient.invalidateQueries({ queryKey: ['assignment'] });

      onSuccess();
    },
    onError: (error: unknown) => {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || 'Có lỗi xảy ra');
      } else {
        toast.error('Có lỗi xảy ra');
      }
    },
  });

  const onSubmit = (data: ReplyFormType) => {
    mutation.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex items-start gap-2 w-full max-w-lg">
      <div className="flex-1 relative">
        <textarea
          className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400 focus:bg-white transition-all h-20 resize-none"
          placeholder="Viết phản hồi của bạn..."
          {...register('content')}
          autoFocus
        />
      </div>
      <Button
        type="submit"
        size="icon"
        className="w-10 h-10 shrink-0"
        isLoading={mutation.isPending}
      >
        <SendHorizontal className="w-4 h-4" />
      </Button>
    </form>
  );
}
