import express from 'express';
import { createCart, getCartById, addProductToCart, removeProductFromCart, clearCart } from '../managers/cartManager.js';  // Importa las funciones desde cartManager
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

// Ruta para obtener los carritos en formato HTML con Handlebars
router.get('/view', async (req, res) => {
  try {
    // Obtener todos los carritos
    const carts = await cartModel.find().populate('products.productId');  // Asegúrate de poblar correctamente
    const userCart = await cartModel.findOne({ user: req.user._id }).populate('products.productId');  // Obtener el carrito del usuario logueado
    
    res.render('home', {  // Renderizamos la vista de home.hbs
      products: [],  // Asegúrate de pasar los productos al renderizado
      cart: userCart,  // Pasa el carrito correspondiente
      cartId: userCart._id // Pasa el cartId
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

// Ruta para agregar un producto al carrito
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

// Ruta para eliminar un producto del carrito
router.delete('/:cid/products/:pid', async (req, res) => {
  const { cid, pid } = req.params;
  try {
    const cart = await removeProductFromCart(cid, pid);
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Ruta para vaciar el carrito
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

