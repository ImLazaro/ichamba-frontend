import { useState, useEffect } from 'react'

export default function GraficaEmpleador() {
  const [datos, setDatos] = useState({
    totalOfertas: 0,
    totalPostulantes: 0,
    ofertasActivas: 0,
    contratados: 0,
  })

  useEffect(() => {
    const fetchDatos = async () => {
      try {
        const token = localStorage.getItem('token')
        const res   = await fetch('http://localhost:4000/api/ofertas/mis-ofertas', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        const ofertas = await res.json()
        const totalPostulantes = ofertas.reduce((acc: number, o: any) => acc + parseInt(o.total_postulantes), 0)
        setDatos({
          totalOfertas:     ofertas.length,
          totalPostulantes: totalPostulantes,
          ofertasActivas:   ofertas.filter((o: any) => o.activa).length,
          contratados:      0,
        })
      } catch (err) {
        console.error(err)
      }
    }
    fetchDatos()
  }, [])

  const stats = [
    { label: 'Ofertas publicadas', value: datos.totalOfertas,     emoji: '📢', color: 'border-[#FF4D00]/30 bg-[#FF4D00]/5' },
    { label: 'Total postulantes',  value: datos.totalPostulantes, emoji: '👥', color: 'border-blue-500/30  bg-blue-500/5'  },
    { label: 'Ofertas activas',    value: datos.ofertasActivas,   emoji: '✅', color: 'border-green-500/30 bg-green-500/5' },
    { label: 'Contratados',        value: datos.contratados,      emoji: '🎉', color: 'border-purple-500/30 bg-purple-500/5'},
  ]

  const maxVal = Math.max(datos.totalOfertas, datos.totalPostulantes, 1)

  return (
    <div className="space-y-8">
      <h2 className="text-white text-2xl font-black">Estadísticas de contratación</h2>

      {/* Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className={`border rounded-2xl p-5 ${s.color}`}>
            <p className="text-3xl mb-2">{s.emoji}</p>
            <p className="text-white font-black text-3xl">{s.value}</p>
            <p className="text-zinc-400 text-xs mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Barra de visibilidad */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4">
        <h3 className="text-white font-bold">Visibilidad de vacantes</h3>
        <p className="text-zinc-500 text-sm">Relación entre ofertas publicadas y postulantes recibidos</p>

        <div className="space-y-4">
          {[
            { label: 'Ofertas publicadas', value: datos.totalOfertas,     color: 'bg-[#FF4D00]' },
            { label: 'Postulantes totales', value: datos.totalPostulantes, color: 'bg-blue-500' },
            { label: 'Ofertas activas',     value: datos.ofertasActivas,   color: 'bg-green-500' },
          ].map((item) => (
            <div key={item.label} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-zinc-400">{item.label}</span>
                <span className="text-white font-bold">{item.value}</span>
              </div>
              <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className={`h-full ${item.color} rounded-full transition-all duration-700`}
                  style={{ width: `${maxVal > 0 ? (item.value / maxVal) * 100 : 0}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}