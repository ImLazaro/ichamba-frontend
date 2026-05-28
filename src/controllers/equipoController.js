const { pool } = require('../config/db')

// Genera código único de 6 caracteres
const generarCodigo = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  return Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
}

const crearEquipo = async (req, res) => {
  const { nombre, descripcion } = req.body
  if (!nombre) return res.status(400).json({ message: 'El nombre del equipo es requerido' })

  try {
    let codigo = generarCodigo()
    // Verificar que el código no exista
    let existe = await pool.query('SELECT id FROM equipos WHERE codigo = $1', [codigo])
    while (existe.rows.length > 0) {
      codigo = generarCodigo()
      existe = await pool.query('SELECT id FROM equipos WHERE codigo = $1', [codigo])
    }

    const result = await pool.query(
      `INSERT INTO equipos (nombre, descripcion, codigo, lider_id)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [nombre, descripcion, codigo, req.usuario.id]
    )

    const equipo = result.rows[0]

    // Agregar al líder como miembro aceptado
    await pool.query(
      `INSERT INTO equipo_miembros (equipo_id, usuario_id, estado)
       VALUES ($1, $2, 'aceptado')`,
      [equipo.id, req.usuario.id]
    )

    res.status(201).json({ message: 'Equipo creado correctamente', equipo })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Error interno del servidor' })
  }
}

const getMisEquipos = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT e.*, 
        u.nombre AS lider_nombre, u.apellidos AS lider_apellidos,
        em.estado AS mi_estado,
        (SELECT COUNT(*) FROM equipo_miembros WHERE equipo_id = e.id AND estado = 'aceptado') AS total_miembros
       FROM equipos e
       JOIN equipo_miembros em ON em.equipo_id = e.id AND em.usuario_id = $1
       JOIN usuarios u ON u.id = e.lider_id
       ORDER BY e.created_at DESC`,
      [req.usuario.id]
    )
    res.json(result.rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Error interno del servidor' })
  }
}

const invitarMiembro = async (req, res) => {
  const { email } = req.body
  const equipoId  = req.params.id

  if (!email) return res.status(400).json({ message: 'El email es requerido' })

  try {
    // Verificar que el solicitante sea el líder
    const equipo = await pool.query('SELECT * FROM equipos WHERE id = $1', [equipoId])
    if (equipo.rows.length === 0) return res.status(404).json({ message: 'Equipo no encontrado' })
    if (equipo.rows[0].lider_id !== req.usuario.id) {
      return res.status(403).json({ message: 'Solo el líder puede invitar miembros' })
    }

    // Buscar usuario por email
    const usuario = await pool.query('SELECT id, nombre, apellidos FROM usuarios WHERE email = $1', [email])
    if (usuario.rows.length === 0) {
      return res.status(404).json({ message: 'No existe un usuario con ese correo' })
    }

    const invitado = usuario.rows[0]

    // Verificar que no esté ya en el equipo
    const yaExiste = await pool.query(
      'SELECT id FROM equipo_miembros WHERE equipo_id = $1 AND usuario_id = $2',
      [equipoId, invitado.id]
    )
    if (yaExiste.rows.length > 0) {
      return res.status(409).json({ message: 'Este usuario ya está en el equipo o tiene invitación pendiente' })
    }

    await pool.query(
      `INSERT INTO equipo_miembros (equipo_id, usuario_id, estado) VALUES ($1, $2, 'pendiente')`,
      [equipoId, invitado.id]
    )

    // Crear notificación para el invitado
    await pool.query(
      `INSERT INTO notificaciones (usuario_id, texto)
       VALUES ($1, $2)`,
      [invitado.id, `Te han invitado a unirte al equipo "${equipo.rows[0].nombre}"`]
    )

    res.json({ message: `Invitación enviada a ${invitado.nombre} ${invitado.apellidos}` })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Error interno del servidor' })
  }
}

const responderInvitacion = async (req, res) => {
  const { accion } = req.body // 'aceptar' o 'rechazar'
  const equipoId   = req.params.id

  if (!['aceptar', 'rechazar'].includes(accion)) {
    return res.status(400).json({ message: 'Acción inválida' })
  }

  try {
    const estado = accion === 'aceptar' ? 'aceptado' : 'rechazado'
    await pool.query(
      `UPDATE equipo_miembros SET estado = $1
       WHERE equipo_id = $2 AND usuario_id = $3`,
      [estado, equipoId, req.usuario.id]
    )
    res.json({ message: accion === 'aceptar' ? '¡Te uniste al equipo!' : 'Invitación rechazada' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Error interno del servidor' })
  }
}

const getEquipoDetalle = async (req, res) => {
  try {
    const equipo = await pool.query('SELECT * FROM equipos WHERE id = $1', [req.params.id])
    if (equipo.rows.length === 0) return res.status(404).json({ message: 'Equipo no encontrado' })

    const miembros = await pool.query(
      `SELECT u.id, u.nombre, u.apellidos, u.email, u.ocupacion, em.estado, em.created_at
       FROM equipo_miembros em
       JOIN usuarios u ON u.id = em.usuario_id
       WHERE em.equipo_id = $1
       ORDER BY em.created_at ASC`,
      [req.params.id]
    )

    res.json({ ...equipo.rows[0], miembros: miembros.rows })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Error interno del servidor' })
  }
}

module.exports = { crearEquipo, getMisEquipos, invitarMiembro, responderInvitacion, getEquipoDetalle }const { pool } = require('../config/db')

// Genera código único de 6 caracteres
const generarCodigo = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  return Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
}

const crearEquipo = async (req, res) => {
  const { nombre, descripcion } = req.body
  if (!nombre) return res.status(400).json({ message: 'El nombre del equipo es requerido' })

  try {
    let codigo = generarCodigo()
    // Verificar que el código no exista
    let existe = await pool.query('SELECT id FROM equipos WHERE codigo = $1', [codigo])
    while (existe.rows.length > 0) {
      codigo = generarCodigo()
      existe = await pool.query('SELECT id FROM equipos WHERE codigo = $1', [codigo])
    }

    const result = await pool.query(
      `INSERT INTO equipos (nombre, descripcion, codigo, lider_id)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [nombre, descripcion, codigo, req.usuario.id]
    )

    const equipo = result.rows[0]

    // Agregar al líder como miembro aceptado
    await pool.query(
      `INSERT INTO equipo_miembros (equipo_id, usuario_id, estado)
       VALUES ($1, $2, 'aceptado')`,
      [equipo.id, req.usuario.id]
    )

    res.status(201).json({ message: 'Equipo creado correctamente', equipo })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Error interno del servidor' })
  }
}

const getMisEquipos = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT e.*, 
        u.nombre AS lider_nombre, u.apellidos AS lider_apellidos,
        em.estado AS mi_estado,
        (SELECT COUNT(*) FROM equipo_miembros WHERE equipo_id = e.id AND estado = 'aceptado') AS total_miembros
       FROM equipos e
       JOIN equipo_miembros em ON em.equipo_id = e.id AND em.usuario_id = $1
       JOIN usuarios u ON u.id = e.lider_id
       ORDER BY e.created_at DESC`,
      [req.usuario.id]
    )
    res.json(result.rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Error interno del servidor' })
  }
}

const invitarMiembro = async (req, res) => {
  const { email } = req.body
  const equipoId  = req.params.id

  if (!email) return res.status(400).json({ message: 'El email es requerido' })

  try {
    // Verificar que el solicitante sea el líder
    const equipo = await pool.query('SELECT * FROM equipos WHERE id = $1', [equipoId])
    if (equipo.rows.length === 0) return res.status(404).json({ message: 'Equipo no encontrado' })
    if (equipo.rows[0].lider_id !== req.usuario.id) {
      return res.status(403).json({ message: 'Solo el líder puede invitar miembros' })
    }

    // Buscar usuario por email
    const usuario = await pool.query('SELECT id, nombre, apellidos FROM usuarios WHERE email = $1', [email])
    if (usuario.rows.length === 0) {
      return res.status(404).json({ message: 'No existe un usuario con ese correo' })
    }

    const invitado = usuario.rows[0]

    // Verificar que no esté ya en el equipo
    const yaExiste = await pool.query(
      'SELECT id FROM equipo_miembros WHERE equipo_id = $1 AND usuario_id = $2',
      [equipoId, invitado.id]
    )
    if (yaExiste.rows.length > 0) {
      return res.status(409).json({ message: 'Este usuario ya está en el equipo o tiene invitación pendiente' })
    }

    await pool.query(
      `INSERT INTO equipo_miembros (equipo_id, usuario_id, estado) VALUES ($1, $2, 'pendiente')`,
      [equipoId, invitado.id]
    )

    // Crear notificación para el invitado
    await pool.query(
      `INSERT INTO notificaciones (usuario_id, texto)
       VALUES ($1, $2)`,
      [invitado.id, `Te han invitado a unirte al equipo "${equipo.rows[0].nombre}"`]
    )

    res.json({ message: `Invitación enviada a ${invitado.nombre} ${invitado.apellidos}` })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Error interno del servidor' })
  }
}

const responderInvitacion = async (req, res) => {
  const { accion } = req.body // 'aceptar' o 'rechazar'
  const equipoId   = req.params.id

  if (!['aceptar', 'rechazar'].includes(accion)) {
    return res.status(400).json({ message: 'Acción inválida' })
  }

  try {
    const estado = accion === 'aceptar' ? 'aceptado' : 'rechazado'
    await pool.query(
      `UPDATE equipo_miembros SET estado = $1
       WHERE equipo_id = $2 AND usuario_id = $3`,
      [estado, equipoId, req.usuario.id]
    )
    res.json({ message: accion === 'aceptar' ? '¡Te uniste al equipo!' : 'Invitación rechazada' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Error interno del servidor' })
  }
}

const getEquipoDetalle = async (req, res) => {
  try {
    const equipo = await pool.query('SELECT * FROM equipos WHERE id = $1', [req.params.id])
    if (equipo.rows.length === 0) return res.status(404).json({ message: 'Equipo no encontrado' })

    const miembros = await pool.query(
      `SELECT u.id, u.nombre, u.apellidos, u.email, u.ocupacion, em.estado, em.created_at
       FROM equipo_miembros em
       JOIN usuarios u ON u.id = em.usuario_id
       WHERE em.equipo_id = $1
       ORDER BY em.created_at ASC`,
      [req.params.id]
    )

    res.json({ ...equipo.rows[0], miembros: miembros.rows })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Error interno del servidor' })
  }
}

module.exports = { crearEquipo, getMisEquipos, invitarMiembro, responderInvitacion, getEquipoDetalle }