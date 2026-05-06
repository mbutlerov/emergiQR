'use client'

import { FileEdit, QrCode } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useNavigation } from '@/lib/navigation-context'

export default function DashboardActions({ hasProfile }: { hasProfile: boolean }) {
  const { navigate, isNavigating } = useNavigation()
  const { t } = useTranslation()

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
            {hasProfile ? t('actions.profile.edit') : t('actions.profile.complete')}
          </p>
          <p className="text-text-secondary text-xs font-body">
            {t('actions.profile.description')}
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
          <p className="font-display font-semibold text-text-primary text-sm">
            {t('actions.qr.title')}
          </p>
          <p className="text-text-secondary text-xs font-body">
            {hasProfile ? t('actions.qr.descriptionReady') : t('actions.qr.descriptionIncomplete')}
          </p>
        </div>
      </button>
    </div>
  )
}
