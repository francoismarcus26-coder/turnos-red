import { Router } from 'express';
import { leerTurnos, guardarTurnos } from '../services/turnosFile.service.js';
import { normalizarTurno } from '../services/normalizarTurno.service.js';
import { eventBus } from '../services/eventBus.service.js';

const router = Router();

router.get('/', async (_req, res) => {
  try {
    const turnos = await leerTurnos();

    return res.status(200).json(turnos);
  } catch (error) {
    console.error('Error al obtener turnos:', error);

    return res.status(500).json({
      mensaje: 'Error interno del servidor',
    });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        mensaje: 'El ID debe ser un número entero positivo',
      });
    }

    const turnos = await leerTurnos();

    const turno = turnos.find((item) => item.id === id);

    if (!turno) {
      return res.status(404).json({
        mensaje: 'Turno no encontrado',
      });
    }

    return res.status(200).json(turno);
  } catch (error) {
    console.error('Error al obtener turno:', error);

    return res.status(500).json({
      mensaje: 'Error interno del servidor',
    });
  }
});

router.post('/', async (req, res) => {
  try {
    if (!req.body || typeof req.body !== 'object' || Array.isArray(req.body)) {
      return res.status(400).json({
        mensaje: 'El cuerpo de la solicitud es obligatorio y debe ser JSON',
      });
    }

    const nuevoTurno = normalizarTurno(req.body);

    if (!nuevoTurno) {
      return res.status(400).json({
        mensaje: 'Datos de turno inválidos',
      });
    }

    const turnos = await leerTurnos();

    const existeId = turnos.some((turno) => turno.id === nuevoTurno.id);

    if (existeId) {
      return res.status(400).json({
        mensaje: 'Ya existe un turno con ese ID',
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
    console.error('Error al crear turno:', error);

    return res.status(500).json({
      mensaje: 'Error interno del servidor',
    });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        mensaje: 'El ID debe ser un número entero positivo',
      });
    }

    if (!req.body || typeof req.body !== 'object' || Array.isArray(req.body)) {
      return res.status(400).json({
        mensaje: 'El cuerpo de la solicitud es obligatorio y debe ser JSON',
      });
    }

    const turnos = await leerTurnos();

    const indice = turnos.findIndex((turno) => turno.id === id);

    if (indice === -1) {
      return res.status(404).json({
        mensaje: 'Turno no encontrado',
      });
    }

    const turnoActualizado = normalizarTurno({
      ...req.body,
      id,
    });

    if (!turnoActualizado) {
      return res.status(400).json({
        mensaje: 'Datos de turno inválidos',
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
    console.error('Error al actualizar turno:', error);

    return res.status(500).json({
      mensaje: 'Error interno del servidor',
    });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        mensaje: 'El ID debe ser un número entero positivo',
      });
    }

    const turnos = await leerTurnos();

    const indice = turnos.findIndex((turno) => turno.id === id);

    if (indice === -1) {
      return res.status(404).json({
        mensaje: 'Turno no encontrado',
      });
    }

    const turnoEliminado = turnos[indice];

    turnos.splice(indice, 1);

    await guardarTurnos(turnos);

    eventBus.emit('turno:eliminado', turnoEliminado);

    return res.status(200).json({
      mensaje: 'Turno eliminado correctamente',
      turno: turnoEliminado,
    });
  } catch (error) {
    console.error('Error al eliminar turno:', error);

    return res.status(500).json({
      mensaje: 'Error interno del servidor',
    });
  }
});

export default router;
