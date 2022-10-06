import { Router } from "express";
import passport from "passport";
import log4js from "log4js";

const router = Router();
const auth = (req, res, next) => {
  if (req.isAuthenticated()) {
    res.status(400).json({ status: "Ya se encuentra logueado" });
    log4js
      .getLogger("app.login")
      .warn("Usuario %s ya inició sesión", req.user.email);
  } else next();
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
  res.status(400).json({ status: "Credenciales inválidas" });
  log4js.getLogger("app.login").error("Credenciales inválidas");
});

export { router };
