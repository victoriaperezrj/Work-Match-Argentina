'use client';

import { useEffect } from 'react';
import { ServiceRequest } from '@/lib/stores/requests-store';
import { getLocationDisplayName } from '@/lib/constants/locations';
import { formatRelativeTime, formatDate } from '@/lib/utils/time';

interface RequestDetailsModalProps {
  isOpen: boolean;
  request: ServiceRequest | null;
  onClose: () => void;
  onAction?: () => void;
  actionLabel?: string;
  actionVariant?: 'primary' | 'secondary' | 'danger';
  userType: 'demandante' | 'proveedor';
}

export function RequestDetailsModal({
  isOpen,
  request,
  onClose,
  onAction,
  actionLabel,
  actionVariant = 'primary',
  userType,
}: RequestDetailsModalProps) {
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

  if (!isOpen || !request) return null;

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      Pendiente: 'badge-pending',
      Asignado: 'badge-assigned',
      Completado: 'badge-completed',
      Cancelado: 'badge-cancelled',
    };

    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${styles[status] || 'bg-gray-100 dark:bg-gray-500/20 text-gray-800 dark:text-gray-300'}`}>
        {status}
      </span>
    );
  };

  const actionButtonClass = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    danger: 'btn-danger',
  }[actionVariant];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fadeIn"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative glass p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto animate-slideUp">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-adaptive-muted hover:text-adaptive-primary transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6 6 18"/>
            <path d="m6 6 12 12"/>
          </svg>
        </button>

        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-3">
            <h2 className="text-xl font-bold text-adaptive-primary">{request.service_type}</h2>
            {getStatusBadge(request.status)}
          </div>
          <p className="text-adaptive-secondary">{request.description}</p>
        </div>

        {/* Details Grid */}
        <div className="grid gap-4 mb-6">
          <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/60">
            <div className="flex items-center gap-3 mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-adaptive-muted">
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
              <span className="text-sm text-adaptive-muted">Ubicación</span>
            </div>
            <p className="font-medium text-adaptive-primary ml-7">
              {getLocationDisplayName(request.location_id)}
            </p>
          </div>

          {request.price_quoted && (
            <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/60">
              <div className="flex items-center gap-3 mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-adaptive-muted">
                  <line x1="12" x2="12" y1="2" y2="22"/>
                  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                </svg>
                <span className="text-sm text-adaptive-muted">
                  {userType === 'demandante' ? 'Presupuesto Estimado' : 'Precio Ofrecido'}
                </span>
              </div>
              <p className="font-medium text-emerald-600 dark:text-emerald-400 ml-7">
                ${request.price_quoted.toLocaleString('es-AR')} ARS
              </p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/60">
              <div className="flex items-center gap-3 mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-adaptive-muted">
                  <rect width="18" height="18" x="3" y="4" rx="2" ry="2"/>
                  <line x1="16" x2="16" y1="2" y2="6"/>
                  <line x1="8" x2="8" y1="2" y2="6"/>
                  <line x1="3" x2="21" y1="10" y2="10"/>
                </svg>
                <span className="text-sm text-adaptive-muted">Creado</span>
              </div>
              <p className="font-medium text-adaptive-primary ml-7 text-sm">
                {formatDate(request.created_at)}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/60">
              <div className="flex items-center gap-3 mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-adaptive-muted">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12 6 12 12 16 14"/>
                </svg>
                <span className="text-sm text-adaptive-muted">Actualizado</span>
              </div>
              <p className="font-medium text-adaptive-primary ml-7 text-sm">
                {formatRelativeTime(request.updated_at)}
              </p>
            </div>
          </div>

          {request.provider_id && userType === 'demandante' && (
            <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/30">
              <div className="flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600 dark:text-cyan-400">
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
                <span className="text-sm font-medium text-blue-700 dark:text-cyan-300">
                  Proveedor asignado
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="btn-ghost flex-1"
          >
            Cerrar
          </button>
          {onAction && actionLabel && (
            <button
              onClick={onAction}
              className={`${actionButtonClass} flex-1`}
            >
              {actionLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
