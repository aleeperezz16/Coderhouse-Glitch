import koaPassport from 'koa-passport';
import bcrypt from 'bcrypt';
import { Strategy as LocalStrategy } from 'passport-local';
import controller from '../controllers';

const { usuarios } = controller;

koaPassport.use(
  new LocalStrategy(
    { usernameField: 'email' },
    async (email, password, done) => {
      const result = await usuarios.obtener(email);
      const isMatch = result ? await bcrypt.compare(password, result.password) : false;

      return done(null, isMatch ? result : false);
    },
  ),
);

koaPassport.serializeUser((user, done) => {
  done(null, user.id);
});

koaPassport.deserializeUser(async (id, done) => {
  const user = await usuarios.obtenerPorId(id);
  done(null, user);
});
