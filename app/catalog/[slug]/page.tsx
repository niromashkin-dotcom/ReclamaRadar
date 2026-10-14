import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { and, eq } from 'drizzle-orm'
import { ArrowLeft, ArrowUpRight, Check, Minus, Globe } from 'lucide-react'
import { db } from '@/lib/db'
import { favorites } from '@/lib/db/schema'
import {
  getCategories,
  getProviderBySlug,
  getProviderCases,
  getProviderReviews,
  getRatings,
} from '@/lib/queries'
import { getSession } from '@/lib/session'
import { formatDate, formatPrice, formatRub, NICHES, labelOf } from '@/lib/constants'
import { TrustBadge } from '@/components/trust-badge'
import { FavoriteButton } from '@/components/provider/favorite-button'
import { ReviewForm } from '@/components/provider/review-form'
import { ReviewsList } from '@/components/provider/reviews-list'
import { CasesList } from '@/components/provider/cases-list'
import { ReportForm } from '@/components/provider/report-form'
import { ButtonLink } from '@/components/button-link'

type Params = Promise<{ slug: string }>

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params
  const provider = await getProviderBySlug(slug)
  if (!provider) return { title: 'Площадка не найдена' }
  return { title: provider.name, description: provider.shortDescription }
}

export default async function ProviderPage({ params }: { params: Params }) {
  const { slug } = await params
  const provider = await getProviderBySlug(slug)
  if (!provider) notFound()

  const [session, categories, ratings, reviewRows, caseRows] = await Promise.all([
    getSession(),
    getCategories(),
    getRatings(),
    getProviderReviews(provider.id),
    getProviderCases(provider.id),
  ])

  const category = categories.find((c) => c.id === provider.categoryId)
  const rating = ratings.get(provider.id)
  let isFavorite = false
  if (session?.user) {
    const [fav] = await db
      .select({ id: favorites.id })
      .from(favorites)
      .where(and(eq(favorites.userId, session.user.id), eq(favorites.providerId, provider.id)))
      .limit(1)
    isFavorite = Boolean(fav)
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 md:px-6 md:py-14">
      <Link
        href="/catalog"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        Каталог
      </Link>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_360px]">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <TrustBadge status={provider.trustStatus} />
            {provider.isSponsored && (
              <span className="rounded-full border border-border px-2.5 py-1 text-xs text-muted-foreground">
                {provider.adErid ? `Реклама · erid ${provider.adErid}` : 'Реклама'}
              </span>
            )}
          </div>
          {category && <p className="eyebrow mt-6">{category.name}</p>}
          <h1 className="mt-2 font-display text-3xl font-extrabold uppercase tracking-tight text-balance md:text-5xl">
            {provider.name}
          </h1>
          <p className="mt-5 max-w-2xl leading-relaxed text-muted-foreground text-pretty">
            {provider.description || provider.shortDescription}
          </p>

          <section aria-labelledby="how" className="mt-12">
            <h2 id="how" className="font-display text-lg font-bold uppercase tracking-wide">
              Как это работает
            </h2>
            <p className="mt-3 leading-relaxed text-muted-foreground">{provider.howItWorks}</p>
          </section>

          <section aria-label="Плюсы и минусы" className="mt-10 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-border bg-card p-6">
              <h2 className="eyebrow text-primary">Плюсы</h2>
              <ul className="mt-4 flex flex-col gap-3">
                {provider.pros.map((item) => (
                  <li key={item} className="flex gap-2 text-sm">
                    <Check className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-border bg-card p-6">
              <h2 className="eyebrow">Минусы</h2>
              <ul className="mt-4 flex flex-col gap-3">
                {provider.cons.map((item) => (
                  <li key={item} className="flex gap-2 text-sm">
                    <Minus className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {provider.niches.length > 0 && (
            <section aria-labelledby="niches" className="mt-10">
              <h2 id="niches" className="font-display text-lg font-bold uppercase tracking-wide">
                Лучше всего подходит
              </h2>
              <ul className="mt-4 flex flex-wrap gap-2">
                {provider.niches.map((n) => (
                  <li key={n} className="rounded-full border border-border px-3 py-1.5 text-sm">
                    {labelOf(NICHES, n)}
                  </li>
                ))}
              </ul>
            </section>
          )}

          <CasesList cases={caseRows} />
          <ReviewsList reviews={reviewRows} rating={rating} />

          {session?.user ? (
            <ReviewForm providerId={provider.id} />
          ) : (
            <p className="mt-6 text-sm text-muted-foreground">
              <Link href="/sign-in" className="text-foreground underline underline-offset-4">
                Войдите
              </Link>
              {', чтобы оставить отзыв.'}
            </p>
          )}
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl border border-border bg-card p-6">
            <dl className="flex flex-col gap-5">
              <div>
                <dt className="text-xs text-muted-foreground">Стоимость (ориентировочно)</dt>
                <dd className="mt-1 font-display text-lg font-bold">
                  {formatPrice(provider.priceFrom, provider.priceTo, provider.priceUnit)}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Минимальный бюджет</dt>
                <dd className="mt-1 font-medium">
                  {provider.minBudget ? formatRub(provider.minBudget) : 'Нет'}
                </dd>
              </div>
              {provider.reachNote && (
                <div>
                  <dt className="text-xs text-muted-foreground">Охват</dt>
                  <dd className="mt-1 text-sm leading-relaxed">{provider.reachNote}</dd>
                </div>
              )}
            </dl>

            <ButtonLink
              href={`/go/${provider.slug}`}
              prefetch={false}
              target="_blank"
              rel="nofollow sponsored noopener"
              size="lg"
              className="mt-6 h-12 w-full rounded-full text-sm font-semibold"
            >
              Перейти на сайт
              <ArrowUpRight className="size-4" aria-hidden="true" />
            </ButtonLink>
            {session?.user && (
              <FavoriteButton providerId={provider.id} initial={isFavorite} />
            )}

            <div className="mt-6 flex flex-col gap-2 border-t border-border pt-5 text-xs text-muted-foreground">
              <p>{`Данные обновлены: ${formatDate(provider.priceUpdatedAt)}`}</p>
              {provider.sourceUrl && (
                <p>
                  {'Источник: '}
                  <a
                    href={provider.sourceUrl}
                    target="_blank"
                    rel="nofollow noopener noreferrer"
                    className="underline underline-offset-4 hover:text-foreground"
                  >
                    официальный сайт
                  </a>
                </p>
              )}
              {provider.lastCheckedAt && (
                <p className="inline-flex items-center gap-1.5">
                  <Globe className="size-3.5" aria-hidden="true" />
                  {provider.isReachable
                    ? `Сайт доступен · проверено ${formatDate(provider.lastCheckedAt)}`
                    : `Сайт не ответил · ${formatDate(provider.lastCheckedAt)}`}
                </p>
              )}
              <p>Точные условия уточняйте на сайте площадки.</p>
            </div>
          </div>

          {session?.user && <ReportForm targetType="provider" targetId={provider.id} />}
        </aside>
      </div>
    </main>
  )
}
