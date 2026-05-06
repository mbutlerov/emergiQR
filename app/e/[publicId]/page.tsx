import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import type { PublicProfile } from '@/types'
import EmergencyContent from '@/components/EmergencyContent'

interface Props {
  params: { publicId: string }
}

async function getPublicProfile(publicId: string): Promise<PublicProfile | null> {
  if (publicId === 'demo') {
    return {
      full_name: 'Juan Carlos Pérez',
      blood_type: 'O+',
      allergies: 'Penicilina, ibuprofeno',
      medical_conditions: 'Diabetes tipo 2, hipertensión',
      current_medications: 'Metformina 500mg/día, Enalapril 10mg',
      emergency_contact_name: 'María Pérez (madre)',
      emergency_contact_phone: '+54 9 11 1234-5678',
      emergency_contact_whatsapp: true,
      insurance_info: 'OSDE 210 — Nº 0012345678',
      additional_notes: 'Alérgico a látex. Usar guantes de nitrilo.',
    }
  }

  const supabase = createClient()
  const { data } = await supabase
    .from('medical_profiles')
    .select(
      'full_name, blood_type, allergies, medical_conditions, current_medications, emergency_contact_name, emergency_contact_phone, emergency_contact_whatsapp, insurance_info, additional_notes'
    )
    .eq('public_id', publicId)
    .is('deleted_at', null)
    .single()

  return data ?? null
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const profile = await getPublicProfile(params.publicId)
  if (!profile) return { title: 'Perfil no encontrado — EmergiQR' }
  return {
    title: `⚠️ EMERGENCIA — ${profile.full_name}`,
    description: `Datos médicos de emergencia para ${profile.full_name}`,
  }
}

export default async function EmergencyPage({ params }: Props) {
  const profile = await getPublicProfile(params.publicId)

  if (!profile) notFound()

  const phone = profile.emergency_contact_phone?.replace(/\s+/g, '') ?? ''
  const whatsappUrl = phone
    ? `https://wa.me/${phone.replace(/[^0-9]/g, '')}?text=Emergencia+con+${encodeURIComponent(profile.full_name)}`
    : null
  const callUrl = phone ? `tel:${phone}` : null

  return (
    <EmergencyContent
      profile={profile}
      phone={phone}
      callUrl={callUrl}
      whatsappUrl={whatsappUrl}
    />
  )
}
