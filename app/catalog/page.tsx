import type { Metadata } from 'next'
import { getCategories, getPopularity, getPublishedProviders, getRatings } from '@/lib/queries'
import { CatalogFilters } from '@/components/catalog/catalog-filters'
import { CategoryTabs } from '@/components/catalog/category-tabs'
import { ProviderCard } from '@/components/provider-card'

export const metadata: Metadata = {
  title: 'Каталог рекламных площадок',
  description:
    'Сравните рекламные площадки: контекст, таргет, карты, Авито, Telegram, блогеры, агентства и наружная реклама.',
}

type SearchParams = Promise<Record<string, string | string[] | undefined>>

export default async function CatalogPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams
  const pick = (key: string) => (typeof params[key] === 'string' ? (params[key] as string) : '')
  const category = pick('category')
  const kind = pick('kind')
  const niche = pick('niche')
  const q = pick('q').trim().toLowerCase()
  const budget = Number(pick('budget')) || 0

  const [categories, providers, ratings, popularity] = await Promise.all([
    getCategories(),
    getPublishedProviders(),
    getRatings(),
    getPopularity(),
  ])

  const categoryBySlug = new Map(categories.map((c) => [c.slug, c]))
  const categoryById = new Map(categories.map((c) => [c.id, c]))
  const activeCategory = categoryBySlug.get(category)

  const filtered = providers.filter((p) => {
    if (activeCategory && p.categoryId !== activeCategory.id) return false
    if (kind && p.kind !== kind) return false
    if (niche && p.niches.length > 0 && !p.niches.includes(niche)) return false
    if (budget && p.minBudget > budget) return false
    if (q && !`${p.name} ${p.shortDescription}`.toLowerCase().includes(q)) return false
    return true
  })

  return (
    <main className="mx-auto max-w-6xl px-4 py-12 md:px-6 md:py-16">
      <p className="eyebrow">Каталог</p>
      <h1 className="mt-3 font-display text-3xl font-extrabold uppercase tracking-tight md:text-5xl">
        {activeCategory ? activeCategory.name : 'Все площадки'}
      </h1>
      {activeCategory && (
        <p className="mt-3 max-w-2xl leading-relaxed text-muted-foreground">
          {activeCategory.description}
        </p>
      )}

      <CategoryTabs categories={categories} active={category} params={params} />
      <CatalogFilters defaults={{ category, kind, niche, q: pick('q'), budget: pick('budget') }} />

      <p className="mt-8 text-sm text-muted-foreground" aria-live="polite">
        {`Найдено: ${filtered.length}`}
      </p>

      {filtered.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed border-border p-10 text-center">
          <p className="font-display text-sm font-bold uppercase tracking-wide">Ничего не нашлось</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Попробуйте увеличить бюджет или сбросить фильтры.
          </p>
        </div>
      ) : (
        <ul className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => (
            <li key={p.id}>
              <ProviderCard
                provider={p}
                categoryName={categoryById.get(p.categoryId)?.name}
                rating={ratings.get(p.id)}
                popular={popularity.get(p.id)}
              />
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}
