import { eq } from 'drizzle-orm'
import { NextResponse, type NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { businessProfiles, clicks } from '@/lib/db/schema'
import { getProviderBySlug } from '@/lib/queries'
import { getSession } from '@/lib/session'

export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const provider = await getProviderBySlug(slug)
  if (!provider) return NextResponse.redirect(new URL('/catalog', request.url))

  const session = await getSession()
  let businessType: string | null = null
  let city: string | null = null
  if (session?.user) {
    const [profile] = await db
      .select({ businessType: businessProfiles.businessType, city: businessProfiles.city })
      .from(businessProfiles)
      .where(eq(businessProfiles.userId, session.user.id))
      .limit(1)
    businessType = profile?.businessType ?? null
    city = profile?.city ?? null
  }

  await db.insert(clicks).values({
    providerId: provider.id,
    userId: session?.user.id ?? null,
    businessType,
    city,
  })

  const target = provider.affiliateUrl ?? provider.websiteUrl
  if (!/^https?:\/\//.test(target)) return NextResponse.redirect(new URL('/catalog', request.url))
  return NextResponse.redirect(target, 302)
}
