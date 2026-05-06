'use client'

import { useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { Shield, LayoutDashboard, FileEdit, QrCode, LogOut, Loader2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { createClient } from '@/lib/supabase/client'
import { useNavigation } from '@/lib/navigation-context'
import { cn } from '@/lib/utils'
import LanguageSwitcher from './LanguageSwitcher'
import type { User } from '@supabase/supabase-js'

export default function DashboardNav({ user: _ }: { user: User }) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()
  const { navigate } = useNavigation()
  const { t } = useTranslation()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const navItems = [
    { href: '/dashboard', label: t('nav.home'), icon: LayoutDashboard },
    { href: '/dashboard/profile', label: t('nav.profile'), icon: FileEdit },
    { href: '/dashboard/qr', label: t('nav.myQr'), icon: QrCode },
  ]

  const handleLogout = async () => {
    setIsLoggingOut(true)
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <header className="border-b border-border bg-bg-card/80 backdrop-blur-sm sticky top-0 z-10">
      <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2">
            <div className="w-7 h-7 bg-accent-red rounded-md flex items-center justify-center">
              <Shield className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-display font-bold text-base text-text-primary">EmergiQR</span>
          </button>
          <LanguageSwitcher />
        </div>

        <nav className="flex items-center gap-1">
          {navItems.map((item) => {
            const active = pathname === item.href
            return (
              <button
                key={item.href}
                onClick={() => navigate(item.href)}
                disabled={isLoggingOut}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-display font-medium transition-all duration-150',
                  active
                    ? 'bg-accent-red/10 text-accent-red'
                    : 'text-text-secondary hover:text-text-primary hover:bg-bg-elevated'
                )}
              >
                <item.icon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{item.label}</span>
              </button>
            )
          })}

          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-display font-medium text-text-muted hover:text-accent-red hover:bg-accent-red/10 transition-all duration-150 ml-1 disabled:opacity-50"
          >
            {isLoggingOut
              ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
              : <LogOut className="w-3.5 h-3.5" />
            }
            <span className="hidden sm:inline">
              {isLoggingOut ? t('nav.logoutLoading') : t('nav.logout')}
            </span>
          </button>
        </nav>
      </div>
    </header>
  )
}
