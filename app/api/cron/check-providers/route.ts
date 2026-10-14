import { eq } from 'drizzle-orm'
import { NextResponse, type NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { providers } from '@/lib/db/schema'

export const maxDuration = 60

async function isReachable(url: string) {
  try {
    const res = await fetch(url, {
      method: 'GET',
      redirect: 'follow',
      signal: AbortSignal.timeout(8000),
      headers: { 'user-agent': 'ReklamaRadarBot/1.0 (+availability check)' },
    })
    return res.status < 500
  } catch {
    return false
  }
}

export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET
  if (!secret || request.headers.get('authorization') !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const rows = await db.select({ id: providers.id, url: providers.websiteUrl }).from(providers)
  const checkedAt = new Date()
  const results = await Promise.all(
    rows.map(async (row) => ({ id: row.id, ok: await isReachable(row.url) })),
  )

  for (const r of results) {
    await db
      .update(providers)
      .set({ isReachable: r.ok, lastCheckedAt: checkedAt })
      .where(eq(providers.id, r.id))
  }

  return NextResponse.json({
    checked: results.length,
    unreachable: results.filter((r) => !r.ok).length,
  })
}
