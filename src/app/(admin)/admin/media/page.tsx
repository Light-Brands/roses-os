'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Upload,
  Search,
  Grid,
  List,
  Image as ImageIcon,
  FileText,
  Video,
  Music,
  MoreHorizontal,
  Download,
  Trash2,
  Copy,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Demo media data
const mediaItems = [
  {
    id: '1',
    name: 'hero-banner.jpg',
    type: 'image',
    size: '2.4 MB',
    dimensions: '1920x1080',
    uploadedAt: '2024-01-15',
    url: '/placeholder-1.jpg',
  },
  {
    id: '2',
    name: 'product-demo.mp4',
    type: 'video',
    size: '45.2 MB',
    dimensions: '1920x1080',
    uploadedAt: '2024-01-14',
    url: '/placeholder-video.mp4',
  },
  {
    id: '3',
    name: 'team-photo.jpg',
    type: 'image',
    size: '1.8 MB',
    dimensions: '1600x900',
    uploadedAt: '2024-01-13',
    url: '/placeholder-2.jpg',
  },
  {
    id: '4',
    name: 'logo.svg',
    type: 'image',
    size: '12 KB',
    dimensions: '200x200',
    uploadedAt: '2024-01-12',
    url: '/logo.svg',
  },
  {
    id: '5',
    name: 'documentation.pdf',
    type: 'document',
    size: '3.1 MB',
    dimensions: null,
    uploadedAt: '2024-01-11',
    url: '/docs.pdf',
  },
  {
    id: '6',
    name: 'feature-image.png',
    type: 'image',
    size: '856 KB',
    dimensions: '800x600',
    uploadedAt: '2024-01-10',
    url: '/placeholder-3.png',
  },
  {
    id: '7',
    name: 'background-music.mp3',
    type: 'audio',
    size: '4.5 MB',
    dimensions: null,
    uploadedAt: '2024-01-09',
    url: '/music.mp3',
  },
  {
    id: '8',
    name: 'testimonial-bg.jpg',
    type: 'image',
    size: '1.2 MB',
    dimensions: '1920x1080',
    uploadedAt: '2024-01-08',
    url: '/placeholder-4.jpg',
  },
];

const typeIcons = {
  image: ImageIcon,
  video: Video,
  audio: Music,
  document: FileText,
};

const typeColors = {
  image: 'text-blue-500 bg-blue-50 dark:bg-blue-900/20',
  video: 'text-purple-500 bg-purple-50 dark:bg-purple-900/20',
  audio: 'text-green-500 bg-green-50 dark:bg-green-900/20',
  document: 'text-orange-500 bg-orange-50 dark:bg-orange-900/20',
};

export default function MediaPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const filteredMedia = mediaItems.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedMedia = selectedItem
    ? mediaItems.find((m) => m.id === selectedItem)
    : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
            Media Library
          </h1>
          <p className="text-neutral-500 mt-1">
            Upload and manage your media files
          </p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-medium rounded-lg hover:opacity-90 transition-opacity">
          <Upload className="w-4 h-4" />
          Upload Files
        </button>
      </div>

      {/* Filters and View Toggle */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search files..."
            className={cn(
              'w-full pl-10 pr-4 py-2.5 rounded-lg',
              'bg-white dark:bg-neutral-900',
              'border border-neutral-200 dark:border-neutral-800',
              'text-neutral-900 dark:text-white',
              'placeholder:text-neutral-400',
              'focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500'
            )}
          />
        </div>
        <div className="flex items-center gap-2 bg-neutral-100 dark:bg-neutral-800 p-1 rounded-lg">
          <button
            onClick={() => setViewMode('grid')}
            className={cn(
              'p-2 rounded',
              viewMode === 'grid'
                ? 'bg-white dark:bg-neutral-700 shadow-sm'
                : 'text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300'
            )}
          >
            <Grid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={cn(
              'p-2 rounded',
              viewMode === 'list'
                ? 'bg-white dark:bg-neutral-700 shadow-sm'
                : 'text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300'
            )}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Upload Drop Zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          // Handle file drop
        }}
        className={cn(
          'border-2 border-dashed rounded-xl p-8 text-center transition-colors',
          isDragging
            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
            : 'border-neutral-200 dark:border-neutral-800'
        )}
      >
        <Upload className="w-10 h-10 text-neutral-400 mx-auto mb-3" />
        <p className="text-neutral-600 dark:text-neutral-400">
          Drag and drop files here, or{' '}
          <button className="text-primary-500 font-medium hover:underline">
            browse
          </button>
        </p>
        <p className="text-sm text-neutral-400 mt-1">
          Supports: JPG, PNG, GIF, SVG, PDF, MP4, MP3
        </p>
      </div>

      {/* Media Grid/List */}
      <div className="flex gap-6">
        {/* Main Content */}
        <div className="flex-1">
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {filteredMedia.map((item, index) => {
                const Icon = typeIcons[item.type as keyof typeof typeIcons];
                const colorClass = typeColors[item.type as keyof typeof typeColors];

                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => setSelectedItem(item.id)}
                    className={cn(
                      'group relative bg-white dark:bg-neutral-900 rounded-xl border overflow-hidden cursor-pointer transition-all',
                      selectedItem === item.id
                        ? 'border-primary-500 ring-2 ring-primary-500/20'
                        : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700'
                    )}
                  >
                    {/* Thumbnail */}
                    <div className="aspect-square bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
                      {item.type === 'image' ? (
                        <div className="w-full h-full bg-gradient-to-br from-neutral-200 to-neutral-300 dark:from-neutral-700 dark:to-neutral-800" />
                      ) : (
                        <Icon className={cn('w-12 h-12', colorClass.split(' ')[0])} />
                      )}
                    </div>

                    {/* Info */}
                    <div className="p-3">
                      <p className="text-sm font-medium text-neutral-900 dark:text-white truncate">
                        {item.name}
                      </p>
                      <p className="text-xs text-neutral-500 mt-1">
                        {item.size}
                      </p>
                    </div>

                    {/* Hover Actions */}
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1.5 bg-white dark:bg-neutral-900 rounded-lg shadow-lg">
                        <MoreHorizontal className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden">
              <table className="w-full">
                <thead className="bg-neutral-50 dark:bg-neutral-800/50 border-b border-neutral-200 dark:border-neutral-800">
                  <tr>
                    <th className="text-left px-4 py-3 text-sm font-medium text-neutral-500">
                      Name
                    </th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-neutral-500">
                      Type
                    </th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-neutral-500">
                      Size
                    </th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-neutral-500">
                      Uploaded
                    </th>
                    <th className="w-12"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                  {filteredMedia.map((item) => {
                    const Icon = typeIcons[item.type as keyof typeof typeIcons];
                    const colorClass = typeColors[item.type as keyof typeof typeColors];

                    return (
                      <tr
                        key={item.id}
                        onClick={() => setSelectedItem(item.id)}
                        className={cn(
                          'cursor-pointer transition-colors',
                          selectedItem === item.id
                            ? 'bg-primary-50 dark:bg-primary-900/20'
                            : 'hover:bg-neutral-50 dark:hover:bg-neutral-800/50'
                        )}
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div
                              className={cn(
                                'w-10 h-10 rounded-lg flex items-center justify-center',
                                colorClass
                              )}
                            >
                              <Icon className="w-5 h-5" />
                            </div>
                            <span className="font-medium text-neutral-900 dark:text-white">
                              {item.name}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-sm text-neutral-600 dark:text-neutral-400 capitalize">
                            {item.type}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-sm text-neutral-600 dark:text-neutral-400">
                            {item.size}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-sm text-neutral-500">
                            {item.uploadedAt}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <button className="p-1.5 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded">
                            <MoreHorizontal className="w-4 h-4 text-neutral-400" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Details Panel */}
        {selectedMedia && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="hidden lg:block w-80 bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden"
          >
            {/* Preview */}
            <div className="aspect-video bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
              {selectedMedia.type === 'image' ? (
                <div className="w-full h-full bg-gradient-to-br from-neutral-200 to-neutral-300 dark:from-neutral-700 dark:to-neutral-800" />
              ) : (
                (() => {
                  const Icon = typeIcons[selectedMedia.type as keyof typeof typeIcons];
                  return <Icon className="w-16 h-16 text-neutral-400" />;
                })()
              )}
            </div>

            {/* Details */}
            <div className="p-4 space-y-4">
              <div className="flex items-start justify-between">
                <h3 className="font-semibold text-neutral-900 dark:text-white break-all pr-2">
                  {selectedMedia.name}
                </h3>
                <button
                  onClick={() => setSelectedItem(null)}
                  className="p-1 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded"
                >
                  <X className="w-4 h-4 text-neutral-400" />
                </button>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-neutral-500">Type</span>
                  <span className="text-neutral-900 dark:text-white capitalize">
                    {selectedMedia.type}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Size</span>
                  <span className="text-neutral-900 dark:text-white">
                    {selectedMedia.size}
                  </span>
                </div>
                {selectedMedia.dimensions && (
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Dimensions</span>
                    <span className="text-neutral-900 dark:text-white">
                      {selectedMedia.dimensions}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-neutral-500">Uploaded</span>
                  <span className="text-neutral-900 dark:text-white">
                    {selectedMedia.uploadedAt}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800 space-y-2">
                <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-medium rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors">
                  <Copy className="w-4 h-4" />
                  Copy URL
                </button>
                <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-medium rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors">
                  <Download className="w-4 h-4" />
                  Download
                </button>
                <button className="w-full flex items-center justify-center gap-2 px-4 py-2 text-red-600 dark:text-red-400 font-medium rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
