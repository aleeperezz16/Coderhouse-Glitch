const express = require("express");
const router = require("./routes");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", router);
app.use("/static", express.static(__dirname + "/../public"));

app.listen(8080, () => {
  console.log("Servidor escuchando puerto 8080");
});