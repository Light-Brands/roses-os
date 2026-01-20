'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  Meh,
  Star,
  Filter,
  MoreHorizontal,
  Mail,
  Trash2,
  Check,
  Archive,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Demo feedback data
const feedbackItems = [
  {
    id: '1',
    type: 'general',
    sentiment: 'positive',
    message:
      'Love the new design! The UI is clean and intuitive. Great work on the animations.',
    email: 'john@example.com',
    page: '/',
    createdAt: '2024-01-15 14:32',
    status: 'new',
    rating: 5,
  },
  {
    id: '2',
    type: 'bug',
    sentiment: 'negative',
    message:
      "The contact form isn't submitting properly. I keep getting an error message.",
    email: 'jane@example.com',
    page: '/contact',
    createdAt: '2024-01-15 12:15',
    status: 'new',
    rating: 2,
  },
  {
    id: '3',
    type: 'feature',
    sentiment: 'neutral',
    message:
      'Would be great to have a dark mode toggle in the navigation instead of just system preference.',
    email: 'mike@example.com',
    page: '/features',
    createdAt: '2024-01-14 18:45',
    status: 'reviewed',
    rating: 4,
  },
  {
    id: '4',
    type: 'general',
    sentiment: 'positive',
    message:
      'The pricing page is very clear and easy to understand. Signed up immediately!',
    email: 'sarah@example.com',
    page: '/pricing',
    createdAt: '2024-01-14 10:22',
    status: 'resolved',
    rating: 5,
  },
  {
    id: '5',
    type: 'bug',
    sentiment: 'negative',
    message: 'Mobile navigation menu sometimes doesn\'t close after clicking a link.',
    email: 'alex@example.com',
    page: '/blog',
    createdAt: '2024-01-13 16:08',
    status: 'new',
    rating: 3,
  },
];

const sentimentConfig = {
  positive: {
    icon: ThumbsUp,
    color: 'text-green-500',
    bg: 'bg-green-50 dark:bg-green-900/20',
  },
  negative: {
    icon: ThumbsDown,
    color: 'text-red-500',
    bg: 'bg-red-50 dark:bg-red-900/20',
  },
  neutral: {
    icon: Meh,
    color: 'text-yellow-500',
    bg: 'bg-yellow-50 dark:bg-yellow-900/20',
  },
};

const statusColors = {
  new: 'text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-900/20',
  reviewed: 'text-yellow-600 bg-yellow-50 dark:text-yellow-400 dark:bg-yellow-900/20',
  resolved: 'text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-900/20',
  archived: 'text-neutral-600 bg-neutral-50 dark:text-neutral-400 dark:bg-neutral-900/20',
};

const typeColors = {
  general: 'text-neutral-600 bg-neutral-50 dark:text-neutral-400 dark:bg-neutral-800',
  bug: 'text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-900/20',
  feature: 'text-purple-600 bg-purple-50 dark:text-purple-400 dark:bg-purple-900/20',
};

export default function FeedbackPage() {
  const [filter, setFilter] = useState<'all' | 'new' | 'reviewed' | 'resolved'>('all');
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  const filteredFeedback = feedbackItems.filter(
    (item) => filter === 'all' || item.status === filter
  );

  const selectedFeedback = selectedItem
    ? feedbackItems.find((f) => f.id === selectedItem)
    : null;

  const stats = {
    total: feedbackItems.length,
    positive: feedbackItems.filter((f) => f.sentiment === 'positive').length,
    negative: feedbackItems.filter((f) => f.sentiment === 'negative').length,
    avgRating: (
      feedbackItems.reduce((acc, f) => acc + f.rating, 0) / feedbackItems.length
    ).toFixed(1),
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
            Feedback
          </h1>
          <p className="text-neutral-500 mt-1">
            View and manage user feedback and suggestions
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0 }}
          className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-4 hover:shadow-lg hover:shadow-neutral-200/50 dark:hover:shadow-neutral-900/50 transition-shadow"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500/10 to-secondary-500/10 flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-primary-500" />
            </div>
            <div>
              <p className="text-xs font-medium text-neutral-500">Total</p>
              <p className="text-xl font-bold text-neutral-900 dark:text-white tabular-nums">
                {stats.total}
              </p>
            </div>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-4 hover:shadow-lg hover:shadow-neutral-200/50 dark:hover:shadow-neutral-900/50 transition-shadow"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center">
              <ThumbsUp className="w-5 h-5 text-emerald-500" />
            </div>
            <div>
              <p className="text-xs font-medium text-neutral-500">Positive</p>
              <p className="text-xl font-bold text-neutral-900 dark:text-white tabular-nums">
                {stats.positive}
              </p>
            </div>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-4 hover:shadow-lg hover:shadow-neutral-200/50 dark:hover:shadow-neutral-900/50 transition-shadow"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
              <ThumbsDown className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <p className="text-xs font-medium text-neutral-500">Negative</p>
              <p className="text-xl font-bold text-neutral-900 dark:text-white tabular-nums">
                {stats.negative}
              </p>
            </div>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-4 hover:shadow-lg hover:shadow-neutral-200/50 dark:hover:shadow-neutral-900/50 transition-shadow"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center">
              <Star className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <p className="text-xs font-medium text-neutral-500">Avg. Rating</p>
              <p className="text-xl font-bold text-neutral-900 dark:text-white tabular-nums">
                {stats.avgRating}
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2">
        <Filter className="w-4 h-4 text-neutral-400" />
        {(['all', 'new', 'reviewed', 'resolved'] as const).map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={cn(
              'px-3 py-1.5 text-sm font-medium rounded-xl transition-all duration-200 capitalize',
              filter === status
                ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900'
                : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
            )}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Feedback List */}
      <div className="flex gap-6">
        {/* List */}
        <div className="flex-1 space-y-4">
          {filteredFeedback.map((item, index) => {
            const sentiment = sentimentConfig[item.sentiment as keyof typeof sentimentConfig];
            const SentimentIcon = sentiment.icon;

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => setSelectedItem(item.id)}
                className={cn(
                  'bg-white dark:bg-neutral-900 rounded-2xl border p-4 cursor-pointer transition-all duration-200',
                  selectedItem === item.id
                    ? 'border-primary-500 ring-2 ring-primary-500/20 shadow-lg shadow-primary-500/5'
                    : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 hover:shadow-md'
                )}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={cn(
                      'w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0',
                      sentiment.bg
                    )}
                  >
                    <SentimentIcon className={cn('w-5 h-5', sentiment.color)} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span
                        className={cn(
                          'px-2 py-0.5 text-xs font-medium rounded-full capitalize',
                          typeColors[item.type as keyof typeof typeColors]
                        )}
                      >
                        {item.type}
                      </span>
                      <span
                        className={cn(
                          'px-2 py-0.5 text-xs font-medium rounded-full capitalize',
                          statusColors[item.status as keyof typeof statusColors]
                        )}
                      >
                        {item.status}
                      </span>
                      <span className="text-xs text-neutral-400">
                        {item.createdAt}
                      </span>
                    </div>
                    <p className="text-neutral-900 dark:text-white line-clamp-2">
                      {item.message}
                    </p>
                    <div className="flex items-center gap-3 mt-2 text-sm text-neutral-500">
                      <span>{item.email}</span>
                      <span>•</span>
                      <span>{item.page}</span>
                      <span>•</span>
                      <div className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                        {item.rating}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Detail Panel */}
        {selectedFeedback && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="hidden lg:block w-96 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden h-fit sticky top-6"
          >
            <div className="p-6 border-b border-neutral-200 dark:border-neutral-800">
              <div className="flex items-center justify-between mb-4">
                <span
                  className={cn(
                    'px-2.5 py-1 text-xs font-medium rounded-full capitalize',
                    statusColors[selectedFeedback.status as keyof typeof statusColors]
                  )}
                >
                  {selectedFeedback.status}
                </span>
                <button className="p-1.5 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded">
                  <MoreHorizontal className="w-4 h-4 text-neutral-400" />
                </button>
              </div>
              <p className="text-neutral-900 dark:text-white leading-relaxed">
                {selectedFeedback.message}
              </p>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between py-2 border-b border-neutral-100 dark:border-neutral-800">
                <span className="text-sm text-neutral-500">Email</span>
                <span className="text-sm font-medium text-neutral-900 dark:text-white">
                  {selectedFeedback.email}
                </span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-neutral-100 dark:border-neutral-800">
                <span className="text-sm text-neutral-500">Page</span>
                <span className="text-sm font-medium text-neutral-900 dark:text-white">
                  {selectedFeedback.page}
                </span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-neutral-100 dark:border-neutral-800">
                <span className="text-sm text-neutral-500">Type</span>
                <span className="text-sm font-medium text-neutral-900 dark:text-white capitalize">
                  {selectedFeedback.type}
                </span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-neutral-100 dark:border-neutral-800">
                <span className="text-sm text-neutral-500">Rating</span>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={cn(
                        'w-4 h-4',
                        star <= selectedFeedback.rating
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-neutral-200 dark:text-neutral-700'
                      )}
                    />
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-neutral-500">Submitted</span>
                <span className="text-sm font-medium text-neutral-900 dark:text-white">
                  {selectedFeedback.createdAt}
                </span>
              </div>
            </div>

            <div className="p-4 border-t border-neutral-200 dark:border-neutral-800 space-y-2">
              <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-primary-500 to-secondary-500 text-white text-sm font-medium rounded-xl hover:opacity-90 transition-opacity">
                <Mail className="w-4 h-4" />
                Reply
              </button>
              <div className="grid grid-cols-2 gap-2">
                <button className="flex items-center justify-center gap-2 px-4 py-2 bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 text-sm font-medium rounded-xl hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors">
                  <Check className="w-4 h-4" />
                  Resolve
                </button>
                <button className="flex items-center justify-center gap-2 px-4 py-2 bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 text-sm font-medium rounded-xl hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors">
                  <Archive className="w-4 h-4" />
                  Archive
                </button>
              </div>
              <button className="w-full flex items-center justify-center gap-2 px-4 py-2 text-red-600 dark:text-red-400 text-sm font-medium rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
