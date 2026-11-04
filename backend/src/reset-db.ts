import 'dotenv/config'
import { PrismaMariaDb } from '@prisma/adapter-mariadb'
import { PrismaClient } from '@prisma/client'

async function main() {
	const [target, environment, ...options] = process.argv.slice(2)
	const dryRun = options.includes('--dry-run')

	if (target !== 'comics' && target !== 'users') {
		throw new Error('Choose a reset target: comics or users')
	}
	if (environment !== 'dev' && environment !== 'prod') {
		throw new Error('Choose a reset environment: dev or prod')
	}
	if (options.some(option => option !== '--dry-run' && option !== '--confirm')) {
		throw new Error('Supported options: --dry-run, --confirm')
	}
	if (!dryRun && !options.includes('--confirm')) {
		throw new Error('This deletes data. Review --dry-run, then pass --confirm to proceed')
	}

	const databaseUrlVariable = environment === 'dev' ? 'DATABASE_URL_DEV' : 'DATABASE_URL_PROD'
	const databaseUrlValue = process.env[databaseUrlVariable]
	if (!databaseUrlValue) {
		throw new Error(`${databaseUrlVariable} is required`)
	}

	let databaseUrl: URL
	try {
		databaseUrl = new URL(databaseUrlValue)
	} catch {
		throw new Error(`${databaseUrlVariable} must be a valid MySQL URL`)
	}
	if (databaseUrl.protocol !== 'mysql:' || databaseUrl.pathname.length <= 1) {
		throw new Error(`${databaseUrlVariable} must specify a MySQL database`)
	}

	const tables = target === 'comics' ? 'graded_comics' : 'session, account, verification, user'
	console.log(`Target (${environment}, ${databaseUrlVariable}): ${databaseUrl.host}${databaseUrl.pathname}`)
	console.log(`Delete all rows from: ${tables}`)
	if (dryRun) {
		console.log('Dry run only. No database connection or changes made')
		return
	}

	const adapter = new PrismaMariaDb({
		host: databaseUrl.hostname,
		port: Number(databaseUrl.port || 3306),
		user: decodeURIComponent(databaseUrl.username),
		password: decodeURIComponent(databaseUrl.password),
		database: databaseUrl.pathname.slice(1)
	})
	const prisma = new PrismaClient({ adapter })
	try {
		if (target === 'comics') {
			await prisma.gradedComic.deleteMany()
		} else {
			await prisma.$transaction([
				prisma.session.deleteMany(),
				prisma.account.deleteMany(),
				prisma.verification.deleteMany(),
				prisma.user.deleteMany()
			])
		}
		console.log(`Reset complete: ${target} (${environment}). Tables were preserved`)
	} catch {
		throw new Error('Reset failed. Check database connectivity, schema, and foreign keys')
	} finally {
		await prisma.$disconnect()
	}
}

main().catch((error: unknown) => {
	console.error(error instanceof Error ? error.message : 'Reset failed')
	process.exitCode = 1
})