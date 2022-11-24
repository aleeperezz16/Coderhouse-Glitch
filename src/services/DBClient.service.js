export default class DBClient {
  static async connect() {
    throw new Error('Método "connect" no implementado en subclase');
  }

  static async disconnect() {
    throw new Error('Método "disconnect" no implementado en subclase');
  }
}
