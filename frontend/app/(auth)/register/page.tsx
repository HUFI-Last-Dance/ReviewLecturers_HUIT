'use client';

import { useForm } from 'react-hook-form';
import axios from 'axios';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation } from '@tanstack/react-query';
import { authService } from '@/services/auth.service';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { GraduationCap, CheckCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/language-context';

const registerSchema = z
  .object({
    fullName: z.string().min(2, 'Họ tên phải có ít nhất 2 ký tự'),
    email: z.string().email('Email không hợp lệ'),
    password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
    confirmPassword: z.string(),
    studentId: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Mật khẩu xác nhận không khớp',
    path: ['confirmPassword'],
  });

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const { t } = useLanguage();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const mutation = useMutation({
    mutationFn: (data: RegisterForm) => {
      // Remove confirmPassword before sending to API
      const { confirmPassword: _confirmPassword, ...registerData } = data;
      return authService.register(registerData);
    },
    onSuccess: () => {
      toast.success(t('auth.success_register'));
      router.push('/login');
    },
    onError: (error: unknown) => {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || 'Đăng ký thất bại');
      } else {
        toast.error('Có lỗi xảy ra');
      }
    },
  });

  const onSubmit = (data: RegisterForm) => {
    mutation.mutate(data);
  };

  return (
    <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-8 rounded-2xl shadow-xl border border-white/50 dark:border-slate-800/50 transition-colors duration-300">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 mb-4">
          <GraduationCap className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          {t('auth.create_account')}
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2">{t('auth.register_subtitle')}</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label={t('auth.full_name')}
          id="fullName"
          placeholder="Nguyễn Văn A"
          error={errors.fullName?.message}
          {...register('fullName')}
        />

        <Input
          label="Email"
          id="email"
          type="email"
          placeholder="name@example.com"
          error={errors.email?.message}
          {...register('email')}
        />

        <Input
          label={t('auth.student_id')}
          id="studentId"
          placeholder="20xxx... (không bắt buộc)"
          error={errors.studentId?.message}
          {...register('studentId')}
        />

        <Input
          label={t('auth.password')}
          id="password"
          type="password"
          placeholder="••••••••"
          error={errors.password?.message}
          {...register('password')}
        />

        <Input
          label="Xác nhận mật khẩu"
          id="confirmPassword"
          type="password"
          placeholder="••••••••"
          error={errors.confirmPassword?.message}
          {...register('confirmPassword')}
        />

        <Button
          type="submit"
          className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:shadow-lg hover:shadow-emerald-500/25 transition-all duration-300"
          isLoading={mutation.isPending}
        >
          {t('auth.register_free')}
        </Button>
      </form>

      {/* Benefits note */}
      <div className="mt-6 p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl border border-emerald-100 dark:border-emerald-800/50">
        <p className="text-xs text-emerald-700 dark:text-emerald-400 font-medium mb-2 flex items-center gap-1">
          <CheckCircle className="w-3 h-3" /> Quyền lợi khi đăng ký:
        </p>
        <ul className="text-xs text-emerald-600 dark:text-emerald-500 space-y-1 ml-4">
          <li>• Viết nhận xét về giảng viên</li>
          <li>• Vote và trả lời các nhận xét</li>
          <li>• Lưu giảng viên yêu thích</li>
        </ul>
      </div>

      <div className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
        {t('auth.have_account')}{' '}
        <Link
          href="/login"
          className="font-medium text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 dark:hover:text-emerald-300 hover:underline"
        >
          {t('auth.login_now')}
        </Link>
      </div>
    </div>
  );
}
