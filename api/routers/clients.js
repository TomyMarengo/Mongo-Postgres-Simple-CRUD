const express = require('express')
const router = express.Router()
const pool = require('../connection')

router.get('/', async (req, res) => {
  try {
    const client = await pool.connect()
    const result = await client.query('SELECT * FROM e01_cliente ORDER BY nro_cliente ASC')
    const clients = result.rows
    client.release()
    res.json(clients)
  } catch (error) {
    console.error('Error when getting clients:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Agregar un nuevo cliente
router.post('/', async (req, res) => {
  const { nombre, apellido, direccion, activo } = req.body
  if (!nombre || !apellido || !direccion || !activo) {
    return res.status(400).json({ error: 'All fields are required' })
  }

  try {
    const client = await pool.connect()
    const result = await client.query('INSERT INTO e01_cliente (nombre, apellido, direccion, activo) VALUES ($1, $2, $3, $4) RETURNING *',
      [nombre, apellido, direccion, activo])

    const newClient = result.rows[0]
    client.release()
    res.status(201).json(newClient)
  } catch (error) {
    console.error('Error when adding client:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Actualizar un cliente existente
router.put('/:id', async (req, res) => {
  const clientId = req.params.id
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
      return res.status(400).json({ error: 'One or more fields are required' })
    }

    // updateValues.length es el ID del cliente
    updateValues.push(clientId)

    const updateQuery = `UPDATE e01_cliente SET ${updateFields.join(', ')} WHERE nro_cliente = $${updateValues.length} RETURNING *`

    const result = await client.query(updateQuery, updateValues)

    if (result.rows.length === 0) {
      // Si no se encuentra un cliente con ese ID, devuelve un error 404
      client.release()
      return res.status(404).json({ error: 'Client not found' })
    }

    const updatedClient = result.rows[0]
    client.release()
    res.json(updatedClient)
  } catch (error) {
    console.error('Error when updating client:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Eliminar un cliente por su ID
router.delete('/:id', async (req, res) => {
  const clientId = req.params.id

  try {
    const client = await pool.connect()
    const result = await client.query('DELETE FROM e01_cliente WHERE nro_cliente = $1 RETURNING *', [clientId])

    if (result.rows.length === 0) {
      // Si no se encuentra un cliente con ese ID, devuelve un error 404
      client.release()
      return res.status(404).json({ error: 'Client not found' })
    }

    const deletedClient = result.rows[0]
    client.release()
    res.json({ message: 'Client deleted', client: deletedClient })
  } catch (error) {
    console.error('Error when removing client:', error)

    if (error.code === '23503') {
      res.status(500).send({ error: 'Cannot delete client because is still referenced' })
    } else {
      res.status(500).json({ error: 'Internal server error' })
    }
  }
})

module.exports = router
