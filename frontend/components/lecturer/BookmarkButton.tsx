'use client';

import { useState } from 'react';
import { Bookmark } from 'lucide-react';
import { academicService } from '@/services/academic.service';
import { toast } from 'sonner';
import { cn } from '@/lib/utils'; // Assuming utils exist, or I will use standard class string
import { useAuth } from '@/contexts/auth-context'; // Assuming AuthContext exists

interface BookmarkButtonProps {
  lecturerId: string;
  initialIsBookmarked?: boolean;
  className?: string;
  size?: number;
  onToggle?: (newState: boolean) => void;
}

export function BookmarkButton({
  lecturerId,
  initialIsBookmarked = false,
  className,
  size = 20,
  onToggle,
}: BookmarkButtonProps) {
  const [isBookmarked, setIsBookmarked] = useState(initialIsBookmarked);
  const [isLoading, setIsLoading] = useState(false);

  const { user } = useAuth(); // To check if logged in

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent parent click (e.g., card navigation)
    e.stopPropagation();

    if (!user) {
      toast.error('Bạn cần đăng nhập để lưu giảng viên.');
      return;
    }

    if (isLoading) return;

    // Optimistic update
    const newState = !isBookmarked;
    setIsBookmarked(newState);
    if (onToggle) onToggle(newState);

    try {
      setIsLoading(true);
      await academicService.toggleBookmark(lecturerId);
      // Success - no action needed as we optimized
    } catch {
      // Revert on error
      setIsBookmarked(!newState);
      if (onToggle) onToggle(!newState);

      toast.error('Không thể thực hiện hành động này.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggle}
      className={cn(
        'transition-transform active:scale-95 p-2 rounded-full hover:bg-slate-100',
        isBookmarked ? 'text-red-500' : 'text-slate-400 hover:text-red-400',
        className,
      )}
      title={isBookmarked ? 'Bỏ lưu' : 'Lưu giảng viên'}
    >
      <Bookmark
        size={size}
        fill={isBookmarked ? 'currentColor' : 'none'}
        className={isBookmarked ? 'fill-current' : ''}
      />
    </button>
  );
}
