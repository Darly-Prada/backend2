import express from 'express';
import { createCart, getCartById, addProductToCart, removeProductFromCart, clearCart } from '../managers/cartManager.js';
import { cartModel } from '../models/cartModel.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const newCart = await createCart();
    res.status(201).json(newCart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/', async (req, res) => {
    try {

      const carts = await cartModel.find();   
      res.status(200).json(carts);   
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

router.get('/:cid', async (req, res) => {
  const { cid } = req.params;
  try {
    const cart = await getCartById(cid);
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/:cid/products/:pid', async (req, res) => {
  const { cid, pid } = req.params;
  const { quantity } = req.body;
  try {
    const cart = await addProductToCart(cid, pid, quantity);
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:cid/products/:pid', async (req, res) => {
  const { cid, pid } = req.params;
  try {
    const cart = await removeProductFromCart(cid, pid);
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:cid/clear', async (req, res) => {
  const { cid } = req.params;
  try {
    const response = await clearCart(cid);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

