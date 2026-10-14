export const SITE_NAME = 'РекламаРадар'

export const NICHES = [
  { value: 'cafe', label: 'Кафе, кофейня, ресторан' },
  { value: 'beauty', label: 'Салон красоты, барбершоп' },
  { value: 'auto', label: 'Автосервис, автотовары' },
  { value: 'medical', label: 'Медицина, стоматология' },
  { value: 'fitness', label: 'Фитнес, спорт' },
  { value: 'retail', label: 'Магазин, розница' },
  { value: 'delivery', label: 'Доставка еды и товаров' },
  { value: 'education', label: 'Обучение, курсы' },
  { value: 'services', label: 'Услуги для людей' },
  { value: 'realty', label: 'Недвижимость, ремонт' },
  { value: 'b2b', label: 'B2B, услуги для бизнеса' },
] as const

export const GOALS = [
  { value: 'leads', label: 'Заявки и звонки' },
  { value: 'sales', label: 'Продажи онлайн' },
  { value: 'followers', label: 'Подписчики в соцсетях' },
  { value: 'awareness', label: 'Узнаваемость бренда' },
] as const

export const FORMATS = [
  { value: 'online', label: 'Онлайн', hint: 'Интернет, соцсети, блогеры' },
  { value: 'offline', label: 'Офлайн', hint: 'Щиты, экраны, наружка' },
  { value: 'hybrid', label: 'Гибрид', hint: 'И то, и другое' },
] as const

export const SIZES = [
  { value: 'micro', label: 'Микро', hint: 'до 5 сотрудников' },
  { value: 'small', label: 'Малый', hint: '5–50 сотрудников' },
  { value: 'medium', label: 'Средний', hint: '50+ сотрудников' },
] as const

export const CITIES = [
  'Москва',
  'Санкт-Петербург',
  'Казань',
  'Екатеринбург',
  'Новосибирск',
  'Нижний Новгород',
  'Краснодар',
  'Самара',
  'Ростов-на-Дону',
  'Уфа',
  'Другой город',
] as const

export const TRUST_STATUSES = {
  official: {
    label: 'Официальная платформа',
    description: 'Рекламный продукт крупной компании. Данные взяты с официального сайта.',
    tone: 'accent',
  },
  verified: {
    label: 'Проверено нами',
    description: 'Мы связались с площадкой и подтвердили информацию.',
    tone: 'accent',
  },
  known: {
    label: 'Известный сервис',
    description: 'Работающий сервис с публичной историей. Условия смотрите на сайте площадки.',
    tone: 'neutral',
  },
  unverified: {
    label: 'Не проверено',
    description: 'Мы не проверяли эту площадку. Размещайтесь на свой страх и риск.',
    tone: 'warning',
  },
} as const

export type TrustStatus = keyof typeof TRUST_STATUSES

export const DOCS_VERSION = '2026-10-14'

export function labelOf<T extends readonly { value: string; label: string }[]>(
  list: T,
  value: string | null | undefined,
) {
  return list.find((item) => item.value === value)?.label ?? value ?? ''
}

const rub = new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 0 })

export function formatRub(value: number) {
  return `${rub.format(value)} ₽`
}

export function formatPrice(from: number | null, to: number | null, unit: string) {
  if (!from && !to) return unit === 'бесплатно' ? 'Бесплатно' : 'Цена по запросу'
  if (from && to && to > from) return `${formatRub(from)} – ${formatRub(to)} ${unit}`
  return `от ${formatRub(from ?? to ?? 0)} ${unit}`
}

export function formatDate(date: Date | string | null) {
  if (!date) return '—'
  return new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(date))
}

export function pluralize(n: number, forms: [string, string, string]): string {
  const abs = Math.abs(n) % 100
  const rem = abs % 10
  if (abs > 10 && abs < 20) return forms[2]
  if (rem > 1 && rem < 5) return forms[1]
  if (rem === 1) return forms[0]
  return forms[2]
}

