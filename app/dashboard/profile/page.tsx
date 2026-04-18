import { createClient } from '@/lib/supabase/server'
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
      <div>
        <h1 className="font-display font-bold text-2xl text-text-primary">Perfil médico</h1>
        <p className="text-text-secondary text-sm font-body mt-1">
          Esta información se mostrará cuando alguien escanee tu QR de emergencia.
        </p>
      </div>
      <ProfilePageClient profile={profile} userId={user!.id} />
    </div>
  )
}
