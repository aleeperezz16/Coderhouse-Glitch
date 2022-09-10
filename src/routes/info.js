import { Router } from "express";
import compression from "compression";
import pino from "pino";

const router = Router();
router.use(compression());

router.use((req, res, next) => {
  pino().info("Ruta %s metodo %s", req.baseUrl, req.method);
  next();
});

router.get("/", (req, res) => {
  res.json({
    argumentos: process.argv.slice(2),
    plataforma: process.platform,
    node: process.version,
    rss: process.memoryUsage().rss,
    path: process.execPath,
    pid: process.pid,
    carpeta: process.cwd()
  });
});

export { router };