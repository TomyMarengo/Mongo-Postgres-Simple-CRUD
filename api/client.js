// Obtener todos los clientes
const express = require('express')
const router = express.Router()
const { Pool } = require('pg')

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'tpo',
  password: '1234',
  port: 5432
})

router.get('/', async (req, res) => {
  try {
    const client = await pool.connect()
    const result = await client.query('SELECT * FROM e01_cliente ORDER BY nro_cliente ASC')
    const clientes = result.rows
    client.release()
    res.json(clientes)
  } catch (error) {
    console.error('Error al obtener clientes:', error)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
})

// Agregar un nuevo cliente
router.post('/', async (req, res) => {
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

// Actualizar un cliente existente
router.put('/:id', async (req, res) => {
  const clienteId = req.params.id
  const { nombre, apellido, direccion, activo } = req.body

  try {
    const client = await pool.connect()
    const updateFields = []
    const updateValues = []

    if (nombre) {
      updateFields.push('nombre = $1')
      updateValues.push(nombre)
    }

    if (apellido) {
      updateFields.push('apellido = $2')
      updateValues.push(apellido)
    }

    if (direccion) {
      updateFields.push('direccion = $3')
      updateValues.push(direccion)
    }

    if (activo) {
      updateFields.push('activo = $4')
      updateValues.push(activo)
    }

    if (updateFields.length === 0) {
      // Si no se proporcionan campos para actualizar, devuelve un error 400
      client.release()
      return res.status(400).json({ error: 'Se debe proporcionar al menos un campo para actualizar' })
    }

    // updateValues.length es el ID del cliente
    updateValues.push(clienteId)

    const updateQuery = `UPDATE e01_cliente SET ${updateFields.join(', ')} WHERE nro_cliente = $${updateValues.length} RETURNING *`

    const result = await client.query(updateQuery, updateValues)

    if (result.rows.length === 0) {
      // Si no se encuentra un cliente con ese ID, devuelve un error 404
      client.release()
      return res.status(404).json({ error: 'Cliente no encontrado' })
    }

    const clienteActualizado = result.rows[0]
    client.release()
    res.json(clienteActualizado)
  } catch (error) {
    console.error('Error al actualizar cliente:', error)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
})

// Eliminar un cliente por su ID
router.delete('/:id', async (req, res) => {
  const clienteId = req.params.id

  try {
    const client = await pool.connect()
    const result = await client.query('DELETE FROM e01_cliente WHERE nro_cliente = $1 RETURNING *', [clienteId])

    if (result.rows.length === 0) {
      // Si no se encuentra un cliente con ese ID, devuelve un error 404
      client.release()
      return res.status(404).json({ error: 'Cliente no encontrado' })
    }

    const clienteEliminado = result.rows[0]
    client.release()
    res.json({ message: 'Cliente eliminado satisfactoriamente', cliente: clienteEliminado })
  } catch (error) {
    console.error('Error al eliminar cliente:', error)

    if (error.code === '23503') {
      res.status(500).send('El cliente todavía tiene facturas asociadas')
    } else {
      res.status(500).json({ error: 'Error interno del servidor' })
    }
  }
})

module.exports = router
