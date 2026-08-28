# TurnosRed

Backend para la gestión de turnos médicos desarrollado con Node.js, TypeScript y Express.

## Requisitos previos

- Node.js LTS
- NVM
- npm
- Git
- Visual Studio Code
- Postman

## Instalación

```bash
npm install

nvm use 24.20.0

Variables de entorno
Crear un archivo .env basado en .env.example.
Variable	Descripción	Ejemplo
PORT	Puerto del servidor	3000
DATA_FILE	Ruta del archivo de datos	./data/turnos.json

Scripts disponibles
npm run build
Compila el código TypeScript a la carpeta dist.
npm run start
Inicia el servidor compilado.
npm run lint
Ejecuta ESLint.
npm run format
Aplica formato con Prettier.


Estructura del proyecto
turnos-red/
├── client/
│   └── index.html
├── data/
│   └── turnos.json
├── src/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   │   └── turnos.routes.ts
│   ├── services/
│   │   ├── eventBus.service.ts
│   │   ├── normalizarTurno.service.ts
│   │   └── turnosFile.service.ts
│   ├── index.ts
│   └── server.ts
├── .env.example
├── .gitignore
├── .nvmrc
├── eslint.config.js
├── package.json
├── package-lock.json
├── tsconfig.json
└── README.md

Endpoints REST
- GET /turnos
- GET /turnos/:id
- POST /turnos
- PUT /turnos/:id
- DELETE /turnos/:id


Eventos internos
Se utiliza EventEmitter para emitir:
- turno:creado
- turno:actualizado
- turno:eliminado


Tiempo real
Socket.IO retransmite los eventos:
- turno:nuevo
- turno:actualizado
- turno:eliminado
Los clientes conectados reciben las actualizaciones sin recargar la página.



```
