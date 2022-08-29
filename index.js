const connectToMongo = require('./db')
const express = require('express')

connectToMongo()

const app = express()
const port = 5000

app.use(express.json())

// app.get('/', (req, res) => {
//   res.send('Hello prince your express work')
// })

app.use('/api/auth' , require ('./routes/auth'))
app.use('/api/notes' , require ('./routes/notes'))

app.listen(port, () => {
  console.log(`app listening on port http://localhost:${port}`)
})