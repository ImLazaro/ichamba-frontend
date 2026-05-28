import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { loginService } from '../services/authService'

type Role = 'buscador' | 'empleador'

export default function LoginForm() {
  const [role, setRole]         = useState<Role>('buscador')
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')
  const navigate                = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const data = await loginService(email, password)
      localStorage.setItem('token', data.token)
      localStorage.setItem('usuario', JSON.stringify(data.usuario))
      navigate('/dashboard')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md space-y-8">
      <div className="lg:hidden text-center">
        <span className="text-white font-black text-3xl">
          i<span className="text-[#FF4D00]">Chamba</span>
        </span>
      </div>

      <div>
        <h1 className="text-white font-black text-3xl">Bienvenid@</h1>
        <p className="text-zinc-400 text-sm mt-1">
          ¿No tienes cuenta?{' '}
          <a href="/register" className="text-[#FF4D00] hover:text-orange-400 font-semibold transition-colors">
  Regístrate gratis
</a>
        </p>
      </div>

      <div className="flex bg-zinc-900 rounded-xl p-1 gap-1">
        {(['buscador', 'empleador'] as Role[]).map((r) => (
          <button
            key={r}
            onClick={() => setRole(r)}
            className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all duration-200 ${
              role === r
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

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-1">
          <label className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">
            Correo electrónico
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tuemail@ejemplo.com"
            className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-xl px-4 py-3.5 text-sm
                       focus:outline-none focus:border-[#FF4D00] focus:ring-1 focus:ring-[#FF4D00]
                       placeholder:text-zinc-600 transition-all"
          />
        </div>

        <div className="space-y-1">
          <label className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">
            Contraseña
          </label>
          <div className="relative">
            <input
              type={showPass ? 'text' : 'password'}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-xl px-4 py-3.5 text-sm
                         focus:outline-none focus:border-[#FF4D00] focus:ring-1 focus:ring-[#FF4D00]
                         placeholder:text-zinc-600 transition-all pr-12"
            />
            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors text-lg"
            >
              {showPass ? '🙈' : '👁️'}
            </button>
          </div>
          <div className="flex justify-end">
            <a href="#" className="text-zinc-500 hover:text-[#FF4D00] text-xs transition-colors">
              ¿Olvidaste tu contraseña?
            </a>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#FF4D00] hover:bg-orange-500 disabled:opacity-60
                     text-white font-black py-4 rounded-xl transition-all duration-200
                     shadow-lg shadow-orange-900/30 hover:scale-[1.01] active:scale-[0.99]
                     text-sm tracking-wide uppercase"
        >
          {loading ? 'Verificando...' : 'Entrar a iChamba'}
        </button>
      </form>

      <div className="flex items-center gap-4">
        <div className="flex-1 h-px bg-zinc-800" />
        <span className="text-zinc-600 text-xs">o continúa con</span>
        <div className="flex-1 h-px bg-zinc-800" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        {[{ icon: '🔵', label: 'Google' }, { icon: '📘', label: 'Facebook' }].map((p) => (
          <button
            key={p.label}
            className="flex items-center justify-center gap-2 bg-zinc-900 hover:bg-zinc-800
                       border border-zinc-800 hover:border-zinc-700 text-zinc-300 text-sm font-semibold
                       py-3 rounded-xl transition-all"
          >
            <span>{p.icon}</span> {p.label}
          </button>
        ))}
      </div>

      <p className="text-zinc-600 text-xs text-center leading-relaxed">
        Al entrar, aceptas los{' '}
        <a href="#" className="text-zinc-400 hover:text-white transition-colors">Términos de uso</a>
        {' '}y la{' '}
        <a href="#" className="text-zinc-400 hover:text-white transition-colors">Política de privacidad</a>.
      </p>
    </div>
  )
}