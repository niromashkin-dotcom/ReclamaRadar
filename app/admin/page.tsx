import type { Metadata } from 'next'
import Link from 'next/link'
import { asc, desc, eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { providers, reports, reviews, user } from '@/lib/db/schema'
import { requireAdmin } from '@/lib/session'
import { formatDate } from '@/lib/constants'
import { ReviewModeration } from '@/components/admin/review-moderation'
import { ProviderEditor } from '@/components/admin/provider-editor'
import { ResolveReportButton } from '@/components/admin/resolve-report-button'

export const metadata: Metadata = { title: 'Админка', robots: { index: false } }

export default async function AdminPage() {
  await requireAdmin()

  const [pendingReviews, openReports, allProviders] = await Promise.all([
    db
      .select({
        id: reviews.id,
        rating: reviews.rating,
        comment: reviews.comment,
        result: reviews.result,
        budgetSpent: reviews.budgetSpent,
        createdAt: reviews.createdAt,
        providerName: providers.name,
        authorEmail: user.email,
      })
      .from(reviews)
      .innerJoin(providers, eq(providers.id, reviews.providerId))
      .leftJoin(user, eq(user.id, reviews.userId))
      .where(eq(reviews.status, 'pending'))
      .orderBy(asc(reviews.createdAt)),
    db
      .select({
        id: reports.id,
        targetType: reports.targetType,
        targetId: reports.targetId,
        reason: reports.reason,
        createdAt: reports.createdAt,
        authorEmail: user.email,
      })
      .from(reports)
      .leftJoin(user, eq(user.id, reports.userId))
      .where(eq(reports.status, 'open'))
      .orderBy(desc(reports.createdAt)),
    db.select().from(providers).orderBy(asc(providers.name)),
  ])

  const providerById = new Map(allProviders.map((p) => [p.id, p]))

  return (
    <main className="mx-auto max-w-6xl px-4 py-12 md:px-6 md:py-16">
      <p className="eyebrow">Администрирование</p>
      <h1 className="mt-3 font-display text-3xl font-extrabold uppercase tracking-tight md:text-4xl">
        Админка
      </h1>

      <section aria-labelledby="mod" className="mt-10">
        <h2 id="mod" className="font-display text-lg font-bold uppercase tracking-wide">
          {`Отзывы на модерации (${pendingReviews.length})`}
        </h2>
        {pendingReviews.length === 0 ? (
          <p className="mt-4 text-sm text-muted-foreground">Новых отзывов нет.</p>
        ) : (
          <ul className="mt-4 flex flex-col gap-4">
            {pendingReviews.map((r) => (
              <li key={r.id} className="rounded-2xl border border-border bg-card p-5">
                <p className="text-sm font-medium">{`${r.providerName} · ${r.rating}/5`}</p>
                <p className="text-xs text-muted-foreground">
                  {`${r.authorEmail ?? '—'} · ${formatDate(r.createdAt)}`}
                </p>
                {r.result && <p className="mt-2 text-sm">{`Результат: ${r.result}`}</p>}
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{r.comment}</p>
                <ReviewModeration reviewId={r.id} />
              </li>
            ))}
          </ul>
        )}
      </section>

      <section aria-labelledby="rep" className="mt-14">
        <h2 id="rep" className="font-display text-lg font-bold uppercase tracking-wide">
          {`Жалобы (${openReports.length})`}
        </h2>
        {openReports.length === 0 ? (
          <p className="mt-4 text-sm text-muted-foreground">Открытых жалоб нет.</p>
        ) : (
          <ul className="mt-4 flex flex-col gap-4">
            {openReports.map((r) => {
              const target = r.targetType === 'provider' ? providerById.get(r.targetId) : null
              return (
                <li key={r.id} className="rounded-2xl border border-border bg-card p-5">
                  <p className="text-sm font-medium">
                    {target ? (
                      <Link href={`/catalog/${target.slug}`} className="hover:text-primary">
                        {target.name}
                      </Link>
                    ) : (
                      `${r.targetType} #${r.targetId}`
                    )}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {`${r.authorEmail ?? '—'} · ${formatDate(r.createdAt)}`}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed">{r.reason}</p>
                  <ResolveReportButton reportId={r.id} />
                </li>
              )
            })}
          </ul>
        )}
      </section>

      <section aria-labelledby="prov" className="mt-14">
        <h2 id="prov" className="font-display text-lg font-bold uppercase tracking-wide">
          {`Площадки (${allProviders.length})`}
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Для рекламных размещений обязательно укажите токен erid — без него сохранение невозможно.
        </p>
        <ul className="mt-4 flex flex-col gap-3">
          {allProviders.map((p) => (
            <li key={p.id}>
              <ProviderEditor provider={p} />
            </li>
          ))}
        </ul>
      </section>
    </main>
  )
}
