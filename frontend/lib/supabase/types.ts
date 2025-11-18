export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          user_type: 'artisan' | 'client'
          full_name: string
          phone: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          user_type: 'artisan' | 'client'
          full_name: string
          phone?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          user_type?: 'artisan' | 'client'
          full_name?: string
          phone?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      artisan_profiles: {
        Row: {
          id: string
          user_id: string
          craft_type: string
          years_experience: number | null
          bio: string | null
          hourly_rate: number | null
          service_area: string | null
          latitude: number | null
          longitude: number | null
          verified: boolean
          rating_avg: number
          rating_count: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          craft_type: string
          years_experience?: number | null
          bio?: string | null
          hourly_rate?: number | null
          service_area?: string | null
          latitude?: number | null
          longitude?: number | null
          verified?: boolean
          rating_avg?: number
          rating_count?: number
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          craft_type?: string
          years_experience?: number | null
          bio?: string | null
          hourly_rate?: number | null
          service_area?: string | null
          latitude?: number | null
          longitude?: number | null
          verified?: boolean
          rating_avg?: number
          rating_count?: number
          created_at?: string
        }
      }
      job_requests: {
        Row: {
          id: string
          client_id: string
          craft_type: string
          title: string
          description: string
          budget_min: number | null
          budget_max: number | null
          address: string | null
          latitude: number | null
          longitude: number | null
          status: 'open' | 'in_progress' | 'completed' | 'cancelled'
          created_at: string
          expires_at: string | null
        }
        Insert: {
          id?: string
          client_id: string
          craft_type: string
          title: string
          description: string
          budget_min?: number | null
          budget_max?: number | null
          address?: string | null
          latitude?: number | null
          longitude?: number | null
          status?: 'open' | 'in_progress' | 'completed' | 'cancelled'
          created_at?: string
          expires_at?: string | null
        }
        Update: {
          id?: string
          client_id?: string
          craft_type?: string
          title?: string
          description?: string
          budget_min?: number | null
          budget_max?: number | null
          address?: string | null
          latitude?: number | null
          longitude?: number | null
          status?: 'open' | 'in_progress' | 'completed' | 'cancelled'
          created_at?: string
          expires_at?: string | null
        }
      }
      proposals: {
        Row: {
          id: string
          job_request_id: string
          artisan_id: string
          message: string | null
          proposed_price: number | null
          status: 'pending' | 'accepted' | 'rejected'
          created_at: string
        }
        Insert: {
          id?: string
          job_request_id: string
          artisan_id: string
          message?: string | null
          proposed_price?: number | null
          status?: 'pending' | 'accepted' | 'rejected'
          created_at?: string
        }
        Update: {
          id?: string
          job_request_id?: string
          artisan_id?: string
          message?: string | null
          proposed_price?: number | null
          status?: 'pending' | 'accepted' | 'rejected'
          created_at?: string
        }
      }
      reviews: {
        Row: {
          id: string
          job_request_id: string
          reviewer_id: string
          reviewee_id: string
          rating: number
          comment: string | null
          created_at: string
        }
        Insert: {
          id?: string
          job_request_id: string
          reviewer_id: string
          reviewee_id: string
          rating: number
          comment?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          job_request_id?: string
          reviewer_id?: string
          reviewee_id?: string
          rating?: number
          comment?: string | null
          created_at?: string
        }
      }
      messages: {
        Row: {
          id: string
          sender_id: string
          receiver_id: string
          job_request_id: string | null
          content: string
          read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          sender_id: string
          receiver_id: string
          job_request_id?: string | null
          content: string
          read?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          sender_id?: string
          receiver_id?: string
          job_request_id?: string | null
          content?: string
          read?: boolean
          created_at?: string
        }
      }
    }
  }
}

// Convenience types
export type User = Database['public']['Tables']['users']['Row']
export type ArtisanProfile = Database['public']['Tables']['artisan_profiles']['Row']
export type JobRequest = Database['public']['Tables']['job_requests']['Row']
export type Proposal = Database['public']['Tables']['proposals']['Row']
export type Review = Database['public']['Tables']['reviews']['Row']
export type Message = Database['public']['Tables']['messages']['Row']

// Service types constant
export const SERVICE_TYPES = [
  'Plomería',
  'Electricidad',
  'Carpintería',
  'Pintura',
  'Limpieza',
  'Jardinería',
  'Albañilería',
  'Cerrajería',
  'Gasista',
  'Aire Acondicionado',
  'Tapicería',
  'Herrería',
  'Vidriería',
  'Impermeabilización',
  'Mudanzas',
] as const

export type ServiceType = typeof SERVICE_TYPES[number]
