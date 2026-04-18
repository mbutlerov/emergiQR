export interface MedicalProfile {
  id: string
  user_id: string
  public_id: string
  full_name: string
  birth_date: string | null
  blood_type: BloodType | null
  allergies: string | null
  medical_conditions: string | null
  current_medications: string | null
  emergency_contact_name: string | null
  emergency_contact_phone: string | null
  emergency_contact_whatsapp: boolean
  insurance_info: string | null
  additional_notes: string | null
  created_at: string
  updated_at: string
}

export type BloodType =
  | 'A+'
  | 'A-'
  | 'B+'
  | 'B-'
  | 'AB+'
  | 'AB-'
  | 'O+'
  | 'O-'
  | 'unknown'

export interface PublicProfile {
  full_name: string
  blood_type: BloodType | null
  allergies: string | null
  medical_conditions: string | null
  current_medications: string | null
  emergency_contact_name: string | null
  emergency_contact_phone: string | null
  emergency_contact_whatsapp: boolean
  insurance_info: string | null
  additional_notes: string | null
}

export interface ProfileFormValues {
  full_name: string
  birth_date: string
  blood_type: BloodType | ''
  allergies: string
  medical_conditions: string
  current_medications: string
  emergency_contact_name: string
  emergency_contact_phone: string
  emergency_contact_whatsapp: boolean
  insurance_info: string
  additional_notes: string
}
