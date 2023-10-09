export const clientFields = [
  {
    name: 'nombre',
    label: 'First Name',
    type: 'text'
  },
  {
    name: 'apellido',
    label: 'Last Name',
    type: 'text'
  },
  {
    name: 'direccion',
    label: 'Address',
    type: 'text'
  },
  {
    name: 'activo',
    label: 'Active',
    type: 'number'
  }
]

export const productFields = [
  {
    name: 'marca',
    label: 'Brand',
    type: 'text'
  },
  {
    name: 'nombre',
    label: 'Name',
    type: 'text'
  },
  {
    name: 'descripcion',
    label: 'Description',
    type: 'text'
  },
  {
    name: 'precio',
    label: 'Price',
    type: 'number'
  },
  {
    name: 'stock',
    label: 'Stock',
    type: 'number'
  }
]

export const invoiceFields = [
  {
    name: 'fecha',
    label: 'Date',
    type: 'date'
  },
  {
    name: 'total_sin_iva',
    label: 'Total without tax',
    type: 'number'
  },
  {
    name: 'total_con_iva',
    label: 'Total with tax',
    type: 'number'
  },
  {
    name: 'nro_cliente',
    label: 'Client ID',
    type: 'number'
  }
]

export const fieldMappings = {
  // E01_Telefono
  codigo_area: 'Area Code',
  nro_telefono: 'Phone Number',
  tipo: 'Type',
  // E01_Cliente
  nro_cliente: 'Client ID',
  nombre: 'First Name',
  apellido: 'Last Name',
  direccion: 'Address',
  activo: 'Active',
  // E01_Factura
  nro_factura: 'Invoice ID',
  fecha: 'Date',
  total_sin_iva: 'Total without tax',
  iva: 'Tax',
  total_con_iva: 'Total with tax',
  // E01_Detalle_Factura
  nro_item: 'Item ID',
  cantidad: 'Quantity',
  // E01_Producto
  codigo_producto: 'Product ID',
  marca: 'Brand',
  descripcion: 'Description',
  precio: 'Price',
  stock: 'Stock',
  // Views
  total_gastado: 'Total Spent',
  cantidad_facturas: 'Number of Invoices'
}
