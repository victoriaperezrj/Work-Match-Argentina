'use client';

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse bg-gray-200 dark:bg-gray-700/50 rounded ${className}`}
    />
  );
}

export function RequestCardSkeleton() {
  return (
    <div className="glass p-6 animate-pulse">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700/50 rounded" />
            <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700/50 rounded-full" />
          </div>
          <div className="h-4 w-full bg-gray-200 dark:bg-gray-700/50 rounded mb-2" />
          <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700/50 rounded" />
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 mb-4 sm:mb-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="p-2.5 sm:p-3 rounded-lg bg-gray-50 dark:bg-gray-800/60">
            <div className="h-3 w-16 bg-gray-200 dark:bg-gray-700/50 rounded mb-2" />
            <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700/50 rounded" />
          </div>
        ))}
      </div>

      <div className="h-10 w-full bg-gray-200 dark:bg-gray-700/50 rounded-xl" />
    </div>
  );
}

export function StatsCardSkeleton() {
  return (
    <div className="glass p-3 sm:p-6 text-center animate-pulse">
      <div className="inline-flex w-8 h-8 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gray-200 dark:bg-gray-700/50 mb-2 sm:mb-3" />
      <div className="h-6 sm:h-8 w-16 bg-gray-200 dark:bg-gray-700/50 rounded mx-auto mb-1" />
      <div className="h-3 sm:h-4 w-20 bg-gray-200 dark:bg-gray-700/50 rounded mx-auto" />
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 py-6 sm:py-8">
      {/* Header */}
      <div className="mb-6 sm:mb-8 animate-pulse">
        <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700/50 rounded mb-2" />
        <div className="h-4 w-64 bg-gray-200 dark:bg-gray-700/50 rounded" />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-6 sm:mb-8">
        <StatsCardSkeleton />
        <StatsCardSkeleton />
        <StatsCardSkeleton />
      </div>

      {/* Search Bar */}
      <div className="mb-4 animate-pulse">
        <div className="h-12 w-full bg-gray-200 dark:bg-gray-700/50 rounded-xl" />
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 sm:mb-8 animate-pulse">
        <div className="h-10 w-32 bg-gray-200 dark:bg-gray-700/50 rounded-xl" />
        <div className="h-10 w-32 bg-gray-200 dark:bg-gray-700/50 rounded-xl" />
        <div className="h-10 w-32 bg-gray-200 dark:bg-gray-700/50 rounded-xl" />
      </div>

      {/* Request Cards */}
      <div className="grid gap-4">
        <RequestCardSkeleton />
        <RequestCardSkeleton />
        <RequestCardSkeleton />
      </div>
    </div>
  );
}
