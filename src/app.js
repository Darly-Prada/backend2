import express from 'express';
import path from 'path';
import handlebars from 'express-handlebars';
import __dirname from './utils.js';
import session from 'express-session';
import MongoStore from 'connect-mongo';

import { connectMongoDB } from "./connect/mongo.js";
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser';
import passport from 'passport';
import initializePassport from './config/passport.config.js';

// import Routes
import sessionsRouter from './routes/sessions.router.js';
import usersViewRouter from './routes/users.views.router.js';
import viewsRoutes from "./routes/views.router.js";
import productRoutes from './routes/productRoutes.js';   
import cartRoutes from './routes/cartRoutes.js';   



const app = express();
dotenv.config();

// Url Mongo 
const urlMongo = process.env.MONGO_URL;

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

// Configuración de Handlebars
app.engine('handlebars', handlebars.engine({
    allowProtoPropertiesByDefault: true, 
    allowProtoMethodsByDefault: true,  
  }));

  // Establecer vistas y motor de plantillas
  app.set('views', __dirname + '/views');
  app.set('view engine', 'handlebars');
  
  
  //archivos estáticos
  app.use('/static', express.static(path.join(__dirname, 'public')));
  app.use(express.static(__dirname + '/public'));

// Cookies
app.use(cookieParser("CoderS3cr3tC0d3"));

// Configuración de PASSPORT
initializePassport();  
app.use(passport.initialize());

// Configuración de express-session
app.use(session({
    secret: 'clave-secreta',    
    resave: false,           
    saveUninitialized: false,  
    store: MongoStore.create({
        mongoUrl: urlMongo,  
        ttl: 4 * 24 * 60 * 6 
    })
}));

// Configuración de passport para gestionar sesiones
app.use(passport.session());

// Declaracion de rutas:
app.use('/', viewsRoutes);  
app.use('/users', usersViewRouter); 
app.use("/api/sessions", sessionsRouter);
app.use('/api/products', productRoutes);
app.use('/api/carts', cartRoutes);


const SERVER_PORT = process.env.SERVER_PORT;
app.listen(SERVER_PORT, () => {
    console.log("Servidor escuchando por el puerto: " + SERVER_PORT);
});

connectMongoDB()
