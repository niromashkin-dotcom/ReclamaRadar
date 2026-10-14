'use client'

import { useTransition } from 'react'
import { moderateReview } from '@/app/actions'
import { Button } from '@/components/ui/button'

export function ReviewModeration({ reviewId }: { reviewId: number }) {
  const [pending, startTransition] = useTransition()

  return (
    <div className="mt-4 flex gap-2">
      <Button
        size="lg"
        disabled={pending}
        className="rounded-full px-4"
        onClick={() => startTransition(() => moderateReview(reviewId, 'approved'))}
      >
        Опубликовать
      </Button>
      <Button
        size="lg"
        variant="destructive"
        disabled={pending}
        className="rounded-full px-4"
        onClick={() => startTransition(() => moderateReview(reviewId, 'rejected'))}
      >
        Отклонить
      </Button>
    </div>
  )
}
