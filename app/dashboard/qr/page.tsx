import { createClient } from '@/lib/supabase/server'
import QRContent from '@/components/QRContent'

export default async function QRPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from('medical_profiles')
    .select('full_name, public_id')
    .eq('user_id', user!.id)
    .single()

  return <QRContent profile={profile} />
}
