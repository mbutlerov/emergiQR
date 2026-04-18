import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { FileEdit, QrCode, Shield, AlertTriangle } from 'lucide-react'

export default async function DashboardPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from('medical_profiles')
    .select('id, full_name, public_id, blood_type, emergency_contact_phone')
    .eq('user_id', user!.id)
    .single()

  const hasProfile = !!profile

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Welcome */}
      <div>
        <h1 className="font-display font-bold text-2xl text-text-primary">
          {hasProfile ? `Hola, ${profile.full_name?.split(' ')[0]}` : 'Bienvenido a EmergiQR'}
        </h1>
        <p className="text-text-secondary text-sm font-body mt-1">
          {user?.email}
        </p>
      </div>

      {/* Alert if no profile */}
      {!hasProfile && (
        <div className="bg-accent-amber/10 border border-accent-amber/30 rounded-xl p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-accent-amber shrink-0 mt-0.5" />
          <div>
            <p className="text-text-primary text-sm font-display font-semibold">Tu perfil está incompleto</p>
            <p className="text-text-secondary text-xs font-body mt-1">
              Completá tus datos médicos para generar tu QR de emergencia.
            </p>
          </div>
        </div>
      )}

      {/* Status card */}
      {hasProfile && (
        <div className="card border-accent-green/30 bg-accent-green/5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-accent-green/20 rounded-full flex items-center justify-center">
              <Shield className="w-4 h-4 text-accent-green" />
            </div>
            <div>
              <p className="font-display font-semibold text-text-primary text-sm">Perfil activo</p>
              <p className="text-text-secondary text-xs font-body">Tu QR está listo para usar</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <p className="text-text-muted font-mono uppercase tracking-wider mb-0.5">Tipo de sangre</p>
              <p className="text-text-primary font-display font-semibold text-base">
                {profile.blood_type || '—'}
              </p>
            </div>
            <div>
              <p className="text-text-muted font-mono uppercase tracking-wider mb-0.5">Contacto</p>
              <p className="text-text-primary font-body text-sm truncate">
                {profile.emergency_contact_phone || '—'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="grid grid-cols-1 gap-3">
        <Link href="/dashboard/profile" className="card hover:border-border-accent transition-all duration-200 flex items-center gap-4 group">
          <div className="w-10 h-10 bg-bg-elevated rounded-lg flex items-center justify-center group-hover:bg-accent-red/10 transition-colors">
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
        </Link>

        <Link
          href="/dashboard/qr"
          className={`card flex items-center gap-4 group transition-all duration-200 ${
            hasProfile
              ? 'hover:border-border-accent cursor-pointer'
              : 'opacity-50 pointer-events-none'
          }`}
        >
          <div className="w-10 h-10 bg-bg-elevated rounded-lg flex items-center justify-center group-hover:bg-accent-red/10 transition-colors">
            <QrCode className="w-5 h-5 text-text-secondary group-hover:text-accent-red transition-colors" />
          </div>
          <div>
            <p className="font-display font-semibold text-text-primary text-sm">Mi QR de emergencia</p>
            <p className="text-text-secondary text-xs font-body">
              {hasProfile ? 'Ver, descargar e imprimir tu código QR' : 'Primero completá tu perfil'}
            </p>
          </div>
        </Link>
      </div>
    </div>
  )
}
