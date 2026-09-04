import express from 'express';
import { createServer } from 'node:http';
import { Server } from 'socket.io';

import turnosRoutes from './routes/turnos.routes.js';
import medicosRoutes from './routes/medicos.routes.js';
import { eventBus } from './services/eventBus.service.js';
import { errorHandler } from './middlewares/error.middleware.js';

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 3000;

app.use('/turnos', turnosRoutes);
app.use('/medicos', medicosRoutes);

app.get('/', (_req, res) => {
  res.status(200).json({
    mensaje: 'Servidor TurnosRed funcionando',
  });
});

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: '*',
  },
});

io.on('connection', (socket) => {
  console.log(`Cliente Socket.IO conectado: ${socket.id}`);

  socket.on('disconnect', () => {
    console.log(`Cliente Socket.IO desconectado: ${socket.id}`);
  });
});

eventBus.on('turno:creado', (turno) => {
  console.log('Evento turno:creado', turno);
  io.emit('turno:nuevo', turno);
});

eventBus.on('turno:actualizado', (turno) => {
  console.log('Evento turno:actualizado', turno);
  io.emit('turno:actualizado', turno);
});

eventBus.on('turno:eliminado', (turno) => {
  console.log('Evento turno:eliminado', turno);
  io.emit('turno:eliminado', turno);
});

app.use(errorHandler);

httpServer.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});
