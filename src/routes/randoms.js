import { Router } from "express";
import { cpus } from "os";
import pino from "pino";

const router = Router();

router.use((req, res, next) => {
  pino().info("Ruta %s metodo %s", req.baseUrl, req.method);
  next();
});

router.get("/", (req, res) => {
  res.json({
    num_random: Math.ceil(Math.random() * 1e9),
    procesadores: cpus().length 
  })
});

export { router };