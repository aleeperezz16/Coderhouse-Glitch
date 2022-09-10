import "dotenv/config";
import express from "express";
import http from "http";
import path from "path";
import { Server } from "socket.io";
import { fileURLToPath } from "url";
import { productoTestRouter, infoRouter, randomRouter } from "./src/routes/index.js";
import { mensajesApi } from "./src/daos/index.js";
import { normalize, schema } from "normalizr";
import minimist from "minimist";
import cluster from "cluster";
import { cpus } from "os";
import pino from "pino";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const mensajes = mensajesApi;
const args = minimist(process.argv, {
  alias: {
    p: "PORT"
  },
  default: {
    PORT: 8080
  }
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set("views", path.join(__dirname, "/src/views"));
app.set("view engine", "ejs");

app.use("/api/productos-test", productoTestRouter);
app.use("/api/mensajes", express.static(path.join(__dirname, "public")));
app.use("/api/randoms", randomRouter);
app.use("/info", infoRouter);

app.use((req, res, next) => {
  res.status(404).json({ error: -2, descripcion: `Ruta '${req.url}' método '${req.method}' no implementado` });
  pino("./logs/warn.log").warn("Ruta %s metodo %s no implementado", req.url, req.method);
  next();
});

const authorSchema = new schema.Entity("author", undefined, { idAttribute: "email" });
const postsSchema = new schema.Entity("posts", {
  mensajes: [{ author: authorSchema }]
});

io.on("connection", async (socket) => {
  const allMessages = {
    id: "mensajes",
    mensajes: []
  };

  allMessages.mensajes = await mensajes.getAll();
  socket.emit("cargar-mensajes", normalize(allMessages, postsSchema));

  socket.on("enviar-mensaje", async (data) => {
    await mensajes.save(data);
    allMessages.mensajes = await mensajes.getAll();
    
    io.sockets.emit("cargar-mensajes", normalize(allMessages, postsSchema));
  })
});

const PORT = args["PORT"];

if (cluster.isPrimary) {
  const numCPUs = cpus().length;

  for (let i = 0; i < numCPUs; i++)
    cluster.fork();

  cluster.on("exit", (worker) => {
    console.log(`Worker finalizó ${new Date().toLocaleString()}`);
  });
} else {
  server.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT} - PID ${process.pid}`);
  });
}

