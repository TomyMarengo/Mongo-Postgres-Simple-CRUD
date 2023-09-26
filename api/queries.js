const express = require('express')
const router = express.Router()
const pool = require('./connection')

const queries = [
  // Query 1
  'SELECT telefono, nro_cliente FROM tu_tabla WHERE nombre = $1 AND apellido = $2',

  // Query 2
  'SELECT * FROM clientes WHERE EXISTS (SELECT 1 FROM facturas WHERE facturas.nro_cliente = clientes.nro_cliente)',

  // Query 3
  'SELECT * FROM clientes WHERE NOT EXISTS (SELECT 1 FROM facturas WHERE facturas.nro_cliente = clientes.nro_cliente)',

  // Query 4
  'SELECT productos.* FROM productos INNER JOIN detalles_factura ON productos.producto_id = detalles_factura.producto_id',

  // Query 5
  'SELECT clientes.*, telefonos.telefono FROM clientes LEFT JOIN telefonos ON clientes.nro_cliente = telefonos.nro_cliente',

  // Query 6
  'SELECT clientes.*, COUNT(facturas.nro_factura) AS cantidad_facturas FROM clientes LEFT JOIN facturas ON clientes.nro_cliente = facturas.nro_cliente GROUP BY clientes.nro_cliente',

  // Query 7
  'SELECT facturas.* FROM facturas INNER JOIN clientes ON facturas.nro_cliente = clientes.nro_cliente WHERE clientes.nombre = $1 AND clientes.apellido = $2',

  // Query 8
  'SELECT facturas.* FROM facturas INNER JOIN detalles_factura ON facturas.nro_factura = detalles_factura.nro_factura INNER JOIN productos ON detalles_factura.producto_id = productos.producto_id WHERE productos.marca = $1',

  // Query 9
  'SELECT clientes.nombre, clientes.apellido, telefonos.telefono FROM clientes LEFT JOIN telefonos ON clientes.nro_cliente = telefonos.nro_cliente',

  // Query 10
  'SELECT clientes.nombre, clientes.apellido, SUM(facturas.total_con_iva) AS total_gastado FROM clientes LEFT JOIN facturas ON clientes.nro_cliente = facturas.nro_cliente GROUP BY clientes.nro_cliente, clientes.nombre, clientes.apellido'
]

router.get('/:id', async (req, res) => {
  const { id } = req.params

  try {
    const client = await pool.connect()

    if (id >= 1 && id <= queries.length) {
      const result = await client.query(queries[id - 1], ['Wanda', 'Baker']) // Ejemplo de parámetros para la primera consulta
      const rows = result.rows
      client.release()
      res.json(rows)
    } else {
      res.status(404).json({ error: 'Consulta no encontrada' })
    }
  } catch (error) {
    console.error('Error al ejecutar consulta:', error)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
})

module.exports = router
