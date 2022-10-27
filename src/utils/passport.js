import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import express from 'express';
import session from 'express-session';
import bcrypt from 'bcrypt';
import { Usuarios } from '../services';
import config from './config';

const app = express();
app.use(
  session({
    secret: config.session,
    resave: true,
    saveUninitialized: false,
    cookie: { maxAge: 60000 },
  }),
);

app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new LocalStrategy(
    { usernameField: 'email' },
    async (email, password, done) => {
      const result = await Usuarios.buscar(email);
      const isMatch = result ? await bcrypt.compare(password, result.password) : false;

      return done(null, isMatch ? result : false);
    },
  ),
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const user = await Usuarios.buscarPorId(id);
  done(null, user);
});
