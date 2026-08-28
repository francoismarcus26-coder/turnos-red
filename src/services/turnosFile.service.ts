import { readFile, writeFile } from 'node:fs/promises';
import type { TurnoCrudo, Turno } from '../models/turno.js';
import { normalizarTurno } from './normalizarTurno.service.js';

const RUTA_TURNOS = './data/turnos.json';

export async function leerTurnos(): Promise<Turno[]> {
  try {
    const contenido = await readFile(RUTA_TURNOS, 'utf-8');
    const datosCrudos = JSON.parse(contenido) as TurnoCrudo[];

    const turnosValidos: Turno[] = [];
    let rechazados = 0;

    for (const turnoCrudo of datosCrudos) {
      const turnoNormalizado = normalizarTurno(turnoCrudo);

      if (turnoNormalizado) {
        turnosValidos.push(turnoNormalizado);
      } else {
        rechazados++;
      }
    }

    console.log(`Registros aceptados: ${turnosValidos.length}`);
    console.log(`Registros rechazados: ${rechazados}`);

    return turnosValidos;
  } catch (error) {
    console.error('Error al leer o procesar turnos.json:', error);
    return [];
  }
}

export async function guardarTurnos(turnos: Turno[]): Promise<void> {
  try {
    const contenido = JSON.stringify(turnos, null, 2);

    await writeFile(RUTA_TURNOS, contenido, 'utf-8');
  } catch (error) {
    console.error('Error al guardar turnos.json:', error);
    throw error;
  }
}
/*
Ejemplo equivalente usando callbacks con node:fs:

import { readFile } from 'node:fs';

readFile('./data/turnos.json', 'utf-8', (error, contenido) => {
  if (error) {
    console.error('Error al leer el archivo:', error);
    return;
  }

  const datos = JSON.parse(contenido);
  console.log(datos);
});

Se prefieren promesas con async/await porque permiten un flujo
más legible, facilitan el manejo de errores con try...catch
y evitan anidar callbacks cuando hay varias operaciones asíncronas.
*/
