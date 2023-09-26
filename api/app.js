const express = require('express')
const cors = require('cors')
const app = express()
const port = process.env.PORT || 3000

const clientRoutes = require('./client')
const productRoutes = require('./product')

app.use(cors())

app.use(express.json())

app.use('/clients', clientRoutes)
app.use('/products', productRoutes)

app.listen(port, () => {
  console.log(`API listening in ${port}`)
})
