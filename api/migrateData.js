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

    try {
      await Cliente.insertMany(clientesMongoData, { ordered: false })
    } catch (error) {
      if (error.code === 11000) {
        console.log('Some clients were already migrated')
      } else {
        console.error('Error migrating clients', error)
        process.exit(1)
      }
    }

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

    try {
      await Producto.insertMany(productosMongoData, { ordered: false })
    } catch (error) {
      if (error.code === 11000) {
        console.log('Some products were already migrated')
      } else {
        console.error('Error migrating products', error)
        process.exit(1)
      }
    }

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
    try {
      await Factura.insertMany(invoicesMongoData, { ordered: false })
    } catch (error) {
      if (error.code === 11000) {
        console.log('Some invoices were already migrated')
      } else {
        console.error('Error migrating invoices', error)
        process.exit(1)
      }
    }
  } catch (error) {
    console.error('Error migrating', error)
    process.exit(1)
  }
}

async function createViews () {
  try {
    await db.createCollection(
      'facturas_ordenadas_por_fecha', // Nombre de la vista
      {
        viewOn: 'facturas', // Nombre de la colección de origen
        pipeline: [
          { $sort: { fecha: 1 } } // Ordena las facturas por fecha ascendente
        ],
        collation: { locale: 'en_US', numericOrdering: true } // Opcional: Define la configuración de ordenación
      }
    )

    await db.createCollection(
      'productos_no_facturados', // Nombre de la vista
      {
        viewOn: 'productos', // Nombre de la colección de origen
        pipeline: [
          {
            $lookup: {
              from: 'facturas',
              localField: '_id', // Campo en la colección "productos"
              foreignField: 'productos_comprados.codigo_producto', // Campo en la colección "facturas"
              as: 'facturas'
            }
          },
          {
            $match: {
              facturas: { $size: 0 } // Filtra productos que no aparecen en ninguna factura
            }
          }
        ],
        collation: { locale: 'en_US', numericOrdering: true } // Opcional: Define la configuración de ordenación
      }
    )
  } catch (error) {
    console.error('Error creating views', error)
    process.exit(1)
  }
}

migrateData().then(() => {
  createViews().then(() => {
    mongoose.connection.close()
    console.log('Data migrated successfully')
    process.exit(0)
  })
}).catch((error) => {
  console.error('Error migrating', error)
  process.exit(1)
})
