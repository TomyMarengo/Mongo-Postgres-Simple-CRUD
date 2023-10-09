const express = require('express')
const router = express.Router()
const db = require('../../connections/mongoConfig')
const { Producto } = require('../../models/mongoModels')

router.get('/', async (req, res) => {
  try {
    const products = await Producto.find().sort({ _id: 1 })
    res.json(products)
  } catch (error) {
    console.error('Error when getting products from MongoDB:', error)
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
    // Find the last product in the collection and get its _id
    const pr = await Producto.find().sort({ _id: -1 }).limit(1)
    let newId = 0
    if (pr.length > 0) {
      newId = pr[0]._id + 1
    }

    // Create the new product with the first available _id
    const newProduct = await Producto.create({
      _id: newId,
      marca,
      nombre,
      descripcion,
      precio,
      stock
    })

    console.info('New product added to MongoDB:', newProduct)
    res.status(201).json(newProduct)
  } catch (error) {
    console.error('Error when adding product to MongoDB:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Actualizar un producto existente
router.put('/:id', async (req, res) => {
  const productId = req.params.id
  const { marca, nombre, descripcion, precio, stock } = req.body

  try {
    // Buscar el producto por ID
    const product = await Producto.findById(productId)

    if (!product) {
      // Si no se encuentra un producto con ese ID, devuelve un error 404
      return res.status(404).json({ error: 'Product not found' })
    }

    // Actualizar los campos del producto si se proporcionan en la solicitud
    if (marca) {
      product.marca = marca
    }

    if (nombre) {
      product.nombre = nombre
    }

    if (descripcion) {
      product.descripcion = descripcion
    }

    if (precio) {
      product.precio = precio
    }

    if (stock) {
      product.stock = stock
    }

    // Guardar los cambios en MongoDB
    await product.save()

    // Responder con el producto actualizado
    res.json(product)
  } catch (error) {
    console.error('Error when updating product in MongoDB:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Eliminar un producto por su ID
router.delete('/:id', async (req, res) => {
  const productId = req.params.id

  try {
    // Buscar el producto por ID y eliminarlo
    const deletedProduct = await Producto.findByIdAndDelete(productId)

    if (!deletedProduct) {
      // Si no se encuentra un producto con ese ID, devuelve un error 404
      return res.status(404).json({ error: 'Product not found' })
    }

    // Responder con un mensaje de éxito
    res.json({ message: 'Product deleted', product: deletedProduct })
  } catch (error) {
    console.error('Error when removing product in MongoDB:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

module.exports = router
