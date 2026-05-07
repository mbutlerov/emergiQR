'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Shield, Loader2, CheckCircle } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { createClient } from '@/lib/supabase/client'

const schema = z.object({
  email: z.string().email(),
})

type FormValues = z.infer<typeof schema>

export default function ForgotPasswordPage() {
  const { t } = useTranslation()
  const supabase = createClient()
  const [success, setSuccess] = useState(false)
  const [serverError, setServerError] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  const onSubmit = async (values: FormValues) => {
    setServerError('')
    const { error } = await supabase.auth.resetPasswordForEmail(values.email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
    })
    if (error) {
      setServerError(t('forgotPassword.error.default'))
      return
    }
    setSuccess(true)
  }

  return (
    <main className="min-h-dvh flex items-center justify-center px-4 py-12 relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-accent-red/5 rounded-full blur-3xl pointer-events-none" />
      <div className="w-full max-w-md relative animate-slide-up">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-9 h-9 bg-accent-red rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="font-display font-bold text-xl text-text-primary">EmergiQR</span>
          </Link>
          <h1 className="font-display font-bold text-2xl text-text-primary">{t('forgotPassword.heading')}</h1>
          <p className="text-text-secondary text-sm font-body mt-1">{t('forgotPassword.subheading')}</p>
        </div>

        <div className="card">
          {success ? (
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <CheckCircle className="w-12 h-12 text-accent-green" />
              </div>
              <h2 className="font-display font-bold text-lg text-text-primary">{t('forgotPassword.success.title')}</h2>
              <p className="text-text-secondary text-sm font-body">{t('forgotPassword.success.message')}</p>
              <Link href="/login" className="btn-primary w-full flex items-center justify-center mt-2">
                {t('forgotPassword.success.button')}
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
              {serverError && (
                <div className="bg-accent-red/10 border border-accent-red/30 rounded-lg px-4 py-3 text-sm text-accent-red font-body">
                  {serverError}
                </div>
              )}

              <div>
                <label className="label">{t('forgotPassword.label.email')}</label>
                <input
                  {...register('email')}
                  type="email"
                  className="input-base"
                  placeholder={t('forgotPassword.placeholder.email')}
                  autoComplete="email"
                />
                {errors.email && <p className="error-text">{t('forgotPassword.validation.invalidEmail')}</p>}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary w-full flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> {t('forgotPassword.button.submitting')}</>
                ) : (
                  t('forgotPassword.button.submit')
                )}
              </button>
            </form>
          )}
        </div>

        <p className="text-center text-text-secondary text-sm font-body mt-6">
          <Link href="/login" className="text-accent-red hover:text-accent-red-dim transition-colors font-medium">
            {t('forgotPassword.backToLogin')}
          </Link>
        </p>
      </div>
    </main>
  )
}
