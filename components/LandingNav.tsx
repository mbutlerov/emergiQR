'use client'

import { useTranslation } from 'react-i18next'
import { useNavigation } from '@/lib/navigation-context'
import { ChevronRight } from 'lucide-react'


export function LandingHeaderLinks() {
  const { navigate } = useNavigation()
  const { t } = useTranslation()
  return (
    <div className="flex items-center gap-3">
      <button
        onClick={() => navigate('/login')}
        className="text-sm text-text-secondary hover:text-text-primary transition-colors font-body"
      >
        {t('landing.header.login')}
      </button>
      <button
        onClick={() => navigate('/register')}
        className="btn-primary text-sm py-2 px-4 hidden sm:inline-flex"
      >
        {t('landing.header.signup')}
      </button>
    </div>
  )
}

export function LandingCTAButtons() {
  const { navigate } = useNavigation()
  const { t } = useTranslation()
  return (
    <div className="flex flex-col sm:flex-row gap-3 justify-center">
      <button
        onClick={() => navigate('/register')}
        className="btn-primary flex items-center justify-center gap-2 text-base"
      >
        {t('landing.cta.primary')}
        <ChevronRight className="w-4 h-4" />
      </button>
      <button
        onClick={() => navigate('/e/demo')}
        className="btn-secondary flex items-center justify-center gap-2 text-base"
      >
        {t('landing.cta.secondary')}
      </button>
    </div>
  )
}
