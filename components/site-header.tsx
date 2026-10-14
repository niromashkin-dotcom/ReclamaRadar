import Link from 'next/link'
import { getSession } from '@/lib/session'
import { ButtonLink } from '@/components/button-link'
import { SignOutButton } from '@/components/sign-out-button'
import { MobileNav } from '@/components/mobile-nav'

export async function SiteHeader() {
  const session = await getSession()
  const isAdmin = (session?.user as { role?: string } | undefined)?.role === 'admin'

  const links = [
    { href: '/catalog', label: 'Каталог' },
    ...(session ? [{ href: '/recommendations', label: 'Мой подбор' }] : []),
    ...(session ? [{ href: '/dashboard', label: 'Кабинет' }] : []),
    ...(isAdmin ? [{ href: '/admin', label: 'Админка' }] : []),
  ]

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 md:px-6">
        <Link href="/" className="font-display text-sm font-bold uppercase tracking-[0.18em]">
          Реклама<span className="text-primary">Радар</span>
        </Link>

        <nav aria-label="Основная навигация" className="hidden items-center gap-6 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {session ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-sm">
                <span className="font-medium text-foreground">
                  {session.user.name || session.user.email.split('@')[0]}
                </span>
                {isAdmin && (
                  <Link
                    href="/admin"
                    className="inline-flex items-center gap-1 rounded-full border border-primary/40 bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary transition-colors hover:bg-primary/20"
                  >
                    Админ
                  </Link>
                )}
              </div>
              <SignOutButton />
            </div>
          ) : (
            <>
              <ButtonLink href="/sign-in" variant="ghost" size="lg" className="px-4">
                Войти
              </ButtonLink>
              <ButtonLink href="/sign-up" size="lg" className="rounded-full px-5">
                Подобрать рекламу
              </ButtonLink>
            </>
          )}
        </div>

        <MobileNav links={links} isSignedIn={Boolean(session)} />
      </div>
    </header>
  )
}
