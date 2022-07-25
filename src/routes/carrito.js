import { Router } from "express";
import { carritoApi, productosApi } from "../daos/index.js";
const router = Router();

const carrito = carritoApi;
const productos = productosApi;

router.route("/")
  .post((req, res) => {
    const esCarritoValido = (data) => {
      return data.productos && data.productos.length;
    }

    const carrito = req.body;

    if (esCarritoValido(carrito)) {
      carrito.timestamp = new Date().getTime();

      carrito.save(carrito)
        .then(id => res.status(201).send(`Carrito de compras creado con id: ${id}`))
        .catch(err => res.status(400).json({ error: "Carrito " + err.message }));
    } else
      res.sendStatus(400);
  });

router.route("/:id")
  .delete((req, res) => {
    carrito.deleteById(Number(req.params.id))
      .then(() => res.sendStatus(200))
      .catch(err => res.status(400).json({ error: "Carrito " + err.message }));
  })

router.route("/:id/productos")
  .get((req, res) => {
    carrito.getById(Number(req.params.id))
      .then(carrito => carrito.productos ? res.status(200).json(carrito.productos) : res.status(404).json({ error: "No hay productos" }))
      .catch(err => res.status(400).json({ error: "Carrito " + err.message }));
  })
  .post((req, res) => {
    carrito.getById(Number(req.params.id))
      .then(carrito => {
        const { id } = Number(req.body);

        if (isNaN(id))
          res.sendStatus(400);
        else {
          productos.getById(id)
            .then(prod => {
              carrito.productos.push(prod);

              carrito.save(carrito)
                .then(() => res.sendStatus(201))
                .catch(err => res.status(400).json({ error: "Carrito " + err.message }));
            })
            .catch(err => res.status(400).json({ error: "Producto " + err.message }));
        }
      })
      .catch(err => res.status(400).json({ error: "Carrito " + err.message }));
  })

router.route("/:id/productos/:id_prod")
  .delete((req, res) => {
    carrito.getById(Number(req.params.id))
      .then(carrito => {
        const idProd = Number(req.params.id_prod);
        
        carrito.productos.forEach((elem, index) => {
          if (index === idProd) {
            carrito.productos.splice(index, 1);
            return true;
          }
        })

        return false;
      })
      .then(result => result ? res.sendStatus(200) : res.status(404).json({ error: "Producto no encontrado" }))
      .catch(err => res.status(400).json({ error: "Carrito " + err.message }));
  })

export { router };