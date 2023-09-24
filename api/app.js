const express = require('express')
const cors = require('cors');
const app = express()
const port = process.env.PORT || 3000

const clientRoutes = require('./client')

app.use(cors())

app.use(express.json())

app.use('/clientes', clientRoutes)

app.listen(port, () => {
  console.log(`API escuchando en el puerto ${port}`)
})
