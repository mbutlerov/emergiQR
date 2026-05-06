'use client'

import { useTranslation } from 'react-i18next'
import { Phone, MessageCircle, AlertTriangle, Heart, Pill, ShieldAlert, FileText, CreditCard } from 'lucide-react'
import type { PublicProfile } from '@/types'

interface Props {
  profile: PublicProfile
  phone: string
  callUrl: string | null
  whatsappUrl: string | null
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

export default function EmergencyContent({ profile, phone, callUrl, whatsappUrl }: Props) {
  const { t } = useTranslation()

  return (
    <main className="min-h-dvh bg-[#080810] text-text-primary px-4 py-6 max-w-lg mx-auto">
      {/* Emergency header */}
      <div className="flex items-center gap-3 bg-accent-red rounded-2xl px-5 py-4 mb-6 shadow-lg shadow-accent-red/20">
        <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
          <AlertTriangle className="w-5 h-5 text-white" />
        </div>
        <div>
          <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/70 leading-none mb-1">
            {t('emergency.header.label')}
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
              <p className="text-[10px] font-mono uppercase tracking-[0.18em] text-text-muted mb-0.5">
                {t('emergency.bloodType')}
              </p>
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
        <DataBlock icon={ShieldAlert} label={t('emergency.allergies')} value={profile.allergies} highlight />
        <DataBlock icon={Heart} label={t('emergency.conditions')} value={profile.medical_conditions} />
        <DataBlock icon={Pill} label={t('emergency.medications')} value={profile.current_medications} />
        <DataBlock icon={CreditCard} label={t('emergency.insurance')} value={profile.insurance_info} />
        <DataBlock icon={FileText} label={t('emergency.notes')} value={profile.additional_notes} />
      </div>

      {/* Emergency contact */}
      {(profile.emergency_contact_name || phone) && (
        <div className="bg-bg-card border border-border rounded-2xl p-5 mb-4">
          <p className="text-[10px] font-mono uppercase tracking-[0.18em] text-text-muted mb-3">
            {t('emergency.contact.label')}
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
                  {t('emergency.contact.callButton', { phone })}
                </a>
              )}

              {profile.emergency_contact_whatsapp && whatsappUrl && (
                <a
                  href={whatsappUrl}
                  className="flex items-center justify-center gap-2 w-full bg-[#25d366] hover:bg-[#20bd5a] text-white font-display font-bold text-base py-4 rounded-xl transition-all active:scale-[0.98] shadow-lg shadow-[#25d366]/20"
                >
                  <MessageCircle className="w-5 h-5" />
                  {t('emergency.contact.whatsappButton', { phone })}
                </a>
              )}

              {profile.emergency_contact_whatsapp && callUrl && (
                <a
                  href={callUrl}
                  className="flex items-center justify-center gap-2 w-full bg-bg-elevated hover:bg-border border border-border text-text-primary font-display font-medium text-sm py-3 rounded-xl transition-all active:scale-[0.98]"
                >
                  <Phone className="w-4 h-4" />
                  {t('emergency.contact.callAlternative', { phone })}
                </a>
              )}
            </div>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="text-center pt-2 pb-4">
        <p className="text-text-muted text-[11px] font-mono">{t('emergency.footer')}</p>
      </div>
    </main>
  )
}
