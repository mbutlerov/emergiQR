'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2, Save } from 'lucide-react'
import { cn, BLOOD_TYPES } from '@/lib/utils'
import type { MedicalProfile, ProfileFormValues } from '@/types'

const schema = z.object({
  full_name: z.string().min(2, 'El nombre es obligatorio'),
  birth_date: z.string().optional(),
  blood_type: z.string().optional(),
  allergies: z.string().optional(),
  medical_conditions: z.string().optional(),
  current_medications: z.string().optional(),
  emergency_contact_name: z.string().optional(),
  emergency_contact_phone: z.string().optional(),
  emergency_contact_whatsapp: z.boolean().optional(),
  insurance_info: z.string().optional(),
  additional_notes: z.string().optional(),
})

interface Props {
  profile: MedicalProfile | null
  onSave: (values: ProfileFormValues) => Promise<{ error?: string }>
}

export default function ProfileForm({ profile, onSave }: Props) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      full_name: profile?.full_name ?? '',
      birth_date: profile?.birth_date ?? '',
      blood_type: (profile?.blood_type as ProfileFormValues['blood_type']) ?? '',
      allergies: profile?.allergies ?? '',
      medical_conditions: profile?.medical_conditions ?? '',
      current_medications: profile?.current_medications ?? '',
      emergency_contact_name: profile?.emergency_contact_name ?? '',
      emergency_contact_phone: profile?.emergency_contact_phone ?? '',
      emergency_contact_whatsapp: profile?.emergency_contact_whatsapp ?? false,
      insurance_info: profile?.insurance_info ?? '',
      additional_notes: profile?.additional_notes ?? '',
    },
  })

  const [saveStatus, setSaveStatus] = React.useState<'idle' | 'success' | 'error'>('idle')

  const onSubmit = async (values: ProfileFormValues) => {
    setSaveStatus('idle')
    const result = await onSave(values)
    if (result.error) {
      setSaveStatus('error')
    } else {
      setSaveStatus('success')
      setTimeout(() => setSaveStatus('idle'), 3000)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8" noValidate>
      {/* Section: Personal */}
      <section className="card space-y-5">
        <h2 className="font-display font-semibold text-text-primary flex items-center gap-2 text-sm uppercase tracking-widest text-text-secondary">
          Datos personales
        </h2>

        <div>
          <label className="label">Nombre completo *</label>
          <input
            {...register('full_name')}
            className="input-base"
            placeholder="Ej: Juan Carlos Pérez"
          />
          {errors.full_name && <p className="error-text">{errors.full_name.message}</p>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="label">Fecha de nacimiento</label>
            <input
              {...register('birth_date')}
              type="date"
              className="input-base"
            />
          </div>

          <div>
            <label className="label">Tipo de sangre</label>
            <select {...register('blood_type')} className="input-base">
              <option value="">No sé / N/A</option>
              {BLOOD_TYPES.map((bt) => (
                <option key={bt} value={bt}>
                  {bt === 'unknown' ? 'Desconocido' : bt}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* Section: Medical */}
      <section className="card space-y-5">
        <h2 className="font-display font-semibold text-sm uppercase tracking-widest text-text-secondary">
          Información médica
        </h2>

        <div>
          <label className="label">Alergias</label>
          <textarea
            {...register('allergies')}
            className="input-base min-h-[80px] resize-y"
            placeholder="Ej: Penicilina, látex, mariscos..."
          />
          <p className="text-text-muted text-xs font-body mt-1">Separadas por coma. Dejar vacío si no tenés.</p>
        </div>

        <div>
          <label className="label">Enfermedades / condiciones médicas</label>
          <textarea
            {...register('medical_conditions')}
            className="input-base min-h-[80px] resize-y"
            placeholder="Ej: Diabetes tipo 2, hipertensión..."
          />
        </div>

        <div>
          <label className="label">Medicación actual</label>
          <textarea
            {...register('current_medications')}
            className="input-base min-h-[80px] resize-y"
            placeholder="Ej: Metformina 500mg/día, Enalapril 10mg..."
          />
        </div>
      </section>

      {/* Section: Emergency contact */}
      <section className="card space-y-5">
        <h2 className="font-display font-semibold text-sm uppercase tracking-widest text-text-secondary">
          Contacto de emergencia
        </h2>

        <div>
          <label className="label">Nombre del contacto</label>
          <input
            {...register('emergency_contact_name')}
            className="input-base"
            placeholder="Ej: María Pérez (madre)"
          />
        </div>

        <div>
          <label className="label">Teléfono</label>
          <input
            {...register('emergency_contact_phone')}
            type="tel"
            className="input-base"
            placeholder="+54 9 11 1234-5678"
          />
        </div>

        <label className="flex items-center gap-3 cursor-pointer group">
          <input
            {...register('emergency_contact_whatsapp')}
            type="checkbox"
            className="w-4 h-4 rounded border-border bg-bg-elevated accent-accent-red cursor-pointer"
          />
          <span className="text-sm font-body text-text-secondary group-hover:text-text-primary transition-colors">
            Preferir WhatsApp en lugar de llamada directa
          </span>
        </label>
      </section>

      {/* Section: Extra */}
      <section className="card space-y-5">
        <h2 className="font-display font-semibold text-sm uppercase tracking-widest text-text-secondary">
          Información adicional
        </h2>

        <div>
          <label className="label">Seguro médico</label>
          <input
            {...register('insurance_info')}
            className="input-base"
            placeholder="Ej: OSDE Plan 210, Nº 123456"
          />
        </div>

        <div>
          <label className="label">Observaciones adicionales</label>
          <textarea
            {...register('additional_notes')}
            className="input-base min-h-[80px] resize-y"
            placeholder="Cualquier información relevante para primeros auxilios..."
          />
        </div>
      </section>

      {/* Submit */}
      <div className="flex items-center justify-center gap-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary flex items-center gap-2"
        >
          {isSubmitting ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> Guardando...</>
          ) : (
            <><Save className="w-4 h-4" /> Guardar cambios</>
          )}
        </button>

        {saveStatus === 'success' && (
          <span className="text-accent-green text-sm font-body animate-fade-in">
            ✓ Guardado correctamente
          </span>
        )}
        {saveStatus === 'error' && (
          <span className="text-accent-red text-sm font-body animate-fade-in">
            Error al guardar. Intentá de nuevo.
          </span>
        )}
      </div>
    </form>
  )
}

// Need React import for useState
import React from 'react'
