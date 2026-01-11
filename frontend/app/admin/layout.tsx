'use client';

import { useAuth } from '@/contexts/auth-context';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import {
    LayoutDashboard,
    Users,
    MessageSquare,
    Database,
    LogOut,
    Home,
    ShieldAlert
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, isLoading, logout } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (!isLoading && (!user || !user.roles.includes('admin'))) {
            router.push('/');
        }
    }, [user, isLoading, router]);

    if (isLoading || !user || !user.roles.includes('admin')) {
        return null; // Or loading spinner
    }

    const navItems = [
        { icon: LayoutDashboard, label: 'Tổng quan', href: '/admin/dashboard' },
        { icon: Users, label: 'Người dùng', href: '/admin/users' },
        { icon: MessageSquare, label: 'Duyệt Reviews', href: '/admin/reviews' },
        { icon: Database, label: 'Import Dữ liệu', href: '/admin/import' },
    ];

    return (
        <div className="flex min-h-screen bg-slate-100">
            {/* Sidebar */}
            <aside className="w-64 bg-slate-900 text-white fixed h-full flex flex-col shadow-xl z-50">
                <div className="p-6 border-b border-slate-800">
                    <div className="flex items-center gap-2 font-bold text-xl">
                        <ShieldAlert className="w-6 h-6 text-blue-500" />
                        <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                            Admin Panel
                        </span>
                    </div>
                </div>

                <nav className="flex-1 p-4 space-y-1">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all group",
                                    isActive
                                        ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30"
                                        : "text-slate-400 hover:bg-slate-800 hover:text-white"
                                )}
                            >
                                <Icon className={cn("w-5 h-5", isActive ? "text-white" : "text-slate-500 group-hover:text-white")} />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-slate-800 space-y-2">
                    <Link href="/">
                        <Button variant="ghost" className="w-full justify-start text-slate-400 hover:text-white hover:bg-slate-800">
                            <Home className="w-4 h-4 mr-2" />
                            Về trang chủ
                        </Button>
                    </Link>
                    <Button
                        variant="ghost"
                        className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-slate-800"
                        onClick={logout}
                    >
                        <LogOut className="w-4 h-4 mr-2" />
                        Đăng xuất
                    </Button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-64 p-8">
                {children}
            </main>
        </div>
    );
}
