import {
  boolean,
  integer,
  jsonb,
  pgTable,
  serial,
  text,
  timestamp,
} from 'drizzle-orm/pg-core'

export const user = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('emailVerified').notNull().default(false),
  image: text('image'),
  role: text('role').notNull().default('user'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const session = pgTable('session', {
  id: text('id').primaryKey(),
  expiresAt: timestamp('expiresAt').notNull(),
  token: text('token').notNull().unique(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
  ipAddress: text('ipAddress'),
  userAgent: text('userAgent'),
  userId: text('userId')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
})

export const account = pgTable('account', {
  id: text('id').primaryKey(),
  accountId: text('accountId').notNull(),
  providerId: text('providerId').notNull(),
  userId: text('userId')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  accessToken: text('accessToken'),
  refreshToken: text('refreshToken'),
  idToken: text('idToken'),
  accessTokenExpiresAt: timestamp('accessTokenExpiresAt'),
  refreshTokenExpiresAt: timestamp('refreshTokenExpiresAt'),
  scope: text('scope'),
  password: text('password'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const verification = pgTable('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expiresAt').notNull(),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow(),
})

export const categories = pgTable('categories', {
  id: serial('id').primaryKey(),
  slug: text('slug').notNull().unique(),
  name: text('name').notNull(),
  description: text('description').notNull().default(''),
  kind: text('kind').notNull().default('online'),
  sortOrder: integer('sort_order').notNull().default(0),
})

export const providers = pgTable('providers', {
  id: serial('id').primaryKey(),
  slug: text('slug').notNull().unique(),
  name: text('name').notNull(),
  categoryId: integer('category_id').notNull(),
  kind: text('kind').notNull().default('online'),
  shortDescription: text('short_description').notNull(),
  description: text('description').notNull().default(''),
  howItWorks: text('how_it_works').notNull().default(''),
  websiteUrl: text('website_url').notNull(),
  affiliateUrl: text('affiliate_url'),
  priceFrom: integer('price_from'),
  priceTo: integer('price_to'),
  priceUnit: text('price_unit').notNull().default('в месяц'),
  minBudget: integer('min_budget').notNull().default(0),
  reachNote: text('reach_note'),
  niches: text('niches').array().notNull().default([]),
  cities: text('cities').array().notNull().default([]),
  goals: text('goals').array().notNull().default([]),
  pros: text('pros').array().notNull().default([]),
  cons: text('cons').array().notNull().default([]),
  trustStatus: text('trust_status').notNull().default('unverified'),
  dataSource: text('data_source').notNull().default('manual'),
  sourceUrl: text('source_url'),
  priceUpdatedAt: timestamp('price_updated_at').notNull().defaultNow(),
  lastCheckedAt: timestamp('last_checked_at'),
  isReachable: boolean('is_reachable'),
  isSponsored: boolean('is_sponsored').notNull().default(false),
  adErid: text('ad_erid'),
  status: text('status').notNull().default('published'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

export const businessProfiles = pgTable('business_profiles', {
  id: serial('id').primaryKey(),
  userId: text('userId').notNull().unique(),
  businessName: text('business_name').notNull(),
  businessType: text('business_type').notNull(),
  businessSize: text('business_size').notNull().default('small'),
  city: text('city').notNull(),
  monthlyBudget: integer('monthly_budget').notNull(),
  goal: text('goal').notNull(),
  format: text('format').notNull().default('online'),
  website: text('website'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

export const reviews = pgTable('reviews', {
  id: serial('id').primaryKey(),
  userId: text('userId').notNull(),
  providerId: integer('provider_id').notNull(),
  rating: integer('rating').notNull(),
  budgetSpent: integer('budget_spent'),
  result: text('result').notNull().default(''),
  comment: text('comment').notNull(),
  businessType: text('business_type'),
  city: text('city'),
  status: text('status').notNull().default('pending'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})

export const cases = pgTable('cases', {
  id: serial('id').primaryKey(),
  providerId: integer('provider_id').notNull(),
  title: text('title').notNull(),
  businessType: text('business_type').notNull(),
  city: text('city'),
  budget: integer('budget'),
  duration: text('duration'),
  resultSummary: text('result_summary').notNull(),
  sourceUrl: text('source_url'),
  isVerified: boolean('is_verified').notNull().default(false),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})

export const clicks = pgTable('clicks', {
  id: serial('id').primaryKey(),
  providerId: integer('provider_id').notNull(),
  userId: text('userId'),
  businessType: text('business_type'),
  city: text('city'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})

export const favorites = pgTable('favorites', {
  id: serial('id').primaryKey(),
  userId: text('userId').notNull(),
  providerId: integer('provider_id').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})

export const reports = pgTable('reports', {
  id: serial('id').primaryKey(),
  userId: text('userId').notNull(),
  targetType: text('target_type').notNull(),
  targetId: integer('target_id').notNull(),
  reason: text('reason').notNull(),
  status: text('status').notNull().default('open'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})

export const consents = pgTable('consents', {
  id: serial('id').primaryKey(),
  userId: text('userId').notNull(),
  type: text('type').notNull(),
  version: text('version').notNull(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})

export const auditLog = pgTable('audit_log', {
  id: serial('id').primaryKey(),
  userId: text('userId').notNull(),
  action: text('action').notNull(),
  entity: text('entity').notNull(),
  entityId: integer('entity_id'),
  details: jsonb('details'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})

export type Provider = typeof providers.$inferSelect
export type Category = typeof categories.$inferSelect
export type BusinessProfile = typeof businessProfiles.$inferSelect
