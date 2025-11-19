'use client';

import { ReactNode } from 'react';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="glass p-12 text-center animate-slideUp">
      {icon && (
        <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-gray-800/50 flex items-center justify-center mx-auto mb-4">
          <div className="text-gray-400 dark:text-gray-500">
            {icon}
          </div>
        </div>
      )}
      <h3 className="text-lg font-semibold text-adaptive-primary mb-2">
        {title}
      </h3>
      {description && (
        <p className="text-adaptive-secondary mb-6">
          {description}
        </p>
      )}
      {action}
    </div>
  );
}

// Pre-built empty state variants
export function NoResultsState({
  searchQuery,
  onClear,
}: {
  searchQuery: string;
  onClear: () => void;
}) {
  return (
    <EmptyState
      icon={
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"/>
          <path d="m21 21-4.3-4.3"/>
        </svg>
      }
      title={`No se encontraron resultados para "${searchQuery}"`}
      description="Intenta con otros términos de búsqueda"
      action={
        <button onClick={onClear} className="btn-ghost inline-flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6 6 18"/>
            <path d="m6 6 12 12"/>
          </svg>
          Limpiar búsqueda
        </button>
      }
    />
  );
}

export function NoDataState({
  title = 'No hay datos',
  description = 'Aún no hay información para mostrar',
  action,
}: {
  title?: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <EmptyState
      icon={
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect width="18" height="18" x="3" y="3" rx="2"/>
          <path d="M8 12h8"/>
        </svg>
      }
      title={title}
      description={description}
      action={action}
    />
  );
}
