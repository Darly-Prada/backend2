import { model, Schema } from "mongoose";

// Definir el nombre de la colección de carritos
const cartCollection = "Carrito"; 

const cartSchema = new Schema({
  products: [
    {
      productId: {
        type: Schema.Types.ObjectId,
        ref: "productModel",  // Aquí se hace referencia al nombre del modelo de productos
        required: true
      },
      quantity: {
        type: Number,
        required: true,
        default: 0
      },
      price: {
        type: Number,
      },
      description: String
    }
  ],
  total: {
    type: Number,
    default: 0
  }
});

// Método para calcular el total del carrito
cartSchema.methods.calculateTotal = function() {
  this.total = this.products.reduce((total, product) => {
    const productPrice = product.price || 0;
    const productQuantity = product.quantity || 0;
    return total + (productPrice * productQuantity);
  }, 0);
  
  return this.total;
};

// Asegúrate de actualizar el total cada vez que se modifique el carrito
cartSchema.pre('save', function(next) {
  this.calculateTotal();
  next();
});

// Crear el modelo para el carrito
export const cartModel = model(cartCollection, cartSchema); 

 