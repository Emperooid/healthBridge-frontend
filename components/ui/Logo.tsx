import Image from 'next/image'
import { cn } from '@/utils/cn'

interface LogoProps {
  variant?: 'icon' | 'full'
  size?: 'sm' | 'md' | 'lg'
  className?: string
  /** Use on dark backgrounds */
  light?: boolean
}

const iconSizes = { sm: 28, md: 36, lg: 44 }
const textSizes = { sm: 'text-sm', md: 'text-base', lg: 'text-lg' }

export function Logo({ variant = 'full', size = 'md', className, light = false }: LogoProps) {
  const iconPx = iconSizes[size]
  const textCls = textSizes[size]

  if (variant === 'icon') {
    return (
      <Image
        src="/logo-2-removebg-preview.png"
        alt="CliniLynk"
        width={iconPx}
        height={iconPx}
        style={{ width: iconPx, height: 'auto' }}
        className={cn('object-contain shrink-0', light && 'brightness-0 invert', className)}
        priority
      />
    )
  }

  return (
    <span className={cn('inline-flex items-center gap-2 shrink-0', className)}>
      <Image
        src="/logo-2-removebg-preview.png"
        alt=""
        width={iconPx}
        height={iconPx}
        style={{ width: iconPx, height: 'auto' }}
        className={cn('object-contain shrink-0', light && 'brightness-0 invert')}
        priority
      />
      <span
        className={cn(
          'font-bold tracking-tight leading-none',
          textCls,
          light ? 'text-white' : 'text-slate-900',
        )}
      >
        CliniLynk
      </span>
    </span>
  )
}
