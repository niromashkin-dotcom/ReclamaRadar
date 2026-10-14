export function ChoiceGroup({
  legend,
  name,
  options,
  defaultValue,
  required,
}: {
  legend: string
  name: string
  options: { value: string; label: string; hint?: string }[]
  defaultValue?: string
  required?: boolean
}) {
  return (
    <fieldset>
      <legend className="text-sm font-medium">{legend}</legend>
      <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {options.map((o) => (
          <label
            key={o.value}
            className="flex cursor-pointer flex-col rounded-xl border border-border bg-card p-4 transition-colors hover:border-foreground/30 has-[:checked]:border-primary has-[:checked]:bg-primary/10 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring"
          >
            <input
              type="radio"
              name={name}
              value={o.value}
              defaultChecked={defaultValue === o.value}
              required={required}
              className="sr-only"
            />
            <span className="text-sm font-semibold">{o.label}</span>
            {o.hint && <span className="mt-1 text-xs text-muted-foreground">{o.hint}</span>}
          </label>
        ))}
      </div>
    </fieldset>
  )
}
