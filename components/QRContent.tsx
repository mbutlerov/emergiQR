'use client'

import { useTranslation } from 'react-i18next'
import Link from 'next/link'
import { AlertTriangle } from 'lucide-react'
import QRDisplay from './QRDisplay'

interface Props {
  profile: { full_name: string; public_id: string } | null
}

export default function QRContent({ profile }: Props) {
  const { t } = useTranslation()

  if (!profile) {
    return (
      <div className="space-y-6 animate-slide-up">
        <div>
          <h1 className="font-display font-bold text-2xl text-text-primary">{t('qr.title')}</h1>
        </div>
        <div className="card flex flex-col items-center text-center gap-4 py-12">
          <AlertTriangle className="w-10 h-10 text-accent-amber" />
          <div>
            <p className="font-display font-semibold text-text-primary">{t('qr.empty.title')}</p>
            <p className="text-text-secondary text-sm font-body mt-1">{t('qr.empty.message')}</p>
          </div>
          <Link href="/dashboard/profile" className="btn-primary mt-2">
            {t('qr.empty.button')}
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-slide-up">
      <div>
        <h1 className="font-display font-bold text-2xl text-text-primary">{t('qr.title')}</h1>
        <p className="text-text-secondary text-sm font-body mt-1">{t('qr.subtitle')}</p>
      </div>
      <QRDisplay publicId={profile.public_id} fullName={profile.full_name} />
    </div>
  )
}
