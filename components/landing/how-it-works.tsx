import { ClipboardList, Sparkles, LayoutGrid, MessageSquareText } from 'lucide-react'
import { SectionHeading } from '@/components/section-heading'

const STEPS = [
  {
    icon: ClipboardList,
    title: 'Анкета за 2 минуты',
    text: 'Тип бизнеса, город, бюджет и цель: заявки, продажи, подписчики или узнаваемость.',
  },
  {
    icon: Sparkles,
    title: 'Персональный подбор',
    text: 'Отбираем площадки, которые подходят по нише, бюджету и цели, и объясняем почему.',
  },
  {
    icon: LayoutGrid,
    title: 'Сравнение в одном месте',
    text: 'Цены, минимальный бюджет, как это работает, кейсы и статус проверки — в каждой карточке.',
  },
  {
    icon: MessageSquareText,
    title: 'Отзывы реальных бизнесов',
    text: 'После размещения оставьте отзыв — так подбор становится точнее для всех.',
  },
]

export function HowItWorks() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-20 md:px-6 md:py-28">
      <SectionHeading
        eyebrow="Как это работает"
        title="От анкеты до площадки"
        description="Больше не нужно часами открывать сайты агентств и бирж. Собрали всё в одну понятную витрину."
      />
      <ol className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {STEPS.map((step, i) => (
          <li key={step.title} className="border-t border-border pt-6">
            <span className="flex size-10 items-center justify-center rounded-xl border border-border">
              <step.icon className="size-4 text-primary" aria-hidden="true" />
            </span>
            <p className="mt-5 eyebrow text-primary">{`Шаг 0${i + 1}`}</p>
            <h3 className="mt-2 font-display text-sm font-bold uppercase tracking-wide">
              {step.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.text}</p>
          </li>
        ))}
      </ol>
    </section>
  )
}
