'use client'

import { useState, type FormEvent } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { authClient } from '@/lib/auth-client'
import { recordConsents } from '@/app/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const ERRORS: Record<string, string> = {
  USER_ALREADY_EXISTS: 'Пользователь с таким email уже зарегистрирован',
  USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL: 'Пользователь с таким email уже зарегистрирован',
  INVALID_EMAIL_OR_PASSWORD: 'Неверный email или пароль',
  PASSWORD_TOO_SHORT: 'Пароль должен быть не короче 8 символов',
  INVALID_EMAIL: 'Некорректный email',
}

export function AuthForm({ mode }: { mode: 'sign-in' | 'sign-up' }) {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    const form = new FormData(event.currentTarget)
    const email = String(form.get('email') ?? '').trim()
    const password = String(form.get('password') ?? '')

    if (mode === 'sign-up' && (!form.get('terms') || !form.get('personalData'))) {
      setError('Чтобы продолжить, примите условия и дайте согласие на обработку данных')
      return
    }

    setPending(true)
    const result =
      mode === 'sign-up'
        ? await authClient.signUp.email({
            email,
            password,
            name: String(form.get('name') ?? '').trim() || email.split('@')[0],
          })
        : await authClient.signIn.email({ email, password })

    if (result.error) {
      setPending(false)
      setError(
        (result.error.code && ERRORS[result.error.code]) ||
          'Не удалось выполнить вход. Попробуйте ещё раз.',
      )
      return
    }

    if (mode === 'sign-up') {
      await recordConsents()
      router.push('/onboarding')
    } else {
      router.push('/recommendations')
    }
    router.refresh()
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5" noValidate={false}>
      {mode === 'sign-up' && (
        <div className="flex flex-col gap-2">
          <Label htmlFor="name">Как к вам обращаться</Label>
          <Input id="name" name="name" autoComplete="name" maxLength={80} className="h-11" />
        </div>
      )}
      <div className="flex flex-col gap-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" autoComplete="email" required className="h-11" />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="password">Пароль</Label>
        <Input
          id="password"
          name="password"
          type="password"
          required
          minLength={8}
          maxLength={128}
          autoComplete={mode === 'sign-up' ? 'new-password' : 'current-password'}
          className="h-11"
        />
        {mode === 'sign-up' && (
          <p className="text-xs text-muted-foreground">Минимум 8 символов</p>
        )}
      </div>

      {mode === 'sign-up' && (
        <div className="flex flex-col gap-3 text-sm">
          <label className="flex gap-3 leading-relaxed text-muted-foreground">
            <input type="checkbox" name="terms" required className="mt-1 size-4 shrink-0 accent-primary" />
            <span>
              {'Принимаю '}
              <Link href="/legal/terms" target="_blank" className="text-foreground underline underline-offset-4">
                пользовательское соглашение
              </Link>
              {' и '}
              <Link href="/legal/privacy" target="_blank" className="text-foreground underline underline-offset-4">
                политику конфиденциальности
              </Link>
            </span>
          </label>
          <label className="flex gap-3 leading-relaxed text-muted-foreground">
            <input
              type="checkbox"
              name="personalData"
              required
              className="mt-1 size-4 shrink-0 accent-primary"
            />
            <span>
              {'Даю '}
              <Link href="/legal/consent" target="_blank" className="text-foreground underline underline-offset-4">
                согласие на обработку персональных данных
              </Link>
            </span>
          </label>
        </div>
      )}

      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}

      <Button type="submit" size="lg" disabled={pending} className="h-12 rounded-full text-sm font-semibold">
        {pending ? 'Подождите...' : mode === 'sign-up' ? 'Создать аккаунт' : 'Войти'}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        {mode === 'sign-up' ? 'Уже есть аккаунт? ' : 'Ещё нет аккаунта? '}
        <Link
          href={mode === 'sign-up' ? '/sign-in' : '/sign-up'}
          className="text-foreground underline underline-offset-4"
        >
          {mode === 'sign-up' ? 'Войти' : 'Зарегистрироваться'}
        </Link>
      </p>
    </form>
  )
}
