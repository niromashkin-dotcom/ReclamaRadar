import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getSession } from '@/lib/session'
import { AuthShell } from '@/components/auth/auth-shell'
import { AuthForm } from '@/components/auth/auth-form'

export const metadata: Metadata = { title: 'Вход' }

export default async function SignInPage() {
  const session = await getSession()
  if (session?.user) redirect('/recommendations')

  return (
    <AuthShell title="Вход" subtitle="Войдите, чтобы увидеть свой подбор и избранные площадки.">
      <AuthForm mode="sign-in" />
    </AuthShell>
  )
}
