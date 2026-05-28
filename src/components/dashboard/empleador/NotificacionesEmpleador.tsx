import { useState, useEffect } from 'react'

interface Notificacion {
  id: number
  texto: string
  leida: boolean
  created_at: string
}

const API_NOTIF  = 'https://ichamba-backend-final.onrender.com/api/usuarios/notificaciones'


export default function NotificacionesEmpleador() {
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([])
  const [loading, setLoading]               = useState(true)
  const [mensaje, setMensaje]               = useState('')

  const token   = localStorage.getItem('token')
  const headers = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }

  const fetchNotificaciones = async () => {
    try {
      const res  = await fetch(API_NOTIF, { headers })
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
      await fetch(`${API_NOTIF}/${id}`, { method: 'PUT', headers })
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
          .map(n => fetch(`${API_NOTIF}/${n.id}`, { method: 'PUT', headers }))
      )
      fetchNotificaciones()
    } catch (err) {
      console.error(err)
    }
  }

  // Extrae ofertaId y usuarioId del texto de la notificacion si es postulacion
  const esPostulacion = (texto: string) => texto.includes('se postulo a tu oferta')

  const extraerDatosPostulacion = (texto: string) => {
    // Formato: "Nombre Apellido se postulo a tu oferta "titulo""
    const match = texto.match(/^(.+?) se postulo a tu oferta "(.+)"$/)
    if (match) return { nombre: match[1], titulo: match[2] }
    return null
  }

  if (loading) return <p className="text-zinc-500 text-sm">Cargando notificaciones...</p>

  const noLeidas = notificaciones.filter(n => !n.leida).length

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

      {mensaje && (
        <div className="bg-green-500/10 border border-green-500/30 text-green-400 text-sm rounded-xl px-4 py-3">
          ✅ {mensaje}
        </div>
      )}

      {notificaciones.length === 0 ? (
        <div className="text-center py-20 text-zinc-600">
          <p className="text-4xl mb-3">🔔</p>
          <p>No tienes notificaciones</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notificaciones.map((n) => {
            const datosPost = esPostulacion(n.texto) ? extraerDatosPostulacion(n.texto) : null

            return (
              <div key={n.id}
                className={`rounded-2xl border px-5 py-4 transition-all space-y-3 ${
                  n.leida
                    ? 'bg-zinc-900 border-zinc-800 opacity-60'
                    : 'bg-zinc-900 border-[#FF4D00]/20'
                }`}>

                <div className="flex items-start gap-4">
                  <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${
                    n.leida ? 'bg-zinc-600' : 'bg-[#FF4D00]'
                  }`} />
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

                {/* Ir a postulantes si es notificacion de postulacion */}
                {datosPost && !n.leida && (
                  <div className="pl-6">
                    <p className="text-zinc-500 text-xs mb-2">
                      Puesto: <span className="text-zinc-300">{datosPost.titulo}</span>
                    </p>
                    <p className="text-zinc-500 text-xs">
                      Ve a <span className="text-[#FF4D00] font-semibold">Mis Ofertas → Ver postulantes</span> para aceptar o rechazar esta postulacion.
                    </p>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}