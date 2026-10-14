export function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string
  title: string
  description?: string
}) {
  return (
    <div className="max-w-2xl">
      <span className="inline-flex rounded-full border border-border px-4 py-1.5 eyebrow">
        {eyebrow}
      </span>
      <h2 className="mt-5 font-display text-3xl font-bold uppercase leading-[1.05] tracking-tight text-balance md:text-5xl">
        {title}
      </h2>
      {description && (
        <p className="mt-4 leading-relaxed text-muted-foreground text-pretty">{description}</p>
      )}
    </div>
  )
}
