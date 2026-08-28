import type { Turno, TurnoCrudo } from '../models/turno.js';

export function normalizarTurno(turnoCrudo: TurnoCrudo): Turno | null {
  const id = Number(turnoCrudo.id);

  if (!Number.isInteger(id) || id <= 0) {
    return null;
  }

  const paciente = turnoCrudo.paciente.trim();

  if (!paciente) {
    return null;
  }

  const documento = String(turnoCrudo.documento).trim();

  const especialidad = turnoCrudo.especialidad.trim().toUpperCase();

  const fecha = normalizarFecha(turnoCrudo.fecha);
  const hora = normalizarHora(turnoCrudo.hora);
  const confirmado = normalizarConfirmado(turnoCrudo.confirmado);

  if (!fecha || !hora || confirmado === null) {
    return null;
  }

  return {
    id,
    paciente,
    documento,
    especialidad,
    fecha,
    hora,
    confirmado,
    observaciones: turnoCrudo.observaciones?.trim(),
  };
}

function normalizarFecha(fecha: string): string | null {
  const valor = fecha.trim();

  if (/^\d{4}-\d{2}-\d{2}$/.test(valor)) {
    return valor;
  }

  const partes = valor.split('/');

  if (partes.length !== 3) {
    return null;
  }

  const [dia, mes, anio] = partes;

  if (!dia || !mes || !anio) {
    return null;
  }

  return `${anio}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}`;
}

function normalizarHora(hora: string): string | null {
  const horaNormalizada = hora.trim().replace('.', ':');

  const partes = horaNormalizada.split(':');

  if (partes.length !== 2) {
    return null;
  }

  const [horas, minutos] = partes;

  const h = Number(horas);
  const m = Number(minutos);

  if (
    !Number.isInteger(h) ||
    !Number.isInteger(m) ||
    h < 0 ||
    h > 23 ||
    m < 0 ||
    m > 59
  ) {
    return null;
  }

  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

function normalizarConfirmado(valor: string | boolean): boolean | null {
  if (typeof valor === 'boolean') {
    return valor;
  }

  const valorNormalizado = valor.trim().toLowerCase();

  if (['si', 'sí', 'true', '1'].includes(valorNormalizado)) {
    return true;
  }

  if (['no', 'false', '0'].includes(valorNormalizado)) {
    return false;
  }

  return null;
}
