import Link from 'next/link'
import { Shield, QrCode, Smartphone, ChevronRight, Heart, Zap } from 'lucide-react'

export default function HomePage() {
  return (
    <main className="min-h-dvh flex flex-col">
      {/* Header */}
      <header className="border-b border-border px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-accent-red rounded-lg flex items-center justify-center">
            <Shield className="w-4 h-4 text-white" />
          </div>
          <span className="font-display font-bold text-lg text-text-primary">EmergiQR</span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login" className="text-sm text-text-secondary hover:text-text-primary transition-colors font-body">
            Ingresar
          </Link>
          <Link href="/register" className="btn-primary text-sm py-2 px-4 hidden sm:inline-flex">
            Comenzar gratis
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center px-6 py-20 text-center relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent-red/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-accent-red/10 border border-accent-red/20 rounded-full px-4 py-2 mb-8">
            <Zap className="w-3.5 h-3.5 text-accent-red" />
            <span className="text-xs font-display font-semibold text-accent-red uppercase tracking-widest">
              Sistema de emergencia
            </span>
          </div>

          <h1 className="font-display font-extrabold text-3xl sm:text-5xl md:text-6xl text-text-primary leading-[1.05] mb-6">
            Tu información médica,<br />
            <span className="text-accent-red">al instante</span>
          </h1>

          <p className="text-text-secondary text-lg font-body leading-relaxed mb-10 max-w-xl mx-auto">
            Un QR en tu casco o billetera permite que cualquier persona acceda a tus datos médicos críticos en segundos. Sin apps. Sin registro.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/register" className="btn-primary flex items-center justify-center gap-2 text-base">
              Crear mi QR gratis
              <ChevronRight className="w-4 h-4" />
            </Link>
            <Link href="/e/demo" className="btn-secondary flex items-center justify-center gap-2 text-base">
              Ver ejemplo
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-border px-6 py-16">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: QrCode,
              title: 'QR Único',
              desc: 'Genera un código QR personal y descárgalo para imprimirlo en tu casco, moto o billetera.',
            },
            {
              icon: Smartphone,
              title: 'Página Instantánea',
              desc: 'Al escanear, se abre una página optimizada para móvil con tus datos sin necesidad de app ni login.',
            },
            {
              icon: Heart,
              title: 'Datos Críticos',
              desc: 'Tipo de sangre, alergias, medicación y contacto de emergencia visibles al instante.',
            },
          ].map((f) => (
            <div key={f.title} className="card">
              <div className="w-10 h-10 bg-accent-red/10 rounded-lg flex items-center justify-center mb-4">
                <f.icon className="w-5 h-5 text-accent-red" />
              </div>
              <h3 className="font-display font-semibold text-text-primary mb-2">{f.title}</h3>
              <p className="text-text-secondary text-sm font-body leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border px-6 py-6 text-center">
        <p className="text-text-muted text-xs font-body">
          © 2024 EmergiQR. Todos los derechos reservados.
        </p>
      </footer>
    </main>
  )
}
