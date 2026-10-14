'use client'

import { useSyncExternalStore } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

const KEY = 'cookie-notice-accepted'
const listeners = new Set<() => void>()

function subscribe(callback: () => void) {
  listeners.add(callback)
  return () => listeners.delete(callback)
}

export function CookieNotice() {
  const accepted = useSyncExternalStore(
    subscribe,
    () => localStorage.getItem(KEY) === '1',
    () => true,
  )

  if (accepted) return null

  return (
    <div
      role="region"
      aria-label="Уведомление о cookies"
      className="fixed inset-x-4 bottom-4 z-50 mx-auto flex max-w-2xl flex-col gap-3 rounded-2xl border border-border bg-card p-4 shadow-2xl sm:flex-row sm:items-center"
    >
      <p className="text-sm leading-relaxed text-muted-foreground">
        Мы используем только необходимые cookies для входа в аккаунт.{' '}
        <Link href="/legal/privacy" className="text-foreground underline underline-offset-4">
          Подробнее
        </Link>
      </p>
      <Button
        size="sm"
        className="shrink-0 rounded-full px-5"
        onClick={() => {
          localStorage.setItem(KEY, '1')
          listeners.forEach((l) => l())
        }}
      >
        Понятно
      </Button>
    </div>
  )
}
