import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import type { Category } from '@/lib/db/schema'
import { SectionHeading } from '@/components/section-heading'
import { pluralize } from '@/lib/constants'

export function CategoriesGrid({
  categories,
  counts,
}: {
  categories: Category[]
  counts: Map<number, number>
}) {
  return (
    <section className="border-t border-border">
      <div className="mx-auto max-w-6xl px-4 py-20 md:px-6 md:py-28">
        <SectionHeading
          eyebrow="Что внутри"
          title="Типы рекламы"
          description="От объявлений в поиске до щитов в городе. Выберите направление или доверьтесь подбору."
        />
        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category, i) => {
            const count = counts.get(category.id) ?? 0
            return (
              <li key={category.id}>
                <Link
                  href={`/catalog?category=${category.slug}`}
                  className="group flex h-full flex-col rounded-2xl border border-border bg-card p-6 transition-colors hover:border-primary/50"
                >
                  <div className="flex items-center justify-between">
                    <span className="rounded-full border border-border px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                      {`${String(i + 1).padStart(2, '0')} — ${category.kind === 'offline' ? 'Офлайн' : 'Онлайн'}`}
                    </span>
                    <ArrowUpRight
                      className="size-4 text-muted-foreground transition-colors group-hover:text-primary"
                      aria-hidden="true"
                    />
                  </div>
                  <h3 className="mt-6 font-display text-base font-bold uppercase tracking-wide">
                    {category.name}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {category.description}
                  </p>
                  <p className="mt-auto pt-6 text-xs text-muted-foreground">
                    {`${count} ${pluralize(count, ['площадка', 'площадки', 'площадок'])}`}
                  </p>
                </Link>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}

