import { useState, useEffect } from 'react'

interface Equipo {
  id: number
  nombre: string
  descripcion: string
  codigo: string
  lider_nombre: string
  lider_apellidos: string
  mi_estado: string
  total_miembros: number
}

interface Miembro {
  id: number
  nombre: string
  apellidos: string
  email: string
  ocupacion: string
  estado: string
}

interface EquipoDetalle {
  id: number
  nombre: string
  descripcion: string
  codigo: string
  lider_id: number
  miembros: Miembro[]
}

const API = 'http://localhost:4000/api/equipos'

export default function Equipos() {
  const [equipos, setEquipos]           = useState<Equipo[]>([])
  const [detalle, setDetalle]           = useState<EquipoDetalle | null>(null)
  const [vista, setVista]               = useState<'lista' | 'crear' | 'detalle'>('lista')
  const [loading, setLoading]           = useState(true)
  const [mensaje, setMensaje]           = useState('')
  const [error, setError]               = useState('')
  const [emailInvitar, setEmailInvitar] = useState('')
  const [loadingInvitar, setLoadingInvitar] = useState(false)

  const [formCrear, setFormCrear] = useState({ nombre: '', descripcion: '' })

  const usuario = JSON.parse(localStorage.getItem('usuario') || '{}')
  const token   = localStorage.getItem('token')
  const headers = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }

  const fetchEquipos = async () => {
    try {
      const res  = await fetch(`${API}/mis-equipos`, { headers })
      const data = await res.json()
      setEquipos(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchEquipos() }, [])

  const handleCrear = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    try {
      const res  = await fetch(API, { method: 'POST', headers, body: JSON.stringify(formCrear) })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message)
      setMensaje(`¡Equipo "${data.equipo.nombre}" creado! Código: ${data.equipo.codigo}`)
      setFormCrear({ nombre: '', descripcion: '' })
      setVista('lista')
      fetchEquipos()
    } catch (err: any) {
      setError(err.message)
    }
  }

  const handleVerDetalle = async (id: number) => {
    try {
      const res  = await fetch(`${API}/${id}`, { headers })
      const data = await res.json()
      setDetalle(data)
      setVista('detalle')
    } catch (err) {
      console.error(err)
    }
  }

  const handleInvitar = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!detalle) return
    setLoadingInvitar(true)
    setError('')
    setMensaje('')
    try {
      const res  = await fetch(`${API}/${detalle.id}/invitar`, {
        method: 'POST', headers, body: JSON.stringify({ email: emailInvitar })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message)
      setMensaje(data.message)
      setEmailInvitar('')
      handleVerDetalle(detalle.id)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoadingInvitar(false)
    }
  }

  const handleResponder = async (equipoId: number, accion: 'aceptar' | 'rechazar') => {
    try {
      const res  = await fetch(`${API}/${equipoId}/responder`, {
        method: 'PUT', headers, body: JSON.stringify({ accion })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message)
      setMensaje(data.message)
      fetchEquipos()
    } catch (err: any) {
      setError(err.message)
    }
  }

  const colorEstado: Record<string, string> = {
    aceptado:  'bg-green-500/10 text-green-400 border-green-500/20',
    pendiente: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    rechazado: 'bg-red-500/10 text-red-400 border-red-500/20',
  }

  if (loading) return <p className="text-zinc-500 text-sm">Cargando equipos...</p>

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {vista !== 'lista' && (
            <button onClick={() => { setVista('lista'); setDetalle(null); setError(''); setMensaje('') }}
              className="text-zinc-400 hover:text-white transition-colors text-lg">←</button>
          )}
          <h2 className="text-white text-2xl font-black">
            {vista === 'lista'   ? 'Mis equipos' :
             vista === 'crear'   ? 'Crear equipo' :
             detalle?.nombre}
          </h2>
        </div>
        {vista === 'lista' && (
          <button onClick={() => { setVista('crear'); setError(''); setMensaje('') }}
            className="bg-[#FF4D00] hover:bg-orange-500 text-white font-bold text-sm
                       px-4 py-2 rounded-xl transition-all">
            + Crear equipo
          </button>
        )}
      </div>

      {/* Mensajes */}
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

      {/* Vista — Crear equipo */}
      {vista === 'crear' && (
        <form onSubmit={handleCrear}
          className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-5 max-w-lg">
          <div className="space-y-1">
            <label className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">
              Nombre del equipo *
            </label>
            <input required value={formCrear.nombre}
              onChange={e => setFormCrear(p => ({ ...p, nombre: e.target.value }))}
              placeholder="Ej: Los Tigres, Dev Team, Equipo Alpha..."
              className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-xl px-4 py-3 text-sm
                         focus:outline-none focus:border-[#FF4D00] placeholder:text-zinc-600" />
          </div>
          <div className="space-y-1">
            <label className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">
              Descripción
            </label>
            <textarea value={formCrear.descripcion} rows={3}
              onChange={e => setFormCrear(p => ({ ...p, descripcion: e.target.value }))}
              placeholder="¿En qué tipo de trabajos se especializa tu equipo?"
              className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-xl px-4 py-3 text-sm
                         focus:outline-none focus:border-[#FF4D00] placeholder:text-zinc-600 resize-none" />
          </div>
          <button type="submit"
            className="w-full bg-[#FF4D00] hover:bg-orange-500 text-white font-black
                       py-3 rounded-xl transition-all text-sm uppercase tracking-wide">
            Crear equipo
          </button>
        </form>
      )}

      {/* Vista — Lista de equipos */}
      {vista === 'lista' && (
        <>
          {/* Invitaciones pendientes */}
          {equipos.filter(e => e.mi_estado === 'pendiente').length > 0 && (
            <div className="space-y-3">
              <h3 className="text-yellow-400 font-bold text-sm uppercase tracking-wider">
                🔔 Invitaciones pendientes
              </h3>
              {equipos.filter(e => e.mi_estado === 'pendiente').map(e => (
                <div key={e.id}
                  className="bg-yellow-500/5 border border-yellow-500/20 rounded-2xl p-5
                             flex items-center justify-between gap-4">
                  <div>
                    <p className="text-white font-bold">{e.nombre}</p>
                    <p className="text-zinc-500 text-xs mt-0.5">
                      Invitado por {e.lider_nombre} {e.lider_apellidos}
                    </p>
                    {e.descripcion && <p className="text-zinc-400 text-sm mt-1">{e.descripcion}</p>}
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button onClick={() => handleResponder(e.id, 'aceptar')}
                      className="bg-green-500/10 hover:bg-green-500 border border-green-500/30
                                 text-green-400 hover:text-white text-xs font-bold px-3 py-2
                                 rounded-lg transition-all">
                      ✅ Aceptar
                    </button>
                    <button onClick={() => handleResponder(e.id, 'rechazar')}
                      className="bg-red-500/10 hover:bg-red-500 border border-red-500/30
                                 text-red-400 hover:text-white text-xs font-bold px-3 py-2
                                 rounded-lg transition-all">
                      ❌ Rechazar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Mis equipos */}
          {equipos.filter(e => e.mi_estado === 'aceptado').length === 0 ? (
            <div className="text-center py-20 text-zinc-600">
              <p className="text-4xl mb-3">👥</p>
              <p>Aún no perteneces a ningún equipo</p>
              <p className="text-sm mt-1">Crea uno o espera una invitación</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {equipos.filter(e => e.mi_estado === 'aceptado').map(e => (
                <div key={e.id}
                  className="bg-zinc-900 border border-zinc-800 hover:border-[#FF4D00]/40
                             rounded-2xl p-5 space-y-3 transition-all">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-white font-bold text-base">{e.nombre}</h3>
                    <span className="text-xs font-mono bg-zinc-800 text-zinc-400 px-2 py-1 rounded-lg">
                      {e.codigo}
                    </span>
                  </div>

                  {e.descripcion && <p className="text-zinc-500 text-sm">{e.descripcion}</p>}

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-zinc-500">
                      👑 {e.lider_nombre} {e.lider_apellidos}
                      {e.lider_nombre === usuario.nombre?.split(' ')[0] && (
                        <span className="ml-1 text-[#FF4D00]">(tú)</span>
                      )}
                    </span>
                    <span className="text-zinc-400">
                      👥 {e.total_miembros} miembro{Number(e.total_miembros) !== 1 ? 's' : ''}
                    </span>
                  </div>

                  <button onClick={() => handleVerDetalle(e.id)}
                    className="w-full bg-[#FF4D00]/10 hover:bg-[#FF4D00] border border-[#FF4D00]/30
                               hover:border-[#FF4D00] text-[#FF4D00] hover:text-white font-bold text-sm
                               py-2.5 rounded-xl transition-all duration-200">
                    Ver equipo
                  </button>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Vista — Detalle del equipo */}
      {vista === 'detalle' && detalle && (
        <div className="space-y-6 max-w-2xl">

          {/* Info del equipo */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-zinc-400 text-sm">Código del equipo</p>
              <span className="font-mono text-[#FF4D00] font-black text-lg tracking-widest bg-[#FF4D00]/10
                               px-3 py-1 rounded-lg border border-[#FF4D00]/20">
                {detalle.codigo}
              </span>
            </div>
            {detalle.descripcion && <p className="text-zinc-400 text-sm">{detalle.descripcion}</p>}
          </div>

          {/* Invitar miembro — solo para el líder */}
          {detalle.lider_id === usuario.id && (
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-3">
              <h3 className="text-white font-bold">Invitar miembro</h3>
              <form onSubmit={handleInvitar} className="flex gap-3">
                <input
                  type="email" required value={emailInvitar}
                  onChange={e => setEmailInvitar(e.target.value)}
                  placeholder="correo@ejemplo.com"
                  className="flex-1 bg-zinc-800 border border-zinc-700 text-white rounded-xl px-4 py-3 text-sm
                             focus:outline-none focus:border-[#FF4D00] placeholder:text-zinc-600"
                />
                <button type="submit" disabled={loadingInvitar}
                  className="bg-[#FF4D00] hover:bg-orange-500 disabled:opacity-60 text-white font-bold
                             px-5 py-3 rounded-xl transition-all text-sm shrink-0">
                  {loadingInvitar ? '...' : 'Invitar'}
                </button>
              </form>
            </div>
          )}

          {/* Lista de miembros */}
          <div className="space-y-3">
            <h3 className="text-white font-bold">
              Miembros ({detalle.miembros.filter(m => m.estado === 'aceptado').length})
            </h3>
            {detalle.miembros.map(m => (
              <div key={m.id}
                className="bg-zinc-900 border border-zinc-800 rounded-2xl px-5 py-4
                           flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#FF4D00] flex items-center justify-center
                                  text-white font-black text-sm shrink-0">
                    {m.nombre.charAt(0)}
                  </div>
                  <div>
                    <p className="text-white font-bold text-sm">
                      {m.nombre} {m.apellidos}
                      {m.id === detalle.lider_id && (
                        <span className="ml-2 text-xs text-[#FF4D00]">👑 Líder</span>
                      )}
                    </p>
                    <p className="text-zinc-500 text-xs">{m.email}</p>
                    {m.ocupacion && <p className="text-zinc-500 text-xs">{m.ocupacion}</p>}
                  </div>
                </div>
                <span className={`text-xs font-semibold px-3 py-1.5 rounded-lg border shrink-0
                  ${colorEstado[m.estado] || 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20'}`}>
                  {m.estado === 'aceptado' ? 'Miembro' :
                   m.estado === 'pendiente' ? 'Pendiente' : 'Rechazado'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}