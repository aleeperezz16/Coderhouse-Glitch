export default {
  secret: process.env.SECRET || 'Secretito',
  secretAge: process.env.SECRET_AGE || 60000,
  jwtSecret: process.env.JWT_SECRET || 'JwtSecreto',
};
