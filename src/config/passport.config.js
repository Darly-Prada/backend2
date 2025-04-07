import passport from 'passport';
import passportLocal from 'passport-local';
import jwtStrategy from 'passport-jwt';

import userModel from '../models/user.model.js';
import { cartModel } from '../models/cartModel.js';

import { createHash, PRIVATE_KEY, cookieExtractor } from '../utils.js';

// Declaramos nuestras estrategias:
const localStrategy = passportLocal.Strategy;
const JwtStrategy = jwtStrategy.Strategy;
const ExtractJWT = jwtStrategy.ExtractJwt;



const initializePassport = () => {
    /*=============================================
    =                JWTStrategy                  =
    =============================================*/
    passport.use('jwt', new JwtStrategy(
        
        {
            jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
            secretOrKey: PRIVATE_KEY
        },
        async (jwt_payload, done) => {
            console.log("Entrando a passport Strategy con JWT.");
            try {
                console.log("JWT obtenido del payload");
                console.log(jwt_payload);
                return done(null, jwt_payload.user);
            } catch (error) {
                console.error("Error en la estrategia JWT:", error);
                return done(error);
            }
        }
    ));
    /*=============================================
    =                localStrategy                =
    =============================================*/
    
    // Estrategia de registro de usuario
    
    passport.use('register', new localStrategy(
        { passReqToCallback: true, usernameField: 'email' },
        async (req, username, password, done) => {
    
            const { first_name, last_name, age, email } = req.body;
        
            try {
                // Verificar si el usuario ya existe
                const exists = await userModel.findOne({ email });
                if (exists) {
                    console.log("El usuario ya existe.");
                    return done(null, false, { message: 'El correo electrónico ya está registrado.' });
                }
        
                // Crear el nuevo usuario
                const user = new userModel({
                    first_name,
                    last_name,
                    email,  
                    age,
                    password: createHash(password),  
                    loggedBy: 'App'
                });
        
                // Crear el carrito vacío para el usuario
            const cart = new cartModel({ user: user._id, products: [] });
                await cart.save();
        
                // Asignar el carrito al usuario
                user.cart = cart._id;  
                await user.save();  
        
                // Si todo sale bien, devolvemos el usuario
                return done(null, user);
        
            } catch (error) {
                console.error("Error registrando el usuario:", error);
                return done(error);
            }
        }
    ));

    /*=============================================
    = Funciones de Serialización y Desserialización =
    =============================================*/
    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            let user = await userModel.findById(id).populate('cart');  
            done(null, user);
        } catch (error) {
            console.error("Error deserializando el usuario:", error);
            done(error);
        }
    });
}

export default initializePassport;