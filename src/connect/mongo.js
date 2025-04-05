import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export const connectMongoDB = async () => {
  try {
    // Conectar a la base de datos principal (ShopFem)
    await mongoose.connect(process.env.MONGO_URL, { dbName: 'productsModel' });
    console.log('Conectado a la base de Productos');
  } catch (error) {
    console.error("Error de conexión a MongoDB ShopFem:", error);
  }
};

