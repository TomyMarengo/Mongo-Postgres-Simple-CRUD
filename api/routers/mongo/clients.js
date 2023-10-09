const express = require('express')
const router = express.Router()
const db = require('../../connections/mongoConfig')
const { Cliente } = require('../../models/mongoModels')

router.get('/', async (req, res) => {
  try {
    const clients = await Cliente.find().sort({ _id: 1 })
    res.json(clients)
  } catch (error) {
    console.error('Error when getting clients from MongoDB:', error)
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
    // Find the highest _id currently in the database
    const cl = await Cliente.find().sort({ _id: -1 }).limit(1)
    let newId = 0
    if (cl.length > 0) {
      newId = cl[0]._id + 1
    }

    // Create the new client with the new _id
    const newClient = await Cliente.create({
      _id: newId,
      nombre,
      apellido,
      direccion,
      activo
    })

    console.info('New client added to MongoDB:', newClient)
    res.status(201).json(newClient)
  } catch (error) {
    console.error('Error when adding client to MongoDB:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Actualizar un cliente existente
router.put('/:id', async (req, res) => {
  const clientId = req.params.id
  const { nombre, apellido, direccion, activo } = req.body

  try {
    // Buscar el cliente por ID
    const client = await Cliente.findById(clientId)

    if (!client) {
      // Si no se encuentra un cliente con ese ID, devuelve un error 404
      return res.status(404).json({ error: 'Client not found' })
    }

    // Actualizar los campos del cliente si se proporcionan en la solicitud
    if (nombre) {
      client.nombre = nombre
    }

    if (apellido) {
      client.apellido = apellido
    }

    if (direccion) {
      client.direccion = direccion
    }

    if (activo) {
      client.activo = activo
    }

    // Guardar los cambios en MongoDB
    await client.save()

    // Responder con el cliente actualizado
    res.json(client)
  } catch (error) {
    console.error('Error when updating client in MongoDB:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Eliminar un cliente por su ID
router.delete('/:id', async (req, res) => {
  const clientId = req.params.id

  try {
    // Buscar el cliente por ID y eliminarlo
    const deletedClient = await Cliente.findByIdAndDelete(clientId)

    if (!deletedClient) {
      // Si no se encuentra un cliente con ese ID, devuelve un error 404
      return res.status(404).json({ error: 'Client not found' })
    }

    // Responder con un mensaje de éxito
    res.json({ message: 'Client deleted', client: deletedClient })
  } catch (error) {
    console.error('Error when removing client in MongoDB:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

module.exports = router
