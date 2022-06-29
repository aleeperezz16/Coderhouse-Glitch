const express = require("express");
const { Server: HttpServer } = require("http");
const { Server: IOServer } = require("socket.io");
const Chat = require("./src/Chat");
const Container = require("./src/Contenedor");
const {renderFile} = require("pug");

const app = express();
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);
const chat = new Chat("./data/mensajes.txt");
const contenedor = new Container("./data/productos.txt");

app.set("views", `${__dirname}/views/pug`);
app.set("view engine", "pug");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(`${__dirname}/public`));

app.use("/", require("./routes/index"));
app.use("/api", require("./routes/api"));
app.use("/productos", require("./routes/productos"));

io.on("connection", socket => {
  // Productos
  contenedor.getAll()
    .then(res => socket.emit("cargar-tabla", res));
  socket.on("agregar-producto", data => {
    contenedor.save(data)
      .then(() => {
        contenedor.getAll()
          .then(res => io.sockets.emit("cargar-tabla", res));
      })
  });

  // Chat
  chat.getMessages()
    .then(res => socket.emit("cargar-mensajes", res));
  socket.on("enviar-mensaje", data => {
    chat.save(data)
      .then(() => {
        chat.getMessages()
          .then(res => io.sockets.emit("cargar-mensajes", res));
      });
  });
});

const PORT = process.env.PORT || 8080;

httpServer.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});