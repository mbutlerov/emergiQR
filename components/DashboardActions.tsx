'use client'

import { FileEdit, QrCode } from 'lucide-react'
import { useNavigation } from '@/lib/navigation-context'

export default function DashboardActions({ hasProfile }: { hasProfile: boolean }) {
  const { navigate, isNavigating } = useNavigation()

  return (
    <div className="grid grid-cols-1 gap-3">
      <button
        onClick={() => navigate('/dashboard/profile')}
        disabled={isNavigating}
        className="card hover:border-border-accent transition-all duration-200 flex items-center gap-4 group text-left disabled:opacity-70"
      >
        <div className="w-10 h-10 bg-bg-elevated rounded-lg flex items-center justify-center group-hover:bg-accent-red/10 transition-colors shrink-0">
          <FileEdit className="w-5 h-5 text-text-secondary group-hover:text-accent-red transition-colors" />
        </div>
        <div>
          <p className="font-display font-semibold text-text-primary text-sm">
            {hasProfile ? 'Editar perfil médico' : 'Completar perfil médico'}
          </p>
          <p className="text-text-secondary text-xs font-body">
            Datos personales, alergias, medicación y contacto
          </p>
        </div>
      </button>

      <button
        onClick={() => hasProfile && navigate('/dashboard/qr')}
        disabled={isNavigating || !hasProfile}
        className={`card flex items-center gap-4 group transition-all duration-200 text-left ${
          hasProfile
            ? 'hover:border-border-accent disabled:opacity-70'
            : 'opacity-50 cursor-not-allowed'
        }`}
      >
        <div className="w-10 h-10 bg-bg-elevated rounded-lg flex items-center justify-center group-hover:bg-accent-red/10 transition-colors shrink-0">
          <QrCode className="w-5 h-5 text-text-secondary group-hover:text-accent-red transition-colors" />
        </div>
        <div>
          <p className="font-display font-semibold text-text-primary text-sm">Mi QR de emergencia</p>
          <p className="text-text-secondary text-xs font-body">
            {hasProfile ? 'Ver, descargar e imprimir tu código QR' : 'Primero completá tu perfil'}
          </p>
        </div>
      </button>
    </div>
  )
}
