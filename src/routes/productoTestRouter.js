import { Router } from "express";
import { faker } from "@faker-js/faker/locale/es";

const router = Router();

router.get("/", (req, res) => {
  const productos = [];
  for (let i = 0; i < 5; i++) {
    const nombre = faker.commerce.product();
    productos.push({
      nombre,
      precio: faker.commerce.price(),
      imagen: faker.image.imageUrl(undefined, undefined, nombre),
    });
  }

  res.render("productos", { productos });
});

export { router };