import Link from 'next/link'
import { Shield } from 'lucide-react'

export default function NotFound() {
  return (
    <main className="min-h-dvh flex items-center justify-center px-4">
      <div className="text-center max-w-sm">
        <div className="w-16 h-16 bg-accent-red/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <Shield className="w-8 h-8 text-accent-red" />
        </div>
        <h1 className="font-display font-bold text-2xl text-text-primary mb-3">
          Perfil no encontrado
        </h1>
        <p className="text-text-secondary font-body text-sm mb-6">
          Este código QR no está registrado o fue eliminado.
        </p>
        <Link href="/" className="btn-primary inline-flex">
          Ir al inicio
        </Link>
      </div>
    </main>
  )
}
