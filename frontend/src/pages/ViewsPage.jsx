import React, { useEffect, useState } from 'react'
import { Button, Container } from 'react-bootstrap'
import PropTypes from 'prop-types'

import EntityTable from '../components/EntityTable' // Import your EntityTable component
import { invoiceFields, productFields } from '../utils/fields' // Import your fields
import { formatCurrency, formatDate } from '../utils/utils'

export default function ViewsPage ({ endpoint }) {
  const [orderedInvoices, setOrderedInvoices] = useState([])
  const [uninvoicedProducts, setUninvoicedProducts] = useState([])
  const [activeTable, setActiveTable] = useState('ordered-invoices')

  useEffect(() => { // Fetch the data when the component mounts
    if (activeTable === 'ordered-invoices') fetchOrderedInvoices()
    else if (activeTable === 'uninvoiced-products') fetchUninvoicedProducts()
  }, [endpoint])

  const fetchOrderedInvoices = async () => {
    try {
      const response = await fetch(`${endpoint}/ordered-invoices`)
      const data = await response.json()

      const formattedData = data.map((invoice) => ({
        ...invoice,
        fecha: formatDate(invoice.fecha), // Format the date
        total_sin_iva: formatCurrency(invoice.total_sin_iva), // Format the price
        total_con_iva: formatCurrency(invoice.total_con_iva) // Format the price
      }))

      setOrderedInvoices(formattedData)
      setActiveTable('ordered-invoices')
    } catch (error) {
      console.error('Error fetching ordered invoices:', error)
    }
  }

  const fetchUninvoicedProducts = async () => {
    try {
      const response = await fetch(`${endpoint}/uninvoiced-products`)
      const data = await response.json()

      const formattedData = data.map((product) => ({
        ...product,
        precio: formatCurrency(product.precio) // Format the price
      }))

      setUninvoicedProducts(formattedData)
      setActiveTable('uninvoiced-products')
    } catch (error) {
      console.error('Error fetching uninvoiced products:', error)
    }
  }

  return (
    <Container>
      <h1 className='my-5'> Dashboard </h1>

      <div className='d-flex justify-content-center gap-5 mb-5'>
        <Button className='btn btn-primary' onClick={fetchOrderedInvoices}>
          Fetch Ordered Invoices
        </Button>
        <Button className='btn btn-secondary' onClick={fetchUninvoicedProducts}>
          Fetch Uninvoiced Products
        </Button>
      </div>

      {activeTable === 'ordered-invoices' && (
        <div>
          <h2>Ordered Invoices</h2>
          <EntityTable data={orderedInvoices} entityFields={invoiceFields} />
        </div>
      )}

      {activeTable === 'uninvoiced-products' && (
        <div>
          <h2>Uninvoiced Products</h2>
          <EntityTable data={uninvoicedProducts} entityFields={productFields} />
        </div>
      )}
    </Container>
  )
}

ViewsPage.propTypes = {
  endpoint: PropTypes.string.isRequired
}
