import { z } from 'zod'
import { SERVICE_TYPES } from '@/lib/supabase/types'

export const createJobRequestSchema = z.object({
  title: z
    .string()
    .min(1, 'El título es requerido')
    .min(5, 'El título debe tener al menos 5 caracteres')
    .max(100, 'El título no puede exceder 100 caracteres'),
  description: z
    .string()
    .min(1, 'La descripción es requerida')
    .min(20, 'La descripción debe tener al menos 20 caracteres')
    .max(1000, 'La descripción no puede exceder 1000 caracteres'),
  craftType: z.enum(SERVICE_TYPES as unknown as [string, ...string[]], {
    required_error: 'Selecciona un tipo de servicio',
  }),
  budgetMin: z
    .number()
    .min(0, 'El presupuesto mínimo no puede ser negativo')
    .optional(),
  budgetMax: z
    .number()
    .min(0, 'El presupuesto máximo no puede ser negativo')
    .optional(),
  address: z
    .string()
    .min(1, 'La dirección es requerida'),
  latitude: z
    .number()
    .min(-90, 'Latitud inválida')
    .max(90, 'Latitud inválida'),
  longitude: z
    .number()
    .min(-180, 'Longitud inválida')
    .max(180, 'Longitud inválida'),
}).refine((data) => {
  if (data.budgetMin && data.budgetMax) {
    return data.budgetMin <= data.budgetMax
  }
  return true
}, {
  message: 'El presupuesto mínimo no puede ser mayor al máximo',
  path: ['budgetMin'],
})

export const proposalSchema = z.object({
  message: z
    .string()
    .min(1, 'El mensaje es requerido')
    .min(20, 'El mensaje debe tener al menos 20 caracteres')
    .max(500, 'El mensaje no puede exceder 500 caracteres'),
  proposedPrice: z
    .number()
    .min(1, 'El precio propuesto es requerido')
    .min(100, 'El precio mínimo es $100'),
})

export type CreateJobRequestFormData = z.infer<typeof createJobRequestSchema>
export type ProposalFormData = z.infer<typeof proposalSchema>
