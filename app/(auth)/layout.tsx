import type { ReactNode } from 'react'
import { Logo } from '@/components/ui/Logo'

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-white">
      {/* Left panel — dark brand */}
      <div className="hidden lg:flex lg:w-5/12 flex-col justify-between bg-[#0F172A] p-10 relative overflow-hidden">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(#3B82F6 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

        <div className="relative">
          <div className="flex items-center">
            <Logo variant="full" size="md" />
          </div>

          <div className="mt-12 space-y-3">
            {[
              { icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z', label: 'Secure, HIPAA-compliant records' },
              { icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z', label: 'Connect patients, doctors & hospitals' },
              { icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2', label: 'Full medical record management' },
              { icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5', label: 'Multi-hospital network support' },
            ].map((feature) => (
              <div key={feature.label} className="flex items-center gap-3">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-blue-600/20 border border-blue-600/30">
                  <svg className="h-3.5 w-3.5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={feature.icon} />
                  </svg>
                </div>
                <span className="text-sm text-slate-300">{feature.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="grid grid-cols-3 gap-3">
            {[
              { value: '500+', label: 'Hospitals' },
              { value: '10k+', label: 'Patients' },
              { value: '2k+', label: 'Doctors' },
            ].map((stat) => (
              <div key={stat.label} className="rounded-lg border border-white/10 bg-white/5 p-3 text-center">
                <p className="text-lg font-bold text-white">{stat.value}</p>
                <p className="text-xs text-slate-500">{stat.label}</p>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs text-slate-600">
            © {new Date().getFullYear()} CliniLynk. All rights reserved.
          </p>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-12 lg:px-12">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="mb-8 flex items-center lg:hidden">
            <Logo variant="full" size="md" />
          </div>
          {children}
        </div>
      </div>
    </div>
  )
}
