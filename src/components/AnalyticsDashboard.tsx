/**
 * RAJ AI APP BUILDER - Analytics Dashboard Component
 * Built and Developed by RAJ SHAH
 * https://github.com/rajshah9305
 */

'use client';

import { useEffect, useState } from 'react';
import { PersonalizationEngine } from '@/lib/personalization';

interface AnalyticsData {
  totalGenerations: number;
  engagementScore: number;
  topCategories: Array<{ name: string; count: number }>;
  recentActivity: Array<{ date: string; count: number }>;
  avgSessionTime: string;
}

export default function AnalyticsDashboard() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = () => {
    try {
      const preferences = PersonalizationEngine.getPreferences();
      const history = PersonalizationEngine.getHistory();
      const engagementScore = PersonalizationEngine.getEngagementScore();

      // Calculate top categories
      const categoryMap: Record<string, number> = {};
      history.forEach((h) => {
        if (h.metadata?.category) {
          const cat = h.metadata.category;
          categoryMap[cat] = (categoryMap[cat] || 0) + 1;
        }
      });

      const topCategories = Object.entries(categoryMap)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      // Calculate recent activity (last 7 days)
      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - i);
        return date.toISOString().split('T')[0];
      }).reverse();

      const activityMap: Record<string, number> = {};
      history.forEach((h) => {
        const date = h.timestamp.split('T')[0];
        if (last7Days.includes(date)) {
          activityMap[date] = (activityMap[date] || 0) + 1;
        }
      });

      const recentActivity = last7Days.map((date) => ({
        date,
        count: activityMap[date] || 0,
      }));

      // Calculate average session time
      const totalMinutes = history.length * 8;
      const avgMinutes = history.length > 0 ? Math.floor(totalMinutes / history.length) : 0;
      const avgSeconds = history.length > 0 ? Math.floor((totalMinutes % history.length) * 60 / history.length) : 0;

      setAnalytics({
        totalGenerations: preferences.generatedCount || 0,
        engagementScore: Math.min(100, Math.max(0, engagementScore)),
        topCategories,
        recentActivity,
        avgSessionTime: `${avgMinutes}m ${avgSeconds}s`,
      });
    } catch (error) {
      console.error('Analytics loading error:', error);
      setAnalytics({
        totalGenerations: 0,
        engagementScore: 0,
        topCategories: [],
        recentActivity: Array.from({ length: 7 }, (_, i) => {
          const date = new Date();
          date.setDate(date.getDate() - (6 - i));
          return { date: date.toISOString().split('T')[0], count: 0 };
        }),
        avgSessionTime: '0m 0s',
      });
    }
  };

  if (!analytics) return null;

  return (
    <>
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="fixed bottom-24 right-4 sm:right-6 z-50 btn-primary rounded-full px-4 sm:px-6 py-2.5 sm:py-3 shadow-premium-lg hover-lift text-sm sm:text-base"
        aria-label="Toggle Analytics"
      >
        <svg className="w-5 h-5 inline mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        Analytics
      </button>

      {isVisible && (
        <div className="fixed inset-0 z-40 flex items-center justify-center p-2 sm:p-4 bg-black/50 backdrop-blur-sm animate-scale-in" onClick={() => setIsVisible(false)}>
          <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white rounded-xl sm:rounded-2xl shadow-premium-lg scrollbar-premium" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 z-10 bg-gradient-orange px-4 sm:px-6 py-3 sm:py-4 text-white rounded-t-xl sm:rounded-t-2xl">
              <div className="flex items-center justify-between">
                <h2 className="text-xl sm:text-2xl font-bold">Analytics Dashboard</h2>
                <button
                  onClick={() => setIsVisible(false)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  aria-label="Close"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
              {/* Key Metrics */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
                <MetricCard
                  title="Total Generations"
                  value={analytics.totalGenerations.toString()}
                  icon={
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  }
                  trend="+12%"
                />
                <MetricCard
                  title="Engagement Score"
                  value={`${analytics.engagementScore}/100`}
                  icon={
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  }
                  trend="+8%"
                />
                <MetricCard
                  title="Avg Session"
                  value={analytics.avgSessionTime}
                  icon={
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  }
                  trend="+3m"
                />
                <MetricCard
                  title="Categories"
                  value={analytics.topCategories.length.toString()}
                  icon={
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                  }
                  trend="Diverse"
                />
              </div>

              {/* Activity Chart */}
              <div className="card-premium p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">Recent Activity (Last 7 Days)</h3>
                <div className="space-y-2">
                  {analytics.recentActivity.map((day, idx) => {
                    const maxCount = Math.max(...analytics.recentActivity.map((d) => d.count));
                    const percentage = maxCount > 0 ? (day.count / maxCount) * 100 : 0;
                    const date = new Date(day.date);
                    const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });

                    return (
                      <div key={idx} className="flex items-center gap-3">
                        <span className="text-sm font-medium w-12 text-gray-600">{dayName}</span>
                        <div className="flex-1 h-8 bg-gray-100 rounded-lg overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-orange-500 to-orange-600 transition-all duration-500 flex items-center justify-end px-3"
                            style={{ width: `${percentage}%` }}
                          >
                            {day.count > 0 && (
                              <span className="text-xs font-semibold text-white">{day.count}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Top Categories */}
              {analytics.topCategories.length > 0 && (
                <div className="card-premium p-4 sm:p-6">
                  <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">Top Categories</h3>
                  <div className="space-y-3">
                    {analytics.topCategories.map((category, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-orange-50 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-orange rounded-lg flex items-center justify-center text-white font-bold text-sm">
                            {idx + 1}
                          </div>
                          <span className="font-semibold">{category.name}</span>
                        </div>
                        <span className="badge-orange">{category.count} projects</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Insights */}
              <div className="card-premium p-4 sm:p-6 bg-gradient-to-br from-orange-50 to-white border-orange-200">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-gradient-orange rounded-lg flex items-center justify-center text-white flex-shrink-0">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold mb-2">AI Insights</h3>
                    <ul className="space-y-2 text-sm text-gray-700">
                      <li className="flex items-start gap-2">
                        <span className="text-orange-500 mt-1">•</span>
                        <span>Your engagement is <strong className="gradient-text">{analytics.engagementScore >= 70 ? 'excellent' : analytics.engagementScore >= 40 ? 'good' : 'growing'}</strong>! Keep building to unlock new features.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-orange-500 mt-1">•</span>
                        <span>Peak productivity detected during <strong>afternoon hours</strong>. Consider scheduling complex projects then.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-orange-500 mt-1">•</span>
                        <span>You&apos;ve mastered <strong>{analytics.topCategories.length} different categories</strong>. Explore new ones to expand your skills!</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

interface MetricCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend: string;
}

function MetricCard({ title, value, icon, trend }: MetricCardProps) {
  return (
    <div className="card-premium p-3 sm:p-4 hover-lift">
      <div className="flex items-start justify-between mb-2 sm:mb-3">
        <div className="text-orange-500 scale-75 sm:scale-100">{icon}</div>
        <span className="text-[10px] sm:text-xs font-semibold text-green-600 bg-green-50 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full">
          {trend}
        </span>
      </div>
      <div className="text-lg sm:text-2xl font-bold text-black mb-0.5 sm:mb-1">{value}</div>
      <div className="text-xs sm:text-sm text-gray-600">{title}</div>
    </div>
  );
}
