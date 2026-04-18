import { useCallback, useEffect, useState } from 'react';
import type { UserData } from '../../types';
import EmojiIcon from '../icons/EmojiIcon';

interface DuoReviewProps {
  userData: UserData;
}

export default function DuoReview({ userData }: DuoReviewProps) {
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalysis = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userData }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || '获取点评失败');
      }

      const data = await response.json();
      setAnalysis(data.analysis);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : '获取点评失败');
      setAnalysis(null);
    } finally {
      setLoading(false);
    }
  }, [userData]);

  useEffect(() => {
    fetchAnalysis();
  }, [fetchAnalysis]);

  return (
    <section className="screenshot-solid-surface h-full flex flex-col group relative overflow-hidden rounded-apple-xl border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(248,249,252,0.94))] p-6 shadow-[0_12px_28px_rgba(15,23,42,0.05)] transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[0_18px_36px_rgba(15,23,42,0.09)] dark:border-0 dark:[background-clip:border-box] dark:bg-[linear-gradient(180deg,rgba(58,58,60,0.92),rgba(28,28,30,0.96))] dark:shadow-none dark:hover:shadow-[0_18px_36px_rgba(0,0,0,0.26)]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(20,184,166,0.14),transparent_44%),radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.1),transparent_48%)] opacity-90 transition-opacity duration-200 group-hover:opacity-100 dark:bg-[radial-gradient(circle_at_top_left,rgba(20,184,166,0.2),transparent_42%),radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.16),transparent_46%)] dark:opacity-100"
      />

      <div className="relative flex-1 flex flex-col">
        <div className="mb-5 flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="flex h-11 items-center justify-center text-[1.3rem] leading-none transition-transform duration-200 group-hover:scale-[1.03]">
              <EmojiIcon symbol="🦉" className="text-[1.3rem] leading-none" />
            </div>
            <div>
              <h2 className="text-lg font-semibold tracking-tight text-apple-dark1 dark:text-white">多儿点评</h2>
              <p className="mt-1 text-sm text-apple-gray6 dark:text-apple-dark6">用简短总结告诉你今天的学习状态</p>
            </div>
          </div>

          <span
            className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold tracking-[0.18em] transition-colors duration-200 ${
              loading
                ? 'bg-[#1cb0f6]/12 text-[#147fb2] dark:bg-[#1cb0f6]/16 dark:text-[#8ddcff]'
                : error
                  ? 'bg-[#ff4b4b]/10 text-[#d84343] dark:bg-[#ff4b4b]/14 dark:text-[#ff9a9a]'
                  : 'bg-[#58cc02]/10 text-[#3d8f09] dark:bg-[#58cc02]/15 dark:text-[#b6ef89]'
            }`}
          >
            {loading ? 'ANALYZING' : error ? 'ERROR' : 'READY'}
          </span>
        </div>

        <div className="screenshot-solid-panel relative min-h-[136px] flex-1 rounded-[24px] border border-white/70 bg-white/88 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.72)] transition-colors duration-200 group-hover:border-white/90 group-hover:bg-white/92 dark:border-0 dark:[background-clip:border-box] dark:bg-white/6 dark:shadow-none dark:group-hover:bg-white/8">
          {error ? (
            <div className="space-y-3">
              <p className="text-sm leading-7 text-apple-gray6 dark:text-apple-dark6">{error}</p>
              <button
                onClick={fetchAnalysis}
                className="inline-flex items-center rounded-full border border-black/5 bg-white px-4 py-2 text-sm font-semibold text-apple-dark1 shadow-[0_4px_12px_rgba(15,23,42,0.04)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_18px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-white/8 dark:text-white"
              >
                重试
              </button>
            </div>
          ) : (
            <>
              <p className={`text-sm leading-7 text-apple-dark1 transition-opacity duration-200 dark:text-white/90 ${loading ? 'opacity-0' : 'opacity-100'}`}>
                {analysis || '暂时还没有可展示的点评。'}
              </p>

              {loading ? (
                <div className="absolute inset-4 flex flex-col justify-center gap-3 animate-pulse">
                  <div className="h-4 w-2/3 rounded-full bg-black/5 dark:bg-white/10" />
                  <div className="h-4 w-full rounded-full bg-black/5 dark:bg-white/10" />
                  <div className="h-4 w-5/6 rounded-full bg-black/5 dark:bg-white/10" />
                </div>
              ) : null}
            </>
          )}
        </div>

        <div className="mt-5 flex justify-end">
          <button
            onClick={fetchAnalysis}
            disabled={loading}
            className="inline-flex items-center rounded-full bg-[#111827] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(17,24,39,0.14)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_24px_rgba(17,24,39,0.2)] disabled:cursor-not-allowed disabled:opacity-55 disabled:hover:translate-y-0 disabled:hover:shadow-[0_8px_20px_rgba(17,24,39,0.14)] dark:bg-white dark:text-apple-dark1"
          >
            {loading ? '生成中...' : '刷新点评'}
          </button>
        </div>
      </div>
    </section>
  );
}
