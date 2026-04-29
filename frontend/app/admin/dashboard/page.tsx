'use client';

import { useQuery } from '@tanstack/react-query';
import { adminService } from '@/services/admin.service';
import { Users, BookOpen, MessageSquare, AlertCircle } from 'lucide-react';

export default function AdminDashboard() {
    const { data, isLoading } = useQuery({
        queryKey: ['admin-stats'],
        queryFn: adminService.getStats,
    });

    if (isLoading) {
        return (
            <div className="grid grid-cols-4 gap-6 animate-pulse">
                {[1, 2, 3, 4].map(i => (
                    <div key={i} className="h-32 bg-slate-200 rounded-xl" />
                ))}
            </div>
        );
    }

    const stats = data?.data || {};

    const statCards = [
        { label: 'Người dùng', value: stats.usersCount || 0, icon: Users, color: 'text-blue-600', bg: 'bg-blue-100' },
        { label: 'Giảng viên', value: stats.lecturersCount || 0, icon: BookOpen, color: 'text-indigo-600', bg: 'bg-indigo-100' },
        { label: 'Reviews', value: stats.reviewsCount || 0, icon: MessageSquare, color: 'text-emerald-600', bg: 'bg-emerald-100' },
        { label: 'Chưa liên kết', value: stats.unlinkedLecturersCount || 0, icon: AlertCircle, color: 'text-amber-600', bg: 'bg-amber-100' },
    ];

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Tổng quan hệ thống</h1>
                <p className="text-slate-500">Số liệu thống kê thời gian thực</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((card, idx) => {
                    const Icon = card.icon;
                    return (
                        <div key={idx} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-500 mb-1">{card.label}</p>
                                <h3 className="text-3xl font-bold text-slate-900">{card.value}</h3>
                            </div>
                            <div className={`w-12 h-12 rounded-lg ${card.bg} flex items-center justify-center`}>
                                <Icon className={`w-6 h-6 ${card.color}`} />
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* Recent Activity or Quick Actions could go here */}
        </div>
    );
}
