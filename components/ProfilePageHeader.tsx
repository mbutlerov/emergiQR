'use client'

import { useTranslation } from 'react-i18next'

export default function ProfilePageHeader() {
  const { t } = useTranslation()
  return (
    <div>
      <h1 className="font-display font-bold text-2xl text-text-primary">{t('profile.title')}</h1>
      <p className="text-text-secondary text-sm font-body mt-1">{t('profile.description')}</p>
    </div>
  )
}
