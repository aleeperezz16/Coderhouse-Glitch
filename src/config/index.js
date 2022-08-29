const mongo = {
  uri: process.env.MONGO_DB_URI,
  dbName: process.env.MONGO_DB_NAME
};

const archivo = {
  directorio: "./src/db/archivos"
};

const secret = process.env.SESSION_SECRET;

export { mongo, archivo, secret };
