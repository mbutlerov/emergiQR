'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Shield, Eye, EyeOff, Loader2, CheckCircle } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { createClient } from '@/lib/supabase/client'

const schema = z.object({
  password: z.string().min(8),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  path: ['confirmPassword'],
  message: 'mismatch',
})

type FormValues = z.infer<typeof schema>

export default function ResetPasswordPage() {
  const { t } = useTranslation()
  const router = useRouter()
  const supabase = createClient()
  const [showPass, setShowPass] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [success, setSuccess] = useState(false)
  const [serverError, setServerError] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  const onSubmit = async (values: FormValues) => {
    setServerError('')
    const { error } = await supabase.auth.updateUser({ password: values.password })
    if (error) {
      setServerError(t('resetPassword.error.default'))
      return
    }
    setSuccess(true)
    setTimeout(() => router.push('/dashboard'), 2500)
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
          <h1 className="font-display font-bold text-2xl text-text-primary">{t('resetPassword.heading')}</h1>
          <p className="text-text-secondary text-sm font-body mt-1">{t('resetPassword.subheading')}</p>
        </div>

        <div className="card">
          {success ? (
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <CheckCircle className="w-12 h-12 text-accent-green" />
              </div>
              <h2 className="font-display font-bold text-lg text-text-primary">{t('resetPassword.success.title')}</h2>
              <p className="text-text-secondary text-sm font-body">{t('resetPassword.success.message')}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
              {serverError && (
                <div className="bg-accent-red/10 border border-accent-red/30 rounded-lg px-4 py-3 text-sm text-accent-red font-body">
                  {serverError}
                </div>
              )}

              <div>
                <label className="label">{t('resetPassword.label.password')}</label>
                <div className="relative">
                  <input
                    {...register('password')}
                    type={showPass ? 'text' : 'password'}
                    className="input-base pr-12"
                    placeholder={t('resetPassword.placeholder.password')}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary transition-colors p-1"
                  >
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && <p className="error-text">{t('resetPassword.validation.passwordMin')}</p>}
              </div>

              <div>
                <label className="label">{t('resetPassword.label.confirmPassword')}</label>
                <div className="relative">
                  <input
                    {...register('confirmPassword')}
                    type={showConfirm ? 'text' : 'password'}
                    className="input-base pr-12"
                    placeholder={t('resetPassword.placeholder.confirmPassword')}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary transition-colors p-1"
                  >
                    {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.confirmPassword && <p className="error-text">{t('resetPassword.validation.passwordMismatch')}</p>}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary w-full flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> {t('resetPassword.button.submitting')}</>
                ) : (
                  t('resetPassword.button.submit')
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </main>
  )
}
