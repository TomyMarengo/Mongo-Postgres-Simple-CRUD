const pool = require('./connections/postgresConfig')
const db = require('./connections/mongoConfig')
const mongoose = require('mongoose')
const { Cliente, Factura, Producto } = require('./models/mongoModels')

async function migrateData () {
  try {
    // CLIENTS
    const clientsQuery = 'SELECT c.nro_cliente, c.nombre, c.apellido, c.direccion, c.activo, COALESCE(json_agg(json_build_object(\'codigo_area\', t.codigo_area, \'nro_telefono\', t.nro_telefono, \'tipo\', t.tipo)) FILTER (WHERE nro_telefono IS NOT NULL),\'[]\') as telefonos FROM e01_cliente c LEFT JOIN e01_telefono t ON c.nro_cliente = t.nro_cliente GROUP BY c.nro_cliente'
    const clientsResult = await pool.query(clientsQuery)
    const clientesMongoData = clientsResult.rows.map((cliente) => ({
      _id: cliente.nro_cliente,
      nombre: cliente.nombre,
      apellido: cliente.apellido,
      direccion: cliente.direccion,
      activo: cliente.activo,
      telefonos: cliente.telefonos || []
    }))
    await Cliente.insertMany(clientesMongoData)

    // PRODUCTS
    const productsQuery = 'SELECT * FROM E01_producto'
    const productsResult = await pool.query(productsQuery)
    const productosMongoData = productsResult.rows.map((producto) => ({
      _id: producto.codigo_producto,
      marca: producto.marca,
      nombre: producto.nombre,
      descripcion: producto.descripcion,
      precio: producto.precio,
      stock: producto.stock
    }))
    await Producto.insertMany(productosMongoData)

    // INVOICES
    const invoicesQuery = 'SELECT f.nro_factura, f.fecha, f.total_sin_iva, f.total_con_iva, f.nro_cliente, COALESCE(json_agg(json_build_object(\'cantidad\', d.cantidad, \'codigo_producto\', d.codigo_producto)) FILTER (WHERE codigo_producto IS NOT NULL), \'[]\') as productos_comprados FROM e01_factura f LEFT JOIN e01_detalle_factura d ON f.nro_factura = d.nro_factura GROUP BY f.nro_factura'

    const invoicesResult = await pool.query(invoicesQuery)

    // Convertir y migrar datos de invoices a MongoDB
    const invoicesMongoData = invoicesResult.rows.map((invoice) => ({
      _id: invoice.nro_factura,
      fecha: invoice.fecha,
      total_sin_iva: invoice.total_sin_iva,
      total_con_iva: invoice.total_con_iva,
      nro_cliente: invoice.nro_cliente,
      productos_comprados: invoice.productos_comprados || []
    }))

    // Insertar datos en MongoDB
    await Factura.insertMany(invoicesMongoData)
  } catch (error) {
    console.error('Error migrating', error)
  }
}

migrateData().then(() => {
  console.log('Migration finished')
}).catch((error) => {
  console.error(error.message)
}).finally(() => {
  mongoose.disconnect()
  pool.end()
})
