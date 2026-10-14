'use client'

import { useTransition } from 'react'
import { resolveReport } from '@/app/actions'
import { Button } from '@/components/ui/button'

export function ResolveReportButton({ reportId }: { reportId: number }) {
  const [pending, startTransition] = useTransition()
  return (
    <Button
      size="lg"
      variant="outline"
      disabled={pending}
      className="mt-4 rounded-full px-4"
      onClick={() => startTransition(() => resolveReport(reportId))}
    >
      Отметить решённой
    </Button>
  )
}
