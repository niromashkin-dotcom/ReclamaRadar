'use client'

import { useActionState, useState } from 'react'
import { Flag } from 'lucide-react'
import { submitReport, type FormState } from '@/app/actions'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { FormMessage } from '@/components/form-message'

export function ReportForm({
  targetType,
  targetId,
}: {
  targetType: 'provider' | 'review'
  targetId: number
}) {
  const [open, setOpen] = useState(false)
  const [state, action, pending] = useActionState<FormState, FormData>(submitReport, {})

  if (state.ok) {
    return (
      <div className="mt-4 px-1">
        <FormMessage state={state} />
      </div>
    )
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mt-4 inline-flex items-center gap-2 px-1 text-xs text-muted-foreground hover:text-foreground"
      >
        <Flag className="size-3.5" aria-hidden="true" />
        Сообщить о неточности или мошенничестве
      </button>
    )
  }

  return (
    <form action={action} className="mt-4 flex flex-col gap-3 rounded-2xl border border-border p-4">
      <input type="hidden" name="targetType" value={targetType} />
      <input type="hidden" name="targetId" value={targetId} />
      <label htmlFor="reason" className="text-sm font-medium">
        Что не так?
      </label>
      <Textarea id="reason" name="reason" required minLength={10} maxLength={1000} rows={3} />
      <FormMessage state={state} />
      <div className="flex gap-2">
        <Button type="submit" size="lg" disabled={pending} className="rounded-full px-4">
          {pending ? 'Отправляем...' : 'Отправить'}
        </Button>
        <Button type="button" variant="ghost" size="lg" onClick={() => setOpen(false)}>
          Отмена
        </Button>
      </div>
    </form>
  )
}
