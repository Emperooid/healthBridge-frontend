import Image from 'next/image'
import { cn } from '@/utils/cn'

interface LogoProps {
  variant?: 'icon' | 'full'
  size?: 'sm' | 'md' | 'lg'
  className?: string
  light?: boolean
}

const iconSizes = { sm: 28, md: 36, lg: 44 }
const textSizes = { sm: 'text-sm', md: 'text-base', lg: 'text-lg' }

function LogoImage({ px, light, className }: { px: number; light: boolean; className?: string }) {
  return (
    <span
      className={cn('relative shrink-0 inline-block', className)}
      style={{ width: px, height: px }}
    >
      <Image
        src="/logo-2-removebg-preview.png"
        alt="CliniLynk"
        fill
        className={cn('object-contain', light && 'brightness-0 invert')}
        priority
      />
    </span>
  )
}

export function Logo({ variant = 'full', size = 'md', className, light = false }: LogoProps) {
  const px = iconSizes[size]
  const textCls = textSizes[size]

  if (variant === 'icon') {
    return <LogoImage px={px} light={light} className={className} />
  }

  return (
    <span className={cn('inline-flex items-center gap-2 shrink-0', className)}>
      <LogoImage px={px} light={light} />
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
