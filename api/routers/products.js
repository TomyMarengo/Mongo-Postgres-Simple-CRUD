const express = require('express')
const router = express.Router()
const pool = require('../connection')

router.get('/', async (req, res) => {
  try {
    const product = await pool.connect()
    const result = await product.query('SELECT * FROM e01_producto ORDER BY codigo_producto ASC')
    const products = result.rows
    product.release()
    res.json(products)
  } catch (error) {
    console.error('Error when getting products:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Agregar un nuevo producto
router.post('/', async (req, res) => {
  const { marca, nombre, descripcion, precio, stock } = req.body
  if (!marca || !nombre || !descripcion || !precio || !stock) {
    return res.status(400).json({ error: 'All fields are required' })
  }

  try {
    const product = await pool.connect()
    const result = await product.query('INSERT INTO e01_producto (marca, nombre, descripcion, precio, stock) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [marca, nombre, descripcion, precio, stock])

    const newProduct = result.rows[0]
    product.release()
    res.status(201).json(newProduct)
  } catch (error) {
    console.error('Error when adding product:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Actualizar un producto existente
router.put('/:id', async (req, res) => {
  const productId = req.params.id
  const { marca, nombre, descripcion, precio, stock } = req.body

  try {
    const product = await pool.connect()
    const updateFields = []
    const updateValues = []

    if (marca) {
      updateFields.push('marca = $1')
      updateValues.push(marca)
    }

    if (nombre) {
      updateFields.push('nombre = $2')
      updateValues.push(nombre)
    }

    if (descripcion) {
      updateFields.push('descripcion = $3')
      updateValues.push(descripcion)
    }

    if (precio) {
      updateFields.push('precio = $4')
      updateValues.push(precio)
    }

    if (stock) {
      updateFields.push('stock = $5')
      updateValues.push(stock)
    }

    if (updateFields.length === 0) {
      // Si no se proporcionan campos para actualizar, devuelve un error 400
      product.release()
      return res.status(400).json({ error: 'One or more fields are required' })
    }

    // updateValues.length es el ID del producto
    updateValues.push(productId)

    const updateQuery = `UPDATE e01_producto SET ${updateFields.join(', ')} WHERE codigo_producto = $${updateValues.length} RETURNING *`

    const result = await product.query(updateQuery, updateValues)

    if (result.rows.length === 0) {
      // Si no se encuentra un producto con ese ID, devuelve un error 404
      product.release()
      return res.status(404).json({ error: 'Product not found' })
    }

    const updatedProduct = result.rows[0]
    product.release()
    res.json(updatedProduct)
  } catch (error) {
    console.error('Error when updating product:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Eliminar un producto por su ID
router.delete('/:id', async (req, res) => {
  const productId = req.params.id

  try {
    const product = await pool.connect()
    const result = await product.query('DELETE FROM e01_producto WHERE codigo_producto = $1 RETURNING *', [productId])

    if (result.rows.length === 0) {
      product.release()
      return res.status(404).json({ error: 'Product not found' })
    }

    const deletedProduct = result.rows[0]
    product.release()
    res.json({ message: 'Product deleted', product: deletedProduct })
  } catch (error) {
    console.error('Error when removing product:', error)

    if (error.code === '23503') {
      res.status(500).send({ error: 'Cannot delete product because is still referenced' })
    } else {
      res.status(500).json({ error: 'Internal server error' })
    }
  }
})

module.exports = router
