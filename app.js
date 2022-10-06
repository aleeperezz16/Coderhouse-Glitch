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
  homeRouter,
  pedidoRouter,
} from "./src/routes/index.js";
import usuarios from "./src/daos/usuarios.daos.js";
import logj4s from "log4js";
import cluster from "cluster";
import { cpus } from "os";

mongoose.connect(mongo.uri, { dbName: mongo.db });
logj4s.configure({
  appenders: {
    consola: { type: "console" },
    logs: {
      type: "multiFile",
      base: "./logs/",
      property: "categoryName",
      extension: ".log",
    },
  },
  categories: {
    default: { appenders: ["consola"], level: "all" },
    app: { appenders: ["consola", "logs"], level: "info" },
  },
});

const app = express();
const useCluster = true;

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
app.use("/pedido", pedidoRouter);
app.use("/", homeRouter);
app.use((req, res) => {
  res.status(404).json({
    error: -2,
    descripcion: `Ruta '${req.url}' método '${req.method}' no implementado`,
  });
  logj4s
    .getLogger("app")
    .error("Ruta %s método %s no implementado", req.url, req.method);
});

const PORT = process.env.PORT || 8080;

if (useCluster && cluster.isPrimary) {
  logj4s.getLogger().trace("Iniciando cluster");
  const numCpus = cpus().length;

  for (let i = 0; i < numCpus; i++) cluster.fork();

  cluster.on("exit", (worker) => {
    logj4s.getLogger().info("Worker %d finalizado", worker.process.pid);
    cluster.fork();
  });
} else {
  app.listen(PORT, () => {
    if (useCluster)
      logj4s
        .getLogger("app")
        .info("Servidor corriendo en puerto %s - PID: %d", PORT, process.pid);
    else logj4s.getLogger("app").info("Servidor corriendo en puerto %s", PORT);
  });
}
