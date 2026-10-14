'use server'

import { and, eq } from 'drizzle-orm'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { db } from '@/lib/db'
import {
  auditLog,
  businessProfiles,
  clicks,
  consents,
  favorites,
  providers,
  reports,
  reviews,
  user,
} from '@/lib/db/schema'
import { getAdminIdOrThrow, getUserIdOrThrow } from '@/lib/session'
import { CITIES, DOCS_VERSION, FORMATS, GOALS, NICHES, SIZES } from '@/lib/constants'

export type FormState = { ok?: boolean; error?: string; message?: string }

const values = <T extends readonly { value: string }[]>(list: T) =>
  list.map((i) => i.value) as [string, ...string[]]

const profileSchema = z.object({
  businessName: z.string().trim().min(2, 'Укажите название').max(120),
  businessType: z.enum(values(NICHES), { message: 'Выберите нишу' }),
  businessSize: z.enum(values(SIZES)),
  city: z.enum(CITIES as unknown as [string, ...string[]], { message: 'Выберите город' }),
  monthlyBudget: z.coerce
    .number({ message: 'Укажите бюджет' })
    .int()
    .min(1000, 'Минимум 1 000 ₽')
    .max(100_000_000),
  goal: z.enum(values(GOALS), { message: 'Выберите цель' }),
  format: z.enum(values(FORMATS)),
  website: z
    .string()
    .trim()
    .max(300)
    .optional()
    .transform((v) => (v ? v : null))
    .refine((v) => !v || /^https?:\/\/\S+\.\S+/.test(v), 'Ссылка должна начинаться с http(s)://'),
})

export async function saveProfile(_: FormState, formData: FormData): Promise<FormState> {
  const userId = await getUserIdOrThrow()
  const parsed = profileSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? 'Проверьте поля' }

  await db
    .insert(businessProfiles)
    .values({ userId, ...parsed.data })
    .onConflictDoUpdate({
      target: businessProfiles.userId,
      set: { ...parsed.data, updatedAt: new Date() },
    })

  revalidatePath('/recommendations')
  revalidatePath('/dashboard')
  redirect('/recommendations')
}

export async function recordConsents() {
  const userId = await getUserIdOrThrow()
  const h = await headers()
  const ipAddress = h.get('x-forwarded-for')?.split(',')[0]?.trim() ?? null
  const userAgent = h.get('user-agent')?.slice(0, 500) ?? null
  await db.insert(consents).values(
    ['terms', 'privacy', 'personal_data'].map((type) => ({
      userId,
      type,
      version: DOCS_VERSION,
      ipAddress,
      userAgent,
    })),
  )
}

export async function toggleFavorite(providerId: number) {
  const userId = await getUserIdOrThrow()
  const id = z.number().int().positive().parse(providerId)
  const [existing] = await db
    .select({ id: favorites.id })
    .from(favorites)
    .where(and(eq(favorites.userId, userId), eq(favorites.providerId, id)))
    .limit(1)

  if (existing) {
    await db.delete(favorites).where(eq(favorites.id, existing.id))
  } else {
    await db.insert(favorites).values({ userId, providerId: id })
  }
  revalidatePath('/dashboard')
  revalidatePath('/catalog/[slug]', 'page')
  return !existing
}

const reviewSchema = z.object({
  providerId: z.coerce.number().int().positive(),
  rating: z.coerce.number().int().min(1, 'Поставьте оценку').max(5),
  budgetSpent: z
    .string()
    .optional()
    .transform((v) => (v ? Number(v) : null))
    .refine((v) => v === null || (Number.isInteger(v) && v >= 0 && v <= 100_000_000), 'Некорректный бюджет'),
  result: z.string().trim().max(300).default(''),
  comment: z.string().trim().min(20, 'Опишите опыт хотя бы в 20 символах').max(3000),
})

export async function submitReview(_: FormState, formData: FormData): Promise<FormState> {
  const userId = await getUserIdOrThrow()
  const parsed = reviewSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? 'Проверьте поля' }

  const [existing] = await db
    .select({ id: reviews.id })
    .from(reviews)
    .where(and(eq(reviews.userId, userId), eq(reviews.providerId, parsed.data.providerId)))
    .limit(1)
  if (existing) return { error: 'Вы уже оставляли отзыв об этой площадке' }

  const [profile] = await db
    .select({ businessType: businessProfiles.businessType, city: businessProfiles.city })
    .from(businessProfiles)
    .where(eq(businessProfiles.userId, userId))
    .limit(1)

  await db.insert(reviews).values({
    userId,
    ...parsed.data,
    businessType: profile?.businessType ?? null,
    city: profile?.city ?? null,
    status: 'pending',
  })

  return { ok: true, message: 'Спасибо! Отзыв появится после проверки модератором.' }
}

const reportSchema = z.object({
  targetType: z.enum(['provider', 'review']),
  targetId: z.coerce.number().int().positive(),
  reason: z.string().trim().min(10, 'Опишите проблему подробнее').max(1000),
})

export async function submitReport(_: FormState, formData: FormData): Promise<FormState> {
  const userId = await getUserIdOrThrow()
  const parsed = reportSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? 'Проверьте поля' }
  await db.insert(reports).values({ userId, ...parsed.data })
  return { ok: true, message: 'Жалоба отправлена. Мы проверим информацию.' }
}

export async function deleteAccount() {
  const userId = await getUserIdOrThrow()
  await db.transaction(async (tx) => {
    await tx.delete(businessProfiles).where(eq(businessProfiles.userId, userId))
    await tx.delete(favorites).where(eq(favorites.userId, userId))
    await tx.delete(reviews).where(eq(reviews.userId, userId))
    await tx.delete(reports).where(eq(reports.userId, userId))
    await tx.update(clicks).set({ userId: null }).where(eq(clicks.userId, userId))
    await tx.delete(consents).where(eq(consents.userId, userId))
    await tx.delete(user).where(eq(user.id, userId))
  })
  redirect('/')
}

export async function moderateReview(reviewId: number, status: 'approved' | 'rejected') {
  const adminId = await getAdminIdOrThrow()
  const id = z.number().int().positive().parse(reviewId)
  const next = z.enum(['approved', 'rejected']).parse(status)
  await db.update(reviews).set({ status: next }).where(eq(reviews.id, id))
  await db.insert(auditLog).values({
    userId: adminId,
    action: `review_${next}`,
    entity: 'review',
    entityId: id,
  })
  revalidatePath('/admin')
  revalidatePath('/catalog/[slug]', 'page')
}

export async function resolveReport(reportId: number) {
  const adminId = await getAdminIdOrThrow()
  const id = z.number().int().positive().parse(reportId)
  await db.update(reports).set({ status: 'resolved' }).where(eq(reports.id, id))
  await db.insert(auditLog).values({
    userId: adminId,
    action: 'report_resolved',
    entity: 'report',
    entityId: id,
  })
  revalidatePath('/admin')
}

const providerUpdateSchema = z.object({
  id: z.coerce.number().int().positive(),
  priceFrom: z.coerce.number().int().min(0).max(1_000_000_000),
  priceTo: z
    .string()
    .optional()
    .transform((v) => (v && v.trim() !== '' ? Number(v) : null))
    .refine((v) => v === null || (Number.isInteger(v) && v >= 0 && v <= 1_000_000_000), 'Некорректная цена до'),
  minBudget: z.coerce.number().int().min(0).max(1_000_000_000),
  trustStatus: z.enum(['official', 'verified', 'known', 'unverified']),
  status: z.enum(['published', 'hidden']),
  affiliateUrl: z
    .string()
    .trim()
    .max(500)
    .optional()
    .transform((v) => (v ? v : null))
    .refine((v) => !v || /^https:\/\/\S+$/.test(v), 'Партнёрская ссылка должна начинаться с https://'),
  isSponsored: z
    .string()
    .optional()
    .transform((v) => v === 'on'),
  adErid: z
    .string()
    .trim()
    .max(100)
    .optional()
    .transform((v) => (v ? v : null)),
})

export async function updateProvider(_: FormState, formData: FormData): Promise<FormState> {
  const adminId = await getAdminIdOrThrow()
  const parsed = providerUpdateSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? 'Проверьте поля' }
  if (parsed.data.isSponsored && !parsed.data.adErid) {
    return { error: 'Для рекламного размещения нужен токен erid (закон о маркировке рекламы)' }
  }

  const { id, ...data } = parsed.data
  await db
    .update(providers)
    .set({ ...data, priceUpdatedAt: new Date(), updatedAt: new Date() })
    .where(eq(providers.id, id))
  await db.insert(auditLog).values({
    userId: adminId,
    action: 'provider_updated',
    entity: 'provider',
    entityId: id,
    details: data,
  })
  revalidatePath('/admin')
  revalidatePath('/catalog')
  return { ok: true, message: 'Сохранено' }
}
