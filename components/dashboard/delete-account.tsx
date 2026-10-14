'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { deleteAccount } from '@/app/actions'
import { Button } from '@/components/ui/button'

export function DeleteAccount() {
  const [confirming, setConfirming] = useState(false)
  const [pending, startTransition] = useTransition()
  const router = useRouter()

  return (
    <section aria-labelledby="danger" className="mt-12 rounded-2xl border border-destructive/30 p-6">
      <h2 id="danger" className="font-display text-sm font-bold uppercase tracking-wide">
        Удаление аккаунта
      </h2>
      <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
        Удалим аккаунт, анкету, избранное, отзывы и согласия. Это действие нельзя отменить.
      </p>
      {confirming ? (
        <div className="mt-5 flex flex-wrap gap-2">
          <Button
            variant="destructive"
            size="lg"
            disabled={pending}
            className="rounded-full px-5"
            onClick={() =>
              startTransition(async () => {
                await deleteAccount()
                router.refresh()
              })
            }
          >
            {pending ? 'Удаляем...' : 'Да, удалить навсегда'}
          </Button>
          <Button variant="ghost" size="lg" onClick={() => setConfirming(false)}>
            Отмена
          </Button>
        </div>
      ) : (
        <Button
          variant="destructive"
          size="lg"
          className="mt-5 rounded-full px-5"
          onClick={() => setConfirming(true)}
        >
          Удалить аккаунт
        </Button>
      )}
    </section>
  )
}
