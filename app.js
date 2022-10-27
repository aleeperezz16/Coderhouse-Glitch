import express from 'express';
import './src/utils/passport';
import logj4s from 'log4js';
import cluster from 'cluster';
import { cpus } from 'os';
import * as routers from './src/routes';
import { config } from './src/utils';

logj4s.configure({
  appenders: {
    consola: { type: 'console' },
    logs: {
      type: 'multiFile',
      base: './logs/',
      property: 'categoryName',
      extension: '.log',
    },
  },
  categories: {
    default: { appenders: ['consola'], level: 'all' },
    app: { appenders: ['consola', 'logs'], level: 'info' },
  },
});

const app = express();
const useCluster = false;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/productos', routers.productosApi);
app.use('/api/carrito', routers.carritoApi);
app.use('/register', routers.register);
app.use('/login', routers.login);
app.use('/logout', routers.logout);
app.use('/pedido', routers.pedido);
app.use('/', routers.home);
app.use((req, res) => {
  res.status(404).json({
    error: -2,
    descripcion: `Ruta '${req.url}' método '${req.method}' no implementado`,
  });
  logj4s.getLogger('app').error('Ruta %s método %s no implementado', req.url, req.method);
});

const PORT = config.srv.port;

if (useCluster && cluster.isPrimary) {
  logj4s.getLogger().trace('Iniciando cluster');
  const numCpus = cpus().length;

  for (let i = 0; i < numCpus; i += 1) cluster.fork();

  cluster.on('exit', (worker) => {
    logj4s.getLogger().info('Worker %d finalizado', worker.process.pid);
    cluster.fork();
  });
} else {
  app.listen(PORT, () => {
    if (useCluster) {
      logj4s.getLogger('app').info('Servidor corriendo en puerto %s - PID: %d', PORT, process.pid);
    } else {
      logj4s.getLogger('app').info('Servidor corriendo en puerto %s', PORT);
    }
  });
}
