'use client'

import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2, Save } from 'lucide-react'
import { useTranslation } from 'react-i18next'
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
  const { t } = useTranslation()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
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
          {t('profile.section.personal')}
        </h2>

        <div>
          <label className="label">{t('profile.field.fullName')}</label>
          <input
            {...register('full_name')}
            className="input-base"
            placeholder={t('profile.placeholder.fullName')}
          />
          {errors.full_name && <p className="error-text">{errors.full_name.message}</p>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="label">{t('profile.field.birthDate')}</label>
            <input
              {...register('birth_date')}
              type="date"
              className="input-base"
            />
          </div>

          <div>
            <label className="label">{t('profile.field.bloodType')}</label>
            <select {...register('blood_type')} className="input-base">
              <option value="">{t('profile.bloodType.unknown')}</option>
              {BLOOD_TYPES.map((bt) => (
                <option key={bt} value={bt}>{bt}</option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* Section: Medical */}
      <section className="card space-y-5">
        <h2 className="font-display font-semibold text-sm uppercase tracking-widest text-text-secondary">
          {t('profile.section.medical')}
        </h2>

        <div>
          <label className="label">{t('profile.field.allergies')}</label>
          <textarea
            {...register('allergies')}
            className="input-base min-h-[80px] resize-y"
            placeholder={t('profile.placeholder.allergies')}
          />
          <p className="text-text-muted text-xs font-body mt-1">{t('profile.hint.allergies')}</p>
        </div>

        <div>
          <label className="label">{t('profile.field.conditions')}</label>
          <textarea
            {...register('medical_conditions')}
            className="input-base min-h-[80px] resize-y"
            placeholder={t('profile.placeholder.conditions')}
          />
        </div>

        <div>
          <label className="label">{t('profile.field.medications')}</label>
          <textarea
            {...register('current_medications')}
            className="input-base min-h-[80px] resize-y"
            placeholder={t('profile.placeholder.medications')}
          />
        </div>
      </section>

      {/* Section: Emergency contact */}
      <section className="card space-y-5">
        <h2 className="font-display font-semibold text-sm uppercase tracking-widest text-text-secondary">
          {t('profile.section.emergency')}
        </h2>

        <div>
          <label className="label">{t('profile.field.contactName')}</label>
          <input
            {...register('emergency_contact_name')}
            className="input-base"
            placeholder={t('profile.placeholder.contactName')}
          />
        </div>

        <div>
          <label className="label">{t('profile.field.contactPhone')}</label>
          <input
            {...register('emergency_contact_phone')}
            type="tel"
            className="input-base"
            placeholder={t('profile.placeholder.contactPhone')}
          />
        </div>

        <label className="flex items-center gap-3 cursor-pointer group">
          <input
            {...register('emergency_contact_whatsapp')}
            type="checkbox"
            className="w-4 h-4 rounded border-border bg-bg-elevated accent-accent-red cursor-pointer"
          />
          <span className="text-sm font-body text-text-secondary group-hover:text-text-primary transition-colors">
            {t('profile.field.whatsappPreference')}
          </span>
        </label>
      </section>

      {/* Section: Extra */}
      <section className="card space-y-5">
        <h2 className="font-display font-semibold text-sm uppercase tracking-widest text-text-secondary">
          {t('profile.section.additional')}
        </h2>

        <div>
          <label className="label">{t('profile.field.insurance')}</label>
          <input
            {...register('insurance_info')}
            className="input-base"
            placeholder={t('profile.placeholder.insurance')}
          />
        </div>

        <div>
          <label className="label">{t('profile.field.notes')}</label>
          <textarea
            {...register('additional_notes')}
            className="input-base min-h-[80px] resize-y"
            placeholder={t('profile.placeholder.notes')}
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
            <><Loader2 className="w-4 h-4 animate-spin" /> {t('profile.button.saving')}</>
          ) : (
            <><Save className="w-4 h-4" /> {t('profile.button.submit')}</>
          )}
        </button>

        {saveStatus === 'success' && (
          <span className="text-accent-green text-sm font-body animate-fade-in">
            {t('profile.status.saved')}
          </span>
        )}
        {saveStatus === 'error' && (
          <span className="text-accent-red text-sm font-body animate-fade-in">
            {t('profile.status.error')}
          </span>
        )}
      </div>
    </form>
  )
}
