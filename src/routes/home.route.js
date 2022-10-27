import { Router } from 'express';

const home = Router();
const auth = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return res.status(200).json({ status: 'Debés iniciar sesión para ver tus datos de usuario' });
  }

  return next();
};

home.get('/', auth, (req, res) => {
  const {
    email, nombre, direccion, telefono, edad,
  } = req.user;
  res.status(200).json({
    email, nombre, direccion, telefono, edad,
  });
});

export default home;
