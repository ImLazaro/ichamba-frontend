const { pool } = require('../config/db')

const getHistorial = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT h.id, h.fecha, h.notas,
              u.id AS trabajador_id, u.nombre, u.apellidos, u.email, u.telefono, u.ocupacion,
              o.titulo AS oferta_titulo
       FROM historial_contratados h
       JOIN usuarios u ON u.id = h.trabajador_id
       LEFT JOIN ofertas o ON o.id = h.oferta_id
       WHERE h.empleador_id = $1
       ORDER BY h.fecha DESC`,
      [req.usuario.id]
    )
    res.json(result.rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Error interno del servidor' })
  }
}

const agregarContratado = async (req, res) => {
  const { trabajador_id, oferta_id, notas } = req.body

  if (!trabajador_id) {
    return res.status(400).json({ message: 'El trabajador es requerido' })
  }

  try {
    // Verificar que el trabajador existe
    const trabajador = await pool.query(
      'SELECT id, nombre, apellidos FROM usuarios WHERE id = $1',
      [trabajador_id]
    )
    if (trabajador.rows.length === 0) {
      return res.status(404).json({ message: 'Trabajador no encontrado' })
    }

    const result = await pool.query(
      `INSERT INTO historial_contratados (empleador_id, trabajador_id, oferta_id, notas)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (empleador_id, trabajador_id, oferta_id) DO NOTHING
       RETURNING *`,
      [req.usuario.id, trabajador_id, oferta_id || null, notas || null]
    )

    if (result.rows.length === 0) {
      return res.status(409).json({ message: 'Este trabajador ya está en el historial para esa oferta' })
    }

    // Notificar al trabajador
    await pool.query(
      `INSERT INTO notificaciones (usuario_id, texto) VALUES ($1, $2)`,
      [trabajador_id, `¡Felicidades! Has sido marcado como contratado.`]
    )

    res.status(201).json({ message: 'Agregado al historial correctamente' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Error interno del servidor' })
  }
}

const eliminarContratado = async (req, res) => {
  try {
    await pool.query(
      'DELETE FROM historial_contratados WHERE id = $1 AND empleador_id = $2',
      [req.params.id, req.usuario.id]
    )
    res.json({ message: 'Eliminado del historial' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Error interno del servidor' })
  }
}

const actualizarNotas = async (req, res) => {
  const { notas } = req.body
  try {
    await pool.query(
      'UPDATE historial_contratados SET notas = $1 WHERE id = $2 AND empleador_id = $3',
      [notas, req.params.id, req.usuario.id]
    )
    res.json({ message: 'Notas actualizadas' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Error interno del servidor' })
  }
}

module.exports = { getHistorial, agregarContratado, eliminarContratado, actualizarNotas }