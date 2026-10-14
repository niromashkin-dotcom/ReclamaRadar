'use client'

import { useActionState } from 'react'
import { ChevronDown } from 'lucide-react'
import { updateProvider, type FormState } from '@/app/actions'
import type { Provider } from '@/lib/db/schema'
import { TRUST_STATUSES } from '@/lib/constants'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { NativeSelect } from '@/components/native-select'
import { FormMessage } from '@/components/form-message'

export function ProviderEditor({ provider }: { provider: Provider }) {
  const [state, action, pending] = useActionState<FormState, FormData>(updateProvider, {})
  const id = `p-${provider.id}`

  return (
    <details className="group rounded-2xl border border-border bg-card">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5">
        <span className="font-medium">{provider.name}</span>
        <span className="flex items-center gap-3 text-xs text-muted-foreground">
          {provider.status === 'hidden' ? 'Скрыта' : 'Опубликована'}
          <ChevronDown className="size-4 transition-transform group-open:rotate-180" aria-hidden="true" />
        </span>
      </summary>
      <form action={action} className="grid gap-4 border-t border-border p-5 sm:grid-cols-2 lg:grid-cols-3">
        <input type="hidden" name="id" value={provider.id} />
        <div className="flex flex-col gap-2">
          <Label htmlFor={`${id}-price`}>Цена от, ₽</Label>
          <Input id={`${id}-price`} name="priceFrom" type="number" min={0} defaultValue={provider.priceFrom ?? 0} className="h-11" />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor={`${id}-price-to`}>Цена до, ₽</Label>
          <Input id={`${id}-price-to`} name="priceTo" type="number" min={0} defaultValue={provider.priceTo ?? ''} placeholder="Не указано" className="h-11" />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor={`${id}-min`}>Мин. бюджет, ₽</Label>
          <Input id={`${id}-min`} name="minBudget" type="number" min={0} defaultValue={provider.minBudget} className="h-11" />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor={`${id}-trust`}>Статус проверки</Label>
          <NativeSelect id={`${id}-trust`} name="trustStatus" defaultValue={provider.trustStatus}>
            {Object.entries(TRUST_STATUSES).map(([k, v]) => (
              <option key={k} value={k}>
                {v.label}
              </option>
            ))}
          </NativeSelect>
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor={`${id}-status`}>Видимость</Label>
          <NativeSelect id={`${id}-status`} name="status" defaultValue={provider.status}>
            <option value="published">Опубликована</option>
            <option value="hidden">Скрыта</option>
          </NativeSelect>
        </div>
        <div className="flex flex-col gap-2 sm:col-span-2">
          <Label htmlFor={`${id}-aff`}>Партнёрская ссылка</Label>
          <Input
            id={`${id}-aff`}
            name="affiliateUrl"
            type="url"
            defaultValue={provider.affiliateUrl ?? ''}
            placeholder="https://"
            className="h-11"
          />
        </div>
        <label className="flex items-center gap-3 text-sm">
          <input type="checkbox" name="isSponsored" defaultChecked={provider.isSponsored} className="size-4 accent-primary" />
          Рекламное размещение
        </label>
        <div className="flex flex-col gap-2 sm:col-span-2">
          <Label htmlFor={`${id}-erid`}>Токен erid</Label>
          <Input id={`${id}-erid`} name="adErid" defaultValue={provider.adErid ?? ''} className="h-11" />
        </div>
        <div className="flex flex-col justify-end gap-2 sm:col-span-2 lg:col-span-3">
          <FormMessage state={state} />
          <Button type="submit" size="lg" disabled={pending} className="h-11 self-start rounded-full px-6">
            {pending ? 'Сохраняем...' : 'Сохранить'}
          </Button>
        </div>
      </form>
    </details>
  )
}
