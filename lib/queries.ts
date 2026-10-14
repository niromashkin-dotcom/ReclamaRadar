import 'server-only'
import { and, asc, avg, count, desc, eq, gte, sql } from 'drizzle-orm'
import { db } from '@/lib/db'
import {
  cases,
  categories,
  clicks,
  providers,
  reviews,
  user,
} from '@/lib/db/schema'
import { FALLBACK_CATEGORIES, FALLBACK_PROVIDERS } from '@/lib/mock-data'

export async function getCategories() {
  try {
    const res = await db.select().from(categories).orderBy(asc(categories.sortOrder))
    return res.length > 0 ? res : FALLBACK_CATEGORIES
  } catch {
    return FALLBACK_CATEGORIES
  }
}

export async function getPublishedProviders() {
  try {
    const res = await db
      .select()
      .from(providers)
      .where(eq(providers.status, 'published'))
      .orderBy(desc(providers.isSponsored), asc(providers.name))
    return res.length > 0 ? res : FALLBACK_PROVIDERS
  } catch {
    return FALLBACK_PROVIDERS
  }
}

export async function getProviderBySlug(slug: string) {
  try {
    const [row] = await db
      .select()
      .from(providers)
      .where(and(eq(providers.slug, slug), eq(providers.status, 'published')))
      .limit(1)
    return row ?? FALLBACK_PROVIDERS.find((p) => p.slug === slug) ?? null
  } catch {
    return FALLBACK_PROVIDERS.find((p) => p.slug === slug) ?? null
  }
}

export async function getRatings() {
  try {
    const rows = await db
      .select({
        providerId: reviews.providerId,
        rating: avg(reviews.rating),
        total: count(reviews.id),
      })
      .from(reviews)
      .where(eq(reviews.status, 'approved'))
      .groupBy(reviews.providerId)
    return new Map(
      rows.map((r) => [r.providerId, { rating: Number(r.rating ?? 0), total: Number(r.total) }]),
    )
  } catch {
    return new Map()
  }
}

export async function getPopularity(businessType?: string) {
  try {
    const since = new Date(Date.now() - 1000 * 60 * 60 * 24 * 30)
    const rows = await db
      .select({ providerId: clicks.providerId, total: count(clicks.id) })
      .from(clicks)
      .where(
        businessType
          ? and(gte(clicks.createdAt, since), eq(clicks.businessType, businessType))
          : gte(clicks.createdAt, since),
      )
      .groupBy(clicks.providerId)
    return new Map(rows.map((r) => [r.providerId, Number(r.total)]))
  } catch {
    return new Map()
  }
}

export async function getProviderReviews(providerId: number) {
  try {
    return await db
      .select({
        id: reviews.id,
        rating: reviews.rating,
        budgetSpent: reviews.budgetSpent,
        result: reviews.result,
        comment: reviews.comment,
        businessType: reviews.businessType,
        city: reviews.city,
        createdAt: reviews.createdAt,
        authorName: user.name,
      })
      .from(reviews)
      .leftJoin(user, eq(user.id, reviews.userId))
      .where(and(eq(reviews.providerId, providerId), eq(reviews.status, 'approved')))
      .orderBy(desc(reviews.createdAt))
      .limit(50)
  } catch {
    return []
  }
}

export async function getProviderCases(providerId: number) {
  try {
    return await db
      .select()
      .from(cases)
      .where(eq(cases.providerId, providerId))
      .orderBy(desc(cases.isVerified), desc(cases.createdAt))
  } catch {
    return []
  }
}

export async function getSiteStats() {
  try {
    const [row] = await db
      .select({
        providers: sql<number>`(select count(*) from providers where status = 'published')::int`,
        categories: sql<number>`(select count(*) from categories)::int`,
        reviews: sql<number>`(select count(*) from reviews where status = 'approved')::int`,
      })
      .from(sql`(select 1) as one`)
    return row ?? { providers: 17, categories: 9, reviews: 0 }
  } catch {
    return { providers: 17, categories: 9, reviews: 0 }
  }
}
