# Biblioteca — Backend

API REST de una biblioteca: catálogo de libros, búsqueda, préstamos y devoluciones.
Hecha con **Express 5 + PostgreSQL** y publicada en **Render**.

- API en producción: https://biblioteca-backend-mc.onrender.com
- Frontend: https://github.com/maurocuba/biblioteca-frontend

## Arquitectura

```
src/
├── app.js               # Express, CORS, rutas y manejador de errores
├── config/db.js         # Pool de conexión a PostgreSQL
├── db/                  # schema.sql, seed.sql e init.js (crea la tabla al arrancar)
├── routes/              # Definición de endpoints
├── controllers/         # Reciben la petición y responden
├── services/            # Reglas de negocio (ej. no prestar un libro ya prestado)
├── repositories/        # Consultas SQL
├── dtos/                # Validación de entrada y forma de la respuesta
├── entities/            # Mapeo fila SQL → objeto Libro
└── utils/http-error.js  # Error con código HTTP
```

## Endpoints

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/health` | Comprueba que la API y la base de datos responden |
| GET | `/api/libros` | Lista libros. Filtros opcionales: `?q=texto` y `?disponible=true\|false` |
| GET | `/api/libros/estadisticas` | Total, disponibles, prestados y cantidad de géneros |
| GET | `/api/libros/:id` | Obtiene un libro |
| POST | `/api/libros` | Crea un libro: `{ "titulo", "autor", "genero"?, "anio"? }` |
| PUT | `/api/libros/:id` | Actualiza parcialmente un libro |
| PATCH | `/api/libros/:id/prestar` | Presta un libro: `{ "prestadoA": "Nombre" }` (409 si ya está prestado) |
| PATCH | `/api/libros/:id/devolver` | Devuelve un libro (409 si no estaba prestado) |
| DELETE | `/api/libros/:id` | Elimina un libro |

Errores: `400` datos inválidos, `404` no encontrado, `409` conflicto de préstamo. En `postman/` hay una colección lista para importar.

## Ejecutar localmente

1. `npm install`
2. Copia `.env.example` a `.env` y completa `DATABASE_URL` con **tu propia** base PostgreSQL.
3. `npm run dev` y visita `http://localhost:3000/api/libros`.

La tabla `libros` (y unos datos de ejemplo) se crean automáticamente al arrancar. También puedes crearla a mano con `npm run db:init`.

## Despliegue en Render

El archivo `render.yaml` es un Blueprint que crea la base PostgreSQL y el servicio web ya conectados:
**New → Blueprint** en Render, elegir este repositorio y aplicar. `DATABASE_URL` se inyecta sola desde la base; no hay credenciales en el repositorio.

> El plan gratuito de Render duerme el servicio tras ~15 min sin uso; la primera petición puede tardar hasta un minuto.
