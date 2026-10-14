import { Star } from 'lucide-react'
import { NICHES, formatDate, formatRub, labelOf } from '@/lib/constants'

type Review = {
  id: number
  rating: number
  budgetSpent: number | null
  result: string
  comment: string
  businessType: string | null
  city: string | null
  createdAt: Date
  authorName: string | null
}

export function ReviewsList({
  reviews,
  rating,
}: {
  reviews: Review[]
  rating?: { rating: number; total: number }
}) {
  return (
    <section aria-labelledby="reviews" className="mt-12">
      <div className="flex items-baseline justify-between gap-4">
        <h2 id="reviews" className="font-display text-lg font-bold uppercase tracking-wide">
          Отзывы бизнесов
        </h2>
        {rating && rating.total > 0 && (
          <p className="inline-flex items-center gap-1.5 text-sm">
            <Star className="size-4 fill-primary text-primary" aria-hidden="true" />
            {`${rating.rating.toFixed(1)} из 5 · ${rating.total}`}
          </p>
        )}
      </div>

      {reviews.length === 0 ? (
        <p className="mt-4 rounded-2xl border border-dashed border-border p-6 text-sm text-muted-foreground">
          Отзывов пока нет. Если вы размещались здесь — расскажите, как прошло.
        </p>
      ) : (
        <ul className="mt-4 flex flex-col gap-4">
          {reviews.map((r) => (
            <li key={r.id} className="rounded-2xl border border-border bg-card p-6">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-medium">{r.authorName ?? 'Пользователь'}</p>
                <p className="flex gap-0.5" aria-label={`Оценка ${r.rating} из 5`}>
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star
                      key={i}
                      aria-hidden="true"
                      className={i < r.rating ? 'size-4 fill-primary text-primary' : 'size-4 text-muted-foreground'}
                    />
                  ))}
                </p>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                {[r.businessType ? labelOf(NICHES, r.businessType) : null, r.city, formatDate(r.createdAt)]
                  .filter(Boolean)
                  .join(' · ')}
              </p>
              {(r.budgetSpent || r.result) && (
                <dl className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm">
                  {r.budgetSpent ? (
                    <div className="flex gap-1.5">
                      <dt className="text-muted-foreground">Бюджет:</dt>
                      <dd>{formatRub(r.budgetSpent)}</dd>
                    </div>
                  ) : null}
                  {r.result && (
                    <div className="flex gap-1.5">
                      <dt className="text-muted-foreground">Результат:</dt>
                      <dd>{r.result}</dd>
                    </div>
                  )}
                </dl>
              )}
              <p className="mt-3 text-sm leading-relaxed">{r.comment}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
