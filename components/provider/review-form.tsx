'use client'

import { useActionState } from 'react'
import { Star } from 'lucide-react'
import { submitReview, type FormState } from '@/app/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { FormMessage } from '@/components/form-message'

export function ReviewForm({ providerId }: { providerId: number }) {
  const [state, action, pending] = useActionState<FormState, FormData>(submitReview, {})

  if (state.ok) {
    return (
      <div className="mt-6 rounded-2xl border border-primary/30 bg-primary/5 p-6">
        <FormMessage state={state} />
      </div>
    )
  }

  return (
    <form action={action} className="mt-6 flex flex-col gap-5 rounded-2xl border border-border bg-card p-6">
      <h3 className="font-display text-sm font-bold uppercase tracking-wide">Оставить отзыв</h3>
      <input type="hidden" name="providerId" value={providerId} />

      <fieldset>
        <legend className="text-sm font-medium">Оценка</legend>
        <div className="mt-2 flex flex-row-reverse justify-end gap-1 [&_label:has(:checked)_svg]:fill-primary [&_label:has(:checked)_svg]:text-primary [&_label:has(:checked)~label_svg]:fill-primary [&_label:has(:checked)~label_svg]:text-primary">
          {[5, 4, 3, 2, 1].map((n) => (
            <label
              key={n}
              className="cursor-pointer rounded-md has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring"
            >
              <input type="radio" name="rating" value={n} className="sr-only" required />
              <span className="sr-only">{`${n} из 5`}</span>
              <Star aria-hidden="true" className="size-7 text-muted-foreground transition-colors" />
            </label>
          ))}
        </div>
      </fieldset>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="budgetSpent">Сколько потратили, ₽</Label>
          <Input id="budgetSpent" name="budgetSpent" type="number" min={0} inputMode="numeric" className="h-11" />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="result">Результат кратко</Label>
          <Input id="result" name="result" maxLength={300} placeholder="Например: 40 заявок за месяц" className="h-11" />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="comment">Ваш опыт</Label>
        <Textarea
          id="comment"
          name="comment"
          required
          minLength={20}
          maxLength={3000}
          rows={4}
          placeholder="Что понравилось, что нет, окупилось ли размещение"
        />
      </div>

      <FormMessage state={state} />
      <Button type="submit" size="lg" disabled={pending} className="h-11 self-start rounded-full px-6">
        {pending ? 'Отправляем...' : 'Отправить на модерацию'}
      </Button>
    </form>
  )
}
