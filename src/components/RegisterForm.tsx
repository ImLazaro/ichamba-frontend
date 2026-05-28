import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { registerService } from '../services/authService'

type Role = 'buscador' | 'empleador'

export default function RegisterForm() {
  const [form, setForm] = useState({
    nombre:           '',
    apellidos:        '',
    telefono:         '',
    email:            '',
    password:         '',
    confirmar:        '',
    fecha_nacimiento: '',
    ocupacion:        '',
    rol:              'buscador' as Role,
  })
  const [showPass, setShowPass]   = useState(false)
  const [loading, setLoading]     = useState(false)
  const [error, setError]         = useState('')
  const navigate                  = useNavigate()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (form.password !== form.confirmar) {
      setError('Las contraseñas no coinciden')
      return
    }
    if (form.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres')
      return
    }

    setLoading(true)
    try {
      await registerService(
        form.nombre,
        form.email,
        form.password,
        form.rol,
        form.apellidos,
        form.telefono,
        form.fecha_nacimiento,
        form.ocupacion
      )
      navigate('/login')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-lg space-y-6 py-8">
      {/* Logo móvil */}
      <div className="lg:hidden text-center">
        <span className="text-white font-black text-3xl">
          i<span className="text-[#FF4D00]">Chamba</span>
        </span>
      </div>

      <div>
        <h1 className="text-white font-black text-3xl">Crear cuenta</h1>
        <p className="text-zinc-400 text-sm mt-1">
          ¿Ya tienes cuenta?{' '}
          <a href="/login" className="text-[#FF4D00] hover:text-orange-400 font-semibold transition-colors">
            Inicia sesión
          </a>
        </p>
      </div>

      {/* Selector de rol */}
      <div className="flex bg-zinc-900 rounded-xl p-1 gap-1">
        {(['buscador', 'empleador'] as Role[]).map((r) => (
          <button
            key={r}
            type="button"
            onClick={() => setForm(prev => ({ ...prev, rol: r }))}
            className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all duration-200 ${
              form.rol === r
                ? 'bg-[#FF4D00] text-white shadow-lg shadow-orange-900/40'
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            {r === 'buscador' ? '🔍 Busco chamba' : '📋 Ofrezco chamba'}
          </button>
        ))}
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-xl px-4 py-3">
          ⚠️ {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Nombre y Apellidos */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">
              Nombre *
            </label>
            <input
              name="nombre" required value={form.nombre} onChange={handleChange}
              placeholder="Ej: Angel"
              className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-xl px-4 py-3 text-sm
                         focus:outline-none focus:border-[#FF4D00] focus:ring-1 focus:ring-[#FF4D00]
                         placeholder:text-zinc-600 transition-all"
            />
          </div>
          <div className="space-y-1">
            <label className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">
              Apellidos *
            </label>
            <input
              name="apellidos" required value={form.apellidos} onChange={handleChange}
              placeholder="Ej: Hernández"
              className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-xl px-4 py-3 text-sm
                         focus:outline-none focus:border-[#FF4D00] focus:ring-1 focus:ring-[#FF4D00]
                         placeholder:text-zinc-600 transition-all"
            />
          </div>
        </div>

        {/* Teléfono y Fecha de nacimiento */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">
              Teléfono
            </label>
            <input
              name="telefono" value={form.telefono} onChange={handleChange}
              placeholder="Ej: 9511234567"
              className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-xl px-4 py-3 text-sm
                         focus:outline-none focus:border-[#FF4D00] focus:ring-1 focus:ring-[#FF4D00]
                         placeholder:text-zinc-600 transition-all"
            />
          </div>
          <div className="space-y-1">
            <label className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">
              Fecha de nacimiento
            </label>
            <input
              type="date" name="fecha_nacimiento" value={form.fecha_nacimiento} onChange={handleChange}
              className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-xl px-4 py-3 text-sm
                         focus:outline-none focus:border-[#FF4D00] focus:ring-1 focus:ring-[#FF4D00]
                         transition-all"
            />
          </div>
        </div>

        {/* Ocupación */}
        <div className="space-y-1">
          <label className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">
            Ocupación
          </label>
          <input
            name="ocupacion" value={form.ocupacion} onChange={handleChange}
            placeholder={form.rol === 'buscador' ? 'Ej: Estudiante de Ingeniería' : 'Ej: Dueño de negocio'}
            className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-xl px-4 py-3 text-sm
                       focus:outline-none focus:border-[#FF4D00] focus:ring-1 focus:ring-[#FF4D00]
                       placeholder:text-zinc-600 transition-all"
          />
        </div>

        {/* Email */}
        <div className="space-y-1">
          <label className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">
            Correo electrónico *
          </label>
          <input
            type="email" name="email" required value={form.email} onChange={handleChange}
            placeholder="tuemail@ejemplo.com"
            className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-xl px-4 py-3 text-sm
                       focus:outline-none focus:border-[#FF4D00] focus:ring-1 focus:ring-[#FF4D00]
                       placeholder:text-zinc-600 transition-all"
          />
        </div>

        {/* Contraseña y confirmar */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">
              Contraseña *
            </label>
            <div className="relative">
              <input
                type={showPass ? 'text' : 'password'}
                name="password" required value={form.password} onChange={handleChange}
                placeholder="Mín. 6 caracteres"
                className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-xl px-4 py-3 text-sm
                           focus:outline-none focus:border-[#FF4D00] focus:ring-1 focus:ring-[#FF4D00]
                           placeholder:text-zinc-600 transition-all pr-10"
              />
              <button
                type="button" onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 text-base"
              >
                {showPass ? '🙈' : '👁️'}
              </button>
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">
              Confirmar *
            </label>
            <input
              type={showPass ? 'text' : 'password'}
              name="confirmar" required value={form.confirmar} onChange={handleChange}
              placeholder="Repite la contraseña"
              className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-xl px-4 py-3 text-sm
                         focus:outline-none focus:border-[#FF4D00] focus:ring-1 focus:ring-[#FF4D00]
                         placeholder:text-zinc-600 transition-all"
            />
          </div>
        </div>

        {/* Indicador de seguridad */}
        {form.password && (
          <div className="space-y-1">
            <div className="flex gap-1">
              {[1,2,3,4].map((n) => (
                <div key={n} className={`h-1 flex-1 rounded-full transition-all ${
                  form.password.length >= n * 3
                    ? n <= 1 ? 'bg-red-500'
                    : n <= 2 ? 'bg-yellow-500'
                    : n <= 3 ? 'bg-blue-500'
                    : 'bg-green-500'
                    : 'bg-zinc-700'
                }`} />
              ))}
            </div>
            <p className="text-zinc-500 text-xs">
              {form.password.length < 4 ? 'Muy débil' :
               form.password.length < 7 ? 'Débil' :
               form.password.length < 10 ? 'Buena' : 'Excelente'}
            </p>
          </div>
        )}

        <button
          type="submit" disabled={loading}
          className="w-full bg-[#FF4D00] hover:bg-orange-500 disabled:opacity-60
                     text-white font-black py-4 rounded-xl transition-all duration-200
                     shadow-lg shadow-orange-900/30 hover:scale-[1.01] active:scale-[0.99]
                     text-sm tracking-wide uppercase mt-2"
        >
          {loading ? 'Creando cuenta...' : 'Crear mi cuenta'}
        </button>
      </form>

      <p className="text-zinc-600 text-xs text-center">
        Al registrarte, aceptas los{' '}
        <a href="#" className="text-zinc-400 hover:text-white transition-colors">Términos de uso</a>
        {' '}y la{' '}
        <a href="#" className="text-zinc-400 hover:text-white transition-colors">Política de privacidad</a>.
      </p>
    </div>
  )
}