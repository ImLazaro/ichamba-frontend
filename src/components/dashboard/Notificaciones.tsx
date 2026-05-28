const notificaciones = [
  { id: 1, texto: 'AgencyMX quiere entrevistarte para Prácticas — Dev Web', tiempo: 'Hace 2 horas',  leida: false },
  { id: 2, texto: 'Tu postulación en Tienda Don Pepe fue vista',             tiempo: 'Hace 5 horas',  leida: false },
  { id: 3, texto: 'Nueva oferta cerca de ti: Ayudante de cocina',            tiempo: 'Hace 1 día',    leida: true  },
  { id: 4, texto: 'Tacos El Güero no continuará con tu postulación',         tiempo: 'Hace 2 días',   leida: true  },
]

export default function Notificaciones() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-white text-2xl font-black">Notificaciones</h2>
        <button className="text-[#FF4D00] text-sm font-semibold hover:text-orange-400 transition-colors">
          Marcar todas como leídas
        </button>
      </div>

      <div className="space-y-2">
        {notificaciones.map((n) => (
          <div key={n.id}
            className={`flex items-start gap-4 px-5 py-4 rounded-2xl border transition-all ${
              n.leida
                ? 'bg-zinc-900 border-zinc-800 opacity-60'
                : 'bg-zinc-900 border-[#FF4D00]/20'
            }`}
          >
            <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${n.leida ? 'bg-zinc-600' : 'bg-[#FF4D00]'}`} />
            <div>
              <p className="text-white text-sm">{n.texto}</p>
              <p className="text-zinc-500 text-xs mt-1">{n.tiempo}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
  
}
