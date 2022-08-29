import { Router } from "express";

const router = Router();

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