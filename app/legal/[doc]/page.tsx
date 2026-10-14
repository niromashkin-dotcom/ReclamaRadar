import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { LEGAL_DOCS, LEGAL_VERSION } from '@/lib/legal'
import { formatDate } from '@/lib/constants'

type Params = Promise<{ doc: string }>

export function generateStaticParams() {
  return Object.keys(LEGAL_DOCS).map((doc) => ({ doc }))
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { doc } = await params
  return { title: LEGAL_DOCS[doc]?.title ?? 'Документ' }
}

export default async function LegalPage({ params }: { params: Params }) {
  const { doc } = await params
  const content = LEGAL_DOCS[doc]
  if (!content) notFound()

  return (
    <main className="mx-auto max-w-3xl px-4 py-12 md:py-16">
      <p className="eyebrow">Документы</p>
      <h1 className="mt-3 font-display text-2xl font-extrabold uppercase tracking-tight text-balance md:text-4xl">
        {content.title}
      </h1>
      <p className="mt-3 text-sm text-muted-foreground">{`Редакция от ${formatDate(LEGAL_VERSION)}`}</p>
      <div className="mt-10 flex flex-col gap-8">
        {content.sections.map((section) => (
          <section key={section.heading}>
            <h2 className="font-display text-sm font-bold uppercase tracking-wide">{section.heading}</h2>
            <div className="mt-3 flex flex-col gap-3">
              {section.body.map((p) => (
                <p key={p} className="leading-relaxed text-muted-foreground">
                  {p}
                </p>
              ))}
            </div>
          </section>
        ))}
      </div>
    </main>
  )
}
