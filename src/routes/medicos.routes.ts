import { Router } from 'express';

import {
  getMedicos,
  getMedicoById,
  createMedico,
  updateMedico,
  deleteMedico,
} from '../controllers/medicos.controller.js';

import { validate } from '../middlewares/validate.middleware.js';
import { medicoSchema } from '../schemas/medico.schema.js';

const router = Router();

router.get('/', getMedicos);
router.get('/:id', getMedicoById);
router.post('/', validate(medicoSchema), createMedico);
router.put('/:id', validate(medicoSchema), updateMedico);
router.delete('/:id', deleteMedico);

export default router;