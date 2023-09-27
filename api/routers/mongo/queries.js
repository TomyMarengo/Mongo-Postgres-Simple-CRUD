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
  const clients = await Cliente.find({ nombre: 'Wanda', apellido: 'Baker' }, { 'telefonos.codigo_area': 1, 'telefonos.nro_telefono': 1, _id: 1 })

  // Para que sea igual a la query de SQL, y que se pueda ver en el front
  const result = []
  clients.forEach(client => {
    client.telefonos.forEach(telefono => {
      result.push({ codigo_area: telefono.codigo_area, nro_telefono: telefono.nro_telefono, nro_cliente: client._id })
    })
  })

  return result
}

async function query2 () {
  const clients = await Factura.aggregate([
    {
      $group: {
        _id: '$nro_cliente', // Agrupar por número de cliente
        count: { $sum: 1 } // Contar las facturas por cliente
      }
    },
    {
      $lookup: {
        from: 'clientes', // Nombre de la colección de clientes (ajusta según tu modelo)
        localField: '_id', // Campo local que se relaciona con el campo remoto (_id)
        foreignField: '_id', // Campo en la colección de clientes que se relaciona con _id
        as: 'cliente_info' // Alias para los datos del cliente
      }
    },
    {
      $unwind: '$cliente_info' // Desenrollar el array de cliente_info
    },
    {
      $project: {
        _id: 0,
        nro_cliente: '$_id', // Renombrar _id a nro_cliente
        nombre: '$cliente_info.nombre', // Obtener el nombre del cliente
        apellido: '$cliente_info.apellido', // Obtener el apellido del cliente
        direccion: '$cliente_info.direccion', // Obtener la dirección del cliente
        activo: '$cliente_info.activo' // Obtener el estado del cliente
      }
    }
  ])

  return clients
}

async function query3 () {
  const clients = Cliente.aggregate([
    {
      $lookup: {
        from: 'facturas', // Nombre de la colección de facturas (ajusta según tu modelo)
        localField: '_id', // Campo local que se relaciona con el campo remoto (_id)
        foreignField: 'nro_cliente', // Campo en la colección de facturas que se relaciona con _id del cliente
        as: 'facturas' // Alias para las facturas relacionadas
      }
    },
    {
      $match: {
        facturas: { $size: 0 } // Filtrar clientes sin facturas (facturas vacías)
      }
    },
    {
      $project: {
        _id: 0,
        nro_cliente: '$_id', // Renombrar _id a nro_cliente
        nombre: 1, // Obtener el nombre del cliente
        apellido: 1, // Obtener el apellido del cliente
        direccion: 1, // Obtener la dirección del cliente
        activo: 1 // Obtener el estado del cliente
      }
    }
  ])

  return clients
}

async function query4 () {
  const products = await Factura.aggregate([
    {
      $unwind: '$productos_comprados'
    },
    {
      $group: {
        _id: '$productos_comprados.codigo_producto', // Agrupar por código de producto
        totalCompras: { $sum: 1 } // Calcular el total de compras para cada producto
      }
    },
    {
      $lookup: {
        from: 'productos', // Nombre de la colección de productos (ajusta según tu modelo)
        localField: '_id', // Campo local que se relaciona con el campo remoto (_id)
        foreignField: '_id', // Campo en la colección de productos que se relaciona con _id
        as: 'producto_info' // Alias para los datos del producto
      }
    },
    {
      $unwind: '$producto_info' // Desenrollar el array de cliente_info
    },
    {
      $project: {
        _id: 0,
        codigo_producto: '$_id',
        marca: '$producto_info.marca',
        nombre: '$producto_info.nombre',
        descripcion: '$producto_info.descripcion',
        precio: '$producto_info.precio',
        stock: '$producto_info.stock'
      }
    }
  ])
  return products
}

async function query5 () {
  const clients = await Cliente.aggregate([
    {
      $unwind: '$telefonos'
    },
    {
      $project: {
        nro_cliente: '$_id',
        nombre: 1,
        apellido: 1,
        direccion: 1,
        activo: 1,
        codigo_area: '$telefonos.codigo_area',
        nro_telefono: '$telefonos.nro_telefono',
        tipo: '$telefonos.tipo',
        _id: 0
      }
    }
  ])
  return clients
}

async function query6 () {
  const clients = await Cliente.aggregate([
    {
      $lookup: {
        from: 'facturas', // Nombre de la colección de facturas
        localField: '_id',
        foreignField: 'nro_cliente',
        as: 'facturas'
      }
    },
    {
      $project: {
        _id: 0,
        nro_cliente: '$_id',
        nombre: 1,
        apellido: 1,
        direccion: 1,
        activo: 1,
        cantidad_facturas: { $size: '$facturas' }
      }
    }
  ])

  return clients
}

async function query7 () {
  const invoices = await Factura.aggregate([
    {
      $lookup: {
        from: 'clientes', // Nombre de la colección de clientes
        localField: 'nro_cliente',
        foreignField: '_id',
        as: 'cliente'
      }
    },
    {
      $match: {
        'cliente.nombre': 'Pandora',
        'cliente.apellido': 'Tate'
      }
    },
    {
      $project: {
        _id: 0,
        nro_factura: '$_id',
        fecha: 1,
        total_sin_iva: 1,
        total_con_iva: 1,
        nro_cliente: 1
      }
    }
  ])

  return invoices
}

async function query8 () {
  const invoices = await Factura.aggregate([
    {
      $lookup: {
        from: 'productos', // Nombre de la colección de productos
        localField: 'productos_comprados.codigo_producto',
        foreignField: '_id',
        as: 'productos'
      }
    },
    {
      $match: {
        'productos.marca': 'In Faucibus Inc.'
      }
    },
    {
      $project: {
        _id: 0,
        nro_factura: '$_id',
        fecha: 1,
        total_sin_iva: 1,
        total_con_iva: 1,
        nro_cliente: 1
      }
    },
    {
      $unset: 'productos_comprados'
    }
  ])

  return invoices
}

async function query9 () {
  const phones = await Cliente.aggregate([
    {
      $unwind: '$telefonos'
    },
    {
      $project: {
        codigo_area: '$telefonos.codigo_area',
        nro_telefono: '$telefonos.nro_telefono',
        tipo: '$telefonos.tipo',
        _id: 0, // Excluir el campo _id del cliente
        nro_cliente: '$_id',
        nombre: 1,
        apellido: 1
      }
    }
  ])

  return phones
}

async function query10 () {
  const clients = await Factura.aggregate([
    {
      $lookup: {
        from: 'clientes',
        localField: 'nro_cliente',
        foreignField: '_id',
        as: 'cliente'
      }
    },
    {
      $unwind: '$cliente'
    },
    {
      $group: {
        _id: {
          clienteId: '$cliente._id',
          nombre: '$cliente.nombre',
          apellido: '$cliente.apellido'
        },
        total_gastado: { $sum: '$total_con_iva' }
      }
    },
    {
      $project: {
        _id: 0,
        nombre: '$_id.nombre',
        apellido: '$_id.apellido',
        total_gastado: 1
      }
    }
  ])

  return clients
}

module.exports = router
