import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import * as schema from './schema'
import { categories, providers, user } from './schema'
import { eq } from 'drizzle-orm'

async function seed() {
  console.log('🌱 Starting database seed...')
  const sql = neon(process.env.DATABASE_URL!)
  const db = drizzle(sql, { schema })

  // 1. Categories
  const CATEGORIES = [
    { slug: 'context', name: 'Контекстная реклама', description: 'Объявления в поиске и на сайтах-партнёрах. Платите за клики, бюджет управляется аукционом.', kind: 'online', sortOrder: 1 },
    { slug: 'social', name: 'Таргет в соцсетях', description: 'Реклама во ВКонтакте, Одноклассниках и других соцсетях с настройкой по интересам и гео.', kind: 'online', sortOrder: 2 },
    { slug: 'local', name: 'Карты и локальный поиск', description: 'Карточка бизнеса и приоритет на картах — то, что находят люди рядом.', kind: 'online', sortOrder: 3 },
    { slug: 'classifieds', name: 'Доски объявлений', description: 'Продвижение объявлений и услуг на площадках, где уже ищут покупку.', kind: 'online', sortOrder: 4 },
    { slug: 'telegram', name: 'Telegram-каналы', description: 'Посевы в тематических и городских каналах, официальная реклама Telegram.', kind: 'online', sortOrder: 5 },
    { slug: 'bloggers', name: 'Блогеры и инфлюенсеры', description: 'Биржи блогеров: интеграции, обзоры, оплата за результат.', kind: 'online', sortOrder: 6 },
    { slug: 'services', name: 'Кабинеты и агрегаторы', description: 'Сервисы, которые объединяют рекламные кабинеты и дают бонусы и автоматизацию.', kind: 'online', sortOrder: 7 },
    { slug: 'agencies', name: 'Агентства и фрилансеры', description: 'Где найти и сравнить подрядчиков, которые всё настроят за вас.', kind: 'online', sortOrder: 8 },
    { slug: 'outdoor', name: 'Наружная реклама', description: 'Щиты, билборды, цифровые экраны в городе.', kind: 'offline', sortOrder: 9 },
  ]

  for (const cat of CATEGORIES) {
    await db
      .insert(categories)
      .values(cat)
      .onConflictDoUpdate({ target: categories.slug, set: cat })
  }
  console.log(`✅ ${CATEGORIES.length} categories seeded.`)

  const allCats = await db.select().from(categories)
  const catMap = new Map(allCats.map((c) => [c.slug, c.id]))

  // 2. Providers (17 platforms)
  const PROVIDERS = [
    {
      slug: '2gis',
      name: '2ГИС Реклама',
      categoryId: catMap.get('local')!,
      kind: 'online',
      shortDescription: 'Приоритетное размещение в справочнике и на картах 2ГИС.',
      description: 'Карточки компаний в 2ГИС с кнопками действия (позвонить, маршрут, сайт), брендовыми иконками на карте и показами в рубриках.',
      howItWorks: 'Пользователи ищут услуги рядом в приложении 2ГИС. Ваша компания поднимается на первые позиции в выдаче рубрики.',
      websiteUrl: 'https://reklama.2gis.ru',
      priceFrom: 2000,
      priceUnit: 'в месяц',
      minBudget: 2000,
      trustStatus: 'official',
      niches: ['cafe', 'beauty', 'auto', 'medical', 'fitness', 'retail', 'services'],
      cities: ['Казань', 'Москва', 'Санкт-Петербург', 'Екатеринбург', 'Новосибирск', 'Нижний Новгород'],
      goals: ['leads', 'awareness'],
      pros: ['Горячий локальный спрос', 'Высокая конверсия в звонки и маршруты'],
      cons: ['Подходит в основном для офлайн-точек'],
    },
    {
      slug: 'yandex-business',
      name: 'Яндекс Бизнес',
      categoryId: catMap.get('local')!,
      kind: 'online',
      shortDescription: 'Продвижение локального бизнеса: Карты, Поиск, Директ в одном тарифе.',
      description: 'Рекламная подписка Яндекса автоматически создает объявления и запускает их на Картах, в Поиске и в РСЯ.',
      howItWorks: 'Указываете адрес и ссылку на сайт/соцсети, система сама подбирает площадки и приводит клиентов.',
      websiteUrl: 'https://business.yandex.ru',
      priceFrom: 3000,
      priceUnit: 'в месяц',
      minBudget: 3000,
      trustStatus: 'official',
      niches: ['cafe', 'beauty', 'auto', 'medical', 'fitness', 'retail', 'services'],
      cities: [],
      goals: ['leads', 'sales'],
      pros: ['Автоматическая настройка без маркетолога', 'Охватывает сразу Карты и Поиск'],
      cons: ['Меньше контроля над ставками и минус-словами'],
    },
    {
      slug: 'yandex-direct',
      name: 'Яндекс Директ',
      categoryId: catMap.get('context')!,
      kind: 'online',
      shortDescription: 'Реклама в поиске Яндекса и Рекламной сети — самый большой охват в Рунете.',
      description: 'Контекстная и медийная реклама с оплатой за клики или целевые действия (конверсии).',
      howItWorks: 'Объявления показываются тем, кто прямо сейчас ищет ваш товар или услугу в Яндексе или на сайтах-партнерах.',
      websiteUrl: 'https://direct.yandex.ru',
      priceFrom: 10000,
      priceUnit: 'в месяц',
      minBudget: 3000,
      trustStatus: 'official',
      niches: [],
      cities: [],
      goals: ['leads', 'sales', 'awareness'],
      pros: ['Максимальный охват платежеспособной аудитории', 'Оплата за результат'],
      cons: ['Высокая конкуренция в горячих нишах'],
    },
    {
      slug: 'vk-ads',
      name: 'VK Реклама',
      categoryId: catMap.get('social')!,
      kind: 'online',
      shortDescription: 'Таргет во ВКонтакте, Одноклассниках, Дзене и проектах VK.',
      description: 'Единая платформа таргетированной рекламы с умными алгоритмами оптимизации.',
      howItWorks: 'Показ рекламы по интересам, сообществам конкурентов, номерам телефонов и поведению пользователей.',
      websiteUrl: 'https://ads.vk.com',
      priceFrom: 5000,
      priceUnit: 'в месяц',
      minBudget: 1000,
      trustStatus: 'official',
      niches: [],
      cities: [],
      goals: ['followers', 'leads', 'sales', 'awareness'],
      pros: ['Глубокий таргетинг на локальные группы', 'Широкая аудитория всех возрастов'],
      cons: ['Требует качественных визуальных креативов'],
    },
    {
      slug: 'avito',
      name: 'Авито для бизнеса',
      categoryId: catMap.get('classifieds')!,
      kind: 'online',
      shortDescription: 'Продвижение объявлений и услуг на крупнейшей доске объявлений.',
      description: 'Тарифы для бизнеса, брендированные страницы, продвижение объявлений в топ выдачи.',
      howItWorks: 'Миллионы пользователей ежедневно ищут товары, ремонт, автоуслуги и недвижимость на Авито.',
      websiteUrl: 'https://www.avito.ru/business',
      priceFrom: 1000,
      priceUnit: 'в месяц',
      minBudget: 500,
      trustStatus: 'official',
      niches: ['auto', 'services', 'realty', 'retail', 'b2b'],
      cities: [],
      goals: ['leads', 'sales'],
      pros: ['Пользователи с готовым намерением купить', 'Быстрый старт за 1 день'],
      cons: ['Подходит не для всех типов бизнеса'],
    },
    {
      slug: 'telega-in',
      name: 'Telega.in',
      categoryId: catMap.get('telegram')!,
      kind: 'online',
      shortDescription: 'Биржа рекламы в Telegram-каналах с безопасной сделкой.',
      description: 'Каталог из более чем 10 000 проверенных каналов с открытой аналитикой и авто-маркировкой рекламы.',
      howItWorks: 'Выбираете тематические или городские каналы, загружаете пост, биржа гарантирует выход публикации.',
      websiteUrl: 'https://telega.in',
      priceFrom: 500,
      priceUnit: 'за пост',
      minBudget: 500,
      trustStatus: 'known',
      niches: [],
      cities: [],
      goals: ['followers', 'leads', 'sales'],
      pros: ['Удобный каталог с фильтром по городам', 'Автоматическая маркировка ОРД'],
      cons: ['Нужно тестировать разные каналы для нахождения связки'],
    },
    {
      slug: 'telegram-ads',
      name: 'Telegram Ads',
      categoryId: catMap.get('telegram')!,
      kind: 'online',
      shortDescription: 'Официальная реклама внутри Telegram-каналов.',
      description: 'Короткие текстовые объявления внизу публичных каналов от 1000 подписчиков без спама.',
      howItWorks: 'Таргетинг на конкретные каналы конкурентов или тематики без согласия владельца канала.',
      websiteUrl: 'https://ads.telegram.org',
      priceFrom: 30000,
      priceUnit: 'в месяц',
      minBudget: 30000,
      trustStatus: 'official',
      niches: [],
      cities: [],
      goals: ['followers', 'leads'],
      pros: ['Прямой показ в каналах конкурентов', 'Высокий CTR и доверие пользователей'],
      cons: ['Высокий порог входа по бюджету'],
    },
    {
      slug: 'getblogger',
      name: 'Getblogger',
      categoryId: catMap.get('bloggers')!,
      kind: 'online',
      shortDescription: 'Биржа блогеров: подбор, сделка и аналитика интеграций.',
      description: 'Платформа для запуска кампаний у микроблогеров с оплатой за результат или фикс.',
      howItWorks: 'Подбор блогеров с реальной вовлеченностью аудитории и защитой от накруток.',
      websiteUrl: 'https://getblogger.ru',
      priceFrom: 3000,
      priceUnit: 'за интеграцию',
      minBudget: 3000,
      trustStatus: 'known',
      niches: ['cafe', 'beauty', 'retail', 'fitness'],
      cities: [],
      goals: ['awareness', 'followers', 'sales'],
      pros: ['Живая аудитория у микроинфлюенсеров', 'Высокое доверие к рекомендациям'],
      cons: ['Необходим контроль выхода креативов'],
    },
    {
      slug: 'perfluence',
      name: 'Perfluence',
      categoryId: catMap.get('bloggers')!,
      kind: 'online',
      shortDescription: 'Блогеры с оплатой за результат — заявки и продажи.',
      description: 'CPA-маркетинг через блогеров: бизнес платит только за реальные заказы и промокоды.',
      howItWorks: 'Блогеры публикуют промокоды вашего заведения или магазина, получая комиссию за каждую продажу.',
      websiteUrl: 'https://perfluence.net',
      priceFrom: 20000,
      priceUnit: 'в месяц',
      minBudget: 20000,
      trustStatus: 'known',
      niches: ['delivery', 'retail', 'beauty', 'education'],
      cities: [],
      goals: ['sales', 'leads'],
      pros: ['Оплата за совершенную продажу (CPA)', 'Тысячи блогеров берут проект в работу'],
      cons: ['Требуется привлекательное промо-предложение'],
    },
    {
      slug: 'epicstars',
      name: 'Epicstars',
      categoryId: catMap.get('bloggers')!,
      kind: 'online',
      shortDescription: 'Биржа блогеров и рекламы в соцсетях.',
      description: 'Сотрудничество с авторами контента в Telegram, YouTube, VK.',
      howItWorks: 'Размещение заданий для авторов с быстрой модерацией и прозрачной статистикой.',
      websiteUrl: 'https://epicstars.com',
      priceFrom: 5000,
      priceUnit: 'за интеграцию',
      minBudget: 5000,
      trustStatus: 'known',
      niches: [],
      cities: [],
      goals: ['awareness', 'followers'],
      pros: ['Прозрачный рейтинг авторов', 'Безопасная сделка'],
      cons: ['Разброс в эффективности разных авторов'],
    },
    {
      slug: 'elama',
      name: 'eLama',
      categoryId: catMap.get('services')!,
      kind: 'online',
      shortDescription: 'Все рекламные кабинеты в одном окне: Директ, VK, Telegram Ads.',
      description: 'Платформа автоматизации рекламы, один счет на все каналы, закрывающие документы с НДС.',
      howItWorks: 'Пополняете единый баланс и распределяете бюджет между Директом, VK и Telegram со скидками и бонусами.',
      websiteUrl: 'https://elama.ru',
      priceFrom: 0,
      priceUnit: 'бесплатно',
      minBudget: 0,
      trustStatus: 'known',
      niches: [],
      cities: [],
      goals: ['leads', 'sales', 'awareness'],
      pros: ['Единые закрывающие документы', 'Бесплатные инструменты оптимизации'],
      cons: ['Рекламу всё равно нужно настраивать'],
    },
    {
      slug: 'click-ru',
      name: 'Click.ru',
      categoryId: catMap.get('services')!,
      kind: 'online',
      shortDescription: 'Платформа для работы с рекламными системами и маркировкой.',
      description: 'Управление контекстной и таргетированной рекламой с кэшбэком до 18% от расходов.',
      howItWorks: 'Удобный кабинет для запуска кампаний во всех системах с авто-маркировкой в ЕРИР.',
      websiteUrl: 'https://click.ru',
      priceFrom: 0,
      priceUnit: 'бесплатно',
      minBudget: 0,
      trustStatus: 'known',
      niches: [],
      cities: [],
      goals: ['leads', 'sales'],
      pros: ['Вознаграждение (кэшбэк) от рекламных бюджетов', 'Автоматизация рутины'],
      cons: ['Ориентировано на агентства и опытных специалистов'],
    },
    {
      slug: 'kwork',
      name: 'Kwork',
      categoryId: catMap.get('agencies')!,
      kind: 'online',
      shortDescription: 'Фрилансеры-маркетологи с фиксированными ценами на услуги.',
      description: 'Маркетплейс проверенных исполнителей: настройка Директа, таргета, дизайн баннеров от 500 ₽.',
      howItWorks: 'Выбираете готовый кворк с фиксированной ценой, оплачиваете после проверки работы.',
      websiteUrl: 'https://kwork.ru',
      priceFrom: 500,
      priceUnit: 'за услугу',
      minBudget: 500,
      trustStatus: 'known',
      niches: [],
      cities: [],
      goals: ['leads', 'sales', 'followers'],
      pros: ['Очень низкий порог входа', '100% гарантия возврата средств'],
      cons: ['Качество зависит от конкретного фрилансера'],
    },
    {
      slug: 'ratingruneta',
      name: 'Рейтинг Рунета',
      categoryId: catMap.get('agencies')!,
      kind: 'online',
      shortDescription: 'Рейтинг digital-агентств с кейсами и отзывами.',
      description: 'Каталог лучших агентств по контекстной рекламе, SMM и комплексному маркетингу.',
      howItWorks: 'Сравнение агентств по нишам, оборотам, отзывам клиентов и победам в конкурсах.',
      websiteUrl: 'https://ratingruneta.ru',
      priceFrom: 30000,
      priceUnit: 'в месяц',
      minBudget: 30000,
      trustStatus: 'known',
      niches: ['b2b', 'retail', 'realty', 'medical'],
      cities: [],
      goals: ['leads', 'sales', 'awareness'],
      pros: ['Только профессиональные агентства с кейсами', 'Тендерная площадка'],
      cons: ['Высокая стоимость ведения проектов'],
    },
    {
      slug: 'russ',
      name: 'Russ',
      categoryId: catMap.get('outdoor')!,
      kind: 'offline',
      shortDescription: 'Один из крупнейших операторов наружной рекламы в России.',
      description: 'Билборды 3х6, суперсайты, сити-форматы, реклама в метро, на вокзалах и в поездах по всей РФ.',
      howItWorks: 'Подбор рекламных конструкций по районам и улицам города для максимального пешеходного и авто-трафика.',
      websiteUrl: 'https://russoutdoor.ru',
      priceFrom: 30000,
      priceUnit: 'за конструкцию в месяц',
      minBudget: 30000,
      trustStatus: 'official',
      niches: ['cafe', 'beauty', 'auto', 'medical', 'fitness', 'retail', 'realty'],
      cities: ['Казань', 'Москва', 'Санкт-Петербург', 'Екатеринбург', 'Новосибирск', 'Нижний Новгород'],
      goals: ['awareness', 'leads'],
      pros: ['Огромный физический охват жителей района', 'Формирование узнаваемости бренда'],
      cons: ['Сложно точно измерить прямые конверсии'],
    },
    {
      slug: 'gallery',
      name: 'Gallery',
      categoryId: catMap.get('outdoor')!,
      kind: 'offline',
      shortDescription: 'Оператор наружной рекламы: цифровые и классические щиты.',
      description: 'Крупная сеть цифровых экранов (DOOH) с возможностью почасового выкупа показов.',
      howItWorks: 'Цифровые билборды показывают динамические ролики в часы пик с геотаргетингом.',
      websiteUrl: 'https://gallerymedia.com',
      priceFrom: 30000,
      priceUnit: 'за конструкцию в месяц',
      minBudget: 30000,
      trustStatus: 'official',
      niches: ['cafe', 'beauty', 'auto', 'medical', 'fitness', 'retail', 'realty'],
      cities: ['Казань', 'Москва', 'Санкт-Петербург', 'Екатеринбург', 'Новосибирск'],
      goals: ['awareness'],
      pros: ['Яркие цифровые экраны с высоким вниманием', 'Быстрая смена креатива'],
      cons: ['Высокий бюджет на старт'],
    },
    {
      slug: 'admetrix',
      name: 'Admetrix',
      categoryId: catMap.get('outdoor')!,
      kind: 'offline',
      shortDescription: 'Программатик-закупка цифровой наружной рекламы.',
      description: 'Платформа для умной закупки показов на цифровых щитах по модели аукциона с замером доходимости.',
      howItWorks: 'Реклама включается только тогда, когда перед экраном находится ваша целевая аудитория.',
      websiteUrl: 'https://admetrix.ru',
      priceFrom: 10000,
      priceUnit: 'за кампанию',
      minBudget: 10000,
      trustStatus: 'known',
      niches: [],
      cities: ['Москва', 'Санкт-Петербург', 'Казань', 'Екатеринбург'],
      goals: ['awareness', 'leads'],
      pros: ['Показ по аудиторным таргетингам', 'Измеримая доходимость до точек продаж'],
      cons: ['Требует понимания programmatic-закупок'],
    },
  ]

  for (const prov of PROVIDERS) {
    await db
      .insert(providers)
      .values(prov as any)
      .onConflictDoUpdate({ target: providers.slug, set: prov as any })
  }
  console.log(`✅ ${PROVIDERS.length} providers seeded.`)

  // 3. Ensure Admin User
  const adminEmail = process.env.ADMIN_EMAIL || 'niromashkin@gmail.com'
  const [existingUser] = await db
    .select()
    .from(user)
    .where(eq(user.email, adminEmail))
    .limit(1)

  if (existingUser) {
    if (existingUser.role !== 'admin') {
      await db
        .update(user)
        .set({ role: 'admin' })
        .where(eq(user.id, existingUser.id))
      console.log(`👑 User ${adminEmail} updated to role=admin.`)
    } else {
      console.log(`👑 User ${adminEmail} is already admin.`)
    }
  } else {
    console.log(`ℹ️ Admin user ${adminEmail} will automatically receive 'admin' role upon registration.`)
  }

  console.log('🎉 Seeding completed successfully!')
}

seed().catch((err) => {
  console.error('❌ Seeding error:', err)
  process.exit(1)
})
