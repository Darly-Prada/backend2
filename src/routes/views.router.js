import { Router } from 'express';
import cookieParser from 'cookie-parser';
import { getProducts, addProduct } from '../managers/productManager.js';

const router = Router();

 

// Configuración de cookie-parser
router.use(cookieParser("CoderS3cr3tC0d3"));

// Ruta de logout
router.get("/logout", (req, res) => {
  req.session.destroy(error => {
    if (error) {
      res.json({ error: "error logout", mensaje: "Error al cerrar la sesión" });
    }
    res.send("Sesión cerrada correctamente.");
  });
});

// Middleware de autenticación
function auth(req, res, next) {
  if (req.session.user && req.session.admin) {
    return next();
  } else {
    return res.status(403).send("Usuario no autorizado para ingresar a este recurso.");
  }
}


// Ruta privada de prueba
router.get('/private', auth, (req, res) => {
  res.send("Si estás viendo esto es porque pasaste la autorización a este recurso!");
});


router.get('/', async (req, res) => {
  try {
    const products = await getProducts();
    console.log('Productos obtenidos:', products); 

    // Renderizar la vista con los productos
    res.render('home', { products });
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).send('Error al obtener los productos');
  }
});
router.post('/api/products', async (req, res) => {
  const { title, description, price, stock, category, code } = req.body;

  try {
    const newProduct = await addProduct({ title, description, price, stock, category, code });
    res.status(201).json(newProduct);  
  } catch (error) {
    console.error('Error al agregar producto:', error);
    res.status(500).send('Error al agregar el producto');
  }
});
export default router;