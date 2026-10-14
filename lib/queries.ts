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

export async function getCategories() {
  return db.select().from(categories).orderBy(asc(categories.sortOrder))
}

export async function getPublishedProviders() {
  return db
    .select()
    .from(providers)
    .where(eq(providers.status, 'published'))
    .orderBy(desc(providers.isSponsored), asc(providers.name))
}

export async function getProviderBySlug(slug: string) {
  const [row] = await db
    .select()
    .from(providers)
    .where(and(eq(providers.slug, slug), eq(providers.status, 'published')))
    .limit(1)
  return row ?? null
}

export async function getRatings() {
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
}

export async function getPopularity(businessType?: string) {
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
}

export async function getProviderReviews(providerId: number) {
  return db
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
}

export async function getProviderCases(providerId: number) {
  return db
    .select()
    .from(cases)
    .where(eq(cases.providerId, providerId))
    .orderBy(desc(cases.isVerified), desc(cases.createdAt))
}

export async function getSiteStats() {
  const [row] = await db
    .select({
      providers: sql<number>`(select count(*) from providers where status = 'published')::int`,
      categories: sql<number>`(select count(*) from categories)::int`,
      reviews: sql<number>`(select count(*) from reviews where status = 'approved')::int`,
    })
    .from(sql`(select 1) as one`)
  return row
}
