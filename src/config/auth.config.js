export default {
  secret: process.env.SECRET || 'Secretito',
  secretAge: process.env.SECRET_AGE || 600000,
  jwtSecret: process.env.JWT_SECRET || 'JwtSecreto',
};
