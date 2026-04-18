-- ============================================================
-- EmergiQR — Initial Schema
-- Run this in Supabase SQL Editor
-- ============================================================

create extension if not exists "uuid-ossp";

-- ============================================================
-- Table: medical_profiles
-- ============================================================
create table if not exists public.medical_profiles (
  id              uuid primary key default uuid_generate_v4(),
  user_id         uuid not null references auth.users(id) on delete cascade,
  public_id       uuid not null unique default uuid_generate_v4(),

  -- Personal
  full_name               text not null,
  birth_date              date,

  -- Medical
  blood_type              text check (blood_type in ('A+','A-','B+','B-','AB+','AB-','O+','O-','unknown')),
  allergies               text,
  medical_conditions      text,
  current_medications     text,

  -- Emergency contact
  emergency_contact_name      text,
  emergency_contact_phone     text,
  emergency_contact_whatsapp  boolean not null default false,

  -- Extra
  insurance_info          text,
  additional_notes        text,

  -- Timestamps
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  deleted_at  timestamptz
);

-- Solo un perfil activo por usuario
create unique index if not exists medical_profiles_user_id_unique
  on public.medical_profiles(user_id)
  where deleted_at is null;

-- Índice para filtrar registros activos eficientemente
create index if not exists medical_profiles_active_idx
  on public.medical_profiles(user_id)
  where deleted_at is null;

-- Índice para búsqueda por public_id (página de emergencia)
create index if not exists medical_profiles_public_id_idx
  on public.medical_profiles(public_id)
  where deleted_at is null;

-- ============================================================
-- Row Level Security (RLS)
-- ============================================================
alter table public.medical_profiles enable row level security;

-- Usuarios autenticados: solo ven su propio perfil activo
create policy "Users can view own active profile"
  on public.medical_profiles for select
  using (auth.uid() = user_id and deleted_at is null);

create policy "Users can insert own profile"
  on public.medical_profiles for insert
  with check (auth.uid() = user_id);

create policy "Users can update own profile"
  on public.medical_profiles for update
  using (auth.uid() = user_id and deleted_at is null);

-- Página pública: cualquiera puede leer por public_id, solo si está activo
create policy "Public can view active profile by public_id"
  on public.medical_profiles for select
  using (deleted_at is null);

-- ============================================================
-- Auto-update updated_at trigger
-- ============================================================
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger set_updated_at
  before update on public.medical_profiles
  for each row execute procedure public.handle_updated_at();
