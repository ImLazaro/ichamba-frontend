import RegisterForm from '../components/RegisterForm'

export default function Register() {
  return (
    <main className="min-h-screen flex">
      {/* Panel izquierdo — branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-[#FF4D00] flex-col justify-between p-12">
        <div className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `repeating-linear-gradient(45deg, #fff 0, #fff 1px, transparent 0, transparent 50%)`,
            backgroundSize: '20px 20px'
          }}
        />
        <div className="relative z-10">
          <span className="text-white font-black text-4xl tracking-tight">
            i<span className="text-yellow-300">Chamba</span>
          </span>
          <p className="text-white/80 text-sm mt-1 font-medium tracking-widest uppercase">
            El trabajo está en todas partes
          </p>
        </div>

        <div className="relative z-10 space-y-6">
          <h2 className="text-white text-5xl font-black leading-tight">
            Únete a<br />
            la comunidad<br />
            <span className="text-yellow-300">iChamba.</span>
          </h2>
          <p className="text-white/75 text-lg max-w-xs leading-relaxed">
            Crea tu cuenta gratis y empieza a encontrar oportunidades hoy mismo.
          </p>
        </div>

        <div className="relative z-10 flex gap-8">
          {[
            { num: '12K+', label: 'Empleos activos' },
            { num: '3K+',  label: 'Empresas locales' },
            { num: '98%',  label: 'Respuesta rápida' },
          ].map((s) => (
            <div key={s.label}>
              <p className="text-yellow-300 font-black text-2xl">{s.num}</p>
              <p className="text-white/70 text-xs mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Panel derecho — formulario */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-[#0F0F0F] p-8 overflow-y-auto">
        <RegisterForm />
      </div>
    </main>
  )
}