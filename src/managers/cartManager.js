import { cartModel } from '../models/cartModel.js';
import { productModel } from '../models/productModel.js';

// Crear un nuevo carrito
export const createCart = async () => {
  try {
    const newCart = new cartModel({
      products: [],
      total: 0,
    });
    await newCart.save();
    return newCart;
  } catch (error) {
    throw new Error('Error al crear el carrito');
  }
};

// Obtener un carrito por ID
export const getCartById = async (cid) => {
  try {
    const cart = await cartModel.findById(cid);
    if (!cart) throw new Error('Carrito no encontrado');
    return cart;
  } catch (error) {
    throw new Error('Error al obtener el carrito');
  }
};

// Agregar un producto al carrito
export const addProductToCart = async (cid, pid, quantity) => {
  try {
    const cart = await cartModel.findById(cid);
    if (!cart) throw new Error('Carrito no encontrado');

    const product = await productModel.findById(pid);
    if (!product) throw new Error('Producto no encontrado');

    const existingProductIndex = cart.products.findIndex(
      (product) => product.productId.toString() === pid
    );

    if (existingProductIndex > -1) {
      cart.products[existingProductIndex].quantity += quantity;
    } else {
      cart.products.push({
        productId: pid,
        quantity: quantity,
        price: product.price,
        description: product.description,
      });
    }

    cart.calculateTotal();
    await cart.save();
    return cart;
  } catch (error) {
    throw new Error('Error al agregar el producto al carrito');
  }
};

// Eliminar un producto del carrito
export const removeProductFromCart = async (cid, pid) => {
  try {
    const cart = await cartModel.findById(cid);
    if (!cart) throw new Error('Carrito no encontrado');

    const productIndex = cart.products.findIndex(
      (product) => product.productId.toString() === pid
    );

    if (productIndex === -1) throw new Error('Producto no encontrado en el carrito');

    cart.products.splice(productIndex, 1);
    cart.calculateTotal();
    await cart.save();
    return cart;
  } catch (error) {
    throw new Error('Error al eliminar el producto del carrito');
  }
};

// Vaciar el carrito
export const clearCart = async (cid) => {
  try {
    const cart = await cartModel.findById(cid);
    if (!cart) throw new Error('Carrito no encontrado');

    cart.products = [];
    cart.total = 0;
    await cart.save();
    return { message: 'Carrito vacío' };
  } catch (error) {
    throw new Error('Error al vaciar el carrito');
  }
};