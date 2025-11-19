'use client';

import { useEffect } from 'react';

interface ShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
  shortcuts: Array<{
    key: string;
    description: string;
  }>;
}

export function ShortcutsModal({ isOpen, onClose, shortcuts }: ShortcutsModalProps) {
  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fadeIn"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="relative glass p-6 max-w-md w-full animate-slideUp"
        role="dialog"
        aria-labelledby="shortcuts-modal-title"
        aria-describedby="shortcuts-modal-description"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-adaptive-muted hover:text-adaptive-primary transition-colors"
          aria-label="Cerrar modal de atajos"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6 6 18"/>
            <path d="m6 6 12 12"/>
          </svg>
        </button>

        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="20" height="8" x="2" y="14" rx="2"/>
                <path d="M6 18h.01"/>
                <path d="M10 18h.01"/>
                <path d="M14 18h.01"/>
                <path d="M18 18h.01"/>
                <path d="M6 2v4"/>
                <path d="M10 2v4"/>
                <path d="M14 2v4"/>
                <path d="M18 2v4"/>
              </svg>
            </div>
            <h2 id="shortcuts-modal-title" className="text-xl font-bold text-adaptive-primary">Atajos de Teclado</h2>
          </div>
          <p id="shortcuts-modal-description" className="text-sm text-adaptive-secondary">
            Usa estos atajos para navegar más rápido
          </p>
        </div>

        {/* Shortcuts List */}
        <div className="space-y-2 mb-6">
          {shortcuts.map((shortcut, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800/60"
            >
              <span className="text-sm text-adaptive-secondary">{shortcut.description}</span>
              <kbd className="px-2 py-1 rounded bg-gray-200 dark:bg-gray-700 text-xs font-mono text-adaptive-primary">
                {shortcut.key}
              </kbd>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-xs text-adaptive-muted">
            Presiona <kbd className="px-1.5 py-0.5 rounded bg-gray-200 dark:bg-gray-700 text-xs font-mono">?</kbd> en cualquier momento para ver este menú
          </p>
        </div>
      </div>
    </div>
  );
}
