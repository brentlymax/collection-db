import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { PrismaMariaDb } from '@prisma/adapter-mariadb'
import { PrismaClient } from '@prisma/client'

const app = express()
const port = 3000
const databaseUrlValue = process.env.DATABASE_URL_BACKEND

if (!databaseUrlValue) {
	throw new Error('DATABASE_URL_BACKEND is required')
}

const databaseUrl = new URL(databaseUrlValue)
const adapter = new PrismaMariaDb({
	host: databaseUrl.hostname,
	port: Number(databaseUrl.port || 3306),
	user: decodeURIComponent(databaseUrl.username),
	password: decodeURIComponent(databaseUrl.password),
	database: databaseUrl.pathname.slice(1)
})
const prisma = new PrismaClient({ adapter })

app.use(express.json())
app.use(cors())

app.get('/', (req, res) => {
	res.send('Hello from the B-Man!')
})

app.get('/api/comics/graded', async (req, res) => {
	const gradedComicData = await prisma.graded_comics.findMany()
	res.json(gradedComicData)
})

app.listen(port, () => {
	console.log(`Server is listening at port: ${port}`)
})
