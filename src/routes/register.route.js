import Router from 'koa-router';
import bcrypt from 'bcrypt';
import controllers from '../controllers';

const { usuarios } = controllers;
const router = new Router({
  prefix: '/register',
});

router.post('/', async (ctx) => {
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
      status: 'El email ingresado ya existe',
    };

    return;
  }

  const passwordHash = await bcrypt.hash(password, 10);
  usuarios.guardar({
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
