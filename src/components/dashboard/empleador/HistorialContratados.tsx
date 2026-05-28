import { useState, useEffect } from 'react'

interface Contratado {
  id: number
  trabajador_id: number
  nombre: string
  apellidos: string
  email: string
  telefono: string
  ocupacion: string
  oferta_titulo: string
  fecha: string
  notas: string
}

const API = 'https://ichamba-backend-final.onrender.com/api/historial'

export default function HistorialContratados() {
  const [historial, setHistorial]     = useState<Contratado[]>([])
  const [loading, setLoading]         = useState(true)
  const [mensaje, setMensaje]         = useState('')
  const [error, setError]             = useState('')
  const [editandoId, setEditandoId]   = useState<number | null>(null)
  const [notaEdit, setNotaEdit]       = useState('')
  const [busqueda, setBusqueda]       = useState('')

  const token   = localStorage.getItem('token')
  const headers = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }

  const fetchHistorial = async () => {
    try {
      const res  = await fetch(API, { headers })
      const data = await res.json()
      setHistorial(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchHistorial() }, [])

  const handleEliminar = async (id: number) => {
    if (!confirm('¿Eliminar del historial?')) return
    try {
      const res  = await fetch(`${API}/${id}`, { method: 'DELETE', headers })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message)
      setMensaje('Eliminado del historial')
      fetchHistorial()
    } catch (err: any) {
      setError(err.message)
    }
  }

  const handleGuardarNota = async (id: number) => {
    try {
      const res  = await fetch(`${API}/${id}`, {
        method: 'PUT', headers, body: JSON.stringify({ notas: notaEdit })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message)
      setMensaje('Notas actualizadas')
      setEditandoId(null)
      fetchHistorial()
    } catch (err: any) {
      setError(err.message)
    }
  }

  const handleContactar = (email: string) => {
    window.open(`mailto:${email}`, '_blank')
  }

  const filtrados = historial.filter(c =>
    `${c.nombre} ${c.apellidos} ${c.email} ${c.oferta_titulo}`
      .toLowerCase().includes(busqueda.toLowerCase())
  )

  if (loading) return <p className="text-zinc-500 text-sm">Cargando historial...</p>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-white text-2xl font-black">Historial de contratados</h2>
        <span className="text-zinc-500 text-sm">{historial.length} personas</span>
      </div>

      {mensaje && (
        <div className="bg-green-500/10 border border-green-500/30 text-green-400 text-sm rounded-xl px-4 py-3">
          ✅ {mensaje}
        </div>
      )}
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-xl px-4 py-3">
          ⚠️ {error}
        </div>
      )}

      {/* Buscador */}
      {historial.length > 0 && (
        <input
          value={busqueda}
          onChange={e => setBusqueda(e.target.value)}
          placeholder="🔍 Buscar por nombre, correo u oferta..."
          className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-xl px-4 py-3 text-sm
                     focus:outline-none focus:border-[#FF4D00] placeholder:text-zinc-600"
        />
      )}

      {filtrados.length === 0 ? (
        <div className="text-center py-20 text-zinc-600">
          <p className="text-4xl mb-3">📋</p>
          <p>
            {historial.length === 0
              ? 'Aún no tienes contratados en tu historial'
              : 'No se encontraron resultados'}
          </p>
          <p className="text-sm mt-1 text-zinc-700">
            Los contratados aparecen aquí cuando marcas a un postulante como contratado
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtrados.map(c => (
            <div key={c.id}
              className="bg-zinc-900 border border-zinc-800 hover:border-zinc-700
                         rounded-2xl p-5 space-y-4 transition-all">

              {/* Header */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-[#FF4D00] flex items-center justify-center
                                  text-white font-black text-lg shrink-0">
                    {c.nombre.charAt(0)}
                  </div>
                  <div>
                    <p className="text-white font-bold">{c.nombre} {c.apellidos}</p>
                    <p className="text-zinc-500 text-xs">{c.email}</p>
                    {c.telefono && <p className="text-zinc-500 text-xs">📞 {c.telefono}</p>}
                    {c.ocupacion && <p className="text-zinc-400 text-xs mt-0.5">{c.ocupacion}</p>}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-zinc-500 text-xs">
                    {new Date(c.fecha).toLocaleDateString('es-MX', {
                      day: 'numeric', month: 'short', year: 'numeric'
                    })}
                  </p>
                  {c.oferta_titulo && (
                    <p className="text-[#FF4D00] text-xs font-semibold mt-1">
                      {c.oferta_titulo}
                    </p>
                  )}
                </div>
              </div>

              {/* Notas */}
              {editandoId === c.id ? (
                <div className="space-y-2">
                  <textarea
                    value={notaEdit}
                    onChange={e => setNotaEdit(e.target.value)}
                    rows={3} placeholder="Escribe una nota sobre este trabajador..."
                    className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-xl px-4 py-3 text-sm
                               focus:outline-none focus:border-[#FF4D00] resize-none placeholder:text-zinc-600"
                  />
                  <div className="flex gap-2">
                    <button onClick={() => setEditandoId(null)}
                      className="flex-1 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700
                                 text-zinc-300 text-xs font-bold py-2 rounded-lg transition-all">
                      Cancelar
                    </button>
                    <button onClick={() => handleGuardarNota(c.id)}
                      className="flex-1 bg-[#FF4D00] hover:bg-orange-500 text-white text-xs
                                 font-bold py-2 rounded-lg transition-all">
                      Guardar nota
                    </button>
                  </div>
                </div>
              ) : (
                c.notas && (
                  <div className="bg-zinc-800 rounded-xl px-4 py-3">
                    <p className="text-zinc-400 text-xs font-semibold uppercase tracking-wider mb-1">Nota</p>
                    <p className="text-zinc-300 text-sm">{c.notas}</p>
                  </div>
                )
              )}

              {/* Acciones */}
              <div className="flex gap-2 pt-1">
                <button onClick={() => handleContactar(c.email)}
                  className="flex-1 bg-blue-500/10 hover:bg-blue-500 border border-blue-500/30
                             hover:border-blue-500 text-blue-400 hover:text-white font-bold text-xs
                             py-2.5 rounded-xl transition-all">
                  ✉️ Contactar
                </button>
                <button
                  onClick={() => { setEditandoId(c.id); setNotaEdit(c.notas || '') }}
                  className="flex-1 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700
                             text-zinc-300 font-bold text-xs py-2.5 rounded-xl transition-all">
                  📝 {c.notas ? 'Editar nota' : 'Agregar nota'}
                </button>
                <button onClick={() => handleEliminar(c.id)}
                  className="bg-red-500/10 hover:bg-red-500 border border-red-500/30
                             hover:border-red-500 text-red-400 hover:text-white font-bold text-xs
                             px-4 py-2.5 rounded-xl transition-all">
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}