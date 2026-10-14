import { ButtonLink } from '@/components/button-link'

export function FinalCta() {
  return (
    <section className="border-t border-border">
      <div className="mx-auto max-w-6xl px-4 py-20 md:px-6 md:py-28">
        <div className="relative overflow-hidden rounded-3xl border border-primary/30 bg-card px-6 py-14 text-center md:px-12">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 -bottom-32 mx-auto h-64 max-w-xl rounded-full bg-primary/20 blur-3xl"
          />
          <h2 className="relative font-display text-3xl font-extrabold uppercase leading-tight tracking-tight text-balance md:text-5xl">
            Хватит тыкаться <span className="text-primary">в пустоту</span>
          </h2>
          <p className="relative mx-auto mt-4 max-w-lg leading-relaxed text-muted-foreground">
            Заполните анкету и получите подбор рекламных площадок под ваш бизнес. Бесплатно.
          </p>
          <ButtonLink
            href="/sign-up"
            size="lg"
            className="relative mt-8 h-12 rounded-full px-8 text-sm font-semibold"
          >
            Начать подбор
          </ButtonLink>
        </div>
      </div>
    </section>
  )
}
