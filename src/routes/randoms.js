import { Router } from "express";
import { fork } from "child_process";

const router = Router();

router.get("/", (req, res) => {
  const { cant = 1e8 } = req.query;
  const child = fork("./src/random.js");

  child.send(cant);
  child.on("message", msg => {
    res.json({ numeros: msg });
  });
});

export { router };