const express = require('express')
const { Pool } = require('pg')
const app = express()
const port = process.env.PORT || 3000

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'tpo',
  password: '1234',
  port: 5432
})

app.use(express.json())

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('¡API en funcionamiento!')
})

// Obtener todos los clientes
app.get('/clientes', async (req, res) => {
  try {
    const client = await pool.connect()
    const result = await client.query('SELECT * FROM e01_cliente')
    const clientes = result.rows
    client.release()
    res.json(clientes)
  } catch (error) {
    console.error('Error al obtener clientes:', error)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
})

// Agregar un nuevo cliente
app.post('/clientes', async (req, res) => {
  const { nombre, apellido, direccion, activo } = req.body
  if (!nombre || !apellido || !direccion || !activo) {
    return res.status(400).json({ error: 'Se requieren todos los campos' })
  }

  try {
    const client = await pool.connect()
    const result = await client.query('INSERT INTO e01_cliente (nombre, apellido, direccion, activo) VALUES ($1, $2, $3, $4) RETURNING *',
      [nombre, apellido, direccion, activo])

    const nuevoCliente = result.rows[0]
    client.release()
    res.status(201).json(nuevoCliente)
  } catch (error) {
    console.error('Error al agregar cliente:', error)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
})

app.listen(port, () => {
  console.log(`API escuchando en el puerto ${port}`)
})
