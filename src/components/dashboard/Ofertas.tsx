import { useState, useEffect } from 'react'

interface Oferta {
  id: number
  titulo: string
  empresa: string
  lugar: string
  tipo_contrato: string
  salario: string
  descripcion: string
  requisitos: string
  es_practicas: boolean
  empleador_nombre: string
  empleador_apellidos: string
  created_at: string
}

const colorTipo: Record<string, string> = {
  'Tiempo completo': 'bg-green-500/10 text-green-400 border-green-500/20',
  'Medio tiempo':    'bg-blue-500/10  text-blue-400  border-blue-500/20',
  'Prácticas':       'bg-purple-500/10 text-purple-400 border-purple-500/20',
  'Por proyecto':    'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  'Temporal':        'bg-zinc-500/10  text-zinc-400  border-zinc-500/20',
}

export default function Ofertas() {
  const [ofertas, setOfertas]           = useState<Oferta[]>([])
  const [loading, setLoading]           = useState(true)
  const [busqueda, setBusqueda]         = useState('')
  const [filtroTipo, setFiltroTipo]     = useState('')
  const [filtroPrac, setFiltroPrac]     = useState(false)
  const [postulando, setPostulando]     = useState<number | null>(null)
  const [mensajes, setMensajes]         = useState<Record<number, string>>({})
  const [errores, setErrores]           = useState<Record<number, string>>({})
  const [detalle, setDetalle]           = useState<Oferta | null>(null)

  const token   = localStorage.getItem('token')
  const headers = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }

  const fetchOfertas = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (busqueda)    params.append('busqueda', busqueda)
      if (filtroTipo)  params.append('tipo_contrato', filtroTipo)
      if (filtroPrac)  params.append('es_practicas', 'true')

      const res  = await fetch(`https://ichamba-backend-final.onrender.com/api/ofertas/publicas?${params}`)
      const data = await res.json()
      setOfertas(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchOfertas() }, [])

  const handleBuscar = (e: React.FormEvent) => {
    e.preventDefault()
    fetchOfertas()
  }

  const handlePostular = async (oferta: Oferta) => {
    setPostulando(oferta.id)
    setMensajes(p => ({ ...p, [oferta.id]: '' }))
    setErrores(p => ({ ...p, [oferta.id]: '' }))
    try {
      const res  = await fetch(`https://ichamba-backend-final.onrender.com/api/ofertas/${oferta.id}/postular`, {
        method: 'POST', headers
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message)
      setMensajes(p => ({ ...p, [oferta.id]: data.message }))
    } catch (err: any) {
      setErrores(p => ({ ...p, [oferta.id]: err.message }))
    } finally {
      setPostulando(null)
    }
  }

  const tiposContrato = ['Tiempo completo', 'Medio tiempo', 'Prácticas', 'Por proyecto', 'Temporal']

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-white text-2xl font-black">Ofertas disponibles</h2>
        <span className="text-zinc-500 text-sm">{ofertas.length} empleos</span>
      </div>

      {/* Filtros */}
      <form onSubmit={handleBuscar} className="space-y-3">
        <div className="flex gap-3">
          <input
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
            placeholder="🔍 Buscar por puesto, empresa o lugar..."
            className="flex-1 bg-zinc-900 border border-zinc-800 text-white rounded-xl px-4 py-3 text-sm
                       focus:outline-none focus:border-[#FF4D00] placeholder:text-zinc-600"
          />
          <button type="submit"
            className="bg-[#FF4D00] hover:bg-orange-500 text-white font-bold px-5 rounded-xl text-sm transition-all">
            Buscar
          </button>
        </div>

        <div className="flex gap-3 flex-wrap">
          <select value={filtroTipo} onChange={e => setFiltroTipo(e.target.value)}
            className="bg-zinc-900 border border-zinc-800 text-zinc-300 rounded-xl px-4 py-2 text-sm
                       focus:outline-none focus:border-[#FF4D00]">
            <option value="">Todos los contratos</option>
            {tiposContrato.map(t => <option key={t} value={t}>{t}</option>)}
          </select>

          <button
            type="button"
            onClick={() => { setFiltroPrac(!filtroPrac); setTimeout(fetchOfertas, 100) }}
            className={`px-4 py-2 rounded-xl text-sm font-bold border transition-all ${
              filtroPrac
                ? 'bg-purple-500/20 border-purple-500/50 text-purple-400'
                : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-300'
            }`}>
            🎓 Solo prácticas
          </button>
        </div>
      </form>

      {/* Lista */}
      {loading ? (
        <p className="text-zinc-500 text-sm">Cargando ofertas...</p>
      ) : ofertas.length === 0 ? (
        <div className="text-center py-20 text-zinc-600">
          <p className="text-4xl mb-3">📭</p>
          <p>No hay ofertas disponibles por ahora</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {ofertas.map((o) => (
            <div key={o.id}
              className="bg-zinc-900 border border-zinc-800 hover:border-[#FF4D00]/50
                         rounded-2xl p-5 space-y-3 transition-all duration-200
                         hover:shadow-lg hover:shadow-orange-900/10">

              <div className="flex items-start justify-between gap-2">
                <h3 className="text-white font-bold text-base">{o.titulo}</h3>
                <span className={`text-xs font-semibold px-2 py-1 rounded-lg border shrink-0
                  ${colorTipo[o.tipo_contrato] || 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20'}`}>
                  {o.tipo_contrato}
                </span>
              </div>

              <p className="text-zinc-400 text-sm font-medium">{o.empresa}</p>

              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-500">📍 {o.lugar}</span>
                {o.salario && <span className="text-[#FF4D00] font-bold">{o.salario}</span>}
              </div>

              {o.es_practicas && (
                <span className="inline-block text-xs bg-purple-500/10 text-purple-400
                                 border border-purple-500/20 px-2 py-1 rounded-lg">
                  🎓 Prácticas profesionales
                </span>
              )}

              {/* Mensaje de estado */}
              {mensajes[o.id] && (
                <p className="text-green-400 text-xs bg-green-500/10 border border-green-500/20
                              rounded-lg px-3 py-2">
                  ✅ {mensajes[o.id]}
                </p>
              )}
              {errores[o.id] && (
                <p className="text-red-400 text-xs bg-red-500/10 border border-red-500/20
                              rounded-lg px-3 py-2">
                  ⚠️ {errores[o.id]}
                </p>
              )}

              {/* Botones */}
              <div className="flex gap-2 pt-1">
                <button
                  onClick={() => setDetalle(detalle?.id === o.id ? null : o)}
                  className="flex-1 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700
                             text-zinc-300 hover:text-white font-bold text-sm
                             py-2.5 rounded-xl transition-all">
                  {detalle?.id === o.id ? 'Ocultar' : 'Ver detalles'}
                </button>
                <button
                  onClick={() => handlePostular(o)}
                  disabled={postulando === o.id || !!mensajes[o.id]}
                  className="flex-1 bg-[#FF4D00]/10 hover:bg-[#FF4D00] border border-[#FF4D00]/30
                             hover:border-[#FF4D00] text-[#FF4D00] hover:text-white font-bold text-sm
                             py-2.5 rounded-xl transition-all disabled:opacity-50">
                  {postulando === o.id ? 'Enviando...' : mensajes[o.id] ? 'Postulado ✓' : 'Postularme'}
                </button>
              </div>

              {/* Detalle expandible */}
              {detalle?.id === o.id && (
                <div className="border-t border-zinc-800 pt-3 space-y-2">
                  {o.descripcion && (
                    <div>
                      <p className="text-zinc-500 text-xs font-semibold uppercase tracking-wider mb-1">
                        Descripción
                      </p>
                      <p className="text-zinc-400 text-sm">{o.descripcion}</p>
                    </div>
                  )}
                  {o.requisitos && (
                    <div>
                      <p className="text-zinc-500 text-xs font-semibold uppercase tracking-wider mb-1">
                        Requisitos
                      </p>
                      <p className="text-zinc-400 text-sm">{o.requisitos}</p>
                    </div>
                  )}
                  <p className="text-zinc-600 text-xs">
                    Publicado por {o.empleador_nombre} {o.empleador_apellidos} ·{' '}
                    {new Date(o.created_at).toLocaleDateString('es-MX', {
                      day: 'numeric', month: 'short', year: 'numeric'
                    })}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}