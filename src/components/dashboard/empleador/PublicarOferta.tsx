import { useState } from 'react'

export default function PublicarOferta() {
  const [form, setForm] = useState({
    titulo: '', descripcion: '', empresa: '', tipo_empleador: '',
    lugar: '', tipo_contrato: '', salario: '', requisitos: '', es_practicas: false
  })
  const [loading, setLoading] = useState(false)
  const [mensaje, setMensaje] = useState('')
  const [error, setError]     = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMensaje('')
    setError('')

    try {
      const token = localStorage.getItem('token')
      const res = await fetch('http://localhost:4000/api/ofertas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(form)
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message)
      setMensaje('¡Oferta publicada correctamente! 🎉')
      setForm({ titulo: '', descripcion: '', empresa: '', tipo_empleador: '',
                lugar: '', tipo_contrato: '', salario: '', requisitos: '', es_practicas: false })
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const tiposEmpleador = ['Negocio local', 'Empresa mediana', 'Gran empresa', 'Acepta practicantes', 'Freelance']
  const tiposContrato  = ['Tiempo completo', 'Medio tiempo', 'Prácticas', 'Por proyecto', 'Temporal']

  return (
    <div className="space-y-6 max-w-2xl">
      <h2 className="text-white text-2xl font-black">Publicar oferta</h2>

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

      <form onSubmit={handleSubmit} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-5">

        {/* Título */}
        <div className="space-y-1">
          <label className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">Título del puesto *</label>
          <input name="titulo" required value={form.titulo} onChange={handleChange}
            placeholder="Ej: Cajero/a de turno, Repartidor, Prácticas Dev Web..."
            className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-xl px-4 py-3 text-sm
                       focus:outline-none focus:border-[#FF4D00] placeholder:text-zinc-600" />
        </div>

        {/* Empresa y tipo */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">Nombre del negocio/empresa *</label>
            <input name="empresa" required value={form.empresa} onChange={handleChange}
              placeholder="Ej: Tacos El Güero"
              className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-xl px-4 py-3 text-sm
                         focus:outline-none focus:border-[#FF4D00] placeholder:text-zinc-600" />
          </div>
          <div className="space-y-1">
            <label className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">Tipo de empleador</label>
            <select name="tipo_empleador" value={form.tipo_empleador} onChange={handleChange}
              className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-xl px-4 py-3 text-sm
                         focus:outline-none focus:border-[#FF4D00]">
              <option value="">Seleccionar...</option>
              {tiposEmpleador.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </div>

        {/* Lugar y contrato */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">Lugar *</label>
            <input name="lugar" required value={form.lugar} onChange={handleChange}
              placeholder="Ej: Col. Centro, Remoto..."
              className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-xl px-4 py-3 text-sm
                         focus:outline-none focus:border-[#FF4D00] placeholder:text-zinc-600" />
          </div>
          <div className="space-y-1">
            <label className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">Tipo de contrato *</label>
            <select name="tipo_contrato" required value={form.tipo_contrato} onChange={handleChange}
              className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-xl px-4 py-3 text-sm
                         focus:outline-none focus:border-[#FF4D00]">
              <option value="">Seleccionar...</option>
              {tiposContrato.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </div>

        {/* Salario */}
        <div className="space-y-1">
          <label className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">Salario</label>
          <input name="salario" value={form.salario} onChange={handleChange}
            placeholder="Ej: $3,500/mes, $200/día, A convenir..."
            className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-xl px-4 py-3 text-sm
                       focus:outline-none focus:border-[#FF4D00] placeholder:text-zinc-600" />
        </div>

        {/* Descripción */}
        <div className="space-y-1">
          <label className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">Descripción del puesto</label>
          <textarea name="descripcion" value={form.descripcion} onChange={handleChange} rows={3}
            placeholder="Describe las actividades del puesto..."
            className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-xl px-4 py-3 text-sm
                       focus:outline-none focus:border-[#FF4D00] placeholder:text-zinc-600 resize-none" />
        </div>

        {/* Requisitos */}
        <div className="space-y-1">
          <label className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">Requisitos</label>
          <textarea name="requisitos" value={form.requisitos} onChange={handleChange} rows={3}
            placeholder="Ej: Mayor de edad, con experiencia, estudiante activo..."
            className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-xl px-4 py-3 text-sm
                       focus:outline-none focus:border-[#FF4D00] placeholder:text-zinc-600 resize-none" />
        </div>

        {/* Prácticas */}
        <div className="flex items-center gap-3">
          <input type="checkbox" name="es_practicas" id="es_practicas"
            checked={form.es_practicas} onChange={handleChange}
            className="w-4 h-4 accent-[#FF4D00]" />
          <label htmlFor="es_practicas" className="text-zinc-300 text-sm">
            Esta oferta es para <span className="text-[#FF4D00] font-semibold">prácticas profesionales</span>
          </label>
        </div>

        <button type="submit" disabled={loading}
          className="w-full bg-[#FF4D00] hover:bg-orange-500 disabled:opacity-60 text-white font-black
                     py-4 rounded-xl transition-all text-sm uppercase tracking-wide">
          {loading ? 'Publicando...' : '📢 Publicar oferta'}
        </button>
      </form>
    </div>
  )
}