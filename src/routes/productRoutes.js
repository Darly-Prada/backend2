import express from 'express';
import { getProducts, getProductById, addProduct, updateProduct, deleteProduct } from '../managers/productManager.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const products = await getProducts();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const product = await getProductById(id);
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  const { title, description, price, stock, category, code } = req.body;
  try {
    const newProduct = await addProduct({ title, description, price, stock, category, code });
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

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
