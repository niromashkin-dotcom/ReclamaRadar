'use client'

import { useState, type FormEvent } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { authClient } from '@/lib/auth-client'
import { recordConsents } from '@/app/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Eye, EyeOff } from 'lucide-react'

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
  const [socialPending, setSocialPending] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)

  async function onSocial(provider: 'yandex' | 'vk' | 'google') {
    setError(null)
    setSocialPending(provider)
    try {
      const res = await authClient.signIn.social({
        provider,
        callbackURL: '/recommendations',
      })
      if (res?.error) {
        setSocialPending(null)
        setError(
          `Вход через ${provider === 'yandex' ? 'Яндекс' : provider === 'vk' ? 'VK' : 'Google'} временно настраивается. Войдите по email или обратитесь к администратору.`
        )
      }
    } catch (e: any) {
      setSocialPending(null)
      setError('Не удалось подключиться к сервису авторизации. Попробуйте войти по email.')
    }
  }

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
    <div className="flex flex-col gap-5">
      {/* Social Providers */}
      <div className="flex flex-col gap-2.5">
        <button
          type="button"
          onClick={() => onSocial('yandex')}
          disabled={Boolean(socialPending) || pending}
          className="flex h-11 w-full items-center justify-center gap-3 rounded-xl border border-border bg-card/60 px-4 text-sm font-medium text-foreground transition-all hover:border-red-500/40 hover:bg-card hover:shadow-sm disabled:opacity-50"
        >
          {/* Yandex Icon */}
          <span className="flex size-6 items-center justify-center rounded-full bg-[#FC3F1D] text-xs font-black text-white shadow-sm">
            Я
          </span>
          <span>{socialPending === 'yandex' ? 'Подключение...' : 'Войти через Яндекс ID'}</span>
        </button>

        <div className="grid grid-cols-2 gap-2.5">
          <button
            type="button"
            onClick={() => onSocial('vk')}
            disabled={Boolean(socialPending) || pending}
            className="flex h-11 items-center justify-center gap-2.5 rounded-xl border border-border bg-card/60 px-3 text-sm font-medium text-foreground transition-all hover:border-[#0077FF]/40 hover:bg-card hover:shadow-sm disabled:opacity-50"
          >
            {/* VK Icon */}
            <span className="flex size-5 items-center justify-center rounded-md bg-[#0077FF] text-[10px] font-black text-white shadow-sm">
              VK
            </span>
            <span>{socialPending === 'vk' ? '...' : 'VK ID'}</span>
          </button>

          <button
            type="button"
            onClick={() => onSocial('google')}
            disabled={Boolean(socialPending) || pending}
            className="flex h-11 items-center justify-center gap-2.5 rounded-xl border border-border bg-card/60 px-3 text-sm font-medium text-foreground transition-all hover:border-border hover:bg-card hover:shadow-sm disabled:opacity-50"
          >
            {/* Google Icon */}
            <svg className="size-4 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>{socialPending === 'google' ? '...' : 'Google'}</span>
          </button>
        </div>
      </div>

      {/* Divider */}
      <div className="relative my-1">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card px-3 text-muted-foreground">или через email</span>
        </div>
      </div>

      <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate={false}>
        {mode === 'sign-up' && (
          <div className="flex flex-col gap-2">
            <Label htmlFor="name">Как к вам обращаться</Label>
            <Input id="name" name="name" autoComplete="name" maxLength={80} placeholder="Иван" className="h-11" />
          </div>
        )}
        <div className="flex flex-col gap-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" autoComplete="email" placeholder="name@example.ru" required className="h-11" />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="password">Пароль</Label>
          <div className="relative">
            <Input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              required
              minLength={8}
              maxLength={128}
              autoComplete={mode === 'sign-up' ? 'new-password' : 'current-password'}
              placeholder="••••••••"
              className="h-11 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
              aria-label={showPassword ? 'Скрыть пароль' : 'Показать пароль'}
            >
              {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
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
          <div role="alert" className="rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive">
            {error}
          </div>
        )}

        <Button type="submit" size="lg" disabled={pending || Boolean(socialPending)} className="h-12 rounded-full text-sm font-semibold">
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
    </div>
  )
}
