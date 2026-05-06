'use client'

import { useNavigation } from '@/lib/navigation-context'
import { Loader2 } from 'lucide-react'

export default function LoadingOverlay() {
  const { isNavigating } = useNavigation()

  if (!isNavigating) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-bg/80 backdrop-blur-sm animate-fade-in">
      <Loader2 className="w-10 h-10 text-accent-red animate-spin" />
    </div>
  )
}
