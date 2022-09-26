import { Router } from "express";

const router = Router();
const auth = (req, res, next) => {
  if (!req.isAuthenticated())
    res.status(400).json({ error: "No se encuentra logueado" });
  else next();
};

router.post("/", auth, (req, res) => {
  const { nombre } = req.user;
  req.session.destroy((err) => {
    if (err)
      res.status(500).json({ error: "Hubo un problema al desloguearte" });
    else res.status(200).send(`Hasta luego ${nombre}`);
  });
});

export { router };
