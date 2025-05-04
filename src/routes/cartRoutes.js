import express from 'express';
import { createCart, getCartById, addProductToCart, removeProductFromCart, clearCart } from '../managers/cartManager.js'; 
import { cartModel } from '../models/cartModel.js';

import { ticketModel } from '../models/ticketModel.js';
import { productModel } from '../models/productModel.js';
import passport from 'passport';
import { authorizeRoles } from '../middlewares/authorizeRoles.js';


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

router.post('/:cid/purchase', 
  passport.authenticate('jwt', { session: false }),
  authorizeRoles('user'),  // Solo usuarios pueden comprar
  async (req, res) => {
    const { cid } = req.params;

    try {
      const cart = await cartModel.findById(cid);
      if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });

      let totalAmount = 0;
      const unprocessedProducts = [];
      const processedProducts = [];

      for (const item of cart.products) {
        const product = await productModel.findById(item.productId);

        if (!product || product.stock < item.quantity) {
          unprocessedProducts.push(item.productId);
          continue;
        }

        // Restar stock
        product.stock -= item.quantity;
        await product.save();

        totalAmount += item.quantity * (item.price || product.price);
        processedProducts.push(item.productId);
      }

      if (processedProducts.length > 0) {
        await ticketModel.create({
          amount: totalAmount,
          purchaser: req.user.email
        });
      }

      // Filtrar productos no procesados en el carrito
      cart.products = cart.products.filter(item => 
        unprocessedProducts.includes(item.productId.toString())
      );
      cart.calculateTotal();
      await cart.save();

      res.status(200).json({
        message: 'Compra realizada parcialmente',
        total: totalAmount,
        productos_no_procesados: unprocessedProducts
      });

    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al procesar la compra' });
    }
});

router.post('/:cid/products/:pid', 
  passport.authenticate('jwt', { session: false }), 
  authorizeRoles('user'), 
  async (req, res) => {
    // agregar producto a carrito
});



export default router;

