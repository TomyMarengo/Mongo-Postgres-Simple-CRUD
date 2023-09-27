const pool = require('./connections/postgresConfig')
const db = require('./connections/mongoConfig')
const mongoose = require('mongoose')

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
  }
}

createViews().then(() => {
  console.log('Creating views finished')
}).catch((error) => {
  console.error(error.message)
}).finally(() => {
  mongoose.disconnect()
  pool.end()
})
