'use client'

import { useActionState } from 'react'
import { saveProfile, type FormState } from '@/app/actions'
import type { BusinessProfile } from '@/lib/db/schema'
import { CITIES, FORMATS, GOALS, NICHES, SIZES } from '@/lib/constants'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { NativeSelect } from '@/components/native-select'
import { FormMessage } from '@/components/form-message'
import { ChoiceGroup } from '@/components/onboarding/choice-group'

export function ProfileForm({ profile }: { profile: BusinessProfile | null }) {
  const [state, action, pending] = useActionState<FormState, FormData>(saveProfile, {})

  return (
    <form action={action} className="mt-10 flex flex-col gap-8">
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="businessName">Название бизнеса</Label>
          <Input
            id="businessName"
            name="businessName"
            required
            minLength={2}
            maxLength={120}
            defaultValue={profile?.businessName}
            placeholder="Кофейня «Зерно»"
            className="h-11"
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="businessType">Ниша</Label>
          <NativeSelect id="businessType" name="businessType" required defaultValue={profile?.businessType ?? ''}>
            <option value="" disabled>
              Выберите нишу
            </option>
            {NICHES.map((n) => (
              <option key={n.value} value={n.value}>
                {n.label}
              </option>
            ))}
          </NativeSelect>
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="city">Город</Label>
          <NativeSelect id="city" name="city" required defaultValue={profile?.city ?? ''}>
            <option value="" disabled>
              Выберите город
            </option>
            {CITIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </NativeSelect>
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="monthlyBudget">Бюджет на рекламу в месяц, ₽</Label>
          <Input
            id="monthlyBudget"
            name="monthlyBudget"
            type="number"
            inputMode="numeric"
            required
            min={1000}
            step={1000}
            defaultValue={profile?.monthlyBudget}
            placeholder="30000"
            className="h-11"
          />
        </div>
      </div>

      <ChoiceGroup
        legend="Главная цель"
        name="goal"
        options={GOALS.map((g) => ({ value: g.value, label: g.label }))}
        defaultValue={profile?.goal}
        required
      />
      <ChoiceGroup
        legend="Формат рекламы"
        name="format"
        options={FORMATS.map((f) => ({ value: f.value, label: f.label, hint: f.hint }))}
        defaultValue={profile?.format ?? 'online'}
      />
      <ChoiceGroup
        legend="Размер бизнеса"
        name="businessSize"
        options={SIZES.map((s) => ({ value: s.value, label: s.label, hint: s.hint }))}
        defaultValue={profile?.businessSize ?? 'small'}
      />

      <div className="flex flex-col gap-2">
        <Label htmlFor="website">Сайт или соцсеть (необязательно)</Label>
        <Input
          id="website"
          name="website"
          type="url"
          maxLength={300}
          defaultValue={profile?.website ?? ''}
          placeholder="https://"
          className="h-11"
        />
      </div>

      <FormMessage state={state} />
      <Button type="submit" size="lg" disabled={pending} className="h-12 self-start rounded-full px-8 text-sm font-semibold">
        {pending ? 'Подбираем...' : 'Показать подбор'}
      </Button>
    </form>
  )
}
