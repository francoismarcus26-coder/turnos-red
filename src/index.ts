import { leerTurnos } from './services/turnosFile.service.js';

const turnos = await leerTurnos();

console.log('Turnos cargados:', turnos);
