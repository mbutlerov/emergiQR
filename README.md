# EmergiQR — Sistema QR de Emergencia para Motociclistas

Un sistema que permite a motociclistas registrar sus datos médicos y generar un QR único. Al ser escaneado en caso de accidente, abre una página pública con información crítica al instante.

---

## Stack técnico

| Capa | Tecnología | Por qué |
|---|---|---|
| Frontend | Next.js 14 + React + TypeScript | Un solo repo, SSR + API routes |
| Estilos | TailwindCSS | Utility-first, rápido, consistente |
| Base de datos | Supabase (PostgreSQL) | Auth + DB + gratis en free tier |
| Auth | Supabase Auth | Incluido, sin config extra |
| QR | qrcode.react | Cliente, sin costo de cómputo |
| Deploy | Vercel | Gratis para proyectos pequeños, CDN global |

**Costo mensual estimado (MVP): $0** dentro de free tiers.

---

## Instalación local

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/emergiqr
cd emergiqr
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar Supabase

1. Crear cuenta en [supabase.com](https://supabase.com)
2. Crear un nuevo proyecto
3. En **SQL Editor**, ejecutar el contenido de `supabase/migrations/001_initial.sql`
4. En **Settings > API**, copiar la URL y la Anon Key

### 4. Variables de entorno

```bash
cp .env.example .env.local
```

Editar `.env.local` con tus valores de Supabase:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 5. Configurar Supabase Auth

En el dashboard de Supabase:
- **Authentication > URL Configuration**
- Site URL: `http://localhost:3000`
- Redirect URLs: `http://localhost:3000/**`

### 6. Ejecutar en desarrollo

```bash
npm run dev
```

Abrí [http://localhost:3000](http://localhost:3000)

---

## Flujo de uso

1. El usuario se registra en `/register`
2. Confirma su email
3. Entra al dashboard en `/dashboard`
4. Completa su perfil en `/dashboard/profile`
5. Ve y descarga su QR en `/dashboard/qr`
6. Coloca el QR en su casco/billetera
7. En emergencia: alguien escanea el QR → abre `/e/{publicId}` sin login

---

## Estructura de carpetas

```
emergiqr/
├── app/
│   ├── page.tsx                    # Landing page
│   ├── layout.tsx                  # Root layout (fonts, metadata)
│   ├── globals.css                 # Estilos globales + tokens
│   ├── not-found.tsx               # 404
│   ├── login/page.tsx              # Login
│   ├── register/page.tsx           # Registro
│   ├── dashboard/
│   │   ├── layout.tsx              # Layout privado con nav
│   │   ├── page.tsx                # Home dashboard
│   │   ├── profile/
│   │   │   ├── page.tsx            # Server: fetch perfil
│   │   │   └── ProfilePageClient.tsx  # Client: manejo del form
│   │   └── qr/page.tsx             # Vista del QR
│   ├── e/[publicId]/page.tsx       # ⚡ Página pública de emergencia
│   └── api/profile/route.ts        # API REST: GET/POST/PUT perfil
├── components/
│   ├── DashboardNav.tsx            # Navegación del dashboard
│   ├── ProfileForm.tsx             # Formulario médico completo
│   └── QRDisplay.tsx               # QR con botones de descarga
├── lib/
│   ├── supabase/
│   │   ├── client.ts               # Cliente browser
│   │   └── server.ts               # Cliente server
│   └── utils.ts                    # cn(), getPublicUrl(), BLOOD_TYPES
├── types/index.ts                  # Interfaces TypeScript
├── middleware.ts                   # Protección de rutas
├── supabase/migrations/
│   └── 001_initial.sql             # Schema de DB
└── .env.example
```

---

## Build y deploy

### Build local

```bash
npm run build
npm start
```

### Deploy en Vercel (recomendado)

1. Push tu código a GitHub
2. Ir a [vercel.com](https://vercel.com) → **New Project**
3. Importar el repositorio
4. En **Environment Variables**, agregar:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_APP_URL` → tu URL de Vercel (ej: `https://emergiqr.vercel.app`)
5. Click en **Deploy**

### Configurar Supabase para producción

En el dashboard de Supabase:
- **Authentication > URL Configuration**
- Site URL: `https://tu-dominio.vercel.app`
- Redirect URLs: `https://tu-dominio.vercel.app/**`

---

## Seguridad

- Las rutas `/dashboard/*` están protegidas por middleware que verifica sesión Supabase
- La página pública `/e/:publicId` no requiere auth
- El `public_id` es un UUID v4 (36 chars, ~122 bits de entropía) — no es predecible
- Row Level Security (RLS) activado en Supabase: cada usuario solo puede leer/editar su propio perfil
- El endpoint de API valida con Zod antes de tocar la base de datos
- Las variables sensibles están en `.env.local` y no se commitean

---

## Decisiones técnicas

**¿Por qué Next.js y no React + Express separados?**
Un solo repo, un solo deploy, las API routes reemplazan el backend. Menos complejidad operacional.

**¿Por qué Supabase y no Firebase?**
PostgreSQL real (no NoSQL), Row Level Security nativa, Auth incluida, free tier generoso (500MB DB, 50k usuarios auth).

**¿Por qué QR en frontend?**
`qrcode.react` es determinístico: dado el mismo `publicUrl`, genera el mismo QR. No hay necesidad de generarlo ni almacenarlo en el servidor. Ahorra storage y cómputo.

**¿Por qué el `public_id` es un UUID separado del `user_id`?**
Por seguridad. Si alguien escanea el QR, solo obtiene el `public_id`. El `user_id` nunca se expone públicamente.

---

## Mejoras futuras

- [ ] Confirmación de email desactivable en desarrollo (Supabase setting)
- [ ] Foto de perfil (Supabase Storage)
- [ ] Múltiples idiomas (español/inglés/portugués)
- [ ] QR con logo de EmergiQR al centro
- [ ] Notificaciones por email/SMS cuando alguien escanea el QR
- [ ] Plan premium con sticker físico, tarjeta PVC o pulsera
- [ ] Modo oscuro/claro según preferencia del sistema
- [ ] Expiración opcional del QR (rescan genera nuevo publicId)
- [ ] Analytics anónimos de escaneos
- [ ] PWA para instalar en el celular

---

## Licencia

MIT
