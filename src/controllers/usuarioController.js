const { pool } = require('../config/db')

const getPerfil = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, nombre, apellidos, telefono, email, fecha_nacimiento, ocupacion, rol, created_at
       FROM usuarios WHERE id = $1`,
      [req.usuario.id]
    )
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' })
    }
    res.json(result.rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Error interno del servidor' })
  }
}

const updatePerfil = async (req, res) => {
  const { nombre, apellidos, telefono, fecha_nacimiento, ocupacion } = req.body

  if (!nombre || !apellidos) {
    return res.status(400).json({ message: 'Nombre y apellidos son requeridos' })
  }

  try {
    const result = await pool.query(
      `UPDATE usuarios
       SET nombre = $1, apellidos = $2, telefono = $3, fecha_nacimiento = $4, ocupacion = $5
       WHERE id = $6
       RETURNING id, nombre, apellidos, telefono, email, fecha_nacimiento, ocupacion, rol`,
      [nombre, apellidos, telefono, fecha_nacimiento, ocupacion, req.usuario.id]
    )

    const updated = result.rows[0]

    // Actualizar nombre en localStorage también
    res.json({
      message: 'Perfil actualizado correctamente',
      usuario: {
        id:        updated.id,
        nombre:    `${updated.nombre} ${updated.apellidos}`,
        email:     updated.email,
        rol:       updated.rol,
        telefono:  updated.telefono,
        ocupacion: updated.ocupacion,
        fecha_nacimiento: updated.fecha_nacimiento
      }
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Error interno del servidor' })
  }
}

module.exports = { getPerfil, updatePerfil }