export function PlatformsStrip({ names }: { names: string[] }) {
  return (
    <section aria-label="Площадки в каталоге" className="border-y border-border py-8">
      <p className="text-center eyebrow">Уже в каталоге</p>
      <ul className="mx-auto mt-6 flex max-w-6xl flex-wrap justify-center gap-x-10 gap-y-4 px-4">
        {names.map((name) => (
          <li
            key={name}
            className="font-display text-sm font-bold uppercase tracking-[0.12em] text-muted-foreground"
          >
            {name}
          </li>
        ))}
      </ul>
    </section>
  )
}
