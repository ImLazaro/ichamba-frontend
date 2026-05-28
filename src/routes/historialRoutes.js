const express = require('express')
const router  = express.Router()
const { verificarToken } = require('../middlewares/authMiddleware')
const {
  getHistorial,
  agregarContratado,
  eliminarContratado,
  actualizarNotas
} = require('../controllers/historialController')

router.get('/',         verificarToken, getHistorial)
router.post('/',        verificarToken, agregarContratado)
router.delete('/:id',   verificarToken, eliminarContratado)
router.put('/:id',      verificarToken, actualizarNotas)

module.exports = router