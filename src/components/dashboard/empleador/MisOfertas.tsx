import { useState, useEffect } from 'react'

interface Oferta {
  id: number
  titulo: string
  empresa: string
  lugar: string
  tipo_contrato: string
  salario: string
  es_practicas: boolean
  activa: boolean
  total_postulantes: number
  created_at: string
}

export default function MisOfertas({ onVerPostulantes }: { onVerPostulantes: (id: number, titulo: string) => void }) {
  const [ofertas, setOfertas]   = useState<Oferta[]>([])
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    const fetchOfertas = async () => {
      try {
        const token = localStorage.getItem('token')
        const res   = await fetch('http://localhost:4000/api/ofertas/mis-ofertas', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        const data = await res.json()
        setOfertas(data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchOfertas()
  }, [])

  const colorTipo: Record<string, string> = {
    'Tiempo completo': 'bg-green-500/10 text-green-400 border-green-500/20',
    'Medio tiempo':    'bg-blue-500/10  text-blue-400  border-blue-500/20',
    'Prácticas':       'bg-purple-500/10 text-purple-400 border-purple-500/20',
    'Por proyecto':    'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    'Temporal':        'bg-zinc-500/10  text-zinc-400  border-zinc-500/20',
  }

  if (loading) return <p className="text-zinc-500 text-sm">Cargando ofertas...</p>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-white text-2xl font-black">Mis ofertas</h2>
        <span className="text-zinc-500 text-sm">{ofertas.length} publicadas</span>
      </div>

      {ofertas.length === 0 ? (
        <div className="text-center py-20 text-zinc-600">
          <p className="text-4xl mb-3">📭</p>
          <p>Aún no has publicado ninguna oferta</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {ofertas.map((o) => (
            <div key={o.id}
              className="bg-zinc-900 border border-zinc-800 hover:border-[#FF4D00]/40
                         rounded-2xl p-5 space-y-3 transition-all">
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-white font-bold text-base">{o.titulo}</h3>
                <span className={`text-xs font-semibold px-2 py-1 rounded-lg border shrink-0
                  ${colorTipo[o.tipo_contrato] || 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20'}`}>
                  {o.tipo_contrato}
                </span>
              </div>

              <p className="text-zinc-400 text-sm">{o.empresa}</p>

              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-500">📍 {o.lugar}</span>
                <span className="text-[#FF4D00] font-bold">{o.salario}</span>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-3 pt-1">
                <span className="text-zinc-400 text-xs bg-zinc-800 px-3 py-1.5 rounded-lg">
                  👥 {o.total_postulantes} postulantes
                </span>
                {o.es_practicas && (
                  <span className="text-purple-400 text-xs bg-purple-500/10 border border-purple-500/20 px-3 py-1.5 rounded-lg">
                    🎓 Prácticas
                  </span>
                )}
              </div>

              <button
                onClick={() => onVerPostulantes(o.id, o.titulo)}
                className="w-full bg-[#FF4D00]/10 hover:bg-[#FF4D00] border border-[#FF4D00]/30
                           hover:border-[#FF4D00] text-[#FF4D00] hover:text-white font-bold text-sm
                           py-2.5 rounded-xl transition-all duration-200">
                Ver postulantes
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}