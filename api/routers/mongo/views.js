const express = require('express')
const router = express.Router()
const db = require('../../connections/mongoConfig')

router.get('/ordered-invoices', async (req, res) => {
  try {
    const collection = db.collection('facturas_ordenadas_por_fecha')

    const invoices = await collection.aggregate([
      {
        $project: {
          fecha: 1,
          total_sin_iva: 1,
          total_con_iva: 1,
          nro_cliente: 1,
          codigo_factura: '$_id', // Cambiar el nombre del campo _id a codigo_factura
          _id: 0 // Excluir el campo _id
        }
      }
    ]).toArray()

    res.json(invoices)
  } catch (error) {
    console.error('Error when getting ordered invoices:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Endpoint para obtener productos no facturados
router.get('/uninvoiced-products', async (req, res) => {
  try {
    const collection = db.collection('productos_no_facturados')

    const uninvoicedProducts = await collection.aggregate([
      {
        $project: {
          codigo_producto: '$_id', // Cambiar el nombre del campo _id a codigo_producto
          marca: 1,
          nombre: 1,
          descripcion: 1,
          precio: 1,
          stock: 1,
          _id: 0 // Excluir el campo _id
        }
      }
    ]).toArray()

    res.json(uninvoicedProducts)
  } catch (error) {
    console.error('Error when getting uninvoiced products:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

module.exports = router
