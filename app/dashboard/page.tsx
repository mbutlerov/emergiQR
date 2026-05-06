import { createClient } from '@/lib/supabase/server'
import DashboardContent from '@/components/DashboardContent'

export default async function DashboardPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from('medical_profiles')
    .select('id, full_name, public_id, blood_type, emergency_contact_phone')
    .eq('user_id', user!.id)
    .single()

  return (
    <DashboardContent
      hasProfile={!!profile}
      profile={profile}
      userEmail={user?.email}
    />
  )
}
