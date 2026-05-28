const express = require('express')
const router  = express.Router()
const { verificarToken } = require('../middlewares/authMiddleware')
const {
  crearOferta,
  getMisOfertas,
  getPostulantesPorOferta,
  deleteOferta,
  getOfertasPublicas,
  postularse
} = require('../controllers/ofertaController')

router.get('/publicas',             getOfertasPublicas)
router.post('/',                    verificarToken, crearOferta)
router.get('/mis-ofertas',          verificarToken, getMisOfertas)
router.post('/:id/postular',        verificarToken, postularse)
router.get('/:id/postulantes',      verificarToken, getPostulantesPorOferta)
router.delete('/:id',               verificarToken, deleteOferta)

module.exports = router