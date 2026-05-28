import { useState, useEffect } from 'react'

interface Postulante {
  id: number
  nombre: string
  apellidos: string
  email: string
  telefono: string
  ocupacion: string
  estado: string
  fecha_postulacion: string
}

const colorEstado: Record<string, string> = {
  'en_revision': 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  'entrevista':  'bg-green-500/10  text-green-400  border-green-500/20',
  'rechazado':   'bg-red-500/10    text-red-400    border-red-500/20',
  'contratado':  'bg-blue-500/10   text-blue-400   border-blue-500/20',
}

const labelEstado: Record<string, string> = {
  'en_revision': 'En revision',
  'entrevista':  'Entrevista',
  'rechazado':   'Rechazado',
  'contratado':  'Contratado',
}

export default function Postulantes({ ofertaId, ofertaTitulo, onVolver }: {
  ofertaId: number
  ofertaTitulo: string
  onVolver: () => void
}) {
  const [postulantes, setPostulantes] = useState<Postulante[]>([])
  const [loading, setLoading]         = useState(true)
  const [mensaje, setMensaje]         = useState('')
  const [error, setError]             = useState('')

  const token   = localStorage.getItem('token')
  const headers = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }

  const fetchPostulantes = async () => {
    try {
      const res  = await fetch(`https://ichamba-backend-final.onrender.com/api/ofertas/${ofertaId}/postulantes`, { headers })
      const data = await res.json()
      setPostulantes(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchPostulantes() }, [ofertaId])

  const handleEstado = async (p: Postulante, estado: string) => {
    setMensaje('')
    setError('')
    try {
      const res = await fetch(
        `https://ichamba-backend-final.onrender.com/api/ofertas/${ofertaId}/postulaciones/${p.id}`,
        { method: 'PUT', headers, body: JSON.stringify({ estado }) }
      )
      const data = await res.json()
      if (!res.ok) throw new Error(data.message)
      setMensaje('Estado actualizado correctamente')
      fetchPostulantes()
    } catch (err: any) {
      setError(err.message)
    }
  }

  const handleContratar = async (p: Postulante) => {
    setMensaje('')
    setError('')
    try {
      // Agregar al historial
      const res = await fetch('https://ichamba-backend-final.onrender.com/api/historial', {
        method: 'POST', headers,
        body: JSON.stringify({ trabajador_id: p.id, oferta_id: ofertaId })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message)

      // Actualizar estado a contratado
      await fetch(
        `https://ichamba-backend-final.onrender.com/api/ofertas/${ofertaId}/postulaciones/${p.id}`,
        { method: 'PUT', headers, body: JSON.stringify({ estado: 'contratado' }) }
      )

      setMensaje(`${p.nombre} ${p.apellidos} contratado y agregado al historial`)
      fetchPostulantes()
    } catch (err: any) {
      setError(err.message)
    }
  }

  if (loading) return <p className="text-zinc-500 text-sm">Cargando postulantes...</p>

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={onVolver}
          className="text-zinc-400 hover:text-white transition-colors text-lg">←</button>
        <div>
          <h2 className="text-white text-2xl font-black">Postulantes</h2>
          <p className="text-zinc-500 text-sm">{ofertaTitulo}</p>
        </div>
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

      {postulantes.length === 0 ? (
        <div className="text-center py-20 text-zinc-600">
          <p className="text-4xl mb-3">👥</p>
          <p>Aun no hay postulantes para esta oferta</p>
        </div>
      ) : (
        <div className="space-y-4">
          {postulantes.map((p) => (
            <div key={p.id}
              className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-4">

              {/* Info del postulante */}
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#FF4D00] flex items-center justify-center
                                  text-white font-black text-sm shrink-0">
                    {p.nombre.charAt(0)}
                  </div>
                  <div>
                    <p className="text-white font-bold text-sm">{p.nombre} {p.apellidos}</p>
                    <p className="text-zinc-500 text-xs">{p.email} · {p.telefono}</p>
                    <p className="text-zinc-500 text-xs">{p.ocupacion}</p>
                  </div>
                </div>
                <span className={`text-xs font-semibold px-3 py-1.5 rounded-lg border shrink-0
                  ${colorEstado[p.estado] || 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20'}`}>
                  {labelEstado[p.estado] || p.estado}
                </span>
              </div>

              {/* Botones de accion */}
              {p.estado !== 'contratado' && p.estado !== 'rechazado' && (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEstado(p, 'entrevista')}
                    className="flex-1 bg-green-500/10 hover:bg-green-500 border border-green-500/30
                               hover:border-green-500 text-green-400 hover:text-white font-bold
                               text-xs py-2.5 rounded-xl transition-all">
                    📅 Entrevista
                  </button>
                  <button
                    onClick={() => handleContratar(p)}
                    className="flex-1 bg-blue-500/10 hover:bg-blue-500 border border-blue-500/30
                               hover:border-blue-500 text-blue-400 hover:text-white font-bold
                               text-xs py-2.5 rounded-xl transition-all">
                    🎉 Contratar
                  </button>
                  <button
                    onClick={() => handleEstado(p, 'rechazado')}
                    className="flex-1 bg-red-500/10 hover:bg-red-500 border border-red-500/30
                               hover:border-red-500 text-red-400 hover:text-white font-bold
                               text-xs py-2.5 rounded-xl transition-all">
                    ❌ Rechazar
                  </button>
                </div>
              )}

              {/* Mensaje si ya fue procesado */}
              {(p.estado === 'contratado' || p.estado === 'rechazado') && (
                <p className="text-zinc-600 text-xs text-center">
                  {p.estado === 'contratado'
                    ? '✅ Este postulante fue contratado'
                    : '❌ Esta postulacion fue rechazada'}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}