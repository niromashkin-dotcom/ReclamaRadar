'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SignOutButton } from '@/components/sign-out-button'
import { ButtonLink } from '@/components/button-link'

export function MobileNav({
  links,
  isSignedIn,
}: {
  links: { href: string; label: string }[]
  isSignedIn: boolean
}) {
  const [open, setOpen] = useState(false)

  return (
    <div className="md:hidden">
      <Button
        variant="ghost"
        size="icon"
        aria-label={open ? 'Закрыть меню' : 'Открыть меню'}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        {open ? <X className="size-5" /> : <Menu className="size-5" />}
      </Button>
      {open && (
        <div className="absolute inset-x-0 top-16 border-b border-border bg-background px-4 pb-6 pt-2">
          <nav aria-label="Мобильная навигация" className="flex flex-col">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="border-b border-border py-3 text-base"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="mt-4 flex flex-col gap-2">
            {isSignedIn ? (
              <SignOutButton />
            ) : (
              <>
                <ButtonLink
                  href="/sign-up"
                  size="lg"
                  className="h-11 rounded-full"
                  onClick={() => setOpen(false)}
                >
                  Подобрать рекламу
                </ButtonLink>
                <ButtonLink
                  href="/sign-in"
                  variant="outline"
                  size="lg"
                  className="h-11 rounded-full"
                  onClick={() => setOpen(false)}
                >
                  Войти
                </ButtonLink>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
