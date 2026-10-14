import type { BusinessProfile, Category, Provider } from '@/lib/db/schema'
import { GOALS, NICHES, labelOf, formatRub } from '@/lib/constants'

export type Recommendation = {
  provider: Provider
  score: number
  reasons: string[]
  rating: { rating: number; total: number } | null
  popularWithSimilar: number
}

export type RecommendationGroup = {
  category: Category
  items: Recommendation[]
}

const TRUST_SCORE: Record<string, number> = {
  official: 15,
  verified: 14,
  known: 9,
  unverified: 0,
}

export function recommend(
  profile: BusinessProfile,
  allProviders: Provider[],
  allCategories: Category[],
  ratings: Map<number, { rating: number; total: number }>,
  popularity: Map<number, number>,
): RecommendationGroup[] {
  const scored: Recommendation[] = []

  for (const provider of allProviders) {
    if (profile.format !== 'hybrid' && provider.kind !== profile.format) continue
    if (provider.minBudget > profile.monthlyBudget) continue
    const nicheFits = provider.niches.length === 0 || provider.niches.includes(profile.businessType)
    if (!nicheFits) continue

    const cityFits =
      provider.cities.length === 0 ||
      provider.cities.includes(profile.city) ||
      provider.cities.includes('Все города')
    if (!cityFits) continue

    const reasons: string[] = []
    let score = 0

    if (provider.cities.length > 0 && provider.cities.includes(profile.city)) {
      score += 15
      reasons.push(`Работает в г. ${profile.city}`)
    }

    if (provider.niches.includes(profile.businessType)) {
      score += 25
      reasons.push(`Подходит для ниши «${labelOf(NICHES, profile.businessType)}»`)
    } else {
      score += 10
    }

    if (provider.goals.includes(profile.goal)) {
      score += 25
      reasons.push(`Работает на цель «${labelOf(GOALS, profile.goal).toLowerCase()}»`)
    }

    score += TRUST_SCORE[provider.trustStatus] ?? 0

    if (provider.minBudget === 0 || provider.minBudget <= profile.monthlyBudget * 0.5) {
      score += 10
      reasons.push(
        provider.minBudget === 0
          ? 'Без минимального бюджета'
          : `Минимальный бюджет ${formatRub(provider.minBudget)} — укладываетесь с запасом`,
      )
    }

    const rating = ratings.get(provider.id) ?? null
    if (rating && rating.total > 0) {
      score += Math.round((rating.rating / 5) * 10)
    }

    const popularWithSimilar = popularity.get(provider.id) ?? 0
    score += Math.min(popularWithSimilar, 15)

    scored.push({ provider, score, reasons, rating, popularWithSimilar })
  }

  return allCategories
    .map((category) => ({
      category,
      items: scored
        .filter((r) => r.provider.categoryId === category.id)
        .sort((a, b) => b.score - a.score),
    }))
    .filter((group) => group.items.length > 0)
    .sort((a, b) => (b.items[0]?.score ?? 0) - (a.items[0]?.score ?? 0))
}

export function budgetAdvice(budget: number) {
  if (budget < 15000)
    return 'С таким бюджетом лучше начать с 1–2 каналов: карточка на картах и одна площадка с оплатой за результат. Распыляться не стоит.'
  if (budget < 50000)
    return 'Хватит на 2–3 канала. Обычно сочетают поиск или карты (горячий спрос) с соцсетями или блогерами (охват). Через месяц оставьте то, что дало заявки.'
  if (budget < 150000)
    return 'Можно тестировать 3–4 канала параллельно и подключить специалиста или агентство для настройки и аналитики.'
  return 'Бюджет позволяет комплексную стратегию, включая наружную рекламу. Стоит заложить сквозную аналитику, чтобы понимать окупаемость каждого канала.'
}
