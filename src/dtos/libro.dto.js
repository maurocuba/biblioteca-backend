const HttpError = require('../utils/http-error');

const ANIO_ACTUAL = new Date().getFullYear();

const validarTexto = (valor, campo, max, errores) => {
    if (typeof valor !== 'string' || valor.trim() === '') {
        errores.push(`"${campo}" debe ser un texto no vacío`);
        return undefined;
    }
    if (valor.trim().length > max) {
        errores.push(`"${campo}" no puede superar ${max} caracteres`);
        return undefined;
    }
    return valor.trim();
};

// Valida y filtra lo que manda el cliente; solo deja pasar los campos permitidos
const validarCampos = (body, { parcial }) => {
    const errores = [];
    const datos = {};
    const { titulo, autor, genero, anio } = body || {};

    if (titulo !== undefined) datos.titulo = validarTexto(titulo, 'titulo', 150, errores);
    else if (!parcial) errores.push('"titulo" es obligatorio');

    if (autor !== undefined) datos.autor = validarTexto(autor, 'autor', 100, errores);
    else if (!parcial) errores.push('"autor" es obligatorio');

    if (genero !== undefined) datos.genero = validarTexto(genero, 'genero', 50, errores);
    else if (!parcial) datos.genero = 'General';

    if (anio !== undefined && anio !== null && anio !== '') {
        if (!Number.isInteger(anio) || anio < 0 || anio > ANIO_ACTUAL) {
            errores.push(`"anio" debe ser un entero entre 0 y ${ANIO_ACTUAL}`);
        } else {
            datos.anio = anio;
        }
    } else if (!parcial) {
        datos.anio = null;
    }

    if (parcial && Object.keys(datos).length === 0 && errores.length === 0) {
        errores.push('Debes enviar al menos un campo: titulo, autor, genero o anio');
    }

    if (errores.length > 0) throw new HttpError(400, errores.join(', '));
    return datos;
};

// DTO de entrada para POST
const crearLibroDto = (body) => validarCampos(body, { parcial: false });

// DTO de entrada para PUT (todos los campos opcionales)
const actualizarLibroDto = (body) => validarCampos(body, { parcial: true });

// DTO de entrada para PATCH /prestar
const prestarLibroDto = (body) => {
    const errores = [];
    const prestadoA = validarTexto((body || {}).prestadoA, 'prestadoA', 100, errores);
    if (errores.length > 0) throw new HttpError(400, errores.join(', '));
    return { prestadoA };
};

// DTO de salida: lo que la API devuelve al cliente
const libroResponseDto = (libro) => ({
    id: libro.id,
    titulo: libro.titulo,
    autor: libro.autor,
    genero: libro.genero,
    anio: libro.anio,
    disponible: libro.disponible,
    prestadoA: libro.prestadoA,
    createdAt: libro.createdAt,
});

module.exports = { crearLibroDto, actualizarLibroDto, prestarLibroDto, libroResponseDto };
