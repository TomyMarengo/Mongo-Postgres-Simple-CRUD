const express = require('express')
const cors = require('cors')
const app = express()
const port = process.env.PORT || 3000

const clientRoutes = require('./clients')
const productRoutes = require('./products')
const viewsRoutes = require('./views')
const queriesRoutes = require('./queries')

app.use(cors())

app.use(express.json())

app.use('/clients', clientRoutes)
app.use('/products', productRoutes)
app.use('/views', viewsRoutes)
app.use('/queries', queriesRoutes)

app.listen(port, () => {
  console.log(`API listening in ${port}`)
})
