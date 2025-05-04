import { fileURLToPath } from 'url';
import { dirname } from 'path';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import passport from 'passport';
import dotenv from 'dotenv';

dotenv.config(); // Cargar variables desde .env

// Paths
export const __filename = fileURLToPath(import.meta.url);
export const __dirname = dirname(__filename);

// Hash de contraseñas
export const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10));

// Validación de contraseña
export const isValidPassword = (inputPassword, userHashedPassword) => {
    console.log(`Validando: password: ${inputPassword}, hashed: ${userHashedPassword}`);
    return bcrypt.compareSync(inputPassword, userHashedPassword); 
};

// Clave privada para JWT (usar variable de entorno si está disponible)
export const PRIVATE_KEY = process.env.JWT_PRIVATE_KEY || "CoderhouseBackendCourseSecretKeyJWT";

// Generar token JWT
export const generateJWToken = (user) => {
    return jwt.sign({ user }, PRIVATE_KEY, { expiresIn: '24h' });
};

// Middleware para estrategias de Passport
export const passportCall = (strategy) => {
    return async (req, res, next) => {
        console.log("Ejecutando estrategia Passport:", strategy);
        passport.authenticate(strategy, function (err, user, info) {
            if (err) return next(err);
            if (!user) {
                return res.status(401).send({
                    error: info?.message || info.toString()
                });
            }
            console.log("Usuario autenticado:", user);
            req.user = user;
            next();
        })(req, res, next);
    };
};

// Extraer JWT desde cookies
export const cookieExtractor = req => {
    let token = null;
    if (req && req.cookies) {
        token = req.cookies['jwtCookieToken'];
        console.log("Token JWT extraído desde cookie:", token);
    }
    return token;
};

// Autorización por rol
export const authorization = (role) => {
    return async (req, res, next) => {
        if (!req.user) return res.status(401).send("No autorizado: usuario no encontrado.");
        if (req.user.role !== role) {
            return res.status(403).send("Acceso denegado: permisos insuficientes.");
        }
        next();
    };
};