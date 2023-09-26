const express = require('express')
const router = express.Router()
const pool = require('./connection')

router.get('/ordered-invoices', async (req, res) => {
  try {
    const view = await pool.connect()
    const result = await view.query('SELECT * FROM e01_facturas_ordenadas_por_fecha')
    const rows = result.rows
    view.release()
    res.json(rows)
  } catch (error) {
    console.error('Error when getting ordered invoices:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

router.get('/uninvoiced-products', async (req, res) => {
  try {
    const view = await pool.connect()
    const result = await view.query('SELECT * FROM e01_productos_no_facturados')
    const rows = result.rows
    view.release()
    res.json(rows)
  } catch (error) {
    console.error('Error when getting uninvoiced products:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})
module.exports = router
