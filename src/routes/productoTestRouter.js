import { Router } from "express";
import { faker } from "@faker-js/faker/locale/es";
import { mongo, secret } from "../config/index.js";
import { Strategy } from "passport-local";
import session from "express-session";
import passport from "passport";
import mongoose from "mongoose";
import bcrypt from "bcrypt";

mongoose.connect(mongo.uri, { useNewUrlParser: true, useUnifiedTopology: true, dbName: mongo.dbName });

const LocalStrategy = Strategy;
const router = Router();
const usuarios = mongoose.model("usuarios", new mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String, required: true }
}));

router.use(session({
  secret,
  resave: true,
  saveUninitialized: false,
  cookie: { maxAge: 60000 }
}));

router.use(passport.initialize());
router.use(passport.session());

passport.use(
  new LocalStrategy({ usernameField: "email" }, (username, password, done) => {
    usuarios.findOne({ email: username }, (err, user) => {
      if (err)
        console.log(err);

      bcrypt.compare(password, user?.password, (err, isMatch) => {
        if (err)
          console.log(err);

        return done(null, isMatch ? user : false);
      });
    });
  }
  ));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const user = await usuarios.findById(id);
  done(null, user);
});

const auth = (req, res, next) => {
  return res.isAuthenticated() ? next() : res.redirect(req.baseUrl + "/login");
};

router.get("/", auth, (req, res) => {
  if (req.user) {
    const productos = [];
    for (let i = 0; i < 5; i++) {
      const nombre = faker.commerce.product();
      productos.push({
        nombre,
        precio: faker.commerce.price(),
        imagen: faker.image.imageUrl(undefined, undefined, nombre),
      });
    }

    res.render("productos", { productos, user: req.user.email });
  } else
    res.redirect(req.baseUrl + "/login");
});

router.route("/login")
  .get((req, res) => {
    res.render("login");
  })
  .post(passport.authenticate("local", { failureRedirect: "login-error" }), (req, res) => {
    res.redirect(req.baseUrl);
  });

router.get("/login-error", (req, res) => {
  res.render("login-error");
})

router.route("/register")
  .get((req, res) => {
    res.render("register");
  })
  .post((req, res) => {
    const { email, password } = req.body;
    usuarios.findOne({ email }, async (err, user) => {
      if (err) {
        console.log(err);
        return;
      }

      if (user)
        res.render("register-error");
      else {
        const hashed = await bcrypt.hash(password, 10);
        const newUser = new usuarios({
          email,
          password: hashed
        });

        await newUser.save();
        res.redirect(req.baseUrl + "/login");
      }
    });
  });

router.get("/logout", (req, res) => {
  const user = req.session?.user;
  req.session.destroy(err => {
    return err ? res.json({ status: "Logout ERROR", body: err }) : res.render("logout", { user });
  });
});

export { router };