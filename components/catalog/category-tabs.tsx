import Link from 'next/link'
import type { Category } from '@/lib/db/schema'
import { cn } from '@/lib/utils'

export function CategoryTabs({
  categories,
  active,
  params,
}: {
  categories: Category[]
  active: string
  params: Record<string, string | string[] | undefined>
}) {
  const hrefFor = (slug: string) => {
    const next = new URLSearchParams()
    for (const [k, v] of Object.entries(params)) {
      if (typeof v === 'string' && v && k !== 'category') next.set(k, v)
    }
    if (slug) next.set('category', slug)
    const qs = next.toString()
    return qs ? `/catalog?${qs}` : '/catalog'
  }

  const items = [{ slug: '', name: 'Все' }, ...categories]

  return (
    <nav aria-label="Категории" className="-mx-4 mt-8 overflow-x-auto px-4">
      <ul className="flex w-max gap-2">
        {items.map((c) => {
          const isActive = c.slug === active
          return (
            <li key={c.slug || 'all'}>
              <Link
                href={hrefFor(c.slug)}
                aria-current={isActive ? 'page' : undefined}
                className={cn(
                  'inline-flex rounded-full border px-4 py-2 text-sm transition-colors',
                  isActive
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border text-muted-foreground hover:text-foreground',
                )}
              >
                {c.name}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
