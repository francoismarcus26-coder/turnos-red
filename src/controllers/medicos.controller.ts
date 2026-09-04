import type { Request, Response, NextFunction } from 'express';

import {
  leerMedicos,
  guardarMedicos,
  filtrarMedicos,
} from '../services/medicos.service.js';

import type { Medico } from '../models/medico.js';

export async function getMedicos(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { especialidad, disponible } = req.query;

    const medicos = await filtrarMedicos(
      especialidad ? String(especialidad) : undefined,
      disponible ? String(disponible) : undefined,
    );

    return res.status(200).json(medicos);
  } catch (error) {
    next(error);
  }
}

export async function getMedicoById(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        status: 400,
        message: 'El ID debe ser un número entero positivo',
        code: 'INVALID_ID',
        details: [],
      });
    }

    const medicos = await leerMedicos();

    const medico = medicos.find((item) => item.id === id);

    if (!medico) {
      return res.status(404).json({
        status: 404,
        message: 'Médico no encontrado',
        code: 'MEDICO_NOT_FOUND',
        details: [],
      });
    }

    return res.status(200).json(medico);
  } catch (error) {
    next(error);
  }
}

export async function createMedico(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const nuevoMedico = req.body as Medico;

    const medicos = await leerMedicos();

    const existeId = medicos.some(
      (medico) => medico.id === nuevoMedico.id,
    );

    if (existeId) {
      return res.status(400).json({
        status: 400,
        message: 'Ya existe un médico con ese ID',
        code: 'DUPLICATE_ID',
        details: [],
      });
    }

    medicos.push(nuevoMedico);

    await guardarMedicos(medicos);

    return res.status(201).json({
      mensaje: 'Médico creado correctamente',
      medico: nuevoMedico,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateMedico(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        status: 400,
        message: 'El ID debe ser un número entero positivo',
        code: 'INVALID_ID',
        details: [],
      });
    }

    const medicos = await leerMedicos();

    const indice = medicos.findIndex((medico) => medico.id === id);

    if (indice === -1) {
      return res.status(404).json({
        status: 404,
        message: 'Médico no encontrado',
        code: 'MEDICO_NOT_FOUND',
        details: [],
      });
    }

    const medicoActualizado: Medico = {
      ...req.body,
      id,
    };

    medicos[indice] = medicoActualizado;

    await guardarMedicos(medicos);

    return res.status(200).json({
      mensaje: 'Médico actualizado correctamente',
      medico: medicoActualizado,
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteMedico(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        status: 400,
        message: 'El ID debe ser un número entero positivo',
        code: 'INVALID_ID',
        details: [],
      });
    }

    const medicos = await leerMedicos();

    const indice = medicos.findIndex((medico) => medico.id === id);

    if (indice === -1) {
      return res.status(404).json({
        status: 404,
        message: 'Médico no encontrado',
        code: 'MEDICO_NOT_FOUND',
        details: [],
      });
    }

    medicos.splice(indice, 1);

    await guardarMedicos(medicos);

    return res.status(204).send();
  } catch (error) {
    next(error);
  }
}