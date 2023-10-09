const express = require('express')
const cors = require('cors')
const app = express()

const postgresClientsRoutes = require('./routers/postgres/clients')
const postgresProductsRoutes = require('./routers/postgres/products')
const postgresViewsRoutes = require('./routers/postgres/views')
const postgresQueriesRoutes = require('./routers/postgres/queries')
const mongoClientsRoutes = require('./routers/mongo/clients')
const mongoProductsRoutes = require('./routers/mongo/products')
const mongoViewsRoutes = require('./routers/mongo/views')
const mongoQueriesRoutes = require('./routers/mongo/queries')

app.use(cors())
app.use(express.json())

app.use('/postgres/clients', postgresClientsRoutes)
app.use('/postgres/products', postgresProductsRoutes)
app.use('/postgres/views', postgresViewsRoutes)
app.use('/postgres/queries', postgresQueriesRoutes)
app.use('/mongo/clients', mongoClientsRoutes)
app.use('/mongo/products', mongoProductsRoutes)
app.use('/mongo/views', mongoViewsRoutes)
app.use('/mongo/queries', mongoQueriesRoutes)

const PORT = process.env.NODE_PORT || 3000
app.listen(PORT, () => {
  console.log(`API listening in ${PORT}`)
})
