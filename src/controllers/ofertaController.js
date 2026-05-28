const getOfertasPublicas = async (req, res) => {
  try {
    const { busqueda, tipo_contrato, es_practicas } = req.query

    let query = `
      SELECT o.*, u.nombre AS empleador_nombre, u.apellidos AS empleador_apellidos
      FROM ofertas o
      JOIN usuarios u ON u.id = o.empleador_id
      WHERE o.activa = true
    `
    const params = []
    let i = 1

    if (busqueda) {
      query += ` AND (o.titulo ILIKE $${i} OR o.empresa ILIKE $${i} OR o.lugar ILIKE $${i})`
      params.push(`%${busqueda}%`)
      i++
    }
    if (tipo_contrato) {
      query += ` AND o.tipo_contrato = $${i}`
      params.push(tipo_contrato)
      i++
    }
    if (es_practicas === 'true') {
      query += ` AND o.es_practicas = true`
    }

    query += ` ORDER BY o.created_at DESC`

    const result = await pool.query(query, params)
    res.json(result.rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Error interno del servidor' })
  }
}
const postularse = async (req, res) => {
  const ofertaId  = req.params.id
  const usuarioId = req.usuario.id

  try {
    // Verificar que la oferta existe
    const oferta = await pool.query('SELECT * FROM ofertas WHERE id = $1', [ofertaId])
    if (oferta.rows.length === 0) {
      return res.status(404).json({ message: 'Oferta no encontrada' })
    }

    // Verificar que no se haya postulado ya
    const yaPostulado = await pool.query(
      'SELECT id FROM postulaciones WHERE oferta_id = $1 AND usuario_id = $2',
      [ofertaId, usuarioId]
    )
    if (yaPostulado.rows.length > 0) {
      return res.status(409).json({ message: 'Ya te postulaste a esta oferta' })
    }

    // Crear postulación
    await pool.query(
      'INSERT INTO postulaciones (oferta_id, usuario_id) VALUES ($1, $2)',
      [ofertaId, usuarioId]
    )

    // Notificar al empleador
    const usuario = await pool.query(
      'SELECT nombre, apellidos FROM usuarios WHERE id = $1',
      [usuarioId]
    )
    const nombre = `${usuario.rows[0].nombre} ${usuario.rows[0].apellidos}`

    await pool.query(
      'INSERT INTO notificaciones (usuario_id, texto) VALUES ($1, $2)',
      [oferta.rows[0].empleador_id, `${nombre} se postuló a tu oferta "${oferta.rows[0].titulo}"`]
    )

    res.status(201).json({ message: '¡Postulación enviada correctamente!' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Error interno del servidor' })
  }
}
module.exports = { 
  crearOferta, 
  getMisOfertas, 
  getPostulantesPorOferta, 
  deleteOferta,
  getOfertasPublicas,
  postularse
}