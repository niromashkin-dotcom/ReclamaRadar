import type { Metadata } from 'next'
import { eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { businessProfiles } from '@/lib/db/schema'
import { requireUser } from '@/lib/session'
import { ProfileForm } from '@/components/onboarding/profile-form'

export const metadata: Metadata = { title: 'Анкета бизнеса' }

export default async function OnboardingPage() {
  const user = await requireUser()
  const [profile] = await db
    .select()
    .from(businessProfiles)
    .where(eq(businessProfiles.userId, user.id))
    .limit(1)

  return (
    <main className="mx-auto max-w-3xl px-4 py-12 md:py-16">
      <p className="eyebrow">{profile ? 'Редактирование' : 'Шаг 1 из 1'}</p>
      <h1 className="mt-3 font-display text-3xl font-extrabold uppercase tracking-tight md:text-4xl">
        Расскажите о бизнесе
      </h1>
      <p className="mt-3 leading-relaxed text-muted-foreground">
        По этим данным мы подберём площадки. Изменить ответы можно в любой момент.
      </p>
      <ProfileForm profile={profile ?? null} />
    </main>
  )
}
