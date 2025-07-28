const express = require('express');
const router = express.Router();
const estudianteController = require('../controllers/estudianteController');
const auth = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');

// Solo admin puede ver todos y crear
router.get('/', auth, role(['admin']), estudianteController.getAll);
router.post('/', auth, role(['admin']), estudianteController.create);

// Admin puede editar cualquier estudiante, estudiante solo el suyo
router.put('/:id', auth, (req, res, next) => {
  if (req.user.role === 'admin' || req.user.id === req.params.id) return next();
  return res.status(403).json({ msg: 'Acceso denegado' });
}, estudianteController.update);

// Solo el estudiante puede ver su perfil
router.get('/:id', auth, (req, res, next) => {
  if (req.user.role === 'admin' || req.user.id === req.params.id) return next();
  return res.status(403).json({ msg: 'Acceso denegado' });
}, estudianteController.getById);

// Solo admin puede eliminar
router.delete('/:id', auth, role(['admin']), estudianteController.delete);

module.exports = router;
