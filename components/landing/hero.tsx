import Image from 'next/image'
import { ButtonLink } from '@/components/button-link'

export function Hero({
  stats,
}: {
  stats: { providers: number; categories: number; reviews: number }
}) {
  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 top-20 size-[36rem] rounded-full bg-primary/10 blur-3xl"
      />
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-14 md:grid-cols-[1.1fr_1fr] md:px-6 md:py-24">
        <div className="relative">
          <p className="eyebrow">
            <span className="text-primary">Подбор рекламы</span> — для малого и среднего бизнеса
          </p>
          <h1 className="mt-6 font-display text-4xl font-extrabold uppercase leading-[1.02] tracking-tight text-balance md:text-6xl">
            Вся реклама для бизнеса <span className="text-primary">в одном окне</span>
          </h1>
          <p className="mt-6 max-w-lg leading-relaxed text-muted-foreground text-pretty">
            Яндекс Директ, VK Реклама, Авито, карты, Telegram, блогеры и наружка. Укажите нишу,
            город и бюджет — покажем подходящие площадки с ценами, кейсами и честным статусом
            проверки.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href="/sign-up" size="lg" className="h-12 rounded-full px-7 text-sm font-semibold">
              Подобрать бесплатно
            </ButtonLink>
            <ButtonLink
              href="/catalog"
              variant="outline"
              size="lg"
              className="h-12 rounded-full px-7 text-sm font-semibold"
            >
              Открыть каталог
            </ButtonLink>
          </div>

          <dl className="mt-10 flex flex-wrap gap-x-8 gap-y-4 border-t border-border pt-6">
            {[
              { label: 'площадок в базе', value: String(stats.providers) },
              { label: 'типов рекламы', value: String(stats.categories) },
              { label: 'для бизнеса', value: '0 ₽', accent: true },
            ].map((item) => (
              <div key={item.label} className="flex flex-col-reverse">
                <dt className="text-xs text-muted-foreground">{item.label}</dt>
                <dd
                  className={`font-display text-2xl font-bold ${item.accent ? 'text-primary' : ''}`}
                >
                  {item.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="relative mx-auto w-full max-w-md overflow-hidden rounded-3xl border border-border">
          <Image
            src="/images/hero-radar.png"
            alt="Витрина рекламных форматов: билборд, реклама в соцсетях, поиск и карты"
            width={928}
            height={1152}
            priority
            className="h-auto w-full"
          />
          <span className="absolute bottom-4 left-4 rounded-full border border-border bg-background/80 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest backdrop-blur">
            Онлайн + офлайн
          </span>
        </div>
      </div>
    </section>
  )
}
