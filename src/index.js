const express        = require('express')
const cors           = require('cors')
const authRoutes     = require('./routes/authRoutes')
const ofertaRoutes   = require('./routes/ofertaRoutes')
const usuarioRoutes  = require('./routes/usuarioRoutes')
const equipoRoutes   = require('./routes/equipoRoutes')
const historialRoutes = require('./routes/historialRoutes')  // ← agregar
require('dotenv').config()

const app  = express()
const PORT = process.env.PORT || 4000

app.use(cors({ origin: 'http://localhost:5173' }))
app.use(express.json())

app.use('/api/auth',      authRoutes)
app.use('/api/ofertas',   ofertaRoutes)
app.use('/api/usuarios',  usuarioRoutes)
app.use('/api/equipos',   equipoRoutes)
app.use('/api/historial', historialRoutes)                   // ← agregar

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'iChamba API corriendo ✅' })
})

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`)
})