'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { reviewService } from '@/services/review.service';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';
import { MessageSquarePlus } from 'lucide-react';
import { useLanguage } from '@/contexts/language-context';

const reviewSchema = z.object({
    content: z.string().min(10, 'MIN_LENGTH_10'),
    isAnonymous: z.boolean(),
});

type ReviewFormType = z.infer<typeof reviewSchema>;

export function ReviewForm({ assignmentId }: { assignmentId: string }) {
    const { user } = useAuth();
    const { t } = useLanguage();
    const router = useRouter();
    const queryClient = useQueryClient();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<ReviewFormType>({
        resolver: zodResolver(reviewSchema),
        defaultValues: {
            isAnonymous: false
        }
    });

    const mutation = useMutation({
        mutationFn: (data: ReviewFormType) =>
            reviewService.createReview({
                teachingAssignmentId: assignmentId,
                content: data.content,
                isAnonymous: data.isAnonymous,
            }),
        onSuccess: () => {
            toast.success(t('review.success_create'));
            reset();
            queryClient.invalidateQueries({ queryKey: ['assignment', assignmentId] });
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Có lỗi xảy ra');
        }
    });

    const onSubmit = (data: ReviewFormType) => {
        if (!user) {
            toast.error(t('review.login_required'));
            router.push('/login');
            return;
        }
        mutation.mutate(data);
    };

    if (!user) {
        return (
            <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-xl text-center border border-slate-200 dark:border-slate-700 border-dashed transition-colors duration-300">
                <h3 className="font-bold text-slate-700 dark:text-slate-300 mb-2">{t('review.have_you_studied')}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">{t('review.share_experience')}</p>
                <Button onClick={() => router.push('/login')} variant="outline">{t('review.login_to_write')}</Button>
            </div>
        )
    }

    return (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border-2 border-slate-200 dark:border-slate-700 shadow-md mb-8 transition-colors duration-300">
            <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
                <MessageSquarePlus className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                {t('review.write_your_review')}
            </h3>

            <form onSubmit={handleSubmit(onSubmit)}>
                <textarea
                    className="w-full min-h-[120px] p-4 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 outline-none focus:border-blue-500 dark:focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 dark:focus:ring-blue-400/10 transition-all text-slate-700 text-sm resize-y placeholder:text-slate-400 dark:placeholder:text-slate-500"
                    placeholder={t('review.placeholder')}
                    {...register('content')}
                />
                {errors.content && (
                    <p className="text-red-500 text-xs mt-2">{errors.content.message === 'MIN_LENGTH_10' ? t('review.validation_content_min') : errors.content.message}</p>
                )}

                <div className="flex items-center justify-between mt-4">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input
                            type="checkbox"
                            className="w-4 h-4 rounded border-slate-300 dark:border-slate-600 text-blue-600 focus:ring-blue-500 dark:bg-slate-800"
                            {...register('isAnonymous')}
                        />
                        <span className="text-sm text-slate-600 dark:text-slate-400">{t('review.post_anonymous')}</span>
                    </label>

                    <Button type="submit" isLoading={mutation.isPending} className="px-6">
                        {t('review.submit')}
                    </Button>
                </div>
            </form>
        </div>
    );
}
