import { create } from 'zustand';

// Service request interface
export interface ServiceRequest {
  id: string;
  demandante_id: string;
  description: string;
  service_type: string;
  location_id: string;
  status: 'Pendiente' | 'Asignado' | 'Completado' | 'Cancelado';
  price_quoted: number | null;
  provider_id: string | null;
  created_at: string;
  updated_at: string;
}

// Requests state interface
interface RequestsState {
  // Data
  requests: ServiceRequest[];
  isLoading: boolean;
  error: string | null;

  // Actions
  setRequests: (requests: ServiceRequest[]) => void;
  addRequest: (request: ServiceRequest) => void;
  updateRequest: (id: string, updates: Partial<ServiceRequest>) => void;
  removeRequest: (id: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  // Filters
  getByStatus: (status: ServiceRequest['status']) => ServiceRequest[];
  getByDemandante: (demandanteId: string) => ServiceRequest[];
  getByProvider: (providerId: string) => ServiceRequest[];
  getPending: () => ServiceRequest[];
}

// Mock data for testing
const mockRequests: ServiceRequest[] = [
  {
    id: '1',
    demandante_id: 'mock-user-1',
    description: 'Necesito reparar una canilla que gotea en el baño principal',
    service_type: 'Plomería',
    location_id: 'san-luis-capital',
    status: 'Pendiente',
    price_quoted: 4500,
    provider_id: null,
    created_at: '2024-01-15T10:30:00Z',
    updated_at: '2024-01-15T10:30:00Z',
  },
  {
    id: '2',
    demandante_id: 'mock-user-1',
    description: 'Instalación de 3 tomas corriente nuevas en living',
    service_type: 'Electricidad',
    location_id: 'villa-mercedes',
    status: 'Asignado',
    price_quoted: 8200,
    provider_id: 'provider-1',
    created_at: '2024-01-14T15:00:00Z',
    updated_at: '2024-01-14T16:00:00Z',
  },
  {
    id: '3',
    demandante_id: 'mock-user-2',
    description: 'Pintar habitación de 4x4 metros, incluye techo',
    service_type: 'Pintura',
    location_id: 'merlo',
    status: 'Completado',
    price_quoted: 15000,
    provider_id: 'provider-2',
    created_at: '2024-01-10T09:00:00Z',
    updated_at: '2024-01-12T14:00:00Z',
  },
  {
    id: '4',
    demandante_id: 'mock-user-1',
    description: 'Cortar césped y podar arbustos del jardín frontal',
    service_type: 'Jardinería',
    location_id: 'la-punta',
    status: 'Pendiente',
    price_quoted: 6000,
    provider_id: null,
    created_at: '2024-01-16T08:00:00Z',
    updated_at: '2024-01-16T08:00:00Z',
  },
  {
    id: '5',
    demandante_id: 'mock-user-3',
    description: 'Arreglo urgente de cañería rota en cocina',
    service_type: 'Plomería',
    location_id: 'juana-koslay',
    status: 'Pendiente',
    price_quoted: 7500,
    provider_id: null,
    created_at: '2024-01-16T14:00:00Z',
    updated_at: '2024-01-16T14:00:00Z',
  },
];

// Create the store
export const useRequestsStore = create<RequestsState>((set, get) => ({
  // Initial state with mock data
  requests: mockRequests,
  isLoading: false,
  error: null,

  // Actions
  setRequests: (requests) => set({ requests }),

  addRequest: (request) => set((state) => ({
    requests: [request, ...state.requests],
  })),

  updateRequest: (id, updates) => set((state) => ({
    requests: state.requests.map((r) =>
      r.id === id ? { ...r, ...updates, updated_at: new Date().toISOString() } : r
    ),
  })),

  removeRequest: (id) => set((state) => ({
    requests: state.requests.filter((r) => r.id !== id),
  })),

  setLoading: (loading) => set({ isLoading: loading }),

  setError: (error) => set({ error }),

  // Filters
  getByStatus: (status) => get().requests.filter((r) => r.status === status),

  getByDemandante: (demandanteId) =>
    get().requests.filter((r) => r.demandante_id === demandanteId),

  getByProvider: (providerId) =>
    get().requests.filter((r) => r.provider_id === providerId),

  getPending: () => get().requests.filter((r) => r.status === 'Pendiente'),
}));

// Selector hooks
export const useRequests = () => useRequestsStore((state) => state.requests);
export const usePendingRequests = () => useRequestsStore((state) => state.getPending());
