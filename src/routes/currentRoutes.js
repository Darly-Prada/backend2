import express from 'express';
import passport from 'passport';
 

const router = express.Router();

// Endpoint '/current' para obtener el usuario autenticado
router.get('/current', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        // Verifica si el usuario está autenticado
        if (!req.user) {
            return res.status(401).json({ message: 'No autenticado' });
        }

        // Obtener el usuario desde la base de datos, incluyendo el carrito
        const user = await userModel.findById(req.user._id).populate('cart'); // Usamos populate para obtener el carrito

        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        // Asegurarse de que si no existe un carrito, se devuelva uno vacío
        const cart = user.cart || { products: [], total: 0 };

        return res.json({
            email: user.email,
            first_name: user.first_name,
            last_name: user.last_name,
            cart: cart // Devolver el carrito completo o vacío
        });

    } catch (error) {
        console.error("Error al obtener el producto:", error);
        return res.status(500).json({ message: 'Error al obtener el usuario' });
    }
});

export default router; 