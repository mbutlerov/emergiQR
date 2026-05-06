'use client'

import { useTranslation } from 'react-i18next'
import { Shield, QrCode, Smartphone, Heart, Zap } from 'lucide-react'
import { LandingHeaderLinks, LandingCTAButtons } from '@/components/LandingNav'
import LanguageSwitcher from '@/components/LanguageSwitcher'

export default function HomePage() {
  const { t } = useTranslation()

  const features = [
    { icon: QrCode, title: t('homepage.feature1.title'), desc: t('homepage.feature1.desc') },
    { icon: Smartphone, title: t('homepage.feature2.title'), desc: t('homepage.feature2.desc') },
    { icon: Heart, title: t('homepage.feature3.title'), desc: t('homepage.feature3.desc') },
  ]

  return (
    <main className="min-h-dvh flex flex-col">
      {/* Header */}
      <header className="border-b border-border px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-accent-red rounded-lg flex items-center justify-center">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <span className="font-display font-bold text-lg text-text-primary">EmergiQR</span>
          </div>
          <LanguageSwitcher />
        </div>
        <LandingHeaderLinks />
      </header>

      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center px-6 py-20 text-center relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent-red/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-accent-red/10 border border-accent-red/20 rounded-full px-4 py-2 mb-8">
            <Zap className="w-3.5 h-3.5 text-accent-red" />
            <span className="text-xs font-display font-semibold text-accent-red uppercase tracking-widest">
              {t('homepage.tagline')}
            </span>
          </div>

          <h1 className="font-display font-extrabold text-3xl sm:text-5xl md:text-6xl text-text-primary leading-[1.05] mb-6">
            {t('homepage.hero.title')}<br />
            <span className="text-accent-red">{t('homepage.hero.titleHighlight')}</span>
          </h1>

          <p className="text-text-secondary text-lg font-body leading-relaxed mb-10 max-w-xl mx-auto">
            {t('homepage.hero.subtitle')}
          </p>

          <LandingCTAButtons />
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-border px-6 py-16">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((f) => (
            <div key={f.title} className="card">
              <div className="w-10 h-10 bg-accent-red/10 rounded-lg flex items-center justify-center mb-4">
                <f.icon className="w-5 h-5 text-accent-red" />
              </div>
              <h3 className="font-display font-semibold text-text-primary mb-2">{f.title}</h3>
              <p className="text-text-secondary text-sm font-body leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border px-6 py-6 text-center">
        <p className="text-text-muted text-xs font-body">
          {t('homepage.footer')}
        </p>
      </footer>
    </main>
  )
}
