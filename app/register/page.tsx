'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Shield, Eye, EyeOff, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

const schema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'Mínimo 8 caracteres'),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword'],
})

type FormValues = z.infer<typeof schema>

export default function RegisterPage() {
  const router = useRouter()
  const supabase = createClient()
  const [showPass, setShowPass] = useState(false)
  const [serverError, setServerError] = useState('')
  const [success, setSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  const onSubmit = async (values: FormValues) => {
    setServerError('')
    const { error } = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
      options: {
        emailRedirectTo: `${window.location.origin}/dashboard`,
      },
    })
    if (error) {
      setServerError(error.message)
      return
    }
    setSuccess(true)
  }

  if (success) {
    return (
      <main className="min-h-dvh flex items-center justify-center px-4">
        <div className="text-center max-w-md animate-slide-up">
          <div className="w-16 h-16 bg-accent-green/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Shield className="w-8 h-8 text-accent-green" />
          </div>
          <h2 className="font-display font-bold text-2xl text-text-primary mb-3">¡Cuenta creada!</h2>
          <p className="text-text-secondary font-body mb-6">
            Revisá tu email para confirmar tu cuenta y luego podrás ingresar.
          </p>
          <Link href="/login" className="btn-primary inline-flex">
            Ir al login
          </Link>
        </div>
      </main>
    )
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
          <h1 className="font-display font-bold text-2xl text-text-primary">Crear cuenta</h1>
          <p className="text-text-secondary text-sm font-body mt-1">Gratis para siempre en el plan básico</p>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
            {serverError && (
              <div className="bg-accent-red/10 border border-accent-red/30 rounded-lg px-4 py-3 text-sm text-accent-red font-body">
                {serverError}
              </div>
            )}

            <div>
              <label className="label">Email</label>
              <input
                {...register('email')}
                type="email"
                className="input-base"
                placeholder="tu@email.com"
                autoComplete="email"
              />
              {errors.email && <p className="error-text">{errors.email.message}</p>}
            </div>

            <div>
              <label className="label">Contraseña</label>
              <div className="relative">
                <input
                  {...register('password')}
                  type={showPass ? 'text' : 'password'}
                  className="input-base pr-12"
                  placeholder="Mínimo 8 caracteres"
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
              {errors.password && <p className="error-text">{errors.password.message}</p>}
            </div>

            <div>
              <label className="label">Confirmar contraseña</label>
              <input
                {...register('confirmPassword')}
                type={showPass ? 'text' : 'password'}
                className="input-base"
                placeholder="Repetí tu contraseña"
                autoComplete="new-password"
              />
              {errors.confirmPassword && (
                <p className="error-text">{errors.confirmPassword.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Creando cuenta...</>
              ) : (
                'Crear cuenta gratis'
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-text-secondary text-sm font-body mt-6">
          ¿Ya tenés cuenta?{' '}
          <Link href="/login" className="text-accent-red hover:text-accent-red-dim transition-colors font-medium">
            Ingresar
          </Link>
        </p>
      </div>
    </main>
  )
}
