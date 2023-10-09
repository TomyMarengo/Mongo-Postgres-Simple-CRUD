// mongoConfig.js
const mongoose = require('mongoose')

// Realiza la conexión a MongoDB
mongoose.connect('mongodb://mongo:27017/tpo-marengo', { useNewUrlParser: true, useUnifiedTopology: true })

// Maneja eventos de conexión y errores
const db = mongoose.connection

db.on('error', console.error.bind(console, 'Error connecting to MongoDB:'))
db.once('open', () => {
  console.log('Connected to MongoDB!')
})

// disconnect from database when app is closed
process.on('SIGINT', () => {
  mongoose.disconnect()
  process.exit(0)
})

// Exporta la conexión para usarla en otros archivos
module.exports = db
