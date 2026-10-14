import { getCategories, getPublishedProviders, getSiteStats } from '@/lib/queries'
import { Hero } from '@/components/landing/hero'
import { PlatformsStrip } from '@/components/landing/platforms-strip'
import { HowItWorks } from '@/components/landing/how-it-works'
import { CategoriesGrid } from '@/components/landing/categories-grid'
import { TrustSection } from '@/components/landing/trust-section'
import { FinalCta } from '@/components/landing/final-cta'

export default async function HomePage() {
  const [stats, categories, providers] = await Promise.all([
    getSiteStats(),
    getCategories(),
    getPublishedProviders(),
  ])

  const counts = new Map<number, number>()
  for (const p of providers) counts.set(p.categoryId, (counts.get(p.categoryId) ?? 0) + 1)

  const featured = providers
    .filter((p) => p.trustStatus === 'official')
    .slice(0, 8)
    .map((p) => p.name)

  return (
    <main>
      <Hero stats={stats} />
      <PlatformsStrip names={featured} />
      <HowItWorks />
      <CategoriesGrid categories={categories} counts={counts} />
      <TrustSection />
      <FinalCta />
    </main>
  )
}
