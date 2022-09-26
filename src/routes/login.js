import { Router } from "express";
import passport from "passport";

const router = Router();

const auth = (req, res, next) => {
  if (req.isAuthenticated())
    res.status(400).json({ error: "Ya se encuentra logueado" });
  else next();
};

router.post(
  "/",
  auth,
  passport.authenticate("local", { failureRedirect: "/login/error" }),
  (req, res) => {
    res.status(200).send("Login exitoso");
  }
);

router.get("/error", (req, res) => {
  res.status(400).json({ error: "Credenciales inválidas" });
});

export { router };
