const libroService = require('../services/libro.service');
const { crearLibroDto, actualizarLibroDto, prestarLibroDto, libroResponseDto } = require('../dtos/libro.dto');

// Express 5 captura los errores de funciones async y los manda al manejador de errores,
// por eso no hace falta try/catch aquí

const listar = async (req, res) => {
    const libros = await libroService.listar(req.query);
    res.json(libros.map(libroResponseDto));
};

const estadisticas = async (req, res) => {
    res.json(await libroService.estadisticas());
};

const obtener = async (req, res) => {
    const libro = await libroService.obtenerPorId(req.params.id);
    res.json(libroResponseDto(libro));
};

const crear = async (req, res) => {
    const datos = crearLibroDto(req.body);
    const libro = await libroService.crear(datos);
    res.status(201).json(libroResponseDto(libro));
};

const actualizar = async (req, res) => {
    const datos = actualizarLibroDto(req.body);
    const libro = await libroService.actualizar(req.params.id, datos);
    res.json(libroResponseDto(libro));
};

const prestar = async (req, res) => {
    const datos = prestarLibroDto(req.body);
    const libro = await libroService.prestar(req.params.id, datos);
    res.json(libroResponseDto(libro));
};

const devolver = async (req, res) => {
    const libro = await libroService.devolver(req.params.id);
    res.json(libroResponseDto(libro));
};

const eliminar = async (req, res) => {
    await libroService.eliminar(req.params.id);
    res.status(204).send();
};

module.exports = { listar, estadisticas, obtener, crear, actualizar, prestar, devolver, eliminar };
