import type { Request, Response, NextFunction } from 'express';

import {
  leerTurnos,
  guardarTurnos,
} from '../services/turnosFile.service.js';
import { normalizarTurno } from '../services/normalizarTurno.service.js';
import { eventBus } from '../services/eventBus.service.js';

export async function getTurnos(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const turnos = await leerTurnos();

    const { especialidad, fecha, medicoId } = req.query;

    const filtrados = turnos.filter((turno) => {
      const coincideEspecialidad =
        !especialidad ||
        turno.especialidad.toLowerCase() ===
          String(especialidad).toLowerCase();

      const coincideFecha =
        !fecha || turno.fecha === String(fecha);

      const coincideMedico =
        !medicoId ||
        String(turno.medicoId) === String(medicoId);

      return (
        coincideEspecialidad &&
        coincideFecha &&
        coincideMedico
      );
    });

    return res.status(200).json(filtrados);
  } catch (error) {
    next(error);
  }
}

export async function getTurnoById(
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

    const turnos = await leerTurnos();
    const turno = turnos.find((item) => item.id === id);

    if (!turno) {
      return res.status(404).json({
        status: 404,
        message: 'Turno no encontrado',
        code: 'TURN_NOT_FOUND',
        details: [],
      });
    }

    return res.status(200).json(turno);
  } catch (error) {
    next(error);
  }
}

export async function createTurno(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const nuevoTurno = normalizarTurno(req.body);

    if (!nuevoTurno) {
      return res.status(400).json({
        status: 400,
        message: 'Datos de turno inválidos',
        code: 'VALIDATION_ERROR',
        details: [],
      });
    }

    const turnos = await leerTurnos();

    const existeId = turnos.some(
      (turno) => turno.id === nuevoTurno.id,
    );

    if (existeId) {
      return res.status(400).json({
        status: 400,
        message: 'Ya existe un turno con ese ID',
        code: 'DUPLICATE_ID',
        details: [],
      });
    }

    turnos.push(nuevoTurno);
    await guardarTurnos(turnos);

    eventBus.emit('turno:creado', nuevoTurno);

    return res.status(201).json({
      mensaje: 'Turno creado correctamente',
      turno: nuevoTurno,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateTurno(
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

    const turnos = await leerTurnos();
    const indice = turnos.findIndex((turno) => turno.id === id);

    if (indice === -1) {
      return res.status(404).json({
        status: 404,
        message: 'Turno no encontrado',
        code: 'TURN_NOT_FOUND',
        details: [],
      });
    }

    const turnoActualizado = normalizarTurno({
      ...req.body,
      id,
    });

    if (!turnoActualizado) {
      return res.status(400).json({
        status: 400,
        message: 'Datos de turno inválidos',
        code: 'VALIDATION_ERROR',
        details: [],
      });
    }

    turnos[indice] = turnoActualizado;
    await guardarTurnos(turnos);

    eventBus.emit('turno:actualizado', turnoActualizado);

    return res.status(200).json({
      mensaje: 'Turno actualizado correctamente',
      turno: turnoActualizado,
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteTurno(
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

    const turnos = await leerTurnos();
    const indice = turnos.findIndex((turno) => turno.id === id);

    if (indice === -1) {
      return res.status(404).json({
        status: 404,
        message: 'Turno no encontrado',
        code: 'TURN_NOT_FOUND',
        details: [],
      });
    }

    const turnoEliminado = turnos[indice];

    turnos.splice(indice, 1);
    await guardarTurnos(turnos);

    eventBus.emit('turno:eliminado', turnoEliminado);

    return res.status(204).send();
  } catch (error) {
    next(error);
  }
}