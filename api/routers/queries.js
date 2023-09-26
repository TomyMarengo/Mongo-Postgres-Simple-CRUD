const express = require('express')
const router = express.Router()
const pool = require('../connection')

const queries = [
  // Query 1
  'SELECT codigo_area, nro_telefono, nro_cliente FROM E01_Telefono NATURAL JOIN E01_Cliente WHERE nombre = \'Wanda\' AND apellido = \'Baker\'',

  // Query 2
  'SELECT * FROM E01_Cliente WHERE nro_cliente IN (SELECT DISTINCT nro_cliente FROM E01_Factura)',

  // Query 3
  'SELECT * FROM E01_Cliente WHERE nro_cliente NOT IN (SELECT DISTINCT nro_cliente FROM E01_Factura)',

  // Query 4
  'SELECT DISTINCT E01_Producto.* FROM E01_Producto INNER JOIN E01_Detalle_Factura ON E01_Producto.codigo_producto = E01_Detalle_Factura.codigo_producto',

  // Query 5
  'SELECT E01_Cliente.*, E01_Telefono.* FROM E01_Cliente LEFT JOIN E01_Telefono ON E01_Cliente.nro_cliente = E01_Telefono.nro_cliente',

  // Query 6
  'SELECT E01_Cliente.*, COUNT(E01_Factura.nro_factura) AS cantidad_facturas FROM E01_Cliente LEFT JOIN E01_Factura ON E01_Cliente.nro_cliente = E01_Factura.nro_cliente GROUP BY E01_Cliente.nro_cliente',

  // Query 7
  'SELECT E01_Factura.* FROM E01_Factura NATURAL JOIN E01_Cliente WHERE E01_Cliente.nombre = \'Pandora\' AND E01_Cliente.apellido = \'Tate\'',

  // Query 8
  'SELECT E01_Factura.* FROM E01_Factura INNER JOIN E01_Detalle_Factura ON E01_Factura.nro_factura = E01_Detalle_Factura.nro_factura INNER JOIN E01_Producto ON E01_Detalle_Factura.codigo_producto = E01_Producto.codigo_producto WHERE E01_Producto.marca = \'In Faucibus Inc.\'',

  // Query 9
  'SELECT E01_Telefono.*, E01_Cliente.nombre, E01_Cliente.apellido FROM E01_Telefono INNER JOIN E01_Cliente ON E01_Telefono.nro_cliente = E01_Cliente.nro_cliente',

  // Query 10
  'SELECT E01_Cliente.nombre, E01_Cliente.apellido, COALESCE(SUM(E01_Factura.total_con_iva),0) AS total_gastado FROM E01_Cliente LEFT JOIN E01_Factura ON E01_Cliente.nro_cliente = E01_Factura.nro_cliente GROUP BY E01_Cliente.nro_cliente'
]

router.get('/:id', async (req, res) => {
  const { id } = req.params

  try {
    const client = await pool.connect()

    if (id >= 1 && id <= queries.length) {
      const result = await client.query(queries[id - 1])
      const rows = result.rows
      client.release()
      res.json(rows)
    } else {
      res.status(404).json({ error: 'Query not found' })
    }
  } catch (error) {
    console.error('Error when querying: ', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

module.exports = router
