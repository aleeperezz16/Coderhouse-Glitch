import { Router } from "express";
import { cpus } from "os";

const router = Router();

router.get("/", (req, res) => {
  res.json({
    num_random: Math.ceil(Math.random() * 1e9),
    procesadores: cpus().length 
  })
});

export { router };