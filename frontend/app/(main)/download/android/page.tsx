'use client';

import { useState, useEffect, useCallback } from 'react';
import { Download, Smartphone, CheckCircle, AlertCircle } from 'lucide-react';

interface Release {
  id: number;
  tag_name: string;
  name: string;
  published_at: string;
  body: string;
  assets: Array<{
    name: string;
    browser_download_url: string;
    size: number;
  }>;
}

export default function AndroidDownloadPage() {
  const [releases, setReleases] = useState<Release[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReleases = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        'https://api.github.com/repos/HUFI-Last-Dance/ReviewLecturers_HUIT/releases',
      );

      if (!response.ok) {
        throw new Error('Failed to fetch releases');
      }

      const data = await response.json();

      // Filter only mobile releases
      const mobileReleases = data.filter((release: Release) =>
        release.tag_name.startsWith('mobile-v'),
      );

      setReleases(mobileReleases);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    const loadReleases = async () => {
      try {
        const response = await fetch(
          'https://api.github.com/repos/HUFI-Last-Dance/ReviewLecturers_HUIT/releases',
        );

        if (!response.ok) {
          throw new Error('Failed to fetch releases');
        }

        const data = await response.json();

        // Filter only mobile releases
        const mobileReleases = data.filter((release: Release) =>
          release.tag_name.startsWith('mobile-v'),
        );

        if (mounted) {
          setReleases(mobileReleases);
          setLoading(false);
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Unknown error');
          setLoading(false);
        }
      }
    };

    void loadReleases();

    return () => {
      mounted = false;
    };
  }, []);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Đang tải danh sách phiên bản...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            Lỗi tải dữ liệu
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-4">{error}</p>
          <button
            onClick={fetchReleases}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-600 rounded-3xl mb-6 shadow-lg">
            <Smartphone className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Tải ReviewLecturers
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Tải xuống ứng dụng ReviewLecturers cho Android. Chọn phiên bản phù hợp với thiết bị của
            bạn.
          </p>
        </div>

        {/* Installation Guide */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6 mb-8">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center">
            <CheckCircle className="w-6 h-6 text-green-500 mr-2" />
            Hướng dẫn cài đặt
          </h2>
          <ol className="space-y-3 text-slate-600 dark:text-slate-400">
            <li className="flex items-start">
              <span className="inline-flex items-center justify-center w-6 h-6 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-full mr-3 flex-shrink-0 text-sm font-bold">
                1
              </span>
              <span>Tải file APK về thiết bị Android của bạn</span>
            </li>
            <li className="flex items-start">
              <span className="inline-flex items-center justify-center w-6 h-6 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-full mr-3 flex-shrink-0 text-sm font-bold">
                2
              </span>
              <span>
                Vào <strong>Cài đặt → Bảo mật</strong> và bật{' '}
                <strong>&quot;Cài đặt từ nguồn không xác định&quot;</strong>
              </span>
            </li>
            <li className="flex items-start">
              <span className="inline-flex items-center justify-center w-6 h-6 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-full mr-3 flex-shrink-0 text-sm font-bold">
                3
              </span>
              <span>
                Mở file APK vừa tải và nhấn <strong>Cài đặt</strong>
              </span>
            </li>
            <li className="flex items-start">
              <span className="inline-flex items-center justify-center w-6 h-6 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-full mr-3 flex-shrink-0 text-sm font-bold">
                4
              </span>
              <span>Mở ứng dụng và bắt đầu sử dụng!</span>
            </li>
          </ol>
        </div>

        {/* Releases List */}
        {releases.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-12 text-center">
            <Smartphone className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
              Chưa có phiên bản nào
            </h3>
            <p className="text-slate-600 dark:text-slate-400">
              Phiên bản đầu tiên sẽ sớm được phát hành. Vui lòng quay lại sau!
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {releases.map((release, index) => (
              <div
                key={release.id}
                className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                        {release.name}
                      </h3>
                      {index === 0 ? (
                        <span className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 text-sm font-semibold rounded-full">
                          Mới nhất
                        </span>
                      ) : null}
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Phát hành: {formatDate(release.published_at)}
                    </p>
                  </div>
                </div>

                {/* Release Notes */}
                {release.body ? (
                  <div className="mb-4 p-4 bg-slate-50 dark:bg-slate-900 rounded-xl">
                    <p className="text-sm text-slate-600 dark:text-slate-400 whitespace-pre-line">
                      {release.body}
                    </p>
                  </div>
                ) : null}

                {/* Download Buttons */}
                <div className="space-y-3">
                  {release.assets
                    .filter((asset) => asset.name.endsWith('.apk'))
                    .map((asset) => (
                      <a
                        key={asset.name}
                        href={asset.browser_download_url}
                        className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-xl transition group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition">
                            <Download className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900 dark:text-white">
                              {asset.name}
                            </p>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                              {formatFileSize(asset.size)}
                            </p>
                          </div>
                        </div>
                        <Download className="w-5 h-5 text-blue-600 dark:text-blue-400 group-hover:translate-x-1 transition" />
                      </a>
                    ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer Note */}
        <div className="mt-8 text-center text-sm text-slate-500 dark:text-slate-400">
          <p>
            Gặp vấn đề khi cài đặt?{' '}
            <a
              href="https://github.com/HUFI-Last-Dance/ReviewLecturers_HUIT/issues"
              className="text-blue-600 dark:text-blue-400 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Báo cáo lỗi
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
