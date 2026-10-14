import { ShieldCheck, ShieldAlert, Shield } from 'lucide-react'
import { TRUST_STATUSES, type TrustStatus } from '@/lib/constants'
import { cn } from '@/lib/utils'

export function TrustBadge({ status, className }: { status: string; className?: string }) {
  const info = TRUST_STATUSES[(status as TrustStatus) in TRUST_STATUSES ? (status as TrustStatus) : 'unverified']
  const Icon = info.tone === 'accent' ? ShieldCheck : info.tone === 'warning' ? ShieldAlert : Shield

  return (
    <span
      title={info.description}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium',
        info.tone === 'accent' && 'border-primary/30 bg-primary/10 text-primary',
        info.tone === 'neutral' && 'border-border bg-secondary text-foreground',
        info.tone === 'warning' && 'border-warning/30 bg-warning/10 text-warning',
        className,
      )}
    >
      <Icon className="size-3.5" aria-hidden="true" />
      {info.label}
    </span>
  )
}
