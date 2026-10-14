import { Client } from 'pg'
import fs from 'node:fs'
import path from 'node:path'

async function runMigration() {
  const connectionString = process.env.DATABASE_URL
  if (!connectionString) {
    console.error('DATABASE_URL is not set')
    process.exit(1)
  }

  console.log('Connecting to database...')
  const client = new Client({ connectionString })
  await client.connect()
  console.log('Connected successfully.')

  const sqlPath = path.resolve(process.cwd(), 'lib/db/migrations/0000_sweet_vulture.sql')
  const sql = fs.readFileSync(sqlPath, 'utf8')

  // Split by statement breakpoint
  const statements = sql
    .split('--> statement-breakpoint')
    .map((s) => s.trim())
    .filter((s) => s.length > 0)

  console.log(`Executing ${statements.length} migration statements...`)

  for (let i = 0; i < statements.length; i++) {
    const stmt = statements[i]
    try {
      await client.query(stmt)
    } catch (err: any) {
      // Ignore if table/constraint already exists
      if (err.code === '42P07' || err.code === '42710') {
        console.log(`Statement ${i + 1} skipped (already exists).`)
      } else {
        console.error(`Error on statement ${i + 1}:`, err.message)
        throw err
      }
    }
  }

  console.log('Migration completed successfully!')
  await client.end()
}

runMigration().catch((err) => {
  console.error('Migration failed:', err)
  process.exit(1)
})
