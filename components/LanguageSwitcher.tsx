'use client'

import { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { ChevronDown } from 'lucide-react'

const LANGS = [
  { code: 'es', label: 'Español' },
  { code: 'en', label: 'English' },
  { code: 'pt', label: 'Português' },
]

export default function LanguageSwitcher() {
  const { i18n } = useTranslation()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const current = i18n.language?.slice(0, 2) ?? 'es'

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs font-mono font-medium text-text-secondary hover:text-text-primary hover:bg-bg-elevated transition-all duration-150"
      >
        {current.toUpperCase()}
        <ChevronDown className={`w-3 h-3 transition-transform duration-150 ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute left-0 top-full mt-1 bg-bg-card border border-border rounded-xl shadow-lg overflow-hidden z-50 min-w-[120px]">
          {LANGS.map(({ code, label }) => (
            <button
              key={code}
              onClick={() => { i18n.changeLanguage(code); setOpen(false) }}
              className={`w-full text-left px-3 py-2 text-xs font-body transition-colors duration-100 flex items-center justify-between gap-2 ${
                current === code
                  ? 'text-accent-red bg-accent-red/5'
                  : 'text-text-secondary hover:text-text-primary hover:bg-bg-elevated'
              }`}
            >
              {label}
              {current === code && <span className="font-mono text-[10px] text-accent-red">{code.toUpperCase()}</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
