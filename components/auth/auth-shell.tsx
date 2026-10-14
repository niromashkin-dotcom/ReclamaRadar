export function AuthShell({
  title,
  subtitle,
  children,
}: {
  title: string
  subtitle: string
  children: React.ReactNode
}) {
  return (
    <main className="mx-auto flex max-w-md flex-col px-4 py-14 md:py-20">
      <h1 className="font-display text-3xl font-extrabold uppercase tracking-tight">{title}</h1>
      <p className="mt-3 leading-relaxed text-muted-foreground">{subtitle}</p>
      <div className="mt-8 rounded-2xl border border-border bg-card p-6 md:p-8">{children}</div>
    </main>
  )
}
