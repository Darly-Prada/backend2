import express from 'express';
import { getProducts, getProductById, addProduct, updateProduct, deleteProduct } from '../managers/productManager.js';

import passport from 'passport';
import { authorizeRoles } from '../middlewares/authorizeRoles.js';


const router = express.Router();

router.post('/', passport.authenticate('jwt', { session: false }), authorizeRoles('admin'), addProduct);
router.put('/:id', passport.authenticate('jwt', { session: false }), authorizeRoles('admin'), updateProduct);
router.delete('/:id', passport.authenticate('jwt', { session: false }), authorizeRoles('admin'), deleteProduct);


// Obtener todos los productos
router.get('/', async (req, res) => {
  try {
    const products = await getProducts();
    console.log('Productos obtenidos:', products); 
    res.render('home', { products });
  } catch (error) {
    console.error('Error al obtener los productos:', error);
    res.status(500).send('Error al obtener productos');
  }
});

// Obtener un producto por ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const product = await getProductById(id);
    res.json(product);  
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Agregar un nuevo producto
router.post('/', async (req, res) => {
  const { title, description, price, stock, category, code } = req.body;
  try {
    const newProduct = await addProduct({ title, description, price, stock, category, code });
    res.status(201).json(newProduct); 
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// Actualizar un producto existente
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { title, description, price, stock, category, code } = req.body;
  try {
    const updatedProduct = await updateProduct(id, { title, description, price, stock, category, code });
    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Eliminar un producto
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const response = await deleteProduct(id);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;


