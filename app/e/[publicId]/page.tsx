import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { Phone, MessageCircle, AlertTriangle, Heart, Pill, ShieldAlert, FileText, CreditCard } from 'lucide-react'
import type { PublicProfile } from '@/types'

interface Props {
  params: { publicId: string }
}

async function getPublicProfile(publicId: string): Promise<PublicProfile | null> {
  if (publicId === 'demo') {
    return {
      full_name: 'Juan Carlos Pérez',
      blood_type: 'O+',
      allergies: 'Penicilina, ibuprofeno',
      medical_conditions: 'Diabetes tipo 2, hipertensión',
      current_medications: 'Metformina 500mg/día, Enalapril 10mg',
      emergency_contact_name: 'María Pérez (madre)',
      emergency_contact_phone: '+54 9 11 1234-5678',
      emergency_contact_whatsapp: true,
      insurance_info: 'OSDE 210 — Nº 0012345678',
      additional_notes: 'Alérgico a látex. Usar guantes de nitrilo.',
    }
  }

  const supabase = createClient()
  const { data } = await supabase
    .from('medical_profiles')
    .select(
      'full_name, blood_type, allergies, medical_conditions, current_medications, emergency_contact_name, emergency_contact_phone, emergency_contact_whatsapp, insurance_info, additional_notes'
    )
    .eq('public_id', publicId)
    .is('deleted_at', null)   // nunca mostrar perfiles eliminados
    .single()

  return data ?? null
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const profile = await getPublicProfile(params.publicId)
  if (!profile) return { title: 'Perfil no encontrado — EmergiQR' }
  return {
    title: `⚠️ EMERGENCIA — ${profile.full_name}`,
    description: `Datos médicos de emergencia para ${profile.full_name}`,
  }
}

const bloodTypeColor = (bt: string | null) => {
  if (!bt || bt === 'unknown') return 'bg-text-muted/20 text-text-secondary'
  if (bt.includes('+')) return 'bg-accent-red/20 text-accent-red border border-accent-red/40'
  return 'bg-blue-500/20 text-blue-400 border border-blue-500/40'
}

function DataBlock({
  icon: Icon,
  label,
  value,
  highlight = false,
}: {
  icon: React.ElementType
  label: string
  value: string | null | undefined
  highlight?: boolean
}) {
  if (!value) return null
  return (
    <div className={`rounded-xl p-4 ${highlight ? 'bg-accent-red/10 border border-accent-red/30' : 'bg-bg-elevated border border-border'}`}>
      <div className="flex items-center gap-2 mb-2">
        <Icon className={`w-4 h-4 shrink-0 ${highlight ? 'text-accent-red' : 'text-text-secondary'}`} />
        <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-text-muted">{label}</span>
      </div>
      <p className={`font-body font-medium leading-snug text-sm ${highlight ? 'text-white' : 'text-text-primary'}`}>
        {value}
      </p>
    </div>
  )
}

export default async function EmergencyPage({ params }: Props) {
  const profile = await getPublicProfile(params.publicId)

  if (!profile) notFound()

  const phone = profile.emergency_contact_phone?.replace(/\s+/g, '') ?? ''
  const whatsappUrl = phone
    ? `https://wa.me/${phone.replace(/[^0-9]/g, '')}?text=Emergencia+con+${encodeURIComponent(profile.full_name)}`
    : null
  const callUrl = phone ? `tel:${phone}` : null

  return (
    <main className="min-h-dvh bg-[#080810] text-text-primary px-4 py-6 max-w-lg mx-auto">
      {/* Emergency header */}
      <div className="flex items-center gap-3 bg-accent-red rounded-2xl px-5 py-4 mb-6 shadow-lg shadow-accent-red/20">
        <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
          <AlertTriangle className="w-5 h-5 text-white" />
        </div>
        <div>
          <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/70 leading-none mb-1">
            EmergiQR — Emergencia médica
          </p>
          <h1 className="font-display font-extrabold text-xl text-white leading-tight">
            {profile.full_name}
          </h1>
        </div>
      </div>

      {/* Blood type */}
      {profile.blood_type && profile.blood_type !== 'unknown' && (
        <div className="flex items-center justify-between bg-bg-card border border-border rounded-2xl px-5 py-4 mb-4">
          <div className="flex items-center gap-3">
            <Heart className="w-5 h-5 text-accent-red" />
            <div>
              <p className="text-[10px] font-mono uppercase tracking-[0.18em] text-text-muted mb-0.5">Grupo sanguíneo</p>
              <p className="font-display font-extrabold text-3xl text-text-primary leading-none">
                {profile.blood_type}
              </p>
            </div>
          </div>
          <div className={`px-4 py-2 rounded-xl font-display font-bold text-2xl ${bloodTypeColor(profile.blood_type)}`}>
            {profile.blood_type}
          </div>
        </div>
      )}

      {/* Critical medical info */}
      <div className="space-y-3 mb-6">
        <DataBlock icon={ShieldAlert} label="Alergias" value={profile.allergies} highlight />
        <DataBlock icon={Heart} label="Condiciones médicas" value={profile.medical_conditions} />
        <DataBlock icon={Pill} label="Medicación actual" value={profile.current_medications} />
        <DataBlock icon={CreditCard} label="Seguro médico" value={profile.insurance_info} />
        <DataBlock icon={FileText} label="Observaciones" value={profile.additional_notes} />
      </div>

      {/* Emergency contact */}
      {(profile.emergency_contact_name || phone) && (
        <div className="bg-bg-card border border-border rounded-2xl p-5 mb-4">
          <p className="text-[10px] font-mono uppercase tracking-[0.18em] text-text-muted mb-3">
            Contacto de emergencia
          </p>
          {profile.emergency_contact_name && (
            <p className="font-display font-semibold text-text-primary text-base mb-3">
              {profile.emergency_contact_name}
            </p>
          )}

          {phone && (
            <div className="space-y-2">
              {!profile.emergency_contact_whatsapp && callUrl && (
                <a
                  href={callUrl}
                  className="flex items-center justify-center gap-2 w-full bg-accent-green hover:bg-accent-green/90 text-white font-display font-bold text-base py-4 rounded-xl transition-all active:scale-[0.98] shadow-lg shadow-accent-green/20"
                >
                  <Phone className="w-5 h-5" />
                  Llamar ahora — {phone}
                </a>
              )}

              {profile.emergency_contact_whatsapp && whatsappUrl && (
                <a
                  href={whatsappUrl}
                  className="flex items-center justify-center gap-2 w-full bg-[#25d366] hover:bg-[#20bd5a] text-white font-display font-bold text-base py-4 rounded-xl transition-all active:scale-[0.98] shadow-lg shadow-[#25d366]/20"
                >
                  <MessageCircle className="w-5 h-5" />
                  WhatsApp — {phone}
                </a>
              )}

              {profile.emergency_contact_whatsapp && callUrl && (
                <a
                  href={callUrl}
                  className="flex items-center justify-center gap-2 w-full bg-bg-elevated hover:bg-border border border-border text-text-primary font-display font-medium text-sm py-3 rounded-xl transition-all active:scale-[0.98]"
                >
                  <Phone className="w-4 h-4" />
                  También llamar — {phone}
                </a>
              )}
            </div>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="text-center pt-2 pb-4">
        <p className="text-text-muted text-[11px] font-mono">
          EmergiQR — Sistema QR de Emergencia
        </p>
      </div>
    </main>
  )
}
