'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminService } from '@/services/admin.service';
import { Loader2, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface AdminUser {
  id: string;
  fullName: string;
  email: string;
  roles: string[];
  createdAt: string;
}

export default function UsersManagement() {
  const queryClient = useQueryClient();
  const page = 1;

  const { data, isLoading } = useQuery({
    queryKey: ['admin-users', page],
    queryFn: () => adminService.getUsers({ page, limit: 10 }),
  });

  const updateRoleMutation = useMutation({
    mutationFn: ({ userId, roles }: { userId: string; roles: string[] }) =>
      adminService.updateUserRole(userId, roles),
    onSuccess: () => {
      toast.success('Cập nhật quyền thành công');
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
    },
    onError: () => toast.error('Cập nhật thất bại'),
  });

  if (isLoading)
    return (
      <div className="text-center p-8">
        <Loader2 className="w-8 h-8 animate-spin mx-auto text-slate-400" />
      </div>
    );

  const users: AdminUser[] = data?.data?.users || [];

  const toggleAdmin = (user: AdminUser) => {
    const isAdmin = user.roles.includes('admin');
    const newRoles = isAdmin
      ? user.roles.filter((r: string) => r !== 'admin')
      : [...user.roles, 'admin'];

    updateRoleMutation.mutate({ userId: user.id, roles: newRoles });
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Quản lý Người dùng</h1>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-medium">
            <tr>
              <th className="p-4">Họ tên</th>
              <th className="p-4">Email</th>
              <th className="p-4">Vai trò</th>
              <th className="p-4">Ngày tham gia</th>
              <th className="p-4 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                <td className="p-4 font-medium text-slate-900">{user.fullName}</td>
                <td className="p-4 text-slate-500">{user.email}</td>
                <td className="p-4">
                  <div className="flex gap-1">
                    {user.roles.map((r: string) => (
                      <span
                        key={r}
                        className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${
                          r === 'admin' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
                        }`}
                      >
                        {r}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="p-4 text-slate-400 text-xs">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
                <td className="p-4 text-right">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleAdmin(user)}
                    disabled={updateRoleMutation.isPending}
                  >
                    <Shield className="w-3 h-3 mr-1" />
                    {user.roles.includes('admin') ? 'Gỡ Admin' : 'Thăng Admin'}
                  </Button>
                </td>
              </tr>
            ))}
            {users.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-slate-400">
                  Không tìm thấy user nào
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
