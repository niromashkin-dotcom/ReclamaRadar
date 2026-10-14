import 'server-only'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'

export async function getSession() {
  try {
    return await auth.api.getSession({ headers: await headers() })
  } catch {
    return null
  }
}

export async function requireUser() {
  const session = await getSession()
  if (!session?.user) redirect('/sign-in')
  return session.user
}

export async function requireAdmin() {
  const user = await requireUser()
  const isAdmin =
    (user as { role?: string }).role === 'admin' ||
    user.email === 'niromashkin@gmail.com' ||
    (process.env.ADMIN_EMAIL && user.email === process.env.ADMIN_EMAIL)
  if (!isAdmin) redirect('/')
  return user
}

export async function getUserIdOrThrow() {
  const session = await getSession()
  if (!session?.user) throw new Error('Unauthorized')
  return session.user.id
}

export async function getAdminIdOrThrow() {
  const session = await getSession()
  const isAdmin =
    (session?.user as { role?: string })?.role === 'admin' ||
    session?.user?.email === 'niromashkin@gmail.com' ||
    (process.env.ADMIN_EMAIL && session?.user?.email === process.env.ADMIN_EMAIL)
  if (!session?.user || !isAdmin) {
    throw new Error('Forbidden')
  }
  return session.user.id
}
