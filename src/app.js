import express from 'express';
import cookieParser from 'cookie-parser';
import { engine } from 'express-handlebars'
import session from 'express-session';
import MongoStore from 'connect-mongo';
import mongoose from 'mongoose';
import passport from 'passport';
import initializePassport from './config/passport.config.js';
import * as dotenv from "dotenv"

import viewsRouter from './routes/views.routes.js'
import registroRouter from './routes/registro.routes.js'
import loginRouter from './routes/login.routes.js'
import productsRoutes from './routes/product.routes.js'
import cartRoutes from './routes/cart.routes.js'
import githubRoutes from './routes/github.routes.js'

dotenv.config();
const app = express();
const PORT = 8080;
const STRING_CONNECTION = `mongodb+srv://ifrank:focus1000@cluster0.cmqpdge.mongodb.net/coderhouse?retryWrites=true&w=majority`;

app.use(express.json());

app.engine('handlebars', engine())
app.set('view engine', 'handlebars')
app.set('views', './src/views')
app.use(express.static('public'))

const server = app.listen(PORT, () => { console.log(`Server listening on port ${PORT}`); });

app.use(cookieParser())


app.use(session({
    store: MongoStore.create({
        mongoUrl: STRING_CONNECTION,
        mongoOptions: {useNewUrlParser: true, useUnifiedTopology: true},
        ttl: 10000
    }),
    secret: 'coderSecrets',
    resave: true,
    saveUninitialized: true
}))

initializePassport()
app.use(passport.initialize())
app.use(passport.session())


app.use('/', viewsRouter)
app.use('/api/registro', registroRouter )
app.use('/api/login', loginRouter )
app.use('/api/products', productsRoutes)
app.use('/api/carts', cartRoutes)
app.use('/api/sessions', githubRoutes)

mongoose.set('strictQuery', false);

const environment = async () => {
    await mongoose
      .connect(STRING_CONNECTION)
      .then(() => console.log("Conectado a la base de datos"))
      .catch((error) => console.log("Error de conexion", error));
  };
  
environment();