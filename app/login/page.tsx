'use client'

import { useState, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Shield, Eye, EyeOff, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

const schema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
})

type FormValues = z.infer<typeof schema>

const errorMessages: Record<string, string> = {
  otp_expired: 'El link de confirmación expiró. Podés iniciar sesión igual si ya confirmaste antes, o registrate de nuevo.',
  access_denied: 'Acceso denegado. El link puede haber expirado o ya fue usado.',
}

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()
  const [showPass, setShowPass] = useState(false)
  const [serverError, setServerError] = useState('')

  const errorCode = searchParams.get('error_code') ?? searchParams.get('error')
  const urlError = errorCode ? (errorMessages[errorCode] ?? 'Ocurrió un error. Intentá de nuevo.') : null

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  const onSubmit = async (values: FormValues) => {
    setServerError('')
    const { error } = await supabase.auth.signInWithPassword({
      email: values.email,
      password: values.password,
    })
    if (error) {
      setServerError('Email o contraseña incorrectos.')
      return
    }
    router.push('/dashboard')
    router.refresh()
  }

  return (
    <div className="w-full max-w-md relative animate-slide-up">
      {/* Logo */}
      <div className="text-center mb-8">
        <Link href="/" className="inline-flex items-center gap-2 mb-6">
          <div className="w-9 h-9 bg-accent-red rounded-lg flex items-center justify-center">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <span className="font-display font-bold text-xl text-text-primary">EmergiQR</span>
        </Link>
        <h1 className="font-display font-bold text-2xl text-text-primary">Bienvenido de vuelta</h1>
        <p className="text-text-secondary text-sm font-body mt-1">Ingresa a tu cuenta para gestionar tu perfil</p>
      </div>

      {/* Card */}
      <div className="card">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>

          {/* Error de URL (link expirado, access denied, etc) */}
          {urlError && (
            <div className="bg-accent-amber/10 border border-accent-amber/30 rounded-lg px-4 py-3 text-sm text-accent-amber font-body">
              {urlError}
            </div>
          )}

          {/* Error de credenciales */}
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
                placeholder="••••••••"
                autoComplete="current-password"
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

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary w-full flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Ingresando...</>
            ) : (
              'Ingresar'
            )}
          </button>
        </form>
      </div>

      <p className="text-center text-text-secondary text-sm font-body mt-6">
        ¿No tenés cuenta?{' '}
        <Link href="/register" className="text-accent-red hover:text-accent-red-dim transition-colors font-medium">
          Registrarse gratis
        </Link>
      </p>
    </div>
  )
}

export default function LoginPage() {
  return (
    <main className="min-h-dvh flex items-center justify-center px-4 py-12 relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-accent-red/5 rounded-full blur-3xl pointer-events-none" />
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </main>
  )
}
