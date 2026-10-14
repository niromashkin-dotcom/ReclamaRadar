import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { eq } from 'drizzle-orm'
import { Lightbulb } from 'lucide-react'
import { db } from '@/lib/db'
import { businessProfiles } from '@/lib/db/schema'
import { requireUser } from '@/lib/session'
import { getCategories, getPopularity, getPublishedProviders, getRatings } from '@/lib/queries'
import { budgetAdvice, recommend } from '@/lib/recommend'
import { FORMATS, GOALS, NICHES, formatRub, labelOf } from '@/lib/constants'
import { ProviderCard } from '@/components/provider-card'
import { ButtonLink } from '@/components/button-link'

export const metadata: Metadata = { title: 'Мой подбор рекламы' }

export default async function RecommendationsPage() {
  const user = await requireUser()
  const [profile] = await db
    .select()
    .from(businessProfiles)
    .where(eq(businessProfiles.userId, user.id))
    .limit(1)
  if (!profile) redirect('/onboarding')

  const [categories, providers, ratings, popularity] = await Promise.all([
    getCategories(),
    getPublishedProviders(),
    getRatings(),
    getPopularity(profile.businessType),
  ])

  const groups = recommend(profile, providers, categories, ratings, popularity)
  const topId = groups[0]?.items[0]?.provider.id

  return (
    <main className="mx-auto max-w-6xl px-4 py-12 md:px-6 md:py-16">
      <p className="eyebrow">Персональный подбор</p>
      <h1 className="mt-3 font-display text-3xl font-extrabold uppercase tracking-tight text-balance md:text-5xl">
        {profile.businessName}
      </h1>
      <ul className="mt-5 flex flex-wrap gap-2 text-sm">
        {[
          labelOf(NICHES, profile.businessType),
          profile.city,
          `${formatRub(profile.monthlyBudget)} в месяц`,
          labelOf(GOALS, profile.goal),
          labelOf(FORMATS, profile.format),
        ].map((chip) => (
          <li key={chip} className="rounded-full border border-border px-3 py-1.5">
            {chip}
          </li>
        ))}
        <li>
          <Link
            href="/onboarding"
            className="inline-flex rounded-full px-3 py-1.5 text-primary underline-offset-4 hover:underline"
          >
            Изменить
          </Link>
        </li>
      </ul>

      <div className="mt-8 flex gap-4 rounded-2xl border border-primary/30 bg-primary/5 p-5">
        <Lightbulb className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden="true" />
        <p className="text-sm leading-relaxed">{budgetAdvice(profile.monthlyBudget)}</p>
      </div>

      {groups.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed border-border p-10 text-center">
          <p className="font-display text-sm font-bold uppercase tracking-wide">
            Пока ничего не подошло
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Попробуйте увеличить бюджет или выбрать формат «Гибрид».
          </p>
          <ButtonLink href="/onboarding" size="lg" className="mt-6 rounded-full px-6">
            Изменить анкету
          </ButtonLink>
        </div>
      ) : (
        <div className="mt-12 flex flex-col gap-14">
          {groups.map((group) => (
            <section key={group.category.id} aria-labelledby={`g-${group.category.id}`}>
              <div className="flex flex-wrap items-end justify-between gap-3 border-b border-border pb-4">
                <div>
                  <h2
                    id={`g-${group.category.id}`}
                    className="font-display text-xl font-bold uppercase tracking-wide"
                  >
                    {group.category.name}
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">{group.category.description}</p>
                </div>
                <Link
                  href={`/catalog?category=${group.category.slug}`}
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Все в категории
                </Link>
              </div>
              <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {group.items.slice(0, 3).map((item) => (
                  <li key={item.provider.id}>
                    <ProviderCard
                      provider={item.provider}
                      rating={item.rating}
                      popular={item.popularWithSimilar}
                      reasons={item.reasons}
                      highlighted={item.provider.id === topId}
                    />
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}

      <p className="mt-14 text-xs leading-relaxed text-muted-foreground">
        Подбор формируется автоматически по нише, бюджету, цели и статусу проверки площадки. Это не
        гарантия результата. Рекламные размещения в выдаче помечены.
      </p>
    </main>
  )
}
