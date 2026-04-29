'use client';

import { Button } from "@/components/ui/button";
import { ArrowRight, Star, MessagesSquare, CheckCircle, TrendingUp, Flame } from "lucide-react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { academicService } from "@/services/academic.service";
import { reviewService } from "@/services/review.service";
import { useLanguage } from "@/contexts/language-context";

export default function Home() {
  const { t } = useLanguage();
  const { data: lecturersData } = useQuery({
    queryKey: ['featured-lecturers'],
    queryFn: () => academicService.getLecturers({ limit: 4, sort: 'engagement' })
  });

  const { data: reviewsData } = useQuery({
    queryKey: ['recent-reviews'],
    queryFn: () => reviewService.getRecentReviews()
  });

  const featuredLecturers = lecturersData?.data?.lecturers || [];
  const recentReviews = reviewsData?.data || []; // getRecentReviews returns array directly in data

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-24 pb-12 overflow-hidden bg-gradient-to-b from-blue-100/50 to-white dark:from-slate-900 dark:to-slate-950 transition-colors duration-300">
        {/* Decorative blur */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-sky-200/30 dark:bg-sky-900/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-pink-200/20 dark:bg-pink-900/5 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2" />

        <div className="container mx-auto px-4 text-center">
          {/* Banner */}
          <div className="w-full max-w-5xl mx-auto mb-10 rounded-2xl overflow-hidden shadow-2xl border-4 border-white dark:border-slate-800">
            <img
              src="/huit-banner.png"
              alt="HUIT Banner"
              className="w-full h-[200px] md:h-[280px] object-cover object-center"
            />
          </div>

          <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-slate-100 mb-6 tracking-tight leading-none">
            {t('home.hero_title')}
          </h1>
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 mb-8 max-w-2xl mx-auto leading-relaxed">
            {t('home.hero_subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/lecturers">
              <Button variant="clay" size="lg" className="w-full sm:w-auto text-lg px-8 py-6">
                {t('home.hero_cta')} <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link href="/about">
              <Button variant="outline" size="lg" className="w-full sm:w-auto text-lg px-8 py-6 rounded-[1.25rem] border-2 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800">
                Tìm hiểu thêm
              </Button>
            </Link>
          </div>

          {/* Stats Preview */}
          <div className="mt-16 grid grid-cols-3 gap-8 max-w-3xl mx-auto border-t border-slate-200/60 dark:border-slate-700/60 pt-8">
            <div>
              <div className="font-bold text-3xl text-slate-900 dark:text-slate-100">500+</div>
              <div className="text-sm text-slate-500 dark:text-slate-400 mt-1">Giảng viên</div>
            </div>
            <div>
              <div className="font-bold text-3xl text-slate-900 dark:text-slate-100">2k+</div>
              <div className="text-sm text-slate-500 dark:text-slate-400 mt-1">Reviews</div>
            </div>
            <div>
              <div className="font-bold text-3xl text-slate-900 dark:text-slate-100">10k+</div>
              <div className="text-sm text-slate-500 dark:text-slate-400 mt-1">Sinh viên</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Lecturers */}
      <section className="py-16 bg-white dark:bg-slate-950 transition-colors duration-300">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Star className="w-6 h-6 text-yellow-500 fill-current" />
                {t('home.featured_lecturers')}
              </h2>
              <p className="text-slate-600 dark:text-slate-400 mt-1">Giảng viên được đánh giá sôi nổi nhất</p>
            </div>
            <Link href="/lecturers" className="text-blue-700 dark:text-blue-400 font-semibold hover:underline flex items-center">
              {t('home.view_all')} <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredLecturers.map((lecturer: any) => (
              <Link key={lecturer.id} href={`/lecturers/${lecturer.id}`} className="group relative block clay-card p-6 border-none hover:translate-y-[-4px] transition-all duration-300">
                <div className="absolute top-4 right-4 z-10 text-slate-300 dark:text-slate-600 group-hover:text-primary transition-colors">
                  <Star className="w-6 h-6" />
                </div>
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-slate-700 dark:to-slate-600 flex items-center justify-center text-xl font-bold text-blue-600 dark:text-blue-400 shadow-md border-2 border-white dark:border-slate-600 mb-4 group-hover:scale-105 transition-transform">
                  {lecturer.fullName.charAt(0)}
                </div>
                <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-1">
                  {lecturer.fullName}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm mb-3 limit-text-2">
                  {lecturer.department}
                </p>
                <div className="flex items-center gap-2 text-xs font-semibold">

                  <div className="relative group/tooltip">
                    <span className={`px-2 py-1 rounded-lg border flex items-center gap-1 cursor-help ${lecturer.engagementScore && lecturer.engagementScore > 50 ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 border-orange-200 dark:border-orange-800' : 'bg-slate-100 text-slate-500 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700'}`}>
                      <Flame className={`w-3 h-3 text-orange-500 ${(lecturer.engagementScore && lecturer.engagementScore > 50) ? 'animate-pulse' : ''}`} />
                      {lecturer.engagementScore || 0}
                    </span>
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-slate-900 text-white text-[10px] rounded-lg opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all duration-200 shadow-xl z-50 pointer-events-none text-center">
                      <p className="font-bold mb-0.5 text-orange-400">🔥 {t('lecturers.hot_tooltip').split(':')[0]}</p>
                      {t('lecturers.hot_tooltip').split(':')[1]}
                      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-900 rotate-45"></div>
                    </div>
                  </div>

                  <span className="bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700">
                    {lecturer.assignmentsCount || lecturer._count?.teachingAssignments || 0} môn
                  </span>
                  <span className="bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 px-2 py-1 rounded-lg border border-blue-100 dark:border-blue-800 flex items-center gap-1">
                    <MessagesSquare className="w-3 h-3" />
                    {lecturer.reviewsCount || lecturer._count?.reviews || 0}
                  </span>
                </div>
              </Link>
            ))}
            {featuredLecturers.length === 0 && [1, 2, 3, 4].map(i => (
              <div key={i} className="h-48 bg-slate-100 dark:bg-slate-800 rounded-2xl animate-pulse border border-slate-200 dark:border-slate-700" />
            ))}
          </div>
        </div>
      </section>

      {/* Recent Reviews */}
      <section className="py-16 bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center justify-center gap-2">
              <MessagesSquare className="w-6 h-6 text-indigo-500" />
              {t('home.recent_reviews')}
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mt-2">Những nhận xét mới nhất từ sinh viên HUIT</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentReviews.map((review: any) => (
              <div key={review.id} className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-lg border border-slate-300 dark:border-slate-800 hover:shadow-2xl hover:border-indigo-400 transition-all duration-300">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-purple-900/30 dark:to-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-sm border-2 border-white dark:border-slate-800 shadow-sm">
                      {review.isAnonymous ? '?' : review.user?.fullName.charAt(0)}
                    </div>
                    <div>
                      <div className="font-bold text-slate-800 dark:text-slate-100 text-sm">
                        {review.isAnonymous ? 'Sinh viên ẩn danh' : review.user?.fullName}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-500">
                        {new Date(review.createdAt).toLocaleDateString('vi-VN')}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <Link
                    href={`/assignments/${review.teachingAssignmentId}#review-${review.id}`}
                    className="text-xs font-semibold text-blue-700 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30 px-2.5 py-1 rounded-lg border border-blue-200 dark:border-blue-800 hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors inline-block mb-2"
                  >
                    {review.teachingAssignment.subject.name} - {review.teachingAssignment.lecturer.fullName}
                  </Link>
                  <Link href={`/assignments/${review.teachingAssignmentId}#review-${review.id}`} className="block group">

                    <p className="text-slate-700 dark:text-slate-300 text-xs line-clamp-3 leading-relaxed group-hover:text-slate-900 dark:group-hover:text-slate-100 transition-colors">
                      ({review.teachingAssignment.term.name})
                    </p>
                    <p className="text-slate-700 dark:text-slate-300 text-base line-clamp-3 leading-relaxed group-hover:text-slate-900 dark:group-hover:text-slate-100 transition-colors">
                      {review.content}
                    </p>

                  </Link>

                </div>

                <div className="flex items-center justify-between pt-4 border-t-2 border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-1 text-slate-600 dark:text-slate-400 text-xs font-medium">
                    <TrendingUp className="w-3 h-3" />
                    <span>{review._count.votes} Hữu ích</span>
                  </div>
                </div>
              </div>
            ))}
            {recentReviews.length === 0 && [1, 2, 3].map(i => (
              <div key={i} className="h-40 bg-white dark:bg-slate-900 rounded-2xl animate-pulse border-2 border-slate-200 dark:border-slate-800" />
            ))}
          </div>
        </div>
      </section>
      {/* Mobile App Section */}
      <section className="py-20 bg-blue-700 dark:bg-blue-900 overflow-hidden relative">
        {/* Background blobs */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-blue-600 dark:bg-blue-800 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-600 dark:bg-indigo-800 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1 text-center lg:text-left text-white">
              <h2 className="text-3xl md:text-4xl font-black mb-6">Trải nghiệm tốt hơn trên ứng dụng di động</h2>
              <p className="text-blue-100 text-lg mb-10 max-w-xl">
                Theo dõi giảng viên, nhận thông báo review mới và thảo luận cùng cộng đồng sinh viên HUIT ngay trên điện thoại của bạn.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Link href="/download/android" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full sm:w-auto bg-black hover:bg-slate-900 text-white border-none px-8 py-7 rounded-2xl flex items-center gap-3">
                    <div className="text-left">
                      <div className="text-[10px] uppercase font-bold opacity-70">Tải về cho</div>
                      <div className="text-lg font-bold">Android (APK)</div>
                    </div>
                  </Button>
                </Link>
                <Link href="/download/ios" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full sm:w-auto bg-black hover:bg-slate-900 text-white border-none px-8 py-7 rounded-2xl flex items-center gap-3">
                    <div className="text-left">
                      <div className="text-[10px] uppercase font-bold opacity-70">Tải về trên</div>
                      <div className="text-lg font-bold">App Store</div>
                    </div>
                  </Button>
                </Link>
              </div>
            </div>
            <div className="flex-1 relative">
              <div className="relative mx-auto w-[280px] h-[580px] bg-slate-800 rounded-[3rem] border-[8px] border-slate-900 shadow-2xl overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-900 rounded-b-2xl z-20" />
                <img
                  src="/mobile-preview.png"
                  alt="App Preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&q=80&w=280&h=580';
                  }}
                />
              </div>
              {/* Decorative circles */}
              <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-blue-500/20 rounded-full blur-2xl" />
            </div>
          </div>
        </div>
      </section>
    </div>

  );
}
