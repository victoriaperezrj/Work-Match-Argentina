'use client';

import { useEffect, useState } from 'react';
import { create } from 'zustand';

// Toast types
type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

// Toast store
interface ToastState {
  toasts: Toast[];
  addToast: (message: string, type?: ToastType, duration?: number) => void;
  removeToast: (id: string) => void;
}

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  addToast: (message, type = 'success', duration = 4000) => {
    const id = `toast-${Date.now()}`;
    set((state) => ({
      toasts: [...state.toasts, { id, message, type, duration }],
    }));
    // Auto remove after duration
    setTimeout(() => {
      set((state) => ({
        toasts: state.toasts.filter((t) => t.id !== id),
      }));
    }, duration);
  },
  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),
}));

// Toast component
function ToastItem({ toast, onClose }: { toast: Toast; onClose: () => void }) {
  const [isExiting, setIsExiting] = useState(false);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(onClose, 200);
  };

  const typeStyles: Record<ToastType, { bg: string; icon: string; iconColor: string }> = {
    success: {
      bg: 'bg-emerald-50 dark:bg-emerald-500/20 border-emerald-200 dark:border-emerald-500/30',
      icon: 'M20 6 9 17l-5-5',
      iconColor: 'text-emerald-600 dark:text-emerald-400',
    },
    error: {
      bg: 'bg-red-50 dark:bg-red-500/20 border-red-200 dark:border-red-500/30',
      icon: 'M18 6 6 18M6 6 18 18',
      iconColor: 'text-red-600 dark:text-red-400',
    },
    warning: {
      bg: 'bg-amber-50 dark:bg-amber-500/20 border-amber-200 dark:border-amber-500/30',
      icon: 'M12 9v4M12 17h.01M21.73 18l-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z',
      iconColor: 'text-amber-600 dark:text-amber-400',
    },
    info: {
      bg: 'bg-blue-50 dark:bg-blue-500/20 border-blue-200 dark:border-blue-500/30',
      icon: 'M12 8v4M12 16h.01M22 12c0 5.52-4.48 10-10 10S2 17.52 2 12 6.48 2 12 2s10 4.48 10 10Z',
      iconColor: 'text-blue-600 dark:text-blue-400',
    },
  };

  const styles = typeStyles[toast.type];

  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg backdrop-blur-sm transition-all duration-200 ${styles.bg} ${
        isExiting ? 'opacity-0 translate-x-4' : 'animate-slideIn'
      }`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={styles.iconColor}
      >
        <path d={styles.icon} />
      </svg>
      <p className="flex-1 text-sm font-medium text-adaptive-primary">{toast.message}</p>
      <button
        onClick={handleClose}
        className="text-adaptive-muted hover:text-adaptive-primary transition-colors"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M18 6 6 18" />
          <path d="m6 6 12 12" />
        </svg>
      </button>
    </div>
  );
}

// Toast container
export function ToastContainer() {
  const { toasts, removeToast } = useToastStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
      ))}
    </div>
  );
}

// Hook for easy toast usage
export function useToast() {
  const addToast = useToastStore((state) => state.addToast);

  return {
    success: (message: string) => addToast(message, 'success'),
    error: (message: string) => addToast(message, 'error'),
    warning: (message: string) => addToast(message, 'warning'),
    info: (message: string) => addToast(message, 'info'),
  };
}
