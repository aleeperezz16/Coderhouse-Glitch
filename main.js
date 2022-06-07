import express from "express";
import Contenedor from "./Contenedor.js";

const app = express();
app.listen(8080);

const productos = new Contenedor("./productos.txt");

app.get("/productos", (req, res) => {
  productos.getAll().then(result => res.send(result));
})

app.get("/productoRandom", (req, res) => {
  productos.getAll().then(result => {
    const prodAll = result;
    res.send(prodAll[Math.floor(Math.random() * prodAll.length)]);
  });
})