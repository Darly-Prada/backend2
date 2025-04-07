import express from 'express';
import { createCart, getCartById, addProductToCart, removeProductFromCart, clearCart } from '../managers/cartManager.js'; 
import { cartModel } from '../models/cartModel.js';


const router = express.Router();

// Ruta para crear un carrito
router.post('/', async (req, res) => {
  try {
    const newCart = await createCart();
    res.status(201).json(newCart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener los carritos con Handlebars
router.get('/view', async (req, res) => {
  try {
    // Obtener todos los carritos
    const carts = await cartModel.find().populate('products.productId'); 
    const userCart = await cartModel.findOne({ user: req.user._id }).populate('products.productId'); 
    
    res.render('home', { 
      products: [],  
      cart: userCart,  
      cartId: userCart._id 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// Ruta para obtener un carrito por su ID
router.get('/:cid', async (req, res) => {
  const { cid } = req.params;
  try {
    const cart = await getCartById(cid);
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Agregar un producto al carrito
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

// Eliminar un producto del carrito
router.delete('/:cid/products/:pid', async (req, res) => {
  const { cid, pid } = req.params;
  try {
    const cart = await removeProductFromCart(cid, pid);
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Vaciar el carrito
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

