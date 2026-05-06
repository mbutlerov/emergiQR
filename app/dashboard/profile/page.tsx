import { createClient } from '@/lib/supabase/server'
import ProfilePageHeader from '@/components/ProfilePageHeader'
import ProfilePageClient from './ProfilePageClient'

export default async function ProfilePage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from('medical_profiles')
    .select('*')
    .eq('user_id', user!.id)
    .single()

  return (
    <div className="space-y-6 animate-slide-up">
      <ProfilePageHeader />
      <ProfilePageClient profile={profile} userId={user!.id} />
    </div>
  )
}
