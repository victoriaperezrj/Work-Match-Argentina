'use client';

import { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  size?: 'sm' | 'md' | 'lg';
  pulse?: boolean;
}

export function Badge({
  children,
  variant = 'default',
  size = 'md',
  pulse = false,
}: BadgeProps) {
  const variantStyles = {
    default: 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300',
    success: 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300',
    warning: 'bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300',
    danger: 'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-300',
    info: 'bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300',
  };

  const sizeStyles = {
    sm: 'px-1.5 py-0.5 text-xs',
    md: 'px-2 py-0.5 text-sm',
    lg: 'px-3 py-1 text-base',
  };

  return (
    <span
      className={`
        inline-flex items-center font-medium rounded-full
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${pulse ? 'animate-pulse' : ''}
      `}
    >
      {children}
    </span>
  );
}

// Notification dot badge (for icons)
interface NotificationDotProps {
  count?: number;
  show?: boolean;
  variant?: 'default' | 'danger';
}

export function NotificationDot({
  count,
  show = true,
  variant = 'danger',
}: NotificationDotProps) {
  if (!show) return null;

  const variantStyles = {
    default: 'bg-gray-500',
    danger: 'bg-red-500',
  };

  if (count !== undefined && count > 0) {
    return (
      <span
        className={`
          absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1
          flex items-center justify-center
          text-[10px] font-bold text-white rounded-full
          ${variantStyles[variant]}
        `}
      >
        {count > 99 ? '99+' : count}
      </span>
    );
  }

  return (
    <span
      className={`
        absolute top-0 right-0 w-2 h-2 rounded-full
        ${variantStyles[variant]}
      `}
    />
  );
}
