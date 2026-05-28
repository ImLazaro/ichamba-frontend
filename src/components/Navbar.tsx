import { useNavigate } from 'react-router-dom'

interface Seccion {
  id: string
  label: string
  emoji: string
}

interface NavbarProps {
  seccionActiva: string
  setSeccion: (s: string) => void
  secciones: Seccion[]
}

export default function Navbar(props: NavbarProps) {
  const { seccionActiva, setSeccion, secciones } = props
  const navigate = useNavigate()
  const usuario  = JSON.parse(localStorage.getItem('usuario') || '{}')

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('usuario')
    navigate('/login')
  }

  return (
    <nav className="bg-[#0F0F0F] border-b border-zinc-800 px-6 py-3 flex items-center justify-between sticky top-0 z-50">
      <span className="text-white font-black text-2xl tracking-tight">
        i<span className="text-[#FF4D00]">Chamba</span>
      </span>

      <div className="hidden md:flex items-center gap-1">
        {secciones.map((s) => (
          <button key={s.id} onClick={() => setSeccion(s.id)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              seccionActiva === s.id
                ? 'bg-[#FF4D00] text-white'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
            }`}>
            {s.emoji} {s.label}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <span className="text-zinc-400 text-sm hidden md:block">
          Hola, <span className="text-white font-semibold">{usuario.nombre}</span>
        </span>
        <button onClick={handleLogout}
          className="bg-zinc-800 hover:bg-red-500/20 hover:border-red-500/50 border border-zinc-700
                     text-zinc-300 hover:text-red-400 text-sm font-semibold px-4 py-2 rounded-lg
                     transition-all duration-200">
          Salir 🚪
        </button>
      </div>
    </nav>
  )
}