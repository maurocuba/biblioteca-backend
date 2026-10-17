const { Router } = require('express');
const libroController = require('../controllers/libro.controller');

const router = Router();

router.get('/', libroController.listar);
router.get('/estadisticas', libroController.estadisticas);
router.get('/:id', libroController.obtener);
router.post('/', libroController.crear);
router.put('/:id', libroController.actualizar);
router.patch('/:id/prestar', libroController.prestar);
router.patch('/:id/devolver', libroController.devolver);
router.delete('/:id', libroController.eliminar);

module.exports = router;
