import { useState, useEffect } from 'react'
import { getPerfilService, updatePerfilService } from '../../../services/authService'

export default function PerfilEmpresa() {
  const [form, setForm] = useState({
    nombre:           '',
    apellidos:        '',
    telefono:         '',
    fecha_nacimiento: '',
    ocupacion:        '',
    email:            '',
    rol:              '',
  })
  const [editando, setEditando] = useState(false)
  const [loading, setLoading]   = useState(true)
  const [saving, setSaving]     = useState(false)
  const [mensaje, setMensaje]   = useState('')
  const [error, setError]       = useState('')

  useEffect(() => {
    const fetchPerfil = async () => {
      try {
        const data = await getPerfilService()
        setForm({
          nombre:           data.nombre           || '',
          apellidos:        data.apellidos         || '',
          telefono:         data.telefono          || '',
          fecha_nacimiento: data.fecha_nacimiento
            ? data.fecha_nacimiento.split('T')[0]  : '',
          ocupacion:        data.ocupacion         || '',
          email:            data.email             || '',
          rol:              data.rol               || '',
        })
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchPerfil()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setMensaje('')
    setError('')
    try {
      const data = await updatePerfilService({
        nombre:           form.nombre,
        apellidos:        form.apellidos,
        telefono:         form.telefono,
        fecha_nacimiento: form.fecha_nacimiento,
        ocupacion:        form.ocupacion,
      })
      const usuarioActual = JSON.parse(localStorage.getItem('usuario') || '{}')
      localStorage.setItem('usuario', JSON.stringify({ ...usuarioActual, ...data.usuario }))
      setMensaje('¡Perfil actualizado correctamente!')
      setEditando(false)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <p className="text-zinc-500 text-sm">Cargando perfil...</p>

  return (
    <div className="space-y-6 max-w-lg">
      <div className="flex items-center justify-between">
        <h2 className="text-white text-2xl font-black">Perfil de empresa</h2>
        {!editando && (
          <button
            onClick={() => setEditando(true)}
            className="bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-300
                       hover:text-white text-sm font-semibold px-4 py-2 rounded-lg transition-all"
          >
            ✏️ Editar
          </button>
        )}
      </div>

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

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-5">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-[#FF4D00] flex items-center justify-center
                          text-white font-black text-2xl shrink-0">
            {form.nombre?.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-white font-bold text-lg">{form.nombre} {form.apellidos}</p>
            <p className="text-zinc-400 text-sm">{form.email}</p>
            <span className="text-xs bg-[#FF4D00]/10 text-[#FF4D00] border border-[#FF4D00]/20
                             px-2 py-0.5 rounded-lg font-semibold mt-1 inline-block capitalize">
              {form.rol}
            </span>
          </div>
        </div>

        <div className="h-px bg-zinc-800" />

        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Nombre',    name: 'nombre' },
              { label: 'Apellidos', name: 'apellidos' },
            ].map((f) => (
              <div key={f.name} className="space-y-1">
                <label className="text-zinc-500 text-xs font-semibold uppercase tracking-wider">
                  {f.label}
                </label>
                {editando ? (
                  <input name={f.name} value={form[f.name as keyof typeof form]}
                    onChange={handleChange} required
                    className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-xl px-4 py-3 text-sm
                               focus:outline-none focus:border-[#FF4D00] transition-all" />
                ) : (
                  <p className="text-white text-sm bg-zinc-800 rounded-xl px-4 py-3">
                    {form[f.name as keyof typeof form] || '—'}
                  </p>
                )}
              </div>
            ))}
          </div>

          {[
            { label: 'Teléfono',    name: 'telefono',         type: 'text' },
            { label: 'Ocupación',   name: 'ocupacion',        type: 'text' },
          ].map((f) => (
            <div key={f.name} className="space-y-1">
              <label className="text-zinc-500 text-xs font-semibold uppercase tracking-wider">
                {f.label}
              </label>
              {editando ? (
                <input type={f.type} name={f.name}
                  value={form[f.name as keyof typeof form]} onChange={handleChange}
                  className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-xl px-4 py-3 text-sm
                             focus:outline-none focus:border-[#FF4D00] transition-all" />
              ) : (
                <p className="text-white text-sm bg-zinc-800 rounded-xl px-4 py-3">
                  {form[f.name as keyof typeof form] || '—'}
                </p>
              )}
            </div>
          ))}

          <div className="space-y-1">
            <label className="text-zinc-500 text-xs font-semibold uppercase tracking-wider">
              Correo electrónico
            </label>
            <p className="text-zinc-400 text-sm bg-zinc-800/50 rounded-xl px-4 py-3 border border-zinc-800">
              {form.email}
              <span className="ml-2 text-xs text-zinc-600">(no editable)</span>
            </p>
          </div>

          {editando && (
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => { setEditando(false); setError('') }}
                className="flex-1 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700
                           text-zinc-300 font-bold py-3 rounded-xl transition-all text-sm">
                Cancelar
              </button>
              <button type="submit" disabled={saving}
                className="flex-1 bg-[#FF4D00] hover:bg-orange-500 disabled:opacity-60
                           text-white font-bold py-3 rounded-xl transition-all text-sm">
                {saving ? 'Guardando...' : 'Guardar cambios'}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  )
}