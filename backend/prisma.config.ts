import 'dotenv/config'
import { defineConfig, env } from 'prisma/config'

const environment = process.env.PRISMA_ENV
const generatingClient = process.argv.includes('generate')

if (!generatingClient && environment !== 'dev' && environment !== 'prod') {
	throw new Error('Select a Prisma environment with npm run prisma-dev or npm run prisma-prod')
}

const databaseUrlVariable = environment === 'dev' ? 'DATABASE_URL_DEV' : 'DATABASE_URL_PROD'

export default defineConfig({
	schema: 'prisma/schema.prisma',
	...(generatingClient ? {} : {
		datasource: {
			url: env(databaseUrlVariable)
		}
	})
})