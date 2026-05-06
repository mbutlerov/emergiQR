'use client'

import { createContext, useContext, useTransition, useCallback } from 'react'
import { useRouter } from 'next/navigation'

interface NavigationContextValue {
  isNavigating: boolean
  navigate: (href: string) => void
}

const NavigationContext = createContext<NavigationContextValue>({
  isNavigating: false,
  navigate: () => {},
})

export function NavigationProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const navigate = useCallback((href: string) => {
    startTransition(() => {
      router.push(href)
    })
  }, [router])

  return (
    <NavigationContext.Provider value={{ isNavigating: isPending, navigate }}>
      {children}
    </NavigationContext.Provider>
  )
}

export const useNavigation = () => useContext(NavigationContext)
