import { useState, useEffect } from 'react'

interface Notificacion {
  id: number
  texto: string
  leida: boolean
  created_at: string
}

const API = 'https://ichamba-backend-final.onrender.com/api/usuarios/notificaciones'

export default function Notificaciones() {
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([])
  const [loading, setLoading]               = useState(true)

  const token   = localStorage.getItem('token')
  const headers = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }

  const fetchNotificaciones = async () => {
    try {
      const res  = await fetch(API, { headers })
      const data = await res.json()
      setNotificaciones(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchNotificaciones() }, [])

  const marcarLeida = async (id: number) => {
    try {
      await fetch(`https://ichamba-backend-final.onrender.com/api/usuarios/notificaciones/${id}`, {
        method: 'PUT', headers
      })
      fetchNotificaciones()
    } catch (err) {
      console.error(err)
    }
  }

  const marcarTodasLeidas = async () => {
    try {
      await Promise.all(
        notificaciones
          .filter(n => !n.leida)
          .map(n => fetch(`https://ichamba-backend-final.onrender.com/api/usuarios/notificaciones/${n.id}`, {
            method: 'PUT', headers
          }))
      )
      fetchNotificaciones()
    } catch (err) {
      console.error(err)
    }
  }

  const noLeidas = notificaciones.filter(n => !n.leida).length

  if (loading) return <p className="text-zinc-500 text-sm">Cargando notificaciones...</p>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-white text-2xl font-black">Notificaciones</h2>
          {noLeidas > 0 && (
            <span className="bg-[#FF4D00] text-white text-xs font-black px-2 py-1 rounded-full">
              {noLeidas}
            </span>
          )}
        </div>
        {noLeidas > 0 && (
          <button onClick={marcarTodasLeidas}
            className="text-[#FF4D00] text-sm font-semibold hover:text-orange-400 transition-colors">
            Marcar todas como leidas
          </button>
        )}
      </div>

      {notificaciones.length === 0 ? (
        <div className="text-center py-20 text-zinc-600">
          <p className="text-4xl mb-3">🔔</p>
          <p>No tienes notificaciones</p>
        </div>
      ) : (
        <div className="space-y-2">
          {notificaciones.map((n) => (
            <div key={n.id}
              className={`flex items-start gap-4 px-5 py-4 rounded-2xl border transition-all ${
                n.leida
                  ? 'bg-zinc-900 border-zinc-800 opacity-60'
                  : 'bg-zinc-900 border-[#FF4D00]/20'
              }`}>
              <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${n.leida ? 'bg-zinc-600' : 'bg-[#FF4D00]'}`} />
              <div className="flex-1">
                <p className="text-white text-sm">{n.texto}</p>
                <p className="text-zinc-500 text-xs mt-1">
                  {new Date(n.created_at).toLocaleDateString('es-MX', {
                    day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
                  })}
                </p>
              </div>
              {!n.leida && (
                <button onClick={() => marcarLeida(n.id)}
                  className="text-zinc-600 hover:text-zinc-400 text-xs shrink-0 transition-colors">
                  ✓ Leida
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}