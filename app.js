import "dotenv/config";
import express from "express";
import http from "http";
import path from "path";
import { Server } from "socket.io";
import { fileURLToPath } from "url";
import { productoTestRouter } from "./src/routes/index.js";
import { mensajesApi } from "./src/daos/index.js";
import { normalize, schema } from "normalizr";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const mensajes = mensajesApi;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set("views", path.join(__dirname, "/src/views"));
app.set("view engine", "ejs");

app.use("/api/productos-test", productoTestRouter);
app.use("/api/mensajes", express.static(path.join(__dirname, "public")));

app.use((req, res) => {
  res.status(404).json({ error: -2, descripcion: `Ruta '${req.url}' método '${req.method}' no implementado` });
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

const PORT = process.env.PORT || 8080;

server.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});