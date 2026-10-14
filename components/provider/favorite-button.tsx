'use client'

import { useOptimistic, useTransition } from 'react'
import { Bookmark } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toggleFavorite } from '@/app/actions'
import { cn } from '@/lib/utils'

export function FavoriteButton({ providerId, initial }: { providerId: number; initial: boolean }) {
  const [pending, startTransition] = useTransition()
  const [saved, setSaved] = useOptimistic(initial)

  return (
    <Button
      type="button"
      variant="outline"
      size="lg"
      aria-pressed={saved}
      disabled={pending}
      className="mt-3 h-11 w-full rounded-full"
      onClick={() =>
        startTransition(async () => {
          setSaved(!saved)
          await toggleFavorite(providerId)
        })
      }
    >
      <Bookmark className={cn('size-4', saved && 'fill-primary text-primary')} aria-hidden="true" />
      {saved ? 'В избранном' : 'В избранное'}
    </Button>
  )
}
