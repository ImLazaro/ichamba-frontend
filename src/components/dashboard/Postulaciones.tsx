const postulaciones = [
  { id: 1, titulo: 'Cajero/a de turno',     empresa: 'Tienda Don Pepe',  fecha: '20 Abr 2026', estado: 'En revisión' },
  { id: 2, titulo: 'Prácticas — Dev Web',   empresa: 'AgencyMX',         fecha: '18 Abr 2026', estado: 'Entrevista' },
  { id: 3, titulo: 'Repartidor en moto',    empresa: 'Tacos El Güero',   fecha: '15 Abr 2026', estado: 'Rechazado' },
]

const colorEstado: Record<string, string> = {
  'En revisión': 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  'Entrevista':  'bg-green-500/10  text-green-400  border-green-500/20',
  'Rechazado':   'bg-red-500/10    text-red-400    border-red-500/20',
}

export default function Postulaciones() {
  return (
    <div className="space-y-6">
      <h2 className="text-white text-2xl font-black">Mis postulaciones</h2>

      {postulaciones.length === 0 ? (
        <div className="text-center py-20 text-zinc-600">
          <p className="text-4xl mb-3">📭</p>
          <p>Aún no te has postulado a ninguna oferta</p>
        </div>
      ) : (
        <div className="space-y-3">
          {postulaciones.map((p) => (
            <div key={p.id}
              className="bg-zinc-900 border border-zinc-800 rounded-2xl px-5 py-4
                         flex items-center justify-between gap-4"
            >
              <div>
                <p className="text-white font-bold text-sm">{p.titulo}</p>
                <p className="text-zinc-500 text-xs mt-0.5">{p.empresa} · {p.fecha}</p>
              </div>
              <span className={`text-xs font-semibold px-3 py-1.5 rounded-lg border shrink-0 ${colorEstado[p.estado]}`}>
                {p.estado}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}