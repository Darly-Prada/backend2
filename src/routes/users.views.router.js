import { Router } from "express";
import { passportCall, authorization } from '../utils.js';
import passport from 'passport';

import {productModel} from "../models/productModel.js" ;


const router = Router();


router.get("/login", (req, res) => {
    res.render("login");
});

router.get("/register", (req, res) => {
    res.render("register");
});

// Perfil de User
router.get("/",
    passportCall('jwt'),
    async (req, res) => {
        try {
            const products = await productModel.find().lean();  
             
            res.render("profile", {
                user: req.user,   
                products: products  
            });
        } catch (error) {
            console.error("Error al obtener productos:", error);
            res.status(500).send("Error interno");
        }
    });

// Perfil del ADMIN
router.get("/admin",
    passportCall('jwt'),
    authorization("admin"),
    (req, res) => {
        res.render("admin", {
            user: req.user
        });
    });

router.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
    if (req.user) {
        res.render('profile', { user: req.user });  
    } else {
        res.redirect('/login');
    }
});

export default router;