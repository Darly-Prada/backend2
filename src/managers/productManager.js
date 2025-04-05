import { productModel } from '../models/productModel.js';


// Obtener todos los productos

export const getProducts = async () => {
  try {
    return await productModel.find().lean(); // .lean() está aquí
  } catch (error) {
    throw new Error('Error al obtener los productos');
  }
};


// Obtener un producto por ID
export const getProductById = async (id) => {
  try {
    return await productModel.findById(id); // Devuelve el producto por ID
  } catch (error) {
    throw new Error('Error al obtener el producto');
  }
};

// Agregar un nuevo producto
export const addProduct = async ({ title, description, price, stock, category, code }) => {
  try {
    const newProduct = new productModel({ title, description, price, stock, category, code });
    await newProduct.save();
    return newProduct;  // Devuelve el nuevo producto creado
  } catch (error) {
    throw new Error('Error al agregar el producto');
  }
};

// Actualizar un producto
export const updateProduct = async (id, { title, description, price, stock, category, code }) => {
  try {
    const updatedProduct = await productModel.findByIdAndUpdate(id, { title, description, price, stock, category, code }, { new: true });
    return updatedProduct;
  } catch (error) {
    throw new Error('Error al actualizar el producto');
  }
};

// Eliminar un producto
export const deleteProduct = async (id) => {
  try {
    const deletedProduct = await productModel.findByIdAndDelete(id);
    return deletedProduct;
  } catch (error) {
    throw new Error('Error al eliminar el producto');
  }
};

