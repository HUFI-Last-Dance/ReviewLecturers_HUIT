'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminService } from '@/services/admin.service';
import { Loader2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface AdminReview {
  id: string;
  content: string;
  createdAt: string;
  isAnonymous: boolean;
  author?: {
    fullName?: string;
    email?: string;
  };
  target: {
    lecturer: string;
    subject: string;
  };
  stats: {
    upvotes: number;
    downvotes: number;
    replies: number;
  };
}

export default function ReviewsManagement() {
  const queryClient = useQueryClient();
  const page = 1;

  const { data, isLoading } = useQuery({
    queryKey: ['admin-reviews', page],
    queryFn: () => adminService.getAllReviews({ page, limit: 10 }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminService.deleteReview(id),
    onSuccess: () => {
      toast.success('Đã xóa review');
      queryClient.invalidateQueries({ queryKey: ['admin-reviews'] });
    },
    onError: () => toast.error('Xóa thất bại'),
  });

  if (isLoading)
    return (
      <div className="text-center p-8">
        <Loader2 className="w-8 h-8 animate-spin mx-auto text-slate-400" />
      </div>
    );

  const reviews: AdminReview[] = data?.data?.reviews || [];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Duyệt Nhận xét</h1>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-medium">
            <tr>
              <th className="p-4 w-1/3">Nội dung</th>
              <th className="p-4">Người viết</th>
              <th className="p-4">Môn Học / GV</th>
              <th className="p-4 text-center">Tương tác</th>
              <th className="p-4 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {reviews.map((review) => (
              <tr key={review.id} className="hover:bg-slate-50 transition-colors group">
                <td className="p-4">
                  <p className="text-slate-900 line-clamp-2" title={review.content}>
                    {review.content}
                  </p>
                  <div className="mt-1 text-xs text-slate-400">
                    {new Date(review.createdAt).toLocaleDateString()} •{' '}
                    {review.isAnonymous ? 'Ẩn danh' : 'Công khai'}
                  </div>
                </td>
                <td className="p-4">
                  <span className="font-medium block">{review.author?.fullName || 'N/A'}</span>
                  <span className="text-xs text-slate-400">{review.author?.email}</span>
                </td>
                <td className="p-4 text-xs text-slate-600">
                  <p className="font-bold">{review.target.lecturer}</p>
                  <p>{review.target.subject}</p>
                </td>
                <td className="p-4 text-center text-xs text-slate-500">
                  <div>Vote: {review.stats.upvotes - review.stats.downvotes}</div>
                  <div>Reply: {review.stats.replies}</div>
                </td>
                <td className="p-4 text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-red-400 hover:text-red-600 hover:bg-red-50"
                    onClick={() => {
                      if (confirm('Bạn có chắc chắn muốn xóa review này?')) {
                        deleteMutation.mutate(review.id);
                      }
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </td>
              </tr>
            ))}
            {reviews.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-slate-400">
                  Không có review nào
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
