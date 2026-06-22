'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Logo } from '@/components/ui/Logo'

// ── Inline product mockup ────────────────────────────────────────────────────
function DashboardMockup() {
  return (
    <div className="relative mx-auto max-w-lg select-none">
      <div className="rounded-2xl bg-[#0d1117] p-2 ring-1 ring-white/10 shadow-[0_32px_64px_rgba(0,0,0,0.5)]">
        <div className="rounded-xl overflow-hidden">
          <div className="flex items-center gap-2 bg-[#161b22] px-4 py-2.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f56]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#ffbd2e]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#27c93f]" />
            <div className="ml-3 flex h-5 flex-1 items-center rounded bg-[#0d1117] px-2">
              <span className="text-[10px] text-slate-500">app.clinilynk.ng/dashboard</span>
            </div>
          </div>
          <div className="flex h-72 bg-slate-50">
            {/* Sidebar */}
            <div className="w-36 shrink-0 border-r border-slate-100 bg-white p-3">
              <div className="mb-4 flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-blue-600">
                  <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <span className="text-[10px] font-bold text-slate-800">CliniLynk</span>
              </div>
              <div className="space-y-0.5">
                {[
                  { label: 'Overview', active: true },
                  { label: 'Patients', active: false },
                  { label: 'Records', active: false },
                  { label: 'Appointments', active: false },
                  { label: 'Lab Results', active: false },
                ].map(({ label, active }) => (
                  <div key={label} className={`flex items-center gap-2 rounded-md px-2 py-1.5 ${active ? 'bg-blue-50' : ''}`}>
                    <div className={`h-3 w-3 rounded ${active ? 'bg-blue-600' : 'bg-slate-200'}`} />
                    <span className={`text-[9px] font-medium ${active ? 'text-blue-600' : 'text-slate-500'}`}>{label}</span>
                  </div>
                ))}
              </div>
            </div>
            {/* Main panel */}
            <div className="flex-1 overflow-hidden p-3 space-y-2.5">
              <div className="text-[10px] font-semibold text-slate-700">Good morning, Dr. Okafor</div>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: 'Patients', value: '1,248', color: 'text-blue-600' },
                  { label: 'Appts Today', value: '14', color: 'text-emerald-600' },
                  { label: 'Pending Labs', value: '3', color: 'text-amber-600' },
                ].map(({ label, value, color }) => (
                  <div key={label} className="rounded-lg border border-slate-200 bg-white p-2">
                    <p className="text-[8px] text-slate-400 mb-0.5">{label}</p>
                    <p className={`text-sm font-bold ${color}`}>{value}</p>
                  </div>
                ))}
              </div>
              <div className="rounded-lg border border-slate-200 bg-white p-2">
                <div className="mb-1.5 flex items-center justify-between">
                  <span className="text-[8px] font-semibold uppercase tracking-wide text-slate-500">Recent Patients</span>
                  <span className="text-[8px] text-blue-600">View all →</span>
                </div>
                {[
                  { name: 'Amara Chukwu', tag: 'Follow-up', tagColor: 'bg-blue-50 text-blue-600' },
                  { name: 'Emeka Dike', tag: 'New Visit', tagColor: 'bg-emerald-50 text-emerald-600' },
                  { name: 'Fatima Bello', tag: 'Lab Review', tagColor: 'bg-amber-50 text-amber-600' },
                ].map(({ name, tag, tagColor }) => (
                  <div key={name} className="flex items-center gap-2 border-t border-slate-50 py-1 first:border-t-0">
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-200">
                      <span className="text-[7px] font-bold text-slate-600">{name[0]}</span>
                    </div>
                    <span className="flex-1 text-[9px] font-medium text-slate-700">{name}</span>
                    <span className={`rounded-full px-1.5 py-0.5 text-[7px] font-semibold ${tagColor}`}>{tag}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Floating lab result card */}
      <div className="absolute -left-12 top-1/3 hidden xl:flex items-center gap-3 rounded-xl border border-slate-100 bg-white px-3 py-2.5 shadow-lg shadow-slate-200/60">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-100">
          <svg className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
          </svg>
        </div>
        <div>
          <p className="text-xs font-semibold text-slate-900">Lab result ready</p>
          <p className="text-[10px] text-slate-500">Malaria RDT · Normal</p>
        </div>
      </div>
      {/* Floating appointment card */}
      <div className="absolute -right-10 -bottom-5 hidden xl:flex items-center gap-3 rounded-xl border border-slate-100 bg-white px-3 py-2.5 shadow-lg shadow-slate-200/60">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-100">
          <svg className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <div>
          <p className="text-xs font-semibold text-slate-900">Appointment confirmed</p>
          <p className="text-[10px] text-slate-500">Today · 2:30 PM</p>
        </div>
      </div>
    </div>
  )
}

// ── Role tab content ──────────────────────────────────────────────────────────
const roleContent = {
  hospital: {
    heading: 'Command your entire hospital from one place',
    body: 'Register your institution, invite your full medical team, and get real-time visibility into operations — patients, appointments, labs, and records — without a single spreadsheet.',
    bullets: [
      'Invite doctors by email, assign departments and specializations',
      'Real-time overview of daily appointments and patient flow',
      'Full audit trail — every action, every user, timestamped',
      'Role-based access so staff see only what they need',
    ],
    cta: { label: 'Register your hospital →', href: '/register-hospital' },
    accent: { card: 'bg-purple-50 border-purple-100', badge: 'bg-purple-100 text-purple-700' },
    caption: 'Doctor management · Team overview',
  },
  doctor: {
    heading: 'Your patient list. Their complete history. One screen.',
    body: 'Accept your hospital invitation, access assigned patient charts instantly, enter lab results, write prescriptions, and manage your schedule — all from a clean doctor workspace.',
    bullets: [
      'View full patient history: diagnoses, prescriptions, visits',
      'Enter lab results and mark orders complete',
      'Write and manage prescriptions digitally',
      'Appointment calendar with patient notes',
    ],
    cta: { label: 'Accept your invitation →', href: '/login' },
    accent: { card: 'bg-blue-50 border-blue-100', badge: 'bg-blue-100 text-blue-700' },
    caption: 'Patient records · Lab results',
  },
  patient: {
    heading: 'Your health records, always in your hands',
    body: "Register once. See your complete medical history across every CliniLynk hospital you've visited. Book appointments, share records with specialists — all securely.",
    bullets: [
      'Book appointments with any doctor at any affiliated hospital',
      'View all prescriptions, lab results, and diagnoses in one place',
      'Control who sees your records — revoke access any time',
      'Get notifications for confirmations, results, and reminders',
    ],
    cta: { label: 'Create a free account →', href: '/register' },
    accent: { card: 'bg-emerald-50 border-emerald-100', badge: 'bg-emerald-100 text-emerald-700' },
    caption: 'Appointments · Health history',
  },
} as const

type RoleKey = keyof typeof roleContent

export function LandingPage() {
  const [activeRole, setActiveRole] = useState<RoleKey>('hospital')
  const [menuOpen, setMenuOpen] = useState(false)
  const role = roleContent[activeRole]

  return (
    <div className="min-h-screen bg-white antialiased">

      {/* ── Navbar ─────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-8">
          <Link href="/" className="flex items-center">
            <Logo variant="full" size="md" />
          </Link>

          <nav className="hidden lg:flex items-center gap-7">
            {[
              { label: 'Product', href: '#product' },
              { label: 'Solutions', href: '#solutions' },
              { label: 'How it works', href: '#how-it-works' },
              { label: 'For hospitals', href: '#for-hospitals' },
            ].map(({ label, href }) => (
              <a key={label} href={href} className="text-sm font-medium text-slate-600 transition-colors hover:text-slate-900">
                {label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/login" className="hidden text-sm font-medium text-slate-600 transition-colors hover:text-slate-900 sm:block">
              Sign in
            </Link>
            <Link
              href="/register-hospital"
              className="hidden rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 sm:block"
            >
              Get started →
            </Link>
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="rounded-md p-1.5 text-slate-600 transition-colors hover:bg-slate-100 lg:hidden"
              aria-label="Toggle menu"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {menuOpen
                  ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
              </svg>
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="border-t border-slate-100 bg-white px-4 py-4 lg:hidden">
            <div className="space-y-1 mb-4">
              {['Product', 'Solutions', 'How it works', 'For hospitals'].map((label) => (
                <a
                  key={label}
                  href={`#${label.toLowerCase().replace(/ /g, '-')}`}
                  onClick={() => setMenuOpen(false)}
                  className="block rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  {label}
                </a>
              ))}
            </div>
            <div className="flex flex-col gap-2 border-t border-slate-100 pt-4">
              <Link href="/login" className="rounded-lg border border-slate-200 px-4 py-2.5 text-center text-sm font-medium text-slate-700">
                Sign in
              </Link>
              <Link href="/register-hospital" className="rounded-lg bg-blue-600 px-4 py-2.5 text-center text-sm font-semibold text-white">
                Register hospital
              </Link>
              <Link href="/register" className="rounded-lg border border-slate-200 px-4 py-2.5 text-center text-sm font-medium text-slate-600">
                Patient portal
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* ── Hero ───────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-[#060d1f] px-4 pb-24 pt-20 sm:pb-32 sm:pt-28">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -right-40 -top-40 h-[700px] w-[700px] rounded-full bg-blue-600/[0.06] blur-3xl" />
          <div className="absolute -bottom-20 left-0 h-[400px] w-[400px] rounded-full bg-indigo-500/[0.04] blur-3xl" />
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#3B82F6 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
        </div>
        <div className="relative mx-auto max-w-7xl">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/[0.08] px-3.5 py-1.5">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-blue-400" />
                <span className="text-xs font-semibold text-blue-300">Healthcare infrastructure for Africa</span>
              </div>
              <h1 className="text-[2.5rem] font-extrabold leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-[3.25rem]">
                The operating system<br />
                <span className="text-blue-400">every hospital</span> needs
              </h1>
              <p className="mt-6 max-w-lg text-base leading-relaxed text-slate-400 sm:text-lg">
                Connect your entire care team on one platform — records, appointments, lab results, and prescriptions — so patients get better care, faster.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/register-hospital"
                  className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-900/30 transition-colors hover:bg-blue-500"
                >
                  Register your hospital →
                </Link>
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center rounded-xl border border-slate-700 bg-white/5 px-7 py-3.5 text-sm font-semibold text-slate-200 transition-colors hover:border-slate-500 hover:bg-white/10"
                >
                  I&apos;m a patient
                </Link>
              </div>
              <p className="mt-4 text-xs text-slate-600">
                Already on CliniLynk?{' '}
                <Link href="/login" className="text-slate-400 underline underline-offset-2 transition-colors hover:text-slate-200">
                  Sign in
                </Link>
              </p>
            </div>
            <div className="hidden lg:block">
              <DashboardMockup />
            </div>
          </div>
        </div>
      </section>

      {/* ── Trust band ─────────────────────────────────────────────────────── */}
      <section className="border-y border-slate-100 bg-slate-50 px-4 py-6">
        <div className="mx-auto max-w-5xl">
          <p className="mb-4 text-center text-[11px] font-semibold uppercase tracking-widest text-slate-400">
            Trusted by hospitals and clinics
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-3">
            {[
              'Lagos University Teaching Hospital',
              'Reddington Hospital',
              'St. Nicholas Hospital',
              'Evercare Hospital',
              'Eko Hospital',
            ].map((name) => (
              <span key={name} className="whitespace-nowrap text-sm font-semibold text-slate-400">
                {name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats ──────────────────────────────────────────────────────────── */}
      <section className="bg-white px-4 py-16">
        <div className="mx-auto max-w-5xl">
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {[
              { value: '500+', label: 'Hospitals & Clinics' },
              { value: '10k+', label: 'Patients served' },
              { value: '2,000+', label: 'Doctors onboard' },
              { value: '99.9%', label: 'Platform uptime' },
            ].map(({ value, label }) => (
              <div key={label} className="text-center">
                <p className="tabular-nums text-3xl font-extrabold text-slate-900 sm:text-4xl">{value}</p>
                <p className="mt-1.5 text-sm text-slate-500">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Role tabs ──────────────────────────────────────────────────────── */}
      <section id="product" className="bg-slate-50 px-4 py-20">
        <div className="mx-auto max-w-5xl">
          <div className="mb-10 text-center">
            <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">Built for every role in your hospital</h2>
            <p className="mt-3 text-slate-600">One platform. Three tailored experiences.</p>
          </div>

          <div className="mb-8 flex justify-center">
            <div className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white p-1 shadow-sm">
              {([
                ['hospital', 'For hospitals'],
                ['doctor', 'For doctors'],
                ['patient', 'For patients'],
              ] as [RoleKey, string][]).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => setActiveRole(key)}
                  className={`rounded-lg px-5 py-2 text-sm font-semibold transition-all ${
                    activeRole === key
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
            <div className="grid items-center gap-10 lg:grid-cols-2">
              <div>
                <h3 className="text-xl font-bold text-slate-900 sm:text-2xl">{role.heading}</h3>
                <p className="mt-3 leading-relaxed text-slate-600">{role.body}</p>
                <ul className="mt-6 space-y-3">
                  {role.bullets.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <svg className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-sm text-slate-700">{item}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href={role.cta.href}
                  className="mt-7 inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
                >
                  {role.cta.label}
                </Link>
              </div>

              <div className={`rounded-xl border p-6 ${role.accent.card}`}>
                <div className="space-y-3">
                  {(['Active', 'Pending', 'Complete'] as const).map((status) => (
                    <div key={status} className="flex items-center gap-3 rounded-xl border border-white bg-white p-4 shadow-sm">
                      <div className={`h-9 w-9 shrink-0 rounded-xl ${role.accent.badge}`} />
                      <div className="flex-1 space-y-2">
                        <div className="h-2.5 w-28 rounded-full bg-slate-200" />
                        <div className="h-2 w-40 rounded-full bg-slate-100" />
                      </div>
                      <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${role.accent.badge}`}>
                        {status}
                      </span>
                    </div>
                  ))}
                  <p className="mt-1 text-center text-[11px] text-slate-400">{role.caption}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── How it works ───────────────────────────────────────────────────── */}
      <section id="how-it-works" className="bg-white px-4 py-20">
        <div className="mx-auto max-w-5xl">
          <div className="mb-12 text-center">
            <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">Up and running in minutes</h2>
            <p className="mt-3 text-slate-600">No installation. No IT team required.</p>
          </div>
          <div className="grid gap-6 lg:grid-cols-3">
            {[
              {
                step: '01',
                heading: 'Register your hospital',
                body: 'Fill out a short form — hospital name, address, admin contact. Your account is ready instantly, no software to install.',
                accent: 'border-purple-100 bg-purple-50',
                badge: 'bg-purple-100 text-purple-700',
              },
              {
                step: '02',
                heading: 'Invite your medical team',
                body: 'Add doctors by email. They receive an invitation, set their password, and are immediately connected to your hospital.',
                accent: 'border-blue-100 bg-blue-50',
                badge: 'bg-blue-100 text-blue-700',
              },
              {
                step: '03',
                heading: 'Start seeing patients',
                body: 'Patients register and book appointments. Doctors see their patient list. Records flow automatically across your team.',
                accent: 'border-emerald-100 bg-emerald-50',
                badge: 'bg-emerald-100 text-emerald-700',
              },
            ].map(({ step, heading, body, accent, badge }) => (
              <div key={step} className={`rounded-2xl border p-7 ${accent}`}>
                <div className={`mb-5 inline-flex items-center justify-center rounded-xl px-3 py-1.5 text-sm font-bold ${badge}`}>
                  {step}
                </div>
                <h3 className="text-lg font-bold text-slate-900">{heading}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features grid ──────────────────────────────────────────────────── */}
      <section id="solutions" className="bg-slate-50 px-4 py-20">
        <div className="mx-auto max-w-5xl">
          <div className="mb-12 text-center">
            <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">Everything your care team needs</h2>
            <p className="mt-3 text-slate-600">No add-ons. No limits. All included.</p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
                title: 'Digital health records',
                desc: 'Every diagnosis, prescription, and visit note — organized, searchable, always accessible from any device.',
                accent: 'bg-blue-50 text-blue-600',
              },
              {
                icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
                title: 'Appointment scheduling',
                desc: 'Patients self-book. Doctors manage availability. Everyone gets automated reminders — zero phone calls needed.',
                accent: 'bg-emerald-50 text-emerald-600',
              },
              {
                icon: 'M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z',
                title: 'Lab order management',
                desc: 'Order labs, receive results in-system, record interpretations — without a single paper form.',
                accent: 'bg-amber-50 text-amber-600',
              },
              {
                icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4',
                title: 'Digital prescriptions',
                desc: "Write, review, and manage prescriptions with the patient's allergy and medication history right alongside.",
                accent: 'bg-rose-50 text-rose-600',
              },
              {
                icon: 'M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z',
                title: 'Secure record sharing',
                desc: 'Patients grant access to specialists. Access is time-limited, logged, and revocable in one click.',
                accent: 'bg-violet-50 text-violet-600',
              },
              {
                icon: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
                title: 'Admin analytics',
                desc: 'Hospital administrators get operational insight — patient volumes, appointment trends, and team activity in real time.',
                accent: 'bg-cyan-50 text-cyan-600',
              },
            ].map(({ icon, title, desc, accent }) => (
              <div
                key={title}
                className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className={`mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl ${accent}`}>
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d={icon} />
                  </svg>
                </div>
                <h3 className="font-semibold text-slate-900">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonial ────────────────────────────────────────────────────── */}
      <section className="bg-white px-4 py-16">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 flex justify-center gap-1">
            {[...Array(5)].map((_, i) => (
              <svg key={i} className="h-5 w-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <blockquote>
            <p className="text-xl font-medium leading-relaxed text-slate-800 sm:text-2xl">
              &ldquo;Before CliniLynk, our patients&apos; records were split across three different filing systems. Now every doctor sees the same complete picture — and patient wait times have dropped by 40%.&rdquo;
            </p>
            <footer className="mt-8">
              <div className="inline-flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
                  AO
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-slate-900">Dr. Adaeze Okonkwo</p>
                  <p className="text-xs text-slate-500">Medical Director, Reddington Hospital Lagos</p>
                </div>
              </div>
            </footer>
          </blockquote>
        </div>
      </section>

      {/* ── Hospital CTA ───────────────────────────────────────────────────── */}
      <section id="for-hospitals" className="bg-[#060d1f] px-4 py-20">
        <div className="mx-auto max-w-5xl">
          <div className="rounded-2xl bg-blue-600 px-8 py-14 text-center sm:px-12">
            <h2 className="text-2xl font-bold text-white sm:text-3xl">
              Ready to modernize your hospital?
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-base text-blue-100">
              Join hundreds of hospitals already on CliniLynk. Setup takes 10 minutes; your first doctor invite goes out in five.
            </p>
            <ul className="mt-6 flex flex-wrap items-center justify-center gap-x-8 gap-y-2">
              {['30-day free trial', 'No credit card required', 'Onboarding support included'].map((item) => (
                <li key={item} className="flex items-center gap-1.5 text-sm text-blue-100">
                  <svg className="h-4 w-4 shrink-0 text-blue-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/register-hospital"
                className="rounded-xl bg-white px-8 py-3.5 text-sm font-bold text-blue-600 shadow-md transition-colors hover:bg-blue-50"
              >
                Register hospital — it&apos;s free →
              </Link>
              <Link
                href="/register"
                className="rounded-xl border border-blue-400/40 bg-white/10 px-8 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-white/20"
              >
                Patient sign up
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────────────────────── */}
      <footer className="bg-[#030712] px-4 py-14">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div className="lg:col-span-1">
              <div className="mb-4 flex items-center">
                <Logo variant="full" size="sm" light />
              </div>
              <p className="text-sm leading-relaxed text-slate-500">
                Healthcare infrastructure for Africa. Connecting patients, doctors, and hospitals on one secure platform.
              </p>
            </div>
            {[
              {
                heading: 'Product',
                links: ['For hospitals', 'For doctors', 'For patients', 'Security', 'Pricing'],
              },
              {
                heading: 'Company',
                links: ['About us', 'Blog', 'Careers', 'Contact', 'Press'],
              },
              {
                heading: 'Legal',
                links: ['Privacy policy', 'Terms of service', 'Cookie policy', 'HIPAA compliance', 'NDPR'],
              },
            ].map(({ heading, links }) => (
              <div key={heading}>
                <p className="mb-4 text-[11px] font-semibold uppercase tracking-widest text-slate-400">{heading}</p>
                <ul className="space-y-2.5">
                  {links.map((link) => (
                    <li key={link}>
                      <a href="#" className="text-sm text-slate-500 transition-colors hover:text-slate-300">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="flex flex-col items-center gap-2 border-t border-slate-800 pt-8 sm:flex-row sm:justify-between">
            <p className="text-xs text-slate-600">© {new Date().getFullYear()} CliniLynk Technologies Ltd. All rights reserved.</p>
            <p className="text-xs text-slate-600">Made with care for African healthcare</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
