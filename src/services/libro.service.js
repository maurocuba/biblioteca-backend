const libroRepository = require('../repositories/libro.repository');
const HttpError = require('../utils/http-error');

const validarId = (id) => {
    const numero = Number(id);
    if (!Number.isInteger(numero) || numero <= 0) throw new HttpError(400, 'El id debe ser un entero positivo');
    return numero;
};

const listar = ({ q, disponible } = {}) => {
    const filtros = {};
    if (typeof q === 'string' && q.trim() !== '') filtros.q = q.trim();
    if (disponible === 'true') filtros.disponible = true;
    else if (disponible === 'false') filtros.disponible = false;
    else if (disponible !== undefined) throw new HttpError(400, '"disponible" debe ser true o false');
    return libroRepository.findAll(filtros);
};

const obtenerPorId = async (id) => {
    const libro = await libroRepository.findById(validarId(id));
    if (!libro) throw new HttpError(404, 'Libro no encontrado');
    return libro;
};

const crear = (datos) => libroRepository.create(datos);

// Actualización parcial: los campos que no se envían conservan su valor actual
const actualizar = async (id, datos) => {
    const actual = await obtenerPorId(id);
    return libroRepository.update(actual.id, {
        titulo: datos.titulo ?? actual.titulo,
        autor: datos.autor ?? actual.autor,
        genero: datos.genero ?? actual.genero,
        anio: datos.anio !== undefined ? datos.anio : actual.anio,
    });
};

const prestar = async (id, { prestadoA }) => {
    const libro = await obtenerPorId(id);
    if (!libro.disponible) throw new HttpError(409, `El libro ya está prestado a ${libro.prestadoA}`);
    return libroRepository.updatePrestamo(libro.id, { disponible: false, prestadoA });
};

const devolver = async (id) => {
    const libro = await obtenerPorId(id);
    if (libro.disponible) throw new HttpError(409, 'El libro no está prestado');
    return libroRepository.updatePrestamo(libro.id, { disponible: true, prestadoA: null });
};

const eliminar = async (id) => {
    const eliminado = await libroRepository.remove(validarId(id));
    if (!eliminado) throw new HttpError(404, 'Libro no encontrado');
};

const estadisticas = () => libroRepository.stats();

module.exports = { listar, obtenerPorId, crear, actualizar, prestar, devolver, eliminar, estadisticas };
