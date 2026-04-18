'use client'

import { useRouter } from 'next/navigation'
import ProfileForm from '@/components/ProfileForm'
import type { MedicalProfile, ProfileFormValues } from '@/types'

interface Props {
  profile: MedicalProfile | null
  userId: string
}

export default function ProfilePageClient({ profile, userId }: Props) {
  const router = useRouter()

  const handleSave = async (values: ProfileFormValues): Promise<{ error?: string }> => {
    const res = await fetch('/api/profile', {
      method: profile ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...values, user_id: userId }),
    })

    if (!res.ok) {
      const data = await res.json()
      return { error: data.error || 'Error desconocido' }
    }

    router.refresh()
    return {}
  }

  return <ProfileForm profile={profile} onSave={handleSave} />
}
