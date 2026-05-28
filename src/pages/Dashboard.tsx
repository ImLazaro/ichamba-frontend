import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'

// Buscador
import Ofertas         from '../components/dashboard/Ofertas'
import Postulaciones   from '../components/dashboard/Postulaciones'
import Notificaciones  from '../components/dashboard/Notificaciones'
import Perfil          from '../components/dashboard/Perfil'
import Equipos         from '../components/dashboard/Equipos'

// Empleador
import PublicarOferta          from '../components/dashboard/empleador/PublicarOferta'
import MisOfertas              from '../components/dashboard/empleador/MisOfertas'
import Postulantes             from '../components/dashboard/empleador/Postulantes'
import NotificacionesEmpleador from '../components/dashboard/empleador/NotificacionesEmpleador'
import PerfilEmpresa           from '../components/dashboard/empleador/PerfilEmpresa'
import GraficaEmpleador        from '../components/dashboard/empleador/GraficaEmpleador'
import HistorialContratados    from '../components/dashboard/empleador/HistorialContratados'

export default function Dashboard() {
  const [seccion, setSeccion]             = useState('inicio')
  const [ofertaSeleccionada, setOferta]   = useState<{ id: number; titulo: string } | null>(null)
  const navigate                          = useNavigate()
  const usuario                           = JSON.parse(localStorage.getItem('usuario') || '{}')
  const esEmpleador                       = usuario.rol === 'empleador'

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) navigate('/login')
    setSeccion(esEmpleador ? 'grafica' : 'ofertas')
  }, [])

  const seccionesBuscador = [
    { id: 'ofertas',        label: 'Ofertas',        emoji: '📢' },
    { id: 'postulaciones',  label: 'Postulaciones',  emoji: '📨' },
    { id: 'notificaciones', label: 'Notificaciones', emoji: '🔔' },
    { id: 'perfil',         label: 'Mi Perfil',      emoji: '📝' },
    { id: 'equipos',        label: 'Equipos',        emoji: '👥' },
  ]

  const seccionesEmpleador = [
    { id: 'grafica',        label: 'Estadísticas',   emoji: '📊' },
    { id: 'publicar',       label: 'Publicar',       emoji: '📢' },
    { id: 'mis-ofertas',    label: 'Mis Ofertas',    emoji: '📋' },
    { id: 'notificaciones', label: 'Notificaciones', emoji: '🔔' },
    { id: 'perfil',         label: 'Mi Perfil',      emoji: '📝' },
    { id: 'historial',      label: 'Historial',      emoji: '📚' },
  ]

  const secciones = esEmpleador ? seccionesEmpleador : seccionesBuscador

  const renderSeccion = () => {
    if (esEmpleador) {
      if (seccion === 'postulantes' && ofertaSeleccionada) {
        return <Postulantes
          ofertaId={ofertaSeleccionada.id}
          ofertaTitulo={ofertaSeleccionada.titulo}
          onVolver={() => setSeccion('mis-ofertas')}
        />
      }
      switch (seccion) {
        case 'grafica':        return <GraficaEmpleador />
        case 'publicar':       return <PublicarOferta />
        case 'mis-ofertas':    return <MisOfertas onVerPostulantes={(id, titulo) => {
                                  setOferta({ id, titulo })
                                  setSeccion('postulantes')
                                }} />
        case 'notificaciones': return <NotificacionesEmpleador />
        case 'perfil':         return <PerfilEmpresa />
        default:               return <GraficaEmpleador />
        case 'historial': return <HistorialContratados />
      }
    }

    switch (seccion) {
      case 'ofertas':        return <Ofertas />
      case 'postulaciones':  return <Postulaciones />
      case 'notificaciones': return <Notificaciones />
      case 'perfil':         return <Perfil />
      default:               return <Ofertas />
      case 'equipos': return <Equipos />
    }
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <Navbar seccionActiva={seccion} setSeccion={setSeccion} secciones={secciones} />

      {/* Navegación móvil */}
      <div className="md:hidden flex overflow-x-auto gap-2 px-4 py-3 bg-[#0F0F0F] border-b border-zinc-800">
        {secciones.map((s) => (
          <button key={s.id} onClick={() => setSeccion(s.id)}
            className={`shrink-0 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              seccion === s.id ? 'bg-[#FF4D00] text-white' : 'bg-zinc-800 text-zinc-400'
            }`}>
            {s.emoji} {s.label}
          </button>
        ))}
      </div>

      <main className="max-w-5xl mx-auto px-6 py-8">
        {renderSeccion()}
      </main>
    </div>
  )
}