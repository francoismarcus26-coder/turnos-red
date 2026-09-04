TurnosRed API

Backend RESTful desarrollado con Node.js, TypeScript y Express para gestionar turnos médicos y profesionales. La segunda etapa incorpora validaciones con Zod, recurso Medico, filtros mediante query parameters, errores estandarizados, pruebas automatizadas en Postman y soporte de Mock Server.

Requisitos previos

Node.js LTS

npm

Git

Visual Studio Code

Postman

Instalación y ejecución

git clone https://github.com/francoismarcus26-coder/turnos-red.git
cd turnos-red
npm install
npm run build
npm start

Servidor local:

http://localhost:3000

Variables de entorno

Crear .env a partir de .env.example.

Variable

Ejemplo

Descripción

PORT

3000

Puerto HTTP del servidor

DATA_FILE

./data/turnos.json

Ruta del archivo de turnos

Scripts npm

Script

Descripción

npm run build

Compila TypeScript a dist/

npm start

Inicia el servidor compilado

npm run lint

Ejecuta ESLint

npm run format

Formatea el proyecto con Prettier

Estructura del proyecto

turnos-red/
├── client/
│   └── index.html
├── data/
│   ├── turnos.json
│   └── medicos.json
├── src/
│   ├── controllers/
│   │   ├── turnos.controller.ts
│   │   └── medicos.controller.ts
│   ├── middlewares/
│   │   ├── error.middleware.ts
│   │   └── validate.middleware.ts
│   ├── models/
│   │   ├── turno.ts
│   │   └── medico.ts
│   ├── routes/
│   │   ├── turnos.routes.ts
│   │   └── medicos.routes.ts
│   ├── schemas/
│   │   ├── turno.schema.ts
│   │   └── medico.schema.ts
│   ├── services/
│   │   ├── eventBus.service.ts
│   │   ├── medicos.service.ts
│   │   ├── normalizarTurno.service.ts
│   │   └── turnosFile.service.ts
│   └── server.ts
├── .env.example
├── package.json
├── tsconfig.json
└── README.md

Validaciones con Zod

Los recursos Turno y Medico se validan antes de llegar a la lógica principal. documento se maneja como string; los booleanos se validan como booleanos; los IDs deben ser enteros positivos; y las especialidades aceptadas son:

Clínica médica

Pediatría

Odontología

Nutrición

Ejemplo de error de validación estandarizado:

{
  "status": 400,
  "message": "Error de validación en los datos ingresados",
  "code": "VALIDATION_ERROR",
  "details": [
    {
      "field": "nombre",
      "message": "El nombre debe tener al menos 2 caracteres"
    }
  ]
}

Endpoints de Médicos

Método

Endpoint

Descripción

Éxito

GET

/medicos

Lista médicos

200

GET

/medicos/:id

Obtiene médico por ID

200

POST

/medicos

Crea médico

201

PUT

/medicos/:id

Actualiza médico

200

DELETE

/medicos/:id

Elimina médico

204

Filtros de Médicos

GET /medicos?especialidad=Pediatría&disponible=true

Parámetros disponibles:

especialidad

disponible

Endpoints de Turnos

Método

Endpoint

Descripción

Éxito

GET

/turnos

Lista turnos

200

GET

/turnos/:id

Obtiene turno por ID

200

POST

/turnos

Crea turno

201

PUT

/turnos/:id

Actualiza turno

200

DELETE

/turnos/:id

Elimina turno

204

Filtros de Turnos

GET /turnos?especialidad=Pediatría&fecha=2026-08-20&medicoId=1

Parámetros disponibles:

especialidad

fecha

medicoId

Códigos de estado y errores

La API utiliza 200, 201, 204, 400, 404 y 500 según la operación. Las respuestas fallidas utilizan una estructura uniforme con las propiedades status, message, code y details.

Postman

La colección turnos-red.postman_collection.json utiliza:

{{baseUrl}} para la URL base.

{{medicoId}} para IDs de médicos.

{{turnoId}} para IDs de turnos.

Tests automáticos para 200, 201, 400 y 404.

Validación del JSON Schema retornado.

Casos Happy Path, Bad Request y Not Found.

Saved Responses para uso con Mock Server.

Environment local recomendado:

Variable

Valor

baseUrl

http://localhost:3000

medicoId

1

turnoId

120

Eventos en tiempo real

El proyecto conserva la integración de la primera etapa con EventEmitter y Socket.IO. Los cambios de turnos emiten eventos internos y se retransmiten a clientes conectados.

Uso de Inteligencia Artificial

Tarea

Herramienta

Prompt

Respuesta generada

Ajuste manual aplicado

Schema Zod de Turno

ChatGPT

Crear un schema Zod para Turno con documento string, especialidades permitidas, confirmado boolean y medicoId positivo.

Código base de turnoSchema.

Se ajustaron tipos, mensajes y formato de especialidades según la consigna.

Schema Zod de Médico

ChatGPT

Crear validación Zod para Médico con id, nombre, documento, especialidad y disponible.

Código base de medicoSchema.

Se revisaron mensajes y se reutilizó el schema de especialidad.

Middleware de validación

ChatGPT

Crear middleware Express que intercepte errores de Zod y devuelva un 400 detallando el campo.

Estructura de validate.middleware.ts.

Se integró con la estructura de errores requerida por la actividad.

CRUD de Médico

ChatGPT

Proponer controller, service y routes para CRUD de /medicos con arquitectura en capas.

Base para GET, POST, PUT y DELETE.

Se adaptó a persistencia JSON y a los códigos HTTP solicitados.

Query parameters

ChatGPT

Agregar filtros de especialidad, fecha y medicoId para turnos, y especialidad/disponible para médicos sin crear endpoints nuevos.

Lógica de filtrado.

Se ajustaron los nombres de parámetros al modelo del proyecto.

Tests de Postman

ChatGPT

Crear scripts para comprobar 200, 201, 400, 404 y JSON Schema.

Scripts pm.test(...).

Se adaptaron a las respuestas reales de TurnosRed y se verificaron manualmente en Postman.

Diagnóstico de errores

ChatGPT

Explicar errores de compilación TypeScript y respuestas ECONNREFUSED/JSON inválido.

Hipótesis y correcciones propuestas.

Se verificó cada corrección ejecutando npm run build y probando en Postman.

Repositorio

Repositorio público:

https://github.com/francoismarcus26-coder/turnos-red
