import jwt from 'async-jsonwebtoken';
import { auth as authCfg } from '../config';

export async function authLogin(ctx, next) {
  if (ctx.isAuthenticated()) {
    ctx.status = 200;
    ctx.body = {
      status: 'Ya iniciaste sesión',
    };
  } else {
    await next();
  }
}

export async function auth(ctx, next) {
  if (!ctx.isAuthenticated()) {
    ctx.status = 401;
    ctx.body = {
      status: 'No iniciaste sesión',
    };
  } else {
    await next();
  }
}

export async function authJwt(ctx, next) {
  const headers = ctx.headers.authorization;
  if (!headers) {
    ctx.status = 401;
    ctx.body = {
      status: 'No tenés permisos para realizar esta petición',
    };

    return;
  }

  const token = headers.split(' ')[1];

  const [, err] = await jwt.verify(token, authCfg.jwtSecret);

  if (err) {
    ctx.status = 401;
    ctx.body = {
      status: 'No tenés permisos para realizar esta petición',
    };
  } else {
    await next();
  }
}
