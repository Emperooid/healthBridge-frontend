import Image from 'next/image'
import { cn } from '@/utils/cn'

interface LogoProps {
  variant?: 'icon' | 'full'
  size?: 'sm' | 'md' | 'lg'
  className?: string
  /** Use on dark backgrounds */
  light?: boolean
}

const sizes = {
  sm: { icon: 28, full: { width: 110, height: 28 } },
  md: { icon: 36, full: { width: 140, height: 36 } },
  lg: { icon: 48, full: { width: 180, height: 48 } },
}

export function Logo({ variant = 'full', size = 'md', className, light = false }: LogoProps) {
  const s = sizes[size]

  if (variant === 'icon') {
    return (
      <Image
        src="/logo-removebg-preview.png"
        alt="CliniLynk"
        width={s.icon}
        height={s.icon}
        className={cn('object-contain', light && 'brightness-0 invert', className)}
        priority
      />
    )
  }

  return (
    <Image
      src="/logo-2-removebg-preview.png"
      alt="CliniLynk"
      width={s.full.width}
      height={s.full.height}
      className={cn('object-contain', light && 'brightness-0 invert', className)}
      priority
    />
  )
}
