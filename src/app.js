require('dotenv').config();
const express = require('express');
const cors = require('cors');
const pool = require('./config/db');
const { inicializarBD } = require('./db/init');
const libroRoutes = require('./routes/libro.routes');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.json({
        mensaje: 'API Biblioteca funcionando',
        endpoints: [
            'GET    /api/health',
            'GET    /api/libros?q=texto&disponible=true|false',
            'GET    /api/libros/estadisticas',
            'GET    /api/libros/:id',
            'POST   /api/libros',
            'PUT    /api/libros/:id',
            'PATCH  /api/libros/:id/prestar',
            'PATCH  /api/libros/:id/devolver',
            'DELETE /api/libros/:id',
        ],
    });
});

// Comprueba que Express responde y que la base de datos está accesible
app.get('/api/health', async (req, res) => {
    try {
        await pool.query('SELECT 1');
        res.json({ status: 'ok', db: 'conectada' });
    } catch (err) {
        res.status(503).json({ status: 'error', db: 'sin conexión' });
    }
});

app.use('/api/libros', libroRoutes);

// Ruta no encontrada
app.use((req, res) => {
    res.status(404).json({ error: 'Ruta no encontrada' });
});

// Manejador de errores: HttpError usa su status, cualquier otro error es 500
app.use((err, req, res, next) => {
    if (err.type === 'entity.parse.failed') {
        return res.status(400).json({ error: 'JSON inválido' });
    }
    if (err.status) {
        return res.status(err.status).json({ error: err.message });
    }
    console.error(err);
    res.status(500).json({ error: 'Error interno del servidor' });
});

const port = process.env.PORT || 3000;

// Crea la tabla (y datos de ejemplo) antes de aceptar peticiones
inicializarBD()
    .then(() => {
        app.listen(port, () => {
            console.log(`Server is running on http://localhost:${port}`);
        });
    })
    .catch((err) => {
        console.error('No se pudo inicializar la base de datos ❌', err.message);
        process.exit(1);
    });

module.exports = app;
