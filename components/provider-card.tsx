import Link from 'next/link'
import { ArrowUpRight, Flame, Star } from 'lucide-react'
import type { Provider } from '@/lib/db/schema'
import { formatPrice, formatRub } from '@/lib/constants'
import { TrustBadge } from '@/components/trust-badge'
import { cn } from '@/lib/utils'

export function ProviderCard({
  provider,
  categoryName,
  rating,
  popular,
  reasons,
  highlighted,
}: {
  provider: Provider
  categoryName?: string
  rating?: { rating: number; total: number } | null
  popular?: number
  reasons?: string[]
  highlighted?: boolean
}) {
  return (
    <article
      className={cn(
        'group relative flex h-full flex-col rounded-2xl border bg-card p-6 transition-colors',
        highlighted ? 'border-primary/50' : 'border-border hover:border-foreground/25',
      )}
    >
      {highlighted && (
        <span className="absolute -top-3 left-6 rounded-full bg-primary px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-primary-foreground">
          Лучшее совпадение
        </span>
      )}

      <div className="flex flex-wrap items-center gap-2">
        <TrustBadge status={provider.trustStatus} />
        {provider.isSponsored && (
          <span className="rounded-full border border-border px-2.5 py-1 text-xs text-muted-foreground">
            {provider.adErid ? `Реклама · erid ${provider.adErid}` : 'Реклама'}
          </span>
        )}
        {popular && popular >= 3 ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-2.5 py-1 text-xs">
            <Flame className="size-3.5 text-primary" aria-hidden="true" />
            Выбирают похожие бизнесы
          </span>
        ) : null}
      </div>

      {categoryName && <p className="eyebrow mt-5">{categoryName}</p>}
      <h3 className="mt-2 font-display text-lg font-bold uppercase leading-tight tracking-wide text-balance">
        <Link href={`/catalog/${provider.slug}`} className="after:absolute after:inset-0">
          {provider.name}
        </Link>
      </h3>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
        {provider.shortDescription}
      </p>

      {reasons && reasons.length > 0 && (
        <ul className="mt-4 flex flex-col gap-1.5">
          {reasons.slice(0, 3).map((reason) => (
            <li key={reason} className="flex items-start gap-2 text-sm">
              <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" aria-hidden="true" />
              {reason}
            </li>
          ))}
        </ul>
      )}

      <dl className="mt-auto grid grid-cols-2 gap-4 border-t border-border pt-5 text-sm [&:not(:first-child)]:mt-6">
        <div>
          <dt className="text-xs text-muted-foreground">Стоимость</dt>
          <dd className="mt-1 font-medium">
            {formatPrice(provider.priceFrom, null, provider.priceUnit)}
          </dd>
        </div>
        <div>
          <dt className="text-xs text-muted-foreground">Мин. бюджет</dt>
          <dd className="mt-1 font-medium">
            {provider.minBudget ? formatRub(provider.minBudget) : 'Нет'}
          </dd>
        </div>
      </dl>

      <div className="mt-5 flex items-center justify-between text-sm">
        <span className="inline-flex items-center gap-1.5 text-muted-foreground">
          <Star className="size-4 text-primary" aria-hidden="true" />
          {rating && rating.total > 0
            ? `${rating.rating.toFixed(1)} · ${rating.total} отзыв.`
            : 'Пока без отзывов'}
        </span>
        <span className="inline-flex items-center gap-1 font-medium text-foreground group-hover:text-primary">
          Подробнее
          <ArrowUpRight className="size-4" aria-hidden="true" />
        </span>
      </div>
    </article>
  )
}
