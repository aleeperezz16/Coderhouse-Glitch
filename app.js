import "dotenv/config";
import express from "express";
import session from "express-session";
import mongoose from "mongoose";
import passport from "passport";
import bcrypt from "bcrypt";
import { mongo, sessionSecret } from "./src/config/index.js";
import { Strategy as LocalStrategy } from "passport-local";
import {
  carritoApiRouter,
  loginRouter,
  productoApiRouter,
  registerRouter,
  logoutRouter,
} from "./src/routes/index.js";
import usuarios from "./src/daos/usuarios.js";

mongoose.connect(mongo.uri, { dbName: mongo.db });

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: sessionSecret,
    resave: true,
    saveUninitialized: false,
    cookie: { maxAge: 60000 },
  })
);

app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new LocalStrategy(
    { usernameField: "email" },
    async (email, password, done) => {
      const result = await usuarios.findOne({ email });
      const isMatch = result
        ? await bcrypt.compare(password, result.password)
        : false;

      return done(null, isMatch ? result : false);
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const user = await usuarios.findById(id);
  done(null, user);
});

app.use("/api/productos", productoApiRouter);
app.use("/api/carrito", carritoApiRouter);
app.use("/register", registerRouter);
app.use("/login", loginRouter);
app.use("/logout", logoutRouter);
app.use((req, res) => {
  res.status(404).json({
    error: -2,
    descripcion: `Ruta '${req.url}' método '${req.method}' no implementado`,
  });
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
