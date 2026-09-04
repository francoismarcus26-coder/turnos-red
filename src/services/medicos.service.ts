import { readFile, writeFile } from 'node:fs/promises';
import type { Medico } from '../models/medico.js';

const RUTA_MEDICOS = './data/medicos.json';

export async function leerMedicos(): Promise<Medico[]> {
  const contenido = await readFile(RUTA_MEDICOS, 'utf-8');

  return JSON.parse(contenido) as Medico[];
}

export async function guardarMedicos(medicos: Medico[]): Promise<void> {
  const contenido = JSON.stringify(medicos, null, 2);

  await writeFile(RUTA_MEDICOS, contenido, 'utf-8');
}

export async function filtrarMedicos(
  especialidad?: string,
  disponible?: string,
): Promise<Medico[]> {
  const medicos = await leerMedicos();

  return medicos.filter((medico) => {
    const coincideEspecialidad =
      !especialidad ||
      medico.especialidad.toLowerCase() === especialidad.toLowerCase();

    const coincideDisponible =
      disponible === undefined ||
      medico.disponible === (disponible === 'true');

    return coincideEspecialidad && coincideDisponible;
  });
}