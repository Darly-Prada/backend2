import { Router } from 'express';
import passport from 'passport';
import userModel from '../models/user.model.js';
import { isValidPassword, generateJWToken } from '../utils.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';


const router = Router();


router.post("/register", async (req, res) => {
    const { first_name, last_name, email, password, age } = req.body;

    try {
        // Verificar si el usuario ya existe
        const existingUser = await userModel.findOne({ email: email });
        if (existingUser) {
            return res.status(400).json({ message: 'El usuario ya existe.' });
        }

        // Encriptar la contraseña
        const hashedPassword = bcrypt.hashSync(password, 10); // El número 10 es el número de rondas de salting

        // Crear el nuevo usuario
        const newUser = new userModel({
            first_name,
            last_name,
            email,
            password: hashedPassword,
            age,
            role: 'user'  // Asignar rol por defecto
        });

        // Guardar el nuevo usuario en la base de datos
        await newUser.save();

        // Responder con éxito
        res.status(201).send({ message: 'Usuario creado con éxito' });
    } catch (error) {
        console.error("Error al registrar el usuario:", error);
        res.status(500).send({ message: 'Error en el servidor' });
    }
});

router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await userModel.findOne({ email: email });
        if (!user) return res.status(401).json({ message: 'Usuario no encontrado' });
        const isValidPassword = (user, password) => {
            console.log(`Datos a validar: user-password: ${user.password}, password: ${password}`);
            return bcrypt.compareSync(password, user.password);
        }

        // Generar el JWT
        const tokenUser = {
            name: `${user.first_name} ${user.last_name}`,
            email: user.email,
            age: user.age,
            role: user.role,
            isAdmin: user.role === "admin"
        };

        const access_token = generateJWToken(tokenUser);

        // Enviar el token como cookie
        res.cookie("jwtCookieToken", access_token, {
            maxAge: 60000 * 60, // Expira en 1 hora
            httpOnly: true, // No accesible desde JavaScript
            secure: false // Cambiar a `true` en producción con HTTPS
        });

        res.json({
            message: "Login exitoso",
            jwt: access_token
        });

    } catch (error) {
        console.error("Error en el proceso de login:", error);
        return res.status(500).send({ status: "error", error: "Error interno de la aplicación." });
    }
});

// Ruta para obtener los datos del usuario asociado al JWT (si está logueado)
router.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
    if (req.user) {
        res.json(req.user); // Devuelve los datos del usuario asociado al token
    } else {
        res.status(401).json({ error: 'No autenticado' });
    }
});

// Ruta de logout para eliminar la cookie
router.get("/logout", (req, res) => {
    res.clearCookie("jwtCookieToken");
    res.redirect("/users/login");
});

export default router;
