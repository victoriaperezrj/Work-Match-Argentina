import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// User roles
export type UserRole = 'demandante' | 'proveedor';

// User profile interface
export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  avatar_url?: string;
  // Dual-role: user can be both
  is_demandante: boolean;
  is_proveedor: boolean;
  // Provider-specific fields
  services?: string[];
  location_id?: string;
  radius_km?: number;
  created_at: string;
}

// Auth state interface
interface AuthState {
  // User data
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Current active role (for dual-role users)
  activeRole: UserRole;

  // Actions
  setUser: (user: UserProfile | null) => void;
  setActiveRole: (role: UserRole) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;

  // Mock login for testing (will be replaced with Supabase)
  mockLogin: (role: UserRole) => void;
}

// Create the store with persistence
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      // Initial state
      user: null,
      isAuthenticated: false,
      isLoading: false,
      activeRole: 'demandante',

      // Actions
      setUser: (user) => set({
        user,
        isAuthenticated: !!user,
      }),

      setActiveRole: (role) => set({ activeRole: role }),

      setLoading: (loading) => set({ isLoading: loading }),

      logout: () => set({
        user: null,
        isAuthenticated: false,
        activeRole: 'demandante',
      }),

      // Mock login for testing without backend
      mockLogin: (role) => set({
        user: {
          id: 'mock-user-1',
          email: role === 'demandante' ? 'juan@demandante.com' : 'carlos@proveedor.com',
          full_name: role === 'demandante' ? 'Juan Pérez' : 'Carlos García',
          phone: '+54 9 266 123-4567',
          is_demandante: true,
          is_proveedor: true, // Dual-role enabled
          services: role === 'proveedor' ? ['Plomería', 'Electricidad'] : undefined,
          location_id: 'san-luis-capital',
          radius_km: 15,
          created_at: new Date().toISOString(),
        },
        isAuthenticated: true,
        activeRole: role,
      }),
    }),
    {
      name: 'workmatch-auth', // localStorage key
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        activeRole: state.activeRole,
      }),
    }
  )
);

// Selector hooks for convenience
export const useUser = () => useAuthStore((state) => state.user);
export const useIsAuthenticated = () => useAuthStore((state) => state.isAuthenticated);
export const useActiveRole = () => useAuthStore((state) => state.activeRole);
