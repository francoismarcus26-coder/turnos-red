import { Router } from 'express';

import {
  getTurnos,
  getTurnoById,
  createTurno,
  updateTurno,
  deleteTurno,
} from '../controllers/turnos.controller.js';

import { validate } from '../middlewares/validate.middleware.js';
import { turnoSchema } from '../schemas/turno.schema.js';

const router = Router();

router.get('/', getTurnos);
router.get('/:id', getTurnoById);
router.post('/', validate(turnoSchema), createTurno);
router.put('/:id', validate(turnoSchema), updateTurno);
router.delete('/:id', deleteTurno);

export default router;