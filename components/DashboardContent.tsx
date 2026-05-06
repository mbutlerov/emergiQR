'use client'

import { useTranslation } from 'react-i18next'
import { Shield, AlertTriangle } from 'lucide-react'
import DashboardActions from './DashboardActions'

interface Profile {
  full_name: string | null
  blood_type: string | null
  emergency_contact_phone: string | null
}

interface Props {
  hasProfile: boolean
  profile: Profile | null
  userEmail?: string
}

export default function DashboardContent({ hasProfile, profile, userEmail }: Props) {
  const { t } = useTranslation()

  return (
    <div className="space-y-6 animate-slide-up">
      <div>
        <h1 className="font-display font-bold text-2xl text-text-primary">
          {hasProfile
            ? t('dashboard.welcome.greeting', { name: profile!.full_name?.split(' ')[0] })
            : t('dashboard.welcome.default')}
        </h1>
        <p className="text-text-secondary text-sm font-body mt-1">{userEmail}</p>
      </div>

      {!hasProfile && (
        <div className="bg-accent-amber/10 border border-accent-amber/30 rounded-xl p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-accent-amber shrink-0 mt-0.5" />
          <div>
            <p className="text-text-primary text-sm font-display font-semibold">
              {t('dashboard.alert.title')}
            </p>
            <p className="text-text-secondary text-xs font-body mt-1">
              {t('dashboard.alert.message')}
            </p>
          </div>
        </div>
      )}

      {hasProfile && (
        <div className="card border-accent-green/30 bg-accent-green/5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-accent-green/20 rounded-full flex items-center justify-center">
              <Shield className="w-4 h-4 text-accent-green" />
            </div>
            <div>
              <p className="font-display font-semibold text-text-primary text-sm">
                {t('dashboard.status.title')}
              </p>
              <p className="text-text-secondary text-xs font-body">
                {t('dashboard.status.subtitle')}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <p className="text-text-muted font-mono uppercase tracking-wider mb-0.5">
                {t('dashboard.status.bloodType')}
              </p>
              <p className="text-text-primary font-display font-semibold text-base">
                {profile!.blood_type || '—'}
              </p>
            </div>
            <div>
              <p className="text-text-muted font-mono uppercase tracking-wider mb-0.5">
                {t('dashboard.status.contact')}
              </p>
              <p className="text-text-primary font-body text-sm truncate">
                {profile!.emergency_contact_phone || '—'}
              </p>
            </div>
          </div>
        </div>
      )}

      <DashboardActions hasProfile={hasProfile} />
    </div>
  )
}
