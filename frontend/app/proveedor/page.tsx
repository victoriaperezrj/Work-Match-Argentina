'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getLocationDisplayName } from '@/lib/constants/locations';
import { useAuthStore, useRequestsStore } from '@/lib/stores';
import { RoleSwitcher } from '@/components/role-switcher';
import { ConfirmDialog } from '@/components/confirm-dialog';
import { useToast } from '@/components/toast';
import { RequestDetailsModal } from '@/components/request-details-modal';
import { DashboardSkeleton } from '@/components/skeleton';
import { ServiceRequest } from '@/lib/stores/requests-store';

export default function ProveedorDashboard() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const { requests, updateRequest } = useRequestsStore();
  const toast = useToast();
  const [activeTab, setActiveTab] = useState<'available' | 'myJobs'>('available');
  const [serviceFilter, setServiceFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [acceptDialogOpen, setAcceptDialogOpen] = useState(false);
  const [completeDialogOpen, setCompleteDialogOpen] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null);
  const [mounted, setMounted] = useState(false);

  // Handle hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  // Get pending requests (available jobs for providers)
  const pendingRequests = requests.filter(r => r.status === 'Pendiente');

  // Search filter helper
  const matchesSearch = (request: typeof requests[0]) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    const matchesDescription = request.description.toLowerCase().includes(query);
    const matchesServiceType = request.service_type.toLowerCase().includes(query);
    const matchesLocation = getLocationDisplayName(request.location_id).toLowerCase().includes(query);
    return matchesDescription || matchesServiceType || matchesLocation;
  };

  // Filter by service type and search
  const filteredPendingRequests = pendingRequests
    .filter(r => serviceFilter === 'all' || r.service_type === serviceFilter)
    .filter(matchesSearch);

  // Get unique service types from pending requests
  const availableServiceTypes = Array.from(new Set(pendingRequests.map(r => r.service_type))).sort();

  // Get jobs accepted by this provider
  const acceptedJobs = requests.filter(r => r.provider_id === user?.id || (user?.id === 'mock-user-1' && r.provider_id === 'provider-1'));

  // Filter accepted jobs by search
  const filteredAcceptedJobs = acceptedJobs.filter(matchesSearch);

  // Calculate total earnings from completed jobs
  const completedJobs = acceptedJobs.filter(r => r.status === 'Completado');
  const totalEarnings = completedJobs.reduce((sum, job) => sum + (job.price_quoted || 0), 0);

  const handleAcceptClick = (requestId: string) => {
    setSelectedJobId(requestId);
    setAcceptDialogOpen(true);
  };

  const handleConfirmAccept = () => {
    if (selectedJobId) {
      updateRequest(selectedJobId, {
        status: 'Asignado',
        provider_id: user?.id || 'mock-provider',
      });
      toast.success('Trabajo aceptado correctamente');
    }
    setAcceptDialogOpen(false);
    setSelectedJobId(null);
  };

  const handleCompleteClick = (requestId: string) => {
    setSelectedJobId(requestId);
    setCompleteDialogOpen(true);
  };

  const handleConfirmComplete = () => {
    if (selectedJobId) {
      updateRequest(selectedJobId, {
        status: 'Completado',
      });
      toast.success('Trabajo marcado como completado');
    }
    setCompleteDialogOpen(false);
    setSelectedJobId(null);
  };

  const handleViewDetails = (request: ServiceRequest) => {
    setSelectedRequest(request);
    setDetailsModalOpen(true);
  };

  const handleModalAction = () => {
    if (selectedRequest) {
      if (selectedRequest.status === 'Pendiente') {
        handleAcceptClick(selectedRequest.id);
      } else if (selectedRequest.status === 'Asignado') {
        handleCompleteClick(selectedRequest.id);
      }
      setDetailsModalOpen(false);
    }
  };

  const tabs = [
    { id: 'available', label: 'Disponibles', count: filteredPendingRequests.length },
    { id: 'myJobs', label: 'Mis Trabajos', count: filteredAcceptedJobs.length },
  ];

  const stats = [
    {
      label: 'Disponibles',
      value: pendingRequests.length,
      color: 'from-blue-600 to-cyan-500',
      textColor: 'text-blue-600 dark:text-cyan-400',
    },
    {
      label: 'Mis Trabajos',
      value: acceptedJobs.length,
      color: 'from-emerald-600 to-green-500',
      textColor: 'text-emerald-600 dark:text-emerald-400',
    },
    {
      label: 'Ganancias',
      value: `$${totalEarnings.toLocaleString('es-AR')}`,
      color: 'from-amber-600 to-yellow-500',
      textColor: 'text-amber-600 dark:text-amber-400',
    },
  ];

  // Show skeleton during hydration
  if (!mounted) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="min-h-screen">
      {/* Premium Navigation - Mobile Optimized */}
      <nav className="glass border-b border-gray-200 dark:border-gray-700/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-3 sm:py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-green-500 flex items-center justify-center shadow-lg flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
                </svg>
              </div>
              <div className="min-w-0">
                <h1 className="text-lg sm:text-xl font-bold text-adaptive-primary truncate">WorkMatch</h1>
                <p className="text-xs text-emerald-600 dark:text-emerald-400">Proveedor</p>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              <RoleSwitcher />
              <Link href="/proveedor/profile" className="btn-ghost text-xs sm:text-sm px-2 sm:px-4 py-2">
                <span className="hidden sm:inline">Mi Perfil</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="sm:hidden">
                  <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
              </Link>
              <span className="text-sm text-adaptive-muted hidden lg:block truncate max-w-[150px]">
                {user?.email || 'usuario@ejemplo.com'}
              </span>
              <button
                onClick={handleLogout}
                className="btn-ghost text-xs sm:text-sm px-2 sm:px-4 py-2"
              >
                Salir
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-6 sm:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8 animate-slideUp">
          <h2 className="text-2xl sm:text-3xl font-bold text-adaptive-primary mb-1 sm:mb-2">
            Hola, {user?.full_name?.split(' ')[0] || 'Proveedor'}
          </h2>
          <p className="text-sm sm:text-base text-adaptive-secondary">Gestiona tus trabajos y encuentra nuevas oportunidades</p>
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
                    <path d="M20 6 9 17l-5-5"/>
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

        {/* Search Bar */}
        <div className="mb-4 animate-slideUp" style={{ animationDelay: '0.15s' }}>
          <div className="relative">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3 top-1/2 -translate-y-1/2 text-adaptive-muted">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.3-4.3"/>
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por descripción, servicio o ubicación..."
              className="w-full pl-10 pr-4 py-3 rounded-xl text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700/50 text-adaptive-primary placeholder:text-adaptive-muted focus:border-emerald-400 dark:focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/20 dark:focus:ring-emerald-400/20 outline-none transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-adaptive-muted hover:text-adaptive-primary"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6 6 18"/>
                  <path d="m6 6 12 12"/>
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 sm:mb-8 overflow-x-auto pb-2 -mx-3 px-3 sm:mx-0 sm:px-0 animate-slideUp" style={{ animationDelay: '0.2s' }}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl text-sm sm:text-base font-medium whitespace-nowrap transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-emerald-600 to-green-500 text-white shadow-lg'
                  : 'glass text-adaptive-secondary hover:text-emerald-600 dark:hover:text-emerald-300'
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>

        {/* Available Jobs Tab */}
        {activeTab === 'available' && (
          <>
            {/* Service Filter */}
            {pendingRequests.length > 0 && (
              <div className="mb-4 sm:mb-6 animate-slideUp" style={{ animationDelay: '0.2s' }}>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setServiceFilter('all')}
                    className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 ${
                      serviceFilter === 'all'
                        ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-400/50'
                        : 'bg-gray-100 dark:bg-gray-800/50 text-adaptive-secondary border border-gray-200 dark:border-gray-700/50 hover:border-emerald-300 dark:hover:border-emerald-400/30'
                    }`}
                  >
                    Todos ({pendingRequests.length})
                  </button>
                  {availableServiceTypes.map((service) => (
                    <button
                      key={service}
                      onClick={() => setServiceFilter(service)}
                      className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 ${
                        serviceFilter === service
                          ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-400/50'
                          : 'bg-gray-100 dark:bg-gray-800/50 text-adaptive-secondary border border-gray-200 dark:border-gray-700/50 hover:border-emerald-300 dark:hover:border-emerald-400/30'
                      }`}
                    >
                      {service} ({pendingRequests.filter(r => r.service_type === service).length})
                    </button>
                  ))}
                </div>
              </div>
            )}

            {filteredPendingRequests.length === 0 ? (
          <div className="glass p-12 text-center animate-slideUp" style={{ animationDelay: '0.2s' }}>
            <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-gray-800/50 flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 dark:text-gray-500">
                <circle cx="11" cy="11" r="8"/>
                <path d="m21 21-4.3-4.3"/>
              </svg>
            </div>
            {searchQuery ? (
              <>
                <p className="text-adaptive-secondary mb-2">No se encontraron trabajos para "{searchQuery}"</p>
                <p className="text-sm text-adaptive-muted mb-6">Intenta con otros términos de búsqueda</p>
                <button
                  onClick={() => setSearchQuery('')}
                  className="btn-ghost inline-flex items-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 6 6 18"/>
                    <path d="m6 6 12 12"/>
                  </svg>
                  Limpiar búsqueda
                </button>
              </>
            ) : (
              <>
                <p className="text-adaptive-secondary mb-6">
                  {serviceFilter !== 'all'
                    ? `No hay trabajos de ${serviceFilter} disponibles`
                    : 'No hay trabajos pendientes que coincidan con tu perfil'}
                </p>
                <Link href="/proveedor/profile" className="btn-secondary inline-flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                  Configurar mi perfil
                </Link>
              </>
            )}
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredPendingRequests.map((request, index) => (
              <div
                key={request.id}
                className="glass glass-hover p-6 animate-slideUp cursor-pointer"
                style={{ animationDelay: `${0.2 + index * 0.05}s` }}
                onClick={() => handleViewDetails(request)}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold text-adaptive-primary">{request.service_type}</h3>
                      <span className="px-3 py-1 rounded-full text-sm font-medium badge-pending">
                        Pendiente
                      </span>
                    </div>
                    <p className="text-adaptive-secondary">{request.description}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 text-sm mb-4 sm:mb-6">
                  <div className="p-2.5 sm:p-3 rounded-lg bg-gray-50 dark:bg-gray-800/60">
                    <p className="text-adaptive-muted text-xs mb-0.5 sm:mb-1">Ubicación</p>
                    <p className="font-medium text-adaptive-secondary text-xs sm:text-sm truncate">
                      {getLocationDisplayName(request.location_id)}
                    </p>
                  </div>
                  {request.price_quoted && (
                    <div className="p-2.5 sm:p-3 rounded-lg bg-gray-50 dark:bg-gray-800/60">
                      <p className="text-adaptive-muted text-xs mb-0.5 sm:mb-1">Precio</p>
                      <p className="font-medium text-emerald-600 dark:text-emerald-400 text-xs sm:text-sm">
                        ${request.price_quoted.toLocaleString('es-AR')}
                      </p>
                    </div>
                  )}
                  <div className="p-2.5 sm:p-3 rounded-lg bg-gray-50 dark:bg-gray-800/60">
                    <p className="text-adaptive-muted text-xs mb-0.5 sm:mb-1">Publicado</p>
                    <p className="font-medium text-adaptive-secondary text-xs sm:text-sm">
                      {new Date(request.created_at).toLocaleDateString('es-AR')}
                    </p>
                  </div>
                  <div className="p-2.5 sm:p-3 rounded-lg bg-gray-50 dark:bg-gray-800/60">
                    <p className="text-adaptive-muted text-xs mb-0.5 sm:mb-1">Distancia</p>
                    <p className="font-medium text-blue-600 dark:text-cyan-400 text-xs sm:text-sm">{(Math.random() * 10 + 1).toFixed(1)} km</p>
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAcceptClick(request.id);
                  }}
                  className="btn-secondary w-full flex items-center justify-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6 9 17l-5-5"/>
                  </svg>
                  Aceptar Trabajo
                </button>
              </div>
            ))}
          </div>
        )}
          </>
        )}

        {/* My Jobs Tab */}
        {activeTab === 'myJobs' && (
          <>
            {filteredAcceptedJobs.length === 0 ? (
              <div className="glass p-12 text-center animate-slideUp" style={{ animationDelay: '0.2s' }}>
                <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-gray-800/50 flex items-center justify-center mx-auto mb-4">
                  {searchQuery ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 dark:text-gray-500">
                      <circle cx="11" cy="11" r="8"/>
                      <path d="m21 21-4.3-4.3"/>
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 dark:text-gray-500">
                      <rect width="18" height="18" x="3" y="3" rx="2"/>
                      <path d="M8 12h8"/>
                    </svg>
                  )}
                </div>
                {searchQuery ? (
                  <>
                    <p className="text-adaptive-secondary mb-2">No se encontraron trabajos para "{searchQuery}"</p>
                    <p className="text-sm text-adaptive-muted mb-6">Intenta con otros términos de búsqueda</p>
                    <button
                      onClick={() => setSearchQuery('')}
                      className="btn-ghost inline-flex items-center gap-2"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 6 6 18"/>
                        <path d="m6 6 12 12"/>
                      </svg>
                      Limpiar búsqueda
                    </button>
                  </>
                ) : (
                  <>
                    <p className="text-adaptive-secondary mb-6">
                      Aún no has aceptado ningún trabajo
                    </p>
                    <button
                      onClick={() => setActiveTab('available')}
                      className="btn-secondary inline-flex items-center gap-2"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="8"/>
                        <path d="m21 21-4.3-4.3"/>
                      </svg>
                      Ver trabajos disponibles
                    </button>
                  </>
                )}
              </div>
            ) : (
              <div className="grid gap-4">
                {filteredAcceptedJobs.map((job, index) => (
                  <div
                    key={job.id}
                    className="glass glass-hover p-6 animate-slideUp cursor-pointer"
                    style={{ animationDelay: `${0.2 + index * 0.05}s` }}
                    onClick={() => handleViewDetails(job)}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-semibold text-adaptive-primary">{job.service_type}</h3>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            job.status === 'Asignado' ? 'badge-assigned' : 'badge-completed'
                          }`}>
                            {job.status}
                          </span>
                        </div>
                        <p className="text-adaptive-secondary">{job.description}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 text-sm mb-4 sm:mb-6">
                      <div className="p-2.5 sm:p-3 rounded-lg bg-gray-50 dark:bg-gray-800/60">
                        <p className="text-adaptive-muted text-xs mb-0.5 sm:mb-1">Ubicación</p>
                        <p className="font-medium text-adaptive-secondary text-xs sm:text-sm truncate">
                          {getLocationDisplayName(job.location_id)}
                        </p>
                      </div>
                      {job.price_quoted && (
                        <div className="p-2.5 sm:p-3 rounded-lg bg-gray-50 dark:bg-gray-800/60">
                          <p className="text-adaptive-muted text-xs mb-0.5 sm:mb-1">Precio</p>
                          <p className="font-medium text-emerald-600 dark:text-emerald-400 text-xs sm:text-sm">
                            ${job.price_quoted.toLocaleString('es-AR')}
                          </p>
                        </div>
                      )}
                      <div className="p-2.5 sm:p-3 rounded-lg bg-gray-50 dark:bg-gray-800/60">
                        <p className="text-adaptive-muted text-xs mb-0.5 sm:mb-1">Aceptado</p>
                        <p className="font-medium text-adaptive-secondary text-xs sm:text-sm">
                          {new Date(job.updated_at).toLocaleDateString('es-AR')}
                        </p>
                      </div>
                    </div>

                    {job.status === 'Asignado' && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCompleteClick(job.id);
                        }}
                        className="btn-primary w-full flex items-center justify-center gap-2"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20 6 9 17l-5-5"/>
                        </svg>
                        Marcar como Completado
                      </button>
                    )}

                    {job.status === 'Completado' && (
                      <div className="flex items-center justify-center gap-2 text-emerald-600 dark:text-emerald-400 font-medium">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20 6 9 17l-5-5"/>
                        </svg>
                        Trabajo Completado
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Accept Job Confirmation Dialog */}
      <ConfirmDialog
        isOpen={acceptDialogOpen}
        title="Aceptar Trabajo"
        message="¿Estás seguro que deseas aceptar este trabajo? Una vez aceptado, serás responsable de completarlo."
        confirmText="Sí, aceptar"
        cancelText="Cancelar"
        variant="success"
        onConfirm={handleConfirmAccept}
        onCancel={() => setAcceptDialogOpen(false)}
      />

      {/* Complete Job Confirmation Dialog */}
      <ConfirmDialog
        isOpen={completeDialogOpen}
        title="Marcar como Completado"
        message="¿Estás seguro que deseas marcar este trabajo como completado? El cliente será notificado."
        confirmText="Sí, completar"
        cancelText="Cancelar"
        variant="success"
        onConfirm={handleConfirmComplete}
        onCancel={() => setCompleteDialogOpen(false)}
      />

      {/* Request Details Modal */}
      <RequestDetailsModal
        isOpen={detailsModalOpen}
        request={selectedRequest}
        onClose={() => setDetailsModalOpen(false)}
        onAction={
          selectedRequest?.status === 'Pendiente' || selectedRequest?.status === 'Asignado'
            ? handleModalAction
            : undefined
        }
        actionLabel={
          selectedRequest?.status === 'Pendiente'
            ? 'Aceptar Trabajo'
            : selectedRequest?.status === 'Asignado'
            ? 'Marcar como Completado'
            : undefined
        }
        actionVariant={selectedRequest?.status === 'Pendiente' ? 'secondary' : 'primary'}
        userType="proveedor"
      />
    </div>
  );
}
