import express from 'express'
import cors from 'cors'
import { PrismaClient } from '@prisma/client'

const app = express()
const port = 3000
const prisma = new PrismaClient()

app.use(express.json())
app.use(cors())

app.get('/', (req, res) => {
	res.send('Hello from the B-Man!')
})

app.get('/comics/graded', async (req, res) => {
	const gradedComicData = await prisma.comics_graded.findMany()
	res.json(gradedComicData)
})

app.listen(port, () => {
	console.log(`Server is listening at port: ${port}`)
})
