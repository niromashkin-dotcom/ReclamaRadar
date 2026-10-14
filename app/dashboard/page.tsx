import type { Metadata } from 'next'
import Link from 'next/link'
import { desc, eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { businessProfiles, favorites, providers, reviews } from '@/lib/db/schema'
import { requireUser } from '@/lib/session'
import { FORMATS, GOALS, NICHES, formatDate, formatRub, labelOf } from '@/lib/constants'
import { ButtonLink } from '@/components/button-link'
import { DeleteAccount } from '@/components/dashboard/delete-account'

export const metadata: Metadata = { title: 'Личный кабинет' }

const REVIEW_STATUS: Record<string, string> = {
  pending: 'На модерации',
  approved: 'Опубликован',
  rejected: 'Отклонён',
}

export default async function DashboardPage() {
  const user = await requireUser()

  const [[profile], favs, myReviews] = await Promise.all([
    db.select().from(businessProfiles).where(eq(businessProfiles.userId, user.id)).limit(1),
    db
      .select({ id: favorites.id, slug: providers.slug, name: providers.name, short: providers.shortDescription })
      .from(favorites)
      .innerJoin(providers, eq(providers.id, favorites.providerId))
      .where(eq(favorites.userId, user.id))
      .orderBy(desc(favorites.createdAt)),
    db
      .select({
        id: reviews.id,
        rating: reviews.rating,
        status: reviews.status,
        createdAt: reviews.createdAt,
        providerName: providers.name,
        providerSlug: providers.slug,
      })
      .from(reviews)
      .innerJoin(providers, eq(providers.id, reviews.providerId))
      .where(eq(reviews.userId, user.id))
      .orderBy(desc(reviews.createdAt)),
  ])

  return (
    <main className="mx-auto max-w-6xl px-4 py-12 md:px-6 md:py-16">
      <p className="eyebrow">Личный кабинет</p>
      <h1 className="mt-3 font-display text-3xl font-extrabold uppercase tracking-tight md:text-4xl">
        {user.name || user.email}
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">{user.email}</p>

      <div className="mt-10 grid gap-6 lg:grid-cols-3">
        <section aria-labelledby="profile" className="rounded-2xl border border-border bg-card p-6">
          <h2 id="profile" className="font-display text-sm font-bold uppercase tracking-wide">
            Анкета бизнеса
          </h2>
          {profile ? (
            <>
              <dl className="mt-5 flex flex-col gap-3 text-sm">
                {[
                  ['Название', profile.businessName],
                  ['Ниша', labelOf(NICHES, profile.businessType)],
                  ['Город', profile.city],
                  ['Бюджет', `${formatRub(profile.monthlyBudget)} / мес`],
                  ['Цель', labelOf(GOALS, profile.goal)],
                  ['Формат', labelOf(FORMATS, profile.format)],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-4">
                    <dt className="text-muted-foreground">{k}</dt>
                    <dd className="text-right">{v}</dd>
                  </div>
                ))}
              </dl>
              <div className="mt-6 flex flex-wrap gap-2">
                <ButtonLink href="/recommendations" size="lg" className="rounded-full px-5">
                  Мой подбор
                </ButtonLink>
                <ButtonLink href="/onboarding" variant="outline" size="lg" className="rounded-full px-5">
                  Изменить
                </ButtonLink>
              </div>
            </>
          ) : (
            <>
              <p className="mt-4 text-sm text-muted-foreground">Анкета ещё не заполнена.</p>
              <ButtonLink href="/onboarding" size="lg" className="mt-5 rounded-full px-5">
                Заполнить
              </ButtonLink>
            </>
          )}
        </section>

        <section aria-labelledby="favs" className="rounded-2xl border border-border bg-card p-6">
          <h2 id="favs" className="font-display text-sm font-bold uppercase tracking-wide">
            Избранное
          </h2>
          {favs.length === 0 ? (
            <p className="mt-4 text-sm text-muted-foreground">
              Сохраняйте площадки, чтобы вернуться к ним позже.
            </p>
          ) : (
            <ul className="mt-4 flex flex-col divide-y divide-border">
              {favs.map((f) => (
                <li key={f.id} className="py-3">
                  <Link href={`/catalog/${f.slug}`} className="font-medium hover:text-primary">
                    {f.name}
                  </Link>
                  <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">{f.short}</p>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section aria-labelledby="my-reviews" className="rounded-2xl border border-border bg-card p-6">
          <h2 id="my-reviews" className="font-display text-sm font-bold uppercase tracking-wide">
            Мои отзывы
          </h2>
          {myReviews.length === 0 ? (
            <p className="mt-4 text-sm text-muted-foreground">
              Размещались на площадке? Оставьте отзыв на её странице.
            </p>
          ) : (
            <ul className="mt-4 flex flex-col divide-y divide-border">
              {myReviews.map((r) => (
                <li key={r.id} className="flex items-center justify-between gap-3 py-3 text-sm">
                  <div>
                    <Link href={`/catalog/${r.providerSlug}`} className="font-medium hover:text-primary">
                      {r.providerName}
                    </Link>
                    <p className="text-xs text-muted-foreground">
                      {`${r.rating}/5 · ${formatDate(r.createdAt)}`}
                    </p>
                  </div>
                  <span className="shrink-0 rounded-full border border-border px-2.5 py-1 text-xs">
                    {REVIEW_STATUS[r.status] ?? r.status}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <DeleteAccount />
    </main>
  )
}
