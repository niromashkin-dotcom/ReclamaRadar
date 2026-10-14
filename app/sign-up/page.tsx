import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getSession } from '@/lib/session'
import { AuthShell } from '@/components/auth/auth-shell'
import { AuthForm } from '@/components/auth/auth-form'

export const metadata: Metadata = { title: 'Регистрация' }

export default async function SignUpPage() {
  const session = await getSession()
  if (session?.user) redirect('/recommendations')

  return (
    <AuthShell
      title="Регистрация"
      subtitle="Создайте аккаунт, заполните короткую анкету и получите подбор рекламы под ваш бизнес."
    >
      <AuthForm mode="sign-up" />
    </AuthShell>
  )
}
