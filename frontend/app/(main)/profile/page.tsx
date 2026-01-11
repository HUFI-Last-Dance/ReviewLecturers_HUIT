'use client';

import { useAuth } from '@/contexts/auth-context';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { reviewService } from '@/services/review.service';
import { authService } from '@/services/auth.service';
import { Loader2, User as UserIcon, Calendar, Trash2, MessageSquare, BookOpen, Pencil, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function ProfilePage() {
    const { user, isLoading: isAuthLoading, refreshUser } = useAuth();
    const router = useRouter();
    const queryClient = useQueryClient();

    // Edit profile state
    const [isEditing, setIsEditing] = useState(false);
    const [editFullName, setEditFullName] = useState('');
    const [editStudentId, setEditStudentId] = useState('');

    useEffect(() => {
        if (!isAuthLoading && !user) {
            router.push('/login');
        }
    }, [user, isAuthLoading, router]);

    useEffect(() => {
        if (user) {
            setEditFullName(user.fullName || '');
            setEditStudentId(user.studentId || '');
        }
    }, [user]);

    const { data, isLoading: isReviewsLoading } = useQuery({
        queryKey: ['my-reviews'],
        queryFn: () => reviewService.getMyReviews({ page: 1, limit: 50 }),
        enabled: !!user,
    });

    const deleteMutation = useMutation({
        mutationFn: reviewService.deleteReview,
        onSuccess: () => {
            toast.success('Đã xóa nhận xét');
            queryClient.invalidateQueries({ queryKey: ['my-reviews'] });
        },
        onError: () => toast.error('Không thể xóa nhận xét')
    });

    const updateProfileMutation = useMutation({
        mutationFn: authService.updateProfile,
        onSuccess: () => {
            toast.success('Cập nhật thông tin thành công!');
            setIsEditing(false);
            refreshUser();
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Không thể cập nhật thông tin');
        }
    });

    const handleSaveProfile = () => {
        if (editFullName.trim().length < 2) {
            toast.error('Họ tên phải có ít nhất 2 ký tự');
            return;
        }
        updateProfileMutation.mutate({
            fullName: editFullName.trim(),
            studentId: editStudentId.trim() || undefined,
        });
    };

    if (isAuthLoading || !user) return null;

    const reviews = data?.data?.reviews || [];
    const totalReviews = data?.data?.metadata?.total || 0;

    return (
        <div className="max-w-4xl mx-auto space-y-8 py-8">
            {/* User Info Card */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-sm border border-slate-100 dark:border-slate-700 transition-colors duration-300">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                    <div className="w-24 h-24 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
                        <UserIcon className="w-10 h-10" />
                    </div>

                    <div className="flex-1 text-center md:text-left space-y-2">
                        {isEditing ? (
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Họ tên</label>
                                    <Input
                                        value={editFullName}
                                        onChange={(e) => setEditFullName(e.target.value)}
                                        placeholder="Nhập họ tên"
                                        className="max-w-xs"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">MSSV</label>
                                    <Input
                                        value={editStudentId}
                                        onChange={(e) => setEditStudentId(e.target.value)}
                                        placeholder="Nhập MSSV (không bắt buộc)"
                                        className="max-w-xs"
                                    />
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        onClick={handleSaveProfile}
                                        isLoading={updateProfileMutation.isPending}
                                    >
                                        Lưu thay đổi
                                    </Button>
                                    <Button
                                        variant="outline"
                                        onClick={() => {
                                            setIsEditing(false);
                                            setEditFullName(user.fullName || '');
                                            setEditStudentId(user.studentId || '');
                                        }}
                                    >
                                        <X className="w-4 h-4 mr-1" /> Hủy
                                    </Button>
                                </div>
                                <p className="text-xs text-amber-600 dark:text-amber-400">
                                    ⚠️ Bạn chỉ có thể cập nhật thông tin 1 lần trong 3 ngày
                                </p>
                            </div>
                        ) : (
                            <>
                                <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">{user.fullName}</h1>
                                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-slate-500 dark:text-slate-400 text-sm">
                                    <span className="flex items-center gap-1">
                                        <span className="font-semibold text-slate-700 dark:text-slate-300">Email:</span> {user.email}
                                    </span>
                                    {user.studentId && (
                                        <span className="flex items-center gap-1">
                                            <span className="font-semibold text-slate-700 dark:text-slate-300">MSSV:</span> {user.studentId}
                                        </span>
                                    )}
                                    <span className="flex items-center gap-1">
                                        <Calendar className="w-4 h-4" />
                                        Tham gia {new Date(user.createdAt || '').toLocaleDateString('vi-VN')}
                                    </span>
                                </div>
                                <div className="pt-2 flex gap-2 justify-center md:justify-start flex-wrap">
                                    {user.roles.map(r => (
                                        <span key={r} className="px-3 py-1 bg-slate-100 dark:bg-slate-700 rounded-full text-xs font-medium uppercase text-slate-600 dark:text-slate-300">
                                            {r}
                                        </span>
                                    ))}
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setIsEditing(true)}
                                        className="ml-2"
                                    >
                                        <Pencil className="w-4 h-4 mr-1" /> Sửa thông tin
                                    </Button>
                                </div>
                            </>
                        )}
                    </div>

                    <div className="text-center bg-blue-50 dark:bg-blue-900/30 px-6 py-4 rounded-xl">
                        <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{totalReviews}</div>
                        <div className="text-xs text-blue-800 dark:text-blue-300 font-medium uppercase tracking-wide mt-1">Nhận xét</div>
                    </div>
                </div>
            </div>

            {/* My Reviews Section */}
            <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-6 flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    Nhận xét của tôi
                </h2>

                {isReviewsLoading ? (
                    <div className="text-center py-12"><Loader2 className="w-8 h-8 animate-spin mx-auto text-slate-300 dark:text-slate-600" /></div>
                ) : reviews.length > 0 ? (
                    <div className="grid gap-4">
                        {reviews.map((review: any) => (
                            <div key={review.id} className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow group">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                                            <BookOpen className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <Link
                                                href={`/assignments/${review.teachingAssignmentId}`}
                                                className="font-bold text-slate-900 dark:text-slate-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                                            >
                                                {review.teachingAssignment.subject.name}
                                            </Link>
                                            <div className="text-sm text-slate-500 dark:text-slate-400">
                                                GV: {review.teachingAssignment.lecturer.fullName}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-slate-400 dark:text-slate-500">
                                            {new Date(review.createdAt).toLocaleDateString('vi-VN')}
                                        </span>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 -mr-2"
                                            onClick={() => {
                                                if (confirm('Bạn có chắc muốn xóa nhận xét này?')) {
                                                    deleteMutation.mutate(review.id);
                                                }
                                            }}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>

                                <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg">
                                    {review.content}
                                </p>

                                <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 font-medium">
                                    <span className="bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 px-2 py-1 rounded">
                                        {review._count.votes} Votes
                                    </span>
                                    <span className="bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-1 rounded">
                                        {review._count.replies} Replies
                                    </span>
                                    {review.isAnonymous && (
                                        <span className="bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-2 py-1 rounded">
                                            Ẩn danh
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-xl border border-dashed border-slate-300 dark:border-slate-600">
                        <MessageSquare className="w-12 h-12 text-slate-200 dark:text-slate-600 mx-auto mb-4" />
                        <p className="text-slate-500 dark:text-slate-400">Bạn chưa viết nhận xét nào.</p>
                        <Link href="/lecturers">
                            <Button variant="link" className="mt-2 text-blue-600 dark:text-blue-400">
                                Tìm giảng viên để review ngay &rarr;
                            </Button>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
