import { Router } from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { passportCall } from '../utils.js';

import userModel from '../models/user.model.js';
import { productModel } from '../models/productModel.js';

import { isValidPassword, generateJWToken } from '../utils.js'; 

const router = Router();

// ========== Registro ==========
router.post("/register", async (req, res) => {
    const { first_name, last_name, email, password, age } = req.body;

    try {
        // Verificar si el usuario ya existe
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'El usuario ya existe.' });
        }

        // Crear el nuevo usuario
        const newUser = new userModel({
            first_name,
            last_name,
            email,
            password, 
            age,
            role: 'user',
        });

        // Guardamos el usuario en la base de datos
        await newUser.save();

        // Responder con el mensaje de éxito
        res.status(201).send({ message: 'Usuario creado con éxito' });
    } catch (error) {
        console.error("Error al registrar el usuario:", error);
        res.status(500).send({ message: 'Error en el servidor' });
    }
});

// ========== Login ==========
 
router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await userModel.findOne({ email: email });
        if (!user) return res.status(401).json({ message: 'Usuario no encontrado' });

        const isPasswordValid = isValidPassword(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Contraseña incorrecta' });
        }

        const tokenUser = {
            id: user._id,
            name: `${user.first_name} ${user.last_name}`,
            email: user.email,
            role: user.role,
            cart: user.cart?._id || null
        };

        const access_token = generateJWToken(tokenUser);

        // Establecer el token como una cookie
        res.cookie('jwtCookieToken', access_token, {
            maxAge: 24 * 60 * 60 * 1000,
            httpOnly: true
        });

        res.status(200).json({
            message: "Login exitoso",
            jwt: access_token // Puedes seguir enviando el token en el body si lo necesitas en el frontend inmediatamente
        });
    } catch (error) {
        console.error("Error en el proceso de login:", error);
        return res.status(500).send({ status: "error", error: "Error interno de la aplicación." });
    }
});


router.get('/users', passportCall('jwt'), async (req, res) => {
    try {
        const products = await productModel.find().lean();
        console.log("Productos para renderizar en perfil:", products);

        res.render('users', {
            user: req.user,
            products
        });
    } catch (err) {
        console.error("Error al cargar productos en la vista de usuario:", err);
        res.status(500).send("Error al cargar productos");
    }
});

// ========== Current ==========
router.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
    if (req.user) {
        res.json(req.user);  // Devolver el usuario autenticado
    } else {
        res.status(401).json({ error: 'No autenticado' });
    }
});

// ========== Logout ==========
router.get("/logout", (req, res) => {
    // Si en algún punto usás cookies, podés limpiar:
    res.clearCookie("jwtCookieToken");
    res.redirect("/users/login");
});

export default router;

