import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import QRDisplay from '@/components/QRDisplay'
import Link from 'next/link'
import { AlertTriangle } from 'lucide-react'

export default async function QRPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from('medical_profiles')
    .select('full_name, public_id')
    .eq('user_id', user!.id)
    .single()

  if (!profile) {
    return (
      <div className="space-y-6 animate-slide-up">
        <div>
          <h1 className="font-display font-bold text-2xl text-text-primary">Mi QR de emergencia</h1>
        </div>
        <div className="card flex flex-col items-center text-center gap-4 py-12">
          <AlertTriangle className="w-10 h-10 text-accent-amber" />
          <div>
            <p className="font-display font-semibold text-text-primary">Primero completá tu perfil</p>
            <p className="text-text-secondary text-sm font-body mt-1">
              Necesitás cargar tus datos médicos para generar el QR.
            </p>
          </div>
          <Link href="/dashboard/profile" className="btn-primary mt-2">
            Ir al perfil
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-slide-up">
      <div>
        <h1 className="font-display font-bold text-2xl text-text-primary">Mi QR de emergencia</h1>
        <p className="text-text-secondary text-sm font-body mt-1">
          Descargá e imprimí este código. No requiere internet para mostrarse una vez escaneado.
        </p>
      </div>
      <QRDisplay publicId={profile.public_id} fullName={profile.full_name} />
    </div>
  )
}
