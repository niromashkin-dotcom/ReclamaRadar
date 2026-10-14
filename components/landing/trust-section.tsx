import { TRUST_STATUSES, type TrustStatus } from '@/lib/constants'
import { TrustBadge } from '@/components/trust-badge'
import { SectionHeading } from '@/components/section-heading'

export function TrustSection() {
  return (
    <section className="border-t border-border">
      <div className="mx-auto grid max-w-6xl gap-12 px-4 py-20 md:grid-cols-2 md:px-6 md:py-28">
        <SectionHeading
          eyebrow="Честность"
          title="Мы не выдумываем цифры"
          description="Цены берём с официальных сайтов и помечаем дату обновления. Результаты показываем только из реальных отзывов и кейсов. Каждая площадка имеет статус проверки."
        />
        <ul className="flex flex-col gap-3">
          {(Object.keys(TRUST_STATUSES) as TrustStatus[]).map((key) => (
            <li key={key} className="rounded-2xl border border-border bg-card p-5">
              <TrustBadge status={key} />
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {TRUST_STATUSES[key].description}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
