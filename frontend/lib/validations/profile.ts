import { z } from 'zod'
import { SERVICE_TYPES } from '@/lib/supabase/types'

export const artisanProfileSchema = z.object({
  craftType: z.enum(SERVICE_TYPES as unknown as [string, ...string[]], {
    required_error: 'Selecciona tu oficio principal',
  }),
  yearsExperience: z
    .number()
    .min(0, 'Los años de experiencia no pueden ser negativos')
    .max(70, 'Valor de experiencia inválido')
    .optional(),
  bio: z
    .string()
    .max(500, 'La biografía no puede exceder 500 caracteres')
    .optional(),
  hourlyRate: z
    .number()
    .min(100, 'La tarifa mínima es $100/hora')
    .max(50000, 'La tarifa máxima es $50.000/hora')
    .optional(),
  serviceArea: z
    .string()
    .min(1, 'Selecciona tu zona de cobertura'),
  latitude: z
    .number()
    .min(-90, 'Latitud inválida')
    .max(90, 'Latitud inválida'),
  longitude: z
    .number()
    .min(-180, 'Longitud inválida')
    .max(180, 'Longitud inválida'),
})

export const reviewSchema = z.object({
  rating: z
    .number()
    .min(1, 'La calificación mínima es 1')
    .max(5, 'La calificación máxima es 5'),
  comment: z
    .string()
    .min(10, 'El comentario debe tener al menos 10 caracteres')
    .max(500, 'El comentario no puede exceder 500 caracteres')
    .optional(),
})

export type ArtisanProfileFormData = z.infer<typeof artisanProfileSchema>
export type ReviewFormData = z.infer<typeof reviewSchema>
