import { Router } from "express";
import { faker } from "@faker-js/faker/locale/es";
import cookieParser from "cookie-parser";
import session from "express-session";
import MongoStore from "connect-mongo";
import { mongo } from "../config/index.js";

const router = Router();

router.use(cookieParser());
router.use(session({
  store: MongoStore.create({ 
    mongoUrl: mongo.uri,
    mongoOptions: {
      useNewUrlParser: true,
      useUnifiedTopology: true
    },
    ttl: 60
  }),
  secret: "esto es un secreto",
  resave: true,
  saveUninitialized: false
}));

const checkLogin = (req, res, next) => {
  if (req.session?.user)
    return next();
  
  return res.render("login");
};

router.get("/", checkLogin, (req, res) => {
  const productos = [];
  for (let i = 0; i < 5; i++) {
    const nombre = faker.commerce.product();
    productos.push({
      nombre,
      precio: faker.commerce.price(),
      imagen: faker.image.imageUrl(undefined, undefined, nombre),
    });
  }

  res.render("productos", { productos, user: req.session?.user });
});

router.post("/", (req, res) => {
  const { user } = req.body;
  req.session.user = user;

  res.redirect(req.baseUrl);
});

router.get("/logout", (req, res) => {
  const user = req.session?.user;
  req.session.destroy(err => {
    if (err)
      return res.json({ status: "Logout ERROR", body: err });
    
    return res.render("logout", { user });
  });
});

export { router };