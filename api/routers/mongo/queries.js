const express = require('express')
const router = express.Router()
const db = require('../../connections/mongoConfig')
const { Cliente, Producto, Factura } = require('../../models/mongoModels')

const queries = [
  query1,
  query2,
  query3,
  query4,
  query5,
  query6,
  query7,
  query8,
  query9,
  query10
]

router.get('/:id', async (req, res) => {
  const { id } = req.params

  try {
    if (id >= 1 && id <= queries.length) {
      const result = await queries[id - 1]()
      res.json(result)
    } else {
      res.status(404).json({ error: 'Query not found' })
    }
  } catch (error) {
    console.error('Error when querying to MongoDB: ', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

async function query1 () {
  const clientes = await Cliente.find({ nombre: 'Wanda', apellido: 'Baker' }, { 'telefonos.codigo_area': 1, 'telefonos.nro_telefono': 1, _id: 1 })

  // Por cada telefono, por cada cliente, hacer un objeto {_id, codigo_area, nro_telefono}
  const result = []
  clientes.forEach(cliente => {
    cliente.telefonos.forEach(telefono => {
      result.push({ codigo_area: telefono.codigo_area, nro_telefono: telefono.nro_telefono, nro_cliente: cliente._id })
    })
  })

  return clientes
}

async function query2 () {
  const productos = await Producto.find().sort({ _id: 1 })
  return productos
}

async function query3 () {
  const productos = await Producto.find().sort({ _id: 1 })
  return productos
}

async function query4 () {
  const productos = await Producto.find().sort({ _id: 1 })
  return productos
}

async function query5 () {
  const productos = await Producto.find().sort({ _id: 1 })
  return productos
}

async function query6 () {
  const productos = await Producto.find().sort({ _id: 1 })
  return productos
}

async function query7 () {
  const productos = await Producto.find().sort({ _id: 1 })
  return productos
}

async function query8 () {
  const productos = await Producto.find().sort({ _id: 1 })
  return productos
}

async function query9 () {
  const productos = await Producto.find().sort({ _id: 1 })
  return productos
}

async function query10 () {
  const productos = await Producto.find().sort({ _id: 1 })
  return productos
}

module.exports = router
