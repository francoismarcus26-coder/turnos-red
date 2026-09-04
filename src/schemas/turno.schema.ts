import { z } from 'zod';

export const especialidadSchema = z.enum([
  'Clínica médica',
  'Pediatría',
  'Odontología',
  'Nutrición',
]);

export const turnoSchema = z.object({
  id: z.coerce.number().int().positive(),

  paciente: z.string().trim().min(2, {
    message: 'El paciente debe tener al menos 2 caracteres',
  }),

  documento: z.string().trim().min(1, {
    message: 'El documento es obligatorio',
  }),

  especialidad: especialidadSchema,

  fecha: z.string().trim().min(1, {
    message: 'La fecha es obligatoria',
  }),

  hora: z.string().trim().min(1, {
    message: 'La hora es obligatoria',
  }),

  confirmado: z.boolean(),

  medicoId: z.coerce.number().int().positive(),

  observaciones: z.string().trim().optional(),
});

export type TurnoInput = z.infer<typeof turnoSchema>;