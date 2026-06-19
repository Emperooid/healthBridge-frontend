'use client'

import Link from 'next/link'

function CheckIcon() {
  return (
    <svg className="h-4 w-4 shrink-0 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
    </svg>
  )
}

export function LandingPage() {
  return (
    <div className="min-h-screen bg-white antialiased">
      {/* ── Navbar ── */}
      <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
              <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <span className="text-base font-bold text-slate-900">HealthBridge</span>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
              How it works
            </a>
            <a href="#for-hospitals" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
              For hospitals
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="hidden sm:block text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors"
            >
              Sign in
            </Link>
            <Link
              href="/register-hospital"
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors"
            >
              Get started
            </Link>
          </div>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-[#0F172A] px-4 py-20 sm:py-32">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(59,130,246,0.15)_0%,_transparent_60%)]" />
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(#3B82F6 1px, transparent 1px)', backgroundSize: '28px 28px' }} />

        <div className="relative mx-auto max-w-3xl text-center">
          <span className="inline-block rounded-full border border-blue-500/30 bg-blue-500/10 px-3.5 py-1 text-xs font-semibold text-blue-400 mb-6">
            Modern Healthcare Records Platform
          </span>
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl leading-tight">
            Connecting patients,{' '}
            <span className="text-blue-400">doctors</span>{' '}
            and hospitals
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-base sm:text-lg text-slate-400 leading-relaxed">
            HealthBridge brings your entire hospital network onto one secure platform — patient records, appointments, prescriptions, and team coordination in one place.
          </p>
          <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/register-hospital"
              className="w-full sm:w-auto rounded-lg bg-blue-600 px-8 py-3.5 text-sm font-semibold text-white shadow-lg hover:bg-blue-700 transition-colors"
            >
              Register your hospital →
            </Link>
            <Link
              href="/register"
              className="w-full sm:w-auto rounded-lg border border-slate-600 px-8 py-3.5 text-sm font-semibold text-slate-300 hover:border-slate-400 hover:text-white transition-colors"
            >
              I&apos;m a patient
            </Link>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="border-b border-slate-100 bg-white py-10">
        <div className="mx-auto max-w-4xl px-4">
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            {[
              { value: '500+', label: 'Hospitals' },
              { value: '10k+', label: 'Patients' },
              { value: '2k+', label: 'Doctors' },
              { value: '99.9%', label: 'Uptime' },
            ].map(({ value, label }) => (
              <div key={label} className="text-center">
                <p className="text-2xl font-bold text-slate-900 sm:text-3xl">{value}</p>
                <p className="mt-0.5 text-sm text-slate-500">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="bg-slate-50 py-20 px-4">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
              Everything you need in one platform
            </h2>
            <p className="mt-3 text-slate-600">Built for the modern healthcare workflow</p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
                title: 'Digital Health Records',
                desc: 'Paperless patient records with diagnoses, prescriptions, lab results, and full visit history — always accessible.',
              },
              {
                icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
                title: 'Smart Appointments',
                desc: 'Patients book appointments, doctors manage their schedule, and everyone gets automated reminders.',
              },
              {
                icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z',
                title: 'Doctor Management',
                desc: 'Hospital admins invite doctors, assign specializations, and manage the entire medical team from one dashboard.',
              },
              {
                icon: 'M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z',
                title: 'Secure Record Sharing',
                desc: 'Patients control who sees their records. Share with a specialist, revoke access at any time.',
              },
              {
                icon: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9',
                title: 'Real-time Notifications',
                desc: 'Appointment confirmations, lab results, prescription updates — delivered instantly to the right people.',
              },
              {
                icon: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
                title: 'Admin Analytics',
                desc: 'Hospital administrators get a birds-eye view of operations — patients, doctors, appointments, and activity logs.',
              },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                  <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d={icon} />
                  </svg>
                </div>
                <h3 className="font-semibold text-slate-900">{title}</h3>
                <p className="mt-1.5 text-sm text-slate-600 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section id="how-it-works" className="py-20 px-4 bg-white">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">How HealthBridge works</h2>
            <p className="mt-3 text-slate-600">One platform, three connected experiences</p>
          </div>

          <div className="grid gap-10 md:grid-cols-3">
            {[
              {
                role: 'Hospital',
                color: 'bg-purple-600',
                accent: 'bg-purple-100',
                steps: [
                  'Register your hospital on HealthBridge',
                  'Set up your admin account',
                  'Invite your medical team by email',
                  'Manage everything from the admin dashboard',
                ],
              },
              {
                role: 'Doctor',
                color: 'bg-blue-600',
                accent: 'bg-blue-100',
                steps: [
                  'Receive an invitation from your hospital admin',
                  'Set up your account and specialization',
                  'Access your patient list and appointments',
                  'Create records, prescriptions, and notes',
                ],
              },
              {
                role: 'Patient',
                color: 'bg-green-600',
                accent: 'bg-green-100',
                steps: [
                  'Self-register and select your hospital',
                  'Book appointments with your doctor',
                  'View your complete medical history',
                  'Share records securely with specialists',
                ],
              },
            ].map(({ role, color, accent, steps }) => (
              <div key={role}>
                <div className={`mb-5 inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-semibold text-white ${color}`}>
                  {role}
                </div>
                <ul className="space-y-3.5">
                  {steps.map((step, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-slate-700 mt-0.5 ${accent}`}>
                        {i + 1}
                      </span>
                      <span className="text-sm text-slate-700 leading-relaxed">{step}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Hospital CTA ── */}
      <section id="for-hospitals" className="bg-[#0F172A] py-20 px-4">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            Ready to modernize your hospital?
          </h2>
          <p className="mt-4 text-base text-slate-400 max-w-xl mx-auto leading-relaxed">
            Join hundreds of hospitals already using HealthBridge to manage records, coordinate care, and improve patient outcomes.
          </p>
          <ul className="mt-8 flex flex-col items-center gap-2.5 sm:flex-row sm:justify-center sm:gap-8">
            {['Free 30-day trial', 'No credit card required', 'Full team onboarding support'].map((item) => (
              <li key={item} className="flex items-center gap-2 text-sm text-slate-300">
                <CheckIcon />
                {item}
              </li>
            ))}
          </ul>
          <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/register-hospital"
              className="w-full sm:w-auto rounded-lg bg-blue-600 px-8 py-3.5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors shadow-lg"
            >
              Register your hospital — it&apos;s free
            </Link>
            <Link
              href="/login"
              className="w-full sm:w-auto rounded-lg border border-slate-600 px-8 py-3.5 text-sm font-medium text-slate-300 hover:border-slate-400 hover:text-white transition-colors"
            >
              Sign in to existing account
            </Link>
          </div>
          <p className="mt-8 text-sm text-slate-500">
            Already a patient?{' '}
            <Link href="/register" className="text-blue-400 hover:text-blue-300 transition-colors">
              Create a patient account →
            </Link>
          </p>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-[#080d1a] border-t border-slate-800 py-10 px-4">
        <div className="mx-auto max-w-5xl flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600">
              <svg className="h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <span className="text-sm font-bold text-white">HealthBridge</span>
          </div>
          <p className="text-xs text-slate-500 text-center">
            © {new Date().getFullYear()} HealthBridge. All rights reserved.
            <span className="mx-2">·</span>
            <Link href="#" className="hover:text-slate-300 transition-colors">Privacy</Link>
            <span className="mx-2">·</span>
            <Link href="#" className="hover:text-slate-300 transition-colors">Terms</Link>
          </p>
        </div>
      </footer>
    </div>
  )
}
