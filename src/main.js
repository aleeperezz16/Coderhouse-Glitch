const express = require("express");
const { engine } = require("express-handlebars");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", require("./apiRoutes"));
app.use("/productos", require("./prodRoutes"));
// app.use("/static", express.static(__dirname + "/../public"));

app.engine("hbs", engine({extname: "hbs"}));
app.set("views", "./views/hbs");
app.set("view engine", "hbs");

app.get("/", (req, res) => {
  res.render("formulario");
});

app.listen(8080, () => {
  console.log("Servidor escuchando puerto 8080");
});