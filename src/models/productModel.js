import { model, Schema } from "mongoose";



const productSchema = new Schema({
  title: String,
  description: String,
  price: {
    type: Number,
    required: true,
  },
  stock: {
    type: Number,
    required: true,
  },
  category: String,
  status: Boolean,
});



const productModel = model("productModel", productSchema);  // Asegúrate de que el nombre coincida con la referencia
export { productModel };