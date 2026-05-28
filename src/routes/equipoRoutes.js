const express = require('express')
const router  = express.Router()
const { verificarToken } = require('../middlewares/authMiddleware')
const {
  crearEquipo,
  getMisEquipos,
  invitarMiembro,
  responderInvitacion,
  getEquipoDetalle
} = require('../controllers/equipoController')

router.post('/',                      verificarToken, crearEquipo)
router.get('/mis-equipos',            verificarToken, getMisEquipos)
router.post('/:id/invitar',           verificarToken, invitarMiembro)
router.put('/:id/responder',          verificarToken, responderInvitacion)
router.get('/:id',                    verificarToken, getEquipoDetalle)

module.exports = router