import type { FormState } from '@/app/actions'

export function FormMessage({ state }: { state: FormState }) {
  if (state.error) {
    return (
      <p role="alert" className="text-sm text-destructive">
        {state.error}
      </p>
    )
  }
  if (state.message) {
    return (
      <p role="status" className="text-sm text-primary">
        {state.message}
      </p>
    )
  }
  return null
}
