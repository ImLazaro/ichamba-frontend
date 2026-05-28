const express = require('express')
const router  = express.Router()
const { verificarToken } = require('../middlewares/authMiddleware')
const { getPerfil, updatePerfil } = require('../controllers/usuarioController')

router.get('/perfil',    verificarToken, getPerfil)
router.put('/perfil',    verificarToken, updatePerfil)

module.exports = router