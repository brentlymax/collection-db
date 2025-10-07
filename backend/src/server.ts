import express from 'express'

const app = express()
const port = 3000
const host = '0.0.0.0'

app.get('/', (req, res) => {
	res.send('Hello from the B-Man!')
})

app.get('/test/data', (req, res) => {
	res.send('Test data')
})

app.listen(port, host, () => {
	console.log(`Server is listening at http://${host}:${port}`)
})
