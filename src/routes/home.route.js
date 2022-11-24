import Router from 'koa-router';
import bcrypt from 'bcrypt';
import koaPassport from 'koa-passport';
import jwt from 'jsonwebtoken';
import controllers from '../controllers';
import { authLogin } from '../middlewares';
import { auth } from '../config';

const { usuarios } = controllers;
const router = new Router();

router.get('/', async (ctx) => {
  ctx.status = 200;
  if (ctx.isAuthenticated()) {
    const { nombre, email, telefono } = ctx.state.user;
    ctx.body = {
      nombre, email, telefono,
    };
  } else {
    ctx.body = {
      status: 'No iniciaste sesión',
    };
  }
});

router.post('/api/login', async (ctx) => {
  const { username, password } = ctx.request.body;

  if (username !== 'admin' || password !== 'admin') {
    ctx.status = 401;
    ctx.body = {
      status: 'Credenciales incorrectas',
    };

    return;
  }

  const token = jwt.sign({ username }, auth.jwtSecret, { expiresIn: '1h' });

  ctx.status = 200;
  ctx.body = {
    status: 'Iniciaste sesión como administrador',
    token,
  };
});

router.post('/login', authLogin, koaPassport.authenticate('local'), async (ctx) => {
  ctx.status = 200;
  ctx.body = {
    status: 'Iniciaste sesión correctamente',
  };
});

router.post('/register', async (ctx) => {
  const {
    nombre, telefono, email, password, verificarPassword,
  } = ctx.request.body;

  if (password !== verificarPassword) {
    ctx.status = 400;
    ctx.body = {
      status: 'Las contraseñas no coinciden',
    };

    return;
  }

  const usuario = await usuarios.obtener(email);

  if (usuario) {
    ctx.status = 400;
    ctx.body = {
      status: 'El email solicitado ya existe',
    };

    return;
  }

  const passwordHash = await bcrypt.hash(password, 10);
  await usuarios.guardar({
    email,
    password: passwordHash,
    nombre,
    telefono,
  });

  ctx.status = 200;
  ctx.body = {
    status: 'Fuiste registrado correctamente',
  };
});

export default router;
