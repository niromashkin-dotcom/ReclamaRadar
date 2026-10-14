import type { cases } from '@/lib/db/schema'
import { NICHES, formatRub, labelOf } from '@/lib/constants'

type Case = typeof cases.$inferSelect

export function CasesList({ cases: items }: { cases: Case[] }) {
  return (
    <section aria-labelledby="cases" className="mt-12">
      <h2 id="cases" className="font-display text-lg font-bold uppercase tracking-wide">
        Кейсы
      </h2>
      {items.length === 0 ? (
        <p className="mt-4 rounded-2xl border border-dashed border-border p-6 text-sm text-muted-foreground">
          Подтверждённых кейсов пока нет. Мы публикуем только кейсы с источником — без выдуманных цифр.
        </p>
      ) : (
        <ul className="mt-4 grid gap-4 sm:grid-cols-2">
          {items.map((c) => (
            <li key={c.id} className="rounded-2xl border border-border bg-card p-6">
              <p className="eyebrow">
                {[labelOf(NICHES, c.businessType), c.city].filter(Boolean).join(' · ')}
              </p>
              <h3 className="mt-2 font-medium">{c.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{c.resultSummary}</p>
              <p className="mt-4 text-xs text-muted-foreground">
                {[c.budget ? `Бюджет ${formatRub(c.budget)}` : null, c.duration]
                  .filter(Boolean)
                  .join(' · ')}
              </p>
              {c.sourceUrl && (
                <a
                  href={c.sourceUrl}
                  target="_blank"
                  rel="nofollow noopener noreferrer"
                  className="mt-2 inline-block text-xs underline underline-offset-4"
                >
                  Источник
                </a>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
