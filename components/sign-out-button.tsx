'use client'

import { useRouter } from 'next/navigation'
import { useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { authClient } from '@/lib/auth-client'

export function SignOutButton() {
  const router = useRouter()
  const [pending, startTransition] = useTransition()

  return (
    <Button
      variant="outline"
      size="sm"
      className="rounded-full"
      disabled={pending}
      onClick={() =>
        startTransition(async () => {
          await authClient.signOut()
          router.push('/')
          router.refresh()
        })
      }
    >
      {pending ? 'Выходим...' : 'Выйти'}
    </Button>
  )
}
