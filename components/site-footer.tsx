import Link from 'next/link'

export function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-10 md:flex-row md:justify-between md:px-6">
        <div className="max-w-sm">
          <p className="font-display text-sm font-bold uppercase tracking-[0.18em]">
            Реклама<span className="text-primary">Радар</span>
          </p>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Справочник и подбор рекламных площадок для бизнеса. Цены ориентировочные — точные
            условия уточняйте на сайте площадки. Мы не являемся исполнителем рекламы.
          </p>
        </div>
        <nav aria-label="Документы" className="flex flex-col gap-2 text-sm">
          <span className="eyebrow mb-1">Документы</span>
          <Link href="/legal/terms" className="text-muted-foreground hover:text-foreground">
            Пользовательское соглашение
          </Link>
          <Link href="/legal/privacy" className="text-muted-foreground hover:text-foreground">
            Политика конфиденциальности
          </Link>
          <Link href="/legal/consent" className="text-muted-foreground hover:text-foreground">
            Согласие на обработку данных
          </Link>
        </nav>
      </div>
      <div className="border-t border-border">
        <p className="mx-auto max-w-6xl px-4 py-4 text-xs text-muted-foreground md:px-6">
          {`© ${new Date().getFullYear()} РекламаРадар`}
        </p>
      </div>
    </footer>
  )
}
