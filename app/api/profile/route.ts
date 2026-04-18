import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { v4 as uuidv4 } from 'uuid'
import { z } from 'zod'

const profileSchema = z.object({
  full_name: z.string().min(2),
  birth_date: z.string().optional().nullable(),
  blood_type: z.string().optional().nullable(),
  allergies: z.string().optional().nullable(),
  medical_conditions: z.string().optional().nullable(),
  current_medications: z.string().optional().nullable(),
  emergency_contact_name: z.string().optional().nullable(),
  emergency_contact_phone: z.string().optional().nullable(),
  emergency_contact_whatsapp: z.boolean().optional().default(false),
  insurance_info: z.string().optional().nullable(),
  additional_notes: z.string().optional().nullable(),
})

// GET: fetch own active profile
export async function GET() {
  const supabase = createClient()
  const { data: { user }, error: authErr } = await supabase.auth.getUser()

  if (authErr || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data, error } = await supabase
    .from('medical_profiles')
    .select('*')
    .eq('user_id', user.id)
    .is('deleted_at', null)   // solo perfil activo
    .single()

  if (error && error.code !== 'PGRST116') {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ profile: data ?? null })
}

// POST: create profile
export async function POST(req: NextRequest) {
  const supabase = createClient()
  const { data: { user }, error: authErr } = await supabase.auth.getUser()

  if (authErr || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Verificar que no exista un perfil activo
  const { data: existing } = await supabase
    .from('medical_profiles')
    .select('id')
    .eq('user_id', user.id)
    .is('deleted_at', null)
    .single()

  if (existing) {
    return NextResponse.json({ error: 'Profile already exists. Use PUT.' }, { status: 409 })
  }

  const body = await req.json()
  const parsed = profileSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('medical_profiles')
    .insert({
      ...parsed.data,
      user_id: user.id,
      public_id: uuidv4(),
      birth_date: parsed.data.birth_date || null,
      blood_type: parsed.data.blood_type || null,
      deleted_at: null,
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ profile: data }, { status: 201 })
}

// PUT: update active profile
export async function PUT(req: NextRequest) {
  const supabase = createClient()
  const { data: { user }, error: authErr } = await supabase.auth.getUser()

  if (authErr || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const parsed = profileSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('medical_profiles')
    .update({
      ...parsed.data,
      birth_date: parsed.data.birth_date || null,
      blood_type: parsed.data.blood_type || null,
      updated_at: new Date().toISOString(),
    })
    .eq('user_id', user.id)
    .is('deleted_at', null)   // solo actualiza si está activo
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ profile: data })
}

// DELETE: soft delete — marca deleted_at, no borra el registro
export async function DELETE() {
  const supabase = createClient()
  const { data: { user }, error: authErr } = await supabase.auth.getUser()

  if (authErr || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { error } = await supabase
    .from('medical_profiles')
    .update({ deleted_at: new Date().toISOString() })
    .eq('user_id', user.id)
    .is('deleted_at', null)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
