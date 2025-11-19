'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getLocationDisplayName } from '@/lib/constants/locations';
import { useAuthStore, useRequestsStore } from '@/lib/stores';
import { RoleSwitcher } from '@/components/role-switcher';
import { ConfirmDialog } from '@/components/confirm-dialog';

export default function DemandanteDashboard() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const { requests, updateRequest } = useRequestsStore();
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'assigned' | 'completed' | 'cancelled'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'price-high' | 'price-low'>('newest');
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [requestToCancel, setRequestToCancel] = useState<string | null>(null);

  const handleCancelClick = (requestId: string) => {
    setRequestToCancel(requestId);
    setCancelDialogOpen(true);
  };

  const handleConfirmCancel = () => {
    if (requestToCancel) {
      updateRequest(requestToCancel, {
        status: 'Cancelado',
      });
    }
    setCancelDialogOpen(false);
    setRequestToCancel(null);
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  // Filter requests for current user (in mock mode, show all)
  const myRequests = user
    ? requests.filter(r => r.demandante_id === user.id || r.demandante_id.startsWith('mock'))
    : requests;

  // Calculate total spent on completed requests
  const completedRequests = myRequests.filter(r => r.status === 'Completado');
  const totalSpent = completedRequests.reduce((sum, req) => sum + (req.price_quoted || 0), 0);

  const stats = [
    {
      label: 'Total',
      value: myRequests.length,
      color: 'from-blue-600 to-cyan-500',
      textColor: 'text-blue-600 dark:text-cyan-400',
    },
    {
      label: 'En Progreso',
      value: myRequests.filter(r => r.status === 'Asignado').length,
      color: 'from-emerald-600 to-green-500',
      textColor: 'text-emerald-600 dark:text-emerald-400',
    },
    {
      label: 'Invertido',
      value: `$${totalSpent.toLocaleString('es-AR')}`,
      color: 'from-purple-600 to-pink-500',
      textColor: 'text-purple-600 dark:text-purple-400',
    },
  ];

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

  const filteredRequests = myRequests
    .filter((request) => {
      if (activeTab === 'all') return true;
      if (activeTab === 'pending') return request.status === 'Pendiente';
      if (activeTab === 'assigned') return request.status === 'Asignado';
      if (activeTab === 'completed') return request.status === 'Completado';
      if (activeTab === 'cancelled') return request.status === 'Cancelado';
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'oldest':
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case 'price-high':
          return (b.price_quoted || 0) - (a.price_quoted || 0);
        case 'price-low':
          return (a.price_quoted || 0) - (b.price_quoted || 0);
        default:
          return 0;
      }
    });

  const tabs = [
    { id: 'all', label: 'Todas', count: myRequests.length },
    { id: 'pending', label: 'Pendientes', count: myRequests.filter(r => r.status === 'Pendiente').length },
    { id: 'assigned', label: 'Asignadas', count: myRequests.filter(r => r.status === 'Asignado').length },
    { id: 'completed', label: 'Completadas', count: myRequests.filter(r => r.status === 'Completado').length },
    { id: 'cancelled', label: 'Canceladas', count: myRequests.filter(r => r.status === 'Cancelado').length },
  ];

  return (
    <div className="min-h-screen">
      {/* Premium Navigation - Mobile Optimized */}
      <nav className="glass border-b border-gray-200 dark:border-gray-700/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-3 sm:py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center shadow-lg flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
              </div>
              <div className="min-w-0">
                <h1 className="text-lg sm:text-xl font-bold text-adaptive-primary truncate">WorkMatch</h1>
                <p className="text-xs text-blue-600 dark:text-cyan-400">Demandante</p>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              <RoleSwitcher />
              <span className="text-sm text-adaptive-muted hidden md:block truncate max-w-[150px]">
                {user?.email || 'usuario@ejemplo.com'}
              </span>
              <button
                onClick={handleLogout}
                className="btn-ghost text-xs sm:text-sm px-2 sm:px-4 py-2"
              >
                <span className="hidden sm:inline">Cerrar Sesión</span>
                <span className="sm:hidden">Salir</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-6 sm:py-8">
        {/* Header - Mobile Stacked */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 sm:mb-8 animate-slideUp">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-adaptive-primary mb-1 sm:mb-2">
              Hola, {user?.full_name?.split(' ')[0] || 'Usuario'}
            </h2>
            <p className="text-sm sm:text-base text-adaptive-secondary">Gestiona tus solicitudes de servicio</p>
          </div>
          <Link href="/demandante/new-request" className="btn-primary flex items-center justify-center gap-2 w-full sm:w-auto">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5v14"/>
              <path d="M5 12h14"/>
            </svg>
            Nueva Solicitud
          </Link>
        </div>

        {/* Stats - Mobile Grid */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-6 sm:mb-8">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className="glass p-3 sm:p-6 text-center animate-slideUp"
              style={{ animationDelay: `${0.1 + index * 0.05}s` }}
            >
              <div className={`inline-flex w-8 h-8 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br ${stat.color} items-center justify-center mb-2 sm:mb-3 shadow-lg`}>
                {index === 0 && (
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" className="sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="18" height="18" x="3" y="3" rx="2"/>
                    <path d="M3 9h18"/>
                    <path d="M9 21V9"/>
                  </svg>
                )}
                {index === 1 && (
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" className="sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2v4"/>
                    <path d="m16.24 7.76-2.12 2.12"/>
                    <path d="M18 12h4"/>
                    <path d="m16.24 16.24-2.12-2.12"/>
                    <path d="M12 18v4"/>
                    <path d="m7.76 16.24 2.12-2.12"/>
                    <path d="M2 12h4"/>
                    <path d="m7.76 7.76 2.12 2.12"/>
                  </svg>
                )}
                {index === 2 && (
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" className="sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" x2="12" y1="2" y2="22"/>
                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                  </svg>
                )}
              </div>
              <p className={`text-xl sm:text-3xl font-bold ${stat.textColor} mb-0.5 sm:mb-1`}>{stat.value}</p>
              <p className="text-xs sm:text-sm text-adaptive-muted">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs and Sort - Mobile Optimized */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
          <div className="flex gap-2 overflow-x-auto pb-2 -mx-3 px-3 sm:mx-0 sm:px-0 animate-slideUp" style={{ animationDelay: '0.1s' }}>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl text-sm sm:text-base font-medium whitespace-nowrap transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg'
                    : 'glass text-adaptive-secondary hover:text-blue-600 dark:hover:text-cyan-300'
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2 animate-slideUp" style={{ animationDelay: '0.15s' }}>
            <label className="text-xs sm:text-sm text-adaptive-muted whitespace-nowrap">Ordenar:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 rounded-lg text-xs sm:text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700/50 text-adaptive-primary focus:border-blue-400 dark:focus:border-cyan-400 focus:ring-1 focus:ring-blue-400/20 dark:focus:ring-cyan-400/20 outline-none transition-all"
            >
              <option value="newest">Más recientes</option>
              <option value="oldest">Más antiguas</option>
              <option value="price-high">Mayor precio</option>
              <option value="price-low">Menor precio</option>
            </select>
          </div>
        </div>

        {filteredRequests.length === 0 ? (
          <div className="glass p-12 text-center animate-slideUp" style={{ animationDelay: '0.2s' }}>
            <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-gray-800/50 flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 dark:text-gray-500">
                <rect width="18" height="18" x="3" y="3" rx="2"/>
                <path d="M8 12h8"/>
              </svg>
            </div>
            <p className="text-adaptive-secondary mb-6">No tienes solicitudes en esta categoría</p>
            <Link href="/demandante/new-request" className="btn-primary inline-flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 5v14"/>
                <path d="M5 12h14"/>
              </svg>
              Crear tu primera solicitud
            </Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredRequests.map((request, index) => (
              <div
                key={request.id}
                className="glass glass-hover p-6 animate-slideUp"
                style={{ animationDelay: `${0.1 + index * 0.05}s` }}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold text-adaptive-primary">{request.service_type}</h3>
                      {getStatusBadge(request.status)}
                    </div>
                    <p className="text-adaptive-secondary">{request.description}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 text-sm mb-4">
                  <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800/60">
                    <p className="text-adaptive-muted text-xs mb-1">Ubicación</p>
                    <p className="font-medium text-adaptive-secondary truncate">
                      {getLocationDisplayName(request.location_id)}
                    </p>
                  </div>
                  {request.price_quoted && (
                    <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800/60">
                      <p className="text-adaptive-muted text-xs mb-1">Precio Estimado</p>
                      <p className="font-medium text-emerald-600 dark:text-emerald-400">
                        ${request.price_quoted.toLocaleString('es-AR')} ARS
                      </p>
                    </div>
                  )}
                  <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800/60">
                    <p className="text-adaptive-muted text-xs mb-1">Fecha</p>
                    <p className="font-medium text-adaptive-secondary">
                      {new Date(request.created_at).toLocaleDateString('es-AR')}
                    </p>
                  </div>
                  {request.provider_id && (
                    <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800/60">
                      <p className="text-adaptive-muted text-xs mb-1">Proveedor</p>
                      <p className="font-medium text-blue-600 dark:text-cyan-400">Asignado</p>
                    </div>
                  )}
                </div>

                {/* Cancel button for pending requests */}
                {request.status === 'Pendiente' && (
                  <button
                    onClick={() => handleCancelClick(request.id)}
                    className="btn-danger text-sm flex items-center gap-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 6 6 18"/>
                      <path d="m6 6 12 12"/>
                    </svg>
                    Cancelar Solicitud
                  </button>
                )}

                {request.status === 'Completado' && (
                  <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-medium text-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6 9 17l-5-5"/>
                    </svg>
                    Trabajo Completado
                  </div>
                )}

                {request.status === 'Cancelado' && (
                  <div className="flex items-center gap-2 text-red-600 dark:text-red-400 font-medium text-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 6 6 18"/>
                      <path d="m6 6 12 12"/>
                    </svg>
                    Solicitud Cancelada
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={cancelDialogOpen}
        title="Cancelar Solicitud"
        message="¿Estás seguro que deseas cancelar esta solicitud? Esta acción no se puede deshacer."
        confirmText="Sí, cancelar"
        cancelText="No, mantener"
        variant="danger"
        onConfirm={handleConfirmCancel}
        onCancel={() => setCancelDialogOpen(false)}
      />
    </div>
  );
}
