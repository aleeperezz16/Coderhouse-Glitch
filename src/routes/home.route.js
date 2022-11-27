import Router from 'koa-router';
import bcrypt from 'bcrypt';
import koaPassport from 'koa-passport';
import jwt from 'jsonwebtoken';
import controllers from '../controllers';
import transporter from '../utils/mailer.util';
import calcularPrecio from '../utils/ordenes.util';
import { authLogin, auth as authUser } from '../middlewares';
import { auth, mail } from '../config';

const { usuarios, carrito, ordenes } = controllers;
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

router.post('/orden', authUser, async (ctx) => {
  const { email } = ctx.state.user.email;
  const productos = carrito.obtener(email);
  const nroOrden = ordenes.obtenerNroOrden();

  const prodHtml = productos.map((elem) => `<li>${elem.nombre} x ${elem.cantidad}</li>\n`);
  const precioTotal = calcularPrecio(productos);

  const mensaje = {
    from: `<${mail.mail}>`,
    to: `<${email}>`,
    subject: `Orden de compra #${nroOrden}`,
    html:
    `<ul>
      ${prodHtml}
    </ul>
    <span>Total: ${precioTotal}</span>`,
  };

  await transporter.sendMail(mensaje);
  await carrito.eliminarPorEmail(email);

  ctx.status = 200;
  ctx.body = {
    status: 'Orden creada exitosamente',
  };
});

export default router;
