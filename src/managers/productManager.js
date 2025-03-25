import { productModel } from '../models/productModel.js';

// Obtener todos los productos
export const getProducts = async () => {
  try {
    return await productModel.find();
  } catch (error) {
    throw new Error('Error al obtener los productos');
  }
};

// Obtener un producto por ID
export const getProductById = async (id) => {
  try {
    const product = await productModel.findById(id);
    if (!product) throw new Error('Producto no encontrado');
    return product;
  } catch (error) {
    throw new Error('Error al obtener el producto');
  }
};

// Agregar un nuevo producto
export const addProduct = async (productData) => {
  try {
    const newProduct = new productModel(productData);
    await newProduct.save();
    return newProduct;
  } catch (error) {
    throw new Error('Error al agregar el producto');
  }
};

// Actualizar un producto existente
export const updateProduct = async (id, updatedData) => {
  try {
    const updatedProduct = await productModel.findByIdAndUpdate(id, updatedData, { new: true });
    if (!updatedProduct) throw new Error('Producto no encontrado');
    return updatedProduct;
  } catch (error) {
    throw new Error('Error al actualizar el producto');
  }
};

// Eliminar un producto
export const deleteProduct = async (id) => {
  try {
    const deletedProduct = await productModel.findByIdAndDelete(id);
    if (!deletedProduct) throw new Error('Producto no encontrado');
    return { message: 'Producto eliminado' };
  } catch (error) {
    throw new Error('Error al eliminar el producto');
  }
};
