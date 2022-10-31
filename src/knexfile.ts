import dotenv from 'dotenv'
import path from 'path'
import Knex from 'knex'

dotenv.config({
  path: path.resolve('../.env')
})

const config: Knex.Config = {
  client: process.env.DB_CLIENT || 'mysql',
  connection: {
    host: process.env.DB_HOST || '127.0.0.1',
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '123',
    database: process.env.DB_NAME || '',
    charset: process.env.DB_CHARSET || 'utf8'
  },
  pool: {
    min: Number(process.env.DB_POOL_MIN) || 2,
    max: Number(process.env.DB_POOL_MAX) || 10
  },
  migrations: {
    tableName: process.env.DB_MIGRATION_TABLE || '_migrations',
    directory: process.env.DB_MIGRATION_DIRECTORY || 'migrations',
    stub: process.env.DB_MIGRATION_STUB || 'migrations/.stub',
    extension: 'ts'
  },
  seeds: {
    directory: process.env.DB_SEED_DIRECTORY || 'seeds',
    extension: 'ts'
  },
  debug: process.env.DB_DEBUG === 'true' || false,
  acquireConnectionTimeout: 10000
}

export = config
