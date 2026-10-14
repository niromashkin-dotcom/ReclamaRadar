import Link from 'next/link'
import { Search } from 'lucide-react'
import { NICHES } from '@/lib/constants'
import { Button } from '@/components/ui/button'
import { NativeSelect } from '@/components/native-select'

export function CatalogFilters({
  defaults,
}: {
  defaults: { category: string; kind: string; niche: string; q: string; budget: string }
}) {
  return (
    <form
      action="/catalog"
      method="get"
      role="search"
      className="mt-6 grid gap-3 rounded-2xl border border-border bg-card p-4 md:grid-cols-[1.4fr_1fr_1fr_1fr_auto]"
    >
      {defaults.category && <input type="hidden" name="category" value={defaults.category} />}
      <label className="relative">
        <span className="sr-only">Поиск по названию</span>
        <Search
          className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />
        <input
          name="q"
          defaultValue={defaults.q}
          placeholder="Название площадки"
          className="h-11 w-full rounded-xl border border-input bg-background pl-9 pr-3 text-sm outline-none focus-visible:border-ring"
        />
      </label>
      <NativeSelect name="niche" defaultValue={defaults.niche} aria-label="Ниша">
        <option value="">Любая ниша</option>
        {NICHES.map((n) => (
          <option key={n.value} value={n.value}>
            {n.label}
          </option>
        ))}
      </NativeSelect>
      <NativeSelect name="kind" defaultValue={defaults.kind} aria-label="Формат">
        <option value="">Онлайн и офлайн</option>
        <option value="online">Только онлайн</option>
        <option value="offline">Только офлайн</option>
      </NativeSelect>
      <NativeSelect name="budget" defaultValue={defaults.budget} aria-label="Бюджет в месяц">
        <option value="">Любой бюджет</option>
        <option value="5000">до 5 000 ₽</option>
        <option value="15000">до 15 000 ₽</option>
        <option value="50000">до 50 000 ₽</option>
        <option value="150000">до 150 000 ₽</option>
      </NativeSelect>
      <div className="flex gap-2">
        <Button type="submit" size="lg" className="h-11 flex-1 rounded-xl px-5">
          Показать
        </Button>
        <Link
          href="/catalog"
          className="inline-flex h-11 items-center rounded-xl px-3 text-sm text-muted-foreground hover:text-foreground"
        >
          Сброс
        </Link>
      </div>
    </form>
  )
}
