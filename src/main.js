const express = require("express");
const { engine } = require("express-handlebars");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", require("./apiRoutes"));
app.use("/productos", require("./prodRoutes"));
app.use(express.static("./public"));

// Handlebars
/*app.engine("hbs", engine({extname: "hbs"}));
app.set("views", "./views/hbs");
app.set("view engine", "hbs");*/

// Pug
/*app.set("views", "./views/pug");
app.set("view engine", "pug");*/

// EJS
app.set("views", "./views/ejs");
app.set("view engine", "ejs");

app.listen(8080, () => {
  console.log("Servidor escuchando puerto 8080");
});