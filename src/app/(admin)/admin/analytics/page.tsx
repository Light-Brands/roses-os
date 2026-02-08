'use client';

import { motion } from 'framer-motion';
import {
  TrendingUp,
  Users,
  Eye,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Globe,
  Monitor,
  Smartphone,
  Tablet,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Demo analytics data
const overviewStats = [
  {
    label: 'Total Visitors',
    value: '24,521',
    change: '+18.2%',
    trend: 'up',
    icon: Users,
  },
  {
    label: 'Page Views',
    value: '89,432',
    change: '+12.5%',
    trend: 'up',
    icon: Eye,
  },
  {
    label: 'Avg. Session',
    value: '3m 24s',
    change: '+5.1%',
    trend: 'up',
    icon: Clock,
  },
  {
    label: 'Bounce Rate',
    value: '42.3%',
    change: '-2.4%',
    trend: 'up',
    icon: TrendingUp,
  },
];

const topPages = [
  { path: '/', title: 'Home', views: 12453, change: '+15%' },
  { path: '/features', title: 'Features', views: 8234, change: '+8%' },
  { path: '/pricing', title: 'Pricing', views: 6521, change: '+22%' },
  { path: '/blog', title: 'Blog', views: 4312, change: '+5%' },
  { path: '/contact', title: 'Contact', views: 2198, change: '-3%' },
];

const topCountries = [
  { country: 'United States', visitors: 8432, percentage: 34.4 },
  { country: 'United Kingdom', visitors: 3521, percentage: 14.4 },
  { country: 'Germany', visitors: 2876, percentage: 11.7 },
  { country: 'France', visitors: 2145, percentage: 8.7 },
  { country: 'Canada', visitors: 1987, percentage: 8.1 },
];

const devices = [
  { device: 'Desktop', icon: Monitor, percentage: 58, color: 'bg-primary-500' },
  { device: 'Mobile', icon: Smartphone, percentage: 35, color: 'bg-secondary-500' },
  { device: 'Tablet', icon: Tablet, percentage: 7, color: 'bg-green-500' },
];

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl text-neutral-900 dark:text-white">
            Analytics
          </h1>
          <p className="text-neutral-500 mt-1">
            Track your site&apos;s performance and visitor behavior
          </p>
        </div>
        <select className="px-4 py-2 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-600 dark:text-neutral-400">
          <option>Last 7 days</option>
          <option>Last 30 days</option>
          <option>Last 90 days</option>
          <option>This year</option>
        </select>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {overviewStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-5 hover:shadow-lg hover:shadow-neutral-200/50 dark:hover:shadow-neutral-900/50 transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500/10 to-secondary-500/10 dark:from-primary-500/20 dark:to-secondary-500/20 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-primary-500" />
                </div>
                <div
                  className={cn(
                    'flex items-center gap-0.5 text-xs font-semibold px-2 py-1 rounded-full',
                    stat.trend === 'up'
                      ? 'text-emerald-700 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-900/30'
                      : 'text-red-700 bg-red-50 dark:text-red-400 dark:bg-red-900/30'
                  )}
                >
                  {stat.trend === 'up' ? (
                    <ArrowUpRight className="w-3 h-3" />
                  ) : (
                    <ArrowDownRight className="w-3 h-3" />
                  )}
                  {stat.change}
                </div>
              </div>
              <p className="text-2xl font-bold text-neutral-900 dark:text-white tabular-nums">
                {stat.value}
              </p>
              <p className="text-xs font-medium text-neutral-500 mt-1">
                {stat.label}
              </p>
            </motion.div>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Visitors Chart Placeholder */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6"
        >
          <h2 className="text-lg text-neutral-900 dark:text-white mb-4">
            Visitors Over Time
          </h2>
          <div className="h-64 flex flex-col items-center justify-center bg-neutral-50 dark:bg-neutral-800/50 rounded-xl border-2 border-dashed border-neutral-200 dark:border-neutral-700">
            <TrendingUp className="w-8 h-8 text-neutral-300 dark:text-neutral-600 mb-2" />
            <p className="text-sm text-neutral-500">Chart visualization</p>
            <p className="text-xs text-neutral-400 mt-1">Connect analytics to view data</p>
          </div>
        </motion.div>

        {/* Device Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6"
        >
          <h2 className="text-lg text-neutral-900 dark:text-white mb-6">
            Devices
          </h2>
          <div className="space-y-5">
            {devices.map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={item.device}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
                        <Icon className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
                      </div>
                      <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                        {item.device}
                      </span>
                    </div>
                    <span className="text-sm font-bold text-neutral-900 dark:text-white tabular-nums">
                      {item.percentage}%
                    </span>
                  </div>
                  <div className="h-2 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${item.percentage}%` }}
                      transition={{ duration: 0.8, ease: 'easeOut', delay: 0.6 + index * 0.1 }}
                      className={cn('h-full rounded-full', item.color)}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* Tables Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Pages */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden"
        >
          <div className="p-5 border-b border-neutral-200 dark:border-neutral-800">
            <h2 className="text-lg text-neutral-900 dark:text-white">
              Top Pages
            </h2>
          </div>
          <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
            {topPages.map((page) => (
              <div
                key={page.path}
                className="px-5 py-3.5 flex items-center justify-between hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors"
              >
                <div>
                  <p className="text-sm font-medium text-neutral-900 dark:text-white">
                    {page.title}
                  </p>
                  <p className="text-xs text-neutral-500 mt-0.5">{page.path}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-neutral-900 dark:text-white tabular-nums">
                    {page.views.toLocaleString()}
                  </p>
                  <p
                    className={cn(
                      'text-xs font-medium mt-0.5',
                      page.change.startsWith('+')
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : 'text-red-600 dark:text-red-400'
                    )}
                  >
                    {page.change}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Top Countries */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden"
        >
          <div className="p-5 border-b border-neutral-200 dark:border-neutral-800 flex items-center gap-2">
            <Globe className="w-5 h-5 text-neutral-400" />
            <h2 className="text-lg text-neutral-900 dark:text-white">
              Top Countries
            </h2>
          </div>
          <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
            {topCountries.map((item) => (
              <div
                key={item.country}
                className="px-5 py-3.5 flex items-center justify-between hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
                    <span className="text-[10px] font-bold text-neutral-600 dark:text-neutral-400">
                      {item.country.slice(0, 2).toUpperCase()}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-neutral-900 dark:text-white">
                    {item.country}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-neutral-900 dark:text-white tabular-nums">
                    {item.visitors.toLocaleString()}
                  </p>
                  <p className="text-xs text-neutral-500 mt-0.5">{item.percentage}%</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
