const mongoose = require('mongoose')
const db = require('../connections/mongoConfig')

// Cliente
const ClienteSchema = new mongoose.Schema({
  _id: Number,
  nombre: String,
  apellido: String,
  direccion: String,
  activo: Number,
  telefonos: [
    {
      codigo_area: Number,
      nro_telefono: Number,
      tipo: String
    }
  ]
})

const Cliente = mongoose.model('Cliente', ClienteSchema)

// Producto
const ProductoSchema = new mongoose.Schema({
  _id: Number,
  marca: String,
  nombre: String,
  descripcion: String,
  precio: Number,
  stock: Number
})

const Producto = mongoose.model('Producto', ProductoSchema)

// Factura
const FacturaSchema = new mongoose.Schema({
  _id: Number,
  fecha: Date,
  total_sin_iva: Number,
  total_con_iva: Number,
  nro_cliente: Number,
  productos_comprados: [
    {
      codigo_producto: Number,
      cantidad: Number
    }
  ]
})

const Factura = mongoose.model('Factura', FacturaSchema)

// Exporta los modelos para usarlos en otros archivos
module.exports = {
  Cliente,
  Producto,
  Factura
}
