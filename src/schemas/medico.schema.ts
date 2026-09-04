import { z } from 'zod';
import { especialidadSchema } from './turno.schema.js';

export const medicoSchema = z.object({
  id: z.coerce.number().int().positive(),

  nombre: z.string().trim().min(2, {
    message: 'El nombre debe tener al menos 2 caracteres',
  }),

  documento: z.string().trim().min(1, {
    message: 'El documento es obligatorio',
  }),

  especialidad: especialidadSchema,

  disponible: z.boolean(),
});

export type MedicoInput = z.infer<typeof medicoSchema>;